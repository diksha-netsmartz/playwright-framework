import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Miscellaneous Services Page in Admin Portal (Account Management > Services > Miscellaneous).
 * Handles adding new miscellaneous items with prefix and Date.now() naming,
 * editing existing items, searching the table, and verifying success notifications.
 **/
export default class MiscellaneousPage extends BasePage {

    /**
     * Initializes locators for Miscellaneous Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("xpath=//a[contains(@onclick,'AddOrEditMiscellaneous') and (contains(@class,'btn'))]");

        // Add / Edit Form Locators
        this.miscNameInput = page.locator("#MiscellaneousName");
        this.typeDropdown = page.locator("xpath=//select[@name='Type']//parent::div//button");
        this.typeOptionApparel = page.locator("xpath=//select[@name='Type']//parent::div//div//span[text()='Apparel']");
        this.typeOptionDVD = page.locator("xpath=//select[@name='Type']//parent::div//div//span[text()='DVD']");

        this.statusDropdown = page.locator("xpath=//select[@name='Status']//parent::div//button");
        this.statusDropdownOptionActive = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Active']");
        this.statusDropdownOptionDeleted = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Deleted']");

        this.priceInput = page.getByRole('textbox', { name: 'Price' });
        this.itemTaxableCheckbox = page.locator("xpath=//input[@id='ItemIsTaxable']//following-sibling::ins");
        this.itemTaxableCheckboxWrapper = page.locator("xpath=//input[@id='ItemIsTaxable']//parent::div");
        this.currentTaxesDropdown = page.locator("xpath=//button[@data-id='drp_Products_CurrentSatetTaxList']");
        this.currentTaxesDropdownOption = page.locator("xpath=(//button[@data-id='drp_Products_CurrentSatetTaxList']//parent::div//div//li[not(@class='selected')]//span[1][not(text()='Please Select')])[1]");
        this.additionalTaxInput = page.locator('#txt_Products_AdditionalTax:visible');
        this.totalItemPriceLabel = page.locator('#lbl_Products_TotalItemprice');
        this.totalTaxAmountLabel = page.locator('#lbl_Products_TotalTaxAmount');

        // Modal Action Buttons
        this.saveBtn = page.locator("xpath=//div[contains(@id,'Miscellaneous')]//button[contains(text(),'Save')]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        this.statusFilterDropdown = page.locator("xpath=//div[@id='pnlMiscellaneousTAB']//a[contains(.,'Status')]");
        this.selectAllStatusCheckbox = page.locator("xpath=//div[@id='pnlMiscellaneousTAB']//input[contains(@class,'SelectAllStatus')]//following-sibling::ins");

        // Table Locators
        this.searchTextbox = page.locator("xpath=(//div[contains(@id,'Miscellaneous_filter')]//input[@type='search'])[1]");
        this.editIcon = page.getByTitle('Edit');
    }

    /**
     * Clicks the 'Add New' button to open the Add Miscellaneous item form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button for Miscellaneous item', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Fills the Miscellaneous creation form with prefix and Date.now() name.
     * @param {Object} data - Miscellaneous test data fixture.
     * @returns {Promise<string>} The generated unique item name.
     **/
    async fillMiscDetails(data = {}) {
        return await test.step('Fill miscellaneous item details', async () => {
            const prefix = data.miscellaneousName;
            this.miscName = `${prefix}_${Date.now()}`;
            const price = data.price;
            const additionalTax = data.additionalTax;
            this.additionalTax = additionalTax;

            await this.waitForLoaders();
            await this.waitForVisible(this.miscNameInput);
            await this.fill(this.miscNameInput, this.miscName);

            // Select Type as Apparel
            await this.click(this.typeDropdown);
            await this.waitForVisible(this.typeOptionApparel);
            await this.click(this.typeOptionApparel);
            // Select Status to Active
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionActive);
            await this.click(this.statusDropdownOptionActive);

            // Fill Price
            await this.fill(this.priceInput, price);

            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.itemTaxableCheckbox);
                await this.click(this.currentTaxesDropdown);
                await this.waitForVisible(this.currentTaxesDropdownOption);
                await this.click(this.currentTaxesDropdownOption);
                await this.fill(this.additionalTaxInput, additionalTax);
            }

            return this.miscName;
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
     * Verifies that the 'Miscellaneous item added successfully.' notification is displayed.
     **/
    async verifyMiscAddedSuccessfully() {
        await test.step('Verify "Miscellaneous item added successfully." notification', async () => {
            await this.waitForVisible(this.page.getByText('Miscellaneous item added successfully'));
            await this.verifyVisible(this.page.getByText('Miscellaneous item added successfully'));
        });
    }

    /**
     * Searches for the created miscellaneous item by name and clicks its Edit action.
     * @param {string} [miscName=this.miscName] - Item name to search and edit.
     **/
    async searchAndEditMisc(miscName = this.miscName, maxRetries = 5) {
        await test.step(`Search and edit Miscellaneous item: "${miscName}"`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForLoadState('load').catch(() => { });
                await this.waitForLoaders();
                await this.waitForVisible(this.searchTextbox);
                await this.fill(this.searchTextbox, miscName);
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
     * Verifies that the miscellaneous item details in the edit form match the values added during creation.
     * @param {Object} data - Expected miscellaneous item data fixture.
     **/
    async verifyMiscDetails(data = {}) {
        await test.step('Verify miscellaneous item details in edit form match added values', async () => {
            await this.waitForVisible(this.miscNameInput, { timeout: 5000 });
            await expect(this.miscNameInput).toHaveValue(this.miscName);
            await expect(this.typeDropdown).toContainText('Apparel');
            await expect(this.statusDropdown).toContainText('Active');
            const actualPrice = await this.priceInput.inputValue();
            expect(parseFloat(actualPrice)).toBe(parseFloat(data.price));

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
     * Modifies the miscellaneous fields (Name, Category, Status, Price) on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async editMiscDetails(data = {}) {
        await test.step('Update Miscellaneous fields (Name, Category, Status, Price)', async () => {
            await this.waitForLoaders();

            const updatedPrice = data.updatedPrice;

            if (await this.miscNameInput.isEditable().catch(() => false)) {
                this.miscName = `${data.updatedMiscellaneousName}_${Date.now()}`;
                await this.fill(this.miscNameInput, this.miscName);
            }

            // Update Category to DVD in dropdown
            await this.waitForVisible(this.typeDropdown);
            await this.click(this.typeDropdown);
            await this.waitForVisible(this.typeOptionDVD);
            await this.click(this.typeOptionDVD);

            // Update Status to Deleted
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            await this.click(this.statusDropdownOptionDeleted);

            // Update Price
            await this.fill(this.priceInput, updatedPrice);

            // Uncheck taxable checkbox (was checked in add)
            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.itemTaxableCheckbox);
            }
        });
    }

    /**
     * Opens the Status filter dropdown, selects All status, and closes the dropdown.
     **/
    async filterByAllStatus() {
        await test.step('Filter Miscellaneous items by All status', async () => {
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
     * Verifies that the miscellaneous item details in the edit form match updated values.
     * @param {Object} data - Expected update configuration data fixture.
     **/
    async verifyUpdatedMiscDetails(data = {}) {
        await test.step('Verify miscellaneous item details in edit form match updated values', async () => {
            await this.waitForVisible(this.miscNameInput, { timeout: 5000 });
            await expect(this.miscNameInput).toHaveValue(this.miscName || data.updatedMiscellaneousName);
            await expect(this.statusDropdown).toContainText('Deleted');
            await expect(this.typeDropdown).toContainText('DVD');
            const actualPrice = await this.priceInput.inputValue();
            expect(parseFloat(actualPrice)).toBe(parseFloat(data.updatedPrice));

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
     * Verifies that the 'Miscellaneous item updated successfully.' notification is displayed.
     **/
    async verifyMiscUpdatedSuccessfully() {
        await test.step('Verify "Miscellaneous item updated successfully." notification', async () => {
            await this.waitForVisible(this.page.getByText('Miscellaneous item updated successfully'));
            await this.verifyVisible(this.page.getByText('Miscellaneous item updated successfully'));
        });
    }
}
