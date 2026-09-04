import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the How Did You Hear Page in Admin Portal (Account Management > How did you hear).
 * Handles adding new lead sources with dynamic unique values,
 * editing existing lead sources, searching the data table, and verifying notifications.
 **/
export default class HowDidYouHearPage extends BasePage {

    /**
     * Initializes locators for the How Did You Hear Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("#addNewReferal");

        // Add / Edit Form Locators
        this.leadNameInput = page.getByRole('textbox', { name: 'Lead Name' })
        this.statusDropdown = page.locator("xpath=//select[@name='LeadStatus']//parent::div//button");
        this.statusDropdownOptionActive = page.locator("xpath=//select[@name='LeadStatus']//parent::div//div//span[text()='Active']");
        this.statusDropdownOptionDeleted = page.locator("xpath=//select[@name='LeadStatus']//parent::div//div//span[text()='Deleted']");

        this.leadCodeInput = page.getByRole('textbox', { name: 'Lead Code' });
        this.expirationDateInput = page.getByRole('textbox', { name: 'MM/DD/YYYY' });
        this.notesInput = page.locator('#LeadNote');

        // Form Action Buttons & Notifications
        this.saveBtn = page.locator("xpath=(//b[contains(text(),'How did you hear') or contains(text(),'HOW DID YOU HEAR')]//ancestor::div[contains(@class,'modal-content')]//a[contains(text(),'Save')])[1]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        // Data Table Locators
        this.searchTextbox = page.locator("input[type='search']").first()
        this.leadsTable = page.locator('#Leadslisttable');
        this.editIcon = page.getByTitle('Edit');
    }

    /**
     * Clicks the 'Add New' button to open the Add Lead Source form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button for How did you hear', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Fills the How Did You Hear creation form with dynamic unique values.
     * @param {Object} data - How Did You Hear test data fixture.
     * @returns {Promise<Object>} Created lead details.
     **/
    async fillHowDidYouHearDetails(data = {}) {
        return await test.step('Fill How did you hear details', async () => {
            this.uniqueId = `${Date.now()}`;
            this.leadName = `${data.leadNamePrefix || 'LeadSource'}_${this.uniqueId}`;
            this.leadCode = `${data.leadCodePrefix || 'SRC'}_${Math.floor(1000 + Math.random() * 9000)}`;
            this.expirationDate = data.expirationDate;
            const notes = data.notes || 'Automated How Did You Hear note';

            await this.waitForLoaders();
            await this.waitForVisible(this.leadNameInput);
            await this.fill(this.leadNameInput, this.leadName);

            // Select Status as Active
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionActive);
            await this.click(this.statusDropdownOptionActive);

            // Fill Lead Code
            await this.waitForVisible(this.leadCodeInput);
            await this.fill(this.leadCodeInput, this.leadCode);

            await this.fill(this.expirationDateInput, this.expirationDate)

            // Fill Notes
            await this.waitForVisible(this.notesInput);
            await this.fill(this.notesInput, notes);

            return {
                leadName: this.leadName,
                leadCode: this.leadCode
            };
        });
    }

    /**
     * Clicks the Save button and handles optional confirmation dialog.
     **/
    async clickSave() {
        await test.step('Click Save button', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);

            // Handle optional confirmation dialog if present
            if (await this.yesConfirmationButton.isVisible({ timeout: 1500 }).catch(() => false)) {
                await this.click(this.yesConfirmationButton);
            }

            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Verifies that the 'How did you hear information added successfully.' notification is displayed.
     **/
    async verifyHowDidYouHearCreatedSuccessfully() {
        await test.step('Verify "How did you hear information added successfully." notification', async () => {
            const successMessage = this.page.getByText('How did you hear information added successfully.');
            await this.waitForVisible(successMessage);
            await this.verifyVisible(successMessage)
        });
    }

    /**
     * Searches for the created Lead Source in the data table and clicks Edit.
     * @param {string} [leadName=this.leadName] - Lead source name to search.
     **/
    async searchAndEditHowDidYouHear(leadName = this.leadName) {
        await test.step(`Search and edit How did you hear: "${leadName}"`, async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, leadName);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);

            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.click(this.editIcon);
            await this.waitForLoaders();
        });
    }

    /**
     * Modifies the Lead Source fields (Notes, Status) on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async editHowDidYouHearDetails(data = {}) {
        await test.step('Update How did you hear fields (Notes, Status)', async () => {
            await this.waitForLoaders();

            const updatedNotes = data.updatedNotes || 'Updated How Did You Hear note';

            // Update Status to Deleted or specified status
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            await this.click(this.statusDropdownOptionDeleted);

            // Update Notes
            await this.waitForVisible(this.notesInput);
            await this.fill(this.notesInput, updatedNotes);
        });
    }

    /**
     * Verifies that the 'How did you hear information updated successfully.' notification is displayed.
     **/
    async verifyHowDidYouHearUpdatedSuccessfully() {
        await test.step('Verify "How did you hear information updated successfully." notification', async () => {
            const successMessage = this.page.getByText('How did you hear information updated successfully.');
            await this.waitForVisible(successMessage);
            await this.verifyVisible(successMessage)

        });
    }
}
