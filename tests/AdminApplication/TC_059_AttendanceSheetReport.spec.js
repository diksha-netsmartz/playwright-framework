import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import BusinessReportsPage from '../../pages/AdminApplication/ReportCenter/BusinessReportsPage';
import login from '../../test-data/json/login.json';

/**
 * TC_059: C-Admin >> Report Center >> Business Report
 * Test Case Title: To verify that Attendance Sheet Report report is getting downloaded
 * Precondition: User should have valid admin login credentials and classroom record
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Report Center >> Business Reports
 *   Step 3 - Search for Attendance Sheet Report and click on the report under Select Report
 *   Step 4 - Search for cr and select the cr from the list (automationCR)
 *   Step 5 - Check the show score checkbox
 *   Step 6 - Click on Download button and verify report downloaded successfully
 * Expected Result:
 *   Report should get downloaded successfully and attached to the test report
 **/
test('TC_059: C-Admin >> Report Center >> Business Report - To verify that Attendance Sheet Report report is getting downloaded', { tag: '@reportCenter' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const businessReportsPage = new BusinessReportsPage(page);

    const env = process.env.ENV || 'coreServer2';
    const credentials = login[env];
    const crNames = {
        uat: 'CR2026',
        staging: 'CR26',
        coreServer1: 'CR26',
        coreServer2: 'automationCR'
    };
    const crName = crNames[env];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Report Center > Business Reports', async () => {
        await homePage.navigateToBusinessReports();
    });

    await test.step('Step 3: Search and select Attendance Sheet Report', async () => {
        await businessReportsPage.searchAndSelectReport('Attendance Sheet');
    });

    await test.step(`Step 4: Search and select CR: "${crName}"`, async () => {
        await businessReportsPage.searchAndSelectAttendanceSheetCR(crName);
    });

    await test.step('Step 5: Check "Show Score" checkbox', async () => {
        await businessReportsPage.checkShowScoreCheckbox();
    });

    await test.step('Step 6: Click Download and verify report downloaded successfully', async () => {
        const download = await businessReportsPage.downloadAttendanceSheetReport();
        await businessReportsPage.verifyAttendanceSheetReportDownloaded(download, crName);
    });
});