import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the High School Page in Admin Portal (Account Management > High School).
 * Handles adding new high schools with dynamic naming and code generation,
 * editing existing high schools, searching the data table, and verifying notifications.
 **/
export default class HighSchoolsPage extends BasePage {

    /**
     * Initializes locators for the High School Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("#addNewSchool");
        // Add / Edit High School Form Locators
        this.schoolNameInput = page.getByRole('textbox', { name: 'School Name' });
        this.statusDropdown = page.locator("xpath=//select[@name='SchoolStatus']//parent::div//button");
        this.statusDropdownOptionActive = page.locator("xpath=//select[@name='SchoolStatus']//parent::div//div//span[text()='Active']");
        this.statusDropdownOptionDeleted = page.locator("xpath=//select[@name='SchoolStatus']//parent::div//div//span[text()='Deleted']");

        this.schoolCodeInput = page.getByRole('textbox', { name: 'School Code' });
        this.schoolAddressInput = page.locator('#SchoolAddress')
        this.cityInput = page.getByRole('textbox', { name: 'City' });

        this.stateDropdown = page.locator("xpath=//select[@name='State']//parent::div//button");
        this.stateOption = page.locator("(//select[@id='State']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.teacherSelectableItem = page.locator("(//div[contains(@id,'Teacher')]//li)[1]");

        this.zipCodeInput = page.locator('#ZipCode');
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.notesInput = page.locator('#SchoolNote');

        // Modal Action Buttons & Notifications
        this.saveBtn = page.locator("#btnSaveNewHighSchoolInfo");
        this.saveUpdateButton = page.locator("#btnUpdateHighSchoolInfo");



        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        // Data Table Locators
        this.searchTextbox = page.locator("input[type='search']").first();
        this.highSchoolTable = page.locator('#dtHighSchool');
        this.editIcon = page.getByTitle('Edit');
    }

    /**
     * Clicks the 'Add New' button to open the Add High School form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button for High School', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Fills the High School creation form with dynamic unique values.
     * @param {Object} data - High School test data fixture.
     * @returns {Promise<Object>} Created high school details.
     **/
    async fillHighSchoolDetails(data = {}) {
        return await test.step('Fill High School details', async () => {
            this.uniqueId = `${Date.now()}`;
            this.schoolName = `${data.schoolNamePrefix || 'HighSchool'}_${this.uniqueId}`;
            this.schoolCode = `${data.schoolCodePrefix || 'HS'}_${Math.floor(1000 + Math.random() * 9000)}`;

            const address = data.address || '456 Academy Way';
            const city = data.city || 'Hartford';
            const zip = data.zip || '06101';
            const email = data.email || `highschool_${this.uniqueId}@example.com`;
            const notes = data.notes || 'Automated High School note';

            await this.waitForLoaders();
            await this.waitForVisible(this.schoolNameInput);
            await this.fill(this.schoolNameInput, this.schoolName);

            // Select Status as Active
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionActive);
            await this.click(this.statusDropdownOptionActive);

            // Fill Code & Address
            await this.waitForVisible(this.schoolCodeInput);
            await this.fill(this.schoolCodeInput, this.schoolCode);

            await this.waitForVisible(this.schoolAddressInput);
            await this.fill(this.schoolAddressInput, address);

            await this.waitForVisible(this.cityInput);
            await this.fill(this.cityInput, city);

            // Select State (CT or from data)
            await this.click(this.stateDropdown);
            await this.waitForVisible(this.stateOption);
            await this.click(this.stateOption);


            // Fill Zip, Email & Notes
            await this.waitForVisible(this.zipCodeInput);
            await this.fill(this.zipCodeInput, zip);

            if (await this.isVisible(this.emailInput)) {
                await this.fill(this.emailInput, email);
            }

            await this.waitForVisible(this.notesInput);
            await this.fill(this.notesInput, notes);

            // if (await this.isVisible(this.teacherSelectableItem)) {
            //     await this.click(this.teacherSelectableItem);
            // }

            return {
                schoolName: this.schoolName,
                schoolCode: this.schoolCode
            };
        });
    }

    /**
     * Clicks the Save button and handles optional confirmation.
     **/
    async clickSave() {
        await test.step('Click Save button', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);

            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    async clickSaveForUpdate() {
        await test.step('Click Save button', async () => {
            await this.waitForVisible(this.saveUpdateButton);
            await this.click(this.saveUpdateButton);

            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Verifies that the 'High school created successfully.' notification is displayed.
     **/
    async verifyHighSchoolCreatedSuccessfully() {
        await test.step('Verify "High school created successfully." notification', async () => {

            await this.waitForVisible(this.page.getByText('High school created successfully.'));
            await this.verifyVisible(this.page.getByText('High school created successfully.'));
        });
    }

    /**
     * Searches for the created High School in the data table and clicks Edit.
     * @param {string} [schoolName=this.schoolName] - High School name to search.
     **/
    async searchAndEditHighSchool(schoolName = this.schoolName) {
        await test.step(`Search and edit High School: "${schoolName}"`, async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, schoolName);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);

            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.click(this.editIcon);
            await this.waitForLoaders();
        });
    }

    /**
     * Modifies the High School fields (Notes, Email, Status) on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async editHighSchoolDetails(data = {}) {
        await test.step('Update High School fields (Notes, Email, Status)', async () => {
            await this.waitForLoaders();

            const updatedNotes = data.updatedNotes || 'Updated High School note';
            const updatedEmail = data.updatedEmail || `updated_${this.schoolName}@example.com`;

            // Update Notes
            await this.waitForVisible(this.notesInput);
            await this.fill(this.notesInput, updatedNotes);

            // Update Email
            if (await this.isVisible(this.emailInput)) {
                await this.fill(this.emailInput, updatedEmail);
            }

            // Update Status to Deleted or specified status
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            await this.click(this.statusDropdownOptionDeleted);
        });
    }

    /**
     * Verifies that the 'High school info updated successfully.' notification is displayed.
     **/
    async verifyHighSchoolUpdatedSuccessfully() {
        await test.step('Verify "High school info updated successfully." notification', async () => {

            await this.waitForVisible(this.page.getByText('High school info updated successfully.'));
            await this.verifyVisible(this.page.getByText('High school info updated successfully.'));
        });
    }
}
