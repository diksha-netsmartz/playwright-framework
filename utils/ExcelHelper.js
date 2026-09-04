import fs from 'fs';
import zlib from 'zlib';
import { test, expect } from '@playwright/test';

/**
 * Utility class for reading and validating Excel / tabular exported files.
 * Supports:
 *  - XLSX files (OpenXML / ZIP format with Deflate compression, Central Directory & Local Headers, Windows & Unix path slashes)
 *  - HTML-based XLS files
 *  - CSV / plain text exports
 */
export default class ExcelHelper {

    /**
     * Reads and parses all text content from an Excel file (XLSX, HTML XLS, CSV).
     * @param {import('@playwright/test').Download|string} downloadOrPath - Playwright Download instance or file path.
     * @returns {Promise<string>} Plain text content contained within the spreadsheet.
     */
    static async readContent(downloadOrPath) {
        if (!downloadOrPath) return '';

        try {
            const filePath = typeof downloadOrPath === 'string'
                ? downloadOrPath
                : await downloadOrPath.path();

            if (!filePath || !fs.existsSync(filePath)) return '';

            const buffer = fs.readFileSync(filePath);

            // Check if file is a ZIP archive (XLSX format starts with 'PK\x03\x04')
            if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
                return this.extractTextFromXlsxBuffer(buffer);
            }

            // Otherwise, treat as UTF-8 / HTML / CSV text
            return buffer.toString('utf8');
        } catch (error) {
            console.log(`[ExcelHelper] Error reading file content: ${error.message}`);
            return '';
        }
    }

    /**
     * Reads and parses the spreadsheet into an array of rows (each row is an array of cell string values).
     * @param {import('@playwright/test').Download|string} downloadOrPath - Playwright Download instance or file path.
     * @returns {Promise<string[][]>} Array of rows with cell string values.
     */
    static async readRows(downloadOrPath) {
        if (!downloadOrPath) return [];

        try {
            const filePath = typeof downloadOrPath === 'string'
                ? downloadOrPath
                : await downloadOrPath.path();

            if (!filePath || !fs.existsSync(filePath)) return [];

            const buffer = fs.readFileSync(filePath);

            // Check if file is a ZIP archive (XLSX format starts with 'PK\x03\x04')
            if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
                return this.extractRowsFromXlsxBuffer(buffer);
            }

            // If HTML-based XLS table
            const text = buffer.toString('utf8');
            if (text.includes('<tr')) {
                return this.extractRowsFromHtmlTable(text);
            }

            // If CSV or line-delimited
            return text.split(/\r?\n/).map(line => line.split(',').map(c => c.trim()));
        } catch (error) {
            console.log(`[ExcelHelper] Error reading rows from file: ${error.message}`);
            return [];
        }
    }

    /**
     * Comprehensive verification of the Student Data Export report:
     * - Validates presence of Data Field columns (e.g. Student Name -> First Name & Last Name)
     * - Validates presence of Student records (matching First Name and Last Name in same row)
     * - Generates and attaches text comparison tables to test reports
     * - Attaches downloaded Excel file
     * - Asserts that no expected data fields or student names are missing
     * 
     * @param {import('@playwright/test').Download|string} download - Playwright Download instance or file path.
     * @param {Object} options - Configuration options.
     * @param {string[]} [options.dataFields] - List of expected data field columns.
     * @param {string[]} [options.studentNames] - List of expected student names from UI.
     * @param {string} [options.fileName] - Suggested file name.
     */
    static async verifyStudentDataExportReport(download, options = {}) {
        const content = await this.readContent(download);
        expect(content.length, 'Downloaded Excel file should not be empty').toBeGreaterThan(0);

        const rows = await this.readRows(download);
        console.log(`[ExcelHelper] Parsed ${rows.length} rows from Excel spreadsheet.`);

        // Auto-detect header row index (in case there is a report title above headers)
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(5, rows.length); i++) {
            if (rows[i].some(c => c.toLowerCase().trim() === 'first name') || rows[i].some(c => c.toLowerCase().trim() === 'last name')) {
                headerRowIndex = i;
                break;
            }
        }

        const headerRow = rows[headerRowIndex] || [];
        const firstNameColIdx = headerRow.findIndex(h => h.toLowerCase().trim() === 'first name');
        const lastNameColIdx = headerRow.findIndex(h => h.toLowerCase().trim() === 'last name');
        const dataRows = rows.slice(headerRowIndex + 1);

        console.log(`[ExcelHelper] Headers (Row ${headerRowIndex + 1}) -> "First Name": col ${firstNameColIdx}, "Last Name": col ${lastNameColIdx}. Data rows: ${dataRows.length}`);

        const actualColumns = headerRow.filter(c => c && c.trim().length > 0);
        const actualStudents = dataRows.map((r, i) => {
            const fn = firstNameColIdx !== -1 ? (r[firstNameColIdx] || '').trim() : '';
            const ln = lastNameColIdx !== -1 ? (r[lastNameColIdx] || '').trim() : '';
            const display = ln && fn ? `${ln}, ${fn}` : (fn || ln || r.join(' | '));
            return { rowIndex: i + 1, firstName: fn, lastName: ln, display };
        });

        const fieldsToVerify = options.dataFields || [];
        const studentsToVerify = options.studentNames || [];

        const missingFields = [];
        const missingStudents = [];

        // 1. Verify Data Field Columns
        if (fieldsToVerify.length > 0) {
            await test.step(`Verify data field columns in Excel (${fieldsToVerify.length} total)`, async () => {
                const matchedFields = [];

                for (const field of fieldsToVerify) {
                    const normalized = field.trim().toLowerCase();

                    // If expected data field is "Student Name", Excel has separate "First Name" and "Last Name" columns
                    if (normalized === 'student name' || normalized === 'student names' || normalized === 'studentname') {
                        const hasFirstName = content.includes('First Name') || headerRow.some(c => c.toLowerCase().includes('first name'));
                        const hasLastName = content.includes('Last Name') || headerRow.some(c => c.toLowerCase().includes('last name'));

                        if (hasFirstName && hasLastName) {
                            matchedFields.push(`${field} -> (First Name & Last Name)`);
                        } else {
                            const missingCols = [];
                            if (!hasFirstName) missingCols.push('First Name');
                            if (!hasLastName) missingCols.push('Last Name');
                            missingFields.push(`${field} (Missing: ${missingCols.join(', ')})`);
                        }
                    } else if (content.includes(field) || headerRow.some(c => c.toLowerCase().trim() === normalized || c.toLowerCase().includes(normalized))) {
                        matchedFields.push(field);
                    } else {
                        missingFields.push(field);
                    }
                }

                const fieldsReport = [
                    `==================================================`,
                    `               DATA FIELDS COMPARISON             `,
                    `==================================================`,
                    `Total Expected Data Fields: ${fieldsToVerify.length}`,
                    ``,
                    `--- [EXPECTED DATA FIELDS (from UI checklist)] ---`,
                    ...fieldsToVerify.map((f, i) => `  ${String(i + 1).padStart(2, ' ')}. ${f}`),
                    ``,
                    `--- [ACTUAL DATA FIELDS (Excel Column Headers)] ---`,
                    ...actualColumns.map((c, i) => `  ${String(i + 1).padStart(2, ' ')}. ${c}`),
                    ``,
                    `--- [VERIFICATION SUMMARY] ---`,
                    `Matched Fields (${matchedFields.length}/${fieldsToVerify.length}):`,
                    ...matchedFields.map(f => `  ✅ ${f}`),
                    ``,
                    `Missing Fields (${missingFields.length}/${fieldsToVerify.length}):`,
                    ...(missingFields.length > 0 ? missingFields.map(f => `  ❌ ${f}`) : ['  None (All matched)']),
                    `==================================================`
                ].join('\n');

                console.log(fieldsReport);

                await test.info().attach('Data_Fields_Comparison.txt', {
                    body: fieldsReport,
                    contentType: 'text/plain'
                });

                if (missingFields.length > 0) {
                    test.info().annotations.push({
                        type: 'warning',
                        description: `Missing data field columns in Excel: ${missingFields.join(', ')}`
                    });
                }
            });
        }

        // 2. Verify Student First Name and Last Name exist in the same row
        if (studentsToVerify.length > 0) {
            await test.step(`Verify student First Name and Last Name exist in same row (${studentsToVerify.length} total)`, async () => {
                const matchedStudents = [];

                for (const student of studentsToVerify) {
                    // UI format is "LastName, FirstName" (e.g. '111, 11', 'gellar, monica', '3333, studentttttttttttt')
                    let lastName = '';
                    let firstName = '';

                    if (student.includes(',')) {
                        const split = student.split(',').map(s => s.trim());
                        lastName = split[0];
                        firstName = split.slice(1).join(' ').trim();
                    } else {
                        const split = student.trim().split(/\s+/);
                        firstName = split[0];
                        lastName = split.slice(1).join(' ').trim();
                    }

                    // Search across all data rows for matching First Name and Last Name
                    const matchedRow = dataRows.find(row => {
                        if (firstNameColIdx !== -1 && lastNameColIdx !== -1) {
                            const rowFirst = (row[firstNameColIdx] || '').toLowerCase().trim();
                            const rowLast = (row[lastNameColIdx] || '').toLowerCase().trim();

                            const firstMatches = rowFirst === firstName.toLowerCase() || rowFirst.includes(firstName.toLowerCase()) || firstName.toLowerCase().includes(rowFirst);
                            const lastMatches = rowLast === lastName.toLowerCase() || rowLast.includes(lastName.toLowerCase()) || lastName.toLowerCase().includes(rowLast);

                            if (firstMatches && lastMatches) return true;
                        }

                        // Check reverse columns (in case some rows are swapped)
                        if (firstNameColIdx !== -1 && lastNameColIdx !== -1) {
                            const rowFirst = (row[firstNameColIdx] || '').toLowerCase().trim();
                            const rowLast = (row[lastNameColIdx] || '').toLowerCase().trim();

                            const firstMatches = rowFirst === lastName.toLowerCase() || rowFirst.includes(lastName.toLowerCase());
                            const lastMatches = rowLast === firstName.toLowerCase() || rowLast.includes(firstName.toLowerCase());

                            if (firstMatches && lastMatches) return true;
                        }

                        // Fallback: row contains both firstName and lastName
                        const hasFirst = row.some(c => c.toLowerCase().trim() === firstName.toLowerCase() || c.toLowerCase().includes(firstName.toLowerCase()));
                        const hasLast = row.some(c => c.toLowerCase().trim() === lastName.toLowerCase() || c.toLowerCase().includes(lastName.toLowerCase()));
                        return hasFirst && hasLast;
                    });

                    if (matchedRow) {
                        matchedStudents.push({
                            student,
                            firstName,
                            lastName,
                            matchedRow: matchedRow.join(' | ')
                        });
                    } else {
                        // Check if present anywhere in the entire text content as fallback
                        if (content.toLowerCase().includes(firstName.toLowerCase()) && content.toLowerCase().includes(lastName.toLowerCase())) {
                            matchedStudents.push({
                                student,
                                firstName,
                                lastName,
                                matchedRow: `Found (First Name: "${firstName}", Last Name: "${lastName}")`
                            });
                        } else {
                            missingStudents.push({
                                student,
                                firstName,
                                lastName
                            });
                        }
                    }
                }

                const studentsReport = [
                    `==================================================`,
                    `              STUDENT NAMES COMPARISON            `,
                    `==================================================`,
                    `Total Expected Students: ${studentsToVerify.length}`,
                    ``,
                    `--- [EXPECTED STUDENT NAMES (from UI checklist)] ---`,
                    ...studentsToVerify.map((s, i) => `  ${String(i + 1).padStart(2, ' ')}. ${s}`),
                    ``,
                    `--- [ACTUAL STUDENT NAMES (Excel Rows)] ---`,
                    ...actualStudents.map((s, i) => `  ${String(i + 1).padStart(2, ' ')}. Row ${s.rowIndex}: First Name="${s.firstName}", Last Name="${s.lastName}" (${s.display})`),
                    ``,
                    `--- [VERIFICATION SUMMARY] ---`,
                    `Matched Students (${matchedStudents.length}/${studentsToVerify.length}):`,
                    ...matchedStudents.map(s => `  ✅ "${s.student}" -> Row: [${s.matchedRow}]`),
                    ``,
                    `Missing Students (${missingStudents.length}/${studentsToVerify.length}):`,
                    ...(missingStudents.length > 0 ? missingStudents.map(s => `  ❌ "${s.student}" (First Name: "${s.firstName}", Last Name: "${s.lastName}")`) : ['  None (All matched)']),
                    `==================================================`
                ].join('\n');

                console.log(studentsReport);

                await test.info().attach('Student_Names_Comparison.txt', {
                    body: studentsReport,
                    contentType: 'text/plain'
                });

                if (missingStudents.length > 0) {
                    test.info().annotations.push({
                        type: 'warning',
                        description: `Missing student rows in Excel: ${missingStudents.map(s => s.student).join(', ')}`
                    });
                }
            });
        }

        // Attach downloaded Excel file
        try {
            const fileName = options.fileName || (typeof download !== 'string' && typeof download?.suggestedFilename === 'function' ? download.suggestedFilename() : 'ExportReport.xlsx');
            const filePath = typeof download === 'string' ? download : await download.path();
            if (filePath) {
                await test.info().attach(fileName, {
                    path: filePath,
                    contentType: fileName.endsWith('.xlsx') ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/vnd.ms-excel'
                });
                console.log(`[ExcelHelper] Attached "${fileName}" to test report.`);
            }
        } catch (e) {
            console.log('[ExcelHelper] Error attaching Excel file to report:', e.message);
        }

        // 3. Final Assertion: Fail test if any expected items are missing
        const failureErrors = [];
        if (missingFields.length > 0) {
            failureErrors.push(`Missing Data Fields (${missingFields.length}): ${missingFields.join(', ')}`);
        }
        if (missingStudents.length > 0) {
            failureErrors.push(`Missing Students (${missingStudents.length}): ${missingStudents.map(s => s.student).join(', ')}`);
        }

        if (failureErrors.length > 0) {
            expect(failureErrors, `Excel verification failed - missing expected items:\n${failureErrors.join('\n')}`).toHaveLength(0);
        }
    }

    /**
     * Extracts all worksheet names from an Excel file (XLSX, HTML XLS).
     * @param {import('@playwright/test').Download|string} downloadOrPath - Playwright Download instance or file path.
     * @returns {Promise<string[]>} Array of sheet names.
     */
    static async getSheetNames(downloadOrPath) {
        if (!downloadOrPath) return [];

        try {
            const filePath = typeof downloadOrPath === 'string'
                ? downloadOrPath
                : await downloadOrPath.path();

            if (!filePath || !fs.existsSync(filePath)) return [];

            const buffer = fs.readFileSync(filePath);

            // If XLSX (ZIP format)
            if (buffer.length >= 4 && buffer[0] === 0x50 && buffer[1] === 0x4B && buffer[2] === 0x03 && buffer[3] === 0x04) {
                const entries = this.extractZipEntries(buffer);
                const workbookXmlKey = Object.keys(entries).find(k => k.toLowerCase().endsWith('workbook.xml'));
                if (workbookXmlKey && entries[workbookXmlKey]) {
                    const workbookXml = entries[workbookXmlKey];
                    const sheetNames = [];
                    const sheetRegex = /<(?:[a-zA-Z0-9_]+:)?sheet\b[^>]*\bname="([^"]+)"/gi;
                    let match;
                    while ((match = sheetRegex.exec(workbookXml)) !== null) {
                        sheetNames.push(this.decodeXml(match[1]).trim());
                    }
                    if (sheetNames.length > 0) return sheetNames;
                }

                // Fallback: check docProps/app.xml for sheet names
                const appXmlKey = Object.keys(entries).find(k => k.toLowerCase().endsWith('app.xml'));
                if (appXmlKey && entries[appXmlKey]) {
                    const appXml = entries[appXmlKey];
                    const appSheetNames = [];
                    const lpstrRegex = /<(?:[a-zA-Z0-9_]+:)?lpstr>([^<]+)<\/(?:[a-zA-Z0-9_]+:)?lpstr>/gi;
                    let match;
                    while ((match = lpstrRegex.exec(appXml)) !== null) {
                        const val = this.decodeXml(match[1]).trim();
                        if (val && !val.includes('!') && val !== 'Worksheets' && val !== 'Named Ranges') {
                            appSheetNames.push(val);
                        }
                    }
                    if (appSheetNames.length > 0) return appSheetNames;
                }
            }

            // If HTML XLS format
            const text = buffer.toString('utf8');
            const htmlSheetNames = [];
            const wsNameRegex = /<x:Name>([^<]+)<\/x:Name>|<x:WorksheetName>([^<]+)<\/x:WorksheetName>/gi;
            let match;
            while ((match = wsNameRegex.exec(text)) !== null) {
                const name = match[1] || match[2];
                if (name) htmlSheetNames.push(this.decodeXml(name).trim());
            }
            if (htmlSheetNames.length > 0) return htmlSheetNames;

            return [];
        } catch (error) {
            console.log(`[ExcelHelper] Error getting sheet names: ${error.message}`);
            return [];
        }
    }

    /**
     * Verifies that the exported Excel file contains all expected column headers and optional sheet name,
     * logs a comparison table, attaches the summary & Excel file to test reports,
     * and asserts that no expected items are missing.
     * 
     * @param {import('@playwright/test').Download|string} download - Playwright Download instance or file path.
     * @param {string[]} expectedColumns - List of expected column header names.
     * @param {Object} [options] - Additional options.
     * @param {string} [options.fileName] - Suggested file name.
     * @param {string} [options.expectedSheetName] - Expected worksheet name inside the Excel file.
     */
    static async verifyExcelColumns(download, expectedColumns = [], options = {}) {
        const content = await this.readContent(download);
        expect(content.length, 'Downloaded Excel file should not be empty').toBeGreaterThan(0);

        const rows = await this.readRows(download);
        const fileName = options.fileName || (typeof download !== 'string' && typeof download?.suggestedFilename === 'function' ? download.suggestedFilename() : 'Report.xlsx');
        const expectedSheetName = options.expectedSheetName || '';

        // Auto-detect header row index
        let headerRowIndex = 0;
        for (let i = 0; i < Math.min(5, rows.length); i++) {
            const row = rows[i] || [];
            if (expectedColumns.some(col => row.some(cell => cell.toLowerCase().trim() === col.toLowerCase().trim() || cell.toLowerCase().includes(col.toLowerCase().trim())))) {
                headerRowIndex = i;
                break;
            }
        }

        const headerRow = rows[headerRowIndex] || [];
        const actualColumns = headerRow.filter(c => c && c.trim().length > 0);

        const matchedColumns = [];
        const missingColumns = [];

        const normalizedContent = content.toLowerCase();

        for (const col of expectedColumns) {
            const normalizedCol = col.trim().toLowerCase();
            const foundInHeader = headerRow.some(c => c.toLowerCase().trim() === normalizedCol || c.toLowerCase().includes(normalizedCol));
            const foundInContent = normalizedContent.includes(normalizedCol);

            if (foundInHeader || foundInContent) {
                matchedColumns.push(col);
            } else {
                // If multi-word, check if all significant words exist
                const words = normalizedCol.split(/\s+/).filter(w => w.length > 1 && !['#', '-'].includes(w));
                const allWordsPresent = words.length > 0 && words.every(w => normalizedContent.includes(w));
                if (allWordsPresent) {
                    matchedColumns.push(col);
                } else {
                    missingColumns.push(col);
                }
            }
        }

        // Verify sheet name if requested
        const actualSheetNames = await this.getSheetNames(download);
        let sheetMatched = true;
        let sheetStatusMessage = '';

        if (expectedSheetName) {
            sheetMatched = actualSheetNames.some(s => s.toLowerCase() === expectedSheetName.toLowerCase() || s.toLowerCase().includes(expectedSheetName.toLowerCase()))
                || normalizedContent.includes(expectedSheetName.toLowerCase());

            sheetStatusMessage = sheetMatched
                ? `✅ Sheet Name Matched: "${expectedSheetName}" (Found in workbook: [${actualSheetNames.join(', ')}])`
                : `❌ Sheet Name Missing: "${expectedSheetName}" (Actual sheets in workbook: [${actualSheetNames.join(', ')}])`;
        }

        const totalChecked = expectedColumns.length;
        const columnsReport = [
            `================================================================================`,
            `                       EXCEL COLUMNS VERIFICATION REPORT                        `,
            `================================================================================`,
            `File Name: ${fileName}`,
            ...(expectedSheetName ? [`Worksheet Verification: ${sheetStatusMessage}`, ``] : []),
            `Total Expected Columns Checked: ${totalChecked}`,
            ``,
            `--- [SUMMARY] ---`,
            `✅ Matched Columns : ${matchedColumns.length} / ${totalChecked}`,
            `❌ Missing Columns : ${missingColumns.length} / ${totalChecked}`,
            ...(expectedSheetName ? [`Sheet Name Matched : ${sheetMatched ? '✅ Yes' : '❌ No'}`] : []),
            ``,
            `--- [VERIFIED / MATCHED COLUMNS IN EXCEL] ---`,
            ...matchedColumns.map((col, idx) => `  ${String(idx + 1).padStart(2, ' ')}. ✅ ${col}`),
            ``,
            `--- [MISSING COLUMNS IN EXCEL] ---`,
            ...(missingColumns.length > 0
                ? missingColumns.map((col, idx) => `  ${String(idx + 1).padStart(2, ' ')}. ❌ ${col}`)
                : ['  None (All expected columns were found in the Excel file!)']),
            ``,
            `================================================================================`
        ].join('\n');

        console.log(columnsReport);

        // Attach summary report to Allure and Playwright HTML reports
        await test.info().attach('Excel Columns Verification Summary.txt', {
            body: columnsReport,
            contentType: 'text/plain'
        });

        // Attach Excel file
        try {
            const filePath = typeof download === 'string' ? download : await download.path();
            if (filePath) {
                await test.info().attach(fileName, {
                    path: filePath,
                    contentType: fileName.endsWith('.xlsx') ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/vnd.ms-excel'
                });
                console.log(`[ExcelHelper] Attached "${fileName}" to test report.`);
            }
        } catch (e) {
            console.log('[ExcelHelper] Error attaching Excel file to report:', e.message);
        }

        if (missingColumns.length > 0) {
            expect(missingColumns, `Excel columns verification failed! Missing column(s):\n${missingColumns.join('\n')}`).toHaveLength(0);
        }

        if (expectedSheetName && !sheetMatched) {
            expect(sheetMatched, `Excel sheet name verification failed! Expected sheet "${expectedSheetName}" but found [${actualSheetNames.join(', ')}]`).toBeTruthy();
        }
    }

    /**
     * Decodes common XML entities to plain text characters.
     * @param {string} str - Raw XML string.
     * @returns {string} Decoded string.
     */
    static decodeXml(str) {
        if (!str) return '';
        return str
            .replace(/&amp;/g, '&')
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>')
            .replace(/&quot;/g, '"')
            .replace(/&apos;/g, "'")
            .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));
    }

    /**
     * Converts Excel column letter (e.g. 'A', 'B', 'Z', 'AA') to 0-based column index.
     * @param {string} colStr - Column letter.
     * @returns {number} 0-based index (A -> 0, B -> 1, AA -> 26).
     */
    static colLetterToIndex(colStr) {
        if (!colStr) return 0;
        let idx = 0;
        const upper = colStr.toUpperCase();
        for (let i = 0; i < upper.length; i++) {
            idx = idx * 26 + (upper.charCodeAt(i) - 64);
        }
        return Math.max(0, idx - 1);
    }

    /**
     * Parses raw files inside XLSX ZIP buffer using Central Directory and Local Headers.
     * Handles both Windows backslashes and Unix forward slashes.
     * @param {Buffer} buffer - Raw XLSX ZIP buffer.
     * @returns {Record<string, string>} Map of extracted normalized file path to UTF-8 XML string.
     */
    static extractZipEntries(buffer) {
        /** @type {Record<string, string>} */
        const entries = {};

        // 1. Try Central Directory first (most accurate for streamed / standard ZIPs)
        try {
            let eocdOffset = -1;
            for (let i = buffer.length - 22; i >= 0; i--) {
                if (buffer[i] === 0x50 && buffer[i + 1] === 0x4b && buffer[i + 2] === 0x05 && buffer[i + 3] === 0x06) {
                    eocdOffset = i;
                    break;
                }
            }

            if (eocdOffset !== -1) {
                const totalEntries = buffer.readUInt16LE(eocdOffset + 10);
                let cdPos = buffer.readUInt32LE(eocdOffset + 16);

                for (let i = 0; i < totalEntries && cdPos < buffer.length - 46; i++) {
                    if (buffer[cdPos] === 0x50 && buffer[cdPos + 1] === 0x4b && buffer[cdPos + 2] === 0x01 && buffer[cdPos + 3] === 0x02) {
                        const compressionMethod = buffer.readUInt16LE(cdPos + 10);
                        const compressedSize = buffer.readUInt32LE(cdPos + 20);
                        const fileNameLen = buffer.readUInt16LE(cdPos + 28);
                        const extraLen = buffer.readUInt16LE(cdPos + 30);
                        const commentLen = buffer.readUInt16LE(cdPos + 32);
                        const localHeaderOffset = buffer.readUInt32LE(cdPos + 42);

                        const rawFileName = buffer.toString('utf8', cdPos + 46, cdPos + 46 + fileNameLen);
                        const normalizedName = rawFileName.replace(/\\/g, '/');

                        if (localHeaderOffset < buffer.length - 30) {
                            const localFileNameLen = buffer.readUInt16LE(localHeaderOffset + 26);
                            const localExtraLen = buffer.readUInt16LE(localHeaderOffset + 28);
                            const dataStart = localHeaderOffset + 30 + localFileNameLen + localExtraLen;
                            const dataEnd = dataStart + compressedSize;

                            if (dataEnd <= buffer.length) {
                                const fileData = buffer.subarray(dataStart, dataEnd);
                                try {
                                    let xmlContent = '';
                                    if (compressionMethod === 8) {
                                        xmlContent = zlib.inflateRawSync(fileData).toString('utf8');
                                    } else if (compressionMethod === 0) {
                                        xmlContent = fileData.toString('utf8');
                                    }
                                    if (xmlContent) {
                                        entries[normalizedName] = xmlContent;
                                        entries[normalizedName.toLowerCase()] = xmlContent;
                                    }
                                } catch (err) {
                                    console.log(`[ExcelHelper] Error decompressing ${rawFileName}: ${err.message}`);
                                }
                            }
                        }

                        cdPos += 46 + fileNameLen + extraLen + commentLen;
                    } else {
                        break;
                    }
                }
            }
        } catch (e) {
            console.log(`[ExcelHelper] Central Directory parse failed: ${e.message}`);
        }

        // 2. Fallback: Scan Local Headers if Central Directory found nothing
        if (Object.keys(entries).length === 0) {
            let offset = 0;
            while (offset < buffer.length - 30) {
                if (buffer[offset] === 0x50 && buffer[offset + 1] === 0x4b && buffer[offset + 2] === 0x03 && buffer[offset + 3] === 0x04) {
                    const compressionMethod = buffer.readUInt16LE(offset + 8);
                    const compressedSize = buffer.readUInt32LE(offset + 18);
                    const fileNameLen = buffer.readUInt16LE(offset + 26);
                    const extraFieldLen = buffer.readUInt16LE(offset + 28);

                    const rawFileName = buffer.toString('utf8', offset + 30, offset + 30 + fileNameLen);
                    const normalizedName = rawFileName.replace(/\\/g, '/');
                    const dataStart = offset + 30 + fileNameLen + extraFieldLen;
                    const dataEnd = dataStart + compressedSize;

                    if (compressedSize > 0 && dataEnd <= buffer.length) {
                        const fileData = buffer.subarray(dataStart, dataEnd);
                        try {
                            let xmlContent = '';
                            if (compressionMethod === 8) {
                                xmlContent = zlib.inflateRawSync(fileData).toString('utf8');
                            } else if (compressionMethod === 0) {
                                xmlContent = fileData.toString('utf8');
                            }
                            if (xmlContent) {
                                entries[normalizedName] = xmlContent;
                                entries[normalizedName.toLowerCase()] = xmlContent;
                            }
                        } catch (err) {
                            console.log(`[ExcelHelper] Local header decompress error: ${err.message}`);
                        }
                        offset = dataEnd;
                    } else {
                        offset += 30 + fileNameLen + extraFieldLen;
                    }
                } else {
                    offset++;
                }
            }
        }

        return entries;
    }

    /**
     * Parses XLSX (ZIP) buffer to extract structured rows.
     * @param {Buffer} buffer - Raw file buffer.
     * @returns {string[][]} 2D array of rows and cell values.
     */
    static extractRowsFromXlsxBuffer(buffer) {
        const entries = this.extractZipEntries(buffer);

        // 1. Parse Shared Strings
        const sharedStrings = [];
        const sharedStringsKey = Object.keys(entries).find(k => k.toLowerCase().includes('sharedstrings'));
        const sharedStringsXml = sharedStringsKey ? entries[sharedStringsKey] : '';

        if (sharedStringsXml) {
            const siRegex = /<(?:[a-zA-Z0-9_]+:)?si\b[^>]*>([\s\S]*?)<\/(?:[a-zA-Z0-9_]+:)?si>/gi;
            let siMatch;
            while ((siMatch = siRegex.exec(sharedStringsXml)) !== null) {
                const siContent = siMatch[1];
                const tRegex = /<(?:[a-zA-Z0-9_]+:)?t\b[^>]*>([\s\S]*?)<\/(?:[a-zA-Z0-9_]+:)?t>/gi;
                let tMatch;
                let text = '';
                while ((tMatch = tRegex.exec(siContent)) !== null) {
                    text += tMatch[1];
                }
                sharedStrings.push(this.decodeXml(text).trim());
            }
        }

        // 2. Find primary worksheet XML
        const sheetEntryKey = Object.keys(entries).find(k => {
            const lower = k.toLowerCase();
            return (lower.includes('worksheets/sheet') || lower.includes('worksheets/')) && lower.endsWith('.xml');
        }) || Object.keys(entries).find(k => k.toLowerCase().includes('sheet') && k.toLowerCase().endsWith('.xml'));

        const sheetXml = sheetEntryKey ? entries[sheetEntryKey] : '';

        if (!sheetXml) {
            console.log(`[ExcelHelper] No worksheet XML found. Available entries:`, Object.keys(entries));
            return [];
        }

        // 3. Parse Rows and Cells
        const rows = [];
        const rowRegex = /<(?:[a-zA-Z0-9_]+:)?row\b([^>]*)>([\s\S]*?)<\/(?:[a-zA-Z0-9_]+:)?row>/gi;
        let rowMatch;

        while ((rowMatch = rowRegex.exec(sheetXml)) !== null) {
            const rowContent = rowMatch[2];
            const cells = [];
            const cellRegex = /<(?:[a-zA-Z0-9_]+:)?c\b([^>]*)>([\s\S]*?)<\/(?:[a-zA-Z0-9_]+:)?c>|<(?:[a-zA-Z0-9_]+:)?c\b([^>]*)\/>/gi;
            let cellMatch;

            while ((cellMatch = cellRegex.exec(rowContent)) !== null) {
                const attributes = cellMatch[1] || cellMatch[3] || '';
                const cellContent = cellMatch[2] || '';

                // Extract column letter e.g. r="A1", r="B2"
                const rMatch = /r="([A-Za-z]+)\d+"/i.exec(attributes);
                const colIdx = rMatch ? this.colLetterToIndex(rMatch[1]) : cells.length;

                const isSharedString = /t="s"/i.test(attributes);
                const isInlineString = /t="inlineStr"/i.test(attributes);

                let value = '';

                if (isSharedString) {
                    const vMatch = /<(?:[a-zA-Z0-9_]+:)?v>(\d+)<\/(?:[a-zA-Z0-9_]+:)?v>/i.exec(cellContent);
                    if (vMatch) {
                        const idx = parseInt(vMatch[1], 10);
                        value = sharedStrings[idx] !== undefined ? sharedStrings[idx] : '';
                    }
                } else if (isInlineString || cellContent.includes('<is>') || cellContent.includes(':is>')) {
                    const tMatch = /<(?:[a-zA-Z0-9_]+:)?t[^>]*>([\s\S]*?)<\/(?:[a-zA-Z0-9_]+:)?t>/i.exec(cellContent);
                    if (tMatch) {
                        value = this.decodeXml(tMatch[1]);
                    }
                } else {
                    const vMatch = /<(?:[a-zA-Z0-9_]+:)?v>([\s\S]*?)<\/(?:[a-zA-Z0-9_]+:)?v>/i.exec(cellContent);
                    if (vMatch) {
                        value = this.decodeXml(vMatch[1]);
                    } else {
                        const tMatch = /<(?:[a-zA-Z0-9_]+:)?t[^>]*>([\s\S]*?)<\/(?:[a-zA-Z0-9_]+:)?t>/i.exec(cellContent);
                        if (tMatch) {
                            value = this.decodeXml(tMatch[1]);
                        }
                    }
                }

                // Place value at exact column index
                cells[colIdx] = value.trim();
            }

            // Fill undefined gaps with empty string
            for (let i = 0; i < cells.length; i++) {
                if (cells[i] === undefined) {
                    cells[i] = '';
                }
            }

            if (cells.length > 0 && cells.some(c => c.length > 0)) {
                rows.push(cells);
            }
        }

        console.log(`[ExcelHelper] Successfully parsed ${rows.length} rows from worksheet XML.`);
        return rows;
    }

    /**
     * Extracts rows from an HTML table formatted spreadsheet.
     * @param {string} html - HTML string.
     * @returns {string[][]} Extracted rows.
     */
    static extractRowsFromHtmlTable(html) {
        const rows = [];
        const trRegex = /<tr[^>]*>([\s\S]*?)<\/tr>/gi;
        let trMatch;

        while ((trMatch = trRegex.exec(html)) !== null) {
            const trContent = trMatch[1];
            const cells = [];
            const tdRegex = /<(?:td|th)[^>]*>([\s\S]*?)<\/(?:td|th)>/gi;
            let tdMatch;

            while ((tdMatch = tdRegex.exec(trContent)) !== null) {
                const cellText = this.decodeXml(tdMatch[1].replace(/<[^>]+>/g, '')).trim();
                cells.push(cellText);
            }

            if (cells.length > 0) {
                rows.push(cells);
            }
        }

        return rows;
    }

    /**
     * Parses XLSX (ZIP) buffer to extract all combined plain text.
     * @param {Buffer} buffer - Raw file buffer.
     * @returns {string} Combined plain text of all strings in the workbook.
     */
    static extractTextFromXlsxBuffer(buffer) {
        const entries = this.extractZipEntries(buffer);
        const textParts = [];

        for (const [fileName, xmlContent] of Object.entries(entries)) {
            if (fileName.includes('worksheets') || fileName.includes('sharedstrings')) {
                const tagRegex = /<t[^>]*>([\s\S]*?)<\/t>/g;
                let match;
                while ((match = tagRegex.exec(xmlContent)) !== null) {
                    const decoded = this.decodeXml(match[1]).trim();
                    if (decoded) textParts.push(decoded);
                }
                textParts.push(this.decodeXml(xmlContent.replace(/<[^>]+>/g, ' ')));
            }
        }

        return textParts.join(' ');
    }
}
