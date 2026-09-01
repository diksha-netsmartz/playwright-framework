import BasePage from '../../utils/BasePage';
import { test, expect } from '@playwright/test';

/**
 * Page Object representing the Student Profile Page in the Student Portal (CSP).
 * Handles updating student profile information and asserting update status.
 **/
export default class StudentProfilePage extends BasePage {

    /**
     * Initializes locators for the Student Profile Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        // Profile input fields
        this.parentPhoneTxt = page.locator('#ParentPhone')
        this.parentGuardianEmail = page.getByPlaceholder('Parent/Guardian Email')
        this.addressTextbox = page.locator('#Address');
        this.cityTextbox = page.locator('#City');
        this.zipcodeTextbox = page.locator('#ZipPostalCode')

        // Action buttons
        this.updateBtn = page.getByRole('button', { name: 'Update' });
        this.yesConfirmationBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        // Notification / Alert message
        this.successAlert = page.locator('#alertSuccessMessage');
    }

    /**
     * Updates student profile fields with the provided details.
     * @param {Object} details - Profile fields to update.
     * @param {string} [details.parentPhone] - Parent phone number.
     * @param {string} [details.parentGuardianEmail] - Parent / Guardian email.
     * @param {string} [details.address] - Street address.
     * @param {string} [details.city] - City.
     * @param {string} [details.zipcode] - Zip / postal code.
     **/
    async updateProfileDetails(details = {}) {
        await test.step('Fill updated student profile details', async () => {

            await this.verifyVisible(this.addressTextbox);
            await this.clear(this.addressTextbox);
            await this.fill(this.addressTextbox, details.address);


            await this.verifyVisible(this.cityTextbox);
            await this.clear(this.cityTextbox);
            await this.fill(this.cityTextbox, details.city);


            await this.verifyVisible(this.zipcodeTextbox);
            await this.clear(this.zipcodeTextbox);
            await this.fill(this.zipcodeTextbox, details.zipcode);


            await this.verifyVisible(this.parentPhoneTxt);
            await this.clear(this.parentPhoneTxt);
            await this.fill(this.parentPhoneTxt, details.parentPhone);


            await this.verifyVisible(this.parentGuardianEmail);
            await this.clear(this.parentGuardianEmail);
            await this.fill(this.parentGuardianEmail, details.parentGuardianEmail);

        });
    }

    /**
     * Clicks on the Update button and confirms the confirmation dialog if presented.
     **/
    async clickUpdate() {
        await test.step('Click Update and confirm changes', async () => {
            await this.verifyVisible(this.updateBtn);
            await this.click(this.updateBtn);

            if (await this.isVisible(this.yesConfirmationBtn)) {
                await this.click(this.yesConfirmationBtn);
            }
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the profile details were updated successfully.
     **/
    async verifyProfileUpdateSuccess() {
        await test.step('Verify "Details updated successfully." message', async () => {
            await this.verifyVisible(this.successAlert);
            await this.verifyContainsText(this.successAlert, 'Details updated successfully.');
        });
    }

    /**
     * Verifies that the profile fields display the expected values.
     * @param {Object} expectedDetails - Expected profile field values.
     * @param {string} [expectedDetails.parentPhone] - Expected parent phone.
     * @param {string} [expectedDetails.parentGuardianEmail] - Expected parent / guardian email.
     * @param {string} [expectedDetails.address] - Expected address.
     * @param {string} [expectedDetails.city] - Expected city.
     * @param {string} [expectedDetails.zipcode] - Expected zipcode.
     **/
    async verifyProfileDetails(expectedDetails = {}) {
        await test.step('Verify profile field values match expected', async () => {
            if (expectedDetails.parentPhone !== undefined) {
                await this.verifyVisible(this.parentPhoneTxt);
                await expect(this.parentPhoneTxt).toHaveValue(expectedDetails.parentPhone);
            }

            if (expectedDetails.parentGuardianEmail !== undefined) {
                await this.verifyVisible(this.parentGuardianEmail);
                await expect(this.parentGuardianEmail).toHaveValue(expectedDetails.parentGuardianEmail);
            }

            if (expectedDetails.address !== undefined) {
                await this.verifyVisible(this.addressTextbox);
                await expect(this.addressTextbox).toHaveValue(expectedDetails.address);
            }

            if (expectedDetails.city !== undefined) {
                await this.verifyVisible(this.cityTextbox);
                await expect(this.cityTextbox).toHaveValue(expectedDetails.city);
            }

            if (expectedDetails.zipcode !== undefined) {
                await this.verifyVisible(this.zipcodeTextbox);
                await expect(this.zipcodeTextbox).toHaveValue(expectedDetails.zipcode);
            }
        });
    }
}

