import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import BusinessReportsPage from '../../pages/AdminApplication/ReportCenter/BusinessReportsPage';
import login from '../../test-data/json/login.json';
import TestDataGenerator from '../../utils/TestDataGenerator';

/**
 * TC_061: C-Admin >> Report Center >> Business Report
 * Test Case Title: To verify that BTW Data Export Report report is getting downloaded and filter save/delete workflow works
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - From the side menu, navigate to Report Center >> Business Reports
 *   Step 2 - Search for BTW Data Export Report and click on the report under Select Report
 *   Step 3 - Select 3-month date range (previous month start to next month end)
 *   Step 4 - Select all the checkboxes under Select Data Fields
 *   Step 5 - Click on Export Into Excel and verify file downloaded successfully (sheet: BTWOpening_Schedule, 24 columns)
 *   Step 6 - Click on Save as New Filter
 *   Step 7 - Enter Filter Name, Filter Status as "Active", select "Only Me" under "who can see filter"
 *   Step 8 - Click on Save and verify "Filter Saved Sucessfully." message
 *   Step 9 - Close the popup
 *   Step 10 - Click on Edit Filter
 *   Step 11 - Click on the delete icon and confirm "Yes" on confirmation popup
 *   Step 12 - Verify "Filter deleted Sucessfully" message
 * Expected Result:
 *   - Report should get downloaded successfully with sheet 'BTWOpening_Schedule' and all 24 columns verified
 *   - "Filter Saved Sucessfully." message should display
 *   - "Filter deleted Sucessfully" message should display
 **/
test('TC_061: C-Admin >> Report Center >> Business Report - To verify that BTW Data Export Report report is getting downloaded and filter management works', { tag: '@reportCenter' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const businessReportsPage = new BusinessReportsPage(page);

    const filterName = TestDataGenerator.generateUniqueId('BTW Filter');
    const env = process.env.ENV || 'coreServer2';
    const credentials = login[env];
    const reportNames = {
        uat: 'BTW Openings and Schedule Report',
        staging: 'BTW Openings and Schedule Report',
        coreServer1: 'BTW Openings and Schedule Report',
        coreServer2: 'BTW Data Export'
    };
    const reportName = reportNames[env];


    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Report Center > Business Reports', async () => {
        await homePage.navigateToBusinessReports();
    });

    await test.step(`Step 3: Search and select ${reportName}`, async () => {
        await businessReportsPage.searchAndSelectReport(reportName);
    });

    await test.step('Step 4: Enter 3-month appointment date range (previous month start to next month end)', async () => {
        await businessReportsPage.enterBtwAppointmentDateRange();
    });

    await test.step('Step 5: Select all Data Fields for BTW Data Export', async () => {
        await businessReportsPage.selectAllBtwDataFields();
    });

    await test.step('Step 6: Click Export Into Excel and verify file downloaded', async () => {
        const download = await businessReportsPage.exportBtwDataToExcel();
        await businessReportsPage.verifyBtwDataExportExcelDownloaded(download);
    });

    await test.step(`Step 7 & 8: Save new filter "${filterName}" and verify success notification`, async () => {
        await businessReportsPage.saveNewFilter(filterName, 'Active');
    });

    await test.step('Step 9 & 10: Open Edit Filter modal, delete filter, confirm Yes and verify deletion message', async () => {
        await businessReportsPage.deleteFilter(filterName);
    });
});