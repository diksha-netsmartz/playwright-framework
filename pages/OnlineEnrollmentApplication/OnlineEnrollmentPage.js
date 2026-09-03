import BasePage from '../../utils/BasePage';
import config from '../../config/config';
import { test } from '@playwright/test';
import oeData from '../../test-data/json/onlineEnrollmentData.json';
import PdfHelper from '../../utils/PdfHelper';

/**
 * Unified Page Object representing the Online Enrollment Application (COE).
 * Handles student registration across Teen, Adult, Written Test (WT), and Road Test (RT) enrollment flows.
 **/
export default class OnlineEnrollmentPage extends BasePage {

    /**
     * Initializes locators for the Online Enrollment forms.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Package selection
        this.btwPackageBtn = page.locator("xpath=(//p[contains(text(),'BTW Package')]//ancestor::tr//a[@data-target='#btnSelect'])[1]");
        this.rtPackageBtn = page.locator("xpath=(//p[contains(text(),'RT Package')]//ancestor::tr//a[@data-target='#btnSelect'])[1]");
        this.btwCRPackage = page.locator("(//p[text()='BTW and CR Package' or text()='This is BTW and CR Package']//ancestor::tr//a)[1]");
        this.additionalPackageCheckbox = page.locator("(//input[@type='checkbox' and contains(@class,'AdditionalProduct')]//following-sibling::span)[1]");
        this.continueAdditionalProduct = page.locator('#btnContinueAdditionalProduct');
        this.showAppointmentButton = page.locator('#btnAvailableClass');
        this.selectButton = page.locator("xpath=(//input[@value='Select'])[1]");
        this.continueButton = page.locator("xpath=(//input[@value='Continue'])[1]");

        // Student info header
        this.studentInfoCaption = page.locator("xpath=//span[contains(text(),'Student Information') and contains(@class,'caption')]");

        // Personal Information
        this.firstNameTxt = page.getByRole('textbox', { name: 'First Name' });
        this.middlenameTxt = page.getByRole('textbox', { name: 'Middle Name' });
        this.lastNameTxt = page.getByRole('textbox', { name: 'Last Name' });
        this.addressTxt = page.getByRole('textbox', { name: 'Address' });
        this.addressSelectionDropdown = page.locator("xpath=(//div[@class='pac-item']//span[text()='New York'])[1]");
        this.zipCodeTxt = page.locator('#ZipPostalCode');
        this.homePhoneTxt = page.getByRole('textbox', { name: 'Home Phone' });
        this.cellPhoneTxt = page.getByRole('textbox', { name: 'Cell Phone' });
        this.emailTxt = page.locator('#Email');
        this.textsignature = page.getByText('Text Signature');
        this.studentSignature = page.locator('#StudentSignature');

        // Parent / Guardian 1
        this.parentGuardianNameTxt = page.locator('#ParentName');
        this.parentGuardianCellTxt = page.locator('#ParentPhone');
        this.parentGuardianEmailTxt = page.locator('#ParentEmail1');

        // Parent 2
        this.parentNameTxt = page.locator('#ParentName2');
        this.parentPhoneTxt = page.locator('#ParentPhone2');
        this.parentEmailTxt = page.locator('#ParentEmail2');

        // Emergency contact
        this.emergencyNameTxt = page.getByRole('textbox', { name: 'Emergency Name' });
        this.emergencyRelationshipTxt = page.getByRole('textbox', { name: 'Emergency Relationship' });
        this.emergencyPhoneTxt = page.getByRole('textbox', { name: 'Emergency Phone' });

        // Date of birth
        this.dobMonthDdl = page.locator("xpath=//span[@aria-owns='int_DOB_Day_listbox']");
        this.monthSelectionInDropdown = page.locator("xpath=(//ul[@id='int_DOB_Day_listbox'])[last()]//li[text()='Feb']");
        this.dobDayDdl = page.locator("xpath=//span[@aria-owns='int_DOB_Month_listbox']");
        this.daySelectionInDropdown = page.locator("xpath=(//ul[@id='int_DOB_Month_listbox'])[last()]//li[text()='02']");
        this.dobYearDdl = page.locator("xpath=//span[@aria-owns='int_DOB_Year_listbox' and @aria-disabled='false']");
        this.yearSelectionInDropdown = page.locator("xpath=(//ul[@id='int_DOB_Year_listbox'])[last()]//li[text()='2009']");


        this.dobMonthPackage = page.locator("xpath=(//span[text()='Month'])[1]");
        this.monthSelectionInDropdownPackage = page.locator("xpath=(//li[text()='Feb'])[last()]");
        this.dobDayPackage = page.locator("xpath=(//span[text()='Day'])[1]");
        this.daySelectionInDropdownPackage = page.locator("xpath=(//li[text()='02'])[last()]");
        this.dobYearPackage = page.locator("xpath=(//span[text()='Year'])[1]");
        this.yearSelectionInDropdownPackage = page.locator("xpath=(//li[text()='2009'])[last()]");
        this.proceedButton = page.locator("#btnServiceForCertificationProceed");


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
        this.termsConditionsCheckbox = page.locator("(//input[@id='TermsConditions']//following-sibling::span)[1]");
        this.permitIssuedDateCalendarIcon = page.locator("xpath=//input[@lblname='Permit Issued Date']//following-sibling::span//span");
        this.permitIssueDateSelectInCalendar = page.locator("xpath=(//div[contains(@id,'PermitIssue')]//td//a)[1]");
        this.permitExpirationDateCalendarIcon = page.locator("xpath=//input[@lblname='Permit Expiration Date']//following-sibling::span//span");
        this.permitExpireDateSelectInCalendar = page.locator("xpath=(//div[contains(@id,'ExpirePermit')]//td//a)[last()]");
        this.studentSignature = page.locator('#StudentSignature');
        this.parentSignature = page.locator('#ParentSignature');
        this.last6DigitsParentsDriverLicense = page.locator('#Last6digitsofparentDriversLicense');

        // Actions
        this.payLaterBtn = page.getByRole('button', { name: 'Pay Later' });
        this.smsNumber = page.locator('#txtSmsPhoneNumber');
        this.addButton = page.locator('#btnSavePhoneNumber');
        this.optInButton = page.locator('#btnSubmitInDBPhoneNumber');
        this.printReceiptLink = page.getByRole('link', { name: 'Print Receipt' }).last();
        this.captchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
    }

    /**
     * Navigates to the Teen Online Enrollment page.
     **/
    async navigateToTeenOEPage() {
        await test.step('Navigate to Teen Online Enrollment Page', async () => {
            await this.navigate(config.teenOEURL);
        });
    }

    /**
     * Navigates to the Teen Online Enrollment page with custom query parameters (e.g. package, CR, location).
     * @param {string} [params=''] - Parameter string to append (e.g. '&param=BTW1', '&CR=CR1', '&param=BTWCR1&CR=CR1', etc.)
     **/
    async navigateToTeenOEPageWithParams(params = '') {
        await test.step(`Navigate to Teen Online Enrollment Page with params: "${params}"`, async () => {
            let url = config.teenOEURL;
            if (params) {
                const cleanParams = String(params).trim();
                const separator = cleanParams.startsWith('&') || cleanParams.startsWith('?') ? '' : '&';
                url = `${url}${separator}${cleanParams}`;
            }
            await this.navigate(url);
        });
    }

    /**
     * Navigates to the Adult Online Enrollment page.
     **/
    async navigateToAdultOEPage() {
        await test.step('Navigate to Adult Online Enrollment Page', async () => {
            await this.navigate(config.adultOEURL);
        });
    }

    /**
     * Navigates to the Written Test (WT) Online Enrollment page.
     **/
    async navigateToWTOEPage() {
        await test.step('Navigate to WT Online Enrollment Page', async () => {
            await this.navigate(config.ktOEURL);
        });
    }

    /**
     * Navigates to the Road Test (RT) Online Enrollment page.
     **/
    async navigateToRTOEPage() {
        await test.step('Navigate to RT Online Enrollment Page', async () => {
            await this.navigate(config.rtOEURL);
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
     * Selects the Road Test (RT) Package and schedules the first available appointment.
     **/
    async selectRTPackage() {
        await test.step('Select RT Package and available appointment', async () => {
            // await this.click(this.rtPackageBtn);
            await this.click(this.showAppointmentButton);
            await this.waitForVisible(this.selectButton);
            await this.click(this.selectButton);
            if (await this.isVisible(this.continueButton), { timeout: 2000 }) {
                await this.click(this.continueButton);
            }
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Clicks on the Select button for any classroom session/class.
     **/
    async selectClass() {
        await test.step('Click on the Select button for location', async () => {
            await this.waitForLoaders().catch(() => { });
            // const selectBtn = this.page.locator("(//input[@value='Select'])[1]");
            await this.waitForVisible(this.selectButton);
            await this.click(this.selectButton);
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Selects BTW and CR Package from the select package modal popup (#btnSelectPackageByClass).
     **/
    async selectBtwAndCrPackage() {
        await test.step('From the select package pop-up, select BTW and CR Package', async () => {
            await this.waitForLoaders().catch(() => { });
            await this.waitForVisible(this.btwCRPackage);
            await this.click(this.btwCRPackage);
            await this.waitForVisible(this.additionalPackageCheckbox);
            await this.click(this.additionalPackageCheckbox);
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Clicks on the Continue button after package selection.
     **/
    async clickContinue() {
        await test.step('Click on Continue', async () => {
            await this.waitForLoaders().catch(() => { });
            await this.waitForVisible(this.continueAdditionalProduct);
            await this.click(this.continueAdditionalProduct);
            await this.waitForHidden(this.continueAdditionalProduct)
            await this.waitForLoaders().catch(() => { });
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
     * Selects the Date of Birth (Year, Day, Month) from custom dropdown controls.
     **/
    async selectDOB() {

        if (await this.isVisible(this.dobYearDdl)) {
            await test.step('Select Date of Birth', async () => {
                await this.click(this.dobYearDdl);
                await this.waitForVisible(this.yearSelectionInDropdown);
                await this.jsClick(this.yearSelectionInDropdown);
                await this.click(this.dobDayDdl);
                await this.waitForVisible(this.daySelectionInDropdown);
                await this.jsClick(this.daySelectionInDropdown);
                await this.click(this.dobMonthDdl);
                await this.waitForVisible(this.monthSelectionInDropdown);
                await this.jsClick(this.monthSelectionInDropdown);
            });
        }

    }

    async selectDOBForPackage() {
        await this.waitForLoaders();
        await this.page.waitForLoadState('load', { timeout: 5000 })
        await this.page.waitForTimeout(10000);
        if (await this.isVisible(this.dobMonthPackage)) {
            await this.click(this.dobMonthPackage);
            await this.click(this.monthSelectionInDropdownPackage);
            await this.click(this.dobYearPackage);
            await this.click(this.yearSelectionInDropdownPackage);
            await this.click(this.dobDayPackage);
            await this.click(this.daySelectionInDropdownPackage);
            if (await this.isVisible(this.showAppointmentButton)) {
                await this.click(this.showAppointmentButton);
            }
            else
                await this.click(this.proceedButton);
            await this.waitForHidden(this.proceedButton);
        }


    }

    /**
     * Fills the entire student registration form conditionally checking visibility for every field.
     **/
    async fillStudentInfo() {
        await test.step(`Fill Online Enrollment Form`, async () => {
            this.uniqueId = `${Date.now()}_${Math.floor(100000 + Math.random() * 900000)}`;
            const data = oeData.student;
            const random7 = String(Math.floor(1000000 + Math.random() * 9000000));
            const phone = `(555)${random7.slice(0, 3)}-${random7.slice(3)}`;

            await this.waitForLoaders();
            await this.waitForVisible(this.studentInfoCaption);
            await this.verifyVisible(this.studentInfoCaption);

            if (await this.isVisible(this.firstNameTxt)) {
                await this.fill(this.firstNameTxt, `${data.firstName}_${this.uniqueId}`);
            }
            if (await this.isVisible(this.middlenameTxt)) {
                await this.fill(this.middlenameTxt, data.middleName);
            }
            if (await this.isVisible(this.lastNameTxt)) {
                await this.fill(this.lastNameTxt, data.lastName);
            }
            if (await this.isVisible(this.addressTxt)) {
                await this.fillAddress(data.address);
            }
            if (await this.isVisible(this.homePhoneTxt)) {
                await this.fill(this.homePhoneTxt, `(212)${random7.slice(0, 3)}-${random7.slice(3)}`);
            }
            if (await this.isVisible(this.cellPhoneTxt)) {
                await this.fill(this.cellPhoneTxt, phone);
            }
            if (await this.isVisible(this.emailTxt)) {
                await this.fill(this.emailTxt, `${data.firstName}_${this.uniqueId}@gmail.com`);
            }
            if (await this.isVisible(this.parentGuardianNameTxt)) {
                await this.fill(this.parentGuardianNameTxt, data.parentGuardianName);
            }
            if (await this.isVisible(this.parentGuardianCellTxt)) {
                await this.fill(this.parentGuardianCellTxt, phone);
            }
            if (await this.isVisible(this.parentGuardianEmailTxt)) {
                await this.fill(this.parentGuardianEmailTxt, `parent_${this.uniqueId}@gmail.com`);
            }
            if (await this.isVisible(this.parentNameTxt)) {
                await this.fill(this.parentNameTxt, data.parentName);
            }
            if (await this.isVisible(this.parentPhoneTxt)) {
                await this.fill(this.parentPhoneTxt, `(999)${random7.slice(0, 3)}-${random7.slice(3)}`);
            }
            if (await this.isVisible(this.parentEmailTxt)) {
                await this.fill(this.parentEmailTxt, `parent2_${this.uniqueId}@gmail.com`);
            }
            if (await this.isVisible(this.emergencyNameTxt)) {
                await this.fill(this.emergencyNameTxt, data.emergencyName);
            }
            if (await this.isVisible(this.emergencyRelationshipTxt)) {
                await this.fill(this.emergencyRelationshipTxt, data.emergencyRelationship);
            }
            if (await this.isVisible(this.emergencyPhoneTxt)) {
                await this.fill(this.emergencyPhoneTxt, `(333)${random7.slice(0, 3)}-${random7.slice(3)}`);
            }
            await this.selectDOB();

            if (await this.isVisible(this.highSchoolDropdown)) {
                await this.click(this.highSchoolDropdown);
                await this.jsClick(this.highSchoolDropdownSelection);
            }
            if (await this.isVisible(this.wearGlassesDropdown)) {
                await this.click(this.wearGlassesDropdown);
                await this.jsClick(this.wearGlassesDropdownSelection);
            }
            if (await this.isVisible(this.femaleRadioButton)) {
                await this.jsClick(this.femaleRadioButton);
            }
            if (await this.isVisible(this.medicalConditionsTxt)) {
                await this.fill(this.medicalConditionsTxt, data.medicalConditions);
            }
            if (await this.isVisible(this.howDidYouHearAbtUsDropdown)) {
                await this.click(this.howDidYouHearAbtUsDropdown);
                await this.jsClick(this.howDidYouHearAbtUsDropdownSelection);
            }
            if (await this.isVisible(this.permitNumberTxt)) {
                await this.fill(this.permitNumberTxt, String(this.uniqueId));
            }
            if (await this.isVisible(this.permitIssuedDateCalendarIcon)) {
                await this.jsClick(this.permitIssuedDateCalendarIcon);
                await this.page.waitForTimeout(1000);
                try {
                    await this.permitIssueDateSelectInCalendar.waitFor({ state: "visible", timeout: 2000 });
                } catch {
                    console.log("calendar not opened, opening again");
                    await this.jsClick(this.permitIssuedDateCalendarIcon);
                    await this.permitIssueDateSelectInCalendar.waitFor({ state: "visible", timeout: 2000 });
                }
                await this.click(this.permitIssueDateSelectInCalendar);
            }
            if (await this.isVisible(this.collegeIdTxt)) {
                await this.fill(this.collegeIdTxt, data.collegeId);
            }
            if (await this.isVisible(this.permitExpirationDateCalendarIcon)) {
                await this.jsClick(this.permitExpirationDateCalendarIcon);
                await this.page.waitForTimeout(1000);
                try {
                    await this.permitExpireDateSelectInCalendar.waitFor({ state: "visible", timeout: 2000 });
                } catch {
                    console.log("calendar not opened, opening again");
                    await this.jsClick(this.permitExpirationDateCalendarIcon);
                    await this.permitExpireDateSelectInCalendar.waitFor({ state: "visible", timeout: 2000 });
                }
                await this.click(this.permitExpireDateSelectInCalendar);
            }
            if (await this.isVisible(this.termsConditionsCheckbox)) {
                await this.jsClick(this.termsConditionsCheckbox);
            }
            if (await this.isVisible(this.addressTxt)) {
                await this.fill(this.addressTxt, "ny");
            }
            if (await this.isVisible(this.zipCodeTxt)) {
                await this.fill(this.zipCodeTxt, data.zipCode);
            }
            if (await this.isVisible(this.studentSignature)) {
                await this.fill(this.studentSignature, data.firstName);
            }
            if (await this.isVisible(this.parentSignature)) {
                await this.fill(this.parentSignature, data.parentName);
            }
            if (await this.isVisible(this.last6DigitsParentsDriverLicense)) {
                await this.fill(this.last6DigitsParentsDriverLicense, data.parentsDriverLicense);
            }

            if (await this.isVisible(this.textsignature)) {
                await this.click(this.textsignature);
                await this.waitForLoaders().catch(() => { });
                await this.waitForVisible(this.studentSignature);
                await this.fill(this.studentSignature, data.firstName);
            }

            const captcha = this.captchaFrame.locator('#recaptcha-anchor');
            if (await this.isVisible(captcha)) {
                await this.click(captcha);
                await this.verifyAttribute(captcha, "aria-checked", "true");
            }
            await this.page.waitForTimeout(1000);

        });
    }

    /**
     * Clicks the 'Pay Later' button to proceed without immediate online payment.
     **/
    async clickPayLater() {
        await test.step('Click Pay Later button', async () => {
            await this.click(this.payLaterBtn);
            await this.waitForLoaders().catch(() => { });
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
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Verifies that the registration receipt page is displayed and attaches the PDF document to the report.
     * @param {string} expectedText - Text to verify on the receipt page.
     * @param {string} attachmentName - Filename for the attached PDF in reports.
     **/
    async verifyReceiptPage(expectedText, attachmentName) {
        await test.step(`Verify "${expectedText}" on receipt page`, async () => {
            // await this.waitForLoaders().catch(() => { });
            // await this.page.waitForLoadState('load', { timeout: 10000 });
            // await this.page.waitForTimeout(10000);
            await this.page.waitForFunction(() => document.title.trim().length > 0, { timeout: 30000 }).catch(() => {
                console.log('Title did not become non-empty within 30s; proceeding with assertion.');
            });
            // await expect(pdfPage).toHaveTitle(/Report/i, { timeout: 15000 });
            await this.waitForVisible(this.page.getByText(new RegExp(expectedText, 'i')));
            await this.verifyVisible(this.page.getByText(new RegExp(expectedText, 'i')));
        });
        await PdfHelper.downloadVerifyAndAttach(this.page, expectedText, attachmentName);
    }

}
