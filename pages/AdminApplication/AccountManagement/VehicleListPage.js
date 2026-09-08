import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';
import path from 'path';

/**
 * Page Object representing the Vehicle List Page in Admin Portal (Account Management > Vehicles > Vehicle List).
 * Handles adding new vehicles with dynamic naming, uploading vehicle picture,
 * editing existing vehicles, searching the data table, and verifying notifications.
 **/
export default class VehicleListPage extends BasePage {

    /**
     * Initializes locators for the Vehicle List Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("#addNewVehicle");

        // Form Locators - Vehicle Details
        this.vehicleNameInput = page.getByRole('textbox', { name: 'Vehicle Name' });
        this.descriptionInput = page.locator('#Description')
        this.statusDropdown = page.locator("xpath=//select[@id='VehicleStatus']//parent::div//button");
        this.statusOptionActive = page.locator("xpath=//select[@id='VehicleStatus']//parent::div//div//span[text()='Active']");
        this.statusOptionInActive = page.locator("xpath=//select[@id='VehicleStatus']//parent::div//div//span[text()='InActive']");

        this.locationDropdown = page.locator("xpath=//select[@id='VehicleLocation']//parent::div//button");
        this.locationOption = page.locator("xpath=(//select[@id='VehicleLocation']//parent::div//div//ul//li[not (@class='selected')])[1]");

        this.vehicleTypeDropdown = page.locator("xpath=//select[@id='VehicleType']//parent::div//button");
        this.vehicleTypeOptionBus = page.locator("xpath=//select[@id='VehicleType']//parent::div//div//span[text()='Bus']");
        this.vehicleTypeOptionMotorcycle = page.locator("xpath=//select[@id='VehicleType']//parent::div//div//span[text()='Motorcycle']");

        this.vehicleNoInput = page.getByRole('textbox', { name: 'Vehicle No' });
        this.vehicleMakeInput = page.getByRole('textbox', { name: 'Vehicle Make' });
        this.licensePlateInput = page.getByRole('textbox', { name: 'License Plate' });
        this.vinInput = page.getByPlaceholder('VIN#')

        this.appointmentColorCheckbox = page.locator("xpath=(//input[@id='EnableAppointmentColor']//following-sibling::ins)[1]");
        this.notesInput = page.locator('#VehicleNote');
        this.odometerValueInput = page.getByRole('textbox', { name: 'Odometer Value' });
        this.initialMileageInput = page.getByRole('textbox', { name: 'Vehicle Initial Mileage' });

        // File / Picture Upload Locators
        this.selectImageBtn = page.getByText('Select Image', { exact: true });
        this.saveImageButton = page.locator("xpath=//div[text()='Save']").or(page.locator('div').filter({ hasText: /^Save$/ }));
        this.fileInput = page.locator("input[type='file']").first();
        this.saveImageButton = page.locator("xpath=//div[text()='Save']");

        // Form Action Buttons & Notifications
        this.saveBtn = page.locator("xpath=(//b[contains(text(),'VEHICLE') or contains(text(),'Vehicle')]//ancestor::div[contains(@class,'modal-content')]//a[contains(text(),'Save')])[1]");


        // Data Table Locators
        this.vehicleTable = page.locator('#Vehiclelisttable');
        this.searchTextbox = page.locator("xpath=(//div[contains(@id,'Vehiclelisttable_filter')]//input[@type='search'])[1]");
        this.editIcon = page.getByTitle('Edit');
    }

    /**
     * Clicks the 'Add New' button to open the Add Vehicle form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button for Vehicle', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Uploads the vehicle picture from the test-data/uploads folder.
     * @param {string} [fileName='vehicle.png'] - Filename in test-data/uploads directory.
     **/
    async uploadVehiclePicture(fileName = 'vehicle.png') {
        await test.step(`Upload vehicle picture: "${fileName}"`, async () => {

            const filePath = path.resolve(__dirname, "../../../test-data/uploads", fileName);

            // Intercept file chooser to prevent OS desktop popup
            const fileChooserPromise = this.page.waitForEvent('filechooser');
            await this.click(this.selectImageBtn);
            const fileChooser = await fileChooserPromise;
            await fileChooser.setFiles(filePath);

            await this.waitForLoaders();
            await this.page.waitForTimeout(1000);

            // Click Save button on the crop modal if visible
            if (await this.saveImageButton.isVisible({ timeout: 1000 }).catch(() => false)) {
                await this.click(this.saveImageButton);
                await this.waitForLoaders();
                await this.page.waitForTimeout(500);
            }
        });
    }

    /**
     * Fills the Vehicle creation form with dynamic unique values.
     * @param {Object} data - Vehicle test data fixture.
     * @returns {Promise<Object>} Created vehicle details.
     **/
    async fillVehicleDetails(data = {}) {
        return await test.step('Fill Vehicle details', async () => {
            this.uniqueId = `${Date.now()}`;
            this.vehicleName = `${data.vehicleNamePrefix || 'Vehicle'}_${this.uniqueId}`;
            const vehicleNo = `${Date.now()} ${Math.floor(1000 + Math.random() * 9000)}`;
            const vehicleMake = data.vehicleMake || 'Toyota';
            const licensePlate = `${data.licensePlatePrefix || 'LP'}${Math.floor(1000 + Math.random() * 9000)}`;
            const vin = `${data.vinPrefix || 'VIN'}${Math.floor(10000 + Math.random() * 90000)}`;
            const notes = data.notes || 'Automated Vehicle Note';
            const odometer = data.odometerValue || '1500';
            const initialMileage = data.initialMileage || '900';


            await this.waitForLoaders();
            await this.waitForVisible(this.vehicleNameInput);
            await this.fill(this.vehicleNameInput, this.vehicleName);

            if (await this.isVisible(this.descriptionInput, { timeout: 5000 }).catch(() => false)) {
                await this.fill(this.descriptionInput, data.description)
            }

            // Select Status as Active
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusOptionActive);
            await this.click(this.statusOptionActive);

            // Select Location
            if (await this.locationDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(this.locationDropdown);
                await this.waitForVisible(this.locationOption);
                await this.click(this.locationOption);
            }

            // Select Vehicle Type (Bus)
            if (await this.vehicleTypeDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(this.vehicleTypeDropdown);
                await this.waitForVisible(this.vehicleTypeOptionBus);
                await this.click(this.vehicleTypeOptionBus);
            }

            // Fill Vehicle Specs
            await this.waitForVisible(this.vehicleNoInput);
            await this.fill(this.vehicleNoInput, vehicleNo);

            await this.waitForVisible(this.vehicleMakeInput);
            await this.fill(this.vehicleMakeInput, vehicleMake);

            await this.waitForVisible(this.licensePlateInput);
            await this.fill(this.licensePlateInput, licensePlate);

            await this.waitForVisible(this.vinInput);
            await this.fill(this.vinInput, vin);

            // Dual Brake Checkbox
            await this.click(this.appointmentColorCheckbox);


            // Notes
            await this.waitForVisible(this.notesInput);
            await this.fill(this.notesInput, notes);

            // Odometer & Mileage
            await this.waitForVisible(this.odometerValueInput);
            await this.fill(this.odometerValueInput, odometer);

            await this.waitForVisible(this.initialMileageInput);
            await this.fill(this.initialMileageInput, initialMileage);

            // Upload Picture
            await this.uploadVehiclePicture(data.imageName || 'vehicle.png');

            return {
                vehicleName: this.vehicleName,
                vehicleNo: vehicleNo
            };
        });
    }

    /**
     * Clicks the Save button and handles optional confirmation dialog.
     **/
    async clickSave() {
        await test.step('Click Save button', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);

            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Verifies that the 'Vehicle information added successfully.' notification is displayed.
     **/
    async verifyVehicleCreatedSuccessfully() {
        await test.step('Verify "Vehicle information added successfully." notification', async () => {
            const successMsg = this.page.getByText('Vehicle information added successfully.');
            await this.waitForVisible(successMsg);
            await this.verifyVisible(successMsg);
        });
    }

    /**
     * Searches for the created Vehicle in the data table and clicks Edit.
     * @param {string} [vehicleName=this.vehicleName] - Vehicle name to search.
     **/
    async searchAndEditVehicle(vehicleName = this.vehicleName) {
        await test.step(`Search and edit Vehicle: "${vehicleName}"`, async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, vehicleName);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);

            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.click(this.editIcon);
            await this.waitForLoaders();
        });
    }

    /**
     * Modifies vehicle fields (Vehicle Type, Status, Notes, Mileage) on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async editVehicleDetails(data = {}) {
        await test.step('Update Vehicle fields ( Status, Notes, Mileage)', async () => {
            await this.waitForLoaders();

            const updatedNotes = data.updatedNotes
            const updatedMileage = data.updatedInitialMileage
            const updatedOdometer = data.updatedOdometerValue
            // const updatedLicensePlate = data.updatedLicensePlate
            // const updatedVin = data.updatedVin;
            const updatedLicensePlate = `${data.licensePlatePrefix || 'LP'}${Math.floor(1000 + Math.random() * 9000)}`;
            const updatedVin = `${data.vinPrefix || 'VIN'}${Math.floor(10000 + Math.random() * 90000)}`;


            // Update Status (InActive / Deleted)
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusOptionInActive);
            await this.click(this.statusOptionInActive);

            // Update Notes
            await this.waitForVisible(this.notesInput);
            await this.fill(this.notesInput, updatedNotes);

            // Update Initial Mileage
            await this.waitForVisible(this.initialMileageInput);
            await this.fill(this.initialMileageInput, updatedMileage);

            await this.waitForVisible(this.odometerValueInput);
            await this.fill(this.odometerValueInput, updatedOdometer);


            await this.waitForVisible(this.licensePlateInput);
            await this.fill(this.licensePlateInput, updatedLicensePlate);

            await this.waitForVisible(this.vinInput);
            await this.fill(this.vinInput, updatedVin);

        });
    }

    /**
     * Verifies that the 'Vehicle information updated successfully.' notification is displayed.
     **/
    async verifyVehicleUpdatedSuccessfully() {
        await test.step('Verify "Vehicle information updated successfully." notification', async () => {
            const successMsg = this.page.getByText('Vehicle information updated successfully.');
            await this.waitForVisible(successMsg);
            await this.verifyVisible(successMsg);
        });
    }
}
