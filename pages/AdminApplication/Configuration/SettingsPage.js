import BasePage from '@utils/BasePage';
import { test } from '@playwright/test';

/**
 * Page Object representing the User Rights page in Admin Portal (Configuration > User Rights).
 * Handles updating User Rights across tabs, submitting changes, and confirming success messages.
 **/
export default class SettingsPage extends BasePage {

    /**
     * Initializes locators for the Settings page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Tabs
        this.instructorTab = page.locator("//ul[@class='nav nav-tabs']//a[text()='Instructor']")

        // Buttons
        this.submitButton = page.getByRole('button', { name: 'Submit' });
        this.yesConfirmationBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.closeSuccessMessageButton = page.locator("(//div[@id='GlobalErrorSuccessDiv']//button)[last()]");

        this.userRightsSuccessMsg = page.getByText('User Rights saved successfully.');

    }

    /**
     * Clicks on the Instructor tab.
     **/
    async clickInstructorTab() {
        await test.step('Click on  Instructor tab', async () => {
            await this.waitForLoaders();
            await this.click(this.instructorTab);
            await this.waitForLoaders();

        });
    }

    /**
     * Clicks on the submit button and confirms if a prompt appears.
     **/
    async clickSubmitButton() {
        await test.step('Click on submit button', async () => {


            await this.waitForVisible(this.submitButton);
            await this.click(this.submitButton);
            await this.click(this.yesConfirmationBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the 'User Rights saved successfully.' message is displayed.
     **/
    async verifySuccessMessage() {
        await test.step('Verify "User Rights saved successfully." message', async () => {
            const successIndicator = this.userRightsSuccessMsg;
            await this.waitForVisible(successIndicator, { timeout: 10000 });
            await this.verifyVisible(successIndicator);
            await this.click(this.closeSuccessMessageButton);
        });
    }
}
