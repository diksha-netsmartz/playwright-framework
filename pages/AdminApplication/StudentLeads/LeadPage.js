import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';

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

        // Edit Lead Locators (TC_041)
        this.staffValueDropdown = page.locator('span.valueSelected.staff-value');
        this.showAllStaffLeads = page.getByRole('link', { name: 'Show All Staff Leads' });
        this.editLeadModal = page.locator('#dealdetails');
        this.notesTextarea = page.locator('div.note-editable');
        this.saveNoteButton = page.locator("//button[contains(@id,'SaveNote')]");
        this.editStageSelector = page.locator('#stage').last();
        this.editSaveBtn = page.locator("//button[@data-toggle='confirmationUpdateProfile']");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.editCloseBtn = page.locator('button.close:visible')
        this.detailsUpdatedToast = page.locator('#toast-container');

        this.tasktab = page.locator('#taskTab_Li');
        this.taskSubjext = page.getByRole('textbox', { name: 'Subject' });
        this.taskStatusDropdown = page.locator("//button[contains(@data-id,'Status')]");
        this.statusDropdownValueNew = page.locator("//button[contains(@data-id,'Status')]//parent::div//following-sibling::div//span[text()='New']");
        this.taskNote = page.getByRole('textbox', { name: 'Note' });
        this.priorityButton = page.locator("(//div[@class='priority']//label)[1]")
        this.saveTaskButton = page.locator("(//button[contains(@id,'SaveUpdateTask')])[1]");
        this.taskAssignToMeDropdown = page.locator("//button[contains(@data-id,'AssignTo')]");
        this.taskAssignToMeDropdownValue = page.locator("(//button[contains(@data-id,'AssignTo')]//parent::div//following-sibling::div//li//a)[2]");
        this.dueDateCalendar = page.getByRole('textbox', { name: 'M/D/YYYY' });
        this.lastday = page.locator("(//td[@class='day'])[last()]");
        this.selectTime = page.getByRole('button', { name: 'Select Time' })
        this.taskTime = page.locator("(//button[contains(@data-id,'TaskTime')]//parent::div//following-sibling::div//li//a)[2]")
        this.actionLogs = page.locator('#divStaffActionLogs').first();

    }
    /**
 * Returns locator for the lead card locator
 * @param {string} leadName - lead name.
 * @returns {import('@playwright/test').Locator} lead card locator.
 **/
    openLeadCard(leadName) {
        return this.page.locator(
            `xpath=//*[contains(text(),'${leadName}')]//ancestor::div[@id='divStage1']`
        );
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


            if (await this.isVisible(this.dropdown27, { timeout: 1000 }).catch(() => false)) {
                await this.click(this.dropdown27);
                await this.waitForVisible(this.dropdown27Option);
                await this.click(this.dropdown27Option);
            }

            await this.click(this.stageField);
            if (await this.isVisible(this.genderMaleRadioButton, { timeout: 1000 }).catch(() => false)) {
                await this.click(this.genderMaleRadioButton);
            }

            // Birth Date — Month, Day, Year dropdowns
            if (await this.isVisible(this.birthMonthDropdown, { timeout: 1000 }).catch(() => false)) {
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

            if (await this.isVisible(this.homePhoneInput, { timeout: 1000 }).catch(() => false)) {
                await this.fill(this.homePhoneInput, homePhone);
            }

            if (await this.isVisible(this.cellPhoneInput, { timeout: 1000 }).catch(() => false)) {
                await this.fill(this.cellPhoneInput, cellPhone);
            }

            if (await this.isVisible(this.parentPhoneInput, { timeout: 1000 }).catch(() => false)) {
                await this.fill(this.parentPhoneInput, parentPhone);
            }

            if (await this.isVisible(this.otherPhoneInput, { timeout: 1000 }).catch(() => false)) {
                await this.fill(this.otherPhoneInput, otherPhone);
            }

            if (await this.isVisible(this.medicalConditionsInput, { timeout: 1000 }).catch(() => false)) {
                await this.fill(this.medicalConditionsInput, data.medicalConditions)
            }

            if (await this.isVisible(this.studentNotesInput, { timeout: 1000 }).catch(() => false)) {
                await this.fill(this.studentNotesInput, data.studentNotes)
            }
            if (await this.isVisible(this.preferredDateandTimeInput, { timeout: 1000 }).catch(() => false)) {
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

    /**
     * Filters leads by selecting 'Show All Staff Leads' from staff dropdown.
     **/
    async filterShowAllStaffLeads() {
        await test.step('Select "Show All Staff Leads" from staff value dropdown', async () => {
            await this.waitForLoaders();
            await this.click(this.staffValueDropdown);
            await this.waitForVisible(this.showAllStaffLeads)
            await this.click(this.showAllStaffLeads);
            await this.waitForLoaders();
            await this.waitForHidden(this.showAllStaffLeads);

        });
    }

    /**
     * Finds and clicks on a Lead card by lead name to open the edit modal.
     * @param {string} leadName - Unique first name or full name of the lead.
     **/
    async openLeadForEdit(leadName) {
        await test.step(`Open Lead card for "${leadName}" to edit`, async () => {
            await this.waitForLoaders();

            await this.waitForVisible(this.openLeadCard(leadName));
            await this.click(this.openLeadCard(leadName));
            await this.waitForLoaders();
            await this.waitForVisible(this.editSaveBtn);
        });
    }

    /**
     * Updates the Lead fields with new values.
     * @param {Object} updatedData - New field values to populate.
     **/
    async updateLeadFields(updatedData = {}) {
        await test.step('Update Lead fields with new values', async () => {
            await this.waitForVisible(this.editSaveBtn);
            if (updatedData.middleName) {
                await this.fill(this.middleNameInput, updatedData.middleName);
            }
            if (updatedData.address) {
                await this.fill(this.addressInput, updatedData.address);
            }
            if (updatedData.zipCode) {
                await this.fill(this.zipCodeInput, updatedData.zipCode);
            }
            if (updatedData.email) {
                await this.fill(this.emailInput, updatedData.email);
            }
            if (updatedData.medicalConditions) {
                if (await this.medicalConditionsInput.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await this.fill(this.medicalConditionsInput, updatedData.medicalConditions);
                }
            }
            await this.click(this.editStageSelector);

        });
    }

    /**
 * Add and save notes while updating lead
 **/
    async updateNotes(notes) {
        if (await this.isVisible(this.notesTextarea)) {
            await this.fill(this.notesTextarea, notes);
            await this.click(this.saveNoteButton);
            await this.waitForVisible(this.yesConfirmationButton);
            await this.click(this.yesConfirmationButton);
            const successMsg = this.page.getByText('Note added successfully.');
            await this.waitForVisible(successMsg);
            await this.verifyVisible(successMsg);
        }
    }

    /**
* Add and save task while updating lead
**/
    async updateTask(taskSubject, taskNote) {
        if (await this.isVisible(this.tasktab)) {
            await this.click(this.tasktab);
            await this.waitForVisible(this.taskSubjext);
            await this.fill(this.taskSubjext, taskSubject);
            await this.click(this.taskStatusDropdown);
            await this.waitForVisible(this.statusDropdownValueNew);
            await this.click(this.statusDropdownValueNew);
            await this.click(this.dueDateCalendar);
            await this.waitForVisible(this.lastday);
            await this.click(this.lastday);
            await this.click(this.selectTime);
            await this.waitForVisible(this.taskTime);
            await this.click(this.taskTime);
            await this.click(this.taskAssignToMeDropdown)
            await this.waitForVisible(this.taskAssignToMeDropdownValue);
            await this.click(this.taskAssignToMeDropdownValue);
            await this.click(this.priorityButton);
            await this.fill(this.taskNote, taskNote);
            await this.click(this.saveTaskButton);
            await this.waitForVisible(this.yesConfirmationButton);
            await this.click(this.yesConfirmationButton);
            const successMsg = this.page.getByText('Task added successfully.').first();
            await this.waitForVisible(successMsg);
            await this.verifyVisible(successMsg);
        }
    }

    /**
     * Clicks Save in the edit modal and handles confirmation dialog.
     **/
    async saveEditedLead() {
        await test.step('Save edited Lead and confirm', async () => {
            await this.waitForVisible(this.editSaveBtn);
            await this.click(this.editSaveBtn);
            await this.waitForVisible(this.yesConfirmationButton)
            await this.click(this.yesConfirmationButton);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that 'Details updated successfully.' notification appears and closes modal.
     **/
    async verifyLeadUpdatedSuccessfully() {
        await test.step('Verify "Details updated successfully." toast message', async () => {
            const successText = this.page.getByText('Details updated successfully.');
            await this.waitForVisible(successText);
            await this.verifyVisible(successText);
            await this.click(this.editCloseBtn);
            await this.waitForLoaders();
        });
    }

    /**
 * Verifies that the updated details are correctly populated in the form fields using the 'value' attribute.
 * @param {Object} expectedData - Expected updated values.
 **/
    async verifyLeadDeatilsAreUpdatedSuccessfully(expectedData = {}) {
        await test.step('Verify updated details are present using value attribute', async () => {
            await this.waitForVisible(this.editSaveBtn);
            if (expectedData.middleName) {
                await expect(this.middleNameInput).toHaveAttribute('value', expectedData.middleName);
            }
            if (expectedData.address) {
                await expect(this.addressInput).toHaveAttribute('value', expectedData.address);
            }
            if (expectedData.zipCode) {
                await expect(this.zipCodeInput).toHaveAttribute('value', expectedData.zipCode);
            }
            if (expectedData.email) {
                await expect(this.emailInput).toHaveAttribute('value', expectedData.email);
            }
            if (expectedData.medicalConditions) {
                if (await this.medicalConditionsInput.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await expect(this.medicalConditionsInput).toHaveAttribute('value', expectedData.medicalConditions);
                }
            }
            if (expectedData.notes) {
                await expect(this.actionLogs).toContainText(expectedData.notes);
            }

            if (expectedData.taskSubject) {
                await expect(this.actionLogs).toContainText(expectedData.taskSubject);
            }

        });
    }
}
