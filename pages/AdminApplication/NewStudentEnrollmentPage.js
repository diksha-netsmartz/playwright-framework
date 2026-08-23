import { expect } from '@playwright/test';
import BasePage from "../../utils/BasePage";


/**
 * Page Object representing the New Student Enrollment Page in Admin Portal.
 * Handles package selection (BTW, CR, RT), location, student demographic & contact information,
 * parent/emergency details, terms agreement, and enrollment completion.
  **/
class NewStudentEnrollmentPage extends BasePage {

    /**
     * Initializes locators for the New Student Enrollment Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        // Package
        this.packageSelectionButton = page.getByRole('button', { name: 'Package Selection' });
        this.rtPackageOption = page.locator("xpath=//a[@data-packtype='RT']");
        this.addPackageButton = page.getByRole('button', { name: 'Add Package' });
        this.selectLocationDropdown = page.getByRole('link', { name: 'Select Location' });
        this.showAllCheckbox = page.getByText('Show All').first();
        this.filterButton = page.getByRole('button', { name: 'Filter' });
        this.selectButton = page.locator("xpath=//a[text()='Select' and @onclick='showAddButton(this);']").first();
        this.addButton = page.locator("xpath=//button[text()='Add' and contains(@onclick,'showSelect(this);')]").first();
        this.addButtonForAdditionalDetails = page.locator("xpath=//td[text()='Fee']//ancestor::tr//button[text()='Add' and contains(@onclick,'addAdditional')]").first();
        this.addToCartButton = page.getByRole('button', { name: 'Add To Cart' });

        // Student Information
        this.studentInformationType = page.getByRole('button', { name: 'Student Information Type' });
        this.firstName = page.getByRole('textbox', { name: 'First Name' });
        this.middleName = page.getByRole('textbox', { name: 'Middle Name' });
        this.lastName = page.getByRole('textbox', { name: 'Last Name' });
        this.address = page.getByRole('textbox', { name: 'Address' });
        this.city = page.locator('div').filter({ hasText: 'Los Angeles CountyCA, USA' }).first();
        this.stateDropdown = page.locator("xpath=//button[@data-id='State']");
        this.stateOptionValue = page.locator('a').filter({ hasText: 'AK' })
        this.zipCode = page.getByRole('textbox', { name: 'Zip Code' });
        this.homePhone = page.getByRole('textbox', { name: 'Home Phone' });
        this.studentCellPhone = page.getByRole('textbox', { name: 'Student Cell Phone' });
        this.studentEmail = page.getByRole('textbox', { name: 'Student Email' });
        this.parentName = page.getByRole('textbox', { name: 'Parent Name', exact: true });
        this.parentCellPhone = page.getByRole('textbox', { name: 'Parent Cell Phone' });
        this.parentEmail = page.getByRole('textbox', { name: 'Parent Email', exact: true });
        this.parentName2 = page.getByRole('textbox', { name: 'Parent Name 2' });
        this.parentPhone2 = page.getByRole('textbox', { name: 'Parent Phone' });
        this.parentEmail2 = page.getByRole('textbox', { name: 'Parent Email 2' }).or(page.getByRole('textbox', { name: 'Parent Email2' }))
        this.emergencyName = page.getByRole('textbox', { name: 'Emergency Name' });
        this.emergencyRelationship = page.getByRole('textbox', { name: 'Emergency Relationship' });
        this.emergencyPhone = page.getByRole('textbox', { name: 'Emergency Phone' });
        this.permitNumber = page.getByRole('textbox', { name: 'Permit #' });
        this.medicalConditions = page.locator('#MedicalConditions');
        this.studentNotes = page.locator('#StudentNotes');
        this.maleCheckbox = page.getByLabel('Male').first();
        this.drivingNotes = page.locator('#DrivingNotes');
        this.highSchoolDropdown = page.locator("xpath=//button[contains(@data-id,'HighSchool')]//span[text()='Please Select']");
        this.highSchoolDropdownSelection = page.locator("xpath=(//button[contains(@data-id,'HighSchool')]//parent::div//span[contains(text(),'High')])[1]");
        this.wearGlassesDropdown = page.locator("xpath=//button[contains(@data-id,'WearGlasses')]//span[text()='Please Select']");
        this.wearGlassesDropdownSelection = page.locator("xpath=//button[contains(@data-id,'WearGlasses')]//parent::div//span[text()='Yes']");
        this.leadDropdown = page.locator("xpath=//button[contains(@data-id,'Lead')]//span[text()='Please Select']");
        this.leadDropdownSelection = page.locator("xpath=(//button[contains(@data-id,'Lead')]//parent::div//span[contains(text(),'Lead')])[1]");
        this.permitIssuedDateCalendarIcon = page.locator("xpath=//input[@lblname='Permit Issued Date']");
        this.permitIssueDateSelectInCalendar = page.locator("xpath=(//div[contains(@class,'datepicker-days')]//td)[1]");
        this.permitExpirationDateCalendarIcon = page.locator("xpath=//input[@lblname='Permit Expiration Date']")
        this.permitExpireDateSelectInCalendar = page.locator("xpath=(//div[contains(@class,'datepicker-days')]//td)[last()]");
        this.saveButton = page.getByRole('button', { name: 'Save' }).first();
        this.termsConditionsCheckbox = page.locator("xpath=//input[@id='TermsConditions']//parent::label//span");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.closePopup = page.locator("xpath=//p[contains(text(),'enrollment')]//ancestor::div[@class='modal-body']//button[text()='Close']")

        // Student DOB
        this.dobMonthDropdown = page.locator("xpath=//button[@data-id='int_DOB_Month']");
        this.dobMonth = page.locator("xpath=//button[@data-id='int_DOB_Month']//following-sibling::div//a//span[text()='Jun']");
        this.dobDayDropdown = page.locator("xpath=//button[@data-id='int_DOB_Day']");
        this.dobDay = page.locator("xpath=//button[@data-id='int_DOB_Day']//following-sibling::div//a//span[text()='01']");
        this.dobYearDropdown = page.locator("xpath=//button[@data-id='int_DOB_Year']");
        this.dobYear = page.locator("xpath=//button[@data-id='int_DOB_Year']//following-sibling::div//a//span[text()='2006']");


        //adult student fields

        this.cellPhone = page.getByRole('textbox', { name: 'Cell Phone' });
        this.parentGuardianCell = page.getByRole('textbox', { name: 'Parent/Guardian Cell #' });
        this.parentGuardianEmail = page.getByRole('textbox', { name: 'Parent/Guardian Email' });
        this.dlPermitIssuedDateCalendarIcon = page.locator('#dt_Date_PermitIssue');
        this.dlPermitExpirationDateCalendarIcon = page.locator('#dt_Date_ExpirePermit');
        this.textbox1 = page.getByRole('textbox', { name: 'TextBox1' });
        this.textbox2 = page.getByRole('textbox', { name: 'TextBox2' });
        this.studentDrivingNotes = page.locator('#StudentDrivingNotes');


        //knowledge test fields

        this.assignToLocationDropdown = page.locator("xpath=//button[contains(@data-id,'AssignToLocation')]//span[text()='Please Select']");
        this.assignToLocationDropdownSelection = page.locator("xpath=(//button[contains(@data-id,'AssignToLocation')]//parent::div//span[contains(text(),'Location')])[1]");
        this.assignToStaffDropdown = page.locator("xpath=//button[contains(@data-id,'AssignToStaff')]//span[text()='Please Select']");
        this.assignToStaffDropdownSelection = page.locator("xpath=(//button[contains(@data-id,'AssignToStaff')]//parent::div//li)[last()]");
    }

    /**
     * Opens the package selection modal and selects the specified package by exact name.
     * @param {string} packageName - Name of the package to select.
    **/
    /**
     * Opens the package selection modal and selects the specified package by exact name.
     * @param {string} packageName - Name of the package to select.
    **/
    async selectPackage(packageName) {
        await this.click(this.packageSelectionButton);
        if (packageName === 'RT Package') {
            await this.click(this.rtPackageOption);
        }
        else
            await this.click(this.page.getByRole('link', { name: packageName, exact: true }));
    }

    /**
     * Opens location dropdown and checks the Show All option.
    **/
    async selectLocation() {
        await this.click(this.selectLocationDropdown);
        await this.click(this.showAllCheckbox);
    }

    /**
     * Enters default DOB (12/12/2000), filters available slots, selects, and adds to cart.
    **/
    async selectDOB() {
        await this.fill(this.page.getByRole('textbox', {
            name: 'MM/DD/YYYY'
        }), "12/12/2000");

        await this.click(this.filterButton);
        await this.click(this.selectButton);
        await this.click(this.addButton);
        await this.click(this.addToCartButton);
    }

    /**
     * Adds additional fee details and confirms adding to cart.
    **/
    async addAdditionalDetails() {
        await this.click(this.addButtonForAdditionalDetails);
        await this.click(this.addToCartButton);
    }

    /**
     * Selects and configures a package based on package type ('BTW and CR Package', 'CR Package', 'RT PAckage 1', 'BTW Package').
     * @param {string} packageName - The package name to configure and add.
    **/
    async addPackage(packageName) {

        await this.selectPackage(packageName);
        await this.click(this.addPackageButton);

        switch (packageName) {

            case 'BTW and CR Package':
                await this.selectLocation();
                await this.selectDOB();
                await this.addAdditionalDetails();
                break;

            case 'RT Package':
                await this.click(this.selectButton);
                await this.click(this.addButton);
                await this.click(this.addToCartButton);
                await this.addAdditionalDetails();
                break;

            case 'BTW Package':
                await this.addAdditionalDetails();
                break;

            case 'CR Package':
                await this.selectLocation();
                await this.selectDOB();
                await this.addAdditionalDetails();
                break;

            default:
                throw new Error(
                    `Unsupported package: ${packageName}`
                );
        }
    }

    /**
     * Selects the student information category type (e.g. 'Teen', 'Adult').
     * @param {string} studentType - Student type label.
    **/
    async selectStudentType(studentType) {
        await this.click(this.studentInformationType);
        await this.click(this.page.getByRole('link', {
            name: studentType
        }));
    }

    /**
     * Fills the complete student personal, address, parent/guardian, emergency contact, notes, permit, and terms details.
     * @param {Object} data - Student test data object.
    **/
    async fillTeenStudentInformation(data) {

        await this.selectStudentType("Teen");
        await this.verifyVisible(this.firstName);
        await this.fill(this.firstName, data.firstName);
        await this.fill(this.middleName, data.middleName);
        await this.fill(this.lastName, data.lastName);
        await this.pressSequentially(this.address, data.address);
        await this.click(this.city);
        await this.click(this.stateDropdown);
        await this.click(this.stateOptionValue);
        await this.fill(this.address, data.address);
        await this.fill(this.zipCode, data.zipCode);
        await this.fill(this.homePhone, data.homePhone);
        await this.fill(this.studentCellPhone, data.studentCellPhone);
        await this.fill(this.studentEmail, data.studentEmail);
        await this.fill(this.parentName, data.parentName);
        await this.fill(this.parentCellPhone, data.parentCellPhone);
        await this.fill(this.parentEmail, data.parentEmail);
        await this.fill(this.parentName2, data.parentName2);
        await this.fill(this.parentPhone2, data.parentPhone2);
        await this.fill(this.parentEmail2, data.parentEmail2);
        await this.fill(this.emergencyName, data.emergencyName);
        await this.fill(this.emergencyRelationship, data.emergencyRelationship);
        await this.fill(this.emergencyPhone, data.emergencyPhone);
        await this.click(this.highSchoolDropdown);
        await this.click(this.highSchoolDropdownSelection);
        await this.click(this.wearGlassesDropdown);
        await this.click(this.wearGlassesDropdownSelection);
        await this.check(this.maleCheckbox);
        await this.fill(this.permitNumber, data.permitNumber);
        await this.click(this.permitIssuedDateCalendarIcon);
        await this.click(this.permitIssueDateSelectInCalendar);
        await this.click(this.permitExpirationDateCalendarIcon);
        await this.click(this.permitExpireDateSelectInCalendar);
        await this.fill(this.medicalConditions, data.medicalConditions);
        await this.fill(this.studentNotes, data.studentNotes);
        await this.fill(this.drivingNotes, data.drivingNotes);
        await this.click(this.leadDropdown);
        await this.click(this.leadDropdownSelection);
        await this.check(this.termsConditionsCheckbox);
    }

    /**
     * Fills the complete student personal, address, parent/guardian, emergency contact, notes, permit, and terms details for Road Test student type.
     * @param {Object} data - Student test data object.
    **/
    async fillRoadTestStudentInformation(data) {
        await this.selectStudentType("Road Test");
        await this.verifyVisible(this.firstName);
        await this.fill(this.firstName, data.firstName);
        await this.fill(this.middleName, data.middleName);
        await this.fill(this.lastName, data.lastName);
        await this.pressSequentially(this.address, data.address);
        await this.click(this.city);
        await this.click(this.stateDropdown);
        await this.click(this.stateOptionValue);
        await this.fill(this.address, data.address);
        await this.fill(this.zipCode, data.zipCode);
        await this.fill(this.homePhone, data.homePhone);
        await this.fill(this.cellPhone, data.cellPhone || data.studentCellPhone);
        await this.fill(this.studentEmail, data.studentEmail);
        await this.fill(this.parentName, data.parentName);
        await this.fill(this.parentGuardianCell, data.parentGuardianCell || data.parentCellPhone);
        await this.fill(this.parentGuardianEmail, data.parentGuardianEmail || data.parentEmail);
        await this.fill(this.parentName2, data.parentName2);
        await this.fill(this.parentPhone2, data.parentPhone2);
        await this.fill(this.parentEmail2, data.parentEmail2);
        await this.fill(this.emergencyName, data.emergencyName);
        await this.fill(this.emergencyPhone, data.emergencyPhone);
        await this.fill(this.emergencyRelationship, data.emergencyRelationship);
        await this.click(this.highSchoolDropdown);
        await this.click(this.highSchoolDropdownSelection);
        await this.click(this.wearGlassesDropdown);
        await this.click(this.wearGlassesDropdownSelection);
        await this.check(this.maleCheckbox);
        await this.fill(this.permitNumber, data.permitNumber);
        await this.click(this.dlPermitIssuedDateCalendarIcon);
        await this.click(this.permitIssueDateSelectInCalendar);
        await this.click(this.dlPermitExpirationDateCalendarIcon);
        await this.click(this.permitExpireDateSelectInCalendar);
        await this.fill(this.medicalConditions, data.medicalConditions);
        await this.click(this.leadDropdown);
        await this.click(this.leadDropdownSelection);
        await this.fill(this.textbox1, data.textbox1 || "TextBox1 Notes");
        await this.fill(this.textbox2, data.textbox2 || "TextBox2 Notes");
        await this.fill(this.studentNotes, data.studentNotes);
        await this.fill(this.studentDrivingNotes, data.studentDrivingNotes || data.drivingNotes);
        await this.check(this.termsConditionsCheckbox);
    }

    /**
     * Fills the complete student personal, address, parent/guardian, emergency contact, notes, permit, and terms details for Adult student type.
     * @param {Object} data - Student test data object.
    **/
    async fillAdultStudentInformation(data) {
        await this.selectStudentType("Adult");
        await this.verifyVisible(this.firstName);
        await this.fill(this.firstName, data.firstName);
        await this.fill(this.middleName, data.middleName);
        await this.fill(this.lastName, data.lastName);
        await this.pressSequentially(this.address, data.address);
        await this.click(this.city);
        await this.click(this.stateDropdown);
        await this.click(this.stateOptionValue);
        await this.fill(this.address, data.address);
        await this.fill(this.zipCode, data.zipCode);
        await this.fill(this.homePhone, data.homePhone);
        await this.fill(this.cellPhone, data.cellPhone || data.studentCellPhone);
        await this.fill(this.studentEmail, data.studentEmail);
        await this.fill(this.parentName, data.parentName);
        await this.fill(this.parentGuardianCell, data.parentGuardianCell || data.parentCellPhone);
        await this.fill(this.parentGuardianEmail, data.parentGuardianEmail || data.parentEmail);
        await this.fill(this.parentName2, data.parentName2);
        await this.fill(this.parentPhone2, data.parentPhone2);
        await this.fill(this.parentEmail2, data.parentEmail2);
        await this.fill(this.emergencyName, data.emergencyName);
        await this.fill(this.emergencyPhone, data.emergencyPhone);
        await this.fill(this.emergencyRelationship, data.emergencyRelationship);
        await this.click(this.highSchoolDropdown);
        await this.click(this.highSchoolDropdownSelection);
        await this.click(this.wearGlassesDropdown);
        await this.click(this.wearGlassesDropdownSelection);
        await this.check(this.maleCheckbox);
        await this.fill(this.permitNumber, data.permitNumber);
        await this.click(this.dlPermitIssuedDateCalendarIcon);
        await this.click(this.permitIssueDateSelectInCalendar);
        await this.click(this.dlPermitExpirationDateCalendarIcon);
        await this.click(this.permitExpireDateSelectInCalendar);
        await this.fill(this.medicalConditions, data.medicalConditions);
        await this.click(this.leadDropdown);
        await this.click(this.leadDropdownSelection);
        await this.fill(this.textbox1, data.textbox1 || "TextBox1 Notes");
        await this.fill(this.textbox2, data.textbox2 || "TextBox2 Notes");
        await this.fill(this.studentNotes, data.studentNotes);
        await this.fill(this.studentDrivingNotes, data.studentDrivingNotes || data.drivingNotes);
        await this.check(this.termsConditionsCheckbox);
    }

    /**
     * Fills the complete student personal, assignment, address, parent/guardian, emergency contact, notes, permit, and terms details for Knowledge Test student type.
     * @param {Object} data - Student test data object.
    **/
    async fillKnowledgeTestStudentInformation(data) {
        await this.selectStudentType("Knowledge Test");
        await this.verifyVisible(this.assignToLocationDropdown);
        await this.click(this.assignToLocationDropdown);
        await this.click(this.assignToLocationDropdownSelection);
        await this.click(this.assignToStaffDropdown);
        await this.click(this.assignToStaffDropdownSelection);
        await this.fill(this.firstName, data.firstName);
        await this.fill(this.middleName, data.middleName);
        await this.fill(this.lastName, data.lastName);
        await this.pressSequentially(this.address, data.address);
        await this.click(this.city);
        await this.click(this.stateDropdown);
        await this.click(this.stateOptionValue);
        await this.fill(this.address, data.address);
        await this.fill(this.zipCode, data.zipCode);
        await this.fill(this.homePhone, data.homePhone);
        await this.fill(this.cellPhone, data.cellPhone || data.studentCellPhone);
        await this.fill(this.studentEmail, data.studentEmail);
        await this.fill(this.parentName, data.parentName);
        await this.fill(this.parentGuardianCell, data.parentGuardianCell || data.parentCellPhone);
        await this.fill(this.parentGuardianEmail, data.parentGuardianEmail || data.parentEmail);
        await this.fill(this.parentName2, data.parentName2);
        await this.fill(this.parentPhone2, data.parentPhone2);
        await this.fill(this.parentEmail2, data.parentEmail2);
        await this.fill(this.emergencyName, data.emergencyName);
        await this.fill(this.emergencyRelationship, data.emergencyRelationship);
        await this.fill(this.emergencyPhone, data.emergencyPhone);
        await this.click(this.highSchoolDropdown);
        await this.click(this.highSchoolDropdownSelection);
        await this.click(this.wearGlassesDropdown);
        await this.click(this.wearGlassesDropdownSelection);
        await this.check(this.maleCheckbox);
        await this.fill(this.permitNumber, data.permitNumber);
        await this.click(this.dlPermitExpirationDateCalendarIcon);
        await this.click(this.permitExpireDateSelectInCalendar);
        await this.click(this.dlPermitIssuedDateCalendarIcon);
        await this.click(this.permitIssueDateSelectInCalendar);
        await this.fill(this.medicalConditions, data.medicalConditions);
        await this.click(this.leadDropdown);
        await this.click(this.leadDropdownSelection);
        await this.fill(this.textbox1, data.textbox1 || "TextBox1 Notes");
        await this.fill(this.textbox2, data.textbox2 || "TextBox2 Notes");
        await this.fill(this.studentNotes, data.studentNotes);
        await this.fill(this.studentDrivingNotes, data.studentDrivingNotes || data.drivingNotes);
        await this.check(this.termsConditionsCheckbox);
    }

    /**
     * Selects Month, Day, and Year from the student details Date of Birth dropdown controls.
    **/
    async selectDOBInStudentDetails() {

        await this.click(this.dobMonthDropdown);
        await this.click(this.dobMonth);

        await this.click(this.dobDayDropdown);
        await this.click(this.dobDay);

        await this.click(this.dobYearDropdown);
        await this.click(this.dobYear);
    }

    /**
     * Saves the new student enrollment, confirms the confirmation prompt, and verifies enrollment completion message.
    **/
    async save() {
        await this.click(this.saveButton);
        await this.click(this.yesConfirmationButton);
        await this.verifyVisible(this.page.getByText('Your enrollment has been completed and a confirmation email has been sent.', { exact: true }));
    }

    /**
     * Closes the enrollment completion popup.
    **/
    async closeEnrollmentConfirmationPopup() {
        await this.waitForVisible(this.closePopup);
        await this.click(this.closePopup);
        await this.waitForHidden(this.closePopup);
        await this.waitForLoaders();
    }

    /**
     * Executes the complete student enrollment sequence: adding package, filling info, selecting DOB if needed, and saving.
     * @param {Object} config - Enrollment options.
     * @param {string} config.packageName - Name of package.
     * @param {string} [config.fillInfoMethod='fillTeenStudentInformation'] - Method to fill student details.
     * @param {Object} config.studentData - Student details.
     * @param {boolean} [config.selectDOBInDetails=false] - Whether to select DOB in student details.
     */
    async enrollNewStudent({ packageName = 'BTW and CR Package', fillInfoMethod = 'fillTeenStudentInformation', studentData, selectDOBInDetails = false }) {
        await this.addPackage(packageName);
        await this[fillInfoMethod](studentData);
        if (selectDOBInDetails) {
            await this.selectDOBInStudentDetails();
        }
        await this.save();
    }
}

module.exports = NewStudentEnrollmentPage;