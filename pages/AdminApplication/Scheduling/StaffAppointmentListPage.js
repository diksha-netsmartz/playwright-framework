import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Staff Appointment List page in Admin Portal
 * (Scheduling > Staff Appointment List).
 * Verifies pre-selected Start/End dates and applies the Filter.
 **/
export default class StaffAppointmentListPage extends BasePage {

    /**
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Filter form fields (readonly datepickers — values are pre-populated by the app)
        this.startDateInput = page.locator('#SearchLogsStartDate');
        this.endDateInput = page.locator('#SearchLogsEndDate');

        // Filter button
        this.filterBtn = page.getByRole('button', { name: /filter/i });

        // Results table
        this.appointmentsTable = page.locator('table.table, #staffAppointmentListtable, .table-responsive table');
        this.recordRows = page.locator("xpath=//table[@id='grid_DailyData']//tbody//td[not(text()='No record exists.')]//parent::tr");
        this.noRecordMsg = page.getByText('No record exists.', { exact: true });
    }

    /**
     * Returns today's date string in MM/DD/YYYY format.
     * @returns {string}
     **/
    #expectedEndDate() {
        const d = new Date();
        return `${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}/${d.getFullYear()}`;
    }

    /**
     * Verifies that both Start Date and End Date are pre-selected as today's date (MM/DD/YYYY).
     **/
    async verifyDatesPreSelected() {
        await test.step('Verify Start Date and End Date are pre-selected as today', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.startDateInput);
            await this.waitForVisible(this.endDateInput);

            const today = this.#expectedEndDate();

            await expect(this.startDateInput, `Start Date should be ${today}`).toHaveValue(today);
            await expect(this.endDateInput, `End Date should be ${today}`).toHaveValue(today);

            console.log(`Start Date verified: ${today}`);
            console.log(`End Date verified:   ${today}`);
        });
    }

    /**
     * Clicks the FILTER button and waits for the page to load results.
     **/
    async clickFilter() {
        await test.step('Click FILTER button', async () => {
            await this.waitForVisible(this.filterBtn);
            await this.click(this.filterBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
            await this.page.waitForTimeout(8000);
        });
    }

    /**
     * Verifies that the appointments results area is visible and populated after filtering.
     * Fails if "No record exists." or empty message is displayed on screen.
     **/
    async verifyAppointmentsResultsDisplayed() {
        await test.step('Verify staff appointment results are displayed and populated', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');

            const noRecords = await this.noRecordMsg.isVisible({ timeout: 5000 }).catch(() => false);
            expect(noRecords, 'Search returned "No record exists." for the selected filters.').toBe(false);

            const rowCount = await this.recordRows.count();
            console.log(`Search returned ${rowCount} record(s).`);
            expect(rowCount, 'Expected appointment records to be displayed').toBeGreaterThan(0);
        });
    }
}
