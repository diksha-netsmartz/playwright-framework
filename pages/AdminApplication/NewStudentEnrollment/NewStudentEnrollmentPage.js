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
        this.showAllCheckbox = page.locator("//input[contains(@class,'selectAllLoc')]//following-sibling::ins");
        this.filterButton = page.getByRole('button', { name: 'Filter' });
        this.selectButton = page.locator("xpath=//a[text()='Select' and @onclick='showAddButton(this);']").first();
        this.addButton = page.locator("xpath=//button[text()='Add' and contains(@onclick,'showSelect(this);')]").first();
        this.addButtonForAdditionalDetails = page.locator("(//td[contains(text(),'fee') or contains(text(),'Fee')]//ancestor::tr//button[text()='Add' and contains(@onclick,'addAdditional')])[1]");
        this.addToCartButton = page.getByRole('button', { name: 'Add To Cart' });
        this.skipSelectionButton = page.locator("xpath=//h4[text()='Class Selection']//ancestor::div[contains(@class,'modal-content')]//button[text()='Skip Selection']");
        this.skipSelectionButtonAddOnServices = page.locator("//h4[text()='Add On Services/Products']//ancestor::div[contains(@class,'modal-content')]//button[text()='Skip Selection']");
        this.skipSelectionButtonRoadTestModal = page.locator("//h4[text()='Road Test']//ancestor::div[contains(@class,'modal-content')]//button[text()='Skip Selection']");
        this.dobDisabledTextbox = page.locator("xpath=//input[@id='txtDate' and @disabled='disabled']");
        this.soldByDropdown = page.locator('#btnSelectSoldBy')
        this.soldByDropdownSelection = page.locator("(//div[@id='dvSoldBy']//li//a[1][not(contains(text(),'Select'))])[1]");


        // Student Information
        this.studentInformationType = page.getByRole('button', { name: 'Student Information Type' });
        this.firstName = page.getByRole('textbox', { name: 'First Name' });
        this.middleName = page.getByRole('textbox', { name: 'Middle Name' });
        this.lastName = page.getByRole('textbox', { name: 'Last Name' });
        this.address = page.getByRole('textbox', { name: 'Address' });
        this.addressSelectionDropdown = page.locator("xpath=(//div[@class='pac-item']//span[text()='New York'])[1]");
        this.city = page.getByRole('textbox', { name: 'City' })
        // this.city = page.locator('div').filter({ hasText: 'Los Angeles CountyCA, USA' }).first();
        this.apartment = page.getByPlaceholder('Apartment #').or(page.locator("//input[@id='Apartment#']")).first();
        this.preferredNickname = page.getByPlaceholder('Preferred Nickname');
        this.preferredName = page.getByRole('textbox', { name: 'Preferred Name' })
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
        this.wearGlassesDropdownSelection = page.locator("(//button[contains(@data-id,'WearGlasses')]//parent::div//li//span[1][not(contains(text(),'Select'))])[1]");
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
        this.coursePasswordTexbox = page.getByRole('textbox', { name: 'Course Password' });
        this.courseStartDate = page.locator('#dt_CourseStartDate')
        this.parentClassDifferentSchoolDropdown = page.locator("xpath=//button[@data-id='ParentClassDifferentSchool']");
        this.parentClassDifferentSchoolDropdownValue = page.locator("(//select[@id='ParentClassDifferentSchool']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");


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
        // this.textbox1 = page.getByRole('textbox', { name: 'TextBox1' });
        // this.textbox2 = page.getByRole('textbox', { name: 'TextBox2' });
        this.customDatepickers = page.locator('input[name*="dt_datepicker"]');
        this.studentDrivingNotes = page.locator('#StudentDrivingNotes');
        this.studentTypeDropdown = page.locator("xpath=//button[@data-id='StudentType']");
        this.studentTypeDropdownValue = page.locator("(//select[@id='StudentType']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.studentStatusDropdown = page.locator("xpath=//button[@data-id='StudentStatus']");
        this.studentStatusDropdownValue = page.locator("(//select[@id='StudentStatus']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.siblingName = page.getByRole('textbox', { name: 'Sibling Name' })
        this.siblingLicenseNumber = page.getByRole('textbox', { name: 'Sibling License #' })
        this.customTextbox = page.getByRole('textbox', { name: 'TextBox' });
        this.membershipNumber = page.getByRole('textbox', { name: 'Membership Number' })

        // Knowledge test fields
        this.assignToLocationDropdown = page.locator("xpath=//button[contains(@data-id,'AssignToLocation')]//span[text()='Please Select']");
        this.assignToLocationDropdownSelection = page.locator("xpath=(//button[contains(@data-id,'AssignToLocation')]//parent::div//span[contains(text(),'Location')])[1]");
        this.assignToStaffDropdown = page.locator("xpath=//button[contains(@data-id,'AssignToStaff')]//span[text()='Please Select']");
        this.assignToStaffDropdownSelection = page.locator("xpath=(//button[contains(@data-id,'AssignToStaff')]//parent::div//li)[last()]");
        this.haveYouBeenResidentOfCecilMoreThan3YearsDropdown = page.locator("xpath=//button[contains(@data-id,'HaveYouBeenResidentOfCecilMoreThan3Years')]//span[text()='Please Select']");
        this.haveYouBeenResidentOfCecilMoreThan3YearsDropdownSelection = page.locator("xpath=(//button[contains(@data-id,'HaveYouBeenResidentOfCecilMoreThan3Years')]//parent::div//li)[last()]");
        this.locationOfParentClassCompletedPreviously = page.getByRole('textbox', { name: 'Location of Parent class Completed previously' })
        this.homePickupDropoffAddress1Checkbox = page.locator("//input[@id='HomePickupDropoffAddress1']//following-sibling::span")

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
            // await this.click(this.page.getByRole('link', { name: new RegExp(packageName, 'i') }).first());
            // }
        });
    }

    /**
    * Opens the cash drawer location modal and selects the cash drawer location.
   **/
    async selectCashDrawerLocation() {
        if (await this.isVisible(this.cashDrawerLocationDropdown, { timeout: 5000 }).catch(() => false)) {
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
* Opens the sold by dropdown and selects the sold by .
**/
    async selectSoldByDropdown() {
        if (await this.isVisible(this.soldByDropdown, { timeout: 2000 }).catch(() => false)) {
            await test.step(`Select Sold By`, async () => {
                await this.click(this.soldByDropdown);
                await this.waitForVisible(this.soldByDropdownSelection);
                await this.click(this.soldByDropdownSelection);
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
        if (await this.isVisible(this.selectLocationDropdown, { timeout: 2000 }).catch(() => false)) {
            await test.step('Select location and Show All', async () => {
                await this.click(this.selectLocationDropdown);
                await this.waitForVisible(this.showAllCheckbox)
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
                await this.isVisible(this.dobDisabledTextbox, { timeout: 2000 }).catch(() => false);

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

            if (await this.isVisible(this.packageProceedButton, { timeout: 5000 }).catch(() => false)) {

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
        if (await this.isVisible(this.skipSelectionButtonAddOnServices, { timeout: 10000 }).catch(() => false)) {
            if (await this.isVisible(this.addButtonForAdditionalDetails, { timeout: 5000 }).catch(() => false)) {
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
        if (await this.isVisible(this.skipSelectionButtonRoadTestModal, { timeout: 5000 }).catch(() => false)) {
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
            await this.selectSoldByDropdown();
            await this.click(this.addPackageButton);
            await this.waitForLoaders();

            switch (packageName) {
                case 'BTW and CR Package':
                    await this.selectLocation();
                    await this.selectDOB();
                    await this.addAdditionalDetails();
                    break;
                case 'RT Package':
                    if (await this.isVisible(this.selectButton, { timeout: 5000 }).catch(() => false)) {
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
     * Fills the complete student personal, address, parent/guardian, emergency contact, notes, permit, and terms details for Teen students.
     * Organized into logical, user-friendly sections.
     * @param {Object} data - Student test data object.
     **/
    async fillTeenStudentInformation(data) {
        await test.step('Fill Teen Student Information', async () => {
            await this.waitForLoaders();

            // 1. Personal & Profile Information
            await this.selectStudentType("Teen");
            await this.waitForVisible(this.firstName);
            await this.fill(this.firstName, data.firstName);

            if (await this.isVisible(this.middleName, { timeout: 100 }).catch(() => false) && data.middleName) {
                await this.fill(this.middleName, data.middleName);
            }
            if (await this.isVisible(this.lastName, { timeout: 100 }).catch(() => false) && data.lastName) {
                await this.fill(this.lastName, data.lastName);
            }
            if (await this.isVisible(this.preferredNickname, { timeout: 100 }).catch(() => false)) {
                await this.pressSequentially(this.preferredNickname, "111111111");
            }

            if (await this.isVisible(this.preferredName, { timeout: 100 }).catch(() => false)) {
                await this.pressSequentially(this.preferredName, "111111111");
            }

            if (await this.isVisible(this.membershipNumber, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.membershipNumber, data.membershipNumber || "111111111");
            }

            if (await this.isVisible(this.studentTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.studentTypeDropdown);
                await this.waitForVisible(this.studentTypeDropdownValue);
                await this.click(this.studentTypeDropdownValue);
            }

            if (await this.isVisible(this.studentStatusDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.studentStatusDropdown);
                await this.waitForVisible(this.studentStatusDropdownValue);
                await this.click(this.studentStatusDropdownValue);
            }


            if (await this.isVisible(this.maleCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.check(this.maleCheckbox);
            }

            // 2. Address & Location
            if (await this.isVisible(this.address, { timeout: 100 }).catch(() => false) && data.address) {
                await this.pressSequentially(this.address, data.address);
                if (!await this.isVisible(this.addressSelectionDropdown, { timeout: 3000 }).catch(() => false)) {
                    await this.clear(this.address);
                    await this.pressSequentially(this.address, data.address);
                }
                if (await this.isVisible(this.addressSelectionDropdown)) {
                    await this.click(this.addressSelectionDropdown);
                }
            }
            if (await this.isVisible(this.apartment, { timeout: 100 }).catch(() => false) && data.apartment) {
                await this.fill(this.apartment, data.apartment);
            }
            if (await this.isVisible(this.stateDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.stateDropdown);
                await this.waitForVisible(this.stateOptionValue);
                await this.click(this.stateOptionValue);
            }

            if (await this.isVisible(this.zipCode, { timeout: 100 }).catch(() => false) && data.zipCode) {
                await this.fill(this.zipCode, data.zipCode);
            }

            if (await this.isVisible(this.address, { timeout: 100 }).catch(() => false) && data.address) {
                await this.fill(this.address, data.address);
            }

            if (await this.isVisible(this.city, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.city, data.city);
            }

            // 3. Contact Information
            if (await this.isVisible(this.homePhone, { timeout: 100 }).catch(() => false) && data.homePhone) {
                await this.fill(this.homePhone, data.homePhone);
            }
            const cellVal = data.studentCellPhone || data.cellPhone;
            if (await this.isVisible(this.studentCellPhone, { timeout: 100 }).catch(() => false) && cellVal) {
                await this.fill(this.studentCellPhone, cellVal);
            } else if (await this.isVisible(this.cellPhone, { timeout: 100 }).catch(() => false) && cellVal) {
                await this.fill(this.cellPhone, cellVal);
            }
            if (await this.isVisible(this.studentEmail, { timeout: 100 }).catch(() => false) && data.studentEmail) {
                await this.fill(this.studentEmail, data.studentEmail);
            }

            // 4. Parent / Guardian Information
            if (await this.isVisible(this.parentName, { timeout: 100 }).catch(() => false) && data.parentName) {
                await this.fill(this.parentName, data.parentName);
            }
            const pPhone = data.parentCellPhone || data.parentGuardianCell;
            if (await this.isVisible(this.parentCellPhone, { timeout: 100 }).catch(() => false) && pPhone) {
                await this.fill(this.parentCellPhone, pPhone);
            } else if (await this.isVisible(this.parentGuardianCell, { timeout: 100 }).catch(() => false) && pPhone) {
                await this.fill(this.parentGuardianCell, pPhone);
            }
            const pEmail = data.parentEmail || data.parentGuardianEmail;
            if (await this.isVisible(this.parentEmail, { timeout: 100 }).catch(() => false) && pEmail) {
                await this.fill(this.parentEmail, pEmail);
            } else if (await this.isVisible(this.parentGuardianEmail, { timeout: 100 }).catch(() => false) && pEmail) {
                await this.fill(this.parentGuardianEmail, pEmail);
            }

            // Parent 2 Information
            if (await this.isVisible(this.parentName2, { timeout: 100 }).catch(() => false) && data.parentName2) {
                await this.fill(this.parentName2, data.parentName2);
                if (await this.isVisible(this.parentPhone2, { timeout: 100 }).catch(() => false) && data.parentPhone2) {
                    await this.fill(this.parentPhone2, data.parentPhone2);
                }
            }
            if (await this.isVisible(this.parentEmail2, { timeout: 100 }).catch(() => false) && data.parentEmail2) {
                await this.fill(this.parentEmail2, data.parentEmail2);
            }

            // Parent Class Requirements
            if (await this.isVisible(this.parentClassDifferentSchoolDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.parentClassDifferentSchoolDropdown);
                await this.waitForVisible(this.parentClassDifferentSchoolDropdownValue);
                await this.click(this.parentClassDifferentSchoolDropdownValue);
            }
            if (await this.isVisible(this.locationOfParentClassCompletedPreviously, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.locationOfParentClassCompletedPreviously, data.address || "Main Location");
            }

            // 5. Emergency Contact
            if (await this.isVisible(this.emergencyName, { timeout: 100 }).catch(() => false) && data.emergencyName) {
                await this.fill(this.emergencyName, data.emergencyName);
                if (await this.isVisible(this.emergencyRelationship, { timeout: 100 }).catch(() => false) && data.emergencyRelationship) {
                    await this.fill(this.emergencyRelationship, data.emergencyRelationship);
                }
                if (await this.isVisible(this.emergencyPhone, { timeout: 100 }).catch(() => false) && data.emergencyPhone) {
                    await this.fill(this.emergencyPhone, data.emergencyPhone);
                }
            }

            // 6. Identification & Legal
            if (await this.isVisible(this.socialSecurityNumber, { timeout: 100 }).catch(() => false) && data.socialSecurityNumber) {
                await this.fill(this.socialSecurityNumber, data.socialSecurityNumber);
            }
            if (await this.isVisible(this.studentSignature, { timeout: 100 }).catch(() => false) && data.studentSignature) {
                await this.fill(this.studentSignature, data.studentSignature);
            }

            // 7. Course & Classroom Details
            if (await this.isVisible(this.coursePasswordTexbox, { timeout: 100 }).catch(() => false) && data.coursePassword) {
                await this.fill(this.coursePasswordTexbox, data.coursePassword);
            }
            if (await this.isVisible(this.courseStartDate, { timeout: 100 }).catch(() => false) && data.courseStartDate) {
                await this.pressSequentially(this.courseStartDate, data.courseStartDate);
                await this.page.keyboard.press('Tab');
            }

            // 8. School & Physical Attributes
            if (await this.isVisible(this.highSchoolDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.highSchoolDropdown);
                await this.waitForVisible(this.highSchoolDropdownSelection);
                await this.click(this.highSchoolDropdownSelection);
            }
            if (await this.isVisible(this.wearGlassesDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.wearGlassesDropdown);
                await this.waitForVisible(this.wearGlassesDropdownSelection);
                await this.click(this.wearGlassesDropdownSelection);
            }
            if (await this.isVisible(this.haveYouBeenResidentOfCecilMoreThan3YearsDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.haveYouBeenResidentOfCecilMoreThan3YearsDropdown);
                await this.waitForVisible(this.haveYouBeenResidentOfCecilMoreThan3YearsDropdownSelection);
                await this.click(this.haveYouBeenResidentOfCecilMoreThan3YearsDropdownSelection);
            }

            // 9. Permit Information
            if (await this.isVisible(this.permitNumber, { timeout: 100 }).catch(() => false) && data.permitNumber) {
                await this.fill(this.permitNumber, data.permitNumber);
            }
            if (await this.isVisible(this.permitIssuedDateCalendarIcon, { timeout: 100 }).catch(() => false)) {
                await this.click(this.permitIssuedDateCalendarIcon);
                if (await this.isVisible(this.permitIssueDateSelectInCalendar, { timeout: 3000 }).catch(() => false)) {
                    await this.click(this.permitIssueDateSelectInCalendar);
                }
            }
            if (await this.isVisible(this.permitExpirationDateCalendarIcon, { timeout: 100 }).catch(() => false)) {
                await this.click(this.permitExpirationDateCalendarIcon);
                if (await this.isVisible(this.permitExpireDateSelectInCalendar, { timeout: 3000 }).catch(() => false)) {
                    await this.click(this.permitExpireDateSelectInCalendar);
                }
            }

            // 10. Medical & Notes
            if (await this.isVisible(this.medicalConditions, { timeout: 100 }).catch(() => false) && data.medicalConditions) {
                await this.fill(this.medicalConditions, data.medicalConditions);
            }
            if (await this.isVisible(this.studentNotes, { timeout: 100 }).catch(() => false) && data.studentNotes) {
                await this.fill(this.studentNotes, data.studentNotes);
            }
            const drivingNotes = data.studentDrivingNotes || data.drivingNotes;
            if (await this.isVisible(this.studentDrivingNotes, { timeout: 100 }).catch(() => false) && drivingNotes) {
                await this.fill(this.studentDrivingNotes, drivingNotes);
            }

            // 11. Custom TextBoxes & DatePickers
            // if (await this.isVisible(this.textbox1, { timeout: 1000 }).catch(() => false)) {
            //     await this.fill(this.textbox1, data.textbox1 || "TextBox1 Notes");
            // }
            // if (await this.isVisible(this.textbox2, { timeout: 1000 }).catch(() => false)) {
            //     await this.fill(this.textbox2, data.textbox2 || "TextBox2 Notes");
            // }

            const textbox = this.customTextbox;
            let count = await textbox.count();
            if (count > 0) {
                for (let i = 0; i < count; i++) {
                    const input = textbox.nth(i);
                    if (await this.isVisible(input, { timeout: 100 }).catch(() => false)) {
                        await this.fill(input, "textbox");

                    }
                }
            }
            const datepickers = this.customDatepickers;
            count = await datepickers.count();
            if (count > 0 && data.datePicker) {
                for (let i = 0; i < count; i++) {
                    const input = datepickers.nth(i);
                    if (await this.isVisible(input, { timeout: 200 }).catch(() => false)) {
                        await this.pressSequentially(input, data.datePicker);
                        await this.page.waitForTimeout(500);
                        await this.page.keyboard.press('Tab');
                    }
                }
            }

            // 12. Lead Source & Terms & Conditions
            if (await this.isVisible(this.leadDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.leadDropdown);
                if (await this.isVisible(this.leadDropdownSelection, { timeout: 1000 }).catch(() => false)) {
                    await this.click(this.leadDropdownSelection);
                }
            }
            if (await this.isVisible(this.termsConditionsCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.check(this.termsConditionsCheckbox);
            }

            if (await this.isVisible(this.siblingName, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.siblingName, data.siblingName);
            }
            if (await this.isVisible(this.siblingLicenseNumber, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.siblingLicenseNumber, data.siblingLicenseNumber);
            }

            if (await this.isVisible(this.homePickupDropoffAddress1Checkbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.homePickupDropoffAddress1Checkbox);
            }
        });
    }

    /**
     * Unified method that fills complete student personal, address, parent/guardian, emergency contact, notes, permit, and terms details.
     * Employs safe conditional checks on every single field locator and data property to support Teen, Road Test, Adult, Knowledge Test, or custom packages.
     * Organized into logical, user-friendly sections.
     * @param {Object} data - Student test data object.
     * @param {string} [studentType] - Student type to select (e.g. "Teen", "Road Test", "Adult", "Knowledge Test").
     **/
    async fillStudentInformation(data, studentType) {
        const typeLabel = studentType || "Student";
        await test.step(`Fill ${typeLabel} Information`, async () => {
            this.uniqueId = `${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
            await this.waitForLoaders().catch(() => { });

            // 1. Personal & Profile Information
            if (studentType) {
                await this.selectStudentType(studentType);
            }

            await this.waitForVisible(this.firstName);
            await this.fill(this.firstName, `${data.firstName}_${this.uniqueId}`);

            if (await this.isVisible(this.middleName, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.middleName, `${data.middleName}_${this.uniqueId}`);
            }
            if (await this.isVisible(this.lastName, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.lastName, data.lastName);
            }
            if (await this.isVisible(this.preferredNickname, { timeout: 100 }).catch(() => false)) {
                await this.pressSequentially(this.preferredNickname, "111111111");
            }

            if (await this.isVisible(this.preferredName, { timeout: 100 }).catch(() => false)) {
                await this.pressSequentially(this.preferredName, "111111111");
            }

            if (await this.isVisible(this.membershipNumber, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.membershipNumber, data.membershipNumber || "111111111");
            }

            if (await this.isVisible(this.studentTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.studentTypeDropdown);
                await this.waitForVisible(this.studentTypeDropdownValue);
                await this.click(this.studentTypeDropdownValue);
            }

            if (await this.isVisible(this.studentStatusDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.studentStatusDropdown);
                await this.waitForVisible(this.studentStatusDropdownValue);
                await this.click(this.studentStatusDropdownValue);
            }

            if (await this.isVisible(this.maleCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.check(this.maleCheckbox);
            }

            // 2. Knowledge Test Specific Assignment Fields
            if (await this.isVisible(this.assignToLocationDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.assignToLocationDropdown);
                await this.waitForVisible(this.assignToLocationDropdownSelection);
                await this.click(this.assignToLocationDropdownSelection);
            }
            if (await this.isVisible(this.assignToStaffDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.assignToStaffDropdown);
                await this.waitForVisible(this.assignToStaffDropdownSelection);
                await this.click(this.assignToStaffDropdownSelection);
            }

            // 3. Address & Location
            if (await this.isVisible(this.address, { timeout: 100 }).catch(() => false) && data.address) {
                await this.pressSequentially(this.address, data.address);
                if (!await this.isVisible(this.addressSelectionDropdown, { timeout: 3000 }).catch(() => false)) {
                    await this.clear(this.address);
                    await this.pressSequentially(this.address, data.address);
                }
                if (await this.isVisible(this.addressSelectionDropdown)) {
                    await this.click(this.addressSelectionDropdown);
                }
            }
            if (await this.isVisible(this.apartment, { timeout: 100 }).catch(() => false) && data.apartment) {
                await this.fill(this.apartment, data.apartment);
            }
            if (await this.isVisible(this.stateDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.stateDropdown);
                await this.waitForVisible(this.stateOptionValue);
                await this.click(this.stateOptionValue);
            }
            if (await this.isVisible(this.zipCode, { timeout: 100 }).catch(() => false) && data.zipCode) {
                await this.fill(this.zipCode, data.zipCode);
            }
            if (await this.isVisible(this.city, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.city, data.city);
            }

            if (await this.isVisible(this.address, { timeout: 100 }).catch(() => false) && data.address) {
                await this.fill(this.address, data.address);
            }

            // 4. Contact Information
            if (await this.isVisible(this.homePhone, { timeout: 100 }).catch(() => false) && data.homePhone) {
                await this.fill(this.homePhone, data.homePhone);
            }
            const cellPhoneValue = data.cellPhone || data.studentCellPhone;
            if (await this.isVisible(this.studentCellPhone, { timeout: 100 }).catch(() => false) && cellPhoneValue) {
                await this.fill(this.studentCellPhone, cellPhoneValue);
            } else if (await this.isVisible(this.cellPhone, { timeout: 100 }).catch(() => false) && cellPhoneValue) {
                await this.fill(this.cellPhone, cellPhoneValue);
            }
            if (await this.isVisible(this.studentEmail, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.studentEmail, `${data.firstName}_${this.uniqueId}@gmail.com`);
            }

            // 5. Parent / Guardian Information
            if (await this.isVisible(this.parentName, { timeout: 100 }).catch(() => false) && data.parentName) {
                await this.fill(this.parentName, data.parentName);
            }
            const parentPhoneVal = data.parentGuardianCell || data.parentCellPhone;
            if (await this.isVisible(this.parentCellPhone, { timeout: 100 }).catch(() => false) && parentPhoneVal) {
                await this.fill(this.parentCellPhone, parentPhoneVal);
            } else if (await this.isVisible(this.parentGuardianCell, { timeout: 100 }).catch(() => false) && parentPhoneVal) {
                await this.fill(this.parentGuardianCell, parentPhoneVal);
            }
            const parentEmailVal = data.parentGuardianEmail || data.parentEmail;
            if (await this.isVisible(this.parentEmail, { timeout: 100 }).catch(() => false) && parentEmailVal) {
                await this.fill(this.parentEmail, parentEmailVal);
            } else if (await this.isVisible(this.parentGuardianEmail, { timeout: 100 }).catch(() => false) && parentEmailVal) {
                await this.fill(this.parentGuardianEmail, parentEmailVal);
            }

            // Parent 2 Information
            if (await this.isVisible(this.parentName2, { timeout: 100 }).catch(() => false) && data.parentName2) {
                await this.fill(this.parentName2, data.parentName2);
                if (await this.isVisible(this.parentPhone2, { timeout: 100 }).catch(() => false) && data.parentPhone2) {
                    await this.fill(this.parentPhone2, data.parentPhone2);
                }
            }
            if (await this.isVisible(this.parentEmail2, { timeout: 100 }).catch(() => false) && data.parentEmail2) {
                await this.fill(this.parentEmail2, data.parentEmail2);
            }

            // Parent Class Requirements
            if (await this.isVisible(this.parentClassDifferentSchoolDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.parentClassDifferentSchoolDropdown);
                await this.waitForVisible(this.parentClassDifferentSchoolDropdownValue);
                await this.click(this.parentClassDifferentSchoolDropdownValue);
            }
            if (await this.isVisible(this.locationOfParentClassCompletedPreviously, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.locationOfParentClassCompletedPreviously, data.address || "Main Location");
            }

            // 6. Emergency Contact
            if (await this.isVisible(this.emergencyName, { timeout: 100 }).catch(() => false) && data.emergencyName) {
                await this.fill(this.emergencyName, data.emergencyName);
                if (await this.isVisible(this.emergencyRelationship, { timeout: 100 }).catch(() => false) && data.emergencyRelationship) {
                    await this.fill(this.emergencyRelationship, data.emergencyRelationship);
                }
                if (await this.isVisible(this.emergencyPhone, { timeout: 100 }).catch(() => false) && data.emergencyPhone) {
                    await this.fill(this.emergencyPhone, data.emergencyPhone);
                }
            }

            // 7. Identification & Legal
            if (await this.isVisible(this.socialSecurityNumber, { timeout: 100 }).catch(() => false) && data.socialSecurityNumber) {
                await this.fill(this.socialSecurityNumber, data.socialSecurityNumber);
            }
            if (await this.isVisible(this.studentSignature, { timeout: 100 }).catch(() => false) && data.studentSignature) {
                await this.fill(this.studentSignature, data.studentSignature);
            }

            // 8. Course & Classroom Details
            if (await this.isVisible(this.coursePasswordTexbox, { timeout: 100 }).catch(() => false) && data.coursePassword) {
                await this.fill(this.coursePasswordTexbox, data.coursePassword);
            }
            if (await this.isVisible(this.courseStartDate, { timeout: 100 }).catch(() => false) && data.courseStartDate) {
                await this.pressSequentially(this.courseStartDate, data.courseStartDate);
                await this.page.keyboard.press('Tab');
            }

            // 9. School & Physical Attributes
            if (await this.isVisible(this.highSchoolDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.highSchoolDropdown);
                await this.waitForVisible(this.highSchoolDropdownSelection);
                await this.click(this.highSchoolDropdownSelection);
            }
            if (await this.isVisible(this.wearGlassesDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.wearGlassesDropdown);
                await this.waitForVisible(this.wearGlassesDropdownSelection);
                await this.click(this.wearGlassesDropdownSelection);
            }
            if (await this.isVisible(this.haveYouBeenResidentOfCecilMoreThan3YearsDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.haveYouBeenResidentOfCecilMoreThan3YearsDropdown);
                await this.waitForVisible(this.haveYouBeenResidentOfCecilMoreThan3YearsDropdownSelection);
                await this.click(this.haveYouBeenResidentOfCecilMoreThan3YearsDropdownSelection);
            }

            // 10. Permit Information
            if (await this.isVisible(this.permitNumber, { timeout: 100 }).catch(() => false) && data.permitNumber) {
                await this.fill(this.permitNumber, data.permitNumber);
            }
            const issuedIcon = (await this.isVisible(this.dlPermitIssuedDateCalendarIcon, { timeout: 1000 }).catch(() => false))
                ? this.dlPermitIssuedDateCalendarIcon
                : this.permitIssuedDateCalendarIcon;
            if (await this.isVisible(issuedIcon, { timeout: 2000 }).catch(() => false)) {
                await this.click(issuedIcon);
                if (await this.isVisible(this.permitIssueDateSelectInCalendar, { timeout: 2000 }).catch(() => false)) {
                    await this.click(this.permitIssueDateSelectInCalendar);
                }
            }
            const expireIcon = (await this.isVisible(this.dlPermitExpirationDateCalendarIcon, { timeout: 1000 }).catch(() => false))
                ? this.dlPermitExpirationDateCalendarIcon
                : this.permitExpirationDateCalendarIcon;
            if (await this.isVisible(expireIcon, { timeout: 1000 }).catch(() => false)) {
                await this.click(expireIcon);
                if (await this.isVisible(this.permitExpireDateSelectInCalendar, { timeout: 2000 }).catch(() => false)) {
                    await this.click(this.permitExpireDateSelectInCalendar);
                }
            }

            // 11. Medical & Notes
            if (await this.isVisible(this.medicalConditions, { timeout: 100 }).catch(() => false) && data.medicalConditions) {
                await this.fill(this.medicalConditions, data.medicalConditions);
            }
            if (await this.isVisible(this.studentNotes, { timeout: 100 }).catch(() => false) && data.studentNotes) {
                await this.fill(this.studentNotes, data.studentNotes);
            }
            const drivingNotesVal = data.studentDrivingNotes || data.drivingNotes;
            if (await this.isVisible(this.studentDrivingNotes, { timeout: 100 }).catch(() => false) && drivingNotesVal) {
                await this.fill(this.studentDrivingNotes, drivingNotesVal);
            } else if (await this.isVisible(this.drivingNotes, { timeout: 100 }).catch(() => false) && drivingNotesVal) {
                await this.fill(this.drivingNotes, drivingNotesVal);
            }

            // 12. Custom TextBoxes & DatePickers
            // if (await this.isVisible(this.textbox1, { timeout: 1000 }).catch(() => false)) {
            //     await this.fill(this.textbox1, data.textbox1 || "TextBox1 Notes");
            // }
            // if (await this.isVisible(this.textbox2, { timeout: 1000 }).catch(() => false)) {
            //     await this.fill(this.textbox2, data.textbox2 || "TextBox2 Notes");
            // }

            const textbox = this.customTextbox;
            let count = await textbox.count();
            if (count > 0) {
                for (let i = 0; i < count; i++) {
                    const input = textbox.nth(i);
                    if (await this.isVisible(input, { timeout: 100 }).catch(() => false)) {
                        await this.pressSequentially(input, "111111111");

                    }
                }
            }

            const datepickerInputs = this.customDatepickers;
            const datepickerCount = await datepickerInputs.count();
            if (datepickerCount > 0 && data.datePicker) {
                for (let i = 0; i < datepickerCount; i++) {
                    const input = datepickerInputs.nth(i);
                    if (await this.isVisible(input, { timeout: 200 }).catch(() => false)) {
                        await this.pressSequentially(input, data.datePicker);
                        await this.page.waitForTimeout(500);
                        await this.page.keyboard.press('Tab');
                    }
                }
            }

            // 13. Lead Source & Terms & Conditions
            if (await this.isVisible(this.leadDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.leadDropdown);
                if (await this.isVisible(this.leadDropdownSelection, { timeout: 200 }).catch(() => false)) {
                    await this.click(this.leadDropdownSelection);
                }
            }
            if (await this.isVisible(this.termsConditionsCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.termsConditionsCheckbox);
            }

            if (await this.isVisible(this.siblingName, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.siblingName, data.siblingName);
            }
            if (await this.isVisible(this.siblingLicenseNumber, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.siblingLicenseNumber, data.siblingLicenseNumber);
            }

            if (await this.isVisible(this.homePickupDropoffAddress1Checkbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.homePickupDropoffAddress1Checkbox);
            }
        });
    }

    /**
     * Selects Month, Day, and Year from the student details Date of Birth dropdown controls.
    **/
    async selectDOBInStudentDetails() {
        await test.step('Select DOB in Student Details', async () => {
            if (await this.isVisible(this.dobMonthDropdown, { timeout: 5000 }).catch(() => false)) {
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
            await this.waitForVisible(this.page.getByText('Your enrollment has been completed and a confirmation email has been sent.', { exact: true }), { timeout: 30000 });
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