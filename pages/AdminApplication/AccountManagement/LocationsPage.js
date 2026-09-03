import BasePage from '../../../utils/BasePage';
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

        // Add / Edit Location Form Locators
        this.locationNameInput = page.getByRole('textbox', { name: 'Location Name' });
        this.locationCodeInput = page.getByRole('textbox', { name: 'Location Code' });
        this.statusDropdown = page.locator("xpath=//select[@name='LocationStatus']//parent::div//button");
        this.statusDropdownOptionActive = page.locator("xpath=//select[@name='LocationStatus']//parent::div//div//span[text()='Active']");
        this.statusDropdownOptionDeleted = page.locator("xpath=//select[@name='LocationStatus']//parent::div//div//span[text()='Deleted']");

        this.locationType1RadioButton = page.locator("xpath=(//input[@id='LocationType']//following-sibling::ins)[1]");
        this.locationType2RadioButton = page.locator("xpath=(//input[@id='LocationType']//following-sibling::ins)[last()]");
        //     this.locationType1RadioButton = page.locator('#LocationType').first();
        // this.locationType2RadioButton = page.locator('#LocationType').last();

        // Address & Contact
        this.addressInput = page.getByRole('textbox', { name: 'Address' });
        this.cityInput = page.getByRole('textbox', { name: 'City' });
        this.stateDropdown = page.locator("xpath=//select[@name='State']//parent::div//button");
        this.stateOptionFL = page.locator("(//select[@id='State']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.zipInput = page.getByRole('textbox', { name: 'Zip' });
        this.mainPhoneInput = page.locator("#PhoneMain");
        this.countyInput = page.locator('#County');
        this.faxInput = page.locator('#Fax');
        this.locationManagerInput = page.locator('#LocationManager')
        this.zoomMailInput = page.locator('#ZoomEmail');
        this.providerLocationIdInput = page.locator('#ProviderLocationId');
        this.distanceCoverageInput = page.locator('#DistanceCoverage');

        // Pickup Location Modal
        this.addPickupLocationBtn = page.locator("xpath=//a[contains(@onclick,'AddPickUp')]");
        this.addPickupLocationInput = page.locator('#pickLocation').getByRole('textbox', { name: 'Add Location' })
        this.savePickupLocationBtn = page.locator('#pickLocation').getByRole('button', { name: 'Save' });
        this.closePickupLocationBtn = page.locator('#pickLocation').getByRole('button', { name: 'Close' });
        this.selectPickupDropdown = page.locator('#div_str_pickuploc').getByRole('button', { name: 'Select' });

        // Dropoff Location Modal
        this.addDropoffLocationBtn = page.locator("xpath=//a[contains(@onclick,'AddDropOff')]");
        this.addDropoffLocationInput = page.locator('#dropLocation').getByRole('textbox', { name: 'Add Location' })
        this.saveDropoffLocationBtn = page.locator('#dropLocation').getByRole('button', { name: 'Save' });
        this.closeDropoffLocationBtn = page.locator('#dropLocation').getByRole('button', { name: 'Close' });
        this.selectDropoffDropdown = page.locator('#div_str_dropoffloc').getByRole('button', { name: 'Select' });

        this.appointmentColorCheckbox = page.locator("xpath=(//input[@id='AppointmentColor']//following-sibling::ins)[1]");
        this.areaCoverageSelectableItem = page.locator("(//div[contains(@id,'AreaCoverage')]//li)[1]");


        // Additional Info
        this.notesInput = page.locator("xpath=//div[contains(@id,'notes')]//following-sibling::div//div[@class='note-editable']");

        this.surveyLinkInput = page.getByRole('textbox', { name: 'Location Survey Link' });
        this.licenseNumberInput = page.getByRole('textbox', { name: 'Location License Number' });

        // Form Actions & Alerts
        this.saveBtn = page.locator("xpath=(//b[contains(text(),'Location')]//ancestor::div[contains(@class,'modal-content')]//a[contains(text(),'Save')])[1]");

        // Grid Locators
        this.searchTextbox = page.locator("input[type='search']").first();
        this.locationTable = page.locator('#locationlisttable');
        this.editIcon = page.getByTitle('Edit');
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
     * Fills location details with dynamic random values.
     * @param {Object} data - Base location test data.
     * @returns {Promise<Object>} Created location data with generated names and values.
     **/
    async fillLocationDetails(data = {}) {
        let createdData = {};
        await test.step('Fill Location details', async () => {
            this.uniqueId = `${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}`;
            this.locationName = `${data.locationNamePrefix || 'Location'}_${this.uniqueId}`;
            this.locationCode = `${data.locationCodePrefix || 'LOC'}_${this.uniqueId}`;
            const address = data.address || '123 Central Ave';
            const city = data.city || 'Miami';
            const zip = data.zip || '22222';
            const mainPhone = data.mainPhone || '(555) 123-4567';
            const pickupName = data.pickupLocation;
            const dropoffName = data.dropoffLocation;
            const notes = data.notes || 'Automated location note';
            const surveyLink = data.surveyLink || 'https://survey.example.com';
            const licenseNumber = data.licenseNumber || `LIC${this.uniqueId}`;

            createdData = {
                locationName: this.locationName,
                locationCode: this.locationCode,
                pickupName,
                dropoffName
            };

            await this.waitForLoaders();
            await this.waitForVisible(this.locationNameInput);
            await this.fill(this.locationNameInput, this.locationName);
            await this.fill(this.locationCodeInput, this.locationCode);

            // Set Status to Active
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionActive)
            await this.click(this.statusDropdownOptionActive);


            await this.jsClick(this.locationType1RadioButton);


            // Fill Address
            await this.fill(this.addressInput, address);
            await this.fill(this.cityInput, city);

            await this.click(this.stateDropdown);
            await this.waitForVisible(this.stateOptionFL);
            await this.click(this.stateOptionFL);
            await this.fill(this.zipInput, zip);
            await this.fill(this.mainPhoneInput, mainPhone);


            if (await this.isVisible(this.countyInput)) {
                await this.fill(this.countyInput, data.county)
            }

            if (await this.isVisible(this.faxInput)) {
                await this.fill(this.faxInput, data.fax)
            }

            if (await this.isVisible(this.locationManagerInput)) {
                await this.fill(this.locationManagerInput, data.locationManager)
            }

            if (await this.isVisible(this.zoomMailInput)) {
                await this.fill(this.zoomMailInput, data.zoomEmail)
            }

            if (await this.isVisible(this.providerLocationIdInput)) {
                await this.fill(this.providerLocationIdInput, data.providerLocationId)
            }

            if (await this.isVisible(this.distanceCoverageInput)) {
                await this.fill(this.distanceCoverageInput, data.distanceCoverage)
            }

            if (await this.isVisible(this.areaCoverageSelectableItem)) {
                await this.click(this.areaCoverageSelectableItem);
            }


            // Add Pickup Location Sub-Modal
            await this.click(this.addPickupLocationBtn);
            await this.waitForVisible(this.addPickupLocationInput);
            await this.fill(this.addPickupLocationInput, pickupName);
            await this.click(this.savePickupLocationBtn);
            await this.waitForLoaders().catch(() => { });
            await this.click(this.closePickupLocationBtn);
            await this.click(this.selectPickupDropdown);
            await this.click(this.page.getByRole('link', { name: pickupName, exact: true }));


            // Add Dropoff Location Sub-Modal
            await this.click(this.addDropoffLocationBtn);
            await this.waitForVisible(this.addDropoffLocationInput);
            await this.fill(this.addDropoffLocationInput, dropoffName);
            await this.click(this.saveDropoffLocationBtn);
            await this.waitForLoaders().catch(() => { });
            await this.click(this.closeDropoffLocationBtn);
            await this.click(this.selectDropoffDropdown);
            await this.click(this.page.getByRole('link', { name: dropoffName, exact: true }));

            await this.click(this.appointmentColorCheckbox);

            // Notes, Survey Link, License
            await this.fill(this.notesInput, notes);

            await this.fill(this.surveyLinkInput, surveyLink);

            await this.fill(this.licenseNumberInput, licenseNumber);

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
            await this.waitForVisible(this.page.getByText('Location information added successfully.'));
            await this.verifyVisible(this.page.getByText('Location information added successfully.'));
        });
    }

    /**
     * Searches for a location by name in the locations grid.
     * @param {string} locationName - Name of the location to search.
     **/
    async searchLocation(locationName) {
        await test.step(`Search for location: "${locationName}"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.searchTextbox)
            await this.fill(this.searchTextbox, locationName);
            await this.waitForLoaders();
            await this.verifyContainsText(this.locationTable, locationName);
            await expect(this.editIcon).toHaveCount(1);
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
     * Edits location details and sets status to Deleted for environment cleanup.
     * @param {Object} data - Update data.
     **/
    async editLocationDetails(data = {}) {
        await test.step('Edit location details and set status to Deleted', async () => {
            const updatedNotes = data.updatedNotes || 'Automated location note updated';

            await this.click(this.locationType2RadioButton);


            // Set Status to Deleted (self-cleaning test data)
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            await this.click(this.statusDropdownOptionDeleted);

            await this.fill(this.notesInput, updatedNotes);

        });
    }

    /**
     * Clicks Save on Edit form and verifies that location was updated successfully.
     **/
    async saveUpdatedLocation() {
        await test.step('Save updated location', async () => {
            await this.click(this.saveBtn);
            await this.waitForLoaders();

            await this.waitForVisible(this.page.getByText('Location information updated successfully.'));
            await this.verifyVisible(this.page.getByText('Location information updated successfully.'));
        });
    }
}
