import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Page Settings popup tab in Admin Portal.
 * Opened from the dashboard header via the Settings gear icon -> Page Settings.
 * Handles enabling/disabling dashboard widgets (e.g. Communication Message Widget) and saving settings.
 **/
export default class PageSettingsPage extends BasePage {

    /**
     * Initializes locators for the Page Settings popup tab.
     * @param {import('@playwright/test').Page} page - Playwright Page instance (the popup page).
     **/
    constructor(page) {
        super(page);

        // Communication Message Widget locators
        this.communicationMessageWidgetCheckbox = page.locator('#chkCommunicationMessageWidget');
        this.communicationMessageWidgetSpan = page.locator('#chkCommunicationMessageWidget + span.checkmarkbox');
        this.communicationMessageWidgetLabel = page.locator('label.csscheck:has(#chkCommunicationMessageWidget)');

        // Action buttons & feedback
        this.saveSettingsBtn = page.getByRole('button', { name: 'Save Settings' });
        this.successMsg = page.getByText('Settings saved successfully.');
    }

    /**
     * Checks if the Communication Message widget checkbox is currently checked.
     * @returns {Promise<boolean>} True if checked, false otherwise.
     **/
    async isCommunicationMessageWidgetChecked() {
        await this.communicationMessageWidgetCheckbox.waitFor({ state: 'attached', timeout: 15000 });
        const hasCheckedAttr = await this.communicationMessageWidgetCheckbox.getAttribute('checked');
        const isChecked = hasCheckedAttr !== null || await this.communicationMessageWidgetCheckbox.isChecked().catch(() => false);
        return isChecked;
    }

    /**
     * Enables the Communication Message widget by clicking its checkmarkbox span.
     **/
    async enableCommunicationMessageWidget() {
        await test.step('Enable Communication Message Widget in Page Settings', async () => {
            const isChecked = await this.isCommunicationMessageWidgetChecked();
            if (!isChecked) {
                await this.click(this.communicationMessageWidgetSpan);
            }
        });
    }

    /**
     * Disables the Communication Message widget if currently checked.
     **/
    async disableCommunicationMessageWidget() {
        await test.step('Disable Communication Message Widget in Page Settings', async () => {
            const isChecked = await this.isCommunicationMessageWidgetChecked();
            if (isChecked) {
                await this.click(this.communicationMessageWidgetSpan);
            }
        });
    }

    /**
     * Clicks the 'Save Settings' button.
     **/
    async clickSaveSettings() {
        await test.step('Click "Save Settings" button', async () => {
            await this.waitForVisible(this.saveSettingsBtn);
            await this.click(this.saveSettingsBtn);
        });
    }

    /**
     * Verifies that the 'Settings saved successfully.' confirmation message is displayed.
     * @param {number} [timeout=10000] - Wait timeout in ms.
     **/
    async verifySettingsSavedSuccessfully(timeout = 10000) {
        await test.step('Verify "Settings saved successfully." message is displayed', async () => {
            await expect(this.successMsg).toBeVisible({ timeout });
        });
    }

    /**
     * Closes the Page Settings popup tab.
     **/
    async close() {
        await this.page.close().catch(() => { });
    }

    /**
     * Ensures that the Communication Message widget is enabled.
     * If already checked, logs and skips. If not checked, enables it, clicks Save Settings,
     * verifies success message, and closes the tab.
     * @returns {Promise<boolean>} True if it was already checked, false if it had to be enabled.
     **/
    async ensureCommunicationMessageWidgetEnabled() {
        return await test.step('Ensure Communication Message Widget is enabled in Page Settings', async () => {
            const isChecked = await this.isCommunicationMessageWidgetChecked();
            if (isChecked) {
                console.log('[PageSettingsPage] Communication Message Widget is already checked. Skipping.');
            } else {
                console.log('[PageSettingsPage] Communication Message Widget is not checked. Checking and saving...');
                await this.enableCommunicationMessageWidget();
                await this.clickSaveSettings();
                await this.verifySettingsSavedSuccessfully().catch(() => { });
                await this.page.waitForTimeout(1500);
            }
            await this.close();
            return isChecked;
        });
    }
}
