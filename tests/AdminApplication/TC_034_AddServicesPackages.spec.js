import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import ServicesPackagesPage from '@pages/AdminApplication/AccountManagement/Services/ServicesPackagesPage';
import { credentials } from '@config/config';
import servicesData from '@test-data/json/servicesPackagesData.json';

/**
 * TC_034: C-Admin >> Account Management >> Services >> Services
 * Test Case Title: To verify user able to add and update Services (Packages)
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Account Management > Services > Services (Packages)
 *   Step 3 - Click on "Add New" and fill service details
 *   Step 4 - Click on Save button and verify message
 *   Step 5 - Search the package, click Edit, and verify details
 *   Step 6 - Update service details and click Save
 *   Step 7 - Search for updated package, click Edit, and verify updated details
 * Expected Result:
 *   Service (Package) should be created, verified, updated, and verified successfully
 **/
test('TC_034: C-Admin >> Account Management >> Services >> Services - To verify user able to add and update Services', { tag: '@accountManagement' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const servicesPage = new ServicesPackagesPage(page);

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
        await servicesPage.clickSaveAndVerifySuccessMessage();
    });

    await test.step('Step 5: Search the package, click Edit, and verify details', async () => {
        await servicesPage.searchAndEditServicePackage(servicesPage.serviceName);
        await servicesPage.verifyServiceDetails(servicesData);
    });

    await test.step('Step 6: Update service details and click Save', async () => {
        await servicesPage.updateServiceDetails(servicesData);
        await servicesPage.clickSaveAndVerifySuccessMessage();
    });

    await test.step('Step 7: Search for updated package, click Edit, and verify updated details', async () => {
        await servicesPage.searchAndEditServicePackage(servicesPage.updatedServiceName);
        await servicesPage.verifyUpdatedServiceDetails(servicesData);
    });
});