import BasePage from '@utils/BasePage';
import { test, expect } from '@playwright/test';

/**
 * Page Object representing the Staff Profile Page in the Staff Portal (CSM).
 * Handles updating staff profile details and verifying updated values.
 **/
export default class StaffProfilePage extends BasePage {

    /**
     * Initializes locators for the Staff Profile Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);
        this.staffProfileHeading = page.locator("//h3[contains(text(),'Staff Profile')]");

        // Profile input fields
        this.homePhoneTxt = page.locator('#HomePhone')
        this.cellPhoneTxt = page.locator('#CellPhone')
        this.otherPhoneTxt = page.locator('#OtherPhone');
        this.emergencyContactNameTxt = page.locator('#EmergencyContactName')
        this.emergencyContactPhoneTxt = page.locator('#EmergencyContactPhone')
        this.emergencyContactRelation = page.locator('#EmergencyContactRelation')
        this.licenseNumberTxt = page.getByRole('textbox', { name: 'Instructor/Staff License#' })
        this.instructorPermitNumberTxt = page.locator('#InstructorPermitNumber')
        this.cityTxt = page.locator('#City')
        this.zipTxt = page.locator('#Zip')
        this.zoomHostUrl = page.locator('#ZoomHostURL');
        this.zoomUserUrl = page.locator('#ZoomUserURL')
        this.staffCodeTxt = page.locator('#StaffCode')
        this.certExpDate = page.locator('#date_CertExp')
        this.inCarPermitIssueDate = page.locator('#date_InCarPermitIssue')
        this.certificateNumber = page.locator('#CertificateNumber')
        this.emailTxt = page.locator('#Email');
        this.stateDropdown = page.locator("//button[@data-id='State']")
        this.stateDropdownValue = page.locator("(//button[@data-id='State']//parent::div//ul//li//span[1][not(contains(text(),'Select'))])[1]");
        this.locationDropdown = page.locator("//button[@data-id='Location']")
        this.locationDropdownValue = page.locator("(//button[@data-id='Location']//parent::div//ul//li//span[1][not(contains(text(),'Select'))])[1]");
        this.notesTextboxArea = page.locator('div.note-editable:visible');
        this.notesAddedTextarea = page.locator("div[role='textbox'] p")

        this.selectedState = '';
        this.selectedLocation = '';

        // Action buttons
        this.updateBtn = page.getByRole('button', { name: 'Update' });
        this.yesConfirmationBtn = page.locator("//a[@data-apply='confirmation' and text()='Yes']");

        // Notification / Alert message
        this.successAlert = page.getByText('Details updated successfully.');

        // Profile Tab navigation locators
        this.employeeHoursTab = page.getByRole('tab', { name: 'Employee Hours' })
        // Employee Hours tab locators
        this.teachingEmpHours = page.locator('#teachingEmpHours');
        this.teachingSubTab = page.locator("//a[@href='#teachingEmpHours']")
        this.otherSubTab = page.locator("//a[@href='#otherEmpHours']")
        this.otherTabTable = page.locator('#otherEmpHours');
        this.addNewOtherBtn = page.getByRole('link', { name: 'Add New Other' })
        this.filterButton = page.getByRole('link', { name: 'FILTER' });
        this.selectDateRangeTextbox = page.getByRole('textbox', { name: 'Select date range' });
        this.searchTextbox = page.locator("//div[@id='tbTeachingList_filter']//input[@placeholder='Search']");
    }

    /**
     * Updates staff profile fields with dynamic runtime details.
     * @param {Object} details - Profile fields to update.
     * @param {string} [details.homePhone] - Home phone number.
     * @param {string} [details.cellPhone] - Cell phone number.
     * @param {string} [details.otherPhone] - Other phone number.
     * @param {string} [details.emergencyContactName] - Emergency contact name.
     * @param {string} [details.emergencyContactPhone] - Emergency contact phone.
     * @param {string} [details.emergencyContactRelation] - Emergency contact relation.
     * @param {string} [details.licenseNumber] - Instructor/Staff license number.
     * @param {string} [details.instructorPermitNumber] - Instructor permit number.
     * @param {string} [details.city] - City.
     * @param {string} [details.zip] - Zip code.
     * @param {string} [details.zoomHostUrl] - Zoom host URL.
     * @param {string} [details.zoomUserUrl] - Zoom user URL.
     * @param {string} [details.staffCode] - Staff code.
     * @param {string} [details.certExpDate] - Certificate expiration date.
     * @param {string} [details.inCarPermitIssueDate] - In-car permit issue date.
     * @param {string} [details.certificateNumber] - Certificate number.
     * @param {string} [details.email] - Email.
     * @param {string} [details.notes] - Notes.
     **/
    async updateProfileDetails(details = {}) {
        await test.step('Fill updated staff profile details', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.verifyVisible(this.staffProfileHeading);

            if (await this.isVisibleAndEnabled(this.homePhoneTxt)) {
                await this.clear(this.homePhoneTxt);
                await this.fill(this.homePhoneTxt, details.homePhone);
            }

            if (await this.isVisibleAndEnabled(this.cellPhoneTxt)) {
                await this.clear(this.cellPhoneTxt);
                await this.fill(this.cellPhoneTxt, details.cellPhone);
            }

            if (await this.isVisibleAndEnabled(this.otherPhoneTxt)) {
                await this.clear(this.otherPhoneTxt);
                await this.fill(this.otherPhoneTxt, details.otherPhone);
            }

            if (await this.isVisibleAndEnabled(this.emergencyContactNameTxt)) {
                await this.clear(this.emergencyContactNameTxt);
                await this.fill(this.emergencyContactNameTxt, details.emergencyContactName);
            }

            if (await this.isVisibleAndEnabled(this.emergencyContactPhoneTxt)) {
                await this.clear(this.emergencyContactPhoneTxt);
                await this.fill(this.emergencyContactPhoneTxt, details.emergencyContactPhone);
            }

            if (await this.isVisibleAndEnabled(this.emergencyContactRelation)) {
                await this.clear(this.emergencyContactRelation);
                await this.fill(this.emergencyContactRelation, details.emergencyContactRelation);
            }

            if (await this.isVisibleAndEnabled(this.licenseNumberTxt)) {
                await this.clear(this.licenseNumberTxt);
                await this.fill(this.licenseNumberTxt, details.licenseNumber);
            }

            if (await this.isVisibleAndEnabled(this.instructorPermitNumberTxt)) {
                await this.clear(this.instructorPermitNumberTxt);
                await this.fill(this.instructorPermitNumberTxt, details.instructorPermitNumber);
            }

            if (await this.isVisibleAndEnabled(this.cityTxt)) {
                await this.clear(this.cityTxt);
                await this.fill(this.cityTxt, details.city);
            }

            if (await this.isVisibleAndEnabled(this.zipTxt)) {
                await this.clear(this.zipTxt);
                await this.fill(this.zipTxt, details.zip);
            }

            if (await this.isVisibleAndEnabled(this.zoomHostUrl)) {
                await this.clear(this.zoomHostUrl);
                await this.fill(this.zoomHostUrl, details.zoomHostUrl);
            }

            if (await this.isVisibleAndEnabled(this.zoomUserUrl)) {
                await this.clear(this.zoomUserUrl);
                await this.fill(this.zoomUserUrl, details.zoomUserUrl);
            }

            if (await this.isVisibleAndEnabled(this.staffCodeTxt)) {
                await this.clear(this.staffCodeTxt);
                await this.fill(this.staffCodeTxt, details.staffCode);
            }

            if (await this.isVisibleAndEnabled(this.certExpDate)) {
                await this.clear(this.certExpDate);
                await this.pressSequentially(this.certExpDate, this.formatDateWithSlashes(details.certExpDate));
            }

            if (await this.isVisibleAndEnabled(this.inCarPermitIssueDate)) {
                await this.clear(this.inCarPermitIssueDate);
                await this.pressSequentially(this.inCarPermitIssueDate, this.formatDateWithSlashes(details.inCarPermitIssueDate));
            }

            if (await this.isVisibleAndEnabled(this.certificateNumber)) {
                await this.clear(this.certificateNumber);
                await this.pressSequentially(this.certificateNumber, details.certificateNumber);
            }

            if (await this.isVisibleAndEnabled(this.emailTxt)) {
                await this.clear(this.emailTxt);
                await this.fill(this.emailTxt, details.email);
            }

            if (await this.isVisibleAndEnabled(this.stateDropdown)) {
                await this.click(this.stateDropdown);
                await this.waitForVisible(this.stateDropdownValue);
                this.selectedState = (await this.stateDropdownValue.innerText()).trim();
                await this.click(this.stateDropdownValue);
            }

            if (await this.isVisibleAndEnabled(this.locationDropdown)) {
                await this.click(this.locationDropdown);
                await this.waitForVisible(this.locationDropdownValue);
                this.selectedLocation = (await this.locationDropdownValue.innerText()).trim();
                await this.click(this.locationDropdownValue);
            }

            if (await this.isVisibleAndEnabled(this.notesTextboxArea)) {
                await this.clear(this.notesTextboxArea);
                await this.fill(this.notesTextboxArea, details.notes);
            }
        });
    }

    /**
     * Clicks on the Update button and confirms the Yes confirmation dialog.
     **/
    async clickUpdate() {
        await test.step('Click Update and confirm changes', async () => {
            await this.waitForVisible(this.updateBtn, 1000);
            await this.click(this.updateBtn);

            // Wait and click Yes on the dynamic confirmation popup
            await this.waitForVisible(this.yesConfirmationBtn, 1000);
            await this.click(this.yesConfirmationBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the 'Details updated successfully.' message is displayed.
     **/
    async verifyProfileUpdateSuccess() {
        await test.step('Verify "Details updated successfully." message', async () => {
            await this.waitForVisible(this.successAlert, 10000);
            await this.verifyVisible(this.successAlert);
        });
    }

    /**
     * Verifies profile field values after saving by validating value attribute / property.
     * @param {Object} expectedDetails - Expected profile field values.
     * @param {string} [expectedDetails.homePhone] - Expected home phone.
     * @param {string} [expectedDetails.cellPhone] - Expected cell phone.
     * @param {string} [expectedDetails.otherPhone] - Expected other phone.
     * @param {string} [expectedDetails.emergencyContactName] - Expected emergency contact name.
     * @param {string} [expectedDetails.emergencyContactPhone] - Expected emergency contact phone.
     * @param {string} [expectedDetails.emergencyContactRelation] - Expected emergency contact relation.
     * @param {string} [expectedDetails.licenseNumber] - Expected instructor/staff license number.
     * @param {string} [expectedDetails.instructorPermitNumber] - Expected instructor permit number.
     * @param {string} [expectedDetails.city] - Expected city.
     * @param {string} [expectedDetails.zip] - Expected zip code.
     * @param {string} [expectedDetails.zoomHostUrl] - Expected zoom host URL.
     * @param {string} [expectedDetails.zoomUserUrl] - Expected zoom user URL.
     * @param {string} [expectedDetails.staffCode] - Expected staff code.
     * @param {string} [expectedDetails.certExpDate] - Expected certificate expiration date.
     * @param {string} [expectedDetails.inCarPermitIssueDate] - Expected in-car permit issue date.
     * @param {string} [expectedDetails.certificateNumber] - Expected certificate number.
     * @param {string} [expectedDetails.email] - Expected email.
     * @param {string} [expectedDetails.notes] - Expected notes.
     **/
    async verifyProfileDetails(expectedDetails = {}) {
        await test.step('Verify profile details after save by validating value attribute', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.verifyVisible(this.staffProfileHeading);

            if (await this.isVisibleAndEnabled(this.homePhoneTxt) && !await this.isMasked(this.homePhoneTxt)) {
                await expect(this.homePhoneTxt).toHaveValue(expectedDetails.homePhone);
            }

            if (await this.isVisibleAndEnabled(this.cellPhoneTxt) && !await this.isMasked(this.cellPhoneTxt)) {
                await expect(this.cellPhoneTxt).toHaveValue(expectedDetails.cellPhone);
            }

            if (await this.isVisibleAndEnabled(this.otherPhoneTxt) && !await this.isMasked(this.otherPhoneTxt)) {
                await expect(this.otherPhoneTxt).toHaveValue(expectedDetails.otherPhone);
            }

            if (await this.isVisibleAndEnabled(this.emergencyContactNameTxt)) {
                await expect(this.emergencyContactNameTxt).toHaveValue(expectedDetails.emergencyContactName);
            }

            if (await this.isVisibleAndEnabled(this.emergencyContactPhoneTxt) && !await this.isMasked(this.emergencyContactPhoneTxt)) {
                await expect(this.emergencyContactPhoneTxt).toHaveValue(expectedDetails.emergencyContactPhone);
            }

            if (await this.isVisibleAndEnabled(this.emergencyContactRelation)) {
                await expect(this.emergencyContactRelation).toHaveValue(expectedDetails.emergencyContactRelation);
            }

            if (await this.isVisibleAndEnabled(this.licenseNumberTxt)) {
                await expect(this.licenseNumberTxt).toHaveValue(expectedDetails.licenseNumber);
            }

            if (await this.isVisibleAndEnabled(this.instructorPermitNumberTxt)) {
                await expect(this.instructorPermitNumberTxt).toHaveValue(expectedDetails.instructorPermitNumber);
            }

            if (await this.isVisibleAndEnabled(this.cityTxt)) {
                await expect(this.cityTxt).toHaveValue(expectedDetails.city);
            }

            if (await this.isVisibleAndEnabled(this.zipTxt)) {
                await expect(this.zipTxt).toHaveValue(expectedDetails.zip);
            }

            if (await this.isVisibleAndEnabled(this.zoomHostUrl)) {
                await expect(this.zoomHostUrl).toHaveValue(expectedDetails.zoomHostUrl);
            }

            if (await this.isVisibleAndEnabled(this.zoomUserUrl)) {
                await expect(this.zoomUserUrl).toHaveValue(expectedDetails.zoomUserUrl);
            }

            if (await this.isVisibleAndEnabled(this.staffCodeTxt)) {
                await expect(this.staffCodeTxt).toHaveValue(expectedDetails.staffCode);
            }

            if (await this.isVisibleAndEnabled(this.certExpDate)) {
                await expect(this.certExpDate).toHaveValue(this.formatDateWithSlashes(expectedDetails.certExpDate));
            }

            if (await this.isVisibleAndEnabled(this.inCarPermitIssueDate)) {
                await expect(this.inCarPermitIssueDate).toHaveValue(this.formatDateWithSlashes(expectedDetails.inCarPermitIssueDate));
            }
            if (await this.isVisibleAndEnabled(this.certificateNumber)) {
                await expect(this.certificateNumber).toHaveValue(expectedDetails.certificateNumber);
            }

            if (this.selectedState && await this.isVisibleAndEnabled(this.stateDropdown)) {
                await expect(this.stateDropdown).toContainText(this.selectedState);
            }

            if (this.selectedLocation && await this.isVisibleAndEnabled(this.locationDropdown)) {
                await expect(this.locationDropdown).toContainText(this.selectedLocation);
            }

            if (await this.isVisibleAndEnabled(this.notesAddedTextarea)) {
                await expect(this.notesAddedTextarea).toContainText(expectedDetails.notes);
            }

            if (await this.isVisibleAndEnabled(this.emailTxt) && !await this.isMasked(this.emailTxt)) {
                await expect(this.emailTxt).toHaveValue(expectedDetails.email);
            }
        });
    }

    /**
     * Clicks on the Employee Hours tab.
     **/
    async clickEmployeeHoursTab() {
        await test.step('Click on "Employee Hours" tab', async () => {
            await this.waitForVisible(this.employeeHoursTab, 5000);
            await this.click(this.employeeHoursTab);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
            await this.verifyVisible(this.addNewOtherBtn);
            await this.verifyVisible(this.filterButton);
            await this.verifyVisible(this.selectDateRangeTextbox);
            await this.verifyVisible(this.searchTextbox);
        });
    }

    /**
     * Verifies that the Teaching Employee Hours container and table columns are visible.
     **/
    async verifyTeachingEmpHoursVisible() {
        await test.step('Verify Teaching Employee Hours section and columns are visible', async () => {
            await this.waitForVisible(this.teachingEmpHours, 5000);
            await this.verifyVisible(this.teachingEmpHours);

            const expectedHeaders = ['Type', 'Date', 'Start Time', 'Duration', 'Student Name', 'Enrollments'];
            for (const header of expectedHeaders) {
                await expect(this.teachingEmpHours).toContainText(header);
            }
        });
    }

    /**
     * Clicks on the OTHER sub-tab under Employee Hours and verify details.
     **/
    async clickOtherSubTab() {
        await test.step('Click on "OTHER" sub-tab under Employee Hours', async () => {
            await this.waitForVisible(this.otherSubTab, 5000);
            await this.click(this.otherSubTab);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
            await this.waitForVisible(this.otherTabTable, 5000);
            await this.verifyVisible(this.otherTabTable);
            const expectedHeaders = ['Type', 'Activity Date', 'Duration', 'Note', 'Actions'];
            for (const header of expectedHeaders) {
                await expect(this.otherTabTable).toContainText(header);
            }
        });
    }

    /**
     * Clicks on the TEACHING sub-tab under Employee Hours.
     **/
    async clickTeachingSubTab() {
        await test.step('Click on "TEACHING" sub-tab under Employee Hours', async () => {
            await this.waitForVisible(this.teachingSubTab, 5000);
            await this.click(this.teachingSubTab);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
        });
    }

}
