import BasePage from "../../../../utils/BasePage";
import PdfHelper from "../../../../utils/PdfHelper";
import { test, expect } from "@playwright/test";

/**
 * Page Object representing the Bulk Process Page in Admin Portal (Scheduling -> Manage Time Slots -> Bulk Process).
 * Handles filtering by appointment type and date range, marking appointments as completed,
 * and downloading the Print BTW History PDF report.
 **/
export default class BulkProcessPage extends BasePage {

    /**
     * Initializes locators for the Bulk Process Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Filter toolbar
        this.appointmentTypeDropdown = page.locator("//button[@data-id='bulkProcessAppointmentType']")
        this.showAllOption = page.locator(".dropdown-menu li a").filter({ hasText: 'Show All' });

        // Date Range
        this.dateRangeInput = page.locator('#txtBulkProcessDtRange');
        this.calendarMonth = page.locator('th.month').first();
        this.prevMonthArrow = page.locator('th.prev.available').first();

        // Filter button
        this.filterButton = page.locator("button[onclick*='BulkProcess()']")
        // checkbox for Complete
        this.completeCheckbox = page.locator("(//input[contains(@class,'selectComplete') and not (contains(@class,'All'))]//following-sibling::ins)[1]");

        // checkbox for Print BTW History
        this.printBtwHistoryCheckbox = page.locator("(//input[contains(@class,'selectPrintBTWHistory') and not (contains(@class,'All'))]//following-sibling::ins)[1]");

        // Action Buttons
        this.updateButton = page.locator('#btnUpdateBulkProcess')
        this.confirmYesLink = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.successMessage = page.locator('#bulkProcessFilterErrorSuccessDiv');

        // Print BTW History Link / Button
        this.printBtwHistoryButton = page.getByRole('link', { name: 'Print BTW History' });
    }

    /**
     * Selects appointment type from dropdown (defaults to 'Show All').
     **/
    async selectAppointmentType() {
        await test.step(`Select Appointment Type: "Show All"`, async () => {
            await this.waitForVisible(this.appointmentTypeDropdown);
            await this.click(this.appointmentTypeDropdown);
            await this.waitForVisible(this.showAllOption);
            await this.click(this.showAllOption);
        });
    }

    /**
     * Calculates the previous month and year, verifies against the calendar month header (th.month),
     * and clicks the 1st date and last date of that month.
     **/
    async selectPastMonthDateRange() {
        const today = new Date();
        const prevMonthDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const targetMonth = `${monthNames[prevMonthDate.getMonth()]} ${prevMonthDate.getFullYear()}`;
        const lastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();

        await test.step(`Select past whole month (${targetMonth}: 1 to ${lastDay}) by clicking dates in calendar`, async () => {
            await this.waitForVisible(this.dateRangeInput);
            await this.click(this.dateRangeInput);

            await this.waitForVisible(this.calendarMonth);

            // If th.month displays current month, click prev arrow until it displays target previous month
            let maxAttempts = 12;
            while (maxAttempts > 0) {
                const currentMonthText = (await this.calendarMonth.textContent())?.trim();
                if (currentMonthText && currentMonthText.includes(targetMonth)) {
                    break;
                }
                await this.click(this.prevMonthArrow);
                maxAttempts--;
            }

            // Click 1st date of the month (excluding 'off' days)
            const firstDate = this.page.locator("xpath=(//td[contains(@class,'available') and not(contains(@class,'off')) and text()='1'])[1]");
            await this.waitForVisible(firstDate);
            await this.click(firstDate);

            // Click last date of the month (excluding 'off' days)
            const lastDate = this.page.locator(`xpath=(//td[contains(@class,'available') and not(contains(@class,'off')) and text()='${lastDay}'])[1]`);
            await this.waitForVisible(lastDate);
            await this.click(lastDate);
        });
    }

    /**
     * Applies filter with selected appointment type and past month date range.
     **/
    async filterAppointments() {
        await test.step(`Filter Bulk Process appointments with type: "Show All" and past whole month date range`, async () => {
            await this.selectAppointmentType();
            await this.selectPastMonthDateRange();
            await this.waitForVisible(this.filterButton);
            await this.click(this.filterButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 });
        });
    }

    /**
     * Selects the complete checkbox for an appointment in the grid.
     **/
    async selectCompleteCheckbox() {
        await test.step('Select Complete checkbox for appointment', async () => {
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.waitForLoaders();
            await this.waitForVisible(this.completeCheckbox, { timeout: 5000 });
            await this.click(this.completeCheckbox);
        });
    }

    /**
     * Clicks UPDATE button, confirms popup, and verifies completion success message.
     **/
    async clickUpdateAndVerifyCompleted() {
        await test.step('Click UPDATE, confirm modal, and verify status message', async () => {
            await this.updateButton.scrollIntoViewIfNeeded();
            await this.waitForVisible(this.updateButton);
            await this.click(this.updateButton);

            await this.waitForVisible(this.confirmYesLink);
            await this.click(this.confirmYesLink);

            await this.waitForLoaders();

            // Verify success message banner
            await this.waitForVisible(this.successMessage, { timeout: 15000 });
            await this.verifyVisible(this.successMessage);
            const msgText = (await this.successMessage.textContent())?.trim() || '';
            console.log(`Success message: ${msgText}`);
            expect(msgText).toContain("Appointments status updated successfully")
            await test.step('Appointments status updated successfully banner is displayed', async () => { });
        });
    }

    /**
     * Selects the Print BTW History checkbox (the 2nd checkbox in the row).
     **/
    async selectPrintBtwHistoryCheckbox() {
        await test.step('Select Print BTW History checkbox for appointment', async () => {
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.waitForLoaders();
            await this.waitForVisible(this.printBtwHistoryCheckbox, { timeout: 5000 });
            await this.click(this.printBtwHistoryCheckbox);
        });
    }

    /**
     * Scrolls down, clicks Print BTW History button, and verifies the PDF download.
     * @returns {Promise<import('@playwright/test').Download>} The downloaded file object.
     **/
    async printBtwHistoryAndVerifyDownload() {
        return await test.step('Click Print BTW History button and verify PDF download', async () => {
            await this.printBtwHistoryButton.scrollIntoViewIfNeeded();
            await this.waitForVisible(this.printBtwHistoryButton);

            const downloadPromise = this.page.waitForEvent('download', { timeout: 30000 });
            await this.click(this.printBtwHistoryButton);
            const download = await downloadPromise;

            expect(download).toBeTruthy();
            const fileName = download.suggestedFilename();
            console.log(`Downloaded BTW History file: ${fileName}`);
            expect(fileName.toLowerCase()).toContain('.pdf');

            await test.step(`Verified: BTW History PDF "${fileName}" downloaded successfully`, async () => { });
            return download;
        });
    }

    /**
     * Verifies that the downloaded BTW History PDF contains the expected student details fields, title, and table columns.
     * @param {import('@playwright/test').Download|string} download - The downloaded PDF file or path.
     * @param {(string | string[] | RegExp)[]} [columns] - Optional custom list of field/column names.
     **/
    async verifyBtwHistoryPdfColumns(download, columns) {
        const env = process.env.ENV || 'coreServer2';

        const baseColumns = [
            // Title
            'Student Appointment Attendance History',

            // Student Detail Fields
            'Student:',
            'Address:',
            'Student#:',
            ['City, StateZip:', 'City,State,Zip:'],
            'Home:',
            'Cell:',
            'Parent:',
            'Email:',
            'LDL:',
            'Student Balance:',
            'DOI:',
            'DOB:',
            'ParentName:',
            'Age:',
            'High School:',
            'Gender:',
            'CR Start Date:',
            'Permit Expiration Date:',
            'Wear Glasses:',

            // Table Column Headers (common across both servers)
            'Day',
            'Appointment Name',
            'Date',
            'PickUp Location',
            'Instructor',
            'Car',
            'Status',
            'Practice'
        ];

        // coreServer1 includes additional columns not present in coreServer2
        const coreServer1ExtraColumns = [
            'Appointment Time End',
            'Appointment Notes',
            'Time',
            'Seating Position'
        ];

        const defaultColumns = env === 'coreServer1'
            ? [...baseColumns, ...coreServer1ExtraColumns]
            : baseColumns;

        const expectedColumns = columns || defaultColumns;

        await test.step('Verify student detail fields and table columns in downloaded BTW History PDF', async () => {
            await PdfHelper.verifyPdfDownloaded(download, {
                expectedTexts: expectedColumns,
                attachmentName: 'StudentAppointmentAttendanceHistory.pdf'
            });
            await test.step('Verified: All expected fields and table columns matched in PDF', async () => { });
        });
    }
}
