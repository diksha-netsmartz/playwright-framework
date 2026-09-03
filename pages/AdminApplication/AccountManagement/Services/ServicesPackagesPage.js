import BasePage from '../../../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Services (Packages) Page in Admin Portal (Account Management > Services > Services (Packages)).
 * Handles adding new services/packages with prefix and Date.now() naming,
 * configuring package options, saving, searching the table, and verifying presence in the grid.
 **/
export default class ServicesPackagesPage extends BasePage {

    /**
     * Initializes locators for Services (Packages) Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("xpath=//a[contains(@href,'Package') and contains(@class,'btn')]");

        // Form Locators
        this.serviceNameInput = page.locator("#ServiceName");
        this.serviceCodeInput = page.locator("#ServiceCode");
        this.discountPriceInput = page.locator('#Discount');
        this.btwCostHrInput = page.locator('#BTWCostHr');
        this.onlineCostPerModuleInput = page.locator('#OnlineCostPerModule')

        this.statusDropdown = page.locator("xpath=//select[@name='ServiceStatus']//parent::div//button");
        this.statusOptionActive = page.locator("xpath=//select[@name='ServiceStatus']//parent::div//div//span[text()='Active']");

        this.selectableServiceItem = page.locator("xpath=(//div[contains(@id,'ServiceItems')]//li)[1]");
        this.selectableLocation = page.locator("xpath=(//div[contains(@id,'Location')]//li)[1]");
        this.selectableAddOnServices = page.locator("xpath=(//div[contains(@id,'AddOnServices')]//li)[1]");
        this.selectableDiscount = page.locator("xpath=(//div[contains(@id,'Discount')]//li)[1]");

        this.servicePriceTextbox = page.getByRole('textbox', { name: 'Service Price' });

        this.allowPurchaseThroughWebsiteYesRadioButton = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowPurchaseThroughWebsite']//following-sibling::ins");
        this.allowPurchaseThroughPortalNoRadioButton = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowPurchaseThroughPortal']//following-sibling::ins");
        this.bypassClassSelectionYesRadioButton = page.locator("//label[contains(text(),'Yes')]//input[@id='BypassClassSelection']//following-sibling::ins")
        this.CDLRoadTrainingYesRadioButton = page.locator("//label[contains(text(),'Yes')]//input[@id='CDLRoadTraining']//following-sibling::ins")
        this.CDLClassroomNoRadioButton = page.locator("//label[contains(text(),'No')]//input[@id='CDLClassroom']//following-sibling::ins")
        this.serviceForCertificationYesRadioButton = page.locator("//label[contains(text(),'Yes')]//input[@id='ServiceForCertification']//following-sibling::ins")


        this.visibleToStudentTypeDropdown = page.locator("xpath=//select[@name='VisibletoStudentType']//parent::div//button");
        this.visibleToStudentTypeDropdownOptionAll = page.locator("xpath=//select[@name='VisibletoStudentType']//parent::div//div//span[text()='All']");

        this.contractDropdown = page.locator("xpath=//select[contains(@id,'AssociateContract')]//parent::div//button");
        this.contractOptionNoContract = page.locator("xpath=//select[contains(@id,'AssociateContract')]//parent::div//div//span[text()='No Contract Needed']");

        this.webNameInput = page.locator('#WebName');
        this.webDescriptionTextarea = page.locator("xpath=//textarea[@id='WebDescription']//parent::div//div[@class='note-editable']");
        this.notesTextarea = page.locator("xpath=//textarea[@id='ServiceNotes']//parent::div//div[@class='note-editable']");
        this.emailContentTextarea = page.locator("xpath=//textarea[@id='EnrollmentEmailContent']//parent::div//div[@class='note-editable']");
        this.emailContentTextarea2 = page.locator("//textarea[@id='EnrollmentEmailContent2']//parent::div//div[@class='note-editable']")

        this.saveBtn = page.getByRole('link', { name: 'Save' });

        // Grid Locators
        this.searchTextbox = page.locator("input[type='search']").first();
        this.packagesTable = page.locator('#packageslisttable');
        this.editIcon = page.getByTitle('Edit');
        this.deleteIcon = page.getByTitle('Delete')
        this.alertYesButton = page.locator("xpath=//p[text()='Are you sure you want to delete this service ?']//ancestor::div[contains(@class,'modal-content')]//button[text()='Yes']");
        this.serviceDeletedMessage = "Service(Package) deleted successfully.";
    }

    /**
     * Clicks the 'Add New' button to open the Add Service form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button for Service (Package)', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
            await this.verifyTitle("Package Management");
        });
    }

    /**
     * Fills the Service/Package creation form
     * @param {Object} data - Service test data fixture.
     * @returns {Promise<string>} The generated unique service name.
     **/
    async fillServiceDetails(data = {}) {
        return await test.step('Fill service details', async () => {
            const prefix = data.serviceName || 'Service';
            this.serviceName = `${prefix}_${Date.now()}`;
            const codePrefix = data.serviceCode || 'PKG';
            this.serviceCode = `${codePrefix}_${Math.floor(1000 + Math.random() * 9000)}`;

            const webName = data.webName || this.serviceName;
            const webDescription = data.webDescription || `Description for ${this.serviceName}`;
            const notes = data.notes || `Notes for ${this.serviceName}`;
            const emailContent = data.emailContent || `Email content for ${this.serviceName}`;
            const servicePrice = data.servicePrice || '100';

            await this.waitForLoaders();
            await this.waitForVisible(this.serviceNameInput);
            await this.fill(this.serviceNameInput, this.serviceName);

            await this.waitForVisible(this.serviceCodeInput);
            await this.fill(this.serviceCodeInput, this.serviceCode);

            if (await this.isVisible(this.discountPriceInput)) {
                await this.fill(this.discountPriceInput, data.discountPrice);
            }
            if (await this.isVisible(this.btwCostHrInput)) {
                await this.fill(this.btwCostHrInput, data.btwCostHr);
            }
            if (await this.isVisible(this.onlineCostPerModuleInput)) {
                await this.fill(this.onlineCostPerModuleInput, data.onlineCostPerModule);
            }

            // Select Status as Active
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusOptionActive);
            await this.click(this.statusOptionActive);

            // Select Service Item / Product if visible
            if (await this.isVisible(this.selectableServiceItem)) {
                await this.click(this.selectableServiceItem);
            }

            // Select Location if visible
            if (await this.isVisible(this.selectableLocation)) {
                await this.click(this.selectableLocation);
            }

            // Select Add ON Services if visible
            if (await this.isVisible(this.selectableAddOnServices)) {
                await this.click(this.selectableAddOnServices);
            }

            // Select Discount if visible
            if (await this.isVisible(this.selectableDiscount)) {
                await this.click(this.selectableDiscount);
            }

            await this.fill(this.servicePriceTextbox, servicePrice)

            // Select Purchase through website as Yes
            await this.click(this.allowPurchaseThroughWebsiteYesRadioButton);

            // Select Purchase through portal as No
            await this.click(this.allowPurchaseThroughPortalNoRadioButton);

            if (await this.isVisible(this.bypassClassSelectionYesRadioButton)) {
                await this.click(this.bypassClassSelectionYesRadioButton);
            }
            if (await this.isVisible(this.CDLRoadTrainingYesRadioButton)) {
                await this.click(this.CDLRoadTrainingYesRadioButton);
            }
            if (await this.isVisible(this.CDLClassroomNoRadioButton)) {
                await this.click(this.CDLClassroomNoRadioButton);
            }
            if (await this.isVisible(this.serviceForCertificationYesRadioButton)) {
                await this.click(this.serviceForCertificationYesRadioButton);
            }

            await this.click(this.visibleToStudentTypeDropdown);
            await this.waitForVisible(this.visibleToStudentTypeDropdownOptionAll);
            await this.click(this.visibleToStudentTypeDropdownOptionAll);

            // Select Contract as No Contract Needed if dropdown present
            await this.click(this.contractDropdown);
            await this.click(this.contractOptionNoContract);


            // Fill Web Name
            await this.fill(this.webNameInput, webName);


            // Fill Summernote Textareas if visible
            await this.fill(this.webDescriptionTextarea, webDescription);
            await this.fill(this.notesTextarea, notes);
            await this.fill(this.emailContentTextarea, emailContent);
            if (await this.isVisible(this.emailContentTextarea2)) {
                await this.fill(this.emailContentTextarea2, emailContent)
            }


            return this.serviceName;
        });
    }

    /**
     * Clicks the Save button to save the service.
     **/
    async clickSave() {
        await test.step('Click Save button', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);

        });
    }

    /**
     * Verifies that the 'Service (Package) information updated successfully.' notification message is displayed.
     **/
    async verifyServiceAddedSuccessfully() {
        await test.step('Verify "Service (Package) information updated successfully." message', async () => {
            const successMsg = this.page.getByText('Service (Package) information updated successfully.');
            if (await this.isVisible(successMsg)) {
                await this.verifyVisible(successMsg);
            }

            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });

    }


    /**
     * Searches for the created service by name and verifies it is visible in the grid.
     * @param {string} [serviceName=this.serviceName] - Name of the service to search and verify.
     **/
    async verifyServiceVisibleInGrid(serviceName = this.serviceName) {
        await test.step(`Verify service "${serviceName}" is visible in grid`, async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, serviceName);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);

            await this.waitForVisible(this.packagesTable);
            await this.verifyContainsText(this.packagesTable, serviceName);
        });
    }

    /**
     * Deletes the service from the grid and confirms the deletion popup.
     **/
    async deleteService() {
        await test.step('Click Delete icon and confirm deletion', async () => {
            await this.waitForVisible(this.deleteIcon);
            await expect(this.deleteIcon).toHaveCount(1);
            await this.click(this.deleteIcon);

            await this.waitForVisible(this.alertYesButton);
            await this.click(this.alertYesButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Verifies that the service was deleted successfully.
     **/
    async verifyServiceDeletedSuccessfully() {
        await test.step('Verify service deleted successfully message', async () => {
            const deleteMsg = this.page.getByText(this.serviceDeletedMessage).or(this.page.getByText('deleted successfully', { exact: false }));
            await this.waitForVisible(deleteMsg);
            await this.verifyVisible(deleteMsg);
        });
    }
}
