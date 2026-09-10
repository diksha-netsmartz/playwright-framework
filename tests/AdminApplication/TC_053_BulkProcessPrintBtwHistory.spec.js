import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import BulkProcessPage from '../../pages/AdminApplication/Scheduling/ManageTimeSlots/BulkProcessPage';
import login from '../../test-data/json/login.json';

/**
 * TC_053: C-Admin >> Scheduling >> Manage Time Slots >> Bulk Process
 * Test Case Title: To verify user able to print BTW history
 * Precondition: Appointments should exist in the selected past date range
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Scheduling > Manage Time Slots > Bulk Process
 *   Step 3 - Select the appointment type -- Show All
 *   Step 4 - Select past whole month date range and click on Filter button
 *   Step 5 - Select the Print BTW History checkbox for any appointment (2nd checkbox in row)
 *   Step 6 - Scroll down to end of the page and click on Print BTW history button
 *   Step 7 - Verify downloaded PDF contains all expected table column names
 * Expected Result:
 *   The BTW History PDF should download successfully and contain expected table columns
 **/
test('TC_053: C-Admin >> Scheduling >> Manage Time Slots >> Bulk Process - To verify user able to print BTW history', { tag: '@scheduling' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const bulkProcessPage = new BulkProcessPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling -> Manage Time Slots -> Bulk Process', async () => {
        await homePage.navigateToBulkProcess();
    });

    await test.step('Step 3: Select appointment type "Show All", past whole month date range, and apply filter', async () => {
        await bulkProcessPage.filterAppointments();
    });

    await test.step('Step 4: Select the Print BTW History checkbox for an appointment', async () => {
        await bulkProcessPage.selectPrintBtwHistoryCheckbox();
    });

    let download;
    await test.step('Step 5: Scroll down, click Print BTW History button, and download PDF', async () => {
        download = await bulkProcessPage.printBtwHistoryAndVerifyDownload();
    });

    await test.step('Step 6: Verify table column names in the downloaded BTW History PDF', async () => {
        await bulkProcessPage.verifyBtwHistoryPdfColumns(download);
    });
});
