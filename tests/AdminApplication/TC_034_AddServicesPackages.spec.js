import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import ServicesPackagesPage from '../../pages/AdminApplication/AccountManagement/Services/ServicesPackagesPage';
import login from '../../test-data/json/login.json';
import servicesData from '../../test-data/json/servicesPackagesData.json';

/**
 * TC_034: C-Admin >> Account Management >> Services >> Services
 * Test Case Title: To verify user able to add Services
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Account Management > Services > Services (Packages)
 *   Step 3 - Click on "Add New" and fill all required fields (prefix + Date.now() for service name, Active status)
 *   Step 4 - Click on Save
 *   Step 5 - Verify service is created successfully and visible on the grid
 * Expected Result:
 *   Service should be created successfully and visible on the grid
 **/
test('TC_034: C-Admin >> Account Management >> Services >> Services - To verify user able to add Services', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const servicesPage = new ServicesPackagesPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Account Management > Services > Services (Packages)', async () => {
        await homePage.navigateToServicesPackages();
    });

    await test.step('Step 3: Click "Add New" and fill service details', async () => {
        await servicesPage.clickAddNew();
        await servicesPage.fillServiceDetails(servicesData);
    });

    await test.step('Step 4: Click on Save button and verify message', async () => {
        await servicesPage.clickSave();
        await servicesPage.verifyServiceAddedSuccessfully();
    });


    await test.step('Step 5: Verify service is created successfully and visible on the grid', async () => {
        await servicesPage.verifyServiceVisibleInGrid();
    });

    await test.step('Step 6: Delete the created service and verify deletion', async () => {
        await servicesPage.deleteService();
        await servicesPage.verifyServiceDeletedSuccessfully();
    });
});