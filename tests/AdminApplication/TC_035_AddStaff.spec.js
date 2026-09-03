import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import StaffPage from '../../pages/AdminApplication/AccountManagement/StaffPage';
import login from '../../test-data/json/login.json';
import staffData from '../../test-data/json/staffData.json';

/**
 * TC_035: C-Admin >> Account Management >> Staff
 * Test Case Title: To verify user is able to add staff
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Account Management > Staff
 *   Step 3 - Click on Add New and enter all required fields (Select Active status, upload profile picture)
 *   Step 4 - Click on continue (User should be navigated to Working Hours tab)
 *   Step 5 - Click Save (Information Saved Successfully message should display)
 *   Step 6 - Click close and verify staff is visible in the grid
 * Expected Result:
 *   1. "Information saved successfully." message should display
 *   2. Staff should be visible in the grid
 **/
test('TC_035: C-Admin >> Account Management >> Staff - To verify user is able to add staff', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const staffPage = new StaffPage(page);

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        const credentials = login[process.env.ENV || 'coreServer2'];
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: From the side menu, navigate to Account Management > Staff', async () => {
        await homePage.navigateToStaff();
    });

    await test.step('Step 3: Click on Add New and enter all required fields', async () => {
        await staffPage.clickAddNew();
        await staffPage.fillStaffDetails(staffData);
    });

    await test.step('Step 4: Click on continue and navigate to Working Hours tab', async () => {
        await staffPage.clickContinue();
    });

    await test.step('Step 5: Click Save and verify "Information saved successfully." message', async () => {
        await staffPage.clickSave();
        await staffPage.verifyStaffSavedSuccessfully();
    });

    await test.step('Step 6: Click close and verify staff is visible in the grid', async () => {
        await staffPage.clickClose();
        await staffPage.verifyStaffVisibleInGrid();
    });

    await test.step('Step 7: Click Edit on the created staff member', async () => {
        await staffPage.editStaff();
    });

    await test.step('Step 8: Change staff status to Deactivated', async () => {
        await staffPage.updateStatusToDeactivated();
    });

    await test.step('Step 9: Click Save and verify "Staff information updated" confirmation message', async () => {
        await staffPage.clickSave();
        await staffPage.verifyStaffUpdatedSuccessfully();
    });
});