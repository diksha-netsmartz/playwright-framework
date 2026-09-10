import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import VehicleListPage from '../../pages/AdminApplication/AccountManagement/VehicleListPage';
import login from '../../test-data/json/login.json';
import vehicleData from '../../test-data/json/vehicleData.json';

/**
 * TC_039: C-Admin >> Account Management >> Vehicle >> Vehicle List
 * Test Case Title: To verify user able to add / edit Vehicle
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Account Management > Vehicles > Vehicle List
 *   Step 3 - Click on "Add New" and fill all fields (Select Active status from dropdown & upload picture)
 *   Step 4 - Click on Save button and verify Vehicle is created successfully
 *   Step 5 - Search the created Vehicle and click on Edit
 *   Step 6 - Update fields (Vehicle Type, Status, Notes, Mileage) and save
 *   Step 7 - Verify Vehicle info is updated successfully
 * Expected Result:
 *   1. Vehicle should be created successfully
 *   2. Vehicle should be edited successfully
 **/
test('TC_039: C-Admin >> Account Management >> Vehicle >> Vehicle List - To verify user able to add / edit Vehicle', { tag: '@accountManagement' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const vehicleListPage = new VehicleListPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Account Management > Vehicles > Vehicle List', async () => {
        await homePage.navigateToVehicleList();
    });

    await test.step('Step 3: Click "Add New" and fill Vehicle details', async () => {
        await vehicleListPage.clickAddNew();
        await vehicleListPage.fillVehicleDetails(vehicleData);
    });

    await test.step('Step 4: Click on Save button and verify Vehicle created successfully', async () => {
        await vehicleListPage.clickSave();
        await vehicleListPage.verifyVehicleCreatedSuccessfully();
    });

    await test.step('Step 5: Search the created Vehicle and click on Edit', async () => {
        await vehicleListPage.searchAndEditVehicle();
    });

    await test.step('Step 6: Update fields and save edited Vehicle', async () => {
        await vehicleListPage.editVehicleDetails(vehicleData);
        await vehicleListPage.clickSave();
    });

    await test.step('Step 7: Verify Vehicle edited successfully', async () => {
        await vehicleListPage.verifyVehicleUpdatedSuccessfully();
    });
});