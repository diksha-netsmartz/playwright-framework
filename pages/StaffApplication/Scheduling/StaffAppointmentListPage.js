import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Staff Appointment List page in Staff Portal (CSM)
 * (Scheduling > Staff Appointment List).
 * Handles Start Date / End Date filtering and verifies appointments data grid.
 **/
export default class StaffAppointmentListPage extends BasePage {

    /**
     * Initializes locators for Staff Appointment List Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Filter date fields
        this.startDateInput = page.locator('#SearchLogsStartDate');
        this.endDateInput = page.locator('#SearchLogsEndDate');

        // Filter button
        this.filterBtn = page.getByRole('button', { name: 'Filter' })

        // Results table and records
        this.appointmentsTable = page.locator('#grid_DailyData:visible');
        this.recordRows = page.locator("//table[@id='grid_DailyData']//tbody//tr");
        this.noRecordMsg = page.getByText('No record exists.', { exact: true });
    }

    /**
     * Returns the start of current year date in MM/DD/YYYY format (e.g. 01/01/2026).
     * @returns {string}
     **/
    getStartOfCurrentYearDate() {
        const year = new Date().getFullYear();
        return `01/01/${year}`;
    }

    /**
     * Returns the current date in MM/DD/YYYY format.
     * @returns {string}
     **/
    getCurrentDate() {
        const today = new Date();
        const mm = String(today.getMonth() + 1).padStart(2, '0');
        const dd = String(today.getDate()).padStart(2, '0');
        const yyyy = today.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
    }

    /**
     * Helper to select a date in Bootstrap datepicker popup or update the input element.
     * @param {import('@playwright/test').Locator} inputLocator - Input element locator.
     * @param {string} dateStr - Target date in MM/DD/YYYY format.
     **/
    async selectDateViaCalendar(inputLocator, dateStr) {
        const parts = dateStr.split('/');
        const targetMonth = parseInt(parts[0], 10) - 1; // 0-indexed: 0 = January
        const targetDay = parseInt(parts[1], 10);
        const targetYear = parseInt(parts[2], 10);

        const monthNames = [
            'January', 'February', 'March', 'April', 'May', 'June',
            'July', 'August', 'September', 'October', 'November', 'December'
        ];
        const targetMonthYear = `${monthNames[targetMonth]} ${targetYear}`;

        await this.waitForVisible(inputLocator, 5000);
        await this.click(inputLocator);
        await this.page.waitForTimeout(300);

        const datepicker = this.page.locator('.datepicker:visible').first();
        if (await datepicker.isVisible({ timeout: 2000 }).catch(() => false)) {
            const monthSwitch = this.page.locator('.datepicker:visible .datepicker-switch').first();
            const prevBtn = this.page.locator('.datepicker:visible th.prev, .datepicker:visible .prev > .fa, .datepicker:visible .prev').first();
            const nextBtn = this.page.locator('.datepicker:visible th.next, .datepicker:visible .next > .fa, .datepicker:visible .next').first();

            let maxAttempts = 24;
            while (maxAttempts > 0) {
                const currentText = (await monthSwitch.innerText().catch(() => '')).trim();
                if (currentText.toLowerCase() === targetMonthYear.toLowerCase()) {
                    break;
                }

                // Parse current month and year from picker header, e.g. "September 2026"
                const [curMonthStr, curYearStr] = currentText.split(/\s+/);
                const curMonthIdx = monthNames.findIndex(m => m.toLowerCase() === (curMonthStr || '').toLowerCase());
                const curYear = parseInt(curYearStr, 10) || new Date().getFullYear();

                const isBefore = targetYear < curYear || (targetYear === curYear && targetMonth < curMonthIdx);
                if (isBefore) {
                    await prevBtn.click();
                } else {
                    await nextBtn.click();
                }
                await this.page.waitForTimeout(150);
                maxAttempts--;
            }

            // Click the matching day cell in the active month
            const dayCell = this.page.locator('.datepicker:visible td.day:not(.old):not(.new)')
                .filter({ hasText: new RegExp(`^${targetDay}$`) }).first();
            if (await dayCell.isVisible({ timeout: 2000 }).catch(() => false)) {
                await dayCell.click();
            } else {
                await this.page.getByRole('cell', { name: String(targetDay), exact: true }).first().click().catch(() => { });
            }
            await this.waitForLoaders();
        }

        // Synchronize and verify input value
        await inputLocator.evaluate((/** @type {HTMLInputElement} */ el, val) => {
            el.removeAttribute('readonly');
            el.value = val;
            el.dispatchEvent(new Event('input', { bubbles: true }));
            el.dispatchEvent(new Event('change', { bubbles: true }));
            const win = /** @type {any} */ (window);
            if (win.$ && win.$(el).datepicker) {
                try {
                    win.$(el).datepicker('setDate', val);
                    win.$(el).datepicker('hide');
                } catch (e) { }
            }
        }, dateStr);

        await this.waitForLoaders();
    }

    /**
     * Sets the Start Date input field.
     * @param {string} startDateStr - Start date in MM/DD/YYYY format.
     **/
    async setStartDate(startDateStr) {
        await test.step(`Set Start Date to "${startDateStr}"`, async () => {
            await this.waitForLoaders();
            await this.selectDateViaCalendar(this.startDateInput, startDateStr);
        });
    }

    /**
     * Sets the End Date input field.
     * @param {string} endDateStr - End date in MM/DD/YYYY format.
     **/
    async setEndDate(endDateStr) {
        await test.step(`Set End Date to "${endDateStr}"`, async () => {
            await this.waitForLoaders();
            const currentVal = await this.endDateInput.inputValue().catch(() => '');
            if (currentVal.trim() !== endDateStr.trim()) {
                await this.selectDateViaCalendar(this.endDateInput, endDateStr);
            }
        });
    }

    /**
     * Clicks the Filter button and waits for grid data to load.
     **/
    async clickFilter() {
        await test.step('Click on Filter button', async () => {
            await this.waitForVisible(this.filterBtn, 1000);
            await this.click(this.filterBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that staff appointment data appears in the grid.
     **/
    async verifyAppointmentsGridData() {
        await test.step('Verify data appears in the appointments grid', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.waitForVisible(this.appointmentsTable.first(), 3000);
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });

            const noRecords = await this.noRecordMsg.first().isVisible({ timeout: 3000 }).catch(() => false);
            expect(noRecords, 'Search returned "No record exists." for the selected date range.').toBe(false);

            const rowCount = await this.recordRows.count();
            console.log(`Verified: Staff appointment grid displays ${rowCount} record(s).`);
            expect(rowCount, 'Expected appointment records to be displayed in grid').toBeGreaterThan(0);
            await expect(this.recordRows.first()).toBeVisible();
        });
    }
}
