import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import LocationsPage from '@pages/AdminApplication/AccountManagement/LocationsPage';
import { credentials } from '@config/config';
import locationData from '@test-data/json/locationData.json';

/**
 * TC_036: C-Admin >> Account Management >> Locations
 * Test Case Title: To verify user able to add / edit location
 * Precondition: User should have valid admin login credentials
 * Expected Result:
 *   1. Location should be created successfully
 *   2. Location should be edited successfully
 **/
test('TC_036: C-Admin >> Account Management >> Locations - To verify user able to add / edit location', { tag: '@accountManagement' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const locationsPage = new LocationsPage(page);

    let createdLocation;

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Account Management > Locations', async () => {
        await homePage.navigateToLocations();
    });

    await test.step('Step 3: Click "Add New" and fill location details', async () => {
        await locationsPage.clickAddNew();
        createdLocation = await locationsPage.fillLocationDetails(locationData);
    });

    await test.step('Step 4: Click Save and verify location created successfully', async () => {
        await locationsPage.saveLocation();
    });

    await test.step('Step 5: Search the created location, click Edit, and verify added details', async () => {
        await locationsPage.searchAndEditLocation(createdLocation.locationName);
        await locationsPage.verifyLocationDetails(locationData);
    });

    await test.step('Step 6: Edit location details and set status to Deleted for cleanup', async () => {
        await locationsPage.editLocationDetails(locationData);
    });

    await test.step('Step 7: Click Save and verify location updated successfully', async () => {
        await locationsPage.saveUpdatedLocation();
    });

    await test.step('Step 8: Search the updated location, click Edit, and verify updated details', async () => {
        await locationsPage.searchAndEditLocation(locationsPage.locationName, 5);
        await locationsPage.verifyUpdatedLocationDetails(locationData);
    });
});