import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Discounts Page in Admin Portal (Account Management > Services > Discounts).
 * Handles adding new discounts with dynamic Date.now() naming and random code generation,
 * editing existing discounts, searching the discounts data table, and verifying success notifications.
 **/
export default class DiscountsPage extends BasePage {

    /**
     * Initializes locators for Discounts Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("xpath=//a[contains(@onclick,'AddOrEditDiscounts') and (contains(@class,'btn'))]");

        // Add / Edit Discount Form Locators
        this.discountNameInput = page.getByRole('textbox', { name: 'Discount Name' });
        this.discountCodeInput = page.getByRole('textbox', { name: 'Discount Code' });
        this.discountAmountInput = page.getByRole('textbox', { name: 'Discount Amount' });
        this.feeAmountInput = page.getByRole('textbox', { name: 'Fee Amount' });
        this.statusDropdown = page.locator("xpath=//select[@name='Status']//parent::div//button");
        this.statusDropdownOptionActive = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Active']");
        this.statusDropdownOptionDeleted = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Deleted']");
        this.itemTaxableCheckbox = page.locator("xpath=//input[@id='ItemIsTaxable']//following-sibling::ins");
        this.itemTaxableCheckboxWrapper = page.locator("xpath=//input[@id='ItemIsTaxable']//parent::div");
        this.currentTaxesDropdown = page.locator("xpath=//button[@data-id='drp_Products_CurrentSatetTaxList']");
        this.currentTaxesDropdownOption = page.locator("xpath=(//button[@data-id='drp_Products_CurrentSatetTaxList']//parent::div//div//li[not(@class='selected')]//span[1][not(text()='Please Select')])[1]");
        this.additionalTaxInput = page.getByRole('textbox', { name: 'Additional Tax' });
        this.totalItemPriceLabel = page.locator('#lbl_Products_TotalItemprice');
        this.totalTaxAmountLabel = page.locator('#lbl_Products_TotalTaxAmount');

        this.eligibleServiceSelection = page.locator("//div[contains(@class,'ms-selectable')]//li[contains(@attrcolumn,'DiscountPackages')]");
        this.selectedServicePackage = page.locator("//div[contains(@class,'ms-selection')]//li[contains(@attrcolumn,'DiscountPackages') and contains(@class,'ms-selected')]");
        this.eligibleClassesSelection = page.locator("//div[contains(@class,'ms-selectable')]//li[contains(@attrcolumn,'DiscountClasses')]");
        this.selectedDiscountClasses = page.locator("//div[contains(@class,'ms-selection')]//li[contains(@attrcolumn,'DiscountClasses') and contains(@class,'ms-selected')]")
        this.eligibleLocationsSelection = page.locator("//div[contains(@class,'ms-selectable')]//li[contains(@attrcolumn,'DiscountLocations')]");
        this.selectedDiscountLocations = page.locator("//div[contains(@class,'ms-selection')]//li[contains(@attrcolumn,'DiscountLocations') and contains(@class,'ms-selected')]")
        this.discountExpirationTextbox = page.locator('#str_DiscountExpiry');
        this.notesInput = page.locator('#Notes');

        // Modal Action Buttons
        this.saveBtn = page.locator("xpath=(//div[contains(@id,'Discount')]//button[contains(text(),'Save')])[1]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        this.statusFilterDropdown = page.locator("xpath=//div[@id='pnlDiscountsTAB']//a[contains(.,'Status')]");
        this.selectAllStatusCheckbox = page.locator("xpath=//div[@id='pnlDiscountsTAB']//input[contains(@class,'SelectAllStatus')]//following-sibling::ins");

        this.searchTextbox = page.locator("xpath=(//div[contains(@id,'Discounts')]//input[@type='search'])[1]");
        this.editIcon = page.getByTitle('Edit');

        this.isServicePackageSelected = false;
        this.isDiscountClassesSelected = false;
        this.isDiscountLocationsSelected = false;
        this.isServicePackageUpdated = false;
        this.isDiscountClassesUpdated = false;
        this.isDiscountLocationsUpdated = false;
    }

    /**
     * Clicks the 'Add New' button to open the Add Discount form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button for Discount', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Fills the Discount creation form with dynamic Date.now() name and random code.
     * @param {Object} data - Discount test data fixture.
     * @returns {Promise<string>} The generated unique discount name.
     **/
    async fillDiscountDetails(data = {}) {
        return await test.step('Fill discount details', async () => {
            const prefix = data.discountName;
            this.discountName = `${prefix}_${Date.now()}`;
            this.discountCode = `${Math.floor(10000 + Math.random() * 90000)}`;
            const additionalTax = data.additionalTax;
            this.additionalTax = additionalTax;
            const discountAmount = data.discountAmount;
            const feeAmount = data.feeAmount;
            const notes = data.notes;
            const discountExpiry = data.discountExpiry;

            await this.waitForLoaders();
            await this.waitForVisible(this.discountNameInput);
            await this.fill(this.discountNameInput, this.discountName);

            await this.fill(this.discountCodeInput, this.discountCode);

            if (await this.isVisible(this.discountAmountInput, { timeout: 1000 }).catch(() => false)) {
                await this.fill(this.discountAmountInput, discountAmount);
            }
            else if (await this.isVisible(this.feeAmountInput, { timeout: 1000 }).catch(() => false)) {
                await this.fill(this.feeAmountInput, feeAmount);
            }

            // Select Status as Active
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionActive);
            await this.click(this.statusDropdownOptionActive);

            await this.click(this.itemTaxableCheckbox);
            await this.click(this.currentTaxesDropdown);
            await this.waitForVisible(this.currentTaxesDropdownOption);
            await this.click(this.currentTaxesDropdownOption);
            await this.fill(this.additionalTaxInput, additionalTax);

            // Select Service Package if visible
            if (await this.isVisible(this.eligibleServiceSelection.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.eligibleServiceSelection.first());
                this.isServicePackageSelected = true;
            } else {
                this.isServicePackageSelected = false;
            }

            // Select Discount Classes if visible
            if (await this.isVisible(this.eligibleClassesSelection.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.eligibleClassesSelection.first());
                this.isDiscountClassesSelected = true;
            } else {
                this.isDiscountClassesSelected = false;
            }

            // Select Discount Locations if visible
            if (await this.isVisible(this.eligibleLocationsSelection.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.eligibleLocationsSelection.first());
                this.isDiscountLocationsSelected = true;
            } else {
                this.isDiscountLocationsSelected = false;
            }

            await this.pressSequentially(this.discountExpirationTextbox, discountExpiry);
            await this.page.keyboard.press('Tab');

            await this.fill(this.notesInput, notes);

            return this.discountName;
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
            await this.waitForHidden(this.saveBtn);
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Verifies that the 'Discount added successfully.' notification is displayed.
     **/
    async verifyDiscountAddedSuccessfully() {
        await test.step('Verify "Discount added successfully." notification', async () => {
            await this.waitForVisible(this.page.getByText('Discount added successfully'));
            await this.verifyVisible(this.page.getByText('Discount added successfully'));
        });
    }

    /**
     * Searches for the created discount by name and clicks its Edit action.
     * @param {string} [discountName=this.discountName] - Discount name to search and edit.
     **/
    async searchAndEditDiscount(discountName = this.discountName, maxRetries = 5) {
        await test.step(`Search and edit Discount: "${discountName}"`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForLoadState('load').catch(() => { });
                await this.waitForLoaders();
                await this.waitForVisible(this.searchTextbox);
                await this.fill(this.searchTextbox, discountName);
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
     * Verifies that the discount details in the edit form match the values added during creation.
     * @param {Object} data - Expected discount configuration data fixture.
     **/
    async verifyDiscountDetails(data = {}) {
        await test.step('Verify discount details in edit form match added values', async () => {
            await this.waitForVisible(this.discountNameInput, { timeout: 5000 });
            await expect(this.discountNameInput).toHaveValue(this.discountName);

            if (await this.isVisible(this.discountCodeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.discountCodeInput).toHaveValue(this.discountCode);
            }

            if (await this.isVisible(this.discountAmountInput, { timeout: 100 }).catch(() => false)) {
                const actualAmount = await this.discountAmountInput.inputValue();
                expect(parseFloat(actualAmount)).toBe(parseFloat(data.discountAmount));
            } else if (await this.isVisible(this.feeAmountInput, { timeout: 100 }).catch(() => false)) {
                const actualAmount = await this.feeAmountInput.inputValue();
                expect(parseFloat(actualAmount)).toBe(parseFloat(data.feeAmount));
            }

            await expect(this.statusDropdown).toContainText('Active');
            await expect(this.notesInput).toHaveValue(data.notes);

            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.itemTaxableCheckboxWrapper).toHaveClass(/checked/);
                await expect(this.currentTaxesDropdown).not.toContainText('Please Select');
                const actualAmount = await this.additionalTaxInput.inputValue();
                expect(parseFloat(actualAmount)).toBe(parseFloat(this.additionalTax));
                await expect(this.totalItemPriceLabel).not.toHaveText('$0.00');
                await expect(this.totalTaxAmountLabel).not.toHaveText('$0.00');
            }

            if (this.isServicePackageSelected) {
                await this.verifyVisible(this.selectedServicePackage.first());
            }
            if (this.isDiscountClassesSelected) {
                await this.verifyVisible(this.selectedDiscountClasses.first());
            }
            if (this.isDiscountLocationsSelected) {
                await this.verifyVisible(this.selectedDiscountLocations.first());
            }

            if (await this.isVisible(this.discountExpirationTextbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.discountExpirationTextbox).toHaveValue(data.discountExpiry);
            }
        });
    }

    /**
     * Modifies the discount fields (Name, Code, Amount, Notes, Status, Selectables) on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async editDiscountDetails(data = {}) {
        await test.step('Update Discount fields (Name, Code, Amount, Notes, Status, Selectables)', async () => {
            await this.waitForLoaders();

            const updatedAmount = data.updatedDiscountAmount;
            const updatedNotes = data.updatedNotes;
            const updatedDiscountExpiry = data.updatedDiscountExpiry;
            await this.waitForVisible(this.statusDropdown);

            if (await this.discountNameInput.isEditable().catch(() => false)) {
                this.discountName = `${data.updatedDiscountName}_${Date.now()}`;
                await this.fill(this.discountNameInput, this.discountName);
            }

            if (await this.discountCodeInput.isEditable().catch(() => false)) {
                this.discountCode = `${Math.floor(10000 + Math.random() * 90000)}`;
                await this.fill(this.discountCodeInput, this.discountCode);
            }

            // Update Discount Amount
            if (await this.isVisible(this.discountAmountInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.discountAmountInput, updatedAmount);
            }
            else if (await this.isVisible(this.feeAmountInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.feeAmountInput, updatedAmount);
            }

            // Update Status to Deleted
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            await this.click(this.statusDropdownOptionDeleted);

            // Uncheck taxable checkbox (was checked in add)
            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.itemTaxableCheckbox);
            }

            // Select last selectable package, class, location if visible
            if (await this.isVisible(this.eligibleServiceSelection.last(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.eligibleServiceSelection.last());
                this.isServicePackageUpdated = true;
            } else {
                this.isServicePackageUpdated = false;
            }
            if (await this.isVisible(this.eligibleClassesSelection.last(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.eligibleClassesSelection.last());
                this.isDiscountClassesUpdated = true;
            } else {
                this.isDiscountClassesUpdated = false;
            }
            if (await this.isVisible(this.eligibleLocationsSelection.last(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.eligibleLocationsSelection.last());
                this.isDiscountLocationsUpdated = true;
            } else {
                this.isDiscountLocationsUpdated = false;
            }

            await this.clear(this.discountExpirationTextbox);
            await this.pressSequentially(this.discountExpirationTextbox, updatedDiscountExpiry);
            await this.page.keyboard.press('Tab');

            // Update Notes
            await this.fill(this.notesInput, updatedNotes);
        });
    }

    /**
     * Opens the Status filter dropdown, selects All status, and closes the dropdown.
     **/
    async filterByAllStatus() {
        await test.step('Filter Discounts by All status', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.statusFilterDropdown);
            await this.click(this.statusFilterDropdown);

            await this.waitForVisible(this.selectAllStatusCheckbox);
            await this.click(this.selectAllStatusCheckbox);

            // Close the dropdown after selection by clicking on dropdown xpath again
            await this.click(this.statusFilterDropdown);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1000);
        });
    }

    /**
     * Verifies that the discount details in the edit form match updated values.
     * @param {Object} data - Expected update configuration data fixture.
     **/
    async verifyUpdatedDiscountDetails(data = {}) {
        await test.step('Verify discount details in edit form match updated values', async () => {
            await this.waitForVisible(this.discountNameInput, { timeout: 5000 });
            await expect(this.discountNameInput).toHaveValue(this.discountName);

            if (await this.isVisible(this.discountCodeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.discountCodeInput).toHaveValue(this.discountCode);
            }

            if (await this.isVisible(this.discountAmountInput, { timeout: 100 }).catch(() => false)) {
                const actualAmount = await this.discountAmountInput.inputValue();
                expect(parseFloat(actualAmount)).toBe(parseFloat(data.updatedDiscountAmount));
            } else if (await this.isVisible(this.feeAmountInput, { timeout: 100 }).catch(() => false)) {
                const actualAmount = await this.feeAmountInput.inputValue();
                expect(parseFloat(actualAmount)).toBe(parseFloat(data.updatedDiscountAmount));
            }

            await expect(this.statusDropdown).toContainText('Deleted');

            await expect(this.notesInput).toHaveValue(data.updatedNotes);

            // Verify item taxable checkbox was unchecked
            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.itemTaxableCheckboxWrapper).not.toHaveClass(/checked/);
                await this.verifyNotVisible(this.currentTaxesDropdown);
                await this.verifyNotVisible(this.additionalTaxInput);
                await this.verifyNotVisible(this.totalItemPriceLabel);
                await this.verifyNotVisible(this.totalTaxAmountLabel);
            }

            const servicePackageCount = (this.isServicePackageSelected ? 1 : 0) + (this.isServicePackageUpdated ? 1 : 0);
            if (servicePackageCount > 0) {
                await expect(this.selectedServicePackage).toHaveCount(servicePackageCount);
            }
            const discountClassesCount = (this.isDiscountClassesSelected ? 1 : 0) + (this.isDiscountClassesUpdated ? 1 : 0);
            if (discountClassesCount > 0) {
                await expect(this.selectedDiscountClasses).toHaveCount(discountClassesCount);
            }
            const discountLocationsCount = (this.isDiscountLocationsSelected ? 1 : 0) + (this.isDiscountLocationsUpdated ? 1 : 0);
            if (discountLocationsCount > 0) {
                await expect(this.selectedDiscountLocations).toHaveCount(discountLocationsCount);
            }

            if (await this.isVisible(this.discountExpirationTextbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.discountExpirationTextbox).toHaveValue(data.updatedDiscountExpiry);
            }
        });
    }

    /**
     * Verifies that the 'Discount updated successfully.' notification is displayed.
     **/
    async verifyDiscountUpdatedSuccessfully() {
        await test.step('Verify "Discount updated successfully." notification', async () => {
            await this.waitForVisible(this.page.getByText('Discount updated successfully'));
            await this.verifyVisible(this.page.getByText('Discount updated successfully'));
        });
    }
}
