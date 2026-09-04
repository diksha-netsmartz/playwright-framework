import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';
import ExcelHelper from '../../../utils/ExcelHelper';
import PdfHelper from '../../../utils/PdfHelper';
import DateHelper from '../../../utils/DateHelper';

/**
 * Page Object representing the Business Reports page in Report Center (Admin Portal).
 * Handles searching/selecting business reports, configuring date filters,
 * selecting student records & data fields, and exporting report files.
 **/
export default class BusinessReportsPage extends BasePage {

    /**
     * Initializes locators for Business Reports Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);
        this.selectedSessionText = '';

        // Report Selection
        this.searchReportInput = page.getByPlaceholder('Search');
        this.reportHeading = page.locator('#lblSelectedReportName');

        // Filter Controls
        this.dateActivatedRadio = page.locator("//input[@id='rbDateActivated']//following-sibling::span");
        this.dateSearchDropdown = page.locator('#drpDateSearchSDER');
        this.startDateInput = page.locator('#startDatePicker input');
        this.endDateInput = page.locator('#endDatePicker input');
        this.dateRangeInput = page.locator('#txtStudentcreationdaterange');
        this.filterStudentsBtn = page.getByRole('link', { name: 'Filter Students' });

        // Data Field Controls
        this.selectAllDataFieldsCheckbox = page.locator("//input[@id='chkSelectStudentDataFields']//following-sibling::span");
        this.dataFieldLabels = page.locator("//input[@id='chkStudentDataField']//parent::label");

        // Student Selection Controls
        this.selectAllStudentsCheckbox = page.locator("//input[@id='chkFilteredStudentList']//following-sibling::span");
        this.studentNameLabels = page.locator("//input[@id='chkStudentName']//parent::label");

        // Export Button
        this.exportIntoExcelBtn = page.locator("//a[contains(text(),'Export') and contains(text(),'Excel')]");
        this.exportIntoExcelButton = page.getByRole('link', { name: 'Export Into Excel' });
        this.processingMessage = page.getByText('Please wait we are processing the data');


        // Classroom Attendance History Report Locators
        this.studentSearchInput = page.getByRole('textbox', { name: 'Enter at least two characters.' });
        this.showCrAttendanceHistoryBtn = page.getByRole('link', { name: 'Show CR Attendance History' });

        // Attendance Signatures/Scores Report Locators
        this.crSearchInput = page.getByRole('textbox', { name: 'Enter CR#' });
        this.multiSessionDropdown = page.locator('#ddlLMSMultiSession');
        this.attendanceSignaturesScoresPdfBtn = page.getByRole('link', { name: 'Attendance Signatures/Scores PDF' });

        // Classroom Absences Report Locators
        this.classroomAbsencesStartDateInput = page.locator('#startDatePicker_reportClassroomAbsences input');
        this.classroomAbsencesEndDateInput = page.locator('#endDatePicker_reportClassroomAbsences input');

        // Attendance Sheet Report Locators
        this.attendanceSheetCrSearchInput = page.getByRole('textbox', { name: 'Class Number Search' });
        this.showScoreCheckbox = page.locator("//input[@id='chkShowScore']//following-sibling::span");
        this.attendanceSheetDownloadBtn = page.getByRole('link', { name: 'Download' });

        // Student Info Report Locators
        this.studentInfoReportBtn = page.getByRole('link', { name: 'Student Information' });
        this.studentInfoBtwStatusDropdownBtn = page.getByRole('link', { name: 'Select BTW Status' });
        this.studentInfoSelectAllBtwStatusCheckbox = page.locator("//label[contains(text(),'Select All')]//span");

        // BTW Data Export Report Locators
        this.btwAppointmentDateInput = page.locator('#txtAppointmentDate');
        this.btwSelectDataFieldsBtn = page.getByRole('link', { name: 'Select Data Fields' });
        this.btwSelectAllDataFieldsCheckbox = page.locator("//input[@id='chkSelectColDataFields']//following-sibling::span");

        // Vehicle Hours Report Locators
        this.vehicleHoursStartDateInput = page.locator('#txtStartDate');
        this.vehicleHoursEndDateInput = page.locator('#txtEndDate');
        this.vehicleHoursDisplayBtn = page.getByRole('link', { name: 'Display' });
        this.vehicleHoursModal = page.locator('#ModalVehicleHoursReport');
        this.vehicleHoursModalHeader = page.locator('#divheader');

        // In-Car Evaluation Data Report Locators
        this.inCarEvalStartDateInput = page.locator('#startDatePicker_reportEvaluationsReport input');
        this.inCarEvalEndDateInput = page.locator('#endDatePicker_reportEvaluationsReport input');
        this.inCarEvalExportExcelBtn = page.getByRole('link', { name: 'Export As Excel' });

        // Student Event Logs Report Locators
        this.studentEventLogsSearchInput = page.getByRole('textbox', { name: 'Enter Student Name' });

        // High School Report Locators
        this.highSchoolDateCreatedRadio = page.locator("//input[@id='rbDateCreated']//following-sibling::span");
        this.highSchoolDateRangeInput = page.locator('#txtDateRange');
        this.highSchoolDropdownBtn = page.locator("//select[@id='ddlHighSchool']//ancestor::div[1]//button");
        this.highSchoolSelectAllLink = page.locator("//select[@id='ddlHighSchool']//ancestor::div[1]//label[text()=' Select All']");
        this.highSchoolDisplayBtn = page.getByRole('link', { name: 'Display' });
        this.highSchoolModal = page.locator('#tbodyHighReport');
        this.highSchoolStudentStatusText = page.getByText('Student Status : Activated');

        // Filter Management Locators (BTW / SDER reports)
        this.saveAsNewFilterBtn = page.getByRole('button', { name: 'Save as New Filter' });
        this.filterNameInput = page.getByRole('textbox', { name: 'Filter Name' });
        this.filterStatusDropdownBtn = page.getByRole('button', { name: 'Filter Status' });
        this.filterStatusActiveOption = page.locator("//span[text()='Active']");
        this.whoCanSeeFilterOnlyMeRadio = page.locator("//label[normalize-space()='Only Me']");
        this.saveFilterBtn = page.locator("//button[contains(@onclick,'saveFilter()')]");
        this.closeFilterModalBtn = page.locator("//h4[contains(text(),' Save as Filter')]//ancestor::div[contains(@class,'modal-content')]//button[contains(text(),'Close') and not(@aria-hidden)]");
        this.editFilterBtn = page.getByRole('button', { name: 'Edit Filter' });
        // this.deleteFilterIcon = page.locator("//strong[text()='www']//ancestor::tr[1]//a[contains(@class,'Delete')]");
        this.deleteConfirmationYesBtn = page.locator("//a[@data-apply='confirmation' and text()='Yes']");

        // Stored Values
        this.selectedStudentNames = [];
        this.selectedDataFields = [];
    }


    /**
     * Returns locator for a delete filter icon by filter name.
     * @param {string} filterName - Name of the filter.
     * @returns {import('@playwright/test').Locator}
     **/
    deleteFilterIcon(filterName) {
        return this.page.locator(
            `xpath=//strong[text()='${filterName}']//ancestor::tr[1]//a[contains(@class,'Delete')]`
        );
    }

    /**
     * Searches for a report by name and clicks to open it.
     * @param {string} reportName - The name of the report to open (e.g. 'Student Data Export').
     **/
    async searchAndSelectReport(reportName) {
        await test.step(`Search and select report: "${reportName}"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.searchReportInput);
            await this.fill(this.searchReportInput, reportName);
            await this.page.waitForTimeout(500);

            const reportLink = this.page.getByRole('link', { name: reportName });
            await this.waitForVisible(reportLink);
            await this.click(reportLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 });
            await this.verifyContainsText(this.reportHeading, reportName);
            await this.waitForLoaders();
            await this.page.waitForTimeout(8000);
        });
    }

    /**
     * Clicks on the 'Date Activated' radio button.
     **/
    async selectDateActivated() {
        await test.step('Select "Date Activated" radio button', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.dateActivatedRadio);
            await this.click(this.dateActivatedRadio);
            await this.waitForLoaders();
        });
    }

    /**
     * Enters the selected month date range into the date range textbox.
     * @param {'current' | 'previous' | 'currentMonth' | 'prevMonth' | string} [monthType='prevMonth'] - Which month range to use ('currentMonth', 'prevMonth', or custom string).
     **/
    async selectDateRange(monthType) {
        let rangeObj;
        const normalized = String(monthType).toLowerCase();

        if (normalized.includes('prev')) {
            rangeObj = DateHelper.getPreviousMonthDateRange();
        } else if (normalized.includes('curr')) {
            rangeObj = DateHelper.getCurrentMonthDateRange();
        } else {
            rangeObj = { formattedRange: monthType };
        }

        const { formattedRange } = rangeObj;

        await test.step(`Enter date range (${monthType}): "${formattedRange}" in date range textbox`, async () => {
            await this.waitForVisible(this.dateRangeInput);
            await this.clear(this.dateRangeInput);
            await this.pressSequentially(this.dateRangeInput, formattedRange);
            await this.waitForLoaders();
            await this.dateRangeInput.press('Enter');
        });
    }

    /**
     * Enters current month date range (e.g. 08/01/2026 - 08/31/2026).
     **/
    async selectCurrentMonthDateRange() {
        await this.selectDateRange('currentMonth');
    }

    /**
     * Enters previous month date range (e.g. 07/01/2026 - 07/31/2026).
     **/
    async selectPreviousMonthDateRange() {
        await this.selectDateRange('prevMonth');
    }

    /**
     * Clicks on the 'Filter Students' button and waits for results to load.
     **/
    async clickFilterStudents() {
        await test.step('Click "Filter Students" button', async () => {
            await this.waitForVisible(this.filterStudentsBtn);
            await this.click(this.filterStudentsBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 });
        });
    }

    /**
     * Checks the Select All checkbox under Select Students and captures all trimmed student names.
     * @returns {Promise<string[]>} Array of trimmed student names.
     **/
    async selectAllStudents() {
        return await test.step('Check Select All checkbox under Select Students and capture student names', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.selectAllStudentsCheckbox);
            await this.click(this.selectAllStudentsCheckbox);
            await this.waitForLoaders();

            const rawNames = await this.studentNameLabels.allInnerTexts();
            this.selectedStudentNames = rawNames.map(text => text.trim()).filter(text => text.length > 0);
            console.log(`Captured ${this.selectedStudentNames.length} student names:`, this.selectedStudentNames);
            return this.selectedStudentNames;
        });
    }

    /**
     * Checks the Select All checkbox under Select Data Fields and captures all trimmed data field names.
     * @returns {Promise<string[]>} Array of trimmed data field column names.
     **/
    async selectAllDataFields() {
        return await test.step('Check Select All checkbox under Select Data Fields and capture data fields', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.selectAllDataFieldsCheckbox);
            await this.click(this.selectAllDataFieldsCheckbox);
            await this.waitForLoaders();

            const rawFields = await this.dataFieldLabels.allInnerTexts();
            this.selectedDataFields = rawFields.map(text => text.trim()).filter(text => text.length > 0);
            console.log(`Captured ${this.selectedDataFields.length} data fields:`, this.selectedDataFields);
            return this.selectedDataFields;
        });
    }

    /**
     * Clicks the Export Into Excel button, waits for file download,
     * and waits until the 'Please wait we are processing the data' message is hidden.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async clickExportIntoExcel() {
        return await test.step('Click "Export Into Excel" and wait for file download & processing to complete', async () => {
            const downloadPromise = this.page.waitForEvent('download');
            await this.waitForVisible(this.exportIntoExcelBtn);
            await this.click(this.exportIntoExcelBtn);
            const download = await downloadPromise;

            // Wait until 'Please wait we are processing the data' message is hidden
            if (await this.processingMessage.isVisible().catch(() => false)) {
                await this.waitForHidden(this.processingMessage, 60000);
            }
            await this.waitForLoaders();
            return download;
        });
    }

    /**
     * Verifies that the Excel report file was downloaded successfully,
     * verifies that all selected data field columns and student names exist in the Excel content,
     * and attaches the file to the test report.
     * @param {import('@playwright/test').Download} download - The Playwright Download instance.
     * @param {Object} [options] - Optional custom data fields or student names to verify.
     * @param {string[]} [options.dataFields] - Expected data field columns.
     * @param {string[]} [options.studentNames] - Expected student names.
     **/
    async verifyExcelDownloaded(download, options = {}) {
        await test.step('Verify Excel file downloaded successfully and contains expected columns and student names', async () => {
            expect(download).toBeTruthy();
            const fileName = download.suggestedFilename();
            console.log(`Downloaded file name: ${fileName}`);
            expect(fileName).toMatch(/\.xlsx?$/i);

            const fieldsToVerify = options.dataFields || this.selectedDataFields || [];
            const studentsToVerify = options.studentNames || this.selectedStudentNames || [];

            // Delegate student data export report validation, comparison reports, and assertions to ExcelHelper
            await ExcelHelper.verifyStudentDataExportReport(download, {
                dataFields: fieldsToVerify,
                studentNames: studentsToVerify,
                fileName
            });
        });
    }

    /**
     * Searches for a student in the autocomplete field and selects them from the dropdown list.
     * @param {string} studentName - Student's name to search and select.
     **/
    async searchAndSelectStudent(studentName) {
        await test.step(`Search and select student: "${studentName}"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentSearchInput);
            await this.pressSequentially(this.studentSearchInput, studentName);
            await this.page.waitForTimeout(1000);
            await this.waitForLoaders();

            const option = this.page.getByRole('option', { name: new RegExp(studentName, 'i') })
                .or(this.page.locator('.ui-autocomplete li a, .ui-menu-item a').filter({ hasText: studentName }))
                .first();

            await this.waitForVisible(option);
            await this.click(option);
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks 'Show CR Attendance History' button and returns the newly opened popup report page.
     * @returns {Promise<import('@playwright/test').Page>} The popup Page instance.
     **/
    async clickShowCrAttendanceHistory() {
        return await test.step('Click "Show CR Attendance History" and open report in new tab', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.showCrAttendanceHistoryBtn);

            const popupPromise = this.page.waitForEvent('popup');
            await this.click(this.showCrAttendanceHistoryBtn);
            const reportPage = await popupPromise;
            await reportPage.waitForLoadState('load');
            await this.waitForLoaders();
            return reportPage;
        });
    }

    /**
     * In the opened Attendance History report popup, verifies the heading and clicks 'EXPORT TO PDF'.
     * @param {import('@playwright/test').Page} reportPage - The popup Page instance.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async exportAttendanceHistoryToPdf(reportPage) {
        return await test.step('Verify Student Attendance History heading and click Export to PDF', async () => {
            const heading = reportPage.getByRole('heading', { name: /Student Attendance History/i });
            // await expect(heading, 'Expected "Student Attendance History" heading to be visible in report popup').toBeVisible({ timeout: 15000 });
            await this.waitForVisible(heading);
            await this.verifyVisible(heading);

            const exportPdfBtn = reportPage.getByRole('button', { name: 'Export TO PDF' })
            // await expect(, 'Expected "Export TO PDF" button to be visible').toBeVisible({ timeout: 15000 });
            await this.waitForVisible(exportPdfBtn);
            await this.verifyVisible(exportPdfBtn);

            const downloadPromise = reportPage.waitForEvent('download');
            await this.click(exportPdfBtn);
            const download = await downloadPromise;
            return download;
        });
    }

    /**
     * Verifies that the Classroom Attendance History PDF downloaded successfully,
     * verifies that its content matches the web page opened in the new tab,
     * and attaches the comparison report & PDF to the test report.
     * @param {import('@playwright/test').Download} download - The Playwright Download instance.
     * @param {import('@playwright/test').Page} [reportPage] - The popup Page instance opened in new tab.
     * @param {string} [expectedStudentName] - Expected student name.
     **/
    async verifyAttendanceHistoryPdf(download, reportPage, expectedStudentName) {
        await test.step('Verify Attendance History PDF content matches the report page and attach to report', async () => {
            await PdfHelper.verifyPdfMatchesPageContent(reportPage, download, {
                attachmentName: 'ClassroomAttendanceHistory.pdf'
            });

        });
    }

    /**
     * Searches for a Classroom (CR) in the autocomplete textbox and selects it from the dropdown list.
     * @param {string} crName - Classroom name to search and select (e.g. 'automationCR').
     **/
    async searchAndSelectCR(crName) {
        await test.step(`Search and select CR: "${crName}"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.crSearchInput);
            await this.clear(this.crSearchInput);
            await this.pressSequentially(this.crSearchInput, crName);
            await this.page.waitForTimeout(1000);
            await this.waitForLoaders();

            const option = this.page.getByRole('option', { name: new RegExp(crName, 'i') })
                .or(this.page.locator('.ui-autocomplete li a, .ui-menu-item a').filter({ hasText: crName }))
                .first();

            await this.waitForVisible(option);
            await this.click(option);
            await this.waitForLoaders();
        });
    }

    /**
     * Selects a session option from the Multi Session dropdown.
     **/
    async selectMultiSession() {
        await test.step(`Select multi-session`, async () => {
            await this.waitForLoaders();
            await this.selectOption(this.multiSessionDropdown, { value: '1' });
            this.selectedSessionText = await this.multiSessionDropdown.evaluate((/** @type {HTMLSelectElement} */ el) => el.options[el.selectedIndex]?.text?.trim());
            console.log(`Selected Session: "${this.selectedSessionText}"`);
            await this.waitForLoaders();

        });
    }

    /**
     * Clicks 'Attendance Signatures/Scores PDF' button, waits for the file download,
     * and verifies that the success notification banner is displayed.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async downloadAttendanceSignaturesScoresPdf() {
        return await test.step('Click "Attendance Signatures/Scores PDF" and wait for file download', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.attendanceSignaturesScoresPdfBtn);

            const downloadPromise = this.page.waitForEvent('download');
            await this.click(this.attendanceSignaturesScoresPdfBtn);
            const download = await downloadPromise;
            await this.waitForVisible(this.page.getByText('File downloaded succesfully.'));
            await this.verifyVisible(this.page.getByText('File downloaded succesfully.', { exact: true }));

            return download;
        });
    }

    /**
     * Verifies the downloaded Attendance Signatures/Scores PDF:
     * - Validates file download exists and has .pdf extension
     * - Verifies title "Attendance Signatures and Test Scores", CR number, and column headers inside the PDF
     * - Attaches the PDF to Playwright HTML and Allure reports
     * @param {import('@playwright/test').Download|string} download - The Playwright Download instance or path.
     * @param {string} [crName='automationCR'] - Expected CR name in the PDF.
     **/
    async verifyAttendanceSignaturesScoresPdf(download, crName = 'automationCR') {
        await test.step('Verify Attendance Signatures/Scores PDF content and attach to report', async () => {
            expect(download).toBeTruthy();
            const fileName = typeof download !== 'string' && typeof download?.suggestedFilename === 'function' ? download.suggestedFilename() : 'AttendanceSignaturesScoresReport.pdf';
            console.log(`Downloaded PDF file name: ${fileName}`);
            expect(fileName).toMatch(/\.pdf$/i);

            await PdfHelper.verifyPdfDownloaded(download, {
                attachmentName: fileName || 'AttendanceSignaturesScoresReport.pdf',
                expectedTexts: [
                    'Attendance Signatures and Test Scores',
                    'CR#',
                    crName,
                    'Date/Time',
                    'Session#',
                    `${this.selectedSessionText}`,
                    'Teacher',
                    'Student Name',
                    'Score',
                    'Student Notes',
                    'Attendance Notes',
                    'Student Signature'
                ]
            });
        });
    }

    /**
     * Helper to select a date via Bootstrap datepicker popup.
     * @param {import('@playwright/test').Locator} inputLocator - The date input field locator.
     * @param {string} targetMonthYear - Target Month & Year (e.g. 'January 2026', 'December 2026').
     * @param {string|number} targetDay - Day of the month to select (e.g. '1', '31').
     * @param {'prev'|'next'} direction - Direction to navigate ('prev' or 'next').
     */
    async selectDateFromCalendar(inputLocator, targetMonthYear, targetDay, direction = 'prev') {
        await this.waitForVisible(inputLocator);
        await inputLocator.click();
        await this.page.waitForTimeout(300);

        const datepicker = this.page.locator('.datepicker:visible').first();
        await this.waitForVisible(datepicker);

        const monthSwitch = this.page.locator('.datepicker-switch').first();
        const navBtn = direction === 'prev' ? this.page.locator('th.prev').first() : this.page.locator('th.next').first();

        // Loop until current month/year matches targetMonthYear
        let maxAttempts = 24;
        while (maxAttempts > 0) {
            const currentMonthYear = (await monthSwitch.innerText()).trim();
            if (currentMonthYear.toLowerCase() === targetMonthYear.toLowerCase()) {
                break;
            }
            await navBtn.click();
            await this.page.waitForTimeout(150);
            maxAttempts--;
        }

        // Select the specific day in the current month view (exclude previous/next month overflow days)
        const dayCell = this.page.locator('td.day:not(.old):not(.new)').filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
        await dayCell.click();


        await this.waitForLoaders();
    }

    /**
     * Enters Start Date (Jan 1) and End Date (Dec 31) for Classroom Absences Report based on year type.
     * @param {'currentYear'|'prevYear'|'current'|'previous'|number|string} [yearType='currentYear'] - 'currentYear' (default) or 'prevYear'.
     **/
    async enterClassroomAbsencesDateRange(yearType) {
        const now = new Date();
        let targetYear = now.getFullYear();

        const normalized = String(yearType).toLowerCase();
        if (normalized.includes('prev')) {
            targetYear = targetYear - 1;
        } else if (!isNaN(Number(yearType)) && String(yearType).length === 4) {
            targetYear = Number(yearType);
        }

        const startMonthYear = `January ${targetYear}`;
        const startDay = '1';
        const endMonthYear = `December ${targetYear}`;
        const endDay = '31';

        await test.step(`Select date range for Classroom Absences (${yearType}): "01/01/${targetYear}" to "12/31/${targetYear}"`, async () => {
            await this.waitForLoaders();

            // Select Start Date: navigate back to January of targetYear and pick 1
            await this.selectDateFromCalendar(this.classroomAbsencesStartDateInput, startMonthYear, startDay, 'prev');

            // Select End Date: navigate forward to December of targetYear and pick 31
            await this.selectDateFromCalendar(this.classroomAbsencesEndDateInput, endMonthYear, endDay, 'next');
        });
    }

    /**
     * Clicks 'Export Into Excel' for Classroom Absences Report and waits for file download.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async exportClassroomAbsencesToExcel() {
        return await test.step('Click "Export Into Excel" and wait for file download', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.exportIntoExcelButton);

            const downloadPromise = this.page.waitForEvent('download');
            await this.click(this.exportIntoExcelButton);
            const download = await downloadPromise;
            await this.waitForLoaders();
            return download;
        });
    }

    /**
     * Verifies that the Classroom Absences Excel report downloaded successfully,
     * validates all expected column headers in the Excel file,
     * and attaches the summary report & Excel file to Playwright and Allure reports.
     * @param {import('@playwright/test').Download|string} download - The Playwright Download instance.
     * @param {string[]} [customColumns] - Optional custom columns to verify.
     **/
    async verifyClassroomAbsencesExcelDownloaded(download, customColumns) {
        await test.step('Verify Classroom Absences Excel file downloaded successfully and contains expected columns', async () => {
            expect(download).toBeTruthy();
            const fileName = typeof download !== 'string' && typeof download?.suggestedFilename === 'function' ? download.suggestedFilename() : 'ClassroomAbsencesReport.xlsx';
            console.log(`Downloaded Excel file name: ${fileName}`);
            expect(fileName).toMatch(/\.xlsx?$/i);

            const expectedColumns = customColumns || [
                'Student Name',
                'Student Status',
                'Product',
                'CR Number',
                '1st Absence Session #',
                '1st Absence Session Notes',
                '2nd Absence Session #',
                '2nd Absence Session Notes',
                '3rd Absence Session #',
                '3rd Absence Session Notes',
                '4th Absence Session #',
                '4th Absence Session Notes',
                '5th Absence Session #',
                '5th Absence Session Notes',
                '6th Absence Session #',
                '6th Absence Session Notes',
                '7th Absence Session #',
                '7th Absence Session Notes',
                '8th Absence Session #',
                '8th Absence Session Notes',
                '9th Absence Session #',
                '9th Absence Session Notes',
                '10th Absence Session #'
            ];

            await ExcelHelper.verifyExcelColumns(download, expectedColumns, {
                fileName,
                expectedSheetName: 'Classroom Absences'
            });
        });
    }

    /**
     * Searches for a Classroom (CR) for Attendance Sheet report and selects it from the autocomplete list.
     * @param {string} crName - Classroom name (e.g. 'automationCR').
     **/
    async searchAndSelectAttendanceSheetCR(crName) {
        await test.step(`Search and select CR for Attendance Sheet: "${crName}"`, async () => {
            await this.waitForLoaders();
            await this.page.waitForTimeout(5000)
            await this.waitForVisible(this.attendanceSheetCrSearchInput);
            // await this.clear(this.attendanceSheetCrSearchInput);
            await this.pressSequentially(this.attendanceSheetCrSearchInput, crName);
            await this.page.waitForTimeout(1000);
            await this.waitForLoaders();

            const option = this.page.getByRole('option', { name: new RegExp(crName, 'i') })
                .or(this.page.locator('.ui-autocomplete li a, .ui-menu-item a').filter({ hasText: crName }))
                .first();

            await this.waitForVisible(option);
            await this.click(option);
            await this.waitForLoaders();
        });
    }

    /**
     * Checks the 'Show Score' checkbox on Attendance Sheet report.
     **/
    async checkShowScoreCheckbox() {
        await test.step('Check "Show Score" checkbox', async () => {
            await this.waitForLoaders();
            if (await this.isVisible(this.showScoreCheckbox)) {
                await this.click(this.showScoreCheckbox);
                await this.waitForLoaders();
            }
        });
    }

    /**
     * Clicks 'Download' button for Attendance Sheet Report and waits for file download.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async downloadAttendanceSheetReport() {
        return await test.step('Click "Download" button and wait for Attendance Sheet report download', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.attendanceSheetDownloadBtn);

            const downloadPromise = this.page.waitForEvent('download');
            await this.click(this.attendanceSheetDownloadBtn);
            const download = await downloadPromise;
            await this.waitForLoaders();
            return download;
        });
    }

    /**
     * Verifies the downloaded Attendance Sheet report file and attaches it to the report.
     * Validates column names, row headers, and report metadata in the PDF.
     * @param {import('@playwright/test').Download|string} download - The Playwright Download instance.
     * @param {string} [crName] - Optional CR name to verify in the report.
     **/
    async verifyAttendanceSheetReportDownloaded(download, crName) {
        await test.step('Verify Attendance Sheet report downloaded successfully and attach to report', async () => {
            expect(download).toBeTruthy();
            const fileName = typeof download !== 'string' && typeof download?.suggestedFilename === 'function' ? download.suggestedFilename() : 'AttendanceSheetReport.pdf';
            console.log(`Downloaded file name: ${fileName}`);

            if (fileName.endsWith('.pdf')) {
                const expectedTexts = [
                    'Provider Name',
                    'Provider Certificate',
                    'CR#',
                    'Location',
                    'Student Name',
                    'Teacher Name',
                    'Teacher Signature'
                ];

                if (crName) {
                    expectedTexts.push(crName);
                }

                await PdfHelper.verifyPdfDownloaded(download, {
                    attachmentName: fileName,
                    expectedTexts
                });
            } else {
                const filePath = typeof download === 'string' ? download : await download.path();
                if (filePath) {
                    await test.info().attach(fileName, { path: filePath });
                    console.log(`[BusinessReportsPage] Attached "${fileName}" to test report.`);
                }
            }
        });
    }

    /**
     * Enters the appointment date range for BTW Data Export Report.
     * Defaults to the 3-month date range (Previous Month start to Next Month end) via DateHelper.
     * @param {string} [dateRangeString] - Optional custom date range string e.g. '07/01/2026 - 09/30/2026'.
     **/
    async enterBtwAppointmentDateRange(dateRangeString) {
        const range = dateRangeString || DateHelper.getThreeMonthFormattedRange();
        await test.step(`Enter BTW appointment date range: "${range}"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.btwAppointmentDateInput);
            await this.click(this.btwAppointmentDateInput);
            await this.clear(this.btwAppointmentDateInput);
            await this.pressSequentially(this.btwAppointmentDateInput, range);
            await this.btwAppointmentDateInput.press('Enter');
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks 'Select Data Fields' and checks the 'Select All' checkbox for BTW Data Export.
     **/
    async selectAllBtwDataFields() {
        await test.step('Select all data fields for BTW Data Export Report', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.btwSelectDataFieldsBtn);
            await this.click(this.btwSelectDataFieldsBtn);
            await this.waitForLoaders();

            await this.waitForVisible(this.btwSelectAllDataFieldsCheckbox);
            await this.click(this.btwSelectAllDataFieldsCheckbox);
            await this.click(this.btwSelectDataFieldsBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks 'Export Into Excel' for BTW Data Export Report and waits for file download.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async exportBtwDataToExcel() {
        return await test.step('Click "Export Into Excel" and wait for BTW Data Export report download', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.exportIntoExcelButton);

            const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
            await this.click(this.exportIntoExcelButton);
            const download = await downloadPromise;
            // Wait until 'Please wait we are processing the data' message is hidden
            if (await this.processingMessage.isVisible().catch(() => false)) {
                await this.waitForHidden(this.processingMessage, 60000);
            }
            await this.waitForLoaders();
            return download;
        });
    }

    /**
     * Verifies that the BTW Data Export Excel report downloaded successfully,
     * validates all 24 expected column headers and the worksheet name 'BTWOpening_Schedule',
     * and attaches the summary report & Excel file to test reports.
     * @param {import('@playwright/test').Download|string} download - The Playwright Download instance.
     * @param {string[]} [customColumns] - Optional custom columns to verify.
     **/
    async verifyBtwDataExportExcelDownloaded(download, customColumns) {
        await test.step('Verify BTW Data Export Excel file downloaded successfully and contains expected columns & sheet name', async () => {
            expect(download).toBeTruthy();
            const fileName = typeof download !== 'string' && typeof download?.suggestedFilename === 'function' ? download.suggestedFilename() : 'BTWDataExportReport.xlsx';
            console.log(`Downloaded BTW Excel file name: ${fileName}`);
            expect(fileName).toMatch(/\.xlsx?$/i);

            const expectedColumns = customColumns || [
                'StaffName',
                'ApptDate',
                'Location',
                'PickUpLocation',
                'ApptStartTime',
                'ApptEndTime',
                'StudentName',
                'Day',
                'BTWStatus',
                'AppointmentType',
                'StudentCellPhone',
                'StudentEmail',
                'AccountBal$',
                'VehicleName',
                'Product',
                'DateActivated',
                'StudentLocation',
                'StudentPortalVisibility',
                'DriverStatus',
                'AppointmentID',
                'OpenSlotCreationDateTime',
                'LastStatusOfAppointment',
                'LastStatusChangedDate',
                'LastStatusChangedBy'
            ];

            await ExcelHelper.verifyExcelColumns(download, expectedColumns, {
                fileName,
                expectedSheetName: 'BTWOpening_Schedule'
            });
        });
    }

    /**
     * Saves a new filter configuration for the current report.
     * @param {string} filterName - Name for the new filter.
     * @param {string} [status='Active'] - Status to select ('Active').
     **/
    async saveNewFilter(filterName, status = 'Active') {
        await test.step(`Save new filter with name "${filterName}" and status "${status}"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.saveAsNewFilterBtn);
            await this.click(this.saveAsNewFilterBtn);
            await this.waitForLoaders();

            // Enter Filter Name
            await this.waitForVisible(this.filterNameInput);
            await this.fill(this.filterNameInput, filterName);

            // Select Status
            await this.click(this.filterStatusDropdownBtn);
            await this.waitForVisible(this.filterStatusActiveOption);
            await this.click(this.filterStatusActiveOption);

            // Select "Only Me" radio
            await this.click(this.whoCanSeeFilterOnlyMeRadio);

            // Click Save
            await this.click(this.saveFilterBtn);
            await this.waitForLoaders();

            // Verify success notification
            const successMsg = this.page.getByText('Filter Saved Sucessfully.');
            await this.waitForVisible(successMsg);
            await this.verifyVisible(successMsg);

            // Close popup
            await this.click(this.closeFilterModalBtn);
            await this.waitForHidden(this.closeFilterModalBtn)
            await this.waitForLoaders();
        });
    }

    /**
     * Deletes the saved filter from the Edit Filter modal.
     **/
    async deleteFilter(filterName) {
        await test.step('Open Edit Filter modal, delete filter and verify deletion message', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.editFilterBtn);
            await this.click(this.editFilterBtn);
            await this.waitForLoaders();

            // Click Delete icon
            await this.waitForVisible(this.deleteFilterIcon(filterName));
            await this.click(this.deleteFilterIcon(filterName));

            // Confirm deletion
            await this.waitForVisible(this.deleteConfirmationYesBtn);
            await this.click(this.deleteConfirmationYesBtn);
            await this.waitForLoaders();

            // Verify deletion notification

            const successMsg = this.page.getByText('Filter deleted Sucessfully');
            await this.waitForVisible(successMsg);
            await this.verifyVisible(successMsg);
        });
    }

    /**
     * Selects all BTW Statuses from the BTW Status dropdown on Student Info Report.
     **/
    async selectAllStudentInfoBtwStatuses() {
        await test.step('Select all BTW Statuses from dropdown', async () => {
            await this.waitForLoaders();
            await this.click(this.studentInfoBtwStatusDropdownBtn);
            await this.waitForLoaders();
            await this.click(this.studentInfoSelectAllBtwStatusCheckbox);
            await this.waitForLoaders();
            await this.click(this.studentInfoBtwStatusDropdownBtn);
            await this.waitForLoaders();

        });
    }

    /**
     * Clicks 'Student Information' button and waits for report popup page in a new tab.
     * @returns {Promise<import('@playwright/test').Page>} The popup Page instance.
     **/
    async openStudentInformationReportTab() {
        return await test.step('Click "Student Information" button and open report in new tab', async () => {
            await this.waitForLoaders();
            const popupPromise = this.page.waitForEvent('popup');
            await this.click(this.studentInfoReportBtn);
            const reportPage = await popupPromise;
            await reportPage.waitForLoadState('load');
            await this.waitForLoaders();
            return reportPage;
        });
    }

    /**
     * Verifies the Student Information report page in the opened tab:
     * - Verifies 'Student Information' header and student name
     * - Verifies all key field labels (Student#, Cell, Parent, DOI, DOB, etc.)
     * - Attaches screenshot to the test report
     * @param {import('@playwright/test').Page} reportPage - The popup Page instance.
     * @param {string} [expectedStudentName] - Expected student name or substring.
     **/
    async verifyStudentInfoReportTab(reportPage, expectedStudentName) {
        await test.step(`Verify Student Information report opened in new tab${expectedStudentName ? ` for "${expectedStudentName}"` : ''}`, async () => {
            await reportPage.waitForLoadState('load');
            const heading = reportPage.getByText('Student Information').first();
            await expect(heading).toBeVisible({ timeout: 15000 });

            if (expectedStudentName) {
                const studentText = reportPage.getByText(new RegExp(expectedStudentName, 'i')).first();
                await expect(studentText).toBeVisible({ timeout: 15000 });
            }

            // Expected field keys on the Student Information report (with regex OR for environment differences)
            const expectedFieldKeys = [
                'Student#',
                'Cell',
                'Parent',
                'City, State Zip',
                'Email',
                'Student',
                'Address',
                'Home',
                /(LDL|DL\/Permit|Permit No)/i,          // LDL on coreServer2, DL/Permit # or Permit No on coreServer1
                'Student Balance',
                /(DOI|Permit Issue Date)/i,             // DOI on coreServer2, Permit Issue Date on coreServer1
                'DOB',
                'ParentName',
                'Age',
                'High School',
                'Gender',
                'Permit Expiration Date',
                'Driving Notes',
                'Student Notes',
                'Wear Glasses'
            ];

            for (const key of expectedFieldKeys) {
                const label = typeof key === 'string' ? key : key.source;
                const keyLocator = reportPage.getByText(key).first();
                await expect(keyLocator, `Expected field key "${label}" to be visible on Student Info Report`).toBeVisible({ timeout: 10000 });
            }
        });
    }

    /**
     * Clicks 'EXPORT TO PDF' on the Student Information popup tab, waits for the download,
     * and attaches the downloaded PDF to the test report.
     * @param {import('@playwright/test').Page} reportPage - The popup Page instance.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async exportAndAttachStudentInfoPdf(reportPage) {
        return await test.step('Click "EXPORT TO PDF" and attach PDF to test report', async () => {
            const exportPdfBtn = reportPage.getByRole('button', { name: /Export TO PDF/i });
            await expect(exportPdfBtn).toBeVisible({ timeout: 15000 });

            const downloadPromise = reportPage.waitForEvent('download');
            await exportPdfBtn.click();
            const download = await downloadPromise;

            // Attach PDF to report
            const filePath = await download.path();
            const fileName = (await download.suggestedFilename()) || 'StudentInfoReport.pdf';
            if (filePath) {
                await test.info().attach(fileName, {
                    path: filePath,
                    contentType: 'application/pdf'
                });
                console.log(`[BusinessReportsPage] Attached "${fileName}" to test report.`);
            }
            return download;
        });
    }

    /**
     * Selects Start Date (1st day of last month) and End Date (last day of current month)
     * using the calendar datepicker popup for Vehicle Hours Report.
     **/
    async selectVehicleHoursDateRange() {
        await test.step('Select Start Date (1st of last month) and End Date (last of current month) via calendar datepicker', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.vehicleHoursStartDateInput);

            const { prevMonthNameYear, currMonthNameYear, prevDay, currLastDay } = DateHelper.getPrevToCurrentMonthCalendarInfo();

            // 1. Select Start Date: click input, navigate back to previous month, click day 1
            await this.vehicleHoursStartDateInput.click();
            await this.page.waitForTimeout(300);

            const prevNavBtn = this.page.locator('th.prev:visible').first();
            const startSwitch = this.page.locator('th.datepicker-switch:visible').first();

            let maxAttempts = 12;
            while (maxAttempts > 0 && await startSwitch.isVisible().catch(() => false)) {
                const switchText = (await startSwitch.innerText()).trim();
                if (switchText.toLowerCase() === prevMonthNameYear.toLowerCase()) {
                    break;
                }
                await prevNavBtn.click();
                await this.page.waitForTimeout(200);
                maxAttempts--;
            }

            const startDayCell = this.page.locator('.datepicker:visible td.day:not(.old):not(.new), .datepicker:visible td:not(.old):not(.new)')
                .filter({ hasText: new RegExp(`^${prevDay}$`) })
                .first();
            await startDayCell.click();
            await this.page.waitForTimeout(300);

            // 2. Select End Date: click input, ensure current month, click last day of current month
            await this.waitForVisible(this.vehicleHoursEndDateInput);
            await this.vehicleHoursEndDateInput.click();
            await this.page.waitForTimeout(300);

            const nextNavBtn = this.page.locator('th.datepicker-switch:visible').first();
            const endSwitch = this.page.locator('th.datepicker-switch:visible').first();

            maxAttempts = 12;
            while (maxAttempts > 0 && await endSwitch.isVisible().catch(() => false)) {
                const switchText = (await endSwitch.innerText()).trim();
                if (switchText.toLowerCase() === currMonthNameYear.toLowerCase()) {
                    break;
                }
                await nextNavBtn.click();
                await this.page.waitForTimeout(200);
                maxAttempts--;
            }

            const endDayCell = this.page.locator('.datepicker:visible td.day:not(.old):not(.new), .datepicker:visible td:not(.old):not(.new)')
                .filter({ hasText: new RegExp(`^${currLastDay}$`) })
                .first();
            await endDayCell.click();
            await this.page.waitForTimeout(300);
            await this.waitForLoaders();
        });
    }

    /**
     * Alias for backward compatibility.
     **/
    async enterVehicleHoursDateRange() {
        await this.selectVehicleHoursDateRange();
    }

    /**
     * Clicks 'Display' button for Vehicle Hours Report and waits for the popup modal to appear.
     **/
    async clickDisplayVehicleHoursReport() {
        await test.step('Click "Display" button and open Vehicle Hours Report modal', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.vehicleHoursDisplayBtn);
            await this.click(this.vehicleHoursDisplayBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.vehicleHoursModal);
        });
    }

    /**
     * Verifies that the Vehicle Hours Report modal popup is displayed with correct headers and columns:
     * - Verifies header 'Vehicle Hours Report' in modal header
     * - Verifies column headers across environments: 'Vehicle No', 'Type'/'Vehicle Type', 'Status'/'Vehicle Status', 'No of Appnt\'s'/'No of Appointments', 'Total Hours'
     * - Attaches screenshot of the modal to test report
     **/
    async verifyVehicleHoursReportModal() {
        await test.step('Verify Vehicle Hours Report modal is displayed with expected column headers', async () => {
            await this.waitForVisible(this.vehicleHoursModal);
            await expect(this.vehicleHoursModalHeader).toContainText('Vehicle Hours Report');

            const expectedColumns = [
                /^Vehicle No$/i,
                /^(Vehicle )?Type$/i,
                /^(Vehicle )?Status$/i,
                /^No of (Appointments|Appnt's)$/i,
                /^Total Hours$/i
            ];

            for (const col of expectedColumns) {
                const colHeader = this.vehicleHoursModal.getByRole('columnheader', { name: col });
                await expect(colHeader, `Verify column matching ${col} is visible in modal`).toBeVisible();
            }

            // Capture and attach screenshot to test report
            const screenshot = await this.vehicleHoursModal.screenshot();
            await test.info().attach('VehicleHoursReport_Modal.png', {
                body: screenshot,
                contentType: 'image/png'
            });
        });
    }

    /**
     * Selects Start Date (1st day of last month) and End Date (last day of current month)
     * using the calendar datepicker popup for In-Car Evaluation Data Report.
     **/
    async selectInCarEvalDateRange() {
        await test.step('Select Start Date (1st of last month) and End Date (last of current month) for In-Car Evaluation Report', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.inCarEvalStartDateInput);

            const { prevMonthNameYear, currMonthNameYear, prevDay, currLastDay } = DateHelper.getPrevToCurrentMonthCalendarInfo();

            // 1. Select Start Date: click input, navigate back to previous month, click day 1
            await this.inCarEvalStartDateInput.click();
            await this.page.waitForTimeout(300);

            const prevNavBtn = this.page.locator('.datepicker:visible th.prev, .datepicker:visible .fa-angle-left, .datepicker:visible .prev').first();
            const startSwitch = this.page.locator('.datepicker:visible .datepicker-switch').first();

            let maxAttempts = 12;
            while (maxAttempts > 0 && await startSwitch.isVisible().catch(() => false)) {
                const switchText = (await startSwitch.innerText()).trim();
                if (switchText.toLowerCase() === prevMonthNameYear.toLowerCase()) {
                    break;
                }
                await prevNavBtn.click();
                await this.page.waitForTimeout(200);
                maxAttempts--;
            }

            const startDayCell = this.page.locator('.datepicker:visible td.day:not(.old):not(.new), .datepicker:visible td:not(.old):not(.new)')
                .filter({ hasText: new RegExp(`^${prevDay}$`) })
                .first();
            await startDayCell.click();
            await this.page.waitForTimeout(300);

            // 2. Select End Date: click input, ensure current month, click last day of current month
            await this.waitForVisible(this.inCarEvalEndDateInput);
            await this.inCarEvalEndDateInput.click();
            await this.page.waitForTimeout(300);

            const nextNavBtn = this.page.locator('.datepicker:visible th.next, .datepicker:visible .fa-angle-right, .datepicker:visible .next').first();
            const endSwitch = this.page.locator('.datepicker:visible .datepicker-switch').first();

            maxAttempts = 12;
            while (maxAttempts > 0 && await endSwitch.isVisible().catch(() => false)) {
                const switchText = (await endSwitch.innerText()).trim();
                if (switchText.toLowerCase() === currMonthNameYear.toLowerCase()) {
                    break;
                }
                await nextNavBtn.click();
                await this.page.waitForTimeout(200);
                maxAttempts--;
            }

            const endDayCell = this.page.locator('.datepicker:visible td.day:not(.old):not(.new), .datepicker:visible td:not(.old):not(.new)')
                .filter({ hasText: new RegExp(`^${currLastDay}$`) })
                .first();
            await endDayCell.click();
            await this.page.waitForTimeout(300);
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks 'Export As Excel' button for In-Car Evaluation Data Report and waits for file download.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async exportInCarEvaluationToExcel() {
        return await test.step('Click "Export As Excel" and wait for file download', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.inCarEvalExportExcelBtn);

            const downloadPromise = this.page.waitForEvent('download');
            await this.click(this.inCarEvalExportExcelBtn);
            const download = await downloadPromise;

            if (await this.processingMessage.isVisible().catch(() => false)) {
                await this.waitForHidden(this.processingMessage, 60000);
            }
            await this.waitForLoaders();
            return download;
        });
    }

    /**
     * Verifies that the In-Car Evaluation Data Excel report downloaded successfully,
     * validates all 10 expected columns, the worksheet name 'Daily Evaluations',
     * and presence of the student name, then attaches the report to test reports.
     * @param {import('@playwright/test').Download|string} download - The Playwright Download instance.
     * @param {string} [expectedStudentName='testautomation_donotuse'] - Expected student name in the report.
     **/
    async verifyInCarEvaluationExcelDownloaded(download, expectedStudentName = 'testautomation_donotuse') {
        await test.step('Verify In-Car Evaluation Excel report downloaded successfully and contains expected columns & sheet name', async () => {
            expect(download).toBeTruthy();
            const fileName = typeof download !== 'string' && typeof download?.suggestedFilename === 'function' ? download.suggestedFilename() : 'InCarEvaluationReport.xlsx';
            console.log(`Downloaded In-Car Evaluation Excel file name: ${fileName}`);
            expect(fileName).toMatch(/\.xlsx?$/i);

            const expectedColumns = [
                'Student Name',
                'Evaluation Name',
                'Question',
                'Answer',
                'Appt Date',
                'Appt Start Time',
                'Appt End Time',
                'Appointment Location',
                'Staff Name',
                'Private Lesson Notes'
            ];

            await ExcelHelper.verifyExcelColumns(download, expectedColumns, {
                fileName,
                expectedSheetName: 'Daily Evaluations'
            });

            if (expectedStudentName) {
                const content = await ExcelHelper.readContent(download);
                const normalizedStudent = expectedStudentName.toLowerCase().replace(/[,_\s-]+/g, '');
                const normalizedContent = content.toLowerCase().replace(/[,_\s-]+/g, '');
                expect(normalizedContent, `Expected student "${expectedStudentName}" to be present in Excel report content`).toContain(normalizedStudent);
            }
        });
    }

    /**
     * Searches for a student in the Student Event Logs autocomplete field and selects them from the dropdown.
     * @param {string} studentName - Student's name to search and select.
     **/
    async searchAndSelectStudentForEventLogs(studentName) {
        await test.step(`Search and select student for Student Event Logs: "${studentName}"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentEventLogsSearchInput);
            await this.pressSequentially(this.studentEventLogsSearchInput, studentName);
            await this.page.waitForTimeout(1000);
            await this.waitForLoaders();

            const option = this.page.getByRole('option', { name: new RegExp(studentName, 'i') })
                .or(this.page.locator('.ui-autocomplete li a, .ui-menu-item a').filter({ hasText: studentName }))
                .first();

            await this.waitForVisible(option);
            await this.click(option);
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks 'Export Into Excel' for Student Event Logs Report and waits for file download.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async exportStudentEventLogsToExcel() {
        return await test.step('Click "Export Into Excel" and wait for Student Event Logs download', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.exportIntoExcelButton);

            const downloadPromise = this.page.waitForEvent('download');
            await this.click(this.exportIntoExcelButton);
            const download = await downloadPromise;

            if (await this.processingMessage.isVisible().catch(() => false)) {
                await this.waitForHidden(this.processingMessage, 60000);
            }
            await this.waitForLoaders();
            return download;
        });
    }

    /**
     * Verifies that the Student Event Logs Excel report downloaded successfully,
     * validates all 10 expected columns, the worksheet name 'Student Event Log',
     * and presence of the student name, then attaches the report to test reports.
     * @param {import('@playwright/test').Download|string} download - The Playwright Download instance.
     * @param {string} [expectedStudentName='testautomation_donotuse'] - Expected student name in the report.
     **/
    async verifyStudentEventLogsExcelDownloaded(download, expectedStudentName = 'testautomation_donotuse') {
        await test.step('Verify Student Event Logs Excel report downloaded successfully and contains expected columns & sheet name', async () => {
            expect(download).toBeTruthy();
            const fileName = typeof download !== 'string' && typeof download?.suggestedFilename === 'function' ? download.suggestedFilename() : 'StudentEventLogsReport.xlsx';
            console.log(`Downloaded Student Event Logs Excel file name: ${fileName}`);
            expect(fileName).toMatch(/\.xlsx?$/i);

            const expectedColumns = [
                'Student Id',
                'First Name',
                'Last Name',
                'Operation',
                'Local Time',
                'Server Time',
                'Instructor Name Old',
                'Instructor Name New',
                'IP Address',
                'Browser'
            ];

            await ExcelHelper.verifyExcelColumns(download, expectedColumns, {
                fileName,
                expectedSheetName: 'Student Event Log'
            });

            if (expectedStudentName) {
                const content = await ExcelHelper.readContent(download);
                const normalizedStudent = expectedStudentName.toLowerCase().replace(/[,_\s-]+/g, '');
                const normalizedContent = content.toLowerCase().replace(/[,_\s-]+/g, '');
                expect(normalizedContent, `Expected student "${expectedStudentName}" to be present in Excel report content`).toContain(normalizedStudent);
            }
        });
    }

    /**
     * Clicks on the 'Date Created' radio button on High School Report.
     **/
    async selectHighSchoolDateCreatedRadio() {
        await test.step('Select "Date Created" radio button for High School Report', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.highSchoolDateCreatedRadio);
            await this.click(this.highSchoolDateCreatedRadio);
            await this.waitForLoaders();
        });
    }

    /**
     * Enters the dynamic date range (1st of last month to last day of this month) directly into the date range textbox.
     **/
    async enterHighSchoolDateRange() {
        const now = new Date();
        const prevMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const currMonthLastDate = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        const fmt = (d) => `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
        const startDate = fmt(prevMonthDate);
        const endDate = fmt(currMonthLastDate);
        const dateRange = `${startDate} - ${endDate}`;

        await test.step(`Enter date range directly in textbox: "${dateRange}"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.highSchoolDateRangeInput);
            await this.click(this.highSchoolDateRangeInput);
            await this.highSchoolDateRangeInput.fill(dateRange);
            await this.highSchoolDateRangeInput.press('Enter');
            await this.page.keyboard.press('Escape');
            await this.waitForLoaders();
        });
    }

    /**
     * Selects all High Schools from the multi-select dropdown.
     **/
    async selectAllHighSchools() {
        await test.step('Select all High Schools from dropdown', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.highSchoolDropdownBtn);
            await this.click(this.highSchoolDropdownBtn);
            await this.page.waitForTimeout(300);

            await this.waitForVisible(this.highSchoolSelectAllLink);
            await this.click(this.highSchoolSelectAllLink);
            await this.page.waitForTimeout(300);
            await this.click(this.highSchoolDropdownBtn);

            await this.waitForLoaders();
        });
    }

    /**
     * Clicks 'Display' button for High School Report and waits for modal/popup results.
     **/
    async clickDisplayHighSchoolReport() {
        await test.step('Click "Display" button to display High School Report', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.highSchoolDisplayBtn);
            await this.click(this.highSchoolDisplayBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that High School Report is displayed in popup modal with expected headers and status text.
     **/
    async verifyHighSchoolReportModal() {
        await test.step('Verify High School Report modal displayed with expected table columns and status', async () => {
            await this.waitForVisible(this.highSchoolModal);
            await expect(this.highSchoolModal).toContainText('High School Report');
            await expect(this.highSchoolStudentStatusText).toBeVisible();
            await expect(this.highSchoolModal).toContainText('High School');
            await expect(this.highSchoolModal).toContainText('# of Students');
            await expect(this.highSchoolModal).toContainText('Status');

            // Capture and attach screenshot to test report
            const screenshot = await this.highSchoolModal.screenshot();
            await test.info().attach('HighSchoolReport_Modal.png', {
                body: screenshot,
                contentType: 'image/png'
            });
        });
    }
}
