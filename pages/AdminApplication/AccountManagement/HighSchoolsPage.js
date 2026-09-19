import BasePage from '@utils/BasePage';
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
        this.stateOptionLast = page.locator("(//select[@id='State']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]");

        this.zipCodeInput = page.locator('#ZipCode');
        this.emailInput = page.getByRole('textbox', { name: 'Email' });
        this.notesInput = page.locator('#SchoolNote');

        // Modal Action Buttons & Notifications
        this.saveBtn = page.locator("#btnSaveNewHighSchoolInfo");
        this.saveUpdateButton = page.locator("#btnUpdateHighSchoolInfo");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        this.statusFilterDropdown = page.locator("xpath=//div[@id='highSchools']//a[contains(.,'Status')]");
        this.selectAllStatusCheckbox = page.locator("xpath=//div[@id='highSchools']//ul[contains(@class,'dropdown-menu')]//input[contains(@class,'SelectAll') or contains(@class,'All')]//following-sibling::ins").or(page.locator("xpath=//div[@id='highSchools']//ul[contains(@class,'dropdown-menu')]//li[1]//ins")).or(page.locator("xpath=//div[@id='highSchools']//input[contains(@class,'SelectAllStatus')]//following-sibling::ins"));

        // Data Table Locators
        this.searchTextbox = page.locator("input[type='search']").first();
        this.highSchoolTable = page.locator('#dtHighSchool');
        this.editIcon = page.getByTitle('Edit');

        // Form State
        this.uniqueId = '';
        this.schoolName = '';
        this.schoolCode = '';
        this.address = '';
        this.city = '';
        this.selectedState = '';
        this.selectedStatus = '';
        this.zip = '';
        this.email = '';
        this.notes = '';
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
            this.schoolName = `${data.schoolNamePrefix}_${this.uniqueId}`;
            this.schoolCode = `${data.schoolCodePrefix}_${Math.floor(1000 + Math.random() * 9000)}`;

            this.address = data.address;
            this.city = data.city;
            this.zip = data.zip;
            this.email = data.email;
            this.notes = data.notes;

            await this.waitForLoaders();
            await this.waitForVisible(this.schoolNameInput);
            await this.fill(this.schoolNameInput, this.schoolName);

            // Select Status as Active
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionActive);
            this.selectedStatus = (await this.statusDropdownOptionActive.innerText()).trim();
            await this.click(this.statusDropdownOptionActive);
            // Fill Code & Address
            await this.fill(this.schoolCodeInput, this.schoolCode);

            await this.fill(this.schoolAddressInput, this.address);

            await this.fill(this.cityInput, this.city);

            // Select State (CT or from data)
            if (await this.stateDropdown.isVisible({ timeout: 100 }).catch(() => false)) {
                await this.click(this.stateDropdown);
                await this.waitForVisible(this.stateOption);
                this.selectedState = (await this.stateOption.innerText()).trim();
                await this.click(this.stateOption);
            }

            // Fill Zip, Email & Notes
            await this.fill(this.zipCodeInput, this.zip);

            if (await this.isVisible(this.emailInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emailInput, this.email);
            }

            await this.fill(this.notesInput, this.notes);

            return {
                schoolName: this.schoolName,
                schoolCode: this.schoolCode
            };
        });
    }

    /**
     * Verifies that the High School details in the form match the filled / expected values.
     * @param {Object} [expectedDetails={}] - Optional expected high school details.
     **/
    async verifyHighSchoolDetails(expectedDetails = {}) {
        await test.step('Verify High School details in form', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schoolNameInput);

            const expectedSchoolName = expectedDetails.schoolName || this.schoolName;
            const expectedSchoolCode = expectedDetails.schoolCode || expectedDetails.schoolCodePrefix || this.schoolCode;
            const expectedAddress = expectedDetails.address || this.address;
            const expectedCity = expectedDetails.city || this.city;
            const expectedZip = expectedDetails.zip || expectedDetails.zipCode || this.zip;
            const expectedEmail = expectedDetails.email || this.email;
            const expectedNotes = expectedDetails.notes || this.notes;

            await expect(this.schoolNameInput).toHaveValue(expectedSchoolName);

            const actualStatus = (await this.statusDropdown.innerText()).trim().toLowerCase();
            const expectedStatus = (expectedDetails.status || this.selectedStatus || 'Active').trim().toLowerCase();
            expect(actualStatus).toContain(expectedStatus);

            const actualSchoolCode = (await this.schoolCodeInput.inputValue()).trim();
            expect(actualSchoolCode).toContain(expectedSchoolCode);

            await expect(this.schoolAddressInput).toHaveValue(expectedAddress);
            await expect(this.cityInput).toHaveValue(expectedCity);

            const actualState = (await this.stateDropdown.innerText()).trim().toLowerCase();
            const expectedState = (this.selectedState || expectedDetails.state || '').trim().toLowerCase();
            if (expectedState) {
                expect(actualState).toContain(expectedState);
            }

            await expect(this.zipCodeInput).toHaveValue(expectedZip);

            if (await this.isVisible(this.emailInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emailInput).toHaveValue(expectedEmail);
            }

            await expect(this.notesInput).toHaveValue(expectedNotes);

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
    async searchAndEditHighSchool(schoolName = this.schoolName, maxRetries = 5) {
        await test.step(`Search and edit High School: "${schoolName}"`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForLoadState('load').catch(() => { });
                await this.waitForLoaders();
                await this.waitForVisible(this.searchTextbox);
                await this.fill(this.searchTextbox, schoolName);
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
    /**
     * Modifies all High School fields (Name, Code, Address, City, State, Zip, Email, Notes, Status) on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async editHighSchoolDetails(data = {}) {
        await test.step('Update High School fields (Name, Code, Address, City, State, Zip, Email, Notes, Status)', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schoolNameInput, { timeout: 5000 })

            // Update School Name
            if (await this.schoolNameInput.isEditable().catch(() => false)) {
                this.schoolName = `${data.updatedSchoolNamePrefix}_${this.uniqueId}`;
                await this.fill(this.schoolNameInput, this.schoolName);
            }

            // Update School Code
            if (await this.schoolCodeInput.isEditable().catch(() => false)) {
                this.schoolCode = `${data.updatedSchoolCodePrefix}${Math.floor(1000 + Math.random() * 9000)}`.substring(0, 5);
                await this.fill(this.schoolCodeInput, this.schoolCode);
            }

            // Update Address
            if (await this.isVisible(this.schoolAddressInput, { timeout: 100 }).catch(() => false)) {
                this.address = data.updatedAddress;
                await this.fill(this.schoolAddressInput, this.address);
            }

            // Update City
            if (await this.isVisible(this.cityInput, { timeout: 100 }).catch(() => false)) {
                this.city = data.updatedCity;
                await this.fill(this.cityInput, this.city);
            }

            // Select last State option
            if (await this.isVisible(this.stateDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.stateDropdown);
                await this.waitForVisible(this.stateOptionLast);
                this.selectedState = (await this.stateOptionLast.innerText()).trim();
                await this.click(this.stateOptionLast);

            }

            // Update Zip
            if (await this.isVisible(this.zipCodeInput, { timeout: 100 }).catch(() => false)) {
                this.zip = data.updatedZip;
                await this.fill(this.zipCodeInput, this.zip);
            }

            // Update Email
            if (await this.isVisible(this.emailInput, { timeout: 100 }).catch(() => false)) {
                this.email = data.updatedEmail;
                await this.fill(this.emailInput, this.email);
            }

            // Update Notes
            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                this.notes = data.updatedNotes;
                await this.fill(this.notesInput, this.notes);
            }
            // Update Status to Deleted
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            this.selectedStatus = 'Deleted';
            await this.click(this.statusDropdownOptionDeleted);
        });
    }

    /**
     * Opens the Status filter dropdown, selects All status, and closes the dropdown.
     **/
    async filterByAllStatus() {
        await test.step('Filter High Schools by All status', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.statusFilterDropdown);
            await this.click(this.statusFilterDropdown);

            await this.waitForVisible(this.selectAllStatusCheckbox.first());
            await this.click(this.selectAllStatusCheckbox.first(), { force: true });

            // Close the dropdown after selection by clicking on dropdown xpath again
            await this.click(this.statusFilterDropdown);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1000);
        });
    }

    /**
     * Verifies that the High School details in the form match the updated values.
     * @param {Object} [expectedDetails={}] - Expected update details.
     **/
    async verifyUpdatedHighSchoolDetails(expectedDetails = {}) {
        await test.step('Verify updated High School details in form', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schoolNameInput);

            await expect(this.schoolNameInput).toHaveValue(this.schoolName);

            const actualStatus = (await this.statusDropdown.innerText()).trim().toLowerCase();
            expect(actualStatus).toContain('deleted');

            const actualSchoolCode = (await this.schoolCodeInput.inputValue()).trim();
            expect(actualSchoolCode).toContain(this.schoolCode);

            await expect(this.schoolAddressInput).toHaveValue(this.address);
            await expect(this.cityInput).toHaveValue(this.city);

            if (this.selectedState) {
                const actualState = (await this.stateDropdown.innerText()).trim().toLowerCase();
                expect(actualState).toContain(this.selectedState.toLowerCase());
            }

            await expect(this.zipCodeInput).toHaveValue(this.zip);

            if (await this.isVisible(this.emailInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emailInput).toHaveValue(this.email);
            }

            await expect(this.notesInput).toHaveValue(this.notes);
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
