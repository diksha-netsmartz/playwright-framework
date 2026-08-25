import BasePage from '../../utils/BasePage';
import { expect, test } from '@playwright/test';
import config from '../../config/config';
import oeData from '../../test-data/onlineEnrollmentData.json';

/**
 * Page Object representing the Adult Online Enrollment Page.
 * Handles package selection, student and parent details, payment options, SMS opt-in, and registration verification.
 **/
export default class AdultOnlineEnrollmentPage extends BasePage {
    /**
     * Initializes locators and state for the Adult Online Enrollment Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);
        this.uniqueId = Date.now();
        // Package selection
        this.btwPackageBtn = page.locator("xpath=//p[text()='BTW Package']//ancestor::tr//a[@data-target='#btnSelect']");

        // Student info
        this.firstNameTxt = page.getByRole('textbox', { name: 'First Name' });
        this.middlenameTxt = page.getByRole('textbox', { name: 'Middle Name' });
        this.lastNameTxt = page.getByRole('textbox', { name: 'Last Name' });
        this.addressTxt = page.getByRole('textbox', { name: 'Address' });
        this.addressSelectionDropdown = page.locator("xpath=(//div[@class='pac-item']//span[text()='New York'])[1]");
        this.zipCodeTxt = page.locator("#ZipPostalCode");
        this.homePhoneTxt = page.getByRole('textbox', { name: 'Home Phone' });
        this.cellPhoneTxt = page.getByRole('textbox', { name: 'Cell Phone' });
        this.emailTxt = page.locator("#Email");

        // Parent / Guardian 1
        this.parentGuardianNameTxt = page.locator("#ParentName");
        this.parentGuardianCellTxt = page.locator("#ParentPhone");
        this.parentGuardianEmailTxt = page.locator("#ParentEmail1");

        // Parent 2
        this.parentNameTxt = page.locator("#ParentName2");
        this.parentPhoneTxt = page.locator("#ParentPhone2");
        this.parentEmailTxt = page.locator("#ParentEmail2");

        // Emergency contact
        this.emergencyNameTxt = page.getByRole('textbox', { name: 'Emergency Name' });
        this.emergencyRelationshipTxt = page.getByRole('textbox', { name: 'Emergency Relationship' });
        this.emergencyPhoneTxt = page.getByRole('textbox', { name: 'Emergency Phone' });

        // Date of birth
        this.dobMonthDdl = page.locator("xpath=//span[@aria-owns='int_DOB_Day_listbox']");
        this.monthSelectionInDropdown = page.locator("xpath=(//ul[@id='int_DOB_Day_listbox'])[last()]//li[text()='Feb']");
        this.dobDayDdl = page.locator("xpath=//span[@aria-owns='int_DOB_Month_listbox']");
        this.daySelectionInDropdown = page.locator("xpath=(//ul[@id='int_DOB_Month_listbox'])[last()]//li[text()='02']");
        this.dobYearDdl = page.locator("xpath=//span[@aria-owns='int_DOB_Year_listbox']");
        this.yearSelectionInDropdown = page.locator("xpath=(//ul[@id='int_DOB_Year_listbox'])[last()]//li[text()='2009']");

        // Other fields
        this.highSchoolDropdown = page.locator("xpath=//span[contains(@aria-owns,'HighSchool')]//span[text()='Please Select']");
        this.highSchoolDropdownSelection = page.locator("xpath=((//ul[@id='HighSchool_listbox'])[last()]//li[contains(text(),'High')])[1]");
        this.wearGlassesDropdown = page.locator("xpath=//span[contains(@aria-owns,'WearGlasses')]//span[text()='Please Select']");
        this.wearGlassesDropdownSelection = page.locator("xpath=(//ul[@id='WearGlassesContacts_listbox'])[last()]//li[text()='Yes']");
        this.howDidYouHearAbtUsDropdown = page.locator("xpath=//span[contains(@aria-owns,'Lead')]//span[text()='Please Select']");
        this.howDidYouHearAbtUsDropdownSelection = page.locator("xpath=((//ul[@id='Lead_listbox'])[last()]//li[contains(text(),'Lead')])[1]");
        this.femaleRadioButton = page.locator("xpath=//input[@fieldval='Female']//parent::label");
        this.medicalConditionsTxt = page.locator('#MedicalConditions');
        this.permitNumberTxt = page.getByRole('textbox', { name: 'Permit #' });
        this.collegeIdTxt = page.getByRole('textbox', { name: 'CollegeID' });
        this.termsConditionsCheckbox = page.locator("xpath=//input[@id='TermsConditions']//following-sibling::span");
        this.permitIssuedDateCalendarIcon = page.locator("xpath=//input[@lblname='Permit Issued Date']//following-sibling::span//span");
        this.permitIssueDateSelectInCalendar = page.locator("xpath=(//div[contains(@id,'PermitIssue')]//td//a)[1]");
        this.permitExpirationDateCalendarIcon = page.locator("xpath=//input[@lblname='Permit Expiration Date']//following-sibling::span//span");
        this.permitExpireDateSelectInCalendar = page.locator("xpath=(//div[contains(@id,'ExpirePermit')]//td//a)[last()]");
        this.studentSignature = page.locator('#StudentSignature');
        this.parentSignature = page.locator("#ParentSignature");
        this.last6DigitsParentsDriverLicense = page.locator('#Last6digitsofparentDriversLicense');

        // Actions
        this.payLaterBtn = page.getByRole('button', { name: 'Pay Later' });
        this.smsNumber = page.locator('#txtSmsPhoneNumber');
        this.addButton = page.locator('#btnSavePhoneNumber');
        this.optInButton = page.locator('#btnSubmitInDBPhoneNumber');
        this.printReceiptLink = page.getByRole('link', { name: 'Print Receipt' }).last();
    }

    /**
     * Navigates to the Adult Online Enrollment page using the configured adult OE URL.
    **/
    async navigateToAdultOEPage() {
        await test.step('Navigate to Adult Online Enrollment Page', async () => {
            await this.navigate(config.adultOEURL);
        });
    }

    /**
     * Selects the Behind-The-Wheel (BTW) Package from the packages list.
    **/
    async selectBTWPackage() {
        await test.step('Select BTW Package', async () => {
            await this.click(this.btwPackageBtn);
        });
    }

    /**
     * Types the student address sequentially to trigger Google autocomplete and selects the address option.
     * @param {string} address - The street address to enter.
    **/
    async fillAddress(address) {
        await test.step(`Fill address: "${address}"`, async () => {
            await this.pressSequentially(this.addressTxt, address);
            await this.waitForVisible(this.addressSelectionDropdown);
            await this.click(this.addressSelectionDropdown);
        });
    }

    /**
     * Selects the Date of Birth (Year, Day, Month) from custom Kendo dropdown controls.
    **/
    async selectDOB() {
        await test.step('Select Date of Birth', async () => {
            await this.click(this.dobYearDdl);
            await this.waitForVisible(this.yearSelectionInDropdown);
            await this.page.evaluate(el => el.click(), await this.yearSelectionInDropdown.elementHandle());
            await this.click(this.dobDayDdl);
            await this.waitForVisible(this.daySelectionInDropdown);
            await this.page.evaluate(el => el.click(), await this.daySelectionInDropdown.elementHandle());
            await this.click(this.dobMonthDdl);
            await this.waitForVisible(this.monthSelectionInDropdown);
            await this.page.evaluate(el => el.click(), await this.monthSelectionInDropdown.elementHandle());
        });
    }

    /**
     * Fills the entire student registration form including personal info, parent/guardian info,
     * emergency contacts, high school, gender, medical info, permit dates, terms, and signatures.
    **/
    async fillStudentInfo() {
        await test.step('Fill Adult Student Registration Form', async () => {
            this.uniqueId = `${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
            const data = oeData.student;
            const random7 = String(Math.floor(1000000 + Math.random() * 9000000));
            const phone = `(555)${random7.slice(0, 3)}-${random7.slice(3)}`;

            await this.fill(this.firstNameTxt, `${data.firstName}_${this.uniqueId}`);
            await this.fill(this.middlenameTxt, data.middleName);
            await this.fill(this.lastNameTxt, data.lastName);
            await this.fillAddress(data.address);
            await this.fill(this.homePhoneTxt, `(212)${random7.slice(0, 3)}-${random7.slice(3)}`);
            await this.fill(this.cellPhoneTxt, phone);
            await this.fill(this.emailTxt, `adult_${this.uniqueId}@gmail.com`);
            await this.fill(this.parentGuardianNameTxt, data.parentGuardianName);
            await this.fill(this.parentGuardianCellTxt, phone);
            await this.fill(this.parentGuardianEmailTxt, `parent_${this.uniqueId}@gmail.com`);
            await this.fill(this.parentNameTxt, data.parentName);
            await this.fill(this.parentPhoneTxt, `(999)${random7.slice(0, 3)}-${random7.slice(3)}`);
            await this.fill(this.parentEmailTxt, `parent2_${this.uniqueId}@gmail.com`);
            await this.fill(this.emergencyNameTxt, data.emergencyName);
            await this.fill(this.emergencyRelationshipTxt, data.emergencyRelationship);
            await this.fill(this.emergencyPhoneTxt, `(333)${random7.slice(0, 3)}-${random7.slice(3)}`);
            await this.selectDOB();
            await this.click(this.highSchoolDropdown);
            await this.page.evaluate(el => el.click(), await this.highSchoolDropdownSelection.elementHandle());
            await this.click(this.wearGlassesDropdown);
            await this.page.evaluate(el => el.click(), await this.wearGlassesDropdownSelection.elementHandle());
            await this.page.evaluate(el => el.click(), await this.femaleRadioButton.elementHandle());
            await this.fill(this.medicalConditionsTxt, data.medicalConditions);
            await this.click(this.howDidYouHearAbtUsDropdown);
            await this.page.evaluate(el => el.click(), await this.howDidYouHearAbtUsDropdownSelection.elementHandle());
            await this.page.evaluate(el => el.click(), await this.permitIssuedDateCalendarIcon.elementHandle());
            await this.page.waitForTimeout(1000);
            try {
                await this.permitIssueDateSelectInCalendar.waitFor({ state: "visible", timeout: 2000 });
            } catch {
                console.log("calendar not opened, opening again");
                await this.page.evaluate(el => el.click(), await this.permitIssuedDateCalendarIcon.elementHandle());
                await this.permitIssueDateSelectInCalendar.waitFor({ state: "visible", timeout: 2000 });
            }
            await this.click(this.permitIssueDateSelectInCalendar);
            await this.fill(this.permitNumberTxt, String(this.uniqueId));
            await this.fill(this.collegeIdTxt, data.collegeId);
            await this.page.evaluate(el => el.click(), await this.permitExpirationDateCalendarIcon.elementHandle());
            await this.page.waitForTimeout(1000);
            try {
                await this.permitExpireDateSelectInCalendar.waitFor({ state: "visible", timeout: 2000 });
            } catch {
                console.log("calendar not opened, opening again");
                await this.page.evaluate(el => el.click(), await this.permitExpirationDateCalendarIcon.elementHandle());
                await this.permitExpireDateSelectInCalendar.waitFor({ state: "visible", timeout: 2000 });
            }
            await this.click(this.permitExpireDateSelectInCalendar);
            await this.page.evaluate(el => el.click(), await this.termsConditionsCheckbox.elementHandle());
            await this.fill(this.addressTxt, "ny");
            await this.fill(this.zipCodeTxt, data.zipCode);
            await this.fill(this.studentSignature, data.firstName);
            await this.fill(this.parentSignature, data.parentName);
            await this.fill(this.last6DigitsParentsDriverLicense, data.parentsDriverLicense);
        });
    }

    /**
     * Clicks the 'Pay Later' button to proceed without immediate online payment.
    **/
    async clickPayLater() {
        await test.step('Click Pay Later button', async () => {
            await this.click(this.payLaterBtn);
        });
    }

    /**
     * Handles the SMS notification popup by entering the phone number, adding it, and opting in.
    **/
    async smsPopup() {
        await test.step('Handle SMS notification popup', async () => {
            const data = oeData.student;
            await this.waitForVisible(this.smsNumber);
            await this.fill(this.smsNumber, data.smsNumber);
            await this.click(this.addButton);
            await this.click(this.optInButton);
        });
    }

    /**
     * Verifies that the registration receipt page is displayed with confirmation heading.
    **/
    async verifyReceiptPage() {
        await test.step('Verify REGISTRATION COMPLETED receipt page', async () => {
            await this.verifyVisible(this.page.getByText('REGISTRATION COMPLETED', { exact: true }));
        });
    }
}

