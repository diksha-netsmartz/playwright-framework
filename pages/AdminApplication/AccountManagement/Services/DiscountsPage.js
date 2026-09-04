import BasePage from '../../../../utils/BasePage';
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
        this.currentTaxesDropdown = page.locator("xpath=//button[@data-id='drp_Products_CurrentSatetTaxList']");
        this.currentTaxesDropdownOption = page.locator("xpath=(//button[@data-id='drp_Products_CurrentSatetTaxList']//parent::div//div//li[not(@class='selected')]//span[1][not(text()='Please Select')])[1]");
        this.additionalTaxInput = page.getByRole('textbox', { name: 'Additional Tax' });

        this.eligibleServiceSelection = page.locator("xpath=(//li[contains(@attrcolumn,'DiscountPackages')])[1]");
        this.eligibleClassesSelection = page.locator("xpath=(//li[contains(@attrcolumn,'DiscountClasses')])[1]");
        this.eligibleLocationsSelection = page.locator("xpath=(//li[contains(@attrcolumn,'DiscountLocations')])[1]");

        this.discountExpirationTextbox = page.getByRole('textbox', { name: 'MM/DD/YYYY' });
        this.discountExpireDateSelectInCalendar = page.locator("xpath=(//div[contains(@class,'datepicker-days')]//td)[last()]");

        this.notesInput = page.locator('#Notes');

        // Modal Action Buttons
        this.saveBtn = page.locator("xpath=(//div[contains(@id,'Discount')]//button[contains(text(),'Save')])[1]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        // Table Locators
        this.searchTextbox = page.locator("xpath=(//div[contains(@id,'Discounts')]//input[@type='search'])[1]");
        this.editIcon = page.getByTitle('Edit');
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
            const prefix = data.discountName || 'Discount';
            this.discountName = `${prefix}_${Date.now()}`;
            this.discountCode = `${Math.floor(10000 + Math.random() * 90000)}`;
            const additionalTax = data.additionalTax || `${Math.floor(1 + Math.random() * 25)}`;
            const discountAmount = data.discountAmount;
            const feeAmount = data.feeAmount;
            const notes = data.notes;

            await this.waitForLoaders();
            await this.waitForVisible(this.discountNameInput);
            await this.fill(this.discountNameInput, this.discountName);

            await this.waitForVisible(this.discountCodeInput);
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

            await this.waitForVisible(this.eligibleServiceSelection)
            await this.click(this.eligibleServiceSelection)

            await this.click(this.itemTaxableCheckbox);
            await this.click(this.currentTaxesDropdown);
            await this.waitForVisible(this.currentTaxesDropdownOption);
            await this.click(this.currentTaxesDropdownOption);
            await this.fill(this.additionalTaxInput, additionalTax);


            await this.waitForVisible(this.eligibleClassesSelection)
            await this.click(this.eligibleClassesSelection)
            await this.waitForVisible(this.eligibleLocationsSelection)
            await this.click(this.eligibleLocationsSelection)

            await this.waitForVisible(this.discountExpirationTextbox);
            await this.click(this.discountExpirationTextbox);
            await this.waitForVisible(this.discountExpireDateSelectInCalendar);
            await this.click(this.discountExpireDateSelectInCalendar);


            await this.waitForVisible(this.notesInput);
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
    async searchAndEditDiscount(discountName = this.discountName) {
        await test.step(`Search and edit Discount: "${discountName}"`, async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, discountName);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);
            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.click(this.editIcon);
            await this.waitForLoaders();
        });
    }

    /**
     * Modifies the discount fields (Amount, Notes, Status) on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async editDiscountDetails(data = {}) {
        await test.step('Update Discount fields (Amount, Notes, Status)', async () => {
            await this.waitForLoaders();

            const updatedAmount = data.updatedDiscountAmount || '200.00';
            const updatedNotes = data.updatedNotes || `Updated Notes for ${this.discountName}`;


            // Update Discount Amount
            // await this.waitForVisible(this.discountAmountInput);
            // await this.fill(this.discountAmountInput, updatedAmount);

            if (await this.isVisible(this.discountAmountInput, { timeout: 1000 }).catch(() => false)) {
                await this.fill(this.discountAmountInput, updatedAmount);
            }
            else if (await this.isVisible(this.feeAmountInput, { timeout: 1000 }).catch(() => false)) {
                await this.fill(this.feeAmountInput, updatedAmount);
            }


            // Update Status (e.g. Deleted / Active)
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            await this.click(this.statusDropdownOptionDeleted);

            await this.click(this.itemTaxableCheckbox);

            // Update Notes
            await this.waitForVisible(this.notesInput);
            await this.fill(this.notesInput, updatedNotes);

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
