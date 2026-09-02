import BasePage from '../../../../utils/BasePage';
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

        // Modal Action Buttons
        this.saveBtn = page.locator("xpath=//div[contains(@id,'Miscellaneous')]//button[contains(text(),'Save')]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

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
            const prefix = data.miscName || 'MiscItem';
            this.miscName = `${prefix}_${Date.now()}`;
            const price = data.price || '100.00';

            await this.waitForLoaders();
            await this.waitForVisible(this.miscNameInput);
            await this.fill(this.miscNameInput, this.miscName);

            // Select Type as Apparel
            await this.click(this.typeDropdown);
            await this.waitForVisible(this.typeOptionApparel);
            await this.click(this.typeOptionApparel);


            // Select Status to Active
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionActive);
            await this.click(this.statusDropdownOptionActive);

            // Fill Price
            await this.waitForVisible(this.priceInput);
            await this.fill(this.priceInput, price);

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
    async searchAndEditMisc(miscName = this.miscName) {
        await test.step(`Search and edit Miscellaneous item: "${miscName}"`, async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, miscName);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);
            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.click(this.editIcon);
            await this.waitForLoaders();
        });
    }

    /**
     * Modifies the miscellaneous fields (Category, Status, Price) on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async editMiscDetails(data = {}) {
        await test.step('Update Miscellaneous fields (Category, Status, Price)', async () => {
            await this.waitForLoaders();

            const updatedPrice = data.updatedPrice || '150.00';

            // Update Category to DVD
            await this.waitForVisible(this.typeDropdown);
            await this.click(this.typeDropdown);
            await this.waitForVisible(this.typeOptionDVD);
            await this.click(this.typeOptionDVD);

            // Update Status to Deleted
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            await this.click(this.statusDropdownOptionDeleted);

            // Update Price
            await this.waitForVisible(this.priceInput);
            await this.fill(this.priceInput, updatedPrice);
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
