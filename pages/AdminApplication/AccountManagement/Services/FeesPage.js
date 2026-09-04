import BasePage from '../../../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Fees Page in Admin Portal (Account Management > Services > Fees).
 * Handles adding new fees with dynamic date-time naming, editing existing fees,
 * searching the fees data table, and verifying success notifications.
 **/
export default class FeesPage extends BasePage {

    /**
     * Initializes locators for Fees Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("xpath=//a[contains(@onclick,'AddOrEditFees') and contains(@class,'btn')]");

        // Add / Edit Fee Form Locators
        this.feeNameInput = page.locator("#FeeName");
        this.statusDropdown = page.locator("xpath=//select[@name='Status']//parent::div//button");
        this.statusDropdownOptionActive = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Active']");
        this.statusDropdownOptionDeleted = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Deleted']");
        this.eligibleServiceSelection = page.locator("xpath=(//li[contains(@attrcolumn,'DiscountPackages')])[1]");
        this.feeAmountInput = page.getByRole('textbox', { name: 'Fee Amount' });
        this.notesInput = page.locator('#Notes');

        // Modal Action Buttons
        this.saveBtn = page.locator("xpath=//span[contains(@class,'FeesHeader')]//ancestor::div[contains(@class,'modal-content')]//button[contains(text(),'Save')]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        // Table Locators
        this.searchTextbox = page.locator("xpath=//div[@id='tblFees_filter']//input[@type='search']");
        this.editIcon = page.getByTitle('Edit');
    }


    /**
     * Clicks the 'Add New' button to open the Add Fee form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button for Fee', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Fills the Fee creation form with a prefix and unique date-time name.
     * @param {Object} data - Fee configuration data from test-data fixture.
     * @returns {Promise<string>} The generated unique fee name.
     **/
    async fillFeeDetails(data = {}) {
        return await test.step('Fill fee details', async () => {
            const prefix = data.feeName;
            this.uniqueId = `${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
            this.feeName = `${prefix}_${this.uniqueId}`;

            const feeAmount = data.feeAmount;
            const notes = data.notes;

            await this.waitForLoaders();
            await this.waitForVisible(this.feeNameInput);
            await this.fill(this.feeNameInput, this.feeName);

            // Select Status as Active
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionActive);
            await this.click(this.statusDropdownOptionActive);

            // Fill Amount & Notes
            await this.waitForVisible(this.feeAmountInput);
            await this.fill(this.feeAmountInput, feeAmount);

            if (await this.isVisible(this.eligibleServiceSelection, { timeout: 1000 }).catch(() => false)) {
                await this.click(this.eligibleServiceSelection)
            }

            await this.waitForVisible(this.notesInput);
            await this.fill(this.notesInput, notes);

            return this.feeName;
        });
    }

    /**
     * Clicks the Save button and confirms the popup dialog.
     **/
    async clickSave() {
        await test.step('Click Save button and confirm dialog', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);
            await this.waitForVisible(this.yesConfirmationButton);
            await this.click(this.yesConfirmationButton);
            await this.waitForLoaders();
            await this.waitForHidden(this.saveBtn)
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Verifies that the 'Fee added successfully.' notification is displayed.
     **/
    async verifyFeeAddedSuccessfully() {
        await test.step('Verify "Fee added successfully." notification', async () => {
            await this.waitForVisible(this.page.getByText('Fee added successfully'));
            await this.verifyVisible(this.page.getByText('Fee added successfully'));
        });
    }

    /**
     * Searches for the created fee by name and clicks its Edit action.
     * @param {string} [feeName=this.feeName] - Fee name to search and edit.
     **/
    async searchAndEditFee(feeName = this.feeName) {
        await test.step(`Search and edit Fee: "${feeName}"`, async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, feeName);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);
            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.click(this.editIcon);
            await this.waitForLoaders();
        });
    }

    /**
     * Modifies the fee fields (Amount, Notes, Status) on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async editFeeDetails(data = {}) {
        await test.step('Update Fee fields (Amount, Notes, Status)', async () => {
            await this.waitForLoaders();

            const updatedAmount = data.updatedFeeAmount;
            const updatedNotes = data.updatedNotes;

            // Update Fee Amount
            await this.waitForVisible(this.feeAmountInput);
            await this.fill(this.feeAmountInput, updatedAmount);

            // Update Notes
            await this.waitForVisible(this.notesInput);
            await this.fill(this.notesInput, updatedNotes);

            // Update Status (e.g. Deleted / Inactive / Active)
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            await this.click(this.statusDropdownOptionDeleted);
        });
    }

    /**
     * Verifies that the 'Fee updated successfully.' notification is displayed.
     **/
    async verifyFeeUpdatedSuccessfully() {
        await test.step('Verify "Fee updated successfully." notification', async () => {
            await this.waitForVisible(this.page.getByText('Fee updated successfully'));
            await this.verifyVisible(this.page.getByText('Fee updated successfully'));
        });
    }
}
