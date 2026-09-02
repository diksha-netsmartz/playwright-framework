import { expect, test } from '@playwright/test';
import BasePage from "../../../utils/BasePage";
import packageData from "../../../test-data/json/packageData.json";

/**
 * Page Object representing the New Student Enrollment Page in Admin Portal.
 * Handles package selection (BTW, CR, RT), location, student demographic & contact information,
 * parent/emergency details, terms agreement, and enrollment completion.
 **/
export default class NewStudentEnrollmentPage extends BasePage {

    /**
     * Initializes locators for the New Student Enrollment Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        // Package
        this.searchPackageInDropdown = page.locator('#lstPackagesForSelectionSearch');
        this.packageSelectionButton = page.getByRole('button', { name: 'Package Selection' });
        this.cashDrawerLocationDropdown = page.getByRole('button', { name: 'Select Cash Drawer Location' })
        this.cashDrawerLocationSelection = page.locator("(//div[@id='drp_CashdrawerLocation']//li//span[1][not(contains(text(),'Select'))])[1]");
        this.rtPackageOption = page.locator("xpath=//a[@data-packtype='RT']");
        this.addPackageButton = page.getByRole('button', { name: 'Add Package' });
        this.selectLocationDropdown = page.getByRole('link', { name: 'Select Location' });
        this.showAllCheckbox = page.getByText('Show All').first();
        this.filterButton = page.getByRole('button', { name: 'Filter' });
        this.selectButton = page.locator("xpath=//a[text()='Select' and @onclick='showAddButton(this);']").first();
        this.addButton = page.locator("xpath=//button[text()='Add' and contains(@onclick,'showSelect(this);')]").first();
        this.addButtonForAdditionalDetails = page.locator("(//td[contains(text(),'fee') or contains(text(),'Fee')]//ancestor::tr//button[text()='Add' and contains(@onclick,'addAdditional')])[1]");
        this.addToCartButton = page.getByRole('button', { name: 'Add To Cart' });
        this.skipSelectionButton = page.locator("xpath=//h4[text()='Class Selection']//ancestor::div[contains(@class,'modal-content')]//button[text()='Skip Selection']");
        this.skipSelectionButtonAddOnServices = page.locator("//h4[text()='Add On Services/Products']//ancestor::div[contains(@class,'modal-content')]//button[text()='Skip Selection']");
        this.skipSelectionButtonRoadTestModal = page.locator("//h4[text()='Road Test']//ancestor::div[contains(@class,'modal-content')]//button[text()='Skip Selection']");
        this.dobDisabledTextbox = page.locator("xpath=//input[@id='txtDate' and @disabled='disabled']");

        // Student Information
        this.studentInformationType = page.getByRole('button', { name: 'Student Information Type' });
        this.firstName = page.getByRole('textbox', { name: 'First Name' });
        this.middleName = page.getByRole('textbox', { name: 'Middle Name' });
        this.lastName = page.getByRole('textbox', { name: 'Last Name' });
        this.address = page.getByRole('textbox', { name: 'Address' });
        this.addressSelectionDropdown = page.locator("xpath=(//div[@class='pac-item']//span[text()='New York'])[1]");
        // this.city = page.locator('div').filter({ hasText: 'Los Angeles CountyCA, USA' }).first();
        this.apartment = page.getByPlaceholder('Apartment #');
        this.preferredNickname = page.getByPlaceholder('Preferred Nickname')
        this.stateDropdown = page.locator("xpath=//button[@data-id='State']");
        this.stateOptionValue = page.locator("(//select[@id='State']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.zipCode = page.getByRole('textbox', { name: 'Zip Code' });
        this.homePhone = page.getByRole('textbox', { name: 'Home Phone' });
        this.studentCellPhone = page.getByRole('textbox', { name: 'Student Cell Phone' });
        this.studentEmail = page.locator('#Email');
        this.parentName = page.locator("#ParentName")
        this.parentCellPhone = page.locator('#ParentPhone')
        this.parentEmail = page.locator('#ParentEmail1')
        this.parentName2 = page.getByRole('textbox', { name: 'Parent Name 2' });
        this.parentPhone2 = page.getByRole('textbox', { name: 'Parent Phone' });
        this.parentEmail2 = page.locator('#ParentEmail2')
        this.emergencyName = page.getByRole('textbox', { name: 'Emergency Name' });
        this.emergencyRelationship = page.getByRole('textbox', { name: 'Emergency Relationship' });
        this.emergencyPhone = page.getByRole('textbox', { name: 'Emergency Phone' });
        this.permitNumber = page.getByRole('textbox', { name: 'Permit #' });
        this.medicalConditions = page.locator('#MedicalConditions');
        this.studentNotes = page.locator('#StudentNotes');
        this.maleCheckbox = page.getByLabel('Male').first();
        this.drivingNotes = page.locator('#DrivingNotes');
        this.socialSecurityNumber = page.locator('#socialSecurityNumber');
        this.studentSignature = page.locator('#StudentSignature');
        this.highSchoolDropdown = page.locator("xpath=//button[contains(@data-id,'HighSchool')]//span[text()='Please Select']");
        this.highSchoolDropdownSelection = page.locator("xpath=(//button[contains(@data-id,'HighSchool')]//parent::div//span[contains(text(),'High')])[1]");
        this.wearGlassesDropdown = page.locator("xpath=//button[contains(@data-id,'WearGlasses')]//span[text()='Please Select']");
        this.wearGlassesDropdownSelection = page.locator("xpath=//button[contains(@data-id,'WearGlasses')]//parent::div//span[text()='Yes']");
        this.leadDropdown = page.locator("xpath=//button[contains(@data-id,'Lead')]//span[text()='Please Select']");
        this.leadDropdownSelection = page.locator("xpath=(//button[contains(@data-id,'Lead')]//parent::div//span[contains(text(),'Lead')])[1]");
        this.permitIssuedDateCalendarIcon = page.locator("xpath=//input[@lblname='Permit Issued Date']");
        this.permitIssueDateSelectInCalendar = page.locator("xpath=(//div[contains(@class,'datepicker-days')]//td)[1]");
        this.permitExpirationDateCalendarIcon = page.locator("xpath=//input[@lblname='Permit Expiration Date']");
        this.permitExpireDateSelectInCalendar = page.locator("xpath=(//div[contains(@class,'datepicker-days')]//td)[last()]");
        this.saveButton = page.getByRole('button', { name: 'Save' }).first();
        this.termsConditionsCheckbox = page.locator("(//input[@id='TermsConditions']//parent::label//span[contains(@class,'checkbox')])[1]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.closePopup = page.locator("xpath=//p[contains(text(),'enrollment')]//ancestor::div[@class='modal-body']//button[text()='Close']");

        // Student DOB
        this.dobMonthDropdown = page.locator("xpath=//button[@data-id='int_DOB_Month']");
        this.dobMonth = page.locator("xpath=//button[@data-id='int_DOB_Month']//following-sibling::div//a//span[text()='Jun']");
        this.dobDayDropdown = page.locator("xpath=//button[@data-id='int_DOB_Day']");
        this.dobDay = page.locator("xpath=//button[@data-id='int_DOB_Day']//following-sibling::div//a//span[text()='01']");
        this.dobYearDropdown = page.locator("xpath=//button[@data-id='int_DOB_Year']");
        this.dobYear = page.locator("xpath=//button[@data-id='int_DOB_Year']//following-sibling::div//a//span[text()='2006']");

        // Adult student fields
        this.cellPhone = page.getByRole('textbox', { name: 'Cell Phone' });
        this.parentGuardianCell = page.getByRole('textbox', { name: 'Parent/Guardian Cell #' });
        this.parentGuardianEmail = page.getByRole('textbox', { name: 'Parent/Guardian Email' });
        this.dlPermitIssuedDateCalendarIcon = page.locator('#dt_Date_PermitIssue');
        this.dlPermitExpirationDateCalendarIcon = page.locator('#dt_Date_ExpirePermit');
        this.textbox1 = page.getByRole('textbox', { name: 'TextBox1' });
        this.textbox2 = page.getByRole('textbox', { name: 'TextBox2' });
        this.customDatepickers = page.locator('input[name*="dt_datepicker"]');
        this.studentDrivingNotes = page.locator('#StudentDrivingNotes');

        // Knowledge test fields
        this.assignToLocationDropdown = page.locator("xpath=//button[contains(@data-id,'AssignToLocation')]//span[text()='Please Select']");
        this.assignToLocationDropdownSelection = page.locator("xpath=(//button[contains(@data-id,'AssignToLocation')]//parent::div//span[contains(text(),'Location')])[1]");
        this.assignToStaffDropdown = page.locator("xpath=//button[contains(@data-id,'AssignToStaff')]//span[text()='Please Select']");
        this.assignToStaffDropdownSelection = page.locator("xpath=(//button[contains(@data-id,'AssignToStaff')]//parent::div//li)[last()]");

        //package selection date of birth popup
        this.packageDobMonthDropdown = page.locator("button[data-id='ddlDOMMonths']")
        this.packageDobMonth = page.locator("xpath=//button[@data-id='ddlDOMMonths']//following-sibling::div//a//span[text()='Jun']");
        this.packageDobDayDropdown = page.locator("button[data-id='ddlDOBDays']")
        this.packageDobDay = page.locator("xpath=//button[@data-id='ddlDOBDays']//following-sibling::div//a//span[text()='01']");
        this.packageDobYearDropdown = page.locator("button[data-id='ddlDOMYears']")
        this.packageDobYear = page.locator("xpath=//button[@data-id='ddlDOMYears']//following-sibling::div//a//span[text()='2006']");
        this.packageProceedButton = page.locator("#btnServiceForCertificationProceedForPack")

    }

    /**
     * Opens the package selection modal and selects the specified package by exact name.
     * @param {string} packageName - Name of the package to select.
    **/
    async selectPackage(packageName) {
        await test.step(`Select package: "${packageName}"`, async () => {
            await this.waitForVisible(this.packageSelectionButton);
            await this.click(this.packageSelectionButton);
            await this.waitForVisible(this.packageSelectionButton);
            await this.pressSequentially(this.searchPackageInDropdown, packageName);
            await this.page.waitForTimeout(2000);
            // if (packageName === 'RT Package') {
            //     await this.click(this.rtPackageOption);
            // } else {
            await this.click(this.page.getByRole('link', { name: packageName, exact: true }));
            // await this.click(this.page.getByRole('link', { name: new RegExp(packageName, 'i') })).first();
            // }
        });
    }

    /**
    * Opens the cash drawer location modal and selects the cash drawer location.
   **/
    async selectCashDrawerLocation() {
        if (await this.isVisible(this.cashDrawerLocationDropdown)) {
            await test.step(`Select Cash Drawer Location`, async () => {
                await this.waitForVisible(this.cashDrawerLocationDropdown);
                await this.click(this.cashDrawerLocationDropdown);
                await this.waitForVisible(this.cashDrawerLocationSelection);
                await this.click(this.cashDrawerLocationSelection);
                await this.page.waitForTimeout(2000);

            });
        }
    }

    /**
     * Opens location dropdown and checks the Show All option.
    **/
    async selectLocation() {
        await this.waitForLoaders();
        await this.page.waitForTimeout(2000);
        if (await this.isVisible(this.selectLocationDropdown)) {
            await test.step('Select location and Show All', async () => {
                await this.click(this.selectLocationDropdown);
                await this.click(this.showAllCheckbox);
            });
        }
    }

    /**
     * Enters default DOB (12/12/2000), filters available slots, selects, and adds to cart.
     * If the DOB textbox is disabled, skips class selection.
    **/
    async selectDOB() {
        await test.step('Select DOB in package selector and add to cart', async () => {
            const dobTextbox = this.page.getByRole('textbox', { name: 'MM/DD/YYYY' });
            const isTextboxDisabled = await dobTextbox.isDisabled().catch(() => false) ||
                await this.isVisible(this.dobDisabledTextbox).catch(() => false);

            if (isTextboxDisabled) {
                await this.waitForVisible(this.skipSelectionButton);
                await this.click(this.skipSelectionButton);
                await this.waitForHidden(this.skipSelectionButton);
            } else {
                await this.fill(dobTextbox, "12/12/2000");
                await this.click(this.filterButton);
                await this.click(this.selectButton);
                await this.click(this.addButton);
                await this.click(this.addToCartButton);
            }
        });
    }

    async selectDOBForPackage() {
        await test.step('Select Date of Birth details', async () => {

            if (await this.isVisible(this.packageProceedButton)) {

                await this.click(this.packageDobMonthDropdown);
                await this.click(this.packageDobMonth);
                await this.click(this.packageDobDayDropdown);
                await this.click(this.packageDobDay);
                await this.click(this.packageDobYearDropdown);
                await this.click(this.packageDobYear);
                await this.click(this.packageProceedButton);
            }
        });

    }

    /**
     * Adds additional fee details and confirms adding to cart.
    **/
    async addAdditionalDetails() {

        await this.page.waitForTimeout(5000);
        if (await this.isVisible(this.skipSelectionButtonAddOnServices, { timeout: 10000 })) {
            if (await this.isVisible(this.addButtonForAdditionalDetails)) {
                await test.step('Add additional details fee to cart', async () => {
                    await this.click(this.addButtonForAdditionalDetails);
                    await this.click(this.addToCartButton);
                });
            }
            else {
                await this.click(this.skipSelectionButtonAddOnServices);
            }
        }
    }

    /**
    * Clicks on skip selection button for Road Test Modal Popup
   **/
    async skipSelectionForRoadTestModal() {

        await this.page.waitForTimeout(5000);
        if (await this.isVisible(this.skipSelectionButtonRoadTestModal, { timeout: 5000 })) {
            await this.click(this.skipSelectionButtonRoadTestModal);
            await this.waitForHidden(this.skipSelectionButtonRoadTestModal);
        }
    }


    /**
     * Resolves the environment-specific package name from packageData.json.
     * @param {string} packageName - Standard package name ('BTW and CR Package', 'CR Package', 'RT Package', 'BTW Package').
     * @returns {string} The resolved package name for the active environment.
     **/
    getResolvedPackageName(packageName) {
        const env = process.env.ENV || 'coreServer2';
        const envPackages = packageData[env] || packageData['coreServer2'];
        if (!envPackages) return packageName;

        const packageMap = {
            'BTW and CR Package': envPackages.btwAndCrPackage,
            'CR Package': envPackages.crPackage,
            'RT Package': envPackages.rtPackage,
            'BTW Package': envPackages.btwPackage,
        };

        return packageMap[packageName] || packageName;
    }

    /**
     * Selects and configures a package. Automatically resolves environment-specific
     * package names from packageData.json so spec files don't need any changes.
     * @param {string} packageName - Standard package name ('BTW and CR Package', 'CR Package', 'RT Package', 'BTW Package').
    **/
    async addPackage(packageName) {
        const resolvedName = this.getResolvedPackageName(packageName);

        await test.step(`Configure and add package: "${resolvedName}"`, async () => {
            await this.selectDOBForPackage();
            await this.selectPackage(resolvedName);
            await this.selectCashDrawerLocation();
            await this.click(this.addPackageButton);
            await this.waitForLoaders();

            switch (packageName) {
                case 'BTW and CR Package':
                    await this.selectLocation();
                    await this.selectDOB();
                    await this.addAdditionalDetails();
                    break;
                case 'RT Package':
                    if (await this.isVisible(this.selectButton)) {
                        await this.click(this.selectButton);
                        await this.click(this.addButton);
                    }
                    await this.skipSelectionForRoadTestModal();
                    await this.addAdditionalDetails();
                    break;
                case 'CR Package':
                    await this.selectLocation();
                    await this.selectDOB();
                    await this.addAdditionalDetails();
                    break;
                case 'BTW Package':
                    await this.addAdditionalDetails();
                    break;
                default:
                    throw new Error(`Unsupported package: ${packageName}`);
            }
        });
    }

    /**
     * Selects the student information category type (e.g. 'Teen', 'Adult').
     * @param {string} studentType - Student type label.
    **/
    async selectStudentType(studentType) {
        await test.step(`Select Student Information Type: "${studentType}"`, async () => {
            await this.click(this.studentInformationType);
            await this.click(this.page.getByRole('link', {
                name: studentType
            }));
        });
    }

    /**
     * Fills the complete student personal, address, parent/guardian, emergency contact, notes, permit, and terms details.
     * @param {Object} data - Student test data object.
    **/
    async fillTeenStudentInformation(data) {
        await test.step('Fill Teen Student Information', async () => {
            await this.waitForLoaders();
            await this.selectStudentType("Teen");
            await this.waitForVisible(this.firstName);
            await this.fill(this.firstName, data.firstName);
            await this.fill(this.middleName, data.middleName);
            await this.fill(this.lastName, data.lastName);
            if (await this.isVisible(this.address) && data.address) {
                await this.pressSequentially(this.address, data.address);
                await this.waitForVisible(this.addressSelectionDropdown);
                await this.click(this.addressSelectionDropdown);
            }
            // await this.click(this.city);
            if (await this.isVisible(this.stateDropdown)) {
                await this.click(this.stateDropdown);
                if (await this.isVisible(this.stateOptionValue)) {
                    await this.click(this.stateOptionValue);
                }
            }
            // await this.click(this.stateOptionValue);
            await this.fill(this.address, data.address);
            await this.fill(this.zipCode, data.zipCode);
            await this.fill(this.homePhone, data.homePhone);
            if (await this.isVisible(this.studentCellPhone)) {
                await this.fill(this.studentCellPhone, data.studentCellPhone);
            }
            await this.fill(this.studentEmail, data.studentEmail);
            await this.fill(this.parentName, data.parentName);
            await this.fill(this.parentCellPhone, data.parentCellPhone);
            await this.fill(this.parentEmail, data.parentEmail);
            if (await this.isVisible(this.parentName2)) {
                await this.fill(this.parentName2, data.parentName2);
                await this.fill(this.parentPhone2, data.parentPhone2);

            }
            await this.fill(this.parentEmail2, data.parentEmail2);
            if (await this.isVisible(this.socialSecurityNumber)) {
                await this.fill(this.socialSecurityNumber, data.socialSecurityNumber);
            }
            if (await this.isVisible(this.studentSignature)) {
                await this.fill(this.studentSignature, data.studentSignature);
            }
            if (await this.isVisible(this.emergencyName)) {
                await this.fill(this.emergencyName, data.emergencyName);
                await this.fill(this.emergencyRelationship, data.emergencyRelationship);
                await this.fill(this.emergencyPhone, data.emergencyPhone);
            }
            await this.click(this.highSchoolDropdown);
            await this.click(this.highSchoolDropdownSelection);
            if (await this.isVisible(this.wearGlassesDropdown)) {
                await this.click(this.wearGlassesDropdown);
                await this.click(this.wearGlassesDropdownSelection);
            }
            await this.check(this.maleCheckbox);
            await this.fill(this.permitNumber, data.permitNumber);
            await this.click(this.permitIssuedDateCalendarIcon);
            await this.click(this.permitIssueDateSelectInCalendar);
            await this.click(this.permitExpirationDateCalendarIcon);
            await this.click(this.permitExpireDateSelectInCalendar);
            await this.fill(this.medicalConditions, data.medicalConditions);
            await this.fill(this.studentNotes, data.studentNotes);
            if (await this.isVisible(this.studentDrivingNotes)) {
                await this.fill(this.studentDrivingNotes, data.studentDrivingNotes || data.drivingNotes);
            }
            if (await this.isVisible(this.leadDropdown)) {
                await this.click(this.leadDropdown);
                await this.click(this.leadDropdownSelection);
            }
            await this.check(this.termsConditionsCheckbox);
        });
    }

    /**
     * Unified method that fills complete student personal, address, parent/guardian, emergency contact, notes, permit, and terms details.
     * Employs safe conditional checks on every single field locator and data property to support Teen, Road Test, Adult, Knowledge Test, or custom packages.
     * @param {Object} data - Student test data object.
     * @param {string} [studentType] - Student type to select (e.g. "Teen", "Road Test", "Adult", "Knowledge Test").
     **/
    async fillStudentInformation(data, studentType) {
        const typeLabel = studentType || "Student";
        await test.step(`Fill ${typeLabel} Information`, async () => {
            this.uniqueId = `${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
            await this.waitForLoaders().catch(() => { });

            if (studentType) {
                await this.selectStudentType(studentType);
            }

            // Personal Information
            await this.waitForVisible(this.firstName);
            await this.fill(this.firstName, `${data.firstName}_${this.uniqueId}`);

            if (await this.isVisible(this.middleName)) {
                await this.fill(this.middleName, `${data.middleName}_${this.uniqueId}`);
            }
            if (await this.isVisible(this.lastName)) {
                await this.fill(this.lastName, data.lastName);
            }

            // Knowledge Test specific assignment fields
            if (await this.isVisible(this.assignToLocationDropdown)) {
                await this.click(this.assignToLocationDropdown);
                if (await this.isVisible(this.assignToLocationDropdownSelection)) {
                    await this.click(this.assignToLocationDropdownSelection);
                }
            }
            if (await this.isVisible(this.assignToStaffDropdown)) {
                await this.click(this.assignToStaffDropdown);
                if (await this.isVisible(this.assignToStaffDropdownSelection)) {
                    await this.click(this.assignToStaffDropdownSelection);
                }
            }


            // Address Details
            if (await this.isVisible(this.address) && data.address) {

                await this.pressSequentially(this.address, data.address);
                await this.waitForVisible(this.addressSelectionDropdown);
                await this.click(this.addressSelectionDropdown);


            }
            if (await this.isVisible(this.apartment)) {
                await this.fill(this.apartment, data.apartment);
            }

            if (await this.isVisible(this.stateDropdown)) {
                await this.click(this.stateDropdown);
                if (await this.isVisible(this.stateOptionValue)) {
                    await this.click(this.stateOptionValue);
                }
            }
            if (await this.isVisible(this.address) && data.address) {
                await this.fill(this.address, data.address);
            }
            if (await this.isVisible(this.zipCode) && data.zipCode) {
                await this.fill(this.zipCode, data.zipCode);
            }

            // Contact Information
            if (await this.isVisible(this.homePhone) && data.homePhone) {
                await this.fill(this.homePhone, data.homePhone);
            }
            const cellPhoneValue = data.cellPhone || data.studentCellPhone;
            if (await this.isVisible(this.studentCellPhone) && cellPhoneValue) {
                await this.fill(this.studentCellPhone, cellPhoneValue);
            } else if (await this.isVisible(this.cellPhone) && cellPhoneValue) {
                await this.fill(this.cellPhone, cellPhoneValue);
            }
            if (await this.isVisible(this.studentEmail)) {
                await this.fill(this.studentEmail, `${data.firstName}_${this.uniqueId}@gmail.com`);
            }

            // Parent 1 Information
            if (await this.isVisible(this.parentName) && data.parentName) {
                await this.fill(this.parentName, data.parentName);
            }
            const parentPhoneVal = data.parentGuardianCell || data.parentCellPhone;
            if (await this.isVisible(this.parentCellPhone) && parentPhoneVal) {
                await this.fill(this.parentCellPhone, parentPhoneVal);
            } else if (await this.isVisible(this.parentGuardianCell) && parentPhoneVal) {
                await this.fill(this.parentGuardianCell, parentPhoneVal);
            }
            const parentEmailVal = data.parentGuardianEmail || data.parentEmail;
            if (await this.isVisible(this.parentEmail) && parentEmailVal) {
                await this.fill(this.parentEmail, parentEmailVal);
            } else if (await this.isVisible(this.parentGuardianEmail) && parentEmailVal) {
                await this.fill(this.parentGuardianEmail, parentEmailVal);
            }

            // Parent 2 Information
            if (await this.isVisible(this.parentName2) && data.parentName2) {
                await this.fill(this.parentName2, data.parentName2);
                if (await this.isVisible(this.parentPhone2) && data.parentPhone2) {
                    await this.fill(this.parentPhone2, data.parentPhone2);
                }
            }
            if (await this.isVisible(this.parentEmail2) && data.parentEmail2) {
                await this.fill(this.parentEmail2, data.parentEmail2);
            }

            // SSN & Signature
            if (await this.isVisible(this.socialSecurityNumber) && data.socialSecurityNumber) {
                await this.fill(this.socialSecurityNumber, data.socialSecurityNumber);
            }
            if (await this.isVisible(this.studentSignature) && data.studentSignature) {
                await this.fill(this.studentSignature, data.studentSignature);
            }

            // Emergency Contact
            if (await this.isVisible(this.emergencyName) && data.emergencyName) {
                await this.fill(this.emergencyName, data.emergencyName);
                if (await this.isVisible(this.emergencyRelationship) && data.emergencyRelationship) {
                    await this.fill(this.emergencyRelationship, data.emergencyRelationship);
                }
                if (await this.isVisible(this.emergencyPhone) && data.emergencyPhone) {
                    await this.fill(this.emergencyPhone, data.emergencyPhone);
                }
            }

            // School & Physical attributes
            if (await this.isVisible(this.highSchoolDropdown)) {
                await this.click(this.highSchoolDropdown);
                if (await this.isVisible(this.highSchoolDropdownSelection)) {
                    await this.click(this.highSchoolDropdownSelection);
                }
            }
            if (await this.isVisible(this.wearGlassesDropdown)) {
                await this.click(this.wearGlassesDropdown);
                if (await this.isVisible(this.wearGlassesDropdownSelection)) {
                    await this.click(this.wearGlassesDropdownSelection);
                }
            }
            if (await this.isVisible(this.maleCheckbox)) {
                await this.check(this.maleCheckbox);
            }

            // Permit Information
            if (await this.isVisible(this.permitNumber) && data.permitNumber) {
                await this.fill(this.permitNumber, data.permitNumber);
            }
            const issuedIcon = (await this.isVisible(this.dlPermitIssuedDateCalendarIcon))
                ? this.dlPermitIssuedDateCalendarIcon
                : this.permitIssuedDateCalendarIcon;
            if (await this.isVisible(issuedIcon)) {
                await this.click(issuedIcon);
                if (await this.isVisible(this.permitIssueDateSelectInCalendar)) {
                    await this.click(this.permitIssueDateSelectInCalendar);
                }
            }
            const expireIcon = (await this.isVisible(this.dlPermitExpirationDateCalendarIcon))
                ? this.dlPermitExpirationDateCalendarIcon
                : this.permitExpirationDateCalendarIcon;
            if (await this.isVisible(expireIcon)) {
                await this.click(expireIcon);
                if (await this.isVisible(this.permitExpireDateSelectInCalendar)) {
                    await this.click(this.permitExpireDateSelectInCalendar);
                }
            }

            // Medical & Notes
            if (await this.isVisible(this.medicalConditions) && data.medicalConditions) {
                await this.fill(this.medicalConditions, data.medicalConditions);
            }
            if (await this.isVisible(this.studentNotes) && data.studentNotes) {
                await this.fill(this.studentNotes, data.studentNotes);
            }
            const drivingNotesVal = data.studentDrivingNotes || data.drivingNotes;
            if (await this.isVisible(this.studentDrivingNotes) && drivingNotesVal) {
                await this.fill(this.studentDrivingNotes, drivingNotesVal);
            } else if (await this.isVisible(this.drivingNotes) && drivingNotesVal) {
                await this.fill(this.drivingNotes, drivingNotesVal);
            }

            if (await this.isVisible(this.preferredNickname)) {
                await this.pressSequentially(this.preferredNickname, "111111111");
            }

            // Custom TextBoxes
            if (await this.isVisible(this.textbox1)) {
                await this.fill(this.textbox1, data.textbox1 || "TextBox1 Notes");
            }
            if (await this.isVisible(this.textbox2)) {
                await this.fill(this.textbox2, data.textbox2 || "TextBox2 Notes");
            }
            if (await this.isVisible(this.termsConditionsCheckbox)) {
                await this.click(this.termsConditionsCheckbox);
            }

            // Custom Datepickers
            const datepickerInputs = this.customDatepickers;
            const datepickerCount = await datepickerInputs.count();
            if (datepickerCount > 0) {
                const dateValue = data.datePicker;
                console.log(`Found ${datepickerCount} datepicker input(s). Filling with date: "${dateValue}"`);
                for (let i = 0; i < datepickerCount; i++) {
                    const input = datepickerInputs.nth(i);
                    if (await this.isVisible(input)) {
                        await this.pressSequentially(input, dateValue);
                        await this.page.waitForTimeout(1000)
                    }
                }
            }

            // Lead & Terms
            if (await this.isVisible(this.leadDropdown)) {
                await this.click(this.leadDropdown);
                if (await this.isVisible(this.leadDropdownSelection)) {
                    await this.click(this.leadDropdownSelection);
                }
            }


        });
    }

    /**
     * Selects Month, Day, and Year from the student details Date of Birth dropdown controls.
    **/
    async selectDOBInStudentDetails() {
        await test.step('Select DOB in Student Details', async () => {
            if (await this.isVisible(this.dobMonthDropdown)) {
                const classAttr = await this.dobMonthDropdown.getAttribute('class') || '';
                const isDisabled = classAttr.includes('disabled') || await this.dobMonthDropdown.isDisabled();

                if (!isDisabled) {
                    await this.click(this.dobMonthDropdown);
                    await this.click(this.dobMonth);
                    await this.click(this.dobDayDropdown);
                    await this.click(this.dobDay);
                    await this.click(this.dobYearDropdown);
                    await this.click(this.dobYear);
                }
            }
        });
    }

    /**
     * Saves the new student enrollment, confirms the confirmation prompt, and verifies enrollment completion message.
    **/
    async save() {
        await test.step('Save enrollment and confirm', async () => {
            await this.click(this.saveButton);
            await this.click(this.yesConfirmationButton);
            await this.waitForHidden(this.yesConfirmationButton);
            await this.waitForLoaders();
            await this.waitForVisible(this.page.getByText('Your enrollment has been completed and a confirmation email has been sent.', { exact: true }));
            await this.verifyVisible(this.page.getByText('Your enrollment has been completed and a confirmation email has been sent.', { exact: true }));
        });
    }

    /**
     * Closes the enrollment completion popup.
    **/
    async closeEnrollmentConfirmationPopup() {
        await test.step('Close enrollment confirmation popup', async () => {
            await this.waitForVisible(this.closePopup);
            await this.click(this.closePopup);
            await this.waitForHidden(this.closePopup);
            await this.waitForLoaders();
        });
    }

    /**
     * Executes the complete student enrollment sequence: adding package, filling info, selecting DOB if needed, and saving.
     * @param {Object} config - Enrollment options.
     * @param {string} config.packageName - Name of package.
     * @param {string} [config.fillInfoMethod='fillTeenStudentInformation'] - Method to fill student details.
     * @param {Object} config.studentData - Student details.
     */
    async enrollNewStudent({ packageName = 'BTW and CR Package', fillInfoMethod = 'fillTeenStudentInformation', studentData }) {
        await this.addPackage(packageName);
        await this[fillInfoMethod](studentData);
        await this.selectDOBInStudentDetails();
        await this.save();
    }
}