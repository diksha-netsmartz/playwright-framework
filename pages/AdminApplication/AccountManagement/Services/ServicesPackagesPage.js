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
        this.classroomCostHrInput = page.locator('#ClassroomCostHr')

        this.statusDropdown = page.locator("xpath=//select[@name='ServiceStatus']//parent::div//button");
        this.statusOptionActive = page.locator("xpath=//select[@name='ServiceStatus']//parent::div//div//span[text()='Active']");

        this.selectableServiceItem = page.locator("//div[contains(@id,'ServiceItems')]//div[contains(@class,'ms-selectable')]//li");
        this.selectedService = page.locator("//div[contains(@id,'ServiceItems')]//div[contains(@class,'ms-selection')]//li[contains(@class,'ms-selected')]");
        this.selectableLocation = page.locator("//div[contains(@id,'Locations')]//div[contains(@class,'ms-selectable')]//li");
        this.selectedLocation = page.locator("//div[contains(@id,'Locations')]//div[contains(@class,'ms-selection')]//li[contains(@class,'ms-selected')]")
        this.selectableAddOnServices = page.locator("//div[contains(@id,'AddOnServices')]//div[contains(@class,'ms-selectable')]//li");
        this.selectedAddOnServices = page.locator("//div[contains(@id,'AddOnServices')]//div[contains(@class,'ms-selection')]//li[contains(@class,'ms-selected')]")
        this.selectableDiscount = page.locator("//div[contains(@id,'Discount')]//div[contains(@class,'ms-selectable')]//li");
        this.selectedDiscount = page.locator("//div[contains(@id,'Discount')]//div[contains(@class,'ms-selection')]//li[contains(@class,'ms-selected')]")
        this.selectableCDLEndorsement = page.locator("//div[contains(@id,'CDLEndorsement')]//div[contains(@class,'ms-selectable')]//li");
        this.selectedCDLEndorsement = page.locator("//div[contains(@id,'CDLEndorsement')]//div[contains(@class,'ms-selection')]//li[contains(@class,'ms-selected')]")
        this.selectableAddOnServiceAutoSelection = page.locator("//div[contains(@id,'AddOnServiceAutoSelection')]//div[contains(@class,'ms-selectable')]//li");
        this.selectedAddOnServiceAutoSelection = page.locator("//div[contains(@id,'AddOnServiceAutoSelection')]//div[contains(@class,'ms-selection')]//li[contains(@class,'ms-selected')]")



        this.servicePriceTextbox = page.getByRole('textbox', { name: 'Service Price' });

        this.allowPurchaseThroughWebsiteYesRadioButton = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowPurchaseThroughWebsite']//following-sibling::ins");
        this.allowPurchaseThroughWebsiteNoRadioButton = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowPurchaseThroughWebsite']//following-sibling::ins");
        this.allowPurchaseThroughPortalNoRadioButton = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowPurchaseThroughPortal']//following-sibling::ins");
        this.allowPurchaseThroughPortalYesRadioButton = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowPurchaseThroughPortal']//following-sibling::ins")
        this.bypassClassSelectionYesRadioButton = page.locator("//label[contains(text(),'Yes')]//input[@id='BypassClassSelection']//following-sibling::ins")
        this.bypassClassSelectionNoRadioButton = page.locator("//label[contains(text(),'No')]//input[@id='BypassClassSelection']//following-sibling::ins")
        this.CDLRoadTrainingYesRadioButton = page.locator("//label[contains(text(),'Yes')]//input[@id='CDLRoadTraining']//following-sibling::ins")
        this.CDLRoadTrainingNoRadioButton = page.locator("//label[contains(text(),'No')]//input[@id='CDLRoadTraining']//following-sibling::ins")
        this.CDLClassroomNoRadioButton = page.locator("//label[contains(text(),'No')]//input[@id='CDLClassroom']//following-sibling::ins")
        this.CDLClassroomYesRadioButton = page.locator("//label[contains(text(),'Yes')]//input[@id='CDLClassroom']//following-sibling::ins")
        this.serviceForCertificationYesRadioButton = page.locator("//label[contains(text(),'Yes')]//input[@id='ServiceForCertification']//following-sibling::ins")
        this.serviceForCertificationNoRadioButton = page.locator("//label[contains(text(),'No')]//input[@id='ServiceForCertification']//following-sibling::ins")
        this.minAgeToEnrollYearTextbox = page.locator('#txtMinAgeToEnrollYear');
        this.maxAgeToEnrollYearTextbox = page.locator('#txtMaxAgeToEnrollYear');
        this.TPRRequiredCheckbox = page.locator("//input[@id='TPRRequired']//following-sibling::ins");
        this.TPRRequiredCheckboxWrapper = page.locator("//input[@id='TPRRequired']//parent::div");
        this.COCRequiredCheckbox = page.locator("//input[@id='COCRequired']//following-sibling::ins");
        this.COCRequiredCheckboxWrapper = page.locator("//input[@id='COCRequired']//parent::div");
        this.IsTaxableCheckbox = page.locator("//input[@id='IsTaxable']//following-sibling::ins");
        this.IsTaxableCheckboxWrapper = page.locator("//input[@id='IsTaxable']//parent::div");
        this.basePriceInput = page.locator('#BasePrice')
        this.taxInput = page.locator('#Tax')

        this.visibleToStudentTypeDropdown = page.locator("xpath=//select[@name='VisibletoStudentType']//parent::div//button");
        this.visibleToStudentTypeDropdownOptionAll = page.locator("xpath=(//select[@name='VisibletoStudentType']//parent::div//div//span[text()='All'])[1]");
        this.visibleToStudentTypeDropdownOptionTeen = page.locator("xpath=(//select[@name='VisibletoStudentType']//parent::div//div//span[text()='Teen'])[1]");

        this.contractDropdown = page.locator("xpath=//select[contains(@id,'AssociateContract')]//parent::div//button");
        this.contractOptionNoContract = page.locator("xpath=//select[contains(@id,'AssociateContract')]//parent::div//div//span[text()='No Contract Needed']");
        this.contractOptionTeen = page.locator("xpath=//select[contains(@id,'AssociateContract')]//parent::div//div//span[text()='Teen']");

        this.productCategoryDropdown = page.locator("xpath=//select[contains(@id,'ProductCategory')]//parent::div//button");
        this.productCategoryDropdownOptionFirst = page.locator("(//select[@id='ProductCategory']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.productCategoryDropdownOptionLast = page.locator("(//select[@id='ProductCategory']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]");

        this.alternateServiceNameDropdown = page.locator("xpath=//select[contains(@id,'AlternateServiceName')]//parent::div//button");
        this.alternateServiceNameDropdownOptionFirst = page.locator("(//select[@id='AlternateServiceName']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.alternateServiceNameDropdownOptionLast = page.locator("(//select[@id='AlternateServiceName']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]");

        this.programTypeDropdown = page.locator("xpath=//select[contains(@id,'ProgramType')]//parent::div//button");
        this.programTypeDropdownOptionFirst = page.locator("(//select[@id='ProgramType']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.programTypeDropdownOptionLast = page.locator("(//select[@id='ProgramType']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]");

        this.webNameInput = page.locator('#WebName');
        this.webDescriptionTextarea = page.locator("xpath=//textarea[@id='WebDescription']//parent::div//div[@class='note-editable']");
        this.notesTextarea = page.locator("xpath=//textarea[@id='ServiceNotes']//parent::div//div[@class='note-editable']");
        this.emailContentTextarea = page.locator("xpath=//textarea[@id='EnrollmentEmailContent']//parent::div//div[@class='note-editable']");
        this.emailContentTextarea2 = page.locator("//textarea[@id='EnrollmentEmailContent2']//parent::div//div[@class='note-editable']")
        this.additionalInfo1Textarea = page.locator("xpath=//textarea[@id='AdditionalInfo1']//parent::div//div[@class='note-editable']");
        this.additionalInfo2Textarea = page.locator("//textarea[@id='AdditionalInfo2']//parent::div//div[@class='note-editable']")

        this.saveBtn = page.getByRole('link', { name: 'Save' });

        // Grid Locators
        this.searchTextbox = page.locator("input[type='search']").first();
        this.packagesTable = page.locator('#packageslisttable');
        this.editIcon = page.getByTitle('Edit');
        this.deleteIcon = page.getByTitle('Delete');
        this.alertYesButton = page.locator("xpath=//p[text()='Are you sure you want to delete this service ?']//ancestor::div[contains(@class,'modal-content')]//button[text()='Yes']");
        this.serviceDeletedMessage = "Service(Package) deleted successfully.";
        this.statusFilterDropdown = page.locator("xpath=//div[@id='pnlPackagesTAB']//a[contains(.,'Status')]");
        this.selectAllStatusCheckbox = page.locator("xpath=//div[@id='pnlPackagesTAB']//input[contains(@class,'Packages_SelectAllStatus')]//following-sibling::ins");
        this.statusOptionLast = page.locator("xpath=(//select[@name='ServiceStatus']//parent::div//div//li//span[1])[last()]");
        this.backBtn = page.getByRole('link', { name: 'Back' }).or(page.getByRole('link', { name: 'Cancel' }));

        // Radio Wrappers
        this.allowPurchaseThroughWebsiteYesRadioWrapper = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowPurchaseThroughWebsite']//parent::div");
        this.allowPurchaseThroughWebsiteNoRadioWrapper = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowPurchaseThroughWebsite']//parent::div");
        this.allowPurchaseThroughPortalNoRadioWrapper = page.locator("xpath=//label[contains(text(),'No')]//input[@id='AllowPurchaseThroughPortal']//parent::div");
        this.allowPurchaseThroughPortalYesRadioWrapper = page.locator("xpath=//label[contains(text(),'Yes')]//input[@id='AllowPurchaseThroughPortal']//parent::div");
        this.bypassClassSelectionYesRadioWrapper = page.locator("//label[contains(text(),'Yes')]//input[@id='BypassClassSelection']//parent::div");
        this.bypassClassSelectionNoRadioWrapper = page.locator("//label[contains(text(),'No')]//input[@id='BypassClassSelection']//parent::div");
        this.CDLRoadTrainingYesRadioWrapper = page.locator("//label[contains(text(),'Yes')]//input[@id='CDLRoadTraining']//parent::div");
        this.CDLRoadTrainingNoRadioWrapper = page.locator("//label[contains(text(),'No')]//input[@id='CDLRoadTraining']//parent::div");
        this.CDLClassroomNoRadioWrapper = page.locator("//label[contains(text(),'No')]//input[@id='CDLClassroom']//parent::div");
        this.CDLClassroomYesRadioWrapper = page.locator("//label[contains(text(),'Yes')]//input[@id='CDLClassroom']//parent::div");
        this.serviceForCertificationYesRadioWrapper = page.locator("//label[contains(text(),'Yes')]//input[@id='ServiceForCertification']//parent::div");
        this.serviceForCertificationNoRadioWrapper = page.locator("//label[contains(text(),'No')]//input[@id='ServiceForCertification']//parent::div");

        // Stored Values / State
        this.serviceName = '';
        this.serviceCode = '';
        this.webName = '';
        this.webDescription = '';
        this.notes = '';
        this.emailContent = '';
        this.servicePrice = '';
        this.discountPrice = '';
        this.btwCostHr = '';
        this.classroomCostHr = '';
        this.onlineCostPerModule = '';
        this.additionalInfo1 = '';
        this.additionalInfo2 = '';
        this.selectedStatus = '';
        this.selectedProductCategory = '';
        this.selectedAlternateServiceName = '';
        this.selectedProgramType = '';
        this.selectedVisibleToStudentType = '';
        this.selectedContract = '';

        this.updatedServiceName = '';
        this.updatedServiceCode = '';
        this.updatedWebName = '';
        this.updatedWebDescription = '';
        this.updatedNotes = '';
        this.updatedEmailContent = '';
        this.updatedServicePrice = '';
        this.updatedDiscountPrice = '';
        this.updatedBtwCostHr = '';
        this.updatedClassroomCostHr = '';
        this.updatedOnlineCostPerModule = '';
        this.updatedAdditionalInfo1 = '';
        this.updatedAdditionalInfo2 = '';
        this.updatedStatus = '';
        this.updatedProductCategory = '';
        this.updatedAlternateServiceName = '';
        this.updatedProgramType = '';
        this.updatedVisibleToStudentType = '';
        this.updatedContract = '';

        // Selectable Selection State (Boolean constants)
        this.isServiceItemSelected = false;
        this.isLocationSelected = false;
        this.isAddOnServicesSelected = false;
        this.isDiscountSelected = false;
        this.isCDLEndorsementSelected = false;

        this.isServiceItemAdded = false;
        this.isServiceItemRemoved = false;
        this.isLocationAdded = false;
        this.isLocationRemoved = false;
        this.isAddOnServicesAdded = false;
        this.isAddOnServicesRemoved = false;
        this.isDiscountAdded = false;
        this.isDiscountRemoved = false;
        this.isCDLEndorsementAdded = false;
        this.isCDLEndorsementRemoved = false;
        this.isAddOnServiceAutoSelectionAdded = false;
        this.isAddOnServiceAutoSelectionRemoved = false;
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
     * Helper to update a multi-select field: adds one more item if selectable items are available,
     * or removes the selected item if no selectable items remain.
     * @param {import('@playwright/test').Locator} selectableLocator - Locator for available items.
     * @param {import('@playwright/test').Locator} selectedLocator - Locator for selected items.
     * @param {string} addedKey - Property name on `this` to record whether an item was added.
     * @param {string} removedKey - Property name on `this` to record whether an item was removed.
     **/
    async updateSelectableField(selectableLocator, selectedLocator, addedKey, removedKey) {
        const availableItems = selectableLocator.locator(':visible');
        const availableCount = await availableItems.count().catch(() => 0);
        if (availableCount > 0) {
            await this.click(availableItems.first());
            this[addedKey] = true;
            this[removedKey] = false;
        } else {
            const selectedItems = selectedLocator.locator(':visible');
            const selectedCount = await selectedItems.count().catch(() => 0);
            if (selectedCount > 0) {
                await this.click(selectedItems.first());
                this[addedKey] = false;
                this[removedKey] = true;
            } else {
                this[addedKey] = false;
                this[removedKey] = false;
            }
        }
    }

    /**
     * Fills the Service/Package creation form
     * @param {Object} data - Service test data fixture.
     * @returns {Promise<string>} The generated unique service name.
     **/
    async fillServiceDetails(data = {}) {
        return await test.step('Fill service details', async () => {
            const prefix = data.serviceName;
            this.serviceName = `${prefix}_${Date.now()}`;
            const codePrefix = data.serviceCode;
            this.serviceCode = `${codePrefix}_${Math.floor(1000 + Math.random() * 9000)}`.substring(0, 10);

            this.webName = data.webName;
            this.webDescription = data.webDescription;
            this.notes = data.notes;
            this.emailContent = data.emailContent;
            this.servicePrice = data.servicePrice;
            this.discountPrice = data.discountPrice;
            this.btwCostHr = data.btwCostHr;
            this.classroomCostHr = data.classroomCostHr;
            this.onlineCostPerModule = data.onlineCostPerModule;
            this.additionalInfo1 = data.additionalInfo1;
            this.additionalInfo2 = data.additionalInfo2;
            this.basePrice = data.basePrice;
            this.tax = data.tax;
            this.minAge = data.minAge;
            this.maxAge = data.maxAge;

            await this.waitForLoaders();
            await this.waitForVisible(this.serviceNameInput);
            await this.fill(this.serviceNameInput, this.serviceName);

            await this.waitForVisible(this.serviceCodeInput);
            await this.fill(this.serviceCodeInput, this.serviceCode);

            if (await this.isVisible(this.discountPriceInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.discountPriceInput, this.discountPrice);
            }
            if (await this.isVisible(this.btwCostHrInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.btwCostHrInput, this.btwCostHr);
            }
            if (await this.isVisible(this.classroomCostHrInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.classroomCostHrInput, this.classroomCostHr);
            }
            if (await this.isVisible(this.onlineCostPerModuleInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.onlineCostPerModuleInput, this.onlineCostPerModule);
            }

            // Status Dropdown
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusOptionActive);
            const activeStatusText = (await this.statusOptionActive.innerText()).trim();
            this.selectedStatus = activeStatusText;
            await this.click(this.statusOptionActive);

            // Select Service Item / Product if visible
            if (await this.isVisible(this.selectableServiceItem.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.selectableServiceItem.first());
                this.isServiceItemSelected = true;
            } else {
                this.isServiceItemSelected = false;
            }

            // Select Location if visible
            if (await this.isVisible(this.selectableLocation.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.selectableLocation.first());
                this.isLocationSelected = true;
            } else {
                this.isLocationSelected = false;
            }

            // Select Add ON Services if visible
            if (await this.isVisible(this.selectableAddOnServices.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.selectableAddOnServices.first());
                this.isAddOnServicesSelected = true;
            } else {
                this.isAddOnServicesSelected = false;
            }

            // Select Discount if visible
            if (await this.isVisible(this.selectableDiscount.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.selectableDiscount.first());
                this.isDiscountSelected = true;
            } else {
                this.isDiscountSelected = false;
            }

            // Select CDL Endorsement if visible
            if (await this.isVisible(this.selectableCDLEndorsement.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.selectableCDLEndorsement.first());
                this.isCDLEndorsementSelected = true;
            } else {
                this.isCDLEndorsementSelected = false;
            }

            if (await this.isVisible(this.selectableAddOnServiceAutoSelection.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.selectableAddOnServiceAutoSelection.first());
                this.isAddOnServiceAutoSelectionSelected = true;
            } else {
                this.isAddOnServiceAutoSelectionSelected = false;
            }

            if (await this.isVisible(this.IsTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.IsTaxableCheckbox);
                await this.fill(this.basePriceInput, this.basePrice);
                await this.fill(this.taxInput, this.tax);
            }
            else {
                await this.fill(this.servicePriceTextbox, this.servicePrice);
            }

            // Select Purchase through website as Yes
            await this.click(this.allowPurchaseThroughWebsiteYesRadioButton);

            // Select Purchase through portal as No
            await this.click(this.allowPurchaseThroughPortalNoRadioButton);

            if (await this.isVisible(this.bypassClassSelectionYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.bypassClassSelectionYesRadioButton);
            }
            if (await this.isVisible(this.CDLRoadTrainingYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.CDLRoadTrainingYesRadioButton);
            }
            if (await this.isVisible(this.CDLClassroomNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.CDLClassroomNoRadioButton);
            }
            if (await this.isVisible(this.serviceForCertificationYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.serviceForCertificationYesRadioButton);
                await this.fill(this.minAgeToEnrollYearTextbox, this.minAge);
                await this.fill(this.maxAgeToEnrollYearTextbox, this.maxAge);
            }

            // Checkboxes
            if (await this.isVisible(this.TPRRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.TPRRequiredCheckbox);
            }
            if (await this.isVisible(this.COCRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.COCRequiredCheckbox);
            }

            // Dropdowns
            if (await this.isVisible(this.productCategoryDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.productCategoryDropdown);
                await this.waitForVisible(this.productCategoryDropdownOptionFirst);
                const categoryText = (await this.productCategoryDropdownOptionFirst.innerText()).trim();
                this.selectedProductCategory = categoryText;
                await this.click(this.productCategoryDropdownOptionFirst);
            }

            if (await this.isVisible(this.alternateServiceNameDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.alternateServiceNameDropdown);
                await this.waitForVisible(this.alternateServiceNameDropdownOptionFirst);
                const altServiceText = (await this.alternateServiceNameDropdownOptionFirst.innerText()).trim();
                this.selectedAlternateServiceName = altServiceText;
                await this.click(this.alternateServiceNameDropdownOptionFirst);
            }

            if (await this.isVisible(this.programTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.programTypeDropdown);
                await this.waitForVisible(this.programTypeDropdownOptionFirst);
                const progTypeText = (await this.programTypeDropdownOptionFirst.innerText()).trim();
                this.selectedProgramType = progTypeText;
                await this.click(this.programTypeDropdownOptionFirst);
            }

            if (await this.isVisible(this.visibleToStudentTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.visibleToStudentTypeDropdown);
                await this.waitForVisible(this.visibleToStudentTypeDropdownOptionAll);
                const visibleToText = (await this.visibleToStudentTypeDropdownOptionAll.innerText()).trim();
                this.selectedVisibleToStudentType = visibleToText;
                await this.click(this.visibleToStudentTypeDropdownOptionAll);
            }

            if (await this.isVisible(this.contractDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.contractDropdown);
                await this.waitForVisible(this.contractOptionNoContract);
                const contractText = (await this.contractOptionNoContract.innerText()).trim();
                this.selectedContract = contractText;
                await this.click(this.contractOptionNoContract);
            }

            // Fill Web Name
            await this.fill(this.webNameInput, this.webName);

            // Fill Rich Textareas
            await this.fill(this.webDescriptionTextarea, this.webDescription);
            await this.fill(this.notesTextarea, this.notes);
            await this.fill(this.emailContentTextarea, this.emailContent);
            if (await this.isVisible(this.emailContentTextarea2, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emailContentTextarea2, this.emailContent);
            }
            if (await this.isVisible(this.additionalInfo1Textarea, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.additionalInfo1Textarea, this.additionalInfo1);
            }
            if (await this.isVisible(this.additionalInfo2Textarea, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.additionalInfo2Textarea, this.additionalInfo2);
            }
            return this.serviceName;
        });
    }

    /**
     * Verifies that the service details in the edit form match the values added during creation.
     * @param {Object} data - Expected service configuration data fixture.
     **/
    async verifyServiceDetails(data = {}) {
        await test.step('Verify service details in edit form match added values', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.serviceNameInput, { timeout: 5000 });

            // 1. Text Inputs
            await expect(this.serviceNameInput).toHaveValue(this.serviceName);
            await expect(this.serviceCodeInput).toHaveValue(this.serviceCode);

            if (await this.isVisible(this.discountPriceInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.discountPriceInput).toHaveValue(data.discountPrice);
            }
            if (await this.isVisible(this.btwCostHrInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.btwCostHrInput).toHaveValue(data.btwCostHr);
            }
            if (await this.isVisible(this.classroomCostHrInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.classroomCostHrInput).toHaveValue(data.classroomCostHr);
            }
            if (await this.isVisible(this.onlineCostPerModuleInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.onlineCostPerModuleInput).toHaveValue(data.onlineCostPerModule);
            }
            if (await this.isVisible(this.IsTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.IsTaxableCheckboxWrapper).toHaveClass(/checked/);
                await expect(this.basePriceInput).toHaveValue(this.basePrice);
                await expect(this.taxInput).toHaveValue(this.tax);
            }
            await expect(this.servicePriceTextbox).not.toHaveValue('');
            await expect(this.webNameInput).toHaveValue(data.webName);

            // 2. Dropdowns
            await expect(this.statusDropdown).toContainText(this.selectedStatus, { ignoreCase: true });

            if (this.selectedProductCategory && await this.isVisible(this.productCategoryDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.productCategoryDropdown).toContainText(this.selectedProductCategory, { ignoreCase: true });
            }
            if (this.selectedAlternateServiceName && await this.isVisible(this.alternateServiceNameDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.alternateServiceNameDropdown).toContainText(this.selectedAlternateServiceName, { ignoreCase: true });
            }
            if (this.selectedProgramType && await this.isVisible(this.programTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.programTypeDropdown).toContainText(this.selectedProgramType, { ignoreCase: true });
            }
            if (this.selectedVisibleToStudentType && await this.isVisible(this.visibleToStudentTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.visibleToStudentTypeDropdown).toContainText(this.selectedVisibleToStudentType, { ignoreCase: true });
            }
            if (this.selectedContract && await this.isVisible(this.contractDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.contractDropdown).toContainText(this.selectedContract, { ignoreCase: true });
            }


            // 3. Radios & Checkboxes
            if (await this.isVisible(this.allowPurchaseThroughWebsiteYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.allowPurchaseThroughWebsiteYesRadioWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.allowPurchaseThroughPortalNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.allowPurchaseThroughPortalNoRadioWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.bypassClassSelectionYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.bypassClassSelectionYesRadioWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.CDLRoadTrainingYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.CDLRoadTrainingYesRadioWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.CDLClassroomNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.CDLClassroomNoRadioWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.serviceForCertificationYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.serviceForCertificationYesRadioWrapper).toHaveClass(/checked/);
                await expect(this.minAgeToEnrollYearTextbox).toHaveValue(this.minAge);
                await expect(this.maxAgeToEnrollYearTextbox).toHaveValue(this.maxAge);
            }
            if (await this.isVisible(this.TPRRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.TPRRequiredCheckboxWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.COCRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.COCRequiredCheckboxWrapper).toHaveClass(/checked/);
            }

            // 4. Selectables
            if (this.isServiceItemSelected) {
                await this.verifyVisible(this.selectedService.first());
            }
            if (this.isLocationSelected) {
                await this.verifyVisible(this.selectedLocation.first());
            }
            if (this.isAddOnServicesSelected) {
                await this.verifyVisible(this.selectedAddOnServices.first());
            }
            if (this.isDiscountSelected) {
                await this.verifyVisible(this.selectedDiscount.first());
            }
            if (this.isCDLEndorsementSelected) {
                await this.verifyVisible(this.selectedCDLEndorsement.first());
            }
            if (this.isAddOnServiceAutoSelectionSelected) {
                await this.verifyVisible(this.selectedAddOnServiceAutoSelection.first());
            }

            // 5. Rich Textareas
            await expect(this.webDescriptionTextarea).toContainText(data.webDescription);
            await expect(this.notesTextarea).toContainText(data.notes);
            await expect(this.emailContentTextarea).toContainText(data.emailContent);
            if (await this.isVisible(this.emailContentTextarea2, { timeout: 100 }).catch(() => false)) {
                await expect(this.emailContentTextarea2).toContainText(data.emailContent);
            }
            if (await this.isVisible(this.additionalInfo1Textarea, { timeout: 100 }).catch(() => false)) {
                await expect(this.additionalInfo1Textarea).toContainText(data.additionalInfo1);
            }
            if (await this.isVisible(this.additionalInfo2Textarea, { timeout: 100 }).catch(() => false)) {
                await expect(this.additionalInfo2Textarea).toContainText(data.additionalInfo2);
            }
        });
    }

    /**
     * Updates all fields on the Service/Package edit form.
     * @param {Object} data - Updated service test data fixture.
     * @returns {Promise<string>} The updated unique service name.
     **/
    async updateServiceDetails(data = {}) {
        return await test.step('Update service details', async () => {
            const prefix = data.updatedServiceName;
            this.updatedServiceName = `${prefix}_${Date.now()}`;
            this.serviceName = this.updatedServiceName;
            const codePrefix = data.updatedServiceCode;
            this.updatedServiceCode = `${codePrefix}_${Math.floor(1000 + Math.random() * 9000)}`.substring(0, 10);

            this.updatedWebName = data.updatedWebName;
            this.updatedWebDescription = data.updatedWebDescription;
            this.updatedNotes = data.updatedNotes;
            this.updatedEmailContent = data.updatedEmailContent;
            this.updatedServicePrice = data.updatedServicePrice;
            this.updatedDiscountPrice = data.updatedDiscountPrice;
            this.updatedBtwCostHr = data.updatedBtwCostHr;
            this.updatedClassroomCostHr = data.updatedClassroomCostHr;
            this.updatedOnlineCostPerModule = data.updatedOnlineCostPerModule;
            this.updatedAdditionalInfo1 = data.updatedAdditionalInfo1;
            this.updatedAdditionalInfo2 = data.updatedAdditionalInfo2;

            await this.waitForLoaders();

            // 1. Text Inputs
            await this.waitForVisible(this.serviceNameInput);
            await this.fill(this.serviceNameInput, this.updatedServiceName);

            await this.waitForVisible(this.serviceCodeInput);
            await this.fill(this.serviceCodeInput, this.updatedServiceCode);

            if (await this.isVisible(this.discountPriceInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.discountPriceInput, this.updatedDiscountPrice);
            }
            if (await this.isVisible(this.btwCostHrInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.btwCostHrInput, this.updatedBtwCostHr);
            }
            if (await this.isVisible(this.classroomCostHrInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.classroomCostHrInput, this.updatedClassroomCostHr);
            }
            if (await this.isVisible(this.onlineCostPerModuleInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.onlineCostPerModuleInput, this.updatedOnlineCostPerModule);
            }

            if (await this.isVisible(this.IsTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.IsTaxableCheckbox);
            }
            await this.fill(this.servicePriceTextbox, this.updatedServicePrice);
            await this.fill(this.webNameInput, this.updatedWebName);

            // 2. Dropdowns
            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.statusDropdown);
                await this.waitForVisible(this.statusOptionLast);
                const updatedStatusText = (await this.statusOptionLast.innerText()).trim();
                this.updatedStatus = updatedStatusText;
                await this.click(this.statusOptionLast);
            }

            if (await this.isVisible(this.productCategoryDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.productCategoryDropdown);
                await this.waitForVisible(this.productCategoryDropdownOptionLast);
                const updatedCategoryText = (await this.productCategoryDropdownOptionLast.innerText()).trim();
                this.updatedProductCategory = updatedCategoryText;
                await this.click(this.productCategoryDropdownOptionLast);
            }

            if (await this.isVisible(this.alternateServiceNameDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.alternateServiceNameDropdown);
                await this.waitForVisible(this.alternateServiceNameDropdownOptionLast);
                const updatedAltText = (await this.alternateServiceNameDropdownOptionLast.innerText()).trim();
                this.updatedAlternateServiceName = updatedAltText;
                await this.click(this.alternateServiceNameDropdownOptionLast);
            }

            if (await this.isVisible(this.programTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.programTypeDropdown);
                await this.waitForVisible(this.programTypeDropdownOptionLast);
                const updatedProgText = (await this.programTypeDropdownOptionLast.innerText()).trim();
                this.updatedProgramType = updatedProgText;
                await this.click(this.programTypeDropdownOptionLast);
            }

            if (await this.isVisible(this.visibleToStudentTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.visibleToStudentTypeDropdown);
                await this.waitForVisible(this.visibleToStudentTypeDropdownOptionTeen);
                const updatedVisibleText = (await this.visibleToStudentTypeDropdownOptionTeen.innerText()).trim();
                this.updatedVisibleToStudentType = updatedVisibleText;
                await this.click(this.visibleToStudentTypeDropdownOptionTeen);
            }

            if (await this.isVisible(this.contractDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.contractDropdown);
                await this.waitForVisible(this.contractOptionTeen);
                const updatedContractText = (await this.contractOptionTeen.innerText()).trim();
                this.updatedContract = updatedContractText;
                await this.click(this.contractOptionTeen);
            }

            // 3. Radios & Checkboxes (toggle to opposite values)
            await this.click(this.allowPurchaseThroughWebsiteNoRadioButton);
            await this.click(this.allowPurchaseThroughPortalYesRadioButton);

            if (await this.isVisible(this.bypassClassSelectionNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.bypassClassSelectionNoRadioButton);
            }
            if (await this.isVisible(this.CDLRoadTrainingNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.CDLRoadTrainingNoRadioButton);
            }
            if (await this.isVisible(this.CDLClassroomYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.CDLClassroomYesRadioButton);
            }
            if (await this.isVisible(this.serviceForCertificationNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.serviceForCertificationNoRadioButton);
            }

            if (await this.isVisible(this.TPRRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.TPRRequiredCheckbox);
            }
            if (await this.isVisible(this.COCRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.COCRequiredCheckbox);
            }

            // 4. Selectable Fields (add if available, else remove)
            await this.updateSelectableField(this.selectableServiceItem, this.selectedService, 'isServiceItemAdded', 'isServiceItemRemoved');
            await this.updateSelectableField(this.selectableLocation, this.selectedLocation, 'isLocationAdded', 'isLocationRemoved');
            await this.updateSelectableField(this.selectableAddOnServices, this.selectedAddOnServices, 'isAddOnServicesAdded', 'isAddOnServicesRemoved');
            await this.updateSelectableField(this.selectableDiscount, this.selectedDiscount, 'isDiscountAdded', 'isDiscountRemoved');
            await this.updateSelectableField(this.selectableCDLEndorsement, this.selectedCDLEndorsement, 'isCDLEndorsementAdded', 'isCDLEndorsementRemoved');
            await this.updateSelectableField(this.selectableAddOnServiceAutoSelection, this.selectedAddOnServiceAutoSelection, 'isAddOnServiceAutoSelectionAdded', 'isAddOnServiceAutoSelectionRemoved');

            // 5. Rich Textareas
            await this.fill(this.webDescriptionTextarea, this.updatedWebDescription);
            await this.fill(this.notesTextarea, this.updatedNotes);
            await this.fill(this.emailContentTextarea, this.updatedEmailContent);
            if (await this.isVisible(this.emailContentTextarea2, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.emailContentTextarea2, this.updatedEmailContent);
            }
            if (await this.isVisible(this.additionalInfo1Textarea, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.additionalInfo1Textarea, this.updatedAdditionalInfo1);
            }
            if (await this.isVisible(this.additionalInfo2Textarea, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.additionalInfo2Textarea, this.updatedAdditionalInfo2);
            }
            return this.updatedServiceName;
        });
    }

    /**
     * Verifies that the updated service details in the edit form match the updated values.
     * @param {Object} data - Expected updated service configuration data fixture.
     **/
    async verifyUpdatedServiceDetails(data = {}) {
        await test.step('Verify updated service details in edit form', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.serviceNameInput, { timeout: 5000 });

            // 1. Text Inputs
            await expect(this.serviceNameInput).toHaveValue(this.updatedServiceName);
            await expect(this.serviceCodeInput).toHaveValue(this.updatedServiceCode);

            if (await this.isVisible(this.discountPriceInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.discountPriceInput).toHaveValue(data.updatedDiscountPrice);
            }
            if (await this.isVisible(this.btwCostHrInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.btwCostHrInput).toHaveValue(data.updatedBtwCostHr);
            }
            if (await this.isVisible(this.classroomCostHrInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.classroomCostHrInput).toHaveValue(data.updatedClassroomCostHr);
            }
            if (await this.isVisible(this.onlineCostPerModuleInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.onlineCostPerModuleInput).toHaveValue(data.updatedOnlineCostPerModule);
            }


            if (await this.isVisible(this.IsTaxableCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.IsTaxableCheckboxWrapper).not.toHaveClass(/checked/);
                await this.verifyNotVisible(this.basePriceInput);
                await this.verifyNotVisible(this.taxInput);
            }
            await expect(this.servicePriceTextbox).toHaveValue(data.updatedServicePrice);
            await expect(this.webNameInput).toHaveValue(data.updatedWebName);

            // 2. Dropdowns
            if (this.updatedStatus) {
                await expect(this.statusDropdown).toContainText(this.updatedStatus, { ignoreCase: true });
            }
            if (this.updatedProductCategory && await this.isVisible(this.productCategoryDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.productCategoryDropdown).toContainText(this.updatedProductCategory, { ignoreCase: true });
            }
            if (this.updatedAlternateServiceName && await this.isVisible(this.alternateServiceNameDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.alternateServiceNameDropdown).toContainText(this.updatedAlternateServiceName, { ignoreCase: true });
            }
            if (this.updatedProgramType && await this.isVisible(this.programTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.programTypeDropdown).toContainText(this.updatedProgramType, { ignoreCase: true });
            }
            if (this.updatedVisibleToStudentType && await this.isVisible(this.visibleToStudentTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.visibleToStudentTypeDropdown).toContainText(this.updatedVisibleToStudentType, { ignoreCase: true });
            }
            if (this.updatedContract && await this.isVisible(this.contractDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.contractDropdown).toContainText(this.updatedContract, { ignoreCase: true });
            }

            // 3. Radios & Checkboxes
            if (await this.isVisible(this.allowPurchaseThroughWebsiteNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.allowPurchaseThroughWebsiteNoRadioWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.allowPurchaseThroughPortalYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.allowPurchaseThroughPortalYesRadioWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.bypassClassSelectionNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.bypassClassSelectionNoRadioWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.CDLRoadTrainingNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.CDLRoadTrainingNoRadioWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.CDLClassroomYesRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.CDLClassroomYesRadioWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.serviceForCertificationNoRadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.serviceForCertificationNoRadioWrapper).toHaveClass(/checked/);
                await this.verifyNotVisible(this.minAgeToEnrollYearTextbox);
                await this.verifyNotVisible(this.maxAgeToEnrollYearTextbox);
            }
            if (await this.isVisible(this.TPRRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.TPRRequiredCheckboxWrapper).not.toHaveClass(/checked/);
            }
            if (await this.isVisible(this.COCRequiredCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.COCRequiredCheckboxWrapper).not.toHaveClass(/checked/);
            }

            // 4. Selectable Fields
            if (this.isServiceItemAdded) {
                const expectedCount = this.isServiceItemSelected ? 2 : 1;
                await this.verifyVisible(this.selectedService.first());
                await expect(this.selectedService).toHaveCount(expectedCount);
            } else if (this.isServiceItemRemoved) {
                await expect(this.selectedService).toHaveCount(0);
            }

            if (this.isLocationAdded) {
                const expectedCount = this.isLocationSelected ? 2 : 1;
                await this.verifyVisible(this.selectedLocation.first());
                await expect(this.selectedLocation).toHaveCount(expectedCount);
            } else if (this.isLocationRemoved) {
                await expect(this.selectedLocation).toHaveCount(0);
            }

            if (this.isAddOnServicesAdded) {
                const expectedCount = this.isAddOnServicesSelected ? 2 : 1;
                await this.verifyVisible(this.selectedAddOnServices.first());
                await expect(this.selectedAddOnServices).toHaveCount(expectedCount);
            } else if (this.isAddOnServicesRemoved) {
                await expect(this.selectedAddOnServices).toHaveCount(0);
            }

            if (this.isDiscountAdded) {
                const expectedCount = this.isDiscountSelected ? 2 : 1;
                await this.verifyVisible(this.selectedDiscount.first());
                await expect(this.selectedDiscount).toHaveCount(expectedCount);
            } else if (this.isDiscountRemoved) {
                await expect(this.selectedDiscount).toHaveCount(0);
            }

            if (this.isCDLEndorsementAdded) {
                const expectedCount = this.isCDLEndorsementSelected ? 2 : 1;
                await this.verifyVisible(this.selectedCDLEndorsement.first());
                await expect(this.selectedCDLEndorsement).toHaveCount(expectedCount);
            } else if (this.isCDLEndorsementRemoved) {
                await expect(this.selectedCDLEndorsement).toHaveCount(0);
            }
            if (this.isAddOnServiceAutoSelectionAdded) {
                const expectedCount = this.isAddOnServiceAutoSelectionSelected ? 2 : 1;
                await this.verifyVisible(this.selectedAddOnServiceAutoSelection.first());
                await expect(this.selectedAddOnServiceAutoSelection).toHaveCount(expectedCount);
            } else if (this.isAddOnServiceAutoSelectionRemoved) {
                await expect(this.selectedAddOnServiceAutoSelection).toHaveCount(0);
            }

            // 5. Rich Textareas
            await expect(this.webDescriptionTextarea).toContainText(data.updatedWebDescription);
            await expect(this.notesTextarea).toContainText(data.updatedNotes);
            await expect(this.emailContentTextarea).toContainText(data.updatedEmailContent);
            if (await this.isVisible(this.emailContentTextarea2, { timeout: 100 }).catch(() => false)) {
                await expect(this.emailContentTextarea2).toContainText(data.updatedEmailContent);
            }
            if (await this.isVisible(this.additionalInfo1Textarea, { timeout: 100 }).catch(() => false)) {
                await expect(this.additionalInfo1Textarea).toContainText(data.updatedAdditionalInfo1);
            }
            if (await this.isVisible(this.additionalInfo2Textarea, { timeout: 100 }).catch(() => false)) {
                await expect(this.additionalInfo2Textarea).toContainText(data.updatedAdditionalInfo2);
            }
        });
    }

    /**
     * Clicks the Back button to return to the packages list grid.
     **/
    async clickBack() {
        await test.step('Click Back button', async () => {
            await this.waitForVisible(this.backBtn);
            await this.click(this.backBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Clicks the Save button to save the service and verifies success message.
     **/
    async clickSaveAndVerifySuccessMessage() {
        await test.step('Click Save button and verify success message', async () => {
            await this.waitForVisible(this.saveBtn);

            const toastPromise = this.page.evaluate(() => new Promise((resolve) => {
                const text = 'Service (Package) information updated successfully.';
                const hasMessage = () => (document.body && document.body.innerText || '').includes(text);

                if (hasMessage()) return resolve(true);

                const observer = new MutationObserver(() => {
                    if (hasMessage()) {
                        observer.disconnect();
                        resolve(true);
                    }
                });

                observer.observe(document.body, { childList: true, subtree: true, characterData: true });
                setTimeout(() => { observer.disconnect(); resolve(false); }, 10000);
            }));

            await this.click(this.saveBtn);
            const toastAppeared = await toastPromise;
            expect(toastAppeared, 'Expected "Service (Package) information updated successfully." message to appear').toBeTruthy();

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
            const deleteMsg = this.page.getByText(this.serviceDeletedMessage);
            await this.waitForVisible(deleteMsg);
            await this.verifyVisible(deleteMsg);
        });
    }

    /**
    * Searches for the location in a retry loop up to maxRetries times, reloading and filtering by All status if needed.
    * @param {string} [serviceName=this.serviceName] - Location name to search and edit.
    * @param {number} [maxRetries=5] - Maximum retry attempts.
    **/
    async searchAndEditServicePackage(serviceName = this.serviceName, maxRetries = 5) {
        await test.step(`Search and edit Service Package: "${serviceName}"`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForLoadState('load').catch(() => { });
                await this.waitForLoaders();
                await this.waitForVisible(this.searchTextbox);
                await this.fill(this.searchTextbox, '');
                await this.fill(this.searchTextbox, serviceName);
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
 * Opens the Status filter dropdown on the Packages tab, selects All status, and closes the dropdown.
 **/
    async filterByAllStatus() {
        await test.step('Filter Packages by All status', async () => {
            await this.waitForLoaders();
            if (await this.statusFilterDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(this.statusFilterDropdown);
                await this.waitForVisible(this.selectAllStatusCheckbox.first());
                await this.click(this.selectAllStatusCheckbox.first(), { force: true });
                await this.click(this.statusFilterDropdown);
                await this.waitForLoaders();
                await this.page.waitForTimeout(1000);
            }
        });
    }
}
