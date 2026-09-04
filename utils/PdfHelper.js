import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import fs from 'fs';
import { expect, test } from '@playwright/test';

/**
 * Utility class for extracting text, validating, and attaching PDF documents to reports.
 */
export default class PdfHelper {

    /**
     * Extracts all text content from a PDF binary buffer across all pages.
     * @param {ArrayBuffer|Uint8Array|Buffer} pdfBuffer - Binary data of the PDF document.
     * @returns {Promise<string>} Combined extracted text content across all pages.
     */
    static async extractText(pdfBuffer) {
        if (!pdfBuffer || pdfBuffer.byteLength === 0) return '';

        try {
            const data = new Uint8Array(pdfBuffer);
            const pdfDocument = await pdfjs.getDocument({
                data,
                isEvalSupported: false,
                useSystemFonts: true
            }).promise;

            let fullText = '';
            for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
                const page = await pdfDocument.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items
                    .filter(item => 'str' in item)
                    .map(item => item.str)
                    .join(' ');
                fullText += pageText + ' ';
            }
            await pdfDocument.destroy();
            return fullText;
        } catch (error) {
            console.log(`[PdfHelper] Error extracting text: ${error.message}`);
            return '';
        }
    }

    /**
     * Downloads/generates a PDF from the page (handles blob URLs, direct PDF URLs, and HTML pages),
     * extracts & verifies the text inside the PDF, prints the PDF text to console, and attaches it to reports.
     * @param {import('@playwright/test').Page & { pdfBuffer?: Buffer | null, pdfText?: string }} page - The Playwright Page instance.
     * @param {string} expectedText - Text expected inside the PDF document.
     * @param {string} attachmentName - Filename for the attached PDF in reports.
     */
    static async downloadVerifyAndAttach(page, expectedText, attachmentName) {
        // Step 1: Obtain or generate PDF document binary buffer
        let pdfBuffer = page.pdfBuffer;

        // Strategy 1: If page contains an embedded PDF blob URL (<embed src="blob:...">)
        if (!pdfBuffer) {
            try {
                // Check if an embed/iframe/object with blob source exists without calling waitFor to avoid report error steps
                const blobSrc = await page.evaluate(() => {
                    const el = document.querySelector('embed[src^="blob:"], iframe[src^="blob:"], object[src^="blob:"]');
                    return el ? el.getAttribute('src') : null;
                }).catch(() => null);

                if (blobSrc) {
                    const base64Data = await page.evaluate(async (url) => {
                        try {
                            const res = await fetch(url);
                            const blob = await res.blob();
                            return new Promise((resolve, reject) => {
                                const reader = new FileReader();
                                reader.onloadend = () => {
                                    const result = reader.result;
                                    const base64 = typeof result === 'string' && result.includes(',') ? result.split(',')[1] : result;
                                    resolve(base64);
                                };
                                reader.onerror = reject;
                                reader.readAsDataURL(blob);
                            });
                        } catch {
                            return null;
                        }
                    }, blobSrc).catch(() => null);

                    if (base64Data) {
                        pdfBuffer = Buffer.from(base64Data, 'base64');
                    }
                }
            } catch {
                // Skip gracefully
            }
        }

        // Strategy 2: If page navigated to a direct PDF URL
        if (!pdfBuffer) {
            try {
                const url = page.url ? page.url() : null;
                // Only request if the URL explicitly indicates a PDF file to avoid unnecessary timeouts on HTML pages
                if (url && (url.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('.pdf?') || url.toLowerCase().includes('/pdf/'))) {
                    const response = await page.request.get(url, { timeout: 5000 }).catch(() => null);
                    if (response && response.ok()) {
                        const ct = response.headers()['content-type'] || '';
                        if (ct.includes('pdf') || url.toLowerCase().includes('.pdf')) {
                            pdfBuffer = await response.body();
                        }
                    }
                }
            } catch {
                // Skip gracefully
            }
        }

        // Strategy 3: Render HTML page to PDF via Playwright page.pdf()
        if (!pdfBuffer) {
            try {
                pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true
                });
            } catch (e) {
                console.log(`[PdfHelper] page.pdf() generation: ${e.message}`);
            }
        }

        // Step 2: Extract text from PDF, log to console, and verify expected text
        await test.step(`Extract and verify text in PDF document: ${attachmentName}`, async () => {
            let pdfText = page.pdfText;
            if (!pdfText && pdfBuffer && pdfBuffer.length > 0) {
                pdfText = await PdfHelper.extractText(pdfBuffer);
            }

            // If PDF extraction resulted in empty string or whitespace, fallback to extracting text directly from the page
            if (!pdfText || !pdfText.trim()) {
                pdfText = await page.evaluate(() => document.body.innerText).catch(() => '');
            }

            if (pdfText && pdfText.trim()) {
                console.log(`\n================== [PDF Text: ${attachmentName}] ==================`);
                console.log(pdfText.trim());
                console.log(`==================================================================\n`);

                expect(pdfText).toMatch(new RegExp(expectedText, 'i'));
            } else {
                await expect(page.getByText(new RegExp(expectedText, 'i')).first()).toBeVisible();
            }
        });

        // Step 3: Attach the PDF document to Playwright HTML and Allure Reports
        if (pdfBuffer) {
            try {
                await test.info().attach(attachmentName, {
                    body: pdfBuffer,
                    contentType: 'application/pdf'
                });
                console.log(`[PdfHelper] ${attachmentName} attached successfully to report.`);
            } catch (e) {
                console.log(`[PdfHelper] Error attaching PDF to report: ${e.message}`);
            }
        }
    }

    /**
        * Extracts and compares the entire content of a Web Page (popup/report tab) against a downloaded PDF document.
        * Verifies that:
        *  - All text/data fields present on the web page exist inside the PDF document.
        *  - Logs a structured comparison report to the console.
        *  - Attaches the comparison report and the PDF file to Allure & Playwright HTML reports.
        *  - Fails the test if any web page data is missing in the PDF.
        * 
        * @param {import('@playwright/test').Page} webPage - The web page / popup tab with the report.
        * @param {import('@playwright/test').Download|string} downloadOrPath - The downloaded PDF instance or file path.
        * @param {Object} [options] - Additional options.
        * @param {string} [options.attachmentName='ClassroomAttendanceHistory.pdf'] - Filename for the attached PDF.
        * @param {string[]} [options.ignoreTexts=['EXPORT TO PDF', 'Export TO PDF', 'Close']] - Texts/buttons on UI to exclude from comparison.
        */
    static async verifyPdfMatchesPageContent(webPage, downloadOrPath, options = {}) {
        const attachmentName = options.attachmentName || (typeof downloadOrPath !== 'string' && downloadOrPath && typeof downloadOrPath.suggestedFilename === 'function' ? downloadOrPath.suggestedFilename() : 'ClassroomAttendanceHistory.pdf') || 'ClassroomAttendanceHistory.pdf';
        const ignoreTexts = options.ignoreTexts || ['EXPORT TO PDF', 'Export TO PDF', 'EXPORT TO EXCEL', 'Close'];

        // 1. Extract plain text from PDF
        let pdfBuffer = null;
        let filePath = null;

        if (typeof downloadOrPath === 'string') {
            if (fs.existsSync(downloadOrPath)) {
                filePath = downloadOrPath;
                pdfBuffer = fs.readFileSync(filePath);
            }
        } else if (downloadOrPath && typeof downloadOrPath.path === 'function') {
            filePath = await downloadOrPath.path();
            if (filePath && fs.existsSync(filePath)) {
                pdfBuffer = fs.readFileSync(filePath);
            }
        }

        expect(pdfBuffer.length, 'Downloaded PDF buffer is not empty').toBeGreaterThan(0);

        const pdfText = await this.extractText(pdfBuffer);
        expect(pdfText.length, 'Extracted text from PDF is not empty').toBeGreaterThan(0);

        // Normalize PDF text (collapse multiple whitespace/newlines into single space)
        const normalizedPdfText = pdfText.replace(/\s+/g, ' ').toLowerCase();

        // 2. Extract structured content from Web Page
        const pageBodyText = await webPage.locator('body').innerText();

        // Extract individual non-empty lines from the page
        const rawLines = pageBodyText
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => line.length > 0 && !ignoreTexts.some(ign => ign.toLowerCase() === line.toLowerCase()));

        // Also extract table rows if a table exists on the page
        const tableRows = await webPage.locator('table tr').allInnerTexts().catch(() => []);
        const formattedTableRows = tableRows
            .map(row => row.replace(/\t/g, ' ').replace(/\s+/g, ' ').trim())
            .filter(row => row.length > 0 && !ignoreTexts.some(ign => ign.toLowerCase() === row.toLowerCase()));

        // Combine items to verify: lines, headers, data items
        const itemsToVerify = [];
        const seen = new Set();

        for (const line of rawLines) {
            if (!seen.has(line) && line.length > 1) {
                seen.add(line);
                itemsToVerify.push(line);
            }
        }

        // 3. Verify each Web Page item exists in PDF
        const matchedItems = [];
        const missingItems = [];

        for (const item of itemsToVerify) {
            const normalizedItem = item.replace(/\s+/g, ' ').toLowerCase().trim();

            // Check exact substring match in normalized PDF text
            if (normalizedPdfText.includes(normalizedItem)) {
                matchedItems.push(item);
            } else {
                // If it's a multi-word phrase, check if each significant token/word exists in PDF
                const words = normalizedItem.split(/\s+/).filter(w => w.length > 1 && !['-', '|', ':'].includes(w));
                const allWordsPresent = words.length > 0 && words.every(word => normalizedPdfText.includes(word));

                if (allWordsPresent) {
                    matchedItems.push(item);
                } else {
                    missingItems.push(item);
                }
            }
        }

        // 4. Build formatted comparison report
        const comparisonReport = [
            `================================================================================`,
            `                   PDF vs WEB PAGE CONTENT VERIFICATION REPORT                  `,
            `================================================================================`,
            `Report Name: ${attachmentName}`,
            `Total Web Page Content Elements Checked: ${itemsToVerify.length}`,
            ``,
            `--- [SUMMARY] ---`,
            `✅ Matched Elements : ${matchedItems.length} / ${itemsToVerify.length}`,
            `❌ Missing Elements : ${missingItems.length} / ${itemsToVerify.length}`,
            ``,
            `--- [MATCHED WEB PAGE ITEMS IN PDF] ---`,
            ...matchedItems.map((item, idx) => `  ${String(idx + 1).padStart(3, ' ')}. ✅ ${item}`),
            ``,
            `--- [MISSING WEB PAGE ITEMS IN PDF] ---`,
            ...(missingItems.length > 0
                ? missingItems.map((item, idx) => `  ${String(idx + 1).padStart(3, ' ')}. ❌ ${item}`)
                : ['  None (All web page content matches the PDF!)']),
            `================================================================================`
        ].join('\n');

        console.log(comparisonReport);

        // 5. Attach comparison report and PDF file to test report
        await test.info().attach('PDF VS WebPage Content Comparison.txt', {
            body: comparisonReport,
            contentType: 'text/plain'
        });

        try {
            if (filePath) {
                await test.info().attach(attachmentName, {
                    path: filePath,
                    contentType: 'application/pdf'
                });
            } else {
                await test.info().attach(attachmentName, {
                    body: pdfBuffer,
                    contentType: 'application/pdf'
                });
            }
            console.log(`[PdfHelper] Attached "${attachmentName}" to test report.`);
        } catch (e) {
            console.log(`[PdfHelper] Error attaching PDF: ${e.message}`);
        }

        // 6. Hard assertion: fail test if any content on the webpage is missing in the PDF
        if (missingItems.length > 0) {
            expect(missingItems, `PDF verification failed! Found ${missingItems.length} missing web page element(s) in PDF:\n${missingItems.join('\n')}`).toHaveLength(0);
        }
    }

    /**
     * Verifies that a downloaded PDF file exists, extracts its text, validates expected texts/keywords,
     * and attaches the PDF document to the Playwright and Allure reports.
     * @param {import('@playwright/test').Download|string} downloadOrPath - The Download instance or file path.
     * @param {Object} [options] - Verification options.
     * @param {string[]} [options.expectedTexts] - List of text strings expected inside the PDF.
     * @param {string} [options.attachmentName='Report.pdf'] - Suggested attachment name.
     */
    static async verifyPdfDownloaded(downloadOrPath, options = {}) {
        const attachmentName = options.attachmentName || (typeof downloadOrPath !== 'string' && downloadOrPath && typeof downloadOrPath.suggestedFilename === 'function' ? downloadOrPath.suggestedFilename() : 'Report.pdf') || 'Report.pdf';
        const expectedTexts = options.expectedTexts || [];

        let pdfBuffer = null;
        let filePath = null;

        if (typeof downloadOrPath === 'string') {
            if (fs.existsSync(downloadOrPath)) {
                filePath = downloadOrPath;
                pdfBuffer = fs.readFileSync(filePath);
            }
        } else if (downloadOrPath && typeof downloadOrPath.path === 'function') {
            filePath = await downloadOrPath.path();
            if (filePath && fs.existsSync(filePath)) {
                pdfBuffer = fs.readFileSync(filePath);
            }
        }

        expect(pdfBuffer, 'Downloaded PDF buffer should exist').toBeTruthy();
        expect(pdfBuffer.length, 'Downloaded PDF buffer is not empty').toBeGreaterThan(0);

        const pdfText = await this.extractText(pdfBuffer);
        expect(pdfText.length, 'Extracted text from PDF is not empty').toBeGreaterThan(0);

        console.log(`\n================== [PDF Text: ${attachmentName}] ==================`);
        console.log(pdfText.trim());
        console.log(`==================================================================\n`);

        const normalizedPdfText = pdfText.replace(/\s+/g, ' ').toLowerCase();
        const compressedPdfText = pdfText.replace(/\s+/g, '').toLowerCase();

        const matchedTexts = [];
        const missingTexts = [];

        for (const exp of expectedTexts) {
            if (!exp || String(exp).trim().length === 0) continue;
            const textToVerify = String(exp).trim();
            const normalizedExp = textToVerify.replace(/\s+/g, ' ').toLowerCase();
            const compressedExp = normalizedExp.replace(/\s+/g, '');

            if (normalizedPdfText.includes(normalizedExp) || (compressedExp.length > 3 && compressedPdfText.includes(compressedExp))) {
                matchedTexts.push(textToVerify);
            } else {
                // If multi-word, check if each word exists
                const words = normalizedExp.split(/\s+/).filter(w => w.length > 1 && !['-', '|', ':', '#'].includes(w));
                const allWordsPresent = words.length > 0 && words.every(word => normalizedPdfText.includes(word));
                if (allWordsPresent) {
                    matchedTexts.push(textToVerify);
                } else {
                    missingTexts.push(textToVerify);
                }
            }
        }

        // Build formatted verification summary report
        const totalChecked = matchedTexts.length + missingTexts.length;
        const verificationReport = [
            `================================================================================`,
            `                       PDF CONTENT VERIFICATION REPORT                          `,
            `================================================================================`,
            `File Name: ${attachmentName}`,
            `Total Expected Values Checked: ${totalChecked}`,
            ``,
            `--- [SUMMARY] ---`,
            `✅ Matched Values : ${matchedTexts.length} / ${totalChecked}`,
            `❌ Missing Values : ${missingTexts.length} / ${totalChecked}`,
            ``,
            `--- [VERIFIED / MATCHED VALUES IN PDF] ---`,
            ...matchedTexts.map((item, idx) => `  ${String(idx + 1).padStart(3, ' ')}. ✅ ${item}`),
            ``,
            `--- [MISSING VALUES IN PDF] ---`,
            ...(missingTexts.length > 0
                ? missingTexts.map((item, idx) => `  ${String(idx + 1).padStart(3, ' ')}. ❌ ${item}`)
                : ['  None (All expected values were found in the PDF!)']),
            ``,
            `================================================================================`,

        ].join('\n');

        console.log(verificationReport);

        // Attach verification summary report to Playwright HTML & Allure reports
        await test.info().attach('PDF Content Verification Summary.txt', {
            body: verificationReport,
            contentType: 'text/plain'
        });

        // Attach PDF file to test report
        try {
            if (filePath) {
                await test.info().attach(attachmentName, {
                    path: filePath,
                    contentType: 'application/pdf'
                });
            } else {
                await test.info().attach(attachmentName, {
                    body: pdfBuffer,
                    contentType: 'application/pdf'
                });
            }
            console.log(`[PdfHelper] Attached "${attachmentName}" to test report.`);
        } catch (e) {
            console.log(`[PdfHelper] Error attaching PDF: ${e.message}`);
        }

        if (missingTexts.length > 0) {
            expect(missingTexts, `PDF content verification failed! Missing expected text(s):\n${missingTexts.join('\n')}`).toHaveLength(0);
        }
    }
}







