import BasePage from '../../../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Components (Products) Page in Admin Portal.
 * Handles adding new components with dynamic values & random dropdown selections,
 * editing existing components with updated details, searching in a retry loop with status filtering,
 * and verifying component details.
 **/
export default class ComponentsPage extends BasePage {

    /**
     * Initializes locators for Components (Products) Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("xpath=//a[contains(@onclick,'AddNewComponent') and contains(@class,'btn')]");

        // Add / Edit Component Form Locators
        this.componentNameInput = page.getByRole('textbox', { name: 'Component Name' });
        this.itemCodeInput = page.getByRole('textbox', { name: 'Item#/Code' });
        this.statusDropdown = page.locator("xpath=//select[@name='Status']//parent::div//button");
        this.statusDropdownOption = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Active']");
        this.statusDropdownOptionDeleted = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Deleted']");
        this.typeDropdown = page.locator("xpath=//select[@name='Type']//parent::div//button");
        this.typeDropdownOption = page.locator("xpath=//select[@name='Type']//parent::div//div//span[text()='BTW']");
        this.subTypeDropdown = page.locator("xpath=//select[@name='SubType']//parent::div//button");
        this.subTypeDropdownOption = page.locator("xpath=(//select[@name='SubType']//parent::div//div//li[2]//span)[1]")

        this.notesInput = page.locator('#Notes');
        this.priceInput = page.getByRole('textbox', { name: 'Price' });
        this.additionalTaxInput = page.getByRole('textbox', { name: 'Additional Tax' });
        this.itemTaxableCheckbox = page.locator("xpath=//input[@id='ItemIsTaxable']//following-sibling::ins");
        this.currentTaxesDropdown = page.locator("xpath=//button[@data-id='drp_Products_CurrentSatetTaxList']");
        this.totalItemPriceLabel = page.locator('#lbl_Products_TotalItemprice');
        this.totalTaxAmountLabel = page.locator('#lbl_Products_TotalTaxAmount');
        this.currentTaxesDropdownOption = page.locator("xpath=(//button[@data-id='drp_Products_CurrentSatetTaxList']//parent::div//div//li[not(@class='selected')]//span[1][not(text()='Please Select')])[1]");
        this.currentTaxesDropdownOptionLast = page.locator("xpath=(//button[@data-id='drp_Products_CurrentSatetTaxList']//parent::div//div//li[not(@class='selected')]//span[1][not(text()='Please Select')])[last()]");
        this.mtoRequiredCheckbox = page.locator("xpath=//input[@id='MTORequired']//following-sibling::ins");
        this.publicNameInput = page.getByRole('textbox', { name: 'Public Name' });
        this.publicDescriptionInput = page.locator('#PublicDescription');
        this.itemTaxableCheckboxWrapper = page.locator("xpath=//input[@id='ItemIsTaxable']//parent::div");
        this.mtoRequiredCheckboxWrapper = page.locator("xpath=//input[@id='MTORequired']//parent::div");
        this.allowWebPurchaseYesRadioWrapper = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowWebPurchase']//parent::div");
        this.allowWebPurchaseNoRadioWrapper = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowWebPurchase']//parent::div");
        this.allowPortalPurchaseYesRadioWrapper = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowPortalPurchase']//parent::div");
        this.allowPortalPurchaseNoRadioWrapper = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowPortalPurchase']//parent::div");
        this.emailBodyInput = page.locator("xpath=//textarea[@name='EnrollmentEmailContent']//following-sibling::div//div[@class='note-editable']");
        this.allowWebPurchaseYesRadioButton = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowWebPurchase']//following-sibling::ins");
        this.allowWebPurchaseNoRadioButton = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowWebPurchase']//following-sibling::ins");
        this.allowPortalPurchaseYesRadioButton = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowPortalPurchase']//following-sibling::ins");
        this.allowPortalPurchaseNoRadioButton = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowPortalPurchase']//following-sibling::ins");
        this.drivingHoursInput = page.locator('#txt_Component_DrivingHours');
        this.observationHoursInput = page.locator('#txt_Component_ObservationHours');
        this.durationDropdown = page.locator("xpath=//button[@data-id='drp_Component_Duration']");
        this.durationDropdownOption = page.locator("xpath=//li//span[text()='00:15']");
        this.evaluationCheckboxes = page.locator("//div[@id='evalOpt']//input//following-sibling::ins");
        this.evaluationCheckboxesWrapper = page.locator("//div[@id='evalOpt']//input//parent::div");
        this.saveBtn = page.locator("xpath=//span[contains(@class,'ComponentHeader')]//ancestor::div[contains(@class,'modal-content')]//button[contains(text(),'Save')]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        // Status Filter Locators
        this.statusFilterDropdown = page.locator("xpath=//div[@id='serviceTypes']//a[contains(@class,'btn') and contains(.,'Status')]");
        this.selectAllStatusCheckbox = page.locator("xpath=//div[@id='serviceTypes']//input[contains(@class,'chk_Components_SelectAllStatus')]//following-sibling::ins");

        // Components Grid Locators
        this.searchTextbox = page.locator("xpath=//div[@id='ServiceType_filter']//input[@type='search']");
        this.editIcon = page.getByTitle('Edit');
        this.componentsTable = page.locator('#tbl_Products_Components, table.table');
        this.tableRows = page.locator("xpath=//table[contains(@id,'ServiceType') or contains(@class,'dataTable')]//tbody//tr[not(contains(@class,'dataTables_empty'))]");
        this.componentAddedSuccessMsg = page.getByText('Component added successfully');
        this.componentUpdatedSuccessMsg = page.getByText('Component updated successfully');
    }

    /**
     * Clicks the 'Add New' button to open the Add Component form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Fills component creation details with dynamic random values.
     * @param {Object} data - Base component test data.
     * @returns {Promise<Object>} Created component data with generated names and values.
     **/
    async fillComponentDetails(data = {}) {
        await test.step('Fill component details', async () => {
            this.uniqueId = `${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
            this.componentName = `${data.componentPrefix || 'Component'}_${this.uniqueId}`;
            this.itemCode = `${Math.floor(10000000 + Math.random() * 90000000)}`;
            this.price = data.price || `${Math.floor(100 + Math.random() * 900)}`;
            this.additionalTax = data.additionalTax || `${Math.floor(1 + Math.random() * 25)}`;
            this.publicName = `${data.publicNamePrefix || 'Public'}_${this.uniqueId}`;
            this.publicDescription = data.publicDescription || `Public description for ${this.componentName}`;
            this.notes = data.notes || `Notes for ${this.componentName}`;
            this.emailContent = data.emailContent || `Email content for ${this.componentName}`;
            this.drivingHours = data.drivingHours || `${Math.floor(1 + Math.random() * 5)}`;
            this.observationHours = data.observationHours || `${Math.floor(1 + Math.random() * 5)}`;

            await this.waitForLoaders();
            await this.waitForVisible(this.componentNameInput, { timeout: 10000 }).catch(() => { });
            await this.fill(this.componentNameInput, this.componentName);


            if (await this.isVisible(this.itemCodeInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.itemCodeInput, this.itemCode);
            }

            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.statusDropdown);
                await this.waitForVisible(this.statusDropdownOption);
                await this.click(this.statusDropdownOption);
            }

            if (await this.isVisible(this.typeDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.typeDropdown);
                await this.waitForVisible(this.typeDropdownOption);
                await this.click(this.typeDropdownOption);
            }

            if (await this.isVisible(this.subTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.subTypeDropdown);
                await this.waitForVisible(this.subTypeDropdownOption);
                await this.click(this.subTypeDropdownOption);
            }

            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.notesInput, this.notes);
            }

            if (await this.isVisible(this.priceInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.priceInput, this.price);
            }

            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.itemTaxableCheckbox);
                await this.click(this.currentTaxesDropdown);
                await this.waitForVisible(this.currentTaxesDropdownOption);
                await this.click(this.currentTaxesDropdownOption);
                await this.fill(this.additionalTaxInput, this.additionalTax);
            }

            if (await this.isVisible(this.mtoRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.mtoRequiredCheckbox);
            }

            // Public Details
            if (await this.isVisible(this.publicNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.publicNameInput, this.publicName);
            }

            if (await this.isVisible(this.publicDescriptionInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.publicDescriptionInput, this.publicDescription);
            }

            // Email body rich text
            if (await this.isVisible(this.emailBodyInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emailBodyInput, this.emailContent);
            }

            if (await this.isVisible(this.allowWebPurchaseYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.allowWebPurchaseYesRadioButton);
            }

            if (await this.isVisible(this.allowPortalPurchaseNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.allowPortalPurchaseNoRadioButton);
            }

            // Driving & Observation hours
            if (await this.isVisible(this.drivingHoursInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.drivingHoursInput, this.drivingHours);
            }

            if (await this.isVisible(this.observationHoursInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.observationHoursInput, this.observationHours);
            }

            if (await this.isVisible(this.durationDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.durationDropdown);
                await this.waitForVisible(this.durationDropdownOption);
                await this.click(this.durationDropdownOption);
            }

            if (await this.isVisible(this.evaluationCheckboxes.first(), { timeout: 100 }).catch(() => false)) {
                const checkboxesCount = await this.evaluationCheckboxes.count();
                for (let i = 0; i < checkboxesCount; i++) {
                    const input = this.evaluationCheckboxes.nth(i);
                    await this.click(input);
                }
            }
        });
    }

    /**
     * Clicks the Save button to submit the component form.
     **/
    async clickSave() {
        await test.step('Click Save button', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);
            await this.waitForVisible(this.yesConfirmationButton);
            await this.click(this.yesConfirmationButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
        });
    }

    /**
     * Verifies that the 'Component added successfully.' confirmation message is displayed.
     **/
    async verifyComponentAddedSuccessfully() {
        await test.step('Verify "Component added successfully." notification', async () => {
            await this.waitForVisible(this.componentAddedSuccessMsg);
            await this.verifyVisible(this.componentAddedSuccessMsg);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
        });
    }

    /**
     * Locates the created component in the list and clicks its Edit button/link.
     **/
    async searchAndEditComponent(componentName = this.componentName, maxRetries = 5) {
        await test.step(`Search and click Edit for component: "${componentName}"`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForLoadState('load').catch(() => { });
                await this.waitForLoaders();
                await this.waitForVisible(this.searchTextbox);
                await this.fill(this.searchTextbox, '');
                await this.fill(this.searchTextbox, componentName);
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
     * Opens the Status filter dropdown on the Components tab, selects All status, and closes the dropdown.
     **/
    async filterByAllStatus() {
        await test.step('Filter Components by All status', async () => {
            await this.waitForLoaders();
            if (await this.statusFilterDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(this.statusFilterDropdown);
                await this.waitForVisible(this.selectAllStatusCheckbox);
                await this.click(this.selectAllStatusCheckbox);
                // Close the dropdown after selection by clicking on dropdown xpath again
                await this.click(this.statusFilterDropdown);
                await this.waitForLoaders();
                await this.page.waitForTimeout(1000);
            }
        });
    }

    /**
     * Verifies that the component details in the edit form match the values added during creation.
     * @param {Object} data - Expected component configuration data fixture.
     **/
    async verifyComponentDetails(data = {}) {
        await test.step('Verify component details in edit form match added values', async () => {
            await this.waitForVisible(this.componentNameInput, { timeout: 10000 });
            await expect(this.componentNameInput).toHaveValue(this.componentName);


            if (this.itemCode && await this.isVisible(this.itemCodeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.itemCodeInput).toHaveValue(this.itemCode);
            }

            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.statusDropdown).toContainText('Active');
            }

            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.notesInput).toHaveValue(this.notes);
            }

            if (await this.isVisible(this.priceInput, { timeout: 100 }).catch(() => false)) {
                const actualPrice = await this.priceInput.inputValue();
                expect(parseFloat(actualPrice)).toBe(parseFloat(this.price));
            }

            if (await this.isVisible(this.publicNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.publicNameInput).toHaveValue(this.publicName);
            }

            if (await this.isVisible(this.publicDescriptionInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.publicDescriptionInput).toHaveValue(this.publicDescription);
            }

            if (await this.isVisible(this.drivingHoursInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.drivingHoursInput).toHaveValue(this.drivingHours);
            }

            if (await this.isVisible(this.observationHoursInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.observationHoursInput).toHaveValue(this.observationHours);
            }

            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.itemTaxableCheckboxWrapper).toHaveClass(/checked/);
                await expect(this.currentTaxesDropdown).not.toContainText('Please Select');
                const actualAmount = await this.additionalTaxInput.inputValue();
                expect(parseFloat(actualAmount)).toBe(parseFloat(this.additionalTax));
                await expect(this.totalItemPriceLabel).not.toHaveText('$0.00');
                await expect(this.totalTaxAmountLabel).not.toHaveText('$0.00');
            }

            if (await this.isVisible(this.mtoRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.mtoRequiredCheckboxWrapper).toHaveClass(/checked/);

            }

            if (await this.isVisible(this.emailBodyInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emailBodyInput).toContainText(this.emailContent);
            }

            if (await this.isVisible(this.durationDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.durationDropdown).toContainText('00:15');
            }

            if (await this.isVisible(this.evaluationCheckboxes.first(), { timeout: 100 }).catch(() => false)) {
                const checkboxesCount = await this.evaluationCheckboxes.count();
                for (let i = 0; i < checkboxesCount; i++) {
                    const input = this.evaluationCheckboxesWrapper.nth(i);
                    await expect(input).toHaveClass(/checked/);
                }
            }

            if (await this.isVisible(this.allowWebPurchaseYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.allowWebPurchaseYesRadioWrapper.first()).toHaveClass(/checked/);
            }

            if (await this.isVisible(this.allowPortalPurchaseNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.allowPortalPurchaseNoRadioWrapper.first()).toHaveClass(/checked/);
            }


        });
    }

    /**
     * Updates all editable fields on the component edit form.
     * @param {Object} data - Component update data fixture.
     **/
    async editComponentFields(data = {}) {
        await test.step('Update component fields', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.saveBtn);

            // 1. Component Name (if editable)
            if (await this.componentNameInput.isEditable().catch(() => false)) {
                this.componentName = `${data.updatedComponentPrefix || 'Updated_Component'}_${this.uniqueId || Date.now()}`;
                await this.fill(this.componentNameInput, this.componentName);
            }

            // 2. Item Code (if editable)
            if (await this.itemCodeInput.isEditable().catch(() => false)) {
                this.itemCode = `${Math.floor(10000000 + Math.random() * 90000000)}`;
                await this.fill(this.itemCodeInput, this.itemCode);
            }

            // 3. Status - strictly Deleted on update
            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.statusDropdown);
                await this.waitForVisible(this.statusDropdownOptionDeleted);
                await this.click(this.statusDropdownOptionDeleted);
            }

            // 4. Notes
            this.notes = data.updatedNotes || data.editNotes || `Updated notes ${Date.now()}`;
            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.notesInput, this.notes);
            }

            // 5. Price
            this.price = data.updatedPrice || data.editPrice || '250';
            if (await this.isVisible(this.priceInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.priceInput, this.price);
            }

            // 6. Uncheck Taxable Checkbox (if checked)
            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.itemTaxableCheckbox);
            }

            // 7. Uncheck MTO Required Checkbox (if checked)
            if (await this.isVisible(this.mtoRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.mtoRequiredCheckbox);
            }

            // 8. Public Name
            this.publicName = `${data.updatedPublicNamePrefix || 'Updated_Public'}_${this.uniqueId || Date.now()}`;
            if (await this.isVisible(this.publicNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.publicNameInput, this.publicName);
            }

            // 9. Public Description
            this.publicDescription = data.updatedPublicDescription || data.editPublicDescription || `Updated public description ${Date.now()}`;
            if (await this.isVisible(this.publicDescriptionInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.publicDescriptionInput, this.publicDescription);
            }

            // 10. Email Content
            this.emailContent = data.updatedEmailContent || `Updated email content ${Date.now()}`;
            if (await this.isVisible(this.emailBodyInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emailBodyInput, this.emailContent);
            }

            // 11. Radios - select alternate option
            if (await this.isVisible(this.allowWebPurchaseNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.allowWebPurchaseNoRadioButton);
            }
            if (await this.isVisible(this.allowPortalPurchaseYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.allowPortalPurchaseYesRadioButton);
            }

            // 12. Uncheck evaluation Checkboxes
            if (await this.isVisible(this.evaluationCheckboxes.first(), { timeout: 100 }).catch(() => false)) {
                const checkboxesCount = await this.evaluationCheckboxes.count();
                for (let i = 0; i < checkboxesCount; i++) {
                    const input = this.evaluationCheckboxes.nth(i);
                    await this.click(input);
                }
            }
        });
    }



    /**
     * Verifies that the component details in the edit form match updated values.
     * @param {Object} data - Expected update configuration data fixture.
     **/
    async verifyUpdatedComponentDetails(data = {}) {
        await test.step('Verify component details in edit form match updated values', async () => {
            await this.waitForVisible(this.componentNameInput, { timeout: 10000 });

            await expect(this.componentNameInput).toHaveValue(this.componentName);


            if (this.itemCode && await this.isVisible(this.itemCodeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.itemCodeInput).toHaveValue(this.itemCode);
            }

            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.statusDropdown).toContainText('Deleted');
            }

            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.notesInput).toHaveValue(this.notes);
            }

            if (await this.isVisible(this.priceInput, { timeout: 100 }).catch(() => false)) {
                const actualPrice = await this.priceInput.inputValue();
                expect(parseFloat(actualPrice)).toBe(parseFloat(this.price));
            }

            if (await this.isVisible(this.publicNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.publicNameInput).toHaveValue(this.publicName);
            }

            if (await this.isVisible(this.publicDescriptionInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.publicDescriptionInput).toHaveValue(this.publicDescription);
            }

            if (await this.isVisible(this.emailBodyInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.emailBodyInput).toContainText(this.emailContent);
            }

            // Checkboxes unchecked
            if (await this.isVisible(this.itemTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.itemTaxableCheckboxWrapper).not.toHaveClass(/checked/);
                await this.verifyNotVisible(this.currentTaxesDropdown);
                await this.verifyNotVisible(this.additionalTaxInput);
                await this.verifyNotVisible(this.totalItemPriceLabel);
                await this.verifyNotVisible(this.totalTaxAmountLabel);
            }

            if (await this.isVisible(this.mtoRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.mtoRequiredCheckboxWrapper).not.toHaveClass(/checked/);
            }

            if (await this.isVisible(this.evaluationCheckboxes.first(), { timeout: 100 }).catch(() => false)) {
                const checkboxesCount = await this.evaluationCheckboxes.count();
                for (let i = 0; i < checkboxesCount; i++) {
                    const input = this.evaluationCheckboxesWrapper.nth(i);
                    await expect(input).not.toHaveClass(/checked/);
                }
            }


            // Radios alternate selection
            if (await this.isVisible(this.allowWebPurchaseNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.allowWebPurchaseNoRadioWrapper.first()).toHaveClass(/checked/);
                await expect(this.allowWebPurchaseYesRadioWrapper.first()).not.toHaveClass(/checked/);
            }

            if (await this.isVisible(this.allowPortalPurchaseYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.allowPortalPurchaseYesRadioWrapper.first()).toHaveClass(/checked/);
                await expect(this.allowPortalPurchaseNoRadioWrapper.first()).not.toHaveClass(/checked/);
            }

        });
    }

    /**
     * Verifies that the 'Component updated successfully.' message is displayed.
     **/
    async verifyComponentUpdatedSuccessfully() {
        await test.step('Verify component updated confirmation message', async () => {
            await this.waitForVisible(this.componentUpdatedSuccessMsg);
            await this.verifyVisible(this.componentUpdatedSuccessMsg);
        });
    }
}

