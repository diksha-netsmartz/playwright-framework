import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';
import path from 'path';

/**
 * Page Object representing the Staff Page in Admin Portal (Account Management > Staff).
 * Handles adding new staff members with dynamic unique credentials, uploading profile pictures,
 * configuring roles and working hours, saving, and verifying presence in the data grid.
 **/
export default class StaffPage extends BasePage {

    /**
     * Initializes locators for Staff Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("#aAddNewStaff");

        // Form Locators - Basic / Personal Details
        this.statusDropdown = page.locator("xpath=//select[@id='Status']//parent::div//button");
        this.statusOptionActive = page.locator("xpath=//select[@id='Status']//parent::div//div//span[text()='Active']");
        this.statusOptionDeactivated = page.locator("xpath=//select[@id='Status']//parent::div//div//span[text()='Deactivated']");

        this.roleDropdown = page.locator("xpath=//select[@id='StaffType']//parent::div//button");
        this.roleOptionInstructor = page.locator("xpath=//select[@id='StaffType']//parent::div//div//span[text()='Instructor']");

        this.locationDropdown = page.locator("xpath=//select[@id='Location']//parent::div//button");
        this.locationDropdownOption = page.locator("xpath=(//select[@id='Location']//parent::div//div//span[contains(text(),'Location')])[1]");

        this.staffCodeInput = page.getByRole('textbox', { name: 'Staff Code' });

        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.middleNameInput = page.getByRole('textbox', { name: 'Middle Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });

        this.addressInput = page.getByRole('textbox', { name: 'Address' });
        this.cityInput = page.getByRole('textbox', { name: 'City' });
        this.stateDropdown = page.locator("xpath=//select[@id='State']//parent::div//button");
        this.stateOption = page.locator("(//select[@id='State']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.zipInput = page.getByRole('textbox', { name: 'Zip' });

        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.homePhoneInput = page.getByRole('textbox', { name: 'Home Phone' });
        this.cellPhoneInput = page.getByRole('textbox', { name: 'Cell Phone' });

        this.emergencyContactNameInput = page.getByRole('textbox', { name: 'Emergency Contact Name' });
        this.emergencyContactRelationInput = page.getByRole('textbox', { name: 'Emergency Contact Relation' });
        this.emergencyContactPhoneInput = page.getByRole('textbox', { name: 'Emergency Contact Phone' });

        this.dateOfBirthInput = page.locator('#date_Birth');
        this.instructorPermitNumberInput = page.getByRole('textbox', { name: 'Instructor Permit Number' });
        this.permitIssueDateInput = page.locator('#date_InCarPermitIssue');
        this.certExpDateInput = page.locator('#date_CertExp');

        this.userNameInput = page.getByRole('textbox', { name: 'User Name' });
        this.passwordInput = page.getByPlaceholder('Password', { exact: true });
        this.reEnterPasswordInput = page.getByPlaceholder('Re Enter Password');

        this.assignAppointmentColorCheckbox = page.locator("xpath=//input[@id='Bitappointmentcolor']//following-sibling::ins");
        this.requireManualEnablingOfZoomButton = page.locator("xpath=//input[contains(@id,'Zoom')]//following-sibling::ins");

        this.zoomPmiInput = page.getByRole('textbox', { name: 'Zoom PMI' });
        this.staffSurveyLinkInput = page.getByRole('textbox', { name: 'Staff Survey Link' });

        // File / Picture Upload Locators
        this.selectImageBtn = page.getByText('Select Image', { exact: true });
        this.fileInput = page.locator("input[type='file']").first();
        this.saveImageButton = page.locator("xpath=//div[text()='Save']");

        // Navigation & Action Buttons
        this.continueBtn = page.locator("xpath=//a[contains(text(),'Continue') and not(contains(@class,'hide'))]");
        this.workingHoursTab = page.locator("xpath=//b[text()='Working Hours']//ancestor::a[@aria-expanded='true']");
        this.saveBtn = page.locator('#btnSave, #btnUpdateStaffInfo').first();

        this.closeBtn = page.locator("xpath=//b[contains(text(),'New Staff')]//ancestor::div[contains(@class,'modal-content')]//button[contains(text(),'Close') and not(@aria-hidden)]");

        // Grid / Table Locators
        this.searchTextbox = page.locator("input[type='search']").first();
        this.staffTable = page.locator('#stafftable');
        this.editIcon = page.getByTitle('Edit');
    }

    /**
     * Clicks the 'Add New' button to open the Add Staff form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button for Staff', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    async uploadProfilePicture(fileName = 'profilePicture.jpg') {
        await test.step(`Upload staff profile picture: "${fileName}"`, async () => {
            const filePath = path.resolve(__dirname, "../../../test-data/uploads", fileName);

            // Intercept file chooser to prevent OS desktop popup
            const fileChooserPromise = this.page.waitForEvent('filechooser');
            await this.click(this.selectImageBtn);
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(filePath);

            await this.waitForLoaders();
            await this.page.waitForTimeout(1000);

            // Click Save button on the crop modal if visible
            if (await this.saveImageButton.isVisible().catch(() => false)) {
                await this.click(this.saveImageButton);
                await this.waitForLoaders();
                await this.page.waitForTimeout(500);
            }
        });
    }

    /**
     * Fills the Add Staff form with dynamic values and required fields.
     * @param {Object} data - Base staff data from fixture.
     * @returns {Promise<Object>} Created staff details object.
     **/
    async fillStaffDetails(data = {}) {
        return await test.step('Fill all required Staff details', async () => {
            this.uniqueId = `${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
            this.staffCode = `${Math.floor(1000 + Math.random() * 9000)}`;
            this.firstName = `${data.firstName || 'Alexander'}_${this.uniqueId}`;
            this.middleName = data.middleName || 'James';
            this.lastName = `${data.lastName || 'Mitchell'}_${this.uniqueId}`;

            this.address = data.address || '742 Evergreen Terrace';
            this.city = data.city || 'Dover';
            this.zip = data.zip || '19901';
            this.email = `staff_${this.uniqueId}@testmail.com`;
            this.homePhone = data.homePhone || '3025550143';
            this.cellPhone = data.cellPhone || '3025550198';
            this.emergencyContactName = data.emergencyContactName || 'Sarah Mitchell';
            this.emergencyContactRelation = data.emergencyContactRelation || 'Spouse';
            this.emergencyContactPhone = data.emergencyContactPhone || '3025550177';
            this.dateOfBirth = data.dateOfBirth;
            this.permitIssueDate = data.permitIssueDate;
            this.certExpDate = data.certExpDate;
            this.instructorPermitNumber = data.instructorPermitNumber || `${Math.floor(100000000000 + Math.random() * 900000000000)}`;
            this.userName = `user_${this.uniqueId}`;
            this.password = data.password || 'Password@123';
            this.zoomPmi = data.zoomPmi || '8794561230';
            this.staffSurveyLink = data.staffSurveyLink || 'https://feedback.drivingschool.com/survey';

            await this.waitForLoaders();

            // 1. Select Status -> Active
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusOptionActive);
            await this.click(this.statusOptionActive);

            // 2. Select Role -> Instructor
            await this.click(this.roleDropdown);
            await this.waitForVisible(this.roleOptionInstructor);
            await this.click(this.roleOptionInstructor);

            // 3. Select Location
            await this.click(this.locationDropdown);
            await this.waitForVisible(this.locationDropdownOption);
            await this.click(this.locationDropdownOption);

            // 4. Staff Code
            await this.waitForVisible(this.staffCodeInput);
            await this.fill(this.staffCodeInput, this.staffCode);

            // 5. Names
            await this.waitForVisible(this.firstNameInput);
            await this.fill(this.firstNameInput, this.firstName);
            await this.fill(this.middleNameInput, this.middleName);
            await this.fill(this.lastNameInput, this.lastName);

            // 6. Address & City
            await this.fill(this.addressInput, this.address);
            await this.fill(this.cityInput, this.city);

            // 7. State -> DE
            await this.click(this.stateDropdown);
            await this.waitForVisible(this.stateOption);
            await this.click(this.stateOption);

            // 8. Zip & Contacts
            await this.fill(this.zipInput, this.zip);
            await this.fill(this.emailInput, this.email);
            await this.fill(this.homePhoneInput, this.homePhone);
            await this.fill(this.cellPhoneInput, this.cellPhone);

            // 9. Emergency Contact
            await this.fill(this.emergencyContactNameInput, this.emergencyContactName);
            await this.fill(this.emergencyContactRelationInput, this.emergencyContactRelation);
            await this.fill(this.emergencyContactPhoneInput, this.emergencyContactPhone);

            // 10. Date of Birth
            await this.fill(this.dateOfBirthInput, this.dateOfBirth);

            // 11. Instructor Permit Number & Permit Dates
            await this.fill(this.instructorPermitNumberInput, this.instructorPermitNumber);
            await this.fill(this.permitIssueDateInput, this.permitIssueDate);
            await this.fill(this.certExpDateInput, this.certExpDate);

            // 12. User Credentials
            await this.fill(this.userNameInput, this.userName);
            await this.fill(this.passwordInput, this.password);
            await this.fill(this.reEnterPasswordInput, this.password);

            // 13. Optional Checkboxes
            if (await this.assignAppointmentColorCheckbox.isVisible().catch(() => false)) {
                await this.click(this.assignAppointmentColorCheckbox);
            }
            if (await this.requireManualEnablingOfZoomButton.isVisible().catch(() => false)) {
                await this.click(this.requireManualEnablingOfZoomButton);
            }

            // 14. Zoom PMI & Staff Survey Link
            await this.fill(this.zoomPmiInput, this.zoomPmi);
            await this.fill(this.staffSurveyLinkInput, this.staffSurveyLink);

            // 15. Profile Picture Upload
            await this.uploadProfilePicture(data.profilePicture || 'profilePicture.jpg');

            return {
                staffCode: this.staffCode,
                firstName: this.firstName,
                lastName: this.lastName,
                userName: this.userName,
                email: this.email
            };
        });
    }

    /**
     * Clicks Continue button to navigate to the Working Hours tab.
     **/
    async clickContinue() {
        await test.step('Click Continue button and verify Working Hours tab is active', async () => {
            await this.waitForVisible(this.continueBtn);
            await this.click(this.continueBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
            await this.waitForVisible(this.workingHoursTab);
            await this.verifyVisible(this.workingHoursTab);
        });
    }

    /**
     * Clicks the Save button on Working Hours tab.
     **/
    async clickSave() {
        await test.step('Click Save button for Staff', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Verifies that 'Information saved successfully.' confirmation message is displayed.
     **/
    async verifyStaffSavedSuccessfully() {
        await test.step('Verify "Information saved successfully." confirmation message', async () => {
            const successMsg = this.page.getByText('Information saved successfully.', { exact: true });
            await this.waitForVisible(successMsg);
            await this.verifyVisible(successMsg);
        });
    }

    /**
     * Clicks the Close button to close the modal and return to staff list.
     **/
    async clickClose() {
        await test.step('Click Close button to return to Staff grid', async () => {
            await this.waitForVisible(this.closeBtn);
            await this.click(this.closeBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Verifies that the created staff member is visible in the staff grid.
     * @param {string} [searchKeyword=this.lastName] - Search keyword (last name or first name).
     **/
    async verifyStaffVisibleInGrid(searchKeyword = this.lastName) {
        await test.step(`Verify staff member "${searchKeyword}" is visible in grid`, async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, searchKeyword);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);

            const staffRecord = this.page.getByText(searchKeyword, { exact: true }).first();
            await this.waitForVisible(staffRecord);
            await this.verifyVisible(staffRecord);
        });
    }

    /**
     * Clicks the Edit action on the searched staff member in the grid.
     * @param {string} [searchKeyword=this.lastName] - Staff last name or search keyword.
     **/
    async editStaff(searchKeyword = this.lastName) {
        await test.step(`Click Edit on staff member "${searchKeyword}"`, async () => {
            await this.waitForVisible(this.editIcon);
            await this.click(this.editIcon);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Updates the staff status to Deactivated and saves the changes.
     **/
    async updateStatusToDeactivated() {
        await test.step('Update Staff Status to "Deactivated" and click Save', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusOptionDeactivated);
            await this.click(this.statusOptionDeactivated);
        });
    }

    /**
     * Verifies that 'Staff information updated successfully.' confirmation message is displayed.
     **/
    async verifyStaffUpdatedSuccessfully() {
        await test.step('Verify "Staff information updated successfully.d" confirmation message', async () => {
            const updatedMsg = this.page.getByText('Staff information updated successfully.', { exact: true }).first();
            await this.waitForVisible(updatedMsg);
            await this.verifyVisible(updatedMsg);
            await this.waitForLoaders();
        });
    }
}
