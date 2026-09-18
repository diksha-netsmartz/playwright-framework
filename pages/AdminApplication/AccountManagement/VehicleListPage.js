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
        this.locationOption = page.locator("xpath=(//select[@id='VehicleLocation']//parent::div//div//ul//li[not (contains (@class,'selected'))])[1]");

        this.vehicleTypeDropdown = page.locator("xpath=//select[@id='VehicleType']//parent::div//button");
        this.vehicleTypeOptionBus = page.locator("xpath=//select[@id='VehicleType']//parent::div//div//span[text()='Bus']");
        this.vehicleTypeOptionMotorcycle = page.locator("xpath=//select[@id='VehicleType']//parent::div//div//span[text()='Motorcycle']");

        this.GPSTrackerDropdown = page.locator("xpath=//select[@id='GPSTracker']//parent::div//button");
        this.GPSTrackerOption = page.locator("xpath=(//select[@id='GPSTracker']//parent::div//div//ul//li[not (contains (@class,'selected'))])[1]");

        this.vehicleYearDropdown = page.locator("xpath=//select[@id='VehicleYear']//parent::div//button");
        this.vehicleYearOption = page.locator("xpath=(//select[@id='VehicleYear']//parent::div//div//ul//li[not (contains (@class,'selected'))])[1]");

        this.vehicleNoInput = page.getByRole('textbox', { name: 'Vehicle No' });
        this.vehicleMakeInput = page.getByRole('textbox', { name: 'Vehicle Make' });
        this.licensePlateInput = page.getByRole('textbox', { name: 'License Plate' });
        this.vinInput = page.getByPlaceholder('VIN#');
        this.inspectionInput = page.locator('#dt_inspection:visible');
        this.registrationInput = page.locator('#dt_Registration:visible');
        this.insuranceInput = page.locator('#dt_Insurance:visible');
        this.instructorBrakeInput = page.locator('#dt_InstructorBrake:visible');
        this.vehicleModelInput = page.getByRole('textbox', { name: 'Vehicle Model' });

        this.appointmentColorCheckbox = page.locator("xpath=(//input[@id='EnableAppointmentColor']//following-sibling::ins)[1]");
        this.appointmentColorCheckboxWrapper = page.locator("xpath=(//input[@id='EnableAppointmentColor']//parent::div)[1]");
        this.notesInput = page.locator('#VehicleNote');
        this.odometerValueInput = page.getByRole('textbox', { name: 'Odometer Value' });
        this.initialMileageInput = page.locator("//input[@id='VehicleInitialMileage' and not(@disabled)]");

        // File / Picture Upload Locators
        this.selectImageBtn = page.getByText('Select Image', { exact: true });
        this.saveImageButton = page.locator("xpath=//div[text()='Save']").or(page.locator('div').filter({ hasText: /^Save$/ }));
        this.fileInput = page.locator("input[type='file']").first();
        this.saveImageButton = page.locator("xpath=//div[text()='Save']");
        this.imageUploaded = page.locator('#imgCroppedImage')

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
            this.vehicleNo = `${Date.now()} ${Math.floor(1000 + Math.random() * 9000)}`;
            this.vehicleMake = data.vehicleMake || 'Toyota';
            this.vehicleModel = data.vehicleModel || 'Corolla';
            this.licensePlate = `${data.licensePlatePrefix || 'LP'}${Math.floor(1000 + Math.random() * 9000)}`;
            this.vin = `${data.vinPrefix || 'VIN'}${Math.floor(10000 + Math.random() * 90000)}`;
            this.inspectionDate = data.inspectionDate || '11092027';
            this.registrationDate = data.registrationDate || '11092027';
            this.insuranceDate = data.insuranceDate || '11092027';
            this.instructorBrakeDate = data.instructorBrakeDate || '11092027';
            this.notes = data.notes || 'Automated Vehicle Note';
            this.odometer = data.odometerValue || '1500';
            this.initialMileage = data.initialMileage || '900';
            this.description = data.description;

            await this.waitForLoaders();
            await this.waitForVisible(this.vehicleNameInput);
            await this.fill(this.vehicleNameInput, this.vehicleName);

            if (await this.isVisible(this.descriptionInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.descriptionInput, this.description);
            }

            // Select Status as Active
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusOptionActive);
            await this.click(this.statusOptionActive);

            // Select Location
            if (await this.locationDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.locationDropdown);
                await this.waitForVisible(this.locationOption);
                this.selectedLocation = (await this.locationOption.innerText()).trim();
                await this.click(this.locationOption);
            }

            // Select Vehicle Type (Bus)
            if (await this.vehicleTypeDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.vehicleTypeDropdown);
                await this.waitForVisible(this.vehicleTypeOptionBus);
                await this.click(this.vehicleTypeOptionBus);
            }

            // Select GPS Tracker
            if (await this.GPSTrackerDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.GPSTrackerDropdown);
                await this.waitForVisible(this.GPSTrackerOption);
                this.selectedGPSTracker = (await this.GPSTrackerOption.innerText()).trim();
                await this.click(this.GPSTrackerOption);
            }

            if (await this.vehicleYearDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.vehicleYearDropdown);
                await this.waitForVisible(this.vehicleYearOption);
                this.selectedVehicleYear = (await this.vehicleYearOption.innerText()).trim();
                await this.click(this.vehicleYearOption);
            }

            // Fill Vehicle Specs
            if (await this.isVisible(this.vehicleNoInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.vehicleNoInput, this.vehicleNo);
            }

            if (await this.isVisible(this.vehicleMakeInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.vehicleMakeInput, this.vehicleMake);
            }

            if (await this.isVisible(this.vehicleModelInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.vehicleModelInput, this.vehicleModel);
            }

            if (await this.isVisible(this.licensePlateInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.licensePlateInput, this.licensePlate);
            }

            if (await this.isVisible(this.vinInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.vinInput, this.vin);
            }
            if (await this.isVisible(this.inspectionInput, { timeout: 100 }).catch(() => false)) {
                await this.pressSequentially(this.inspectionInput, this.inspectionDate);
            }

            if (await this.isVisible(this.registrationInput, { timeout: 100 }).catch(() => false)) {
                await this.pressSequentially(this.registrationInput, this.registrationDate);
            }

            if (await this.isVisible(this.insuranceInput, { timeout: 100 }).catch(() => false)) {
                await this.pressSequentially(this.insuranceInput, this.insuranceDate);
            }

            if (await this.isVisible(this.instructorBrakeInput, { timeout: 100 }).catch(() => false)) {
                await this.pressSequentially(this.instructorBrakeInput, this.instructorBrakeDate);
            }
            // Dual Brake Checkbox
            if (await this.appointmentColorCheckbox.isVisible({ timeout: 100 }).catch(() => false)) {
                await this.click(this.appointmentColorCheckbox);
            }

            // Notes
            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.notesInput, this.notes);
            }

            // Odometer & Mileage
            if (await this.isVisible(this.odometerValueInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.odometerValueInput, this.odometer);
            }

            if (await this.isVisible(this.initialMileageInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.initialMileageInput, this.initialMileage);
            }

            // Upload Picture
            await this.uploadVehiclePicture(data.imageName || 'vehicle.png');

            return {
                vehicleName: this.vehicleName,
                vehicleNo: this.vehicleNo
            };
        });
    }

    /**
     * Verifies that the vehicle details in the form match the filled / expected values.
     * @param {Object} [expectedDetails={}] - Optional expected vehicle details.
     **/
    async verifyVehicleDetails(expectedDetails = {}) {
        await test.step('Verify Vehicle details in form', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.vehicleNameInput);

            const expectedVehicleName = expectedDetails.vehicleName || this.vehicleName;
            const expectedVehicleNo = expectedDetails.vehicleNo || this.vehicleNo;
            const expectedVehicleMake = expectedDetails.vehicleMake || this.vehicleMake;
            const expectedVehicleModel = expectedDetails.vehicleModel || this.vehicleModel;
            const expectedLicensePlate = expectedDetails.licensePlate || this.licensePlate;
            const expectedVin = expectedDetails.vin || this.vin;
            const expectedInspectionDate = this.formatDateWithSlashes(expectedDetails.inspectionDate || this.inspectionDate || '11092027');
            const expectedRegistrationDate = this.formatDateWithSlashes(expectedDetails.registrationDate || this.registrationDate || '11092027');
            const expectedInsuranceDate = this.formatDateWithSlashes(expectedDetails.insuranceDate || this.insuranceDate || '11092027');
            const expectedInstructorBrakeDate = this.formatDateWithSlashes(expectedDetails.instructorBrakeDate || this.instructorBrakeDate || '11092027');
            const expectedNotes = expectedDetails.notes || this.notes;
            const expectedOdometer = expectedDetails.odometerValue || this.odometer;
            const expectedInitialMileage = expectedDetails.initialMileage || this.initialMileage;
            const expectedDescription = expectedDetails.description !== undefined ? expectedDetails.description : this.description;

            if (await this.isVisible(this.vehicleNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleNameInput).toHaveValue(expectedVehicleName);
            }

            if (expectedDescription && await this.isVisible(this.descriptionInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.descriptionInput).toHaveValue(expectedDescription);
            }

            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.statusDropdown).toContainText(expectedDetails.status || 'Active');
            }

            if (await this.isVisible(this.locationDropdown, { timeout: 100 }).catch(() => false)) {
                const actualLocation = (await this.locationDropdown.innerText()).trim().toLowerCase();
                const expectedLocation = this.selectedLocation.trim().toLowerCase();
                expect(actualLocation).toContain(expectedLocation);
            }

            if (await this.isVisible(this.vehicleTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleTypeDropdown).toContainText(expectedDetails.vehicleType || 'Bus');
            }

            if (await this.isVisible(this.vehicleNoInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleNoInput).toHaveValue(expectedVehicleNo);
            }

            if (await this.isVisible(this.vehicleMakeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleMakeInput).toHaveValue(expectedVehicleMake);
            }

            if (await this.isVisible(this.vehicleModelInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleModelInput).toHaveValue(expectedVehicleModel);
            }

            if (await this.isVisible(this.licensePlateInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.licensePlateInput).toHaveValue(expectedLicensePlate);
            }

            if (await this.isVisible(this.vinInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.vinInput).toHaveValue(expectedVin);
            }

            if (await this.isVisible(this.inspectionInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.inspectionInput).toHaveValue(expectedInspectionDate);
            }

            if (await this.isVisible(this.registrationInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.registrationInput).toHaveValue(expectedRegistrationDate);
            }

            if (await this.isVisible(this.insuranceInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.insuranceInput).toHaveValue(expectedInsuranceDate);
            }

            if (await this.isVisible(this.instructorBrakeInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.instructorBrakeInput).toHaveValue(expectedInstructorBrakeDate);
            }

            if (await this.isVisible(this.appointmentColorCheckbox, { timeout: 100 }).catch(() => false)) {
                const checkboxWrapper = this.appointmentColorCheckboxWrapper;
                if (await checkboxWrapper.count() > 0) {
                    await expect(checkboxWrapper).toHaveClass(/checked/);
                }
            }

            if (await this.isVisible(this.GPSTrackerDropdown, { timeout: 100 }).catch(() => false)) {
                const actualGPSTracker = (await this.GPSTrackerDropdown.innerText()).trim().toLowerCase();
                const expectedGPSTracker = this.selectedGPSTracker.trim().toLowerCase();
                expect(actualGPSTracker).toContain(expectedGPSTracker);
            }

            if (await this.isVisible(this.vehicleYearDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleYearDropdown).toContainText(this.selectedVehicleYear);
            }

            if (await this.isVisible(this.vehicleModelInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleModelInput).toHaveValue(expectedVehicleModel);
            }


            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.notesInput).toHaveValue(expectedNotes);
            }

            if (await this.isVisible(this.odometerValueInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.odometerValueInput).toHaveValue(expectedOdometer);
            }

            if (await this.isVisible(this.imageUploaded, { timeout: 100 }).catch(() => false)) {
                const imageSrc = await this.imageUploaded.getAttribute('src');
                expect(imageSrc?.length).toBeGreaterThan(0);
            }

            if (await this.isVisible(this.initialMileageInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.initialMileageInput).toHaveValue(expectedInitialMileage);
            }
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
            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.notesInput, updatedNotes);
            }

            // Update Initial Mileage
            if (await this.isVisible(this.initialMileageInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.initialMileageInput, updatedMileage);
            }

            if (await this.isVisible(this.odometerValueInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.odometerValueInput, updatedOdometer);
            }


            if (await this.isVisible(this.licensePlateInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.licensePlateInput, updatedLicensePlate);
            }

            if (await this.isVisible(this.vinInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.vinInput, updatedVin);
            }

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
