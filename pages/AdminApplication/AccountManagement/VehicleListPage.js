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
        this.appointmentColorNoRadio = page.locator("xpath=(//input[@id='EnableAppointmentColor']//following-sibling::ins)[2]");
        this.notesInput = page.locator('#VehicleNote');
        this.odometerValueInput = page.getByRole('textbox', { name: 'Odometer Value' });
        this.initialMileageInput = page.locator("//input[@id='VehicleInitialMileage' and not(@disabled)]");

        // File / Picture Upload Locators
        this.selectImageBtn = page.getByText('Select Image', { exact: true });
        this.saveImageButton = page.locator("xpath=//div[text()='Save']").or(page.locator('div').filter({ hasText: /^Save$/ }));
        this.fileInput = page.locator("input[type='file']").first();
        this.imageUploaded = page.locator('#imgCroppedImage');

        // Form Action Buttons & Notifications
        this.saveBtn = page.locator("xpath=(//b[contains(text(),'VEHICLE') or contains(text(),'Vehicle')]//ancestor::div[contains(@class,'modal-content')]//a[contains(text(),'Save')])[1]");

        this.statusFilterDropdown = page.locator("xpath=//div[@id='vehicles']//a[contains(.,'Status')]");
        this.selectAllStatusCheckbox = page.locator("xpath=(//div[@id='vehicles']//input[@type='checkbox']//following-sibling::ins)[1]");

        // Data Table Locators
        this.vehicleTable = page.locator('#Vehiclelisttable');
        this.searchTextbox = page.locator("xpath=(//div[contains(@id,'Vehiclelisttable_filter')]//input[@type='search'])[1]");
        this.editIcon = page.getByTitle('Edit');

        // State Tracking
        this.uniqueId = '';
        this.vehicleName = '';
        this.vehicleNo = '';
        this.vehicleMake = '';
        this.vehicleModel = '';
        this.licensePlate = '';
        this.vin = '';
        this.inspectionDate = '';
        this.registrationDate = '';
        this.insuranceDate = '';
        this.instructorBrakeDate = '';
        this.notes = '';
        this.odometer = '';
        this.initialMileage = '';
        this.description = '';
        this.selectedLocation = '';
        this.selectedVehicleType = '';
        this.selectedGPSTracker = '';
        this.selectedVehicleYear = '';

        this.updatedVehicleName = '';
        this.updatedVehicleNo = '';
        this.updatedVehicleMake = '';
        this.updatedVehicleModel = '';
        this.updatedLicensePlate = '';
        this.updatedVin = '';
        this.updatedInspectionDate = '';
        this.updatedRegistrationDate = '';
        this.updatedInsuranceDate = '';
        this.updatedInstructorBrakeDate = '';
        this.updatedNotes = '';
        this.updatedMileage = '';
        this.updatedOdometer = '';
        this.updatedDescription = '';
        this.updatedLocation = '';
        this.updatedVehicleType = '';
        this.updatedGPSTracker = '';
        this.updatedVehicleYear = '';
        this.updatedStatus = '';
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
     * Searches for the created/updated Vehicle in the data table and clicks Edit.
     * Retries up to maxRetries times with page reload and status filtering to allow DB/UI reflection.
     * @param {string} [vehicleName=this.vehicleName] - Vehicle name to search.
     * @param {number} [maxRetries=5] - Maximum retry attempts.
     **/
    async searchAndEditVehicle(vehicleName = this.vehicleName, maxRetries = 5) {
        await test.step(`Search and edit Vehicle: "${vehicleName}"`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForLoadState('load').catch(() => { });
                await this.waitForLoaders();
                await this.waitForVisible(this.searchTextbox);
                await this.fill(this.searchTextbox, '');
                await this.fill(this.searchTextbox, vehicleName);
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
     * Opens the Status filter dropdown on the Vehicles tab, selects All status, and closes the dropdown.
     **/
    async filterByAllStatus() {
        await test.step('Filter Vehicles by All status', async () => {
            await this.waitForLoaders();
            if (await this.statusFilterDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(this.statusFilterDropdown);
                await this.waitForVisible(this.selectAllStatusCheckbox);
                await this.click(this.selectAllStatusCheckbox, { force: true });
                // Close dropdown after selection
                await this.click(this.statusFilterDropdown);
                await this.waitForLoaders();
                await this.page.waitForTimeout(1000);
            }
        });
    }

    /**
     * Modifies vehicle fields on the Edit form according to update rules.
     * @param {Object} data - Update data from fixture.
     **/
    async editVehicleDetails(data = {}) {
        await test.step('Update Vehicle fields', async () => {
            await this.waitForLoaders();

            this.updatedVehicleName = `${data.updatedVehicleNamePrefix || 'Updated_Vehicle'}_${this.uniqueId || Date.now()}`;
            this.updatedVehicleNo = `${Date.now()} ${Math.floor(1000 + Math.random() * 9000)}`;
            this.updatedVehicleMake = data.updatedVehicleMake || 'Honda';
            this.updatedVehicleModel = data.updatedVehicleModel || 'Civic';
            this.updatedLicensePlate = `${data.licensePlatePrefix || 'LP'}${Math.floor(1000 + Math.random() * 9000)}`;
            this.updatedVin = `${data.vinPrefix || 'VIN'}${Math.floor(10000 + Math.random() * 90000)}`;
            this.updatedInspectionDate = data.updatedInspectionDate || '12152028';
            this.updatedRegistrationDate = data.updatedRegistrationDate || '12152028';
            this.updatedInsuranceDate = data.updatedInsuranceDate || '12152028';
            this.updatedInstructorBrakeDate = data.updatedInstructorBrakeDate || '12152028';
            this.updatedNotes = data.updatedNotes || 'Updated Vehicle Note';
            this.updatedMileage = data.updatedInitialMileage || '950';
            this.updatedOdometer = data.updatedOdometerValue || '1550';
            this.updatedDescription = data.updatedDescription || 'Updated Description';

            // 1. Vehicle Name
            if (await this.isVisible(this.vehicleNameInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.vehicleNameInput, this.updatedVehicleName);
            }

            // 2. Description
            if (await this.isVisible(this.descriptionInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.descriptionInput, this.updatedDescription);
            }

            // 3. Status: always select InActive
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusOptionInActive);
            await this.click(this.statusOptionInActive);
            this.updatedStatus = 'InActive';

            if (await this.page.locator("xpath=//select[@id='VehicleStatus']//parent::div[contains(@class,'open')]").isVisible().catch(() => false)) {
                await this.click(this.statusDropdown);
            }

            // 4. Location Dropdown: select last()
            if (await this.locationDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.locationDropdown);
                const locOptionLast = this.page.locator("xpath=(//select[@id='VehicleLocation']//parent::div//div//ul//li[not (contains (@class,'selected'))])[last()]");
                if (await locOptionLast.isVisible({ timeout: 1000 }).catch(() => false)) {
                    this.updatedLocation = (await locOptionLast.innerText()).trim();
                    await this.click(locOptionLast);
                }
            }

            // 5. Vehicle Type Dropdown: select last()
            if (await this.vehicleTypeDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.vehicleTypeDropdown);
                const typeOptionLast = this.page.locator("xpath=(//select[@id='VehicleType']//parent::div//div//ul//li[not (contains (@class,'selected'))])[last()]");
                if (await typeOptionLast.isVisible({ timeout: 1000 }).catch(() => false)) {
                    this.updatedVehicleType = (await typeOptionLast.innerText()).trim();
                    await this.click(typeOptionLast);
                }
            }

            // 6. GPS Tracker Dropdown: select last()
            if (await this.GPSTrackerDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.GPSTrackerDropdown);
                const gpsOptionLast = this.page.locator("xpath=(//select[@id='GPSTracker']//parent::div//div//ul//li[not (contains (@class,'selected'))])[last()]");
                if (await gpsOptionLast.isVisible({ timeout: 1000 }).catch(() => false)) {
                    this.updatedGPSTracker = (await gpsOptionLast.innerText()).trim();
                    await this.click(gpsOptionLast);
                }
            }

            // 7. Vehicle Year Dropdown: select last()
            if (await this.vehicleYearDropdown.isVisible({ timeout: 200 }).catch(() => false)) {
                await this.click(this.vehicleYearDropdown);
                const yearOptionLast = this.page.locator("xpath=(//select[@id='VehicleYear']//parent::div//div//ul//li[not (contains (@class,'selected'))])[last()]");
                if (await yearOptionLast.isVisible({ timeout: 1000 }).catch(() => false)) {
                    this.updatedVehicleYear = (await yearOptionLast.innerText()).trim();
                    await this.click(yearOptionLast);
                }
            }

            // 8. Vehicle Specs
            if (await this.isVisible(this.vehicleNoInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.vehicleNoInput, this.updatedVehicleNo);
            }

            if (await this.isVisible(this.vehicleMakeInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.vehicleMakeInput, this.updatedVehicleMake);
            }

            if (await this.isVisible(this.vehicleModelInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.vehicleModelInput, this.updatedVehicleModel);
            }

            if (await this.isVisible(this.licensePlateInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.licensePlateInput, this.updatedLicensePlate);
            }

            if (await this.isVisible(this.vinInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.vinInput, this.updatedVin);
            }

            if (await this.isVisible(this.inspectionInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.inspectionInput);
                await this.clear(this.inspectionInput)
                await this.pressSequentially(this.inspectionInput, this.updatedInspectionDate);
            }

            if (await this.isVisible(this.registrationInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.registrationInput);
                await this.clear(this.registrationInput)
                await this.pressSequentially(this.registrationInput, this.updatedRegistrationDate);
            }

            if (await this.isVisible(this.insuranceInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.insuranceInput);
                await this.clear(this.insuranceInput)
                await this.pressSequentially(this.insuranceInput, this.updatedInsuranceDate);
            }

            if (await this.isVisible(this.instructorBrakeInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.instructorBrakeInput);
                await this.clear(this.instructorBrakeInput)
                await this.pressSequentially(this.instructorBrakeInput, this.updatedInstructorBrakeDate);
            }

            // 9. Radio button: select alternate option ("No")
            if (await this.appointmentColorNoRadio.first().isVisible({ timeout: 500 }).catch(() => false)) {
                await this.click(this.appointmentColorNoRadio.first());
            } else if (await this.appointmentColorCheckboxWrapper.isVisible({ timeout: 200 }).catch(() => false)) {
                const isChecked = await this.appointmentColorCheckboxWrapper.evaluate(el => el.classList.contains('checked')).catch(() => false);
                if (isChecked) {
                    await this.click(this.appointmentColorCheckbox);
                }
            }

            // 10. Notes
            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.notesInput, this.updatedNotes);
            }

            // 11. Initial Mileage (if enabled)
            if (await this.isVisible(this.initialMileageInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.initialMileageInput, this.updatedMileage);
            }

            // 12. Odometer
            if (await this.isVisible(this.odometerValueInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.odometerValueInput, this.updatedOdometer);
            }
        });
    }

    /**
     * Verifies that the vehicle details in the form match the updated values.
     * @param {Object} [expectedDetails={}] - Optional expected vehicle details.
     **/
    async verifyUpdatedVehicleDetails(expectedDetails = {}) {
        await test.step('Verify updated Vehicle details in form', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.vehicleNameInput);

            const expectedVehicleName = this.updatedVehicleName;
            const expectedVehicleNo = this.updatedVehicleNo;
            const expectedVehicleMake = this.updatedVehicleMake;
            const expectedVehicleModel = this.updatedVehicleModel;
            const expectedLicensePlate = this.updatedLicensePlate;
            const expectedVin = this.updatedVin;
            const expectedInspectionDate = this.formatDateWithSlashes(this.updatedInspectionDate);
            const expectedRegistrationDate = this.formatDateWithSlashes(this.updatedRegistrationDate);
            const expectedInsuranceDate = this.formatDateWithSlashes(this.updatedInsuranceDate);
            const expectedInstructorBrakeDate = this.formatDateWithSlashes(this.updatedInstructorBrakeDate);
            const expectedNotes = this.updatedNotes;
            const expectedOdometer = this.updatedOdometer;
            const expectedDescription = this.updatedDescription;
            const expectedStatus = this.updatedStatus || 'Deleted';

            if (await this.isVisible(this.vehicleNameInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleNameInput).toHaveValue(expectedVehicleName);
            }

            if (expectedDescription && await this.isVisible(this.descriptionInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.descriptionInput).toHaveValue(expectedDescription);
            }

            if (await this.isVisible(this.statusDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.statusDropdown).toContainText(new RegExp(expectedStatus.trim(), 'i'));
            }

            if (this.updatedLocation && await this.isVisible(this.locationDropdown, { timeout: 100 }).catch(() => false)) {
                const actualLocation = (await this.locationDropdown.innerText()).trim().toLowerCase();
                const expLoc = this.updatedLocation.toLowerCase();
                expect(actualLocation).toContain(expLoc);
            }

            if (this.updatedVehicleType && await this.isVisible(this.vehicleTypeDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleTypeDropdown).toContainText(new RegExp(this.updatedVehicleType.trim(), 'i'));
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

            // appointmentColorCheckbox should be UNCHECKED
            if (await this.appointmentColorCheckboxWrapper.isVisible({ timeout: 100 }).catch(() => false)) {
                await expect(this.appointmentColorCheckboxWrapper).not.toHaveClass(/checked/);
            }

            if (this.updatedGPSTracker && await this.isVisible(this.GPSTrackerDropdown, { timeout: 100 }).catch(() => false)) {
                const actualGPS = (await this.GPSTrackerDropdown.innerText()).trim().toLowerCase();
                const expGPS = this.updatedGPSTracker.toLowerCase();
                expect(actualGPS).toContain(expGPS);
            }

            if (this.updatedVehicleYear && await this.isVisible(this.vehicleYearDropdown, { timeout: 100 }).catch(() => false)) {
                await expect(this.vehicleYearDropdown).toContainText(new RegExp(this.updatedVehicleYear.trim(), 'i'));
            }

            if (await this.isVisible(this.notesInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.notesInput).toHaveValue(expectedNotes);
            }

            if (await this.isVisible(this.odometerValueInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.odometerValueInput).toHaveValue(expectedOdometer);
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
