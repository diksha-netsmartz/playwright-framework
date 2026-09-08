import BasePage from '../../../utils/BasePage';
import { test } from '@playwright/test';

/**
 * Page Object representing the Add Lead Page in Admin Portal (Student Leads > Add Lead).
 * Handles filling the Add Lead form with personal information, student type,
 * birth date, phone numbers, and verifying the lead was added successfully.
 *
 * Common XPath locators (Yes, Save, Active/Status options) are aligned with
 * the patterns used across other Account Management pages.
 **/
export default class LeadPage extends BasePage {

    /**
     * Initializes locators for the Add Lead Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);
        this.addLeadLink = page.getByRole('link', { name: 'Add Lead' });
        // Personal Information Fields
        this.firstNameInput = page.getByRole('textbox', { name: 'First Name' });
        this.middleNameInput = page.locator('#MiddleName')
        this.lastNameInput = page.locator('#LastName')
        this.addressInput = page.getByRole('textbox', { name: 'Address' });
        this.cityInput = page.getByRole('textbox', { name: 'City' });
        this.medicalConditionsInput = page.locator("#MedicalConditions");
        this.studentNotesInput = page.locator("#StudentNotes");
        this.preferredDateandTimeInput = page.locator("#PreferredDateandTime");


        // State Dropdown (bootstrap-select) — XPath anchored to the State select element
        this.stateDropdown = page.locator("xpath=//select[@name='State']//parent::div//button");
        this.stateOptionCA = page.locator("xpath=//select[@name='State']//parent::div//ul//a[normalize-space(.)='CA']");

        this.zipCodeInput = page.getByRole('textbox', { name: 'Zip/Postal Code' });
        this.emailInput = page.locator('#Email')

        // Stage Field (contenteditable / note area for lead pipeline stage)
        this.stageField = page.locator('#stage').first();
        this.genderMaleRadioButton = page.locator("xpath=//label[contains(text(),'Male')]//input[@id='Gender']//following-sibling::ins");

        this.dropdown27 = page.locator("xpath=//select[@id='DropDown27']//parent::div//button");
        this.dropdown27Option = page.locator("(//select[@id='DropDown27']//parent::div//ul//li//span[1][not(contains(text(),'Select'))])[1]");

        // Birth Date Dropdowns (bootstrap-select) — XPath anchored to each select element
        this.birthMonthDropdown = page.locator("xpath=//button[@data-id='int_DOB_Month']");
        this.dobMonth = page.locator("xpath=//button[@data-id='int_DOB_Month']//following-sibling::div//a//span[text()='Jun']");
        this.birthDayDropdown = page.locator("xpath=//button[@data-id='int_DOB_Day']");
        this.dobDay = page.locator("xpath=//button[@data-id='int_DOB_Day']//following-sibling::div//a//span[text()='01']");
        this.birthYearDropdown = page.locator("xpath=//button[@data-id='int_DOB_Year']");
        this.dobYear = page.locator("xpath=//button[@data-id='int_DOB_Year']//following-sibling::div//a//span[text()='2006']");

        // Phone Number Fields
        this.homePhoneInput = page.getByRole('textbox', { name: 'Home Phone' });
        this.cellPhoneInput = page.getByRole('textbox', { name: 'Cell Phone' });
        this.parentPhoneInput = page.getByRole('textbox', { name: 'Parent Phone' });
        this.otherPhoneInput = page.getByRole('textbox', { name: 'Other Phone' });

        // Form Action Buttons — XPath consistent with other Account Management pages
        this.saveBtn = page.locator("xpath=//h4[contains(text(),'Lead')]//ancestor::div[contains(@class,'modal-content')]//button[contains(text(),'Save')]");

        // Yes Confirmation Button — shared XPath pattern used across Account Management pages
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

    }

    /**
     * Click on Add New Button
     **/
    async clickOnAddNewButton() {
        await test.step('Click on Add New button', async () => {
            await this.waitForVisible(this.addLeadLink);
            await this.click(this.addLeadLink);
            await this.waitForLoaders();

        });
    }

    /**
     * Fills the Add Lead form with unique dynamic values from the test data fixture.
     * @param {Object} data - Lead test data fixture.
     * @returns {Promise<Object>} Created lead details.
     **/
    async fillLeadDetails(data = {}) {
        return await test.step('Fill Add Lead form details', async () => {
            this.uniqueId = `${Date.now()}`;
            this.firstName = `${data.firstNamePrefix}_${this.uniqueId}`;
            this.lastName = data.lastName;
            const middleName = data.middleName;
            const address = data.address;
            const city = data.city;
            const zipCode = data.zipCode;
            const email = data.email;
            const studentType = data.studentType;
            const homePhone = data.homePhone;
            const cellPhone = data.cellPhone;
            const parentPhone = data.parentPhone;
            const otherPhone = data.otherPhone;

            await this.waitForLoaders();

            // Personal Information
            await this.waitForVisible(this.firstNameInput);
            await this.fill(this.firstNameInput, this.firstName);

            await this.waitForVisible(this.middleNameInput);
            await this.fill(this.middleNameInput, middleName);

            await this.waitForVisible(this.lastNameInput);
            await this.fill(this.lastNameInput, this.lastName);

            await this.waitForVisible(this.addressInput);
            await this.fill(this.addressInput, address);

            await this.waitForVisible(this.cityInput);
            await this.fill(this.cityInput, city);

            await this.waitForVisible(this.stateDropdown);
            await this.click(this.stateDropdown);
            await this.waitForVisible(this.stateOptionCA);
            await this.click(this.stateOptionCA);

            await this.waitForVisible(this.zipCodeInput);
            await this.fill(this.zipCodeInput, zipCode);

            await this.waitForVisible(this.emailInput);
            await this.fill(this.emailInput, email);


            if (await this.isVisible(this.dropdown27, { timeout: 5000 }).catch(() => false)) {
                await this.click(this.dropdown27);
                await this.waitForVisible(this.dropdown27Option);
                await this.click(this.dropdown27Option);
            }

            await this.click(this.stageField);
            if (await this.isVisible(this.genderMaleRadioButton, { timeout: 5000 }).catch(() => false)) {
                await this.click(this.genderMaleRadioButton);
            }

            // Birth Date — Month, Day, Year dropdowns
            if (await this.isVisible(this.birthMonthDropdown, { timeout: 5000 }).catch(() => false)) {
                await this.waitForVisible(this.birthMonthDropdown);
                await this.click(this.birthMonthDropdown);
                await this.waitForVisible(this.dobMonth);
                await this.click(this.dobMonth);

                await this.waitForVisible(this.birthDayDropdown);
                await this.click(this.birthDayDropdown);
                await this.waitForVisible(this.dobDay);
                await this.click(this.dobDay);

                await this.waitForVisible(this.birthYearDropdown);
                await this.click(this.birthYearDropdown);
                await this.waitForVisible(this.dobYear);
                await this.click(this.dobYear);
            }

            if (await this.isVisible(this.homePhoneInput, { timeout: 5000 }).catch(() => false)) {
                await this.fill(this.homePhoneInput, homePhone);
            }

            if (await this.isVisible(this.cellPhoneInput, { timeout: 5000 }).catch(() => false)) {
                await this.fill(this.cellPhoneInput, cellPhone);
            }

            if (await this.isVisible(this.parentPhoneInput, { timeout: 5000 }).catch(() => false)) {
                await this.fill(this.parentPhoneInput, parentPhone);
            }

            if (await this.isVisible(this.otherPhoneInput, { timeout: 5000 }).catch(() => false)) {
                await this.fill(this.otherPhoneInput, otherPhone);
            }

            if (await this.isVisible(this.medicalConditionsInput, { timeout: 5000 }).catch(() => false)) {
                await this.fill(this.medicalConditionsInput, data.medicalConditions)
            }

            if (await this.isVisible(this.studentNotesInput, { timeout: 5000 }).catch(() => false)) {
                await this.fill(this.studentNotesInput, data.studentNotes)
            }
            if (await this.isVisible(this.preferredDateandTimeInput, { timeout: 5000 }).catch(() => false)) {
                await this.fill(this.preferredDateandTimeInput, data.preferredDateandTime)
            }

            return {
                firstName: this.firstName,
                lastName: this.lastName,
                email
            };
        });
    }

    /**
     * Clicks the Save button and handles the Yes confirmation dialog.
     * Uses XPath consistent with other Account Management pages.
     **/
    async clickSave() {
        await test.step('Click Save button and confirm', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);

            // Yes Confirmation — shared XPath pattern used across Account Management pages
            if (await this.yesConfirmationButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await this.click(this.yesConfirmationButton);
            }

            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Verifies that the 'Lead added successfully.' notification is displayed.
     **/
    async verifyLeadAddedSuccessfully() {
        await test.step('Verify "Lead added successfully." notification', async () => {


            const successMsg = this.page.getByText('Lead added successfully.');
            await this.waitForVisible(successMsg);
            await this.verifyVisible(successMsg);
        });
    }
}
