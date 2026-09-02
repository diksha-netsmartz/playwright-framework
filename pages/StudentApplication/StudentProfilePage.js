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
        this.zipcodeTextbox = page.locator('#ZipPostalCode');
        this.dlPermit = page.locator('[name="DLPermit#"]');
        this.wearGlassDropdown = page.locator("button[data-id='WearGlassesContacts']");
        this.wearGlassDropdownValue = page.locator("(//button[@data-id='WearGlassesContacts']//parent::div//li//span[1][not(contains(text(),'Please Select'))])[1]");
        this.permitIssuedDate = page.locator('#dt_Date_PermitIssue');
        this.monthFirstDay = page.locator("//a[text()='1']");
        this.monthLastDay = page.locator("//a[text()='27']");
        this.permitExpireDate = page.locator('#dt_Date_ExpirePermit')
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
     * @param {string} [details.zipcode] - Zip / postal code.
     **/
    async updateProfileDetails(details = {}) {
        await test.step('Fill updated student profile details', async () => {

            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 })
            await this.waitForVisible(this.addressTextbox);
            await this.verifyVisible(this.addressTextbox);
            await this.clear(this.addressTextbox);
            await this.fill(this.addressTextbox, details.address);

            await this.verifyVisible(this.parentPhoneTxt);
            await this.clear(this.parentPhoneTxt);
            await this.fill(this.parentPhoneTxt, details.parentPhone);


            await this.verifyVisible(this.parentGuardianEmail);
            await this.clear(this.parentGuardianEmail);
            await this.fill(this.parentGuardianEmail, details.parentGuardianEmail);


            if (await this.isVisible(this.dlPermit)) {
                await this.fill(this.dlPermit, details.permit);
            }

            if (await this.isVisible(this.wearGlassDropdown)) {
                await this.click(this.wearGlassDropdown);
                await this.click(this.wearGlassDropdownValue);
            }

            if (await this.isVisible(this.permitIssuedDate)) {
                await this.clear(this.permitIssuedDate);
                await this.waitForVisible(this.monthFirstDay);
                await this.click(this.monthFirstDay);
            }

            if (await this.isVisible(this.permitExpireDate)) {
                await this.clear(this.permitExpireDate);
                await this.waitForVisible(this.monthLastDay);
                await this.click(this.monthLastDay);
            }
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
     * @param {string} [expectedDetails.zipcode] - Expected zipcode.
     **/
    async verifyProfileDetails(expectedDetails = {}) {
        await test.step('Verify profile field values match expected', async () => {
            await this.verifyVisible(this.parentPhoneTxt);
            await expect(this.parentPhoneTxt).toHaveValue(expectedDetails.parentPhone);


            await this.verifyVisible(this.parentGuardianEmail);
            await expect(this.parentGuardianEmail).toHaveValue(expectedDetails.parentGuardianEmail);


            await this.verifyVisible(this.addressTextbox);
            await expect(this.addressTextbox).toHaveValue(expectedDetails.address);

            if (await this.isVisible(this.dlPermit)) {
                await expect(this.dlPermit).toHaveValue(expectedDetails.permit);
            }


        });
    }
}

