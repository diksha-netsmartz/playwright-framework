import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Company Info.
 * Handles verifying that the Company Info page is loaded and working.
 **/
export default class CompanyInfoPage extends BasePage {

    /**
     * Initializes locators for the Company Info page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        //market place and integrated payment fields
        this.marketplaceTab = page.locator('#marketplace')
        this.zoomMethods = page.locator('div.zoommethods')
        this.zoomButtons = page.locator("//div[@class='zoommethods']//button");
        this.paymentTab = page.locator('#paymentprocessor');
        this.paymentMethodTab = page.locator('div.paymentmethods');
        this.paymentButtons = page.locator('button.paymentbuttons:visible');
        this.paymentModal = page.locator('div.modal-body:visible');
        this.modalButton = page.getByRole('button', { name: 'Send One Time Code' })

        // Company Info Fields
        this.companyNameInput = page.getByRole('textbox', { name: 'Enter Company Name' });
        this.licenseNumberInput = page.getByRole('textbox', { name: 'Enter License Number' });
        this.ownerNameInput = page.getByRole('textbox', { name: 'Enter Owner Name' });
        this.addressInput = page.getByRole('textbox', { name: 'Enter Address' });
        this.cityInput = page.getByRole('textbox', { name: 'Enter City' });
        this.stateDropdown = page.locator("(//div[contains(@id,'int_State')]//span)[1]");
        this.zipCodeInput = page.getByRole('textbox', { name: 'Enter Zip Code' });
        this.schoolCodeInput = page.getByRole('textbox', { name: 'Enter School Code' });
        this.emailInput = page.getByRole('textbox', { name: 'Enter Email' });
        this.phoneInput = page.getByRole('textbox', { name: 'Enter Phone' });
        this.faxInput = page.getByRole('textbox', { name: 'Enter Fax' });
        this.otherInput = page.getByRole('textbox', { name: 'Enter Other' });
        this.websiteInput = page.getByRole('textbox', { name: 'Enter Website' });
        this.notesInput = page.getByRole('textbox', { name: 'Enter Notes' });

        // Action Buttons & Confirmation
        this.saveButton = page.locator('button.btn.green.UpdateCompanyInfo');
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.companyInfoSuccess = page.getByText('Success! Information was successfully saved.');
    }

    /**
     * Verifies that the Integrate Payment page is displayed and working properly.
     **/
    async verifyIntegratePaymentPageIsWorking() {
        await test.step('Verify Integrate Payment page is displayed and working', async () => {
            await this.waitForLoaders();
            await this.verifyVisible(this.paymentTab)
            await this.verifyVisible(this.paymentMethodTab)
            const totalCount = await this.paymentButtons.count();
            expect(totalCount).toBeGreaterThan(0);
            for (let i = 0; i < totalCount; i++) {

                await this.click(this.paymentButtons.nth(i));
                await this.waitForVisible(this.paymentModal)
                await this.verifyVisible(this.modalButton);
                await this.page.mouse.click(10, 10);
                await this.waitForHidden(this.modalButton);
                await this.waitForLoaders();
                await this.page.waitForTimeout(300);
            }

        });
    }

    /**
     * Verifies that the Marketplace page is displayed and working properly.
     **/
    async verifyMarketPlacePageIsWorking() {
        await test.step('Verify Marketplace page is displayed and working', async () => {
            await this.waitForLoaders();
            await this.verifyVisible(this.marketplaceTab)
            await this.verifyVisible(this.zoomMethods)
            const totalCount = await this.zoomButtons.count();
            expect(totalCount).toBeGreaterThan(0);
            for (let i = 0; i < totalCount; i++) {

                await this.click(this.zoomButtons.nth(i));
                await this.waitForVisible(this.paymentModal)
                await this.verifyVisible(this.modalButton);
                await this.page.mouse.click(10, 10);
                await this.waitForHidden(this.modalButton);
                await this.waitForLoaders();
                await this.page.waitForTimeout(300);
            }

        });
    }

    /**
     * Fills the Company Info form fields with the provided runtime data.
     * @param {Object} data - Object containing company details.
     */
    async fillCompanyInfo(data = {}) {
        await test.step('Fill Company Info fields with runtime data', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.companyNameInput);
            if (data.companyName && await this.isVisible(this.companyNameInput)) {
                await this.clear(this.companyNameInput);
                await this.fill(this.companyNameInput, data.companyName);
            }
            if (await this.isVisible(this.licenseNumberInput)) {
                await this.clear(this.licenseNumberInput);
                await this.fill(this.licenseNumberInput, data.licenseNumber);
            }
            if (await this.isVisible(this.ownerNameInput)) {
                await this.clear(this.ownerNameInput);
                await this.fill(this.ownerNameInput, data.ownerName);
            }
            if (await this.isVisible(this.addressInput)) {
                await this.clear(this.addressInput);
                await this.fill(this.addressInput, data.address);
            }
            if (await this.isVisible(this.cityInput)) {
                await this.clear(this.cityInput);
                await this.fill(this.cityInput, data.city);
            }

            if (await this.isVisible(this.stateDropdown)) {
                const alreadySelectedState = (await this.getText(this.stateDropdown))?.trim();
                await this.click(this.stateDropdown);
                const stateToSelect = this.page.locator(`(//ul[@role='listbox']//li//div[not(contains(text(),'${alreadySelectedState}'))])[1]`);
                await this.waitForVisible(stateToSelect);
                this.selectedState = (await this.getText(stateToSelect))?.trim();
                await this.click(stateToSelect);
            }
            if (await this.isVisible(this.zipCodeInput)) {
                await this.clear(this.zipCodeInput);
                await this.fill(this.zipCodeInput, data.zipCode);
            }
            if (await this.isVisible(this.schoolCodeInput)) {
                await this.clear(this.schoolCodeInput);
                await this.fill(this.schoolCodeInput, data.schoolCode);
            }
            if (await this.isVisible(this.emailInput)) {
                await this.clear(this.emailInput);
                await this.fill(this.emailInput, data.email);
            }
            if (await this.isVisible(this.phoneInput)) {
                await this.clear(this.phoneInput);
                await this.fill(this.phoneInput, data.phone);
            }
            if (await this.isVisible(this.faxInput)) {
                await this.clear(this.faxInput);
                await this.fill(this.faxInput, data.fax);
            }
            if (await this.isVisible(this.otherInput)) {
                await this.clear(this.otherInput);
                await this.fill(this.otherInput, data.other);
            }
            if (await this.isVisible(this.websiteInput)) {
                await this.clear(this.websiteInput);
                await this.fill(this.websiteInput, data.website);
            }
            if (await this.isVisible(this.notesInput)) {
                await this.clear(this.notesInput);
                await this.fill(this.notesInput, data.notes);
            }
        });
    }

    /**
     * Clicks the Save button, confirms the confirmation dialog, and verifies the success message.
     */
    async saveCompanyInfo() {
        await test.step('Save Company Info and verify confirmation message', async () => {
            await this.waitForVisible(this.saveButton);
            await this.click(this.saveButton);
            await this.waitForVisible(this.yesConfirmationButton);
            await this.click(this.yesConfirmationButton);
            await this.waitForVisible(this.companyInfoSuccess);
            await this.verifyVisible(this.companyInfoSuccess);
            await this.waitForLoaders();
        });
    }

    /**
     * Updates the Company Info fields with runtime data and saves changes.
     * @param {Object} data - Object containing company details.
     */
    async updateCompanyInfo(data = {}) {
        await test.step('Update Company Info and save', async () => {
            await this.fillCompanyInfo(data);
            await this.saveCompanyInfo();
        });
    }

    /**
     * Verifies that the Company Info form fields match the expected runtime values.
     * @param {Object} expectedData - Object containing expected company details.
     */
    async verifyCompanyInfo(expectedData = {}) {
        await test.step('Verify Company Info fields are updated with expected runtime values', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.companyNameInput);
            if (expectedData.companyName && await this.isVisible(this.companyNameInput)) {
                await expect(this.companyNameInput).toHaveValue(expectedData.companyName);
            }
            if (await this.isVisible(this.licenseNumberInput)) {
                await expect(this.licenseNumberInput).toHaveValue(expectedData.licenseNumber);
            }
            if (await this.isVisible(this.ownerNameInput)) {
                await expect(this.ownerNameInput).toHaveValue(expectedData.ownerName);
            }
            if (await this.isVisible(this.addressInput)) {
                await expect(this.addressInput).toHaveValue(expectedData.address);
            }
            if (await this.isVisible(this.cityInput)) {
                await expect(this.cityInput).toHaveValue(expectedData.city);
            }
            if (await this.isVisible(this.stateDropdown)) {
                await expect(this.stateDropdown).toContainText(this.selectedState);
            }
            if (await this.isVisible(this.zipCodeInput)) {
                await expect(this.zipCodeInput).toHaveValue(expectedData.zipCode);
            }
            if (await this.isVisible(this.schoolCodeInput)) {
                await expect(this.schoolCodeInput).toHaveValue(expectedData.schoolCode);
            }
            if (await this.isVisible(this.emailInput)) {
                await expect(this.emailInput).toHaveValue(expectedData.email);
            }
            if (await this.isVisible(this.phoneInput)) {
                await expect(this.phoneInput).toHaveValue(this.formatPhoneNumber(expectedData.phone));
            }
            if (await this.isVisible(this.faxInput)) {
                await expect(this.faxInput).toHaveValue(this.formatPhoneNumber(expectedData.fax));
            }
            if (await this.isVisible(this.otherInput)) {
                await expect(this.otherInput).toHaveValue(this.formatPhoneNumber(expectedData.other));
            }
            if (await this.isVisible(this.websiteInput)) {
                await expect(this.websiteInput).toHaveValue(expectedData.website);
            }
            if (await this.isVisible(this.notesInput)) {
                await expect(this.notesInput).toHaveValue(expectedData.notes);
            }
        });
    }
}
