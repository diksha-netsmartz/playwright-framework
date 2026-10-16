import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Email Templates page in Admin Portal (Communication > Email Templates).
 * Handles navigating through template categories (Staff Mobile, Admin Portal, Reminders)
 * and updating / saving email templates.
 **/
export default class EmailTemplatesPage extends BasePage {

    /**
     * Initializes locators for the Email Templates page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Tabs
        this.staffMobileTab = page.locator('#tabStaffEmails');
        this.adminPortalTab = page.locator('#tabAdminEmails');
        this.remindersTab = page.locator('#tabReminderEmails');

        // First visible edit link in current tab table
        this.firstEmailEditLink = page.getByTitle('Edit').first();

        // Edit Modal elements
        this.emailToInput = page.locator('#txtAdditionalEmailIds');
        this.txtAccountsCreatedinPastXDays = page.locator('#txtAccountsCreatedinPastXDays');
        this.txtReminderStartDate = page.locator('#txtReminderStartDate');
        this.calendarDate = page.locator("(//td[@class='day'])[last()]");
        this.allCheckboxes = page.locator('div.icheckbox_square-grey:visible');
        this.checkedCheckboxes = page.locator('div.icheckbox_square-grey.checked:visible');
        this.uncheckedCheckboxes = page.locator('div.icheckbox_square-grey:not(.checked):visible');
        this.saveBtn = page.locator('#btnSaveUpdateEmailTemplate');
        this.closeBtn = page.locator('.btn.btnCloseEditEmailPopUp');
        this.successMessage = page.locator('span').filter({ hasText: 'Success! Information was successfully saved.' })

        this.expectedCheckedCount = 0;
        this.expectedUncheckedCount = 0;
    }

    /**
     * Clicks on the Staff Mobile tab and waits for the table to load.
     **/
    async clickStaffMobileTab() {
        await test.step('Click on "Staff Mobile" tab', async () => {
            await this.waitForVisible(this.staffMobileTab);
            await this.click(this.staffMobileTab);
        });
    }

    /**
     * Clicks on the Admin Portal tab and waits for the table to load.
     **/
    async clickAdminPortalTab() {
        await test.step('Click on "Admin Portal" tab', async () => {
            await this.waitForVisible(this.adminPortalTab);
            await this.click(this.adminPortalTab);
        });
    }

    /**
     * Clicks on the Reminders tab and waits for the table to load.
     **/
    async clickRemindersTab() {
        await test.step('Click on "Reminders" tab', async () => {
            await this.waitForVisible(this.remindersTab);
            await this.click(this.remindersTab);
        });
    }

    /**
     * Clicks the Edit link for the first visible email template.
     **/
    async clickFirstEmailEdit() {
        await test.step('Click Edit button for first email', async () => {
            await this.waitForVisible(this.firstEmailEditLink);
            await this.click(this.firstEmailEditLink);
            await this.waitForVisible(this.saveBtn);
        });
    }

    /**
     * Clicks the Save button on the Edit Email Template modal.
     **/
    async clickSave() {
        await test.step('Click Save button', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);
        });
    }

    /**
     * Verifies the template update success message is displayed.
     **/
    async verifySuccessMessage() {
        await test.step('Verify email template saved successfully', async () => {
            await this.waitForVisible(this.successMessage, { timeout: 5000 });
            await this.verifyVisible(this.successMessage)
        });
    }

    /**
     * Clicks the Close button on the Edit Email Template modal and waits for modal/loader to dismiss.
     **/
    async clickClose() {
        await test.step('Click Close button', async () => {
            await this.waitForVisible(this.closeBtn);
            await this.click(this.closeBtn);
            await this.waitForHidden(this.closeBtn);
        });
    }



    /**
     * Updates email template details: sets additional email IDs and toggles checkboxes.
     * Records the resulting number of checked and unchecked checkboxes for subsequent verification.
     * @param {string} emailId - Additional email ID(s) to set.
     * @param {string} numberOfDays - Number of days to set.
     * @returns {Promise<{ checkedCount: number, uncheckedCount: number }>}
     **/
    async updateDetails(emailId, numberOfDays) {
        return await test.step(`Update email template details with email: "${emailId}"`, async () => {
            await this.waitForVisible(this.closeBtn);
            await this.clear(this.emailToInput);
            await this.fill(this.emailToInput, emailId);

            if (await this.isVisible(this.txtAccountsCreatedinPastXDays, { timeout: 500 })) {
                await this.clear(this.txtAccountsCreatedinPastXDays);
                await this.fill(this.txtAccountsCreatedinPastXDays, numberOfDays);
            }

            if (await this.isVisible(this.txtReminderStartDate, { timeout: 500 })) {
                await this.click(this.txtReminderStartDate);
                await this.waitForVisible(this.calendarDate);
                await this.click(this.calendarDate);
            }

            const initialChecked = await this.checkedCheckboxes.count();
            const initialUnchecked = await this.uncheckedCheckboxes.count();
            const totalCheckboxes = await this.allCheckboxes.count();

            // Toggle all visible checkboxes in the modal
            for (let i = 0; i < totalCheckboxes; i++) {
                const input = this.allCheckboxes.nth(i);
                await this.click(input);
            }

            // Capture resulting counts after toggling
            this.expectedCheckedCount = await this.checkedCheckboxes.count();
            this.expectedUncheckedCount = await this.uncheckedCheckboxes.count();

            console.log(`[EmailTemplates] Checkbox update summary:`);
            console.log(`  - Initial state: Checked = ${initialChecked}, Unchecked = ${initialUnchecked}`);
            console.log(`  - Toggled: Checked ${initialUnchecked} box(es), Unchecked ${initialChecked} box(es)`);
            console.log(`  - Resulting state: Checked = ${this.expectedCheckedCount}, Unchecked = ${this.expectedUncheckedCount}`);

            return {
                checkedCount: this.expectedCheckedCount,
                uncheckedCount: this.expectedUncheckedCount
            };
        });
    }

    /**
     * Verifies that the template details (email ID and checkbox counts) match the expected values.
     * @param {string} emailId - Expected additional email ID.
     * @param {string} numberOfDays - Expected number of days.
     * @param {number} [expectedChecked=this.expectedCheckedCount] - Expected checked checkbox count.
     * @param {number} [expectedUnchecked=this.expectedUncheckedCount] - Expected unchecked checkbox count.
     * @returns {Promise<{ checkedCount: number, uncheckedCount: number }>}
     **/
    async verifyDetails(emailId, numberOfDays, expectedChecked = this.expectedCheckedCount, expectedUnchecked = this.expectedUncheckedCount) {
        return await test.step(`Verify email template details are updated`, async () => {
            await this.waitForVisible(this.closeBtn);
            await expect(this.emailToInput).toHaveValue(emailId);

            if (await this.isVisible(this.txtAccountsCreatedinPastXDays, { timeout: 500 })) {
                await expect(this.txtAccountsCreatedinPastXDays).toHaveValue(numberOfDays);
            }

            const actualChecked = await this.checkedCheckboxes.count();
            const actualUnchecked = await this.uncheckedCheckboxes.count();

            console.log(`[EmailTemplates] Verifying details:`);
            console.log(`  - Expected Email: "${emailId}", Actual: "${await this.emailToInput.inputValue()}"`);
            console.log(`  - Checked Checkboxes: Expected ${expectedChecked}, Actual ${actualChecked}`);
            console.log(`  - Unchecked Checkboxes: Expected ${expectedUnchecked}, Actual ${actualUnchecked}`);

            expect(actualChecked).toBe(expectedChecked);
            expect(actualUnchecked).toBe(expectedUnchecked);

            return {
                checkedCount: actualChecked,
                uncheckedCount: actualUnchecked
            };
        });
    }

    /**
     * Edits the first visible email template, updates details, saves, and verifies persisted changes after re-opening.
     * @param {string} emailId - Additional email ID to set.
     * @param {string} numberOfDays - Number of days to set.
     */
    async editSaveAndVerifyFirstEmail(emailId, numberOfDays) {
        await this.clickFirstEmailEdit();
        await this.updateDetails(emailId, numberOfDays);
        await this.clickSave();
        await this.verifySuccessMessage();
        await this.clickClose();
        await this.clickFirstEmailEdit();
        await this.verifyDetails(emailId, numberOfDays);
        await this.clickClose();
    }
}

