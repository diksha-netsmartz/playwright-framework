import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Zip Code page in Admin Portal (Configuration > Zip Code).
 * Handles adding new zip codes, selecting/updating zip codes, and saving changes.
 **/
export default class ZipCodePage extends BasePage {

    /**
     * Initializes locators for the Zip Code page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        this.addNewZipCodeInput = page.getByRole('textbox', { name: 'Add New Zip Code' });
        this.addBtn = page.getByRole('button', { name: 'Add' });
        this.saveBtn = page.locator("//button[contains(@data-toggle,'UpdateZipInfo')]")
        this.yesConfirmationBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']")
    }

    /**
     * Adds a new zip code using the 'Add New Zip Code' input and 'Add' button.
     * @param {string} zipCode - Zip code to add.
     **/
    async addZipCode(zipCode) {
        await test.step(`Add new zip code: ${zipCode}`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewZipCodeInput);
            await this.click(this.addNewZipCodeInput);
            await this.fill(this.addNewZipCodeInput, zipCode);
            await this.click(this.addBtn);
            await this.waitForLoaders();
            await this.verifySuccessMessage();
        });
    }

    /**
     * Selects a zip code from the selectable list box.
     * @param {string} zipCode - Zip code to select.
     **/
    async selectZipCode(zipCode) {
        await test.step(`Select zip code "${zipCode}" from list`, async () => {
            const item = this.page.locator(`xpath=//li[@class='ms-elem-selectable']//span[text()='${zipCode}']`);
            if (await this.isVisible(item, { timeout: 3000 }).catch(() => false)) {
                await this.click(item);
            }
            const itemSelected = this.page.locator(`xpath=//li[@class='ms-elem-selection ms-selected']//span[text()='${zipCode}']`);

            await expect(itemSelected).toContainText(zipCode);
        });
    }

    /**
     * Clicks the Save button, confirms with Yes, and verifies success.
     **/
    async saveZipCodeSelection() {
        await test.step('Save zip code changes and confirm', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);
            await this.waitForVisible(this.yesConfirmationBtn);
            await this.click(this.yesConfirmationBtn);
            await this.waitForLoaders();
            await this.verifySuccessMessage();
        });
    }

    /**
     * Verifies that the success alert message is displayed with expected text.
     **/
    async verifySuccessMessage() {
        await test.step('Verify "Success! Information was successfully saved." alert message', async () => {
            const successMsg = this.page.getByText('Success! Information was successfully saved.');
            await this.waitForVisible(successMsg);
            await this.verifyVisible(successMsg);

        });
    }
}
