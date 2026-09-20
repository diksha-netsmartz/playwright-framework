import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Locations Page in Admin Portal.
 * Handles adding new locations with pickup/dropoff points,
 * editing existing locations, and verifying success notifications.
 **/
export default class LocationsPage extends BasePage {

    /**
     * Initializes locators for the Locations Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("#aAddNewStaff");

        // Basic Information Form Locators
        this.locationNameInput = page.getByRole('textbox', { name: 'Location Name' });
        this.locationCodeInput = page.getByRole('textbox', { name: 'Location Code' });
        this.statusDropdown = page.locator("xpath=//select[@name='LocationStatus']//parent::div//button");
        this.statusDropdownOptionActive = page.locator("xpath=//select[@name='LocationStatus']//parent::div//div//span[text()='Active']");
        this.statusDropdownOptionDeleted = page.locator("xpath=//select[@name='LocationStatus']//parent::div//div//span[text()='Deleted']");

        this.locationType1RadioButton = page.locator("xpath=(//input[@id='LocationType']//following-sibling::ins)[1]");
        this.locationType2RadioButton = page.locator("xpath=(//input[@id='LocationType']//following-sibling::ins)[last()]");
        this.locationType1RadioWrapper = page.locator("xpath=(//input[@id='LocationType']//parent::div)[1]");
        this.locationType2RadioWrapper = page.locator("xpath=(//input[@id='LocationType']//parent::div)[last()]");

        this.travelTime1RadioButton = page.locator("(//input[@id='TravelTime']//following-sibling::ins)[1]")
        this.travelTime2RadioButton = page.locator("(//input[@id='TravelTime']//following-sibling::ins)[last()]")
        this.travelTime1RadioWrapper = page.locator("(//input[@id='TravelTime']//parent::div)[1]")
        this.travelTime2RadioWrapper = page.locator("(//input[@id='TravelTime']//parent::div)[last()]")

        // License Number
        this.licenseNumberInput = page.getByRole('textbox', { name: 'Location License Number' });

        // Address, State, and Tax Information
        this.addressInput = page.getByRole('textbox', { name: 'Address' });
        this.cityInput = page.getByRole('textbox', { name: 'City' });
        this.stateDropdown = page.locator("xpath=//select[@name='State']//parent::div//button");
        this.stateOption = page.locator("(//select[@id='State']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.stateOptionLast = page.locator("(//select[@id='State']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]");
        this.zipInput = page.getByRole('textbox', { name: 'Zip' });
        this.countyInput = page.locator('#County');
        this.localTaxCodeDropdown = page.locator("xpath=//select[@name='LocalTaxCode']//parent::div//button");
        this.localTaxCodeDropdownOption = page.locator("(//select[@id='LocalTaxCode']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.localTaxCodeDropdownOptionLast = page.locator("(//select[@id='LocalTaxCode']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[last()]");

        // Contact and Distance
        this.mainPhoneInput = page.locator("#PhoneMain");
        this.faxInput = page.locator('#Fax');
        this.locationManagerInput = page.locator('#LocationManager');
        this.zoomMailInput = page.locator('#ZoomEmail');
        this.providerLocationIdInput = page.locator('#ProviderLocationId');
        this.distanceCoverageInput = page.locator('#DistanceCoverage');

        // Multi-Select Area Coverage
        this.areaCoverageSelectableItem = page.locator("//li[contains(@attrcolumn,'Coverage') and @class='control ms-elem-selectable']");
        this.areaCoverageSelectedItem = page.locator("//li[contains(@attrcolumn,'Coverage') and @class='control ms-elem-selection ms-selected']");

        // Pickup Location Modal & Dropdown
        this.addPickupLocationBtn = page.locator("xpath=//a[contains(@onclick,'AddPickUp')]");
        this.addPickupLocationInput = page.locator('#pickLocation').getByRole('textbox', { name: 'Add Location' });
        this.savePickupLocationBtn = page.locator('#pickLocation').getByRole('button', { name: 'Save' });
        this.closePickupLocationBtn = page.locator('#pickLocation').getByRole('button', { name: 'Close' });
        this.selectPickupDropdown = page.locator('#div_str_pickuploc').getByRole('button', { name: 'Select' });
        this.pickupDropdownOption = page.locator("//ul[@id='ddlPickupOption']//a").first();

        // Dropoff Location Modal & Dropdown
        this.addDropoffLocationBtn = page.locator("xpath=//a[contains(@onclick,'AddDropOff')]");
        this.addDropoffLocationInput = page.locator('#dropLocation').getByRole('textbox', { name: 'Add Location' });
        this.saveDropoffLocationBtn = page.locator('#dropLocation').getByRole('button', { name: 'Save' });
        this.closeDropoffLocationBtn = page.locator('#dropLocation').getByRole('button', { name: 'Close' });
        this.selectDropoffDropdown = page.locator('#div_str_dropoffloc').getByRole('button', { name: 'Select' });
        this.dropoffDropdownOption = page.locator("//ul[@id='ddlDropoffOption']//a").first();;

        // Appointment Color
        this.appointmentColorCheckbox = page.locator("xpath=(//input[@id='AppointmentColor']//following-sibling::ins)[1]");
        this.appointmentColorCheckboxWrapper = page.locator("xpath=(//input[@id='AppointmentColor']//parent::div)[1]");
        this.appointmentColorButton = page.locator("//button[@class='btn default colorpick']//i");
        this.appointmentColorSelector = page.locator('div.colorpicker-saturation:visible');
        this.appointmentColorTextbox = page.locator('#ColorPicker');

        // Notes and Survey
        this.notesInput = page.locator("xpath=//div[contains(@id,'notes')]//following-sibling::div//div[@class='note-editable']");
        this.surveyLinkInput = page.getByRole('textbox', { name: 'Location Survey Link' });

        // Feature Checkboxes
        this.roadTestCheckbox = page.locator("//input[@id='RoadTest']//following-sibling::ins");
        this.roadTestCheckboxWrapper = page.locator("//input[@id='RoadTest']//parent::div");
        this.knowledgeTestCheckbox = page.locator("//input[@id='KnowledgeTest']//following-sibling::ins");
        this.knowledgeTestCheckboxWrapper = page.locator("//input[@id='KnowledgeTest']//parent::div");
        this.isVirtualCheckbox = page.locator("//input[@id='IsVirtual']//following-sibling::ins");
        this.isVirtualCheckboxWrapper = page.locator("//input[@id='IsVirtual']//parent::div");
        this.distanceBasedSchedulingCheckbox = page.locator("//input[@id='Distancebasedscheduling']//following-sibling::ins");
        this.distanceBasedSchedulingCheckboxWrapper = page.locator("//input[@id='Distancebasedscheduling']//parent::div");
        this.cashDrawerCheckbox = page.locator("//input[@id='IsCashDrawer']//following-sibling::ins");
        this.cashDrawerCheckboxWrapper = page.locator("//input[@id='IsCashDrawer']//parent::div");
        this.sendDriveAvailableEmailCheckbox = page.locator("//input[@id='SendDriveAvailableEmail']//following-sibling::ins");
        this.sendDriveAvailableEmailCheckboxWrapper = page.locator("//input[@id='SendDriveAvailableEmail']//parent::div");

        // Form Actions & Alerts
        this.saveBtn = page.locator("xpath=(//b[contains(text(),'Location')]//ancestor::div[contains(@class,'modal-content')]//a[contains(text(),'Save')])[1]");

        // Status Filter Locators
        this.statusFilterDropdown = page.locator("xpath=//div[@id='locations']//a[contains(.,'Status')]");
        this.selectAllStatusCheckbox = page.locator("xpath=//div[@id='locations']//ul[contains(@class,'dropdown-menu')]//input//following-sibling::ins").first().or(page.locator("xpath=//div[@id='locations']//input[contains(@class,'All') or contains(@class,'all') or contains(@class,'chkShowAllStatus')]//following-sibling::ins")).or(page.locator("xpath=(//div[@id='locations']//input[@type='checkbox']//following-sibling::ins)[1]"));

        // Grid Locators
        this.searchTextbox = page.locator("input[type='search']").first();
        this.locationTable = page.locator('#locationlisttable');
        this.editIcon = page.getByTitle('Edit');

        // Success Notifications
        this.locationAddedSuccessMsg = page.getByText('Location information added successfully.');
        this.locationUpdatedSuccessMsg = page.getByText('Location information updated successfully.');

        // Form State
        this.uniqueId = '';
        this.locationName = '';
        this.locationCode = '';
        this.licenseNumber = '';
        this.address = '';
        this.city = '';
        this.selectedState = '';
        this.zip = '';
        this.county = '';
        this.selectedLocalTaxCode = '';
        this.mainPhone = '';
        this.fax = '';
        this.locationManager = '';
        this.zoomEmail = '';
        this.providerLocationId = '';
        this.distanceCoverage = '';
        this.pickupName = '';
        this.dropoffName = '';
        this.selectedAppointmentColor = '';
        this.notes = '';
        this.surveyLink = '';

        this.updatedLocationName = '';
        this.updatedLocationCode = '';
        this.updatedLicenseNumber = '';
        this.updatedAddress = '';
        this.updatedCity = '';
        this.updatedState = '';
        this.updatedZip = '';
        this.updatedCounty = '';
        this.updatedLocalTaxCode = '';
        this.updatedMainPhone = '';
        this.updatedFax = '';
        this.updatedLocationManager = '';
        this.updatedZoomEmail = '';
        this.updatedProviderLocationId = '';
        this.updatedDistanceCoverage = '';
        this.updatedAppointmentColor = '';
        this.updatedNotes = '';
        this.updatedSurveyLink = '';

        this.isAreaCoverageSelected = false;
        this.isAreaCoverageUpdated = false;
    }

    /**
     * Clicks the 'Add New' button to open the Location creation form.
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
     * Fills location details using fixture data.
     * @param {Object} data - Base location test data.
     * @returns {Promise<Object>} Created location data with generated names and values.
     **/
    async fillLocationDetails(data = {}) {
        let createdData = {};
        await test.step('Fill Location details', async () => {
            this.uniqueId = `${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
            this.locationName = `${data.locationNamePrefix}_${this.uniqueId}`;
            this.locationCode = `${data.locationCodePrefix}_${this.uniqueId}`;
            this.licenseNumber = `${data.licenseNumber}_${this.uniqueId}`;
            this.address = data.address;
            this.city = data.city;
            this.zip = data.zip;
            this.county = data.county;
            this.mainPhone = data.mainPhone;
            this.fax = data.fax;
            this.locationManager = data.locationManager;
            this.zoomEmail = data.zoomEmail;
            this.providerLocationId = data.providerLocationId;
            this.distanceCoverage = data.distanceCoverage;
            this.pickupName = data.pickupLocation;
            this.dropoffName = data.dropoffLocation;
            this.notes = data.notes;
            this.surveyLink = data.surveyLink;

            createdData = {
                locationName: this.locationName,
                locationCode: this.locationCode,
                pickupName: this.pickupName,
                dropoffName: this.dropoffName
            };

            await this.waitForLoaders();

            // 1. Basic Info
            await this.waitForVisible(this.locationNameInput);
            await this.fill(this.locationNameInput, this.locationName);
            await this.fill(this.locationCodeInput, this.locationCode);

            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionActive);
            await this.click(this.statusDropdownOptionActive);

            await this.jsClick(this.locationType1RadioButton);

            if (await this.isVisible(this.travelTime1RadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.travelTime1RadioButton);
            }

            // 2. License Number
            if (await this.isVisible(this.licenseNumberInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.licenseNumberInput, this.licenseNumber);
            }

            // 3. Address, State & Tax Info
            await this.fill(this.addressInput, this.address);
            await this.fill(this.cityInput, this.city);

            await this.click(this.stateDropdown);
            await this.waitForVisible(this.stateOption);
            this.selectedState = (await this.stateOption.innerText()).trim();
            await this.click(this.stateOption);

            await this.fill(this.zipInput, this.zip);

            if (await this.isVisible(this.countyInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.countyInput, this.county);
            }

            if (await this.isVisible(this.localTaxCodeDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.localTaxCodeDropdown);
                await this.waitForVisible(this.localTaxCodeDropdownOption);
                this.selectedLocalTaxCode = (await this.localTaxCodeDropdownOption.innerText()).trim();
                await this.click(this.localTaxCodeDropdownOption);
            }

            // 4. Contact & Distance
            await this.fill(this.mainPhoneInput, this.mainPhone);

            if (await this.isVisible(this.faxInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.faxInput, this.fax);
            }

            if (await this.isVisible(this.locationManagerInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.locationManagerInput, this.locationManager);
            }

            if (await this.isVisible(this.zoomMailInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.zoomMailInput, this.zoomEmail);
            }

            if (await this.isVisible(this.providerLocationIdInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.providerLocationIdInput, this.providerLocationId);
            }

            if (await this.isVisible(this.distanceCoverageInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.distanceCoverageInput, this.distanceCoverage);
            }

            // 5. Multi-Select Area Coverage (Select all available items)
            const selectableCount = await this.areaCoverageSelectableItem.count();
            if (selectableCount > 0) {
                for (let i = 0; i < selectableCount; i++) {
                    await this.waitForVisible(this.areaCoverageSelectableItem.first());
                    await this.click(this.areaCoverageSelectableItem.first());
                }
                this.isAreaCoverageSelected = true;
            } else {
                this.isAreaCoverageSelected = false;
            }

            // 6. Pickup Location Sub-Modal
            await this.click(this.addPickupLocationBtn);
            await this.waitForVisible(this.addPickupLocationInput);
            await this.fill(this.addPickupLocationInput, this.pickupName);
            await this.click(this.savePickupLocationBtn);
            await this.waitForLoaders().catch(() => { });
            await this.click(this.closePickupLocationBtn);
            await this.click(this.selectPickupDropdown);
            const targetPickup = this.pickupDropdownOption.filter({ hasText: this.pickupName });
            if (await targetPickup.count() > 0) {
                await this.click(targetPickup.first());
            }

            // 7. Dropoff Location Sub-Modal
            await this.click(this.addDropoffLocationBtn);
            await this.waitForVisible(this.addDropoffLocationInput);
            await this.fill(this.addDropoffLocationInput, this.dropoffName);
            await this.click(this.saveDropoffLocationBtn);
            await this.waitForLoaders().catch(() => { });
            await this.click(this.closeDropoffLocationBtn);
            await this.click(this.selectDropoffDropdown);
            const targetDropoff = this.dropoffDropdownOption.filter({ hasText: this.dropoffName });
            if (await targetDropoff.count() > 0) {
                await this.click(targetDropoff.first());
            }

            // 8. Appointment Color Checkbox & Picker
            await this.click(this.appointmentColorCheckbox);

            if (await this.isVisible(this.appointmentColorButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.appointmentColorButton);
                await this.waitForVisible(this.appointmentColorSelector);
                await this.click(this.appointmentColorSelector, { position: { x: 20, y: 20 } });
                await this.click(this.appointmentColorTextbox);
                this.selectedAppointmentColor = await this.appointmentColorTextbox.inputValue();
            }

            // 9. Notes & Survey Link
            await this.fill(this.notesInput, this.notes);

            if (await this.isVisible(this.surveyLinkInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.surveyLinkInput, this.surveyLink);
            }

            // 10. Feature Checkboxes
            if (await this.isVisible(this.roadTestCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.roadTestCheckbox);
            }
            if (await this.isVisible(this.knowledgeTestCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.knowledgeTestCheckbox);
            }
            if (await this.isVisible(this.isVirtualCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.isVirtualCheckbox);
            }
            if (await this.isVisible(this.distanceBasedSchedulingCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.distanceBasedSchedulingCheckbox);
            }
            if (await this.isVisible(this.cashDrawerCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.cashDrawerCheckbox);
            }
            if (await this.isVisible(this.sendDriveAvailableEmailCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.sendDriveAvailableEmailCheckbox);
            }
        });
        return createdData;
    }

    /**
     * Clicks the Save button and verifies that location was added successfully.
     **/
    async saveLocation() {
        await test.step('Save location', async () => {
            await this.click(this.saveBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.locationAddedSuccessMsg);
            await this.verifyVisible(this.locationAddedSuccessMsg);
        });
    }
    /**
     * Clicks the Edit (pencil) button for the filtered location.
     **/
    async clickEdit() {
        await test.step('Click on Edit button', async () => {
            await this.waitForVisible(this.editIcon);
            await this.click(this.editIcon);
            await this.waitForLoaders();
        });
    }

    /**
     * Searches for the location in a retry loop up to maxRetries times, reloading and filtering by All status if needed.
     * @param {string} [locationName=this.locationName] - Location name to search and edit.
     * @param {number} [maxRetries=5] - Maximum retry attempts.
     **/
    async searchAndEditLocation(locationName = this.locationName, maxRetries = 5) {
        await test.step(`Search and edit Location: "${locationName}"`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForLoadState('load').catch(() => { });
                await this.waitForLoaders();
                await this.waitForVisible(this.searchTextbox);
                await this.fill(this.searchTextbox, '');
                await this.fill(this.searchTextbox, locationName);
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
     * Opens the Status filter dropdown on the Locations tab, selects All status, and closes the dropdown.
     **/
    async filterByAllStatus() {
        await test.step('Filter Locations by All status', async () => {
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

    /**
     * Verifies that location details in the edit modal match added values.
     * @param {Object} data - Expected location data fixture.
     **/
    async verifyLocationDetails(data = {}) {
        await test.step('Verify location details in edit form match added values', async () => {
            await this.waitForVisible(this.saveBtn, { timeout: 10000 });

            // 1. Basic Info
            if (await this.isVisible(this.locationNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.locationNameInput).toHaveValue(this.locationName);
            }
            if (await this.isVisible(this.locationCodeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.locationCodeInput).toHaveValue(this.locationCode);
            }
            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.statusDropdown).toContainText('Active');
            }
            if (await this.isVisible(this.travelTime1RadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.travelTime1RadioWrapper).toHaveClass(/checked/);
            }

            if (await this.isVisible(this.locationType1RadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.locationType1RadioWrapper).toHaveClass(/checked/);
            }

            // 2. License Number
            if (await this.isVisible(this.licenseNumberInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.licenseNumberInput).toHaveValue(this.licenseNumber);
            }

            // 3. Address, State & Tax Info
            if (await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.addressInput).toHaveValue(this.address);
            }
            if (await this.isVisible(this.cityInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.cityInput).toHaveValue(this.city);
            }
            if (await this.isVisible(this.stateDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.stateDropdown).toContainText(this.selectedState);
            }
            if (await this.isVisible(this.zipInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zipInput).toHaveValue(this.zip);
            }
            if (await this.isVisible(this.countyInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.countyInput).toHaveValue(this.county);
            }
            if (await this.isVisible(this.localTaxCodeDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.localTaxCodeDropdown).toContainText(this.selectedLocalTaxCode);
            }

            // 4. Contact & Distance
            if (await this.isVisible(this.mainPhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.mainPhoneInput).toHaveValue(this.mainPhone);
            }
            if (await this.isVisible(this.faxInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.faxInput).toHaveValue(this.fax);
            }
            if (await this.isVisible(this.locationManagerInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.locationManagerInput).toHaveValue(this.locationManager);
            }
            if (await this.isVisible(this.zoomMailInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zoomMailInput).toHaveValue(this.zoomEmail);
            }
            if (await this.isVisible(this.providerLocationIdInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.providerLocationIdInput).toHaveValue(this.providerLocationId);
            }
            if (await this.isVisible(this.distanceCoverageInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.distanceCoverageInput).toHaveValue(this.distanceCoverage);
            }

            // 5. Multi-Select Area Coverage (Verify no available items remain)
            if (this.isAreaCoverageSelected) {
                await expect(this.areaCoverageSelectableItem).toHaveCount(0);
                expect(await this.areaCoverageSelectedItem.count()).toBeGreaterThan(0);
            }

            // 6. Pickup & Dropoff
            if (await this.isVisible(this.selectPickupDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.pickupDropdownOption.first()).toContainText(this.pickupName);
            }
            if (await this.isVisible(this.selectDropoffDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.dropoffDropdownOption.first()).toContainText(this.dropoffName);
            }

            // 7. Appointment Color Checkbox & Textbox
            if (await this.isVisible(this.appointmentColorCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.appointmentColorCheckboxWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.appointmentColorTextbox, { timeout: 100 }).catch(() => false)) {
                const actualAppointmentColor = await this.appointmentColorTextbox.inputValue();
                expect(actualAppointmentColor).toBe(this.selectedAppointmentColor);
            }

            // 8. Notes & Survey Link
            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.notesInput).toContainText(this.notes);
            }
            if (await this.isVisible(this.surveyLinkInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.surveyLinkInput).toHaveValue(this.surveyLink);
            }

            // 9. Feature Checkboxes (All checked)
            if (await this.isVisible(this.roadTestCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.roadTestCheckboxWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.knowledgeTestCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.knowledgeTestCheckboxWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.isVirtualCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.isVirtualCheckboxWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.distanceBasedSchedulingCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.distanceBasedSchedulingCheckboxWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.cashDrawerCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.cashDrawerCheckboxWrapper).toHaveClass(/checked/);
            }
            if (await this.isVisible(this.sendDriveAvailableEmailCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.sendDriveAvailableEmailCheckboxWrapper).toHaveClass(/checked/);
            }
        });
    }

    /**
     * Edits location details and sets status to Deleted for environment cleanup.
     * @param {Object} data - Update data from fixture.
     **/
    async editLocationDetails(data = {}) {
        await test.step('Edit location details and set status to Deleted', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.saveBtn);

            // 1. Basic Info
            if (await this.locationNameInput.isEditable().catch(() => false)) {
                this.updatedLocationName = `${data.updatedLocationNamePrefix}_${this.uniqueId}`;
                this.locationName = this.updatedLocationName;
                await this.fill(this.locationNameInput, this.updatedLocationName);
            }
            if (await this.locationCodeInput.isEditable().catch(() => false)) {
                this.updatedLocationCode = `${data.updatedLocationCodePrefix}_${this.uniqueId}`;
                this.locationCode = this.updatedLocationCode;
                await this.fill(this.locationCodeInput, this.updatedLocationCode);
            }

            // Status - strictly Deleted on update
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            await this.click(this.statusDropdownOptionDeleted);

            // Alternate Radio (Location Type 2)
            if (await this.isVisible(this.locationType2RadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.locationType2RadioButton);
            }

            if (await this.isVisible(this.travelTime2RadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.travelTime2RadioButton);
            }

            // 2. License Number
            if (await this.isVisible(this.licenseNumberInput, { timeout: 100 }).catch(() => false)) {
                this.updatedLicenseNumber = `${data.updatedLicenseNumber}_${this.uniqueId}`;
                await this.fill(this.licenseNumberInput, this.updatedLicenseNumber);
            }

            // 3. Address, State & Tax Info
            this.updatedAddress = data.updatedAddress;
            await this.fill(this.addressInput, this.updatedAddress);

            this.updatedCity = data.updatedCity;
            await this.fill(this.cityInput, this.updatedCity);

            if (await this.isVisible(this.stateDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.stateDropdown);
                await this.waitForVisible(this.stateOptionLast);
                this.updatedState = (await this.stateOptionLast.innerText()).trim();
                await this.click(this.stateOptionLast);
            }

            this.updatedZip = data.updatedZip;
            await this.fill(this.zipInput, this.updatedZip);

            if (await this.isVisible(this.countyInput, { timeout: 100 }).catch(() => false)) {
                this.updatedCounty = data.updatedCounty;
                await this.fill(this.countyInput, this.updatedCounty);
            }

            if (await this.isVisible(this.localTaxCodeDropdown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.localTaxCodeDropdown);
                await this.waitForVisible(this.localTaxCodeDropdownOptionLast);
                this.updatedLocalTaxCode = (await this.localTaxCodeDropdownOptionLast.innerText()).trim();
                await this.click(this.localTaxCodeDropdownOptionLast);
            }

            // 4. Contact & Distance
            this.updatedMainPhone = data.updatedMainPhone;
            await this.fill(this.mainPhoneInput, this.updatedMainPhone);

            if (await this.isVisible(this.faxInput, { timeout: 100 }).catch(() => false)) {
                this.updatedFax = data.updatedFax;
                await this.fill(this.faxInput, this.updatedFax);
            }

            if (await this.isVisible(this.locationManagerInput, { timeout: 100 }).catch(() => false)) {
                this.updatedLocationManager = data.updatedLocationManager;
                await this.fill(this.locationManagerInput, this.updatedLocationManager);
            }

            if (await this.isVisible(this.zoomMailInput, { timeout: 100 }).catch(() => false)) {
                this.updatedZoomEmail = data.updatedZoomEmail;
                await this.fill(this.zoomMailInput, this.updatedZoomEmail);
            }

            if (await this.isVisible(this.providerLocationIdInput, { timeout: 100 }).catch(() => false)) {
                this.updatedProviderLocationId = data.updatedProviderLocationId;
                await this.fill(this.providerLocationIdInput, this.updatedProviderLocationId);
            }

            if (await this.isVisible(this.distanceCoverageInput, { timeout: 100 }).catch(() => false)) {
                this.updatedDistanceCoverage = data.updatedDistanceCoverage;
                await this.fill(this.distanceCoverageInput, this.updatedDistanceCoverage);
            }

            // 5. Multi-Select Area Coverage (Deselect all items from selected)
            const selectedCount = await this.areaCoverageSelectedItem.count();
            if (selectedCount > 0) {
                for (let i = 0; i < selectedCount; i++) {
                    await this.waitForVisible(this.areaCoverageSelectedItem.first());
                    await this.click(this.areaCoverageSelectedItem.first());
                }
                this.isAreaCoverageUpdated = true;
            } else {
                this.isAreaCoverageUpdated = false;
            }

            await this.click(this.addPickupLocationBtn);
            await this.waitForVisible(this.addPickupLocationInput);
            this.updatedPickupName = data.updatedPickupLocation;
            await this.fill(this.addPickupLocationInput, this.updatedPickupName);
            await this.click(this.savePickupLocationBtn);
            await this.waitForLoaders().catch(() => { });
            await this.click(this.closePickupLocationBtn);
            await this.click(this.selectPickupDropdown);
            const targetPickup = this.pickupDropdownOption.filter({ hasText: this.updatedPickupName });
            if (await targetPickup.count() > 0) {
                await this.click(targetPickup.first());
            }

            // 7. Dropoff Location Sub-Modal
            await this.click(this.addDropoffLocationBtn);
            await this.waitForVisible(this.addDropoffLocationInput);
            this.updatedDropoffName = data.updatedDropoffLocation;
            await this.fill(this.addDropoffLocationInput, this.updatedDropoffName);
            await this.click(this.saveDropoffLocationBtn);
            await this.waitForLoaders().catch(() => { });
            await this.click(this.closeDropoffLocationBtn);
            await this.click(this.selectDropoffDropdown);
            const targetDropoff = this.dropoffDropdownOption.filter({ hasText: this.updatedDropoffName });
            if (await targetDropoff.count() > 0) {
                await this.click(targetDropoff.first());
            }


            // 6. Appointment Color Checkbox & Textbox (uncheck checkbox & change color)
            if (await this.isVisible(this.appointmentColorCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.appointmentColorCheckbox);
            }

            if (await this.isVisible(this.appointmentColorButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.appointmentColorButton);
                await this.waitForVisible(this.appointmentColorSelector);
                await this.click(this.appointmentColorSelector, { position: { x: 60, y: 60 } });
                await this.click(this.appointmentColorTextbox);
                this.updatedAppointmentColor = await this.appointmentColorTextbox.inputValue();
            }

            // 7. Notes & Survey Link
            this.updatedNotes = data.updatedNotes;
            await this.fill(this.notesInput, this.updatedNotes);

            if (await this.isVisible(this.surveyLinkInput, { timeout: 100 }).catch(() => false)) {
                this.updatedSurveyLink = data.updatedSurveyLink;
                await this.fill(this.surveyLinkInput, this.updatedSurveyLink);
            }

            // 8. Feature Checkboxes (Toggle/Uncheck all)
            if (await this.isVisible(this.roadTestCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.roadTestCheckbox);
            }
            if (await this.isVisible(this.knowledgeTestCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.knowledgeTestCheckbox);
            }
            if (await this.isVisible(this.isVirtualCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.isVirtualCheckbox);
            }
            if (await this.isVisible(this.distanceBasedSchedulingCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.distanceBasedSchedulingCheckbox);
            }
            if (await this.isVisible(this.cashDrawerCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.cashDrawerCheckbox);
            }
            if (await this.isVisible(this.sendDriveAvailableEmailCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.sendDriveAvailableEmailCheckbox);
            }
        });
    }

    /**
     * Clicks Save on Edit form and verifies that location was updated successfully.
     **/
    async saveUpdatedLocation() {
        await test.step('Save updated location', async () => {
            await this.click(this.saveBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.locationUpdatedSuccessMsg);
            await this.verifyVisible(this.locationUpdatedSuccessMsg);
        });
    }

    /**
     * Verifies that location details in the edit modal match updated values.
     * @param {Object} data - Expected updated location data fixture.
     **/
    async verifyUpdatedLocationDetails(data = {}) {
        await test.step('Verify location details in edit form match updated values', async () => {
            await this.waitForVisible(this.saveBtn, { timeout: 10000 });

            // 1. Basic Info
            if (await this.isVisible(this.locationNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.locationNameInput).toHaveValue(this.updatedLocationName || this.locationName);
            }
            if (await this.isVisible(this.locationCodeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.locationCodeInput).toHaveValue(this.updatedLocationCode || this.locationCode);
            }
            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.statusDropdown).toContainText('Deleted');
            }
            if (await this.isVisible(this.locationType2RadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.locationType2RadioWrapper).toHaveClass(/checked/);
                await expect(this.locationType1RadioWrapper).not.toHaveClass(/checked/);
            }

            if (await this.isVisible(this.travelTime2RadioButton, { timeout: 100 }).catch(() => false)) {
                await expect(this.travelTime2RadioWrapper).toHaveClass(/checked/);
                await expect(this.travelTime1RadioWrapper).not.toHaveClass(/checked/);
            }

            // 2. License Number
            if (await this.isVisible(this.licenseNumberInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.licenseNumberInput).toHaveValue(this.updatedLicenseNumber);
            }

            // 3. Address, State & Tax Info
            if (await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.addressInput).toHaveValue(this.updatedAddress);
            }
            if (await this.isVisible(this.cityInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.cityInput).toHaveValue(this.updatedCity);
            }
            if (await this.isVisible(this.stateDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.stateDropdown).toContainText(this.updatedState);
            }
            if (await this.isVisible(this.zipInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zipInput).toHaveValue(this.updatedZip);
            }
            if (await this.isVisible(this.countyInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.countyInput).toHaveValue(this.updatedCounty);
            }
            if (await this.isVisible(this.localTaxCodeDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.localTaxCodeDropdown).toContainText(this.updatedLocalTaxCode);
            }


            // 4. Contact & Distance
            if (await this.isVisible(this.mainPhoneInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.mainPhoneInput).toHaveValue(this.updatedMainPhone);
            }
            if (await this.isVisible(this.faxInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.faxInput).toHaveValue(this.updatedFax);
            }
            if (await this.isVisible(this.locationManagerInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.locationManagerInput).toHaveValue(this.updatedLocationManager);
            }
            if (await this.isVisible(this.zoomMailInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.zoomMailInput).toHaveValue(this.updatedZoomEmail);
            }
            if (await this.isVisible(this.providerLocationIdInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.providerLocationIdInput).toHaveValue(this.updatedProviderLocationId);
            }
            if (await this.isVisible(this.distanceCoverageInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.distanceCoverageInput).toHaveValue(this.updatedDistanceCoverage);
            }

            // 5. Multi-Select Area Coverage (Verify no selected items remain)
            if (this.isAreaCoverageUpdated) {
                await expect(this.areaCoverageSelectedItem).toHaveCount(0);
                expect(await this.areaCoverageSelectableItem.count()).toBeGreaterThan(0);
            }

            // 6. Pickup & Dropoff
            if (await this.isVisible(this.selectPickupDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.pickupDropdownOption.last()).toContainText(this.pickupName);
            }
            if (await this.isVisible(this.selectDropoffDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.dropoffDropdownOption.last()).toContainText(this.dropoffName);
            }

            // 7. Appointment Color Checkbox & Textbox (checkbox unchecked, color changed)
            if (await this.isVisible(this.appointmentColorCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.appointmentColorCheckboxWrapper).not.toHaveClass(/checked/);
            }
            if (await this.isVisible(this.appointmentColorTextbox, { timeout: 100 }).catch(() => false)) {
                const actualAppointmentColor = await this.appointmentColorTextbox.inputValue();
                expect(actualAppointmentColor).toBe(this.updatedAppointmentColor);
                expect(this.updatedAppointmentColor).not.toBe(this.selectedAppointmentColor);
            }

            // 8. Notes & Survey Link
            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.notesInput).toContainText(this.updatedNotes);
            }
            if (await this.isVisible(this.surveyLinkInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.surveyLinkInput).toHaveValue(this.updatedSurveyLink);
            }

            // 9. Feature Checkboxes (All unchecked)
            if (await this.isVisible(this.roadTestCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.roadTestCheckboxWrapper).not.toHaveClass(/checked/);
            }
            if (await this.isVisible(this.knowledgeTestCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.knowledgeTestCheckboxWrapper).not.toHaveClass(/checked/);
            }
            if (await this.isVisible(this.isVirtualCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.isVirtualCheckboxWrapper).not.toHaveClass(/checked/);
            }
            if (await this.isVisible(this.distanceBasedSchedulingCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.distanceBasedSchedulingCheckboxWrapper).not.toHaveClass(/checked/);
            }
            if (await this.isVisible(this.cashDrawerCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.cashDrawerCheckboxWrapper).not.toHaveClass(/checked/);
            }
            if (await this.isVisible(this.sendDriveAvailableEmailCheckbox, { timeout: 100 }).catch(() => false)) {
                await expect(this.sendDriveAvailableEmailCheckboxWrapper).not.toHaveClass(/checked/);
            }
        });
    }
}
