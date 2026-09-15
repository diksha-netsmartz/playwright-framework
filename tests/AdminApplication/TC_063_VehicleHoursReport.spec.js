import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import BusinessReportsPage from '../../pages/AdminApplication/ReportCenter/BusinessReportsPage';
import login from '../../test-data/json/login.json';

/**
 * TC_063: C-Admin >> Report Center >> Business Report
 * Test Case Title: To verify that Vehicle Hours Report report is getting displayed in popup
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Report Center >> Business Reports
 *   Step 3 - Search for Vehicle Hours Report and click on the report under Select Report
 *   Step 4 - Select date range from 7/1/2026 to 8/31/2026
 *   Step 5 - Click on Display button
 *   Step 6 - Verify Vehicle Hours Report displays in popup modal with expected columns
 * Expected Result:
 *   Report should get displayed in pop-up modal with all column headers
 **/
test('TC_063: C-Admin >> Report Center >> Business Report - To verify that Vehicle Hours Report report is getting displayed in popup', { tag: '@reportCenter' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const businessReportsPage = new BusinessReportsPage(page);

    const env = process.env.ENV || 'coreServer2';
    const credentials = login[env];
    const reportNames = {
        uat: 'Vehicle Hours Summary Report',
        staging: 'Vehicle Hours Report',
        coreServer1: 'Vehicle Hours Report',
        coreServer2: 'Vehicle Hours Report'
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

    await test.step('Step 4: Select date range (1st of last month to last day of this month) via calendar', async () => {
        await businessReportsPage.selectVehicleHoursDateRange();
    });

    await test.step('Step 5: Click on Display button', async () => {
        await businessReportsPage.clickDisplayVehicleHoursReport();
    });

    await test.step('Step 6: Verify Vehicle Hours Report displayed in popup modal with all columns', async () => {
        await businessReportsPage.verifyVehicleHoursReportModal();
    });
});