import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import BusinessReportsPage from '../../pages/AdminApplication/ReportCenter/BusinessReportsPage';
import login from '../../test-data/json/login.json';

/**
 * TC_056: C-Admin >> Report Center >> Business Report
 * Test Case Title: To verify that Student Data Export Report is getting downloaded
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Report Center >> Business Reports
 *   Step 3 - Search for Student Data Export Report and click on the report under Select Report
 *   Step 4 - Click on "Date Activated" radio button
 *   Step 5 - Click on Select Date Range datepicker and select date range
 *   Step 6 - Click on "Filter Students" button
 *   Step 7 - Under Select Students, check the select all checkbox
 *   Step 8 - Under Select Data Fields, check all the fields
 *   Step 9 - Click on Export to Excel button and verify file downloaded successfully
 * Expected Result:
 *   Report should get downloaded successfully
 **/
test('TC_056: C-Admin >> Report Center >> Business Report - To verify that Student Data Export Report is getting downloaded', { tag: '@reportCenter' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const businessReportsPage = new BusinessReportsPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Report Center > Business Reports', async () => {
        await homePage.navigateToBusinessReports();
    });

    await test.step('Step 3: Search and select Student Data Export Report', async () => {
        await businessReportsPage.searchAndSelectReport("Student Data Export");
    });

    await test.step('Step 4: Select "Date Activated" radio button', async () => {
        await businessReportsPage.selectDateActivated();
    });

    await test.step('Step 5: Select Date Range', async () => {
        await businessReportsPage.selectDateRange('currentMonth');
    });


    await test.step('Step 6: Click on Filter Students button', async () => {
        await businessReportsPage.clickFilterStudents();
    });

    await test.step('Step 7: Check Select All under Select Students', async () => {
        await businessReportsPage.selectAllStudents();
    });

    await test.step('Step 8: Check Select All under Select Data Fields', async () => {
        await businessReportsPage.selectAllDataFields();
    });

    await test.step('Step 9: Click on Export to Excel and verify download', async () => {
        const download = await businessReportsPage.clickExportIntoExcel();
        await businessReportsPage.verifyExcelDownloaded(download);
    });
});