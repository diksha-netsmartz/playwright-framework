import BasePage from '../../../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Components (Products) Page in Admin Portal.
 * Handles adding new components with dynamic values & random dropdown selections,
 * editing existing components with random updates, and verifying success notifications.
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
        this.subTypeDropdownOption2 = page.locator("xpath=(//select[@name='SubType']//parent::div//div//li[last()]//span)[1]")

        this.notesInput = page.locator('#Notes');
        this.priceInput = page.getByRole('textbox', { name: 'Price' });
        this.additionalTaxInput = page.getByRole('textbox', { name: 'Additional Tax' });
        this.itemTaxableCheckbox = page.locator("xpath=//input[@id='ItemIsTaxable']//following-sibling::ins");
        this.currentTaxesDropdown = page.locator("xpath=//button[@data-id='drp_Products_CurrentSatetTaxList']");
        this.currentTaxesDropdownOption = page.locator("xpath=(//button[@data-id='drp_Products_CurrentSatetTaxList']//parent::div//div//li[not(@class='selected')]//span[1][not(text()='Please Select')])[1]");
        this.mtoRequiredCheckbox = page.locator("xpath=//input[@id='MTORequired']//following-sibling::ins");
        this.publicNameInput = page.getByRole('textbox', { name: 'Public Name' });
        this.publicDescriptionInput = page.locator('#PublicDescription');
        this.emailBodyInput = page.locator("xpath=//textarea[@name='EnrollmentEmailContent']//following-sibling::div//div[@class='note-editable']");
        this.allowWebPurchaseYesRadioButton = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowWebPurchase']//following-sibling::ins");
        this.allowPortalPurchaseNoRadioButton = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowPortalPurchase']//following-sibling::ins");
        this.drivingHoursInput = page.locator('#txt_Component_DrivingHours');
        this.observationHoursInput = page.locator('#txt_Component_ObservationHours');
        this.durationDropdown = page.locator("xpath=//button[@data-id='drp_Component_Duration']");
        this.durationDropdownOption = page.locator("xpath=//li//span[text()='00:15']");
        this.inCarLessonCheckbox = page.locator("xpath=(//div[@id='evalOpt']//input//following-sibling::ins)[1]");
        this.saveBtn = page.locator("xpath=//span[contains(@class,'ComponentHeader')]//ancestor::div[contains(@class,'modal-content')]//button[contains(text(),'Save')]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        this.searchTextbox = page.locator("xpath=//div[@id='ServiceType_filter']//input[@type='search']");
        this.editIcon = page.getByTitle('Edit');

        // Components Grid Locators
        this.componentsTable = page.locator('#tbl_Products_Components, table.table');
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
            const itemCode = `${Math.floor(10000000 + Math.random() * 90000000)}`;
            const price = data.price || `${Math.floor(100 + Math.random() * 900)}`;
            const additionalTax = data.additionalTax || `${Math.floor(1 + Math.random() * 25)}`;
            const publicName = `${data.publicNamePrefix || 'Public'}_${this.uniqueId}`;
            const publicDescription = data.publicDescription || `Public description for ${this.componentName}`;
            const notes = data.notes || `Notes for ${this.componentName}`;
            const emailContent = data.emailContent || `Email content for ${this.componentName}`;
            const drivingHours = data.drivingHours || `${Math.floor(1 + Math.random() * 5)}`;
            const observationHours = data.observationHours || `${Math.floor(1 + Math.random() * 5)}`;

            await this.waitForLoaders();
            await this.waitForVisible(this.componentNameInput);
            await this.fill(this.componentNameInput, this.componentName);

            await this.waitForVisible(this.itemCodeInput);
            await this.fill(this.itemCodeInput, itemCode);

            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOption);
            await this.click(this.statusDropdownOption);

            await this.click(this.typeDropdown);
            await this.waitForVisible(this.typeDropdownOption);
            await this.click(this.typeDropdownOption);

            await this.click(this.subTypeDropdown);
            await this.waitForVisible(this.subTypeDropdownOption);
            await this.click(this.subTypeDropdownOption);

            await this.fill(this.notesInput, notes);

            await this.fill(this.priceInput, price);

            await this.click(this.itemTaxableCheckbox);
            await this.click(this.currentTaxesDropdown);
            await this.waitForVisible(this.currentTaxesDropdownOption);
            await this.click(this.currentTaxesDropdownOption);

            await this.fill(this.additionalTaxInput, additionalTax);

            await this.click(this.mtoRequiredCheckbox);


            // Public Details
            await this.fill(this.publicNameInput, publicName);

            await this.fill(this.publicDescriptionInput, publicDescription);


            // Email body rich text
            await this.fill(this.emailBodyInput, emailContent);

            await this.click(this.allowWebPurchaseYesRadioButton);
            await this.click(this.allowPortalPurchaseNoRadioButton);

            // Driving & Observation hours
            await this.fill(this.drivingHoursInput, drivingHours);

            await this.fill(this.observationHoursInput, observationHours);

            await this.click(this.durationDropdown);
            await this.waitForVisible(this.durationDropdownOption);
            await this.click(this.durationDropdownOption);

            await this.click(this.inCarLessonCheckbox);

            // await this.page.pause();

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
            await this.click(this.yesConfirmationButton)
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the 'Component added successfully.' confirmation message is displayed.
     **/
    async verifyComponentAddedSuccessfully() {
        await test.step('Verify "Component added successfully." notification', async () => {
            await this.waitForVisible(this.page.getByText('Component added successfully'));
            await this.verifyVisible(this.page.getByText('Component added successfully'));
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 })
        });
    }

    /**
     * Locates the created component in the list and clicks its Edit button/link.
     **/
    async searchAndEditComponent() {
        await test.step(`Search and click Edit for component: "${this.componentName}"`, async () => {
            await this.waitForLoaders();
            await this.page.waitForTimeout(8000);
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, this.componentName);
            await this.page.waitForTimeout(2000);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.click(this.editIcon);

            await this.waitForLoaders();
        });
    }

    /**
     * Randomly updates multiple editable fields on the component edit form.
     * @returns {Promise<Object>} The updated values.
     **/
    async editComponentFields() {
        await test.step('Update component fields', async () => {
            await this.waitForLoaders();
            const timestamp = Date.now();

            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            await this.click(this.statusDropdownOptionDeleted);

            await this.click(this.subTypeDropdown);
            await this.waitForVisible(this.subTypeDropdownOption);
            await this.click(this.subTypeDropdownOption2);

            const newNotes = `Updated notes ${timestamp}`;
            await this.fill(this.notesInput, newNotes);

            await this.click(this.inCarLessonCheckbox);

            // await this.page.pause();

        });
    }

    /**
     * Verifies that the 'Component updated successfully.' message is displayed.
     **/
    async verifyComponentUpdatedSuccessfully() {
        await test.step('Verify component updated confirmation message', async () => {
            await this.waitForVisible(this.page.getByText('Component updated successfully'));
            await this.verifyVisible(this.page.getByText('Component updated successfully'));
        });
    }
}
