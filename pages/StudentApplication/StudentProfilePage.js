import BasePage from '@utils/BasePage';
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
        this.middleName = page.locator('#MiddleName')
        this.cityTextbox = page.locator('#City');
        this.zipcodeTextbox = page.locator('#ZipPostalCode');
        this.dlPermit = page.locator('[name="DLPermit#"]').or(page.locator('[name="Permit#"]'));
        this.wearGlassDropdown = page.locator("button[data-id='WearGlassesContacts']");
        this.wearGlassDropdownValue = page.locator("(//button[@data-id='WearGlassesContacts']//parent::div//li//span[1][not(contains(text(),'Please Select'))])[1]");
        this.permitIssuedDate = page.locator('#dt_Date_PermitIssue');
        this.monthFirstDay = page.locator("//a[text()='1']");
        this.monthLastDay = page.locator("//a[text()='27']");
        this.permitExpireDate = page.locator('#dt_Date_ExpirePermit');
        this.coursePassword = page.getByRole('textbox', { name: 'Course Password' });
        this.courseStartDate = page.locator('#dt_CourseStartDate');
        this.studentNotesTextbox = page.locator('#StudentNotes');
        this.medicalConditionsTextbox = page.locator('#MedicalConditions');
        this.preferredPronouns = page.getByRole('textbox', { name: 'Preferred Pronouns' });
        this.assignToLocation = page.locator("button[data-id='AssignToLocation']")
        this.assignToLocationValue = page.locator("(//button[@data-id='AssignToLocation']//parent::div//li//span[1][not(contains(text(),'Please Select'))])[1]");
        this.addressTextbox = page.locator('#Address');
        this.cellPhone = page.locator('#CellPhone')
        // Action buttons
        this.updateBtn = page.getByRole('button', { name: 'Update' });
        this.yesConfirmationBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        // Notification / Alert message
        this.successAlert = page.locator('#alertSuccessMessage');
    }

    /**
     * Updates student profile fields with the provided details.
     * @param {Object} details - Profile fields to update.
     * @param {string} [details.middleName] - Middle name.
     * @param {string} [details.cellPhone] - Student cell phone.
     * @param {string} [details.parentPhone] - Parent phone number.
     * @param {string} [details.parentGuardianEmail] - Parent / Guardian email.
     * @param {string} [details.address] - Street address.
     * @param {string} [details.city] - City.
     * @param {string} [details.zipcode] - Zip / postal code.
     * @param {string} [details.permit] - Permit / DL number.
     * @param {string} [details.coursePassword] - Course password.
     * @param {string} [details.courseStartDate] - Course start date.
     * @param {string} [details.studentNotes] - Student notes.
     * @param {string} [details.medicalConditions] - Medical conditions.
     * @param {string} [details.preferredPronouns] - Preferred pronouns.
     **/
    async updateProfileDetails(details = {}) {
        await test.step('Fill updated student profile details', async () => {

            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 })
            await this.waitForVisible(this.addressTextbox);
            await this.verifyVisible(this.addressTextbox);
            await this.clear(this.addressTextbox);
            await this.fill(this.addressTextbox, details.address);

            if (details.middleName && await this.isVisible(this.middleName, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.middleName);
                await this.fill(this.middleName, details.middleName);
            }

            if (details.cellPhone && await this.isVisible(this.cellPhone, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.cellPhone);
                await this.fill(this.cellPhone, details.cellPhone);
            }

            if (details.city && await this.isVisible(this.cityTextbox, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.cityTextbox);
                await this.fill(this.cityTextbox, details.city);
            }

            if (details.zipcode && await this.isVisible(this.zipcodeTextbox, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.zipcodeTextbox);
                await this.fill(this.zipcodeTextbox, details.zipcode);
            }

            if (await this.isVisible(this.parentPhoneTxt, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.parentPhoneTxt);
                await this.fill(this.parentPhoneTxt, details.parentPhone);
            }

            if (await this.isVisible(this.parentGuardianEmail, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.parentGuardianEmail);
                await this.fill(this.parentGuardianEmail, details.parentGuardianEmail);
            }

            if (await this.isVisible(this.dlPermit.first(), { timeout: 100 }).catch(() => false)) {
                await this.fill(this.dlPermit.first(), details.permit);
            }

            if (await this.isVisible(this.coursePassword, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.coursePassword);
                await this.fill(this.coursePassword, details.coursePassword);
            }

            if (await this.isVisible(this.courseStartDate, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.courseStartDate);
                await this.pressSequentially(this.courseStartDate, details.courseStartDate);
                await this.page.keyboard.press('Tab');
            }

            if (await this.isVisible(this.studentNotesTextbox, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.studentNotesTextbox);
                await this.fill(this.studentNotesTextbox, details.studentNotes);
            }

            if (await this.isVisible(this.medicalConditionsTextbox, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.medicalConditionsTextbox);
                await this.fill(this.medicalConditionsTextbox, details.medicalConditions);
            }

            if (await this.isVisible(this.preferredPronouns, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.preferredPronouns);
                await this.fill(this.preferredPronouns, details.preferredPronouns);
            }

            if (await this.isVisible(this.assignToLocation, { timeout: 100 }).catch(() => false)) {
                await this.click(this.assignToLocation);
                this.selectedLocation = (await this.assignToLocationValue.textContent() || '').trim();
                await this.click(this.assignToLocationValue);
            }

            if (await this.isVisible(this.wearGlassDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.wearGlassDropdown);
                await this.click(this.wearGlassDropdownValue);
            }

            if (await this.isVisible(this.permitIssuedDate, { timeout: 100 }).catch(() => false)) {
                await this.clear(this.permitIssuedDate);
                await this.waitForVisible(this.monthFirstDay);
                await this.click(this.monthFirstDay);
            }

            if (await this.isVisible(this.permitExpireDate, { timeout: 100 }).catch(() => false)) {
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

            if (await this.isVisible(this.yesConfirmationBtn, { timeout: 4000 }).catch(() => false)) {
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
            await this.waitForVisible(this.successAlert, 60000);
            await this.verifyContainsText(this.successAlert, 'Details updated successfully.');
        });
    }

    /**
     * Verifies that the profile fields display the expected values.
     * @param {Object} expectedDetails - Expected profile field values.
     * @param {string} [expectedDetails.middleName] - Expected middle name.
     * @param {string} [expectedDetails.cellPhone] - Expected cell phone.
     * @param {string} [expectedDetails.parentPhone] - Expected parent phone.
     * @param {string} [expectedDetails.parentGuardianEmail] - Expected parent / guardian email.
     * @param {string} [expectedDetails.address] - Expected address.
     * @param {string} [expectedDetails.city] - Expected city.
     * @param {string} [expectedDetails.zipcode] - Expected zipcode.
     * @param {string} [expectedDetails.permit] - Expected permit / DL number.
     * @param {string} [expectedDetails.coursePassword] - Expected course password.
     * @param {string} [expectedDetails.courseStartDate] - Expected course start date.
     * @param {string} [expectedDetails.studentNotes] - Expected student notes.
     * @param {string} [expectedDetails.medicalConditions] - Expected medical conditions.
     * @param {string} [expectedDetails.preferredPronouns] - Expected preferred pronouns.
     **/
    async verifyProfileDetails(expectedDetails = {}) {
        await test.step('Verify profile field values match expected', async () => {
            await this.waitForVisible(this.updateBtn);

            if (expectedDetails.middleName && await this.isVisible(this.middleName, { timeout: 100 }).catch(() => false)) {
                await expect(this.middleName).toHaveValue(expectedDetails.middleName);
            }

            if (expectedDetails.cellPhone && await this.isVisible(this.cellPhone, { timeout: 100 }).catch(() => false)) {
                await expect(this.cellPhone).toHaveValue(expectedDetails.cellPhone);
            }

            if (expectedDetails.city && await this.isVisible(this.cityTextbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.cityTextbox).toHaveValue(expectedDetails.city);
            }

            if (expectedDetails.zipcode && await this.isVisible(this.zipcodeTextbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.zipcodeTextbox).toHaveValue(expectedDetails.zipcode);
            }

            if (await this.isVisible(this.parentPhoneTxt, { timeout: 100 }).catch(() => false)) {
                await expect(this.parentPhoneTxt).toHaveValue(expectedDetails.parentPhone);
            }

            if (await this.isVisible(this.parentGuardianEmail, { timeout: 100 }).catch(() => false)) {
                await expect(this.parentGuardianEmail).toHaveValue(expectedDetails.parentGuardianEmail);
            }

            if (await this.isVisible(this.addressTextbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.addressTextbox).toHaveValue(expectedDetails.address);
            }

            if (await this.isVisible(this.dlPermit.first(), { timeout: 100 }).catch(() => false)) {
                await expect(this.dlPermit.first()).toHaveValue(expectedDetails.permit);
            }

            if (await this.isVisible(this.coursePassword, { timeout: 100 }).catch(() => false)) {
                await expect(this.coursePassword).toHaveValue(expectedDetails.coursePassword);
            }

            if (await this.isVisible(this.courseStartDate, { timeout: 100 }).catch(() => false)) {
                await expect(this.courseStartDate).toHaveValue(expectedDetails.courseStartDate);
            }

            if (await this.isVisible(this.studentNotesTextbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.studentNotesTextbox).toHaveValue(expectedDetails.studentNotes);
            }

            if (await this.isVisible(this.medicalConditionsTextbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.medicalConditionsTextbox).toHaveValue(expectedDetails.medicalConditions);
            }

            if (await this.isVisible(this.preferredPronouns, { timeout: 100 }).catch(() => false)) {
                await expect(this.preferredPronouns).toHaveValue(expectedDetails.preferredPronouns);
            }

            const expectedLocation = this.selectedLocation;
            if (expectedLocation && await this.isVisible(this.assignToLocation, { timeout: 100 }).catch(() => false)) {
                expect(await this.getAttribute(this.assignToLocation, 'title')).toContain(expectedLocation);
            }
        });
    }
}

