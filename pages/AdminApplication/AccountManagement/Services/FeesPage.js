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
        this.eligibleServiceSelection = page.locator('.ms-elem-selectable:visible');
        this.selectedDiscountPackage = page.locator('.ms-elem-selection.ms-selected:visible');
        this.feeAmountInput = page.getByRole('textbox', { name: 'Fee Amount' });
        this.notesInput = page.locator('#Notes');
        this.allowWebPurchaseYesRadioButton = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowWebPurchase']//following-sibling::ins");
        this.allowWebPurchaseNoRadioButton = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowWebPurchase']//following-sibling::ins");
        this.allowPortalPurchaseYesRadioButton = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowPortalPurchase']//following-sibling::ins");
        this.allowPortalPurchaseNoRadioButton = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowPortalPurchase']//following-sibling::ins");
        this.allowWebPurchaseYesRadioWrapper = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowWebPurchase']//parent::div")
        this.allowWebPurchaseNoRadioWrapper = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowWebPurchase']//parent::div")
        this.allowPortalPurchaseYesRadioWrapper = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowPortalPurchase']//parent::div")
        this.allowPortalPurchaseNoRadioWrapper = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowPortalPurchase']//parent::div")
        this.itemTaxableCheckbox = page.locator("xpath=//input[@id='ItemIsTaxable']//following-sibling::ins");
        this.itemTaxableCheckboxWrapper = page.locator("xpath=//input[@id='ItemIsTaxable']//parent::div");
        this.currentTaxesDropdown = page.locator("xpath=//button[@data-id='drp_Products_CurrentSatetTaxList']");
        this.currentTaxesDropdownOption = page.locator("xpath=(//button[@data-id='drp_Products_CurrentSatetTaxList']//parent::div//div//li[not(@class='selected')]//span[1][not(text()='Please Select')])[1]");
        this.additionalTaxInput = page.getByRole('textbox', { name: 'Additional Tax' });
        this.totalItemPriceLabel = page.locator('#lbl_Products_TotalItemprice');
        this.totalTaxAmountLabel = page.locator('#lbl_Products_TotalTaxAmount');

        // Modal Action Buttons
        this.saveBtn = page.locator("xpath=//span[contains(@class,'FeesHeader')]//ancestor::div[contains(@class,'modal-content')]//button[contains(text(),'Save')]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        this.statusFilterDropdown = page.locator("xpath=//div[@id='pnlFeesTAB']//a[contains(.,'Status')]");
        this.selectAllStatusCheckbox = page.locator("xpath=//div[@id='pnlFeesTAB']//input[contains(@class,'Fees_SelectAllStatus')]//following-sibling::ins");

        this.searchTextbox = page.locator("xpath=//div[@id='tblFees_filter']//input[@type='search']");
        this.editIcon = page.getByTitle('Edit');

        this.isEligibleServiceSelected = false;
        this.isEligibleServiceUpdated = false;
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
            const additionalTax = data.additionalTax;
            this.additionalTax = additionalTax;

            await this.waitForLoaders();
            await this.waitForVisible(this.feeNameInput);
            await this.fill(this.feeNameInput, this.feeName);

            // Select Status as Active
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionActive);
            await this.click(this.statusDropdownOptionActive);

            // Fill Amount & Notes
            await this.fill(this.feeAmountInput, feeAmount);

            if (await this.isVisible(this.eligibleServiceSelection.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.eligibleServiceSelection.first());
                this.isEligibleServiceSelected = true;
            } else {
                this.isEligibleServiceSelected = false;
            }

            await this.fill(this.notesInput, notes);

            if (await this.isVisible(this.itemTaxableCheckboxWrapper, { timeout: 100 }).catch(() => false)) {
                await this.click(this.itemTaxableCheckbox);
                await this.click(this.currentTaxesDropdown);
                await this.waitForVisible(this.currentTaxesDropdownOption);
                await this.click(this.currentTaxesDropdownOption);
                await this.fill(this.additionalTaxInput, additionalTax);
            }

            if (await this.isVisible(this.allowWebPurchaseYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.allowWebPurchaseYesRadioButton);
            }
            if (await this.isVisible(this.allowPortalPurchaseNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.allowPortalPurchaseNoRadioButton);
            }
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
    async searchAndEditFee(feeName = this.feeName, maxRetries = 5) {
        await test.step(`Search and edit Fee: "${feeName}"`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForLoadState('load').catch(() => { });
                await this.waitForLoaders();
                await this.waitForVisible(this.searchTextbox);
                await this.fill(this.searchTextbox, feeName);
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
     * Opens the Status filter dropdown, selects All status, and closes the dropdown.
     **/
    async filterByAllStatus() {
        await test.step('Filter Fees by All status', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.statusFilterDropdown);
            await this.click(this.statusFilterDropdown);

            await this.waitForVisible(this.selectAllStatusCheckbox);
            await this.click(this.selectAllStatusCheckbox, { force: true });

            // Close the dropdown after selection by clicking on dropdown xpath again
            await this.click(this.statusFilterDropdown);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1000);
        });
    }

    /**
     * Verifies that the fee details in the edit form match the values added during creation.
     * @param {Object} data - Expected fee configuration data fixture.
     **/
    async verifyFeeDetails(data = {}) {
        await test.step('Verify fee details in edit form match added values', async () => {
            await this.waitForVisible(this.feeNameInput, { timeout: 5000 });
            await expect(this.feeNameInput).toHaveValue(this.feeName || data.feeName);

            if (await this.isVisible(this.feeAmountInput, { timeout: 100 }).catch(() => false)) {
                const actualAmount = await this.feeAmountInput.inputValue();
                expect(parseFloat(actualAmount)).toBe(parseFloat(data.feeAmount));
            }

            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.notesInput).toHaveValue(data.notes);
            }

            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.statusDropdown).toContainText('Active');
            }
            if (this.isEligibleServiceSelected) {
                await this.verifyVisible(this.selectedDiscountPackage.first());
            }

            if (await this.isVisible(this.allowWebPurchaseYesRadioButton, { timeout: 100 }).catch(() => false)) {
                if (await this.allowWebPurchaseYesRadioWrapper.count() > 0) {
                    await expect(this.allowWebPurchaseYesRadioWrapper.first()).toHaveClass(/checked/);
                }
            }
            if (await this.isVisible(this.allowPortalPurchaseNoRadioButton, { timeout: 100 }).catch(() => false)) {
                if (await this.allowPortalPurchaseNoRadioWrapper.count() > 0) {
                    await expect(this.allowPortalPurchaseNoRadioWrapper.first()).toHaveClass(/checked/);
                }
            }

            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.itemTaxableCheckboxWrapper).toHaveClass(/checked/);
                await expect(this.currentTaxesDropdown).not.toContainText('Please Select');
                const actualAmount = await this.additionalTaxInput.inputValue();
                expect(parseFloat(actualAmount)).toBe(parseFloat(this.additionalTax));
                await expect(this.totalItemPriceLabel).not.toHaveText('$0.00');
                await expect(this.totalTaxAmountLabel).not.toHaveText('$0.00');
            }

        });
    }

    /**
     * Modifies all fee fields (Name, Amount, Notes, Status, Selectable, Radios) on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async updateFeeDetails(data = {}) {
        await test.step('Update Fee fields (Name, Amount, Notes, Status, Radios, Selectables)', async () => {
            await this.waitForLoaders();

            const updatedAmount = data.updatedFeeAmount;
            const updatedNotes = data.updatedNotes;

            if (await this.feeNameInput.isEditable().catch(() => false)) {
                this.feeName = `${data.updatedFeeName}_${this.uniqueId}`;
                await this.fill(this.feeNameInput, this.feeName);
            }

            // Update Fee Amount
            await this.waitForVisible(this.feeAmountInput);
            await this.fill(this.feeAmountInput, updatedAmount);

            // Update Status (always Deleted on update)
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            await this.click(this.statusDropdownOptionDeleted);

            // Select last discount package
            if (await this.isVisible(this.eligibleServiceSelection.last(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.eligibleServiceSelection.last());
                this.isEligibleServiceUpdated = true;
            } else {
                this.isEligibleServiceUpdated = false;
            }

            // Update Notes
            await this.fill(this.notesInput, updatedNotes);

            // Switch radio buttons to alternate
            if (await this.isVisible(this.allowWebPurchaseNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.allowWebPurchaseNoRadioButton);
            }
            if (await this.isVisible(this.allowPortalPurchaseYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.allowPortalPurchaseYesRadioButton);
            }

            // Uncheck taxable checkbox (was checked in add)
            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.itemTaxableCheckbox);
            }
        });
    }

    /**
     * Verifies that the fee details in the edit form match the updated values.
     * @param {Object} data - Expected fee configuration data fixture.
     **/
    async verifyUpdatedFeeDetails(data = {}) {
        await test.step('Verify fee details in edit form match updated values', async () => {
            await this.waitForVisible(this.feeNameInput, { timeout: 5000 });
            await expect(this.feeNameInput).toHaveValue(this.feeName);

            if (await this.isVisible(this.feeAmountInput, { timeout: 100 }).catch(() => false)) {
                const actualAmount = await this.feeAmountInput.inputValue();
                expect(parseFloat(actualAmount)).toBe(parseFloat(data.updatedFeeAmount));
            }

            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.notesInput).toHaveValue(data.updatedNotes);
            }

            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.statusDropdown).toContainText('Deleted');
            }

            if (await this.isVisible(this.allowWebPurchaseNoRadioButton, { timeout: 100 }).catch(() => false)) {
                if (await this.allowWebPurchaseNoRadioWrapper.count() > 0) {
                    await expect(this.allowWebPurchaseNoRadioWrapper.first()).toHaveClass(/checked/);
                }
            }
            if (await this.isVisible(this.allowPortalPurchaseYesRadioButton, { timeout: 100 }).catch(() => false)) {
                if (await this.allowPortalPurchaseYesRadioWrapper.count() > 0) {
                    await expect(this.allowPortalPurchaseYesRadioWrapper.first()).toHaveClass(/checked/);
                }
            }
            const eligibleServiceCount = (this.isEligibleServiceSelected ? 1 : 0) + (this.isEligibleServiceUpdated ? 1 : 0);
            if (eligibleServiceCount > 0) {
                await expect(this.selectedDiscountPackage).toHaveCount(eligibleServiceCount);
            }

            // Verify item taxable checkbox was unchecked
            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.itemTaxableCheckboxWrapper).not.toHaveClass(/checked/);
                await this.verifyNotVisible(this.currentTaxesDropdown);
                await this.verifyNotVisible(this.additionalTaxInput);
                await this.verifyNotVisible(this.totalItemPriceLabel);
                await this.verifyNotVisible(this.totalTaxAmountLabel);

            }
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
