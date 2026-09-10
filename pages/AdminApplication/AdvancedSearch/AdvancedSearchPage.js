import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';
import DateHelper from '../../../utils/DateHelper';

/**
 * Page Object representing the Advanced Search page in Admin Portal.
 * Handles setting date range filters, student type selection,
 * applying the filter, and verifying search results.
 **/
export default class AdvancedSearchPage extends BasePage {

    /**
     * Initializes locators for the Advanced Search page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Date Account Created range picker input
        this.dateCreatedInput = page.locator('#date_Created');

        // Daterangepicker calendar locators
        this.prevMonthArrow = page.locator('.daterangepicker:visible th.prev, th.prev').first();
        this.applyBtn = page.locator(".daterangepicker:visible .applyBtn, button:has-text('Apply')").first();

        this.adultStudentType = page.locator("xpath=//label[contains(text(),'Adult')]//input[@id='StudentType']//following-sibling::ins");

        // Filter button
        this.filterBtn = page.getByRole('button', { name: 'Filter' });

        // Results table
        this.resultsTable = page.locator('#dtHighSchool');
        this.recordRows = page.locator("xpath=//table[@id='dtHighSchool']//tbody//tr//td[not(text()='No record exists.')]");
        this.noRecordsCell = page.locator("xpath=//table[@id='dtHighSchool']//tbody//tr//td[text()='No record exists.']");
    }

    /**
     * Opens the Date Account Created daterangepicker and selects the whole last month
     * via calendar clicks without using input fields.
     **/
    async selectDateAccountCreated() {
        const today = new Date();
        const lastDay = new Date(today.getFullYear(), today.getMonth(), 0).getDate();

        await test.step('Select Date Account Created: whole last month', async () => {
            await this.waitForVisible(this.dateCreatedInput);
            await this.click(this.dateCreatedInput);

            // Navigate to previous month
            await this.waitForVisible(this.prevMonthArrow);
            await this.click(this.prevMonthArrow);

            // Select 1st day of last month
            const firstDate = this.page.locator("xpath=(//div[contains(@class,'left')]//td[text()='1'])[1]");
            if (await firstDate.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(firstDate);
            } else {
                await this.click(this.page.locator("xpath=(//td[text()='1'])[1]"));
            }

            // Select last day of last month
            const lastDate = this.page.locator(`xpath=(//div[contains(@class,'left')]//td[text()='${lastDay}'])[last()]`);
            if (await lastDate.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(lastDate);
            } else {
                await this.click(this.page.locator(`xpath=(//td[text()='${lastDay}'])[last()]`));
            }

            // Click Apply if present
            if (await this.applyBtn.isVisible({ timeout: 1000 }).catch(() => false)) {
                await this.click(this.applyBtn);
            }
        });
    }

    /**
     * Selects "Adult" from the Student Type bootstrap-select dropdown.
     **/
    async selectStudentTypeAdult() {
        await test.step('Select Student Type: "Adult"', async () => {

            await this.waitForVisible(this.adultStudentType);
            await this.click(this.adultStudentType);
        });
    }

    /**
     * Clicks the Filter button to execute the Advanced Search.
     **/
    async clickFilter() {
        await test.step('Click Filter button', async () => {
            await this.waitForVisible(this.filterBtn);
            await this.click(this.filterBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 })
        });
    }

    /**
     * Verifies that student records are returned in the search results table.
     * Fails if resultsTable contains "No record exists.".
     **/
    async verifyStudentListDisplayed() {
        await test.step('Verify student list is displayed in results table', async () => {
            await this.waitForVisible(this.resultsTable);
            const hasNoRecord = await this.resultsTable.getByText('No record exists.', { exact: false }).isVisible({ timeout: 2000 }).catch(() => false);
            expect(hasNoRecord, 'Advanced Search results table displays "No record exists."').toBe(false);

            const rowCount = await this.recordRows.count();
            console.log(`Advanced Search returned ${rowCount} record cell(s).`);
            expect(rowCount).toBeGreaterThan(0);
        });
    }
}
