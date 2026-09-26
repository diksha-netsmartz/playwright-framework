import BasePage from '@utils/BasePage';
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

        this.zipCodeInput = page.locator('#ZipPostalCode')
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

        // Edit Lead Locators 
        this.staffValueDropdown = page.locator('span.valueSelected.staff-value');
        this.showAllStaffLeads = page.getByRole('link', { name: 'Show All Staff Leads' });
        this.editLeadModal = page.locator('#dealdetails');
        this.notesTextarea = page.locator('div.note-editable');
        this.saveNoteButton = page.locator("//button[contains(@id,'SaveNote')]");
        this.editStageSelector = page.locator('#stage').last();
        this.editSaveBtn = page.locator("//button[@data-toggle='confirmationUpdateProfile']");
        this.editCloseBtn = page.locator('button.close:visible')

        this.tasktab = page.locator('#taskTab_Li');
        this.taskSubject = page.getByRole('textbox', { name: 'Subject' });
        this.taskStatusDropdown = page.locator("//button[contains(@data-id,'ProfileTAB_drpStatus')]");
        this.statusDropdownValueNew = page.locator("//button[contains(@data-id,'ProfileTAB_drpStatus')]//parent::div//following-sibling::div//span[text()='New']");
        this.taskNote = page.getByRole('textbox', { name: 'Note' });
        this.priorityButton = page.locator("(//div[@class='priority']//label)[1]")
        this.saveTaskButton = page.locator("(//button[contains(@id,'SaveUpdateTask')])[1]");
        this.taskAssignToMeDropdown = page.locator("//button[contains(@data-id,'ProfileTAB_drpAssignTo')]");
        this.taskAssignToMeDropdownValue = page.locator("(//button[contains(@data-id,'ProfileTAB_drpAssignTo')]//parent::div//following-sibling::div//li//a)[2]");
        this.dueDateCalendar = page.getByRole('textbox', { name: 'M/D/YYYY' });
        this.lastday = page.locator("(//td[@class='day'])[last()]");
        this.selectTime = page.getByRole('button', { name: 'Select Time' })
        this.taskTime = page.locator("(//button[contains(@data-id,'TaskTime')]//parent::div//following-sibling::div//li//a)[2]")
        this.actionLogs = page.locator('#divStaffActionLogs').first();


        this.filesTab = page.locator("//a[@href='#tb_files']")
        this.fileInput = page.locator('input[type="file"]').first();
        this.browseFileButton = page.locator('#uploadimage:visible');
        this.categoryDropdown = page.getByRole('button', { name: '--Select--' });
        this.categoryDropdownOption = page.locator("(//select[@name='file_Category']//parent::div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.saveFilesButton = page.getByRole('button', { name: 'SAVE FILES' });
        this.studentFileRow = page.locator('div.studentfilerow')

        this.callsTab = page.locator("a[href='#tb_call']")
        this.emergencyPhoneAddButton = page.locator("//label[contains(text(),'Emergency Phone')]//parent::b//button");
        this.enterPhoneNumber = page.getByRole('textbox', { name: 'Enter Phone Number' })
        this.addButton = page.locator('#btn_AddMissingNumber_LeadPage:visible')
        this.addedSuccessMsg = page.getByText('Number added successfully.');
        this.closeCallModal = page.locator("//button[@onclick='CloseMissingNumberModal()'][normalize-space()='Close']");
        this.emergencyPhoneNumberText = page.locator("//label[contains(text(),'Emergency Phone')]//parent::b//a")


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

            if (await this.isVisible(this.addressInput, { timeout: 100 })) {
                await this.fill(this.addressInput, address);
            }

            if (await this.isVisible(this.cityInput, { timeout: 100 })) {
                await this.fill(this.cityInput, city);
            }

            if (await this.isVisible(this.stateDropdown, { timeout: 100 })) {
                await this.click(this.stateDropdown);
                await this.waitForVisible(this.stateOptionCA);
                await this.click(this.stateOptionCA);
            }

            if (await this.isVisible(this.zipCodeInput, { timeout: 100 })) {
                await this.fill(this.zipCodeInput, zipCode);
            }

            await this.waitForVisible(this.emailInput);
            await this.fill(this.emailInput, email);


            if (await this.isVisible(this.dropdown27, { timeout: 100 }).catch(() => false)) {
                await this.click(this.dropdown27);
                await this.waitForVisible(this.dropdown27Option);
                await this.click(this.dropdown27Option);
            }

            await this.click(this.stageField);
            if (await this.isVisible(this.genderMaleRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.genderMaleRadioButton);
            }

            // Birth Date — Month, Day, Year dropdowns
            if (await this.isVisible(this.birthMonthDropdown, { timeout: 100 }).catch(() => false)) {
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

            if (await this.isVisible(this.homePhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.homePhoneInput, homePhone);
            }

            if (await this.isVisible(this.cellPhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.cellPhoneInput, cellPhone);
            }

            if (await this.isVisible(this.parentPhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.parentPhoneInput, parentPhone);
            }

            if (await this.isVisible(this.otherPhoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.otherPhoneInput, otherPhone);
            }

            if (await this.isVisible(this.medicalConditionsInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.medicalConditionsInput, data.medicalConditions)
            }

            if (await this.isVisible(this.studentNotesInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.studentNotesInput, data.studentNotes)
            }
            if (await this.isVisible(this.preferredDateandTimeInput, { timeout: 100 }).catch(() => false)) {
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
     * Verifies the originally added lead details are correctly pre-populated in the edit modal.
     * All field checks are guarded with isVisible so they skip gracefully on envs where fields are hidden.
     * @param {Object} data - Lead test data fixture (same object passed to fillLeadDetails).
     * @param {Object} createdLead - The returned object from fillLeadDetails with generated firstName/email.
     **/
    async verifyAddedLeadDetails(data, createdLead) {
        await test.step('Step 7: Verify originally added lead details are pre-populated', async () => {
            await this.waitForVisible(this.editSaveBtn);

            // First Name (dynamically generated — use createdLead.firstName)
            if (await this.isVisible(this.firstNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.firstNameInput).toHaveValue(createdLead.firstName);
            }

            // Middle Name
            if (await this.isVisible(this.middleNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.middleNameInput).toHaveValue(data.middleName);
            }

            // Last Name
            if (await this.isVisible(this.lastNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.lastNameInput).toHaveValue(data.lastName);
            }

            // Address
            if (await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.addressInput).toHaveValue(data.address);
            }

            // City
            if (await this.isVisible(this.cityInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.cityInput).toHaveValue(data.city);
            }

            // Zip Code
            if (await this.isVisible(this.zipCodeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zipCodeInput).toHaveValue(data.zipCode);
            }

            // Email (from fillLeadDetails return — same as what was typed)
            if (await this.isVisible(this.emailInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emailInput).toHaveValue(createdLead.email);
            }

            // Home Phone
            if (await this.isVisible(this.homePhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.homePhoneInput).toHaveValue(data.homePhone);
            }

            // Cell Phone
            if (await this.isVisible(this.cellPhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.cellPhoneInput).toHaveValue(data.cellPhone);
            }

            // Parent Phone
            if (await this.isVisible(this.parentPhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.parentPhoneInput).toHaveValue(data.parentPhone);
            }

            // Other Phone
            if (await this.isVisible(this.otherPhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.otherPhoneInput).toHaveValue(data.otherPhone);
            }

            // Medical Conditions
            if (await this.isVisible(this.medicalConditionsInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.medicalConditionsInput).toHaveValue(data.medicalConditions);
            }

            // Student Notes
            if (await this.isVisible(this.studentNotesInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.studentNotesInput).toHaveValue(data.studentNotes);
            }

            // Preferred Date and Time
            if (await this.isVisible(this.preferredDateandTimeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.preferredDateandTimeInput).toHaveValue(data.preferredDateandTime);
            }
        });
    }

    /**
     * Updates the Lead fields with new values.
     * @param {Object} updatedData - New field values to populate.
     **/
    async updateLeadFields(updatedData = {}) {
        await test.step('Update Lead fields with new values', async () => {
            await this.waitForVisible(this.editSaveBtn);
            if (await this.isVisible(this.middleNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.middleNameInput, updatedData.middleName);
            }
            if (await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.addressInput, updatedData.address);
            }
            if (await this.isVisible(this.zipCodeInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.zipCodeInput, updatedData.zipCode);
            }
            if (await this.isVisible(this.emailInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emailInput, updatedData.email);
            }
            if (await this.isVisible(this.medicalConditionsInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.medicalConditionsInput, updatedData.medicalConditions);

            }
            await this.click(this.editStageSelector);

        });
    }

    /**
 * Add and save notes while updating lead
 **/
    async addNotes(notes) {
        if (await this.isVisible(this.notesTextarea, { timeout: 100 })) {
            await test.step('Add and save note', async () => {
                await this.fill(this.notesTextarea, notes);
                await this.click(this.saveNoteButton);
                await this.waitForVisible(this.yesConfirmationButton);
                await this.click(this.yesConfirmationButton);
                const successMsg = this.page.getByText('Note added successfully.');
                await this.waitForVisible(successMsg);
                await this.verifyVisible(successMsg);
            });
        }
    }

    /**
* Add and save files while updating lead
**/
    async addFile(filePath) {
        if (await this.isVisible(this.filesTab, { timeout: 100 })) {
            await test.step('Upload file in Files tab', async () => {
                await this.click(this.filesTab);
                await this.waitForLoaders();
                await this.waitForVisible(this.browseFileButton, { timeout: 10000 });
                const fileChooserPromise = this.page.waitForEvent('filechooser');
                await this.click(this.browseFileButton);
                const fileChooser = await fileChooserPromise;
                await fileChooser.setFiles(filePath);
                await this.waitForLoaders();
                await this.page.waitForTimeout(1000);
                await this.waitForVisible(this.categoryDropdown);
                await this.click(this.categoryDropdown);
                await this.waitForVisible(this.categoryDropdownOption);
                await this.click(this.categoryDropdownOption);
                await this.click(this.saveFilesButton);
                await this.waitForLoaders();
                await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => { });
                await this.waitForVisible(this.page.getByText('File(s) uploaded successfully.', { exact: true }), { timeout: 30000 });
                await this.verifyVisible(this.page.getByText('File(s) uploaded successfully.', { exact: true }));
            });
        }
    }

    /**
* Add and save phone number while updating lead
**/
    async addPhoneInCallsTab(phoneNumber) {
        if (await this.isVisible(this.callsTab, { timeout: 100 })) {
            await test.step('Add emergency phone number in Calls tab', async () => {
                await this.click(this.callsTab);
                await this.click(this.emergencyPhoneAddButton);
                await this.waitForVisible(this.enterPhoneNumber);
                await this.fill(this.enterPhoneNumber, phoneNumber);
                await this.click(this.addButton);
                await this.click(this.yesConfirmationButton);
                await this.waitForLoaders();
                await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => { });
                await this.waitForVisible(this.addedSuccessMsg);
                await this.verifyVisible(this.addedSuccessMsg);
                await this.click(this.closeCallModal);
                await this.waitForHidden(this.closeCallModal);
            });
        }
    }



    /**
* Add and save task while updating lead
**/
    async addTask(taskSubject, taskNote) {
        if (await this.isVisible(this.tasktab, { timeout: 100 })) {
            await test.step('Add and save task in Tasks tab', async () => {
                await this.click(this.tasktab);
                await this.waitForVisible(this.taskSubject);
                await this.fill(this.taskSubject, taskSubject);
                await this.click(this.taskStatusDropdown);
                await this.waitForVisible(this.statusDropdownValueNew);
                await this.click(this.statusDropdownValueNew);
                await this.click(this.dueDateCalendar);
                await this.waitForVisible(this.lastday);
                await this.click(this.lastday);
                await this.click(this.selectTime);
                await this.waitForVisible(this.taskTime);
                await this.click(this.taskTime);
                await this.click(this.taskAssignToMeDropdown);
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
            });
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
            if (await this.isVisible(this.middleNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.middleNameInput).toHaveAttribute('value', expectedData.middleName);
            }
            if (await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.addressInput).toHaveAttribute('value', expectedData.address);
            }
            if (await this.isVisible(this.zipCodeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zipCodeInput).toHaveAttribute('value', expectedData.zipCode);
            }
            if (await this.isVisible(this.emailInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emailInput).toHaveAttribute('value', expectedData.email);
            }
            if (await this.isVisible(this.medicalConditionsInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.medicalConditionsInput).toHaveAttribute('value', expectedData.medicalConditions);

            }
            if (await this.isVisible(this.notesTextarea, { timeout: 100 }).catch(() => false)) {
                await expect(this.actionLogs).toContainText(expectedData.notes);
            }

            if (await this.isVisible(this.taskSubject, { timeout: 100 }).catch(() => false)) {
                await expect(this.actionLogs).toContainText(expectedData.taskSubject);
            }
            if (await this.isVisible(this.filesTab, { timeout: 100 }).catch(() => false)) {
                await this.click(this.filesTab);
                await this.waitForLoaders();
                await this.waitForVisible(this.studentFileRow, { timeout: 10000 })
                await this.verifyVisible(this.studentFileRow);
            }

            if (await this.isVisible(this.callsTab, { timeout: 100 }).catch(() => false)) {
                await this.click(this.callsTab);
                await this.verifyVisible(this.emergencyPhoneNumberText);
                await expect(this.emergencyPhoneNumberText).toContainText(expectedData.emergencyPhone);
            }

        });
    }
}
