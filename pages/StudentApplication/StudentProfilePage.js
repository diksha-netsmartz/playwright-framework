const BasePage = require('../../utils/BasePage');

/**
 * Page Object representing the Student Profile Page in the Student Portal (CSP).
 * Handles updating student profile information and asserting update status.
 **/
class StudentProfilePage extends BasePage {

    /**
     * Initializes locators for the Student Profile Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Profile input fields
        this.parent1GuardianNameTxt = page.getByRole('textbox', { name: 'Parent1/Guardian Name' });
        this.parentPhoneTxt = page.getByRole('textbox', { name: 'Parent Phone' });
        this.homePhoneTxt = page.getByRole('textbox', { name: 'Home Phone' });
        this.parentNameTxt = page.getByRole('textbox', { name: 'Parent Name' });

        // Action buttons
        this.updateBtn = page.getByRole('button', { name: 'Update' });
        this.yesConfirmationBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        // Notification / Alert message
        this.successAlert = page.locator('#alertSuccessMessage');
    }

    /**
     * Updates student profile fields with the provided details.
     * @param {Object} details - Profile fields to update.
     * @param {string} [details.parent1GuardianName] - Parent 1 / Guardian name.
     * @param {string} [details.homePhone] - Home phone number.
     * @param {string} [details.parentPhone] - Parent phone number.
     **/
    async updateProfileDetails(details = {}) {
        await this.verifyVisible(this.parent1GuardianNameTxt);
        await this.clear(this.parent1GuardianNameTxt);
        await this.fill(this.parent1GuardianNameTxt, details.parent1GuardianName);


        await this.verifyVisible(this.homePhoneTxt);
        await this.clear(this.homePhoneTxt);
        await this.fill(this.homePhoneTxt, details.homePhone);


        await this.verifyVisible(this.parentPhoneTxt);
        await this.clear(this.parentPhoneTxt);
        await this.fill(this.parentPhoneTxt, details.parentPhone);

    }

    /**
     * Clicks on the Update button and confirms the confirmation dialog if presented.
     **/
    async clickUpdate() {
        await this.verifyVisible(this.updateBtn);
        await this.click(this.updateBtn);

        if (await this.isVisible(this.yesConfirmationBtn)) {
            await this.click(this.yesConfirmationBtn);
        }
        await this.waitForLoaders();
    }

    /**
     * Verifies that the profile details were updated successfully.
     **/
    async verifyProfileUpdateSuccess() {
        await this.verifyVisible(this.successAlert);
        await this.verifyContainsText(this.successAlert, 'Details updated successfully.');
    }

    /**
     * Verifies that the profile fields display the expected values in their value attributes.
     * @param {Object} expectedDetails - Expected profile field values.
     * @param {string} [expectedDetails.parent1GuardianName] - Expected parent 1 / guardian name.
     * @param {string} [expectedDetails.homePhone] - Expected home phone.
     * @param {string} [expectedDetails.parentPhone] - Expected parent phone.
     **/
    async verifyProfileDetails(expectedDetails = {}) {
        if (expectedDetails.parent1GuardianName !== undefined) {
            await this.verifyVisible(this.parent1GuardianNameTxt);
            await this.verifyAttribute(this.parent1GuardianNameTxt, 'value', expectedDetails.parent1GuardianName);
        }

        if (expectedDetails.homePhone !== undefined) {
            await this.verifyVisible(this.homePhoneTxt);
            await this.verifyAttribute(this.homePhoneTxt, 'value', expectedDetails.homePhone);
        }

        if (expectedDetails.parentPhone !== undefined) {
            await this.verifyVisible(this.parentPhoneTxt);
            await this.verifyAttribute(this.parentPhoneTxt, 'value', expectedDetails.parentPhone);
        }
    }

}

module.exports = StudentProfilePage;
