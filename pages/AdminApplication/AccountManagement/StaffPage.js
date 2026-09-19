import BasePage from '@utils/BasePage';
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
        this.roleOptionJuniorAdmin = page.locator("xpath=//select[@id='StaffType']//parent::div//div//span[text()='Junior Admin']");

        this.locationDropdown = page.locator("xpath=//select[@id='Location']//parent::div//button");
        this.locationDropdownOption = page.locator("(//select[@id='Location']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.locationDropdownOptionLast = page.locator("(//select[@id='Location']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]");

        this.assignToStaffDropdown = page.locator("//select[@id='AssignToStaff']//parent::div//button");
        this.assignToStaffDropdownOption = page.locator("(//select[@id='AssignToStaff']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.assignToStaffDropdownOptionLast = page.locator("(//select[@id='AssignToStaff']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]");

        this.vehicleAssignedDropdown = page.locator("//select[@id='VehicleAssigned']//parent::div//button");
        this.vehicleAssignedDropdownOption = page.locator("(//select[@id='VehicleAssigned']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.vehicleAssignedDropdownOptionLast = page.locator("(//select[@id='VehicleAssigned']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]");

        this.highSchoolDropdown = page.locator("//select[@id='HighSchool']//parent::div//button");
        this.highSchoolDropdownOption = page.locator("(//select[@id='HighSchool']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.highSchoolDropdownOptionLast = page.locator("(//select[@id='HighSchool']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]");

        this.employmentTypeDropdown = page.locator("//select[@name='EmploymentType']//parent::div//button")
        this.employmentTypeDropdownOption = page.locator("(//select[@name='EmploymentType']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]")
        this.employmentTypeDropdownOptionLast = page.locator("(//select[@name='EmploymentType']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]")

        this.staffCodeInput = page.getByRole('textbox', { name: 'Staff Code' });
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.middleNameInput = page.getByRole('textbox', { name: 'Middle Name' });
        this.lastNameInput = page.getByRole('textbox', { name: 'Last Name' });
        this.addressInput = page.getByRole('textbox', { name: 'Address' });
        this.cityInput = page.getByRole('textbox', { name: 'City' });
        this.stateDropdown = page.locator("xpath=//select[@id='State']//parent::div//button");
        this.stateOption = page.locator("(//select[@id='State']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.stateOptionLast = page.locator("(//select[@id='State']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]");

        this.zipInput = page.getByRole('textbox', { name: 'Zip' });
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.homePhoneInput = page.getByRole('textbox', { name: 'Home Phone' });
        this.cellPhoneInput = page.getByRole('textbox', { name: 'Cell Phone' });
        this.otherPhoneInput = page.getByRole('textbox', { name: 'Other Phone' })

        this.emergencyContactNameInput = page.getByRole('textbox', { name: 'Emergency Contact Name' });
        this.emergencyContactRelationInput = page.getByRole('textbox', { name: 'Emergency Contact Relation' });
        this.emergencyContactPhoneInput = page.getByRole('textbox', { name: 'Emergency Contact Phone' });

        this.dateOfBirthInput = page.locator('#date_Birth');
        this.instructorPermitNumberInput = page.getByRole('textbox', { name: 'Instructor Permit Number' });
        this.permitIssueDateInput = page.locator('#date_InCarPermitIssue');
        this.certExpDateInput = page.locator('#date_CertExp');
        this.permitExpirationDateInput = page.locator('#date_PermitExpiration')
        this.inClassPermitNumberInput = page.getByRole('textbox', { name: 'In Class Permit No' })

        this.userNameInput = page.getByRole('textbox', { name: 'User Name' });
        this.passwordInput = page.locator("//input[contains(@name, 'Password') and not(contains(@name,'Re'))]")
        this.reEnterPasswordInput = page.getByPlaceholder('Re Enter Password');

        this.certificateNumberInput = page.getByRole('textbox', { name: 'Certificate Number' });
        this.roadDistanceCoverageInput = page.getByRole('textbox', { name: 'Road distance coverage' });
        this.instructorStaffLicenseNumberInput = page.getByRole('textbox', { name: 'Instructor/Staff Lincense#' });

        this.zoomPmiInput = page.getByRole('textbox', { name: 'Zoom PMI' });
        this.zoomHostUrlInput = page.getByRole('textbox', { name: 'Zoom Host URL' });
        this.zoomUserUrlInput = page.getByRole('textbox', { name: 'Zoom User URL' });
        this.badgeInput = page.getByRole('textbox', { name: 'Badge' });
        this.staffSurveyLinkInput = page.getByRole('textbox', { name: 'Staff Survey Link' });

        this.allowAccessToAdminPortalYesRadioButton = page.locator("//label[contains(text(),'Yes')]//input[@id='AllowAccessToAdminPortal']//following-sibling::ins");
        this.allowAccessToAdminPortalNoRadioButton = page.locator("//label[contains(text(),'No')]//input[@id='AllowAccessToAdminPortal']//following-sibling::ins");
        this.allowAccessToAdminPortalYesRadioWrapper = page.locator("//label[contains(text(),'Yes')]//input[@id='AllowAccessToAdminPortal']//parent::div");
        this.allowAccessToAdminPortalNoRadioWrapper = page.locator("//label[contains(text(),'No')]//input[@id='AllowAccessToAdminPortal']//parent::div");
        this.assignAppointmentColorCheckbox = page.locator("xpath=//input[@id='Bitappointmentcolor']//following-sibling::ins");
        this.assignAppointmentColorCheckboxWrapper = page.locator("//input[@id='Bitappointmentcolor']//parent::div");
        this.requireManualEnablingOfZoomButton = page.locator("xpath=//input[contains(@id,'Zoom')]//following-sibling::ins");
        this.requireManualEnablingOfZoomWrapper = page.locator("//input[contains(@id,'Zoom')]//parent::div");

        this.appointmentColorButton = page.locator("//button[@class='btn default colorpick']//i");
        this.appointmentColorSelector = page.locator('div.colorpicker-saturation:visible');
        this.appointmentColorTextbox = page.locator('#ColorPicker');

        this.eligibleVehicleTypeSelection = page.locator("//div[contains(@id,'ms-VehicleType')]//li[@class='ms-elem-selectable']");
        this.selectedVehicleType = page.locator("//div[contains(@id,'ms-VehicleType')]//li[@class='ms-elem-selection ms-selected']");

        // File / Picture Upload Locators
        this.imageUploadSection = page.getByText('Staff Profile Picture', { exact: true });
        this.selectImageBtn = page.getByText('Select Image', { exact: true });
        this.saveImageButton = page.locator("xpath=//div[text()='Save']");
        this.fileInput = page.locator("input[type='file']").first();
        this.imageUploaded = page.locator('#imgCroppedImage');
        this.removeImageButton = page.locator("//input[@data-toggle='confirmationRemoveImage']");
        this.yesConfirmationBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        // State tracking
        this.selectedStatus = '';
        this.selectedRole = '';
        this.selectedLocation = '';
        this.selectedAssignToStaff = '';
        this.selectedVehicleAssigned = '';
        this.selectedHighSchool = '';
        this.selectedEmploymentType = '';
        this.selectedState = '';
        this.selectedAppointmentColor = '';
        this.isAllowAccessToAdminPortalYesSelected = false;
        this.isAssignAppointmentColorSelected = false;
        this.isRequireManualEnablingOfZoomSelected = false;
        this.isVehicleTypeSelected = false;

        // Updated state tracking
        this.updatedStatus = '';
        this.updatedRole = '';
        this.updatedLocation = '';
        this.updatedAssignToStaff = '';
        this.updatedVehicleAssigned = '';
        this.updatedHighSchool = '';
        this.updatedEmploymentType = '';
        this.updatedState = '';
        this.updatedMiddleName = '';
        this.updatedAddress = '';
        this.updatedCity = '';
        this.updatedZip = '';
        this.updatedHomePhone = '';
        this.updatedCellPhone = '';
        this.updatedOtherPhone = '';
        this.updatedEmergencyContactName = '';
        this.updatedEmergencyContactRelation = '';
        this.updatedEmergencyContactPhone = '';
        this.updatedDateOfBirth = '';
        this.updatedInstructorPermitNumber = '';
        this.updatedPermitIssueDate = '';
        this.updatedCertExpDate = '';
        this.updatedPermitExpirationDate = '';
        this.updatedInClassPermitNumber = '';
        this.updatedCertificateNumber = '';
        this.updatedRoadDistanceCoverage = '';
        this.updatedInstructorStaffLicenseNumber = '';
        this.updatedZoomPmi = '';
        this.updatedZoomHostUrl = '';
        this.updatedZoomUserUrl = '';
        this.updatedBadge = '';
        this.updatedStaffSurveyLink = '';
        this.updatedAppointmentColor = '';
        this.isVehicleTypeUpdated = false;
        this.isAllowAccessToAdminPortalNoSelected = false;
        this.isImageRemoved = false;

        // Navigation & Action Buttons
        this.continueBtn = page.locator("xpath=//a[contains(text(),'Continue') and not(contains(@class,'hide'))]");
        this.workingHoursTab = page.locator("xpath=//b[text()='Working Hours']//ancestor::a[@aria-expanded='true']");
        this.saveBtn = page.locator('#btnSave, #btnUpdateStaffInfo').first();
        this.vehicleConfirmButton = page.locator("//button[contains(@onclick,'SaveUpadteAfterVehicleAssignedConfirmation')]");
        this.closeBtn = page.locator("xpath=//b[contains(text(),'New Staff')]//ancestor::div[contains(@class,'modal-content')]//button[contains(text(),'Close') and not(@aria-hidden)]");
        this.closeBtnUpdateStaff = page.locator("xpath=(//button[@onclick='CloseStaffUpdatePopup()' and text()='Close'])[1]");

        // Grid / Table Locators
        this.searchTextbox = page.locator("input[type='search']").first();
        this.staffTable = page.locator('#stafftable');
        this.editIcon = page.getByTitle('Edit');

        // Status Filter Locators
        this.statusFilterDropdown = page.locator("//div[contains(@class,'staffBtnGroup')]//a[contains(.,'Status')]");
        this.deactivatedCheckbox = page.locator("//div[@class='icheckbox_square-grey']//input[contains(@class,'chkDeletedStatus')]//following-sibling::ins");
        this.activeCheckbox = page.locator("//div[@class='icheckbox_square-grey']//input[contains(@class,'chkActiveStatus')]//following-sibling::ins");


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

    async uploadProfilePicture(fileName) {
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
            if (await this.saveImageButton.isVisible({ timeout: 5000 }).catch(() => false)) {
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
            this.firstName = `${data.firstName}_${this.uniqueId}`;
            this.middleName = data.middleName;
            this.lastName = `${data.lastName}_${this.uniqueId}`;
            this.address = data.address;
            this.city = data.city;
            this.zip = data.zip;
            this.email = `staff_${this.uniqueId}@testmail.com`;
            this.homePhone = data.homePhone;
            this.cellPhone = data.cellPhone;
            this.otherPhone = data.otherPhone;
            this.emergencyContactName = data.emergencyContactName;
            this.emergencyContactRelation = data.emergencyContactRelation;
            this.emergencyContactPhone = data.emergencyContactPhone;
            this.dateOfBirth = data.dateOfBirth;
            this.permitIssueDate = data.permitIssueDate;
            this.certExpDate = data.certExpDate;
            this.permitExpirationDate = data.permitExpirationDate;
            this.inClassPermitNumber = data.inClassPermitNumber;
            this.instructorPermitNumber = data.instructorPermitNumber;
            this.certificateNumber = data.certificateNumber;
            this.roadDistanceCoverage = data.roadDistanceCoverage;
            this.instructorStaffLicenseNumber = data.instructorStaffLicenseNumber;
            this.userName = `user_${this.uniqueId}`;
            this.password = data.password;
            this.appointmentColorCode = data.appointmentColorCode;
            this.zoomPmi = data.zoomPmi;
            this.zoomHostUrl = data.zoomHostUrl;
            this.zoomUserUrl = data.zoomUserUrl;
            this.badge = data.badge;
            this.staffSurveyLink = data.staffSurveyLink;

            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
            await this.waitForVisible(this.statusDropdown, { timeout: 10000 }).catch(() => { });

            // 1. Select Status -> Active
            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.statusDropdown);
                await this.waitForVisible(this.statusOptionActive);
                this.selectedStatus = (await this.statusOptionActive.innerText()).trim();
                await this.click(this.statusOptionActive);
            }

            // 2. Select Role -> Instructor
            if (await this.isVisible(this.roleDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.roleDropdown);
                await this.waitForVisible(this.roleOptionInstructor);
                this.selectedRole = (await this.roleOptionInstructor.innerText()).trim();
                await this.click(this.roleOptionInstructor);
            }

            // 3. Select Location
            if (await this.isVisible(this.locationDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.locationDropdown);
                if (await this.isVisible(this.locationDropdownOption, { timeout: 2000 }).catch(() => false)) {
                    this.selectedLocation = (await this.locationDropdownOption.innerText()).trim();
                    await this.click(this.locationDropdownOption);
                } else {
                    await this.click(this.locationDropdown);
                }
            }

            // Assign To Staff
            if (await this.isVisible(this.assignToStaffDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.assignToStaffDropdown);
                await this.waitForVisible(this.assignToStaffDropdownOption);
                this.selectedAssignToStaff = (await this.assignToStaffDropdownOption.innerText()).trim();
                await this.click(this.assignToStaffDropdownOption);

            }

            // High School
            if (await this.isVisible(this.highSchoolDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.highSchoolDropdown);
                await this.waitForVisible(this.highSchoolDropdownOption);
                this.selectedHighSchool = (await this.highSchoolDropdownOption.innerText()).trim();
                await this.click(this.highSchoolDropdownOption);
            }

            // Employment Type
            if (await this.isVisible(this.employmentTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.employmentTypeDropdown);
                await this.waitForVisible(this.employmentTypeDropdownOption);
                this.selectedEmploymentType = (await this.employmentTypeDropdownOption.innerText()).trim();
                await this.click(this.employmentTypeDropdownOption);
            }

            // 4. Staff Code
            if (await this.isVisible(this.staffCodeInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.staffCodeInput, this.staffCode);
            }

            // 5. Names
            if (await this.isVisible(this.firstNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.firstNameInput, this.firstName);
            }
            if (await this.isVisible(this.middleNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.middleNameInput, this.middleName);
            }
            if (await this.isVisible(this.lastNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.lastNameInput, this.lastName);
            }

            // 6. Address & City
            if (await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.addressInput, this.address);
            }
            if (await this.isVisible(this.cityInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.cityInput, this.city);
            }

            // 7. State -> DE
            if (await this.isVisible(this.stateDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.stateDropdown);
                await this.waitForVisible(this.stateOption)
                this.selectedState = (await this.stateOption.innerText()).trim();
                await this.click(this.stateOption);
            }

            // 8. Zip & Contacts
            if (await this.isVisible(this.zipInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.zipInput, this.zip);
            }
            if (await this.isVisible(this.emailInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emailInput, this.email);
            }
            if (await this.isVisible(this.homePhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.homePhoneInput, this.homePhone);
            }
            if (await this.isVisible(this.cellPhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.cellPhoneInput, this.cellPhone);
            }
            if (await this.isVisible(this.otherPhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.otherPhoneInput, this.otherPhone);
            }

            // 9. Emergency Contact
            if (await this.isVisible(this.emergencyContactNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emergencyContactNameInput, this.emergencyContactName);
            }
            if (await this.isVisible(this.emergencyContactRelationInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emergencyContactRelationInput, this.emergencyContactRelation);
            }
            if (await this.isVisible(this.emergencyContactPhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emergencyContactPhoneInput, this.emergencyContactPhone);
            }

            // 10. Date of Birth
            if (await this.isVisible(this.dateOfBirthInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.dateOfBirthInput, this.dateOfBirth);
            }

            // 11. Instructor Permit Number & Permit Dates, License, Certificate, Road Distance
            if (await this.isVisible(this.instructorPermitNumberInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.instructorPermitNumberInput, this.instructorPermitNumber);
            }
            if (await this.isVisible(this.permitIssueDateInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.permitIssueDateInput, this.permitIssueDate);
            }
            if (await this.isVisible(this.certExpDateInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.certExpDateInput, this.certExpDate);
            }
            if (await this.isVisible(this.permitExpirationDateInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.permitExpirationDateInput, this.permitExpirationDate);
            }
            if (await this.isVisible(this.inClassPermitNumberInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.inClassPermitNumberInput, this.inClassPermitNumber);
            }
            if (await this.isVisible(this.certificateNumberInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.certificateNumberInput, this.certificateNumber);
            }
            if (await this.isVisible(this.instructorStaffLicenseNumberInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.instructorStaffLicenseNumberInput, this.instructorStaffLicenseNumber);
            }
            if (await this.isVisible(this.roadDistanceCoverageInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.roadDistanceCoverageInput, this.roadDistanceCoverage);
            }

            // 12. User Credentials
            if (await this.isVisible(this.userNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.userNameInput, this.userName);
            }
            if (await this.isVisible(this.passwordInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.passwordInput, this.password);
            }
            if (await this.isVisible(this.reEnterPasswordInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.reEnterPasswordInput, this.password);
            }

            // 13. Optional Checkboxes & Appointment Color
            if (await this.isVisible(this.appointmentColorButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.appointmentColorButton);
                await this.waitForVisible(this.appointmentColorSelector);
                await this.click(this.appointmentColorSelector, { position: { x: 20, y: 20 } });
                await this.click(this.appointmentColorTextbox);
                this.selectedAppointmentColor = await this.appointmentColorTextbox.inputValue();
            }
            if (await this.isVisible(this.assignAppointmentColorCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.assignAppointmentColorCheckbox);
                this.isAssignAppointmentColorSelected = true;
            }
            if (await this.isVisible(this.requireManualEnablingOfZoomButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.requireManualEnablingOfZoomButton);
                this.isRequireManualEnablingOfZoomSelected = true;
            }

            // 14. Radio: Allow Access To Admin Portal
            if (await this.isVisible(this.allowAccessToAdminPortalYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.allowAccessToAdminPortalYesRadioButton);
                this.isAllowAccessToAdminPortalYesSelected = true;
            }

            // 15. Vehicle Type Selectable
            if (await this.isVisible(this.eligibleVehicleTypeSelection.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.eligibleVehicleTypeSelection.first());
                this.isVehicleTypeSelected = true;
            } else {
                this.isVehicleTypeSelected = false;
            }

            // Vehicle Assigned
            if (await this.isVisible(this.vehicleAssignedDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.vehicleAssignedDropdown);
                await this.waitForVisible(this.vehicleAssignedDropdownOption);
                this.selectedVehicleAssigned = (await this.vehicleAssignedDropdownOption.innerText()).trim();
                await this.click(this.vehicleAssignedDropdownOption);
            }

            // 15. Zoom Details, Badge & Staff Survey Link
            if (await this.isVisible(this.zoomPmiInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.zoomPmiInput, this.zoomPmi);
            }
            if (await this.isVisible(this.zoomHostUrlInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.zoomHostUrlInput, this.zoomHostUrl);
            }
            if (await this.isVisible(this.zoomUserUrlInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.zoomUserUrlInput, this.zoomUserUrl);
            }
            if (await this.isVisible(this.badgeInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.badgeInput, this.badge);
            }
            if (await this.isVisible(this.staffSurveyLinkInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.staffSurveyLinkInput, this.staffSurveyLink);
            }

            // 16. Profile Picture Upload
            if (await this.isVisible(this.selectImageBtn, { timeout: 100 }).catch(() => false)) {
                await this.uploadProfilePicture(data.profilePicture);
            }

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
            if (await this.isVisible(this.vehicleConfirmButton, { timeout: 5000 })) {
                await this.click(this.vehicleConfirmButton)
            }
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
            if (await this.isVisible(this.vehicleConfirmButton, { timeout: 5000 })) {
                await this.click(this.vehicleConfirmButton)
            }
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
    async searchAndEditStaff(searchKeyword = this.lastName, maxRetries = 5) {
        await test.step(`Search and edit Staff: "${searchKeyword}"`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForLoadState('load').catch(() => { });
                await this.waitForLoaders();
                await this.waitForVisible(this.searchTextbox);
                await this.fill(this.searchTextbox, '');
                await this.fill(this.searchTextbox, searchKeyword);
                await this.page.waitForTimeout(2000);
                await this.waitForLoaders();

                const count = await this.editIcon.count();
                if (count > 0 && await this.editIcon.first().isVisible().catch(() => false)) {
                    await this.click(this.editIcon.first());
                    await this.waitForLoaders();
                    return;
                }

                if (attempt < maxRetries) {
                    await this.page.reload();
                    await this.page.waitForLoadState('load').catch(() => { });
                    await this.waitForLoaders();
                    await this.filterByAllStatus();
                }
            }
            const staffRecord = this.page.getByText(searchKeyword, { exact: true }).first();

            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.waitForVisible(staffRecord);
            await this.verifyVisible(staffRecord);
            await this.click(this.editIcon);
            await this.waitForLoaders();
        });
    }

    /**
        * Opens the Status filter dropdown on the Locations tab, selects All status, and closes the dropdown.
        **/
    async filterByAllStatus() {
        await test.step('Filter Locations by All status', async () => {
            await this.waitForLoaders();
            await this.click(this.statusFilterDropdown);
            if (await this.isVisible(this.deactivatedCheckbox, { timeout: 2000 })) {
                await this.click(this.deactivatedCheckbox, { force: true });
            } else if (await this.isVisible(this.activeCheckbox, { timeout: 2000 })) {
                await this.click(this.activeCheckbox, { force: true });
            }
            await this.click(this.statusFilterDropdown);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1000);

        });
    }

    /**
     * Verifies that staff details in edit form match the saved values.
     * @param {Object} [data={}] - Base staff data from fixture.
     **/
    async verifyStaffDetails(data = {}) {
        await test.step('Verify Staff details in edit form match saved values', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
            await this.waitForVisible(this.firstNameInput, { timeout: 10000 });

            // 1. Basic / Names & Code
            if (this.staffCode && await this.isVisible(this.staffCodeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.staffCodeInput).toHaveValue(this.staffCode);
            }
            if (this.firstName && await this.isVisible(this.firstNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.firstNameInput).toHaveValue(this.firstName);
            }
            if (this.middleName && await this.isVisible(this.middleNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.middleNameInput).toHaveValue(this.middleName);
            }
            if (this.lastName && await this.isVisible(this.lastNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.lastNameInput).toHaveValue(this.lastName);
            }

            // 2. Dropdowns
            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.statusDropdown).toContainText(this.selectedStatus);
            }
            if (await this.isVisible(this.roleDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.roleDropdown).toContainText(this.selectedRole);
            }
            if (this.selectedLocation && await this.isVisible(this.locationDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.locationDropdown).toContainText(this.selectedLocation);
            }
            if (this.selectedAssignToStaff && await this.isVisible(this.assignToStaffDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.assignToStaffDropdown).toContainText(this.selectedAssignToStaff);
            }
            if (this.selectedVehicleAssigned && await this.isVisible(this.vehicleAssignedDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleAssignedDropdown).toContainText(this.selectedVehicleAssigned);
            }
            if (this.selectedHighSchool && await this.isVisible(this.highSchoolDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.highSchoolDropdown).toContainText(this.selectedHighSchool);
            }
            if (this.selectedEmploymentType && await this.isVisible(this.employmentTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.employmentTypeDropdown).toContainText(this.selectedEmploymentType);
            }
            if (this.selectedState && await this.isVisible(this.stateDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.stateDropdown).toContainText(this.selectedState);
            }
            if (this.isVehicleTypeSelected) {
                await this.verifyVisible(this.selectedVehicleType.first());
            }

            // 3. Address, City, Zip
            if (this.address && await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.addressInput).toHaveValue(this.address);
            }
            if (this.city && await this.isVisible(this.cityInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.cityInput).toHaveValue(this.city);
            }
            if (this.zip && await this.isVisible(this.zipInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zipInput).toHaveValue(this.zip);
            }

            // 4. Contact Numbers & Email
            if (this.email && await this.isVisible(this.emailInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emailInput).toHaveValue(this.email);
            }
            if (this.homePhone && await this.isVisible(this.homePhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.homePhoneInput).toHaveValue(this.homePhone);
            }
            if (this.cellPhone && await this.isVisible(this.cellPhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.cellPhoneInput).toHaveValue(this.cellPhone);
            }
            if (this.otherPhone && await this.isVisible(this.otherPhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.otherPhoneInput).toHaveValue(this.otherPhone);
            }

            // 5. Emergency Contact
            if (this.emergencyContactName && await this.isVisible(this.emergencyContactNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emergencyContactNameInput).toHaveValue(this.emergencyContactName);
            }
            if (this.emergencyContactRelation && await this.isVisible(this.emergencyContactRelationInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emergencyContactRelationInput).toHaveValue(this.emergencyContactRelation);
            }
            if (this.emergencyContactPhone && await this.isVisible(this.emergencyContactPhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emergencyContactPhoneInput).toHaveValue(this.emergencyContactPhone);
            }

            // 6. Date of Birth & Permit Numbers / Dates
            if (this.dateOfBirth && await this.isVisible(this.dateOfBirthInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.dateOfBirthInput).toHaveValue(this.dateOfBirth);
            }
            if (this.instructorPermitNumber && await this.isVisible(this.instructorPermitNumberInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.instructorPermitNumberInput).toHaveValue(this.instructorPermitNumber);
            }
            if (this.permitIssueDate && await this.isVisible(this.permitIssueDateInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.permitIssueDateInput).toHaveValue(this.permitIssueDate);
            }
            if (this.certExpDate && await this.isVisible(this.certExpDateInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.certExpDateInput).toHaveValue(this.certExpDate);
            }
            if (this.permitExpirationDate && await this.isVisible(this.permitExpirationDateInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.permitExpirationDateInput).toHaveValue(this.permitExpirationDate);
            }
            if (this.inClassPermitNumber && await this.isVisible(this.inClassPermitNumberInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.inClassPermitNumberInput).toHaveValue(this.inClassPermitNumber);
            }
            if (this.certificateNumber && await this.isVisible(this.certificateNumberInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.certificateNumberInput).toHaveValue(this.certificateNumber);
            }
            if (this.instructorStaffLicenseNumber && await this.isVisible(this.instructorStaffLicenseNumberInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.instructorStaffLicenseNumberInput).toHaveValue(this.instructorStaffLicenseNumber);
            }
            if (this.roadDistanceCoverage && await this.isVisible(this.roadDistanceCoverageInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.roadDistanceCoverageInput).toHaveValue(this.roadDistanceCoverage);
            }

            // 7. User Credentials
            if (this.userName && await this.isVisible(this.userNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.userNameInput).toHaveValue(this.userName);
            }

            // 8. Checkboxes & Radio
            if (await this.isVisible(this.appointmentColorButton, { timeout: 100 }).catch(() => false)) {
                const actualAppointmentColor = await this.appointmentColorTextbox.inputValue();
                expect(actualAppointmentColor).toBe(this.selectedAppointmentColor);
            }
            if (await this.isVisible(this.assignAppointmentColorCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.assignAppointmentColorCheckboxWrapper).toHaveClass(/checked/);

            }
            if (this.isRequireManualEnablingOfZoomSelected) {
                await expect(this.requireManualEnablingOfZoomWrapper.first()).toHaveClass(/checked/);

            }
            if (this.isAllowAccessToAdminPortalYesSelected) {
                await expect(this.allowAccessToAdminPortalYesRadioWrapper.first()).toHaveClass(/checked/);

            }

            // 9. Zoom Details, Badge & Staff Survey Link
            if (this.zoomPmi && await this.isVisible(this.zoomPmiInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zoomPmiInput).toHaveValue(this.zoomPmi);
            }
            if (this.zoomHostUrl && await this.isVisible(this.zoomHostUrlInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zoomHostUrlInput).toHaveValue(this.zoomHostUrl);
            }
            if (this.zoomUserUrl && await this.isVisible(this.zoomUserUrlInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zoomUserUrlInput).toHaveValue(this.zoomUserUrl);
            }
            if (this.badge && await this.isVisible(this.badgeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.badgeInput).toHaveValue(this.badge);
            }
            if (this.staffSurveyLink && await this.isVisible(this.staffSurveyLinkInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.staffSurveyLinkInput).toHaveValue(this.staffSurveyLink);
            }
            if (await this.isVisible(this.imageUploadSection, { timeout: 100 }).catch(() => false)) {
                const imageSrc = await this.imageUploaded.getAttribute('src');
                expect(imageSrc?.length).toBeGreaterThan(0);
                await this.verifyVisible(this.removeImageButton);
            }
        });
    }

    /**
     * Updates staff details on Edit form, modifies fields, removes profile picture, and selects alternate options.
     * @param {Object} [data={}] - Update data from fixture.
     **/
    async updateStaffDetails(data = {}) {
        await test.step('Update all Staff details and remove profile picture', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
            await this.waitForVisible(this.firstNameInput, { timeout: 10000 });

            this.updatedFirstName = `${data.updatedFirstName}_${this.uniqueId}`;
            this.updatedLastName = `${data.updatedLastName}_${this.uniqueId}`;
            this.lastName = this.updatedLastName;
            this.updatedMiddleName = data.updatedMiddleName;
            this.updatedAddress = data.updatedAddress;
            this.updatedCity = data.updatedCity;
            this.updatedZip = data.updatedZip;
            this.updatedHomePhone = data.updatedHomePhone;
            this.updatedCellPhone = data.updatedCellPhone;
            this.updatedOtherPhone = data.updatedOtherPhone;
            this.updatedEmergencyContactName = data.updatedEmergencyContactName;
            this.updatedEmergencyContactRelation = data.updatedEmergencyContactRelation;
            this.updatedEmergencyContactPhone = data.updatedEmergencyContactPhone;
            this.updatedDateOfBirth = data.updatedDateOfBirth;
            this.updatedInstructorPermitNumber = data.updatedInstructorPermitNumber;
            this.updatedPermitIssueDate = data.updatedPermitIssueDate;
            this.updatedCertExpDate = data.updatedCertExpDate;
            this.updatedPermitExpirationDate = data.updatedPermitExpirationDate;
            this.updatedInClassPermitNumber = data.updatedInClassPermitNumber;
            this.updatedCertificateNumber = data.updatedCertificateNumber;
            this.updatedRoadDistanceCoverage = data.updatedRoadDistanceCoverage;
            this.updatedInstructorStaffLicenseNumber = data.updatedInstructorStaffLicenseNumber;
            this.updatedZoomPmi = data.updatedZoomPmi;
            this.updatedZoomHostUrl = data.updatedZoomHostUrl;
            this.updatedZoomUserUrl = data.updatedZoomUserUrl;
            this.updatedBadge = data.updatedBadge;
            this.updatedStaffSurveyLink = data.updatedStaffSurveyLink;

            this.firstName = this.updatedFirstName;
            this.middleName = this.updatedMiddleName;
            this.lastName = this.updatedLastName;

            // 1. Status -> Deactivated
            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.statusDropdown);
                await this.waitForVisible(this.statusOptionDeactivated);
                this.updatedStatus = (await this.statusOptionDeactivated.innerText()).trim();
                await this.click(this.statusOptionDeactivated);
            }

            // 2. Staff Type / Role -> Junior Admin
            if (await this.isVisible(this.roleDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.roleDropdown);
                await this.waitForVisible(this.roleOptionJuniorAdmin);
                this.updatedRole = (await this.roleOptionJuniorAdmin.innerText()).trim();
                await this.click(this.roleOptionJuniorAdmin);
            }

            // 3. Location -> last()
            if (await this.locationDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.locationDropdown);
                await this.waitForVisible(this.locationDropdownOptionLast);
                this.updatedLocation = (await this.locationDropdownOptionLast.innerText()).trim();
                await this.click(this.locationDropdownOptionLast);
            }

            // 4. Assign To Staff -> last()
            if (await this.assignToStaffDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.assignToStaffDropdown);
                if (await this.isVisible(this.assignToStaffDropdownOptionLast, { timeout: 1000 }).catch(() => false)) {
                    this.updatedAssignToStaff = (await this.assignToStaffDropdownOptionLast.innerText()).trim();
                    await this.click(this.assignToStaffDropdownOptionLast);
                } else {
                    await this.click(this.assignToStaffDropdown);
                }
            }

            // 5. Vehicle Type Selectable -> select last option
            if (await this.isVisible(this.eligibleVehicleTypeSelection.last(), { timeout: 200 }).catch(() => false)) {
                await this.click(this.eligibleVehicleTypeSelection.last());
                this.isVehicleTypeUpdated = true;
            }

            // 6. Vehicle Assigned -> last()
            if (await this.vehicleAssignedDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.vehicleAssignedDropdown);
                this.updatedVehicleAssigned = (await this.vehicleAssignedDropdownOptionLast.innerText()).trim();
                await this.click(this.vehicleAssignedDropdownOptionLast);
            }

            // 7. High School -> last()
            if (await this.highSchoolDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.highSchoolDropdown);
                if (await this.isVisible(this.highSchoolDropdownOptionLast, { timeout: 1000 }).catch(() => false)) {
                    this.updatedHighSchool = (await this.highSchoolDropdownOptionLast.innerText()).trim();
                    await this.click(this.highSchoolDropdownOptionLast);
                } else {
                    await this.click(this.highSchoolDropdown);
                }
            }

            // 8. Employment Type -> last()
            if (await this.employmentTypeDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.employmentTypeDropdown);
                if (await this.isVisible(this.employmentTypeDropdownOptionLast, { timeout: 1000 }).catch(() => false)) {
                    this.updatedEmploymentType = (await this.employmentTypeDropdownOptionLast.innerText()).trim();
                    await this.click(this.employmentTypeDropdownOptionLast);
                } else {
                    await this.click(this.employmentTypeDropdown);
                }
            }

            // 9. Names, Address, City
            if (await this.isVisible(this.firstNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.firstNameInput, this.updatedFirstName);
            }
            if (await this.isVisible(this.middleNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.middleNameInput, this.updatedMiddleName);
            }
            if (await this.isVisible(this.lastNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.lastNameInput, this.updatedLastName);
            }
            if (await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.addressInput, this.updatedAddress);
            }
            if (await this.isVisible(this.cityInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.cityInput, this.updatedCity);
            }

            // 10. State -> last()
            if (await this.stateDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.stateDropdown);
                await this.waitForVisible(this.stateOptionLast);
                this.updatedState = (await this.stateOptionLast.innerText()).trim();
                await this.click(this.stateOptionLast);
            }

            // 11. Zip & Phones
            if (await this.isVisible(this.zipInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.zipInput, this.updatedZip);
            }
            if (await this.isVisible(this.homePhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.homePhoneInput, this.updatedHomePhone);
            }
            if (await this.isVisible(this.cellPhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.cellPhoneInput, this.updatedCellPhone);
            }
            if (await this.isVisible(this.otherPhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.otherPhoneInput, this.updatedOtherPhone);
            }

            // 12. Emergency Contact
            if (await this.isVisible(this.emergencyContactNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emergencyContactNameInput, this.updatedEmergencyContactName);
            }
            if (await this.isVisible(this.emergencyContactRelationInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emergencyContactRelationInput, this.updatedEmergencyContactRelation);
            }
            if (await this.isVisible(this.emergencyContactPhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emergencyContactPhoneInput, this.updatedEmergencyContactPhone);
            }

            // 13. DOB, Permits, Certificate, Road Distance, License
            if (await this.isVisible(this.dateOfBirthInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.dateOfBirthInput, this.updatedDateOfBirth);
            }
            if (await this.isVisible(this.instructorPermitNumberInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.instructorPermitNumberInput, this.updatedInstructorPermitNumber);
            }
            if (await this.isVisible(this.permitIssueDateInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.permitIssueDateInput, this.updatedPermitIssueDate);
            }
            if (await this.isVisible(this.certExpDateInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.certExpDateInput, this.updatedCertExpDate);
            }
            if (await this.isVisible(this.permitExpirationDateInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.permitExpirationDateInput, this.updatedPermitExpirationDate);
            }
            if (await this.isVisible(this.inClassPermitNumberInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.inClassPermitNumberInput, this.updatedInClassPermitNumber);
            }
            if (await this.isVisible(this.certificateNumberInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.certificateNumberInput, this.updatedCertificateNumber);
            }
            if (await this.isVisible(this.instructorStaffLicenseNumberInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.instructorStaffLicenseNumberInput, this.updatedInstructorStaffLicenseNumber);
            }
            if (await this.isVisible(this.roadDistanceCoverageInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.roadDistanceCoverageInput, this.updatedRoadDistanceCoverage);
            }

            // 14. Appointment Color & Checkbox
            if (await this.isVisible(this.appointmentColorButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.appointmentColorButton);
                await this.waitForVisible(this.appointmentColorSelector);
                await this.click(this.appointmentColorSelector, { position: { x: 60, y: 60 } });
                await this.click(this.appointmentColorTextbox);
                this.updatedAppointmentColor = await this.appointmentColorTextbox.inputValue();
            }
            if (await this.assignAppointmentColorCheckboxWrapper.isVisible({ timeout: 200 }).catch(() => false)) {
                const isChecked = await this.assignAppointmentColorCheckboxWrapper.evaluate(el => el.classList.contains('checked')).catch(() => false);
                if (isChecked) {
                    await this.click(this.assignAppointmentColorCheckbox);
                }
            }

            // 15. Radio: Allow Access To Admin Portal -> No
            if (await this.isVisible(this.allowAccessToAdminPortalNoRadioButton, { timeout: 200 }).catch(() => false)) {
                await this.click(this.allowAccessToAdminPortalNoRadioButton);
                this.isAllowAccessToAdminPortalNoSelected = true;
            }

            // 16. Zoom Details, Badge & Staff Survey Link
            if (await this.isVisible(this.zoomPmiInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.zoomPmiInput, this.updatedZoomPmi);
            }
            if (await this.isVisible(this.zoomHostUrlInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.zoomHostUrlInput, this.updatedZoomHostUrl);
            }
            if (await this.isVisible(this.zoomUserUrlInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.zoomUserUrlInput, this.updatedZoomUserUrl);
            }
            if (await this.isVisible(this.badgeInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.badgeInput, this.updatedBadge);
            }
            if (await this.isVisible(this.staffSurveyLinkInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.staffSurveyLinkInput, this.updatedStaffSurveyLink);
            }

            // 17. Remove Profile Picture
            if (await this.removeImageButton.isVisible({ timeout: 500 }).catch(() => false)) {
                await this.click(this.removeImageButton);
                await this.waitForVisible(this.yesConfirmationBtn);
                await this.click(this.yesConfirmationBtn);
                await this.waitForLoaders();
                this.isImageRemoved = true;
            }
        });
    }

    /**
     * Verifies that 'Staff information updated successfully.' confirmation message is displayed.
     **/
    async verifyStaffUpdatedSuccessfully() {
        await test.step('Verify "Staff information updated successfully." confirmation message', async () => {
            const updatedMsg = this.page.getByText('Staff information updated successfully.', { exact: true }).first();
            await this.waitForVisible(updatedMsg);
            await this.verifyVisible(updatedMsg);
            await this.waitForLoaders();
            await this.click(this.closeBtnUpdateStaff);
        });
    }

    /**
     * Verifies that staff details in edit form match the updated values.
     * @param {Object} [data={}] - Base staff data from fixture.
     **/
    async verifyUpdatedStaffDetails(data = {}) {
        await test.step('Verify updated Staff details in edit form match updated values', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
            await this.waitForVisible(this.firstNameInput, { timeout: 10000 });

            // 1. Basic / Names & Code
            if (this.staffCode && await this.isVisible(this.staffCodeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.staffCodeInput).toHaveValue(this.staffCode);
            }
            if (this.updatedFirstName && await this.isVisible(this.firstNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.firstNameInput).toHaveValue(this.updatedFirstName);
            }
            if (this.updatedMiddleName && await this.isVisible(this.middleNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.middleNameInput).toHaveValue(this.updatedMiddleName);
            }
            if (this.updatedLastName && await this.isVisible(this.lastNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.lastNameInput).toHaveValue(this.updatedLastName);
            }

            // 2. Dropdowns
            if (this.updatedStatus && await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.statusDropdown).toContainText(this.updatedStatus);
            }
            if (this.updatedRole && await this.isVisible(this.roleDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.roleDropdown).toContainText(this.updatedRole);
            }
            if (this.updatedLocation && await this.isVisible(this.locationDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.locationDropdown).toContainText(this.updatedLocation);
            }
            if (this.updatedAssignToStaff && await this.isVisible(this.assignToStaffDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.assignToStaffDropdown).toContainText(this.updatedAssignToStaff);
            }
            if (this.updatedHighSchool && await this.isVisible(this.highSchoolDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.highSchoolDropdown).toContainText(this.updatedHighSchool);
            }
            if (this.updatedEmploymentType && await this.isVisible(this.employmentTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.employmentTypeDropdown).toContainText(this.updatedEmploymentType);
            }
            if (this.updatedState && await this.isVisible(this.stateDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.stateDropdown).toContainText(this.updatedState);
            }
            if (this.isVehicleTypeUpdated) {
                await this.verifyVisible(this.selectedVehicleType.last());
            }
            if (this.updatedVehicleAssigned && await this.isVisible(this.vehicleAssignedDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleAssignedDropdown).toContainText(this.updatedVehicleAssigned);
            }

            // 3. Address, City, Zip
            if (this.updatedAddress && await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.addressInput).toHaveValue(this.updatedAddress);
            }
            if (this.updatedCity && await this.isVisible(this.cityInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.cityInput).toHaveValue(this.updatedCity);
            }
            if (this.updatedZip && await this.isVisible(this.zipInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zipInput).toHaveValue(this.updatedZip);
            }

            // 4. Contact Numbers
            if (this.updatedHomePhone && await this.isVisible(this.homePhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.homePhoneInput).toHaveValue(this.updatedHomePhone);
            }
            if (this.updatedCellPhone && await this.isVisible(this.cellPhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.cellPhoneInput).toHaveValue(this.updatedCellPhone);
            }
            if (this.updatedOtherPhone && await this.isVisible(this.otherPhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.otherPhoneInput).toHaveValue(this.updatedOtherPhone);
            }

            // 5. Emergency Contact
            if (this.updatedEmergencyContactName && await this.isVisible(this.emergencyContactNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emergencyContactNameInput).toHaveValue(this.updatedEmergencyContactName);
            }
            if (this.updatedEmergencyContactRelation && await this.isVisible(this.emergencyContactRelationInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emergencyContactRelationInput).toHaveValue(this.updatedEmergencyContactRelation);
            }
            if (this.updatedEmergencyContactPhone && await this.isVisible(this.emergencyContactPhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emergencyContactPhoneInput).toHaveValue(this.updatedEmergencyContactPhone);
            }

            // 6. Date of Birth & Permit Numbers / Dates
            if (this.updatedDateOfBirth && await this.isVisible(this.dateOfBirthInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.dateOfBirthInput).toHaveValue(this.updatedDateOfBirth);
            }
            if (this.updatedInstructorPermitNumber && await this.isVisible(this.instructorPermitNumberInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.instructorPermitNumberInput).toHaveValue(this.updatedInstructorPermitNumber);
            }
            if (this.updatedPermitIssueDate && await this.isVisible(this.permitIssueDateInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.permitIssueDateInput).toHaveValue(this.updatedPermitIssueDate);
            }
            if (this.updatedCertExpDate && await this.isVisible(this.certExpDateInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.certExpDateInput).toHaveValue(this.updatedCertExpDate);
            }
            if (this.updatedPermitExpirationDate && await this.isVisible(this.permitExpirationDateInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.permitExpirationDateInput).toHaveValue(this.updatedPermitExpirationDate);
            }
            if (this.updatedInClassPermitNumber && await this.isVisible(this.inClassPermitNumberInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.inClassPermitNumberInput).toHaveValue(this.updatedInClassPermitNumber);
            }
            if (this.updatedCertificateNumber && await this.isVisible(this.certificateNumberInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.certificateNumberInput).toHaveValue(this.updatedCertificateNumber);
            }
            if (this.updatedInstructorStaffLicenseNumber && await this.isVisible(this.instructorStaffLicenseNumberInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.instructorStaffLicenseNumberInput).toHaveValue(this.updatedInstructorStaffLicenseNumber);
            }
            if (this.updatedRoadDistanceCoverage && await this.isVisible(this.roadDistanceCoverageInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.roadDistanceCoverageInput).toHaveValue(this.updatedRoadDistanceCoverage);
            }

            // 7. Checkboxes & Radio
            if (await this.assignAppointmentColorCheckboxWrapper.isVisible({ timeout: 100 }).catch(() => false)) {
                await expect(this.assignAppointmentColorCheckboxWrapper).not.toHaveClass(/checked/);
            }
            if (this.updatedAppointmentColor && await this.isVisible(this.appointmentColorTextbox, { timeout: 100 }).catch(() => false)) {
                const actualColor = await this.appointmentColorTextbox.inputValue();
                expect(actualColor).toBe(this.updatedAppointmentColor);
            }
            if (this.isAllowAccessToAdminPortalNoSelected && await this.isVisible(this.allowAccessToAdminPortalNoRadioWrapper, { timeout: 100 }).catch(() => false)) {
                await expect(this.allowAccessToAdminPortalNoRadioWrapper.first()).toHaveClass(/checked/);
            }

            // 8. Zoom Details, Badge & Staff Survey Link
            if (this.updatedZoomPmi && await this.isVisible(this.zoomPmiInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zoomPmiInput).toHaveValue(this.updatedZoomPmi);
            }
            if (this.updatedZoomHostUrl && await this.isVisible(this.zoomHostUrlInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zoomHostUrlInput).toHaveValue(this.updatedZoomHostUrl);
            }
            if (this.updatedZoomUserUrl && await this.isVisible(this.zoomUserUrlInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zoomUserUrlInput).toHaveValue(this.updatedZoomUserUrl);
            }
            if (this.updatedBadge && await this.isVisible(this.badgeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.badgeInput).toHaveValue(this.updatedBadge);
            }
            if (this.updatedStaffSurveyLink && await this.isVisible(this.staffSurveyLinkInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.staffSurveyLinkInput).toHaveValue(this.updatedStaffSurveyLink);
            }

            // 9. Profile Picture Removed Verification
            if (this.isImageRemoved) {
                const imageSrc = await this.imageUploaded.getAttribute('src');
                expect(imageSrc ? imageSrc.length : 0).toBe(0);
                await this.verifyVisible(this.selectImageBtn);
            }
        });
    }
}
