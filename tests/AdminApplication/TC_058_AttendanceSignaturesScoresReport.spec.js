import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import BusinessReportsPage from '@pages/AdminApplication/ReportCenter/BusinessReportsPage';
import { credentials, currentEnv } from '@config/config';

/**
 * TC_058: C-Admin >> Report Center >> Business Report
 * Test Case Title: To verify that Attendance Signatures/Scores Report report is getting downloaded
 * Precondition: User should have valid admin login credentials and classroom record
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Report Center >> Business Reports
 *   Step 3 - Search for Attendance Signatures/Scores Report and click on the report under Select Report
 *   Step 4 - Search for cr and select the cr from the list (cr to use - automationCR)
 *   Step 5 - Select Multi-Session
 *   Step 6 - Click on "Attendance Signatures/Scores PDF" and verify report downloaded successfully
 * Expected Result:
 *   Report should get downloaded successfully as PDF and attached to the test report
 **/
test('TC_058: C-Admin >> Report Center >> Business Report - To verify that Attendance Signatures/Scores Report report is getting downloaded', { tag: ['@CAdmin', '@reportCenter'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const businessReportsPage = new BusinessReportsPage(page);

    const crNames = {
        uat: 'CR2026',
        staging: 'CR26',
        coreServer1: 'CR26',
        coreServer2: 'automationCR'
    };
    const crName = crNames[currentEnv];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Report Center > Business Reports', async () => {
        await homePage.navigateToBusinessReports();
    });

    await test.step('Step 3: Search and select Attendance Signatures/Scores Report', async () => {
        await businessReportsPage.searchAndSelectReport('Attendance Signatures/Scores');
    });

    await test.step(`Step 4: Search and select CR: "${crName}"`, async () => {
        await businessReportsPage.searchAndSelectCR(crName);
    });

    await test.step('Step 5: Select Multi-Session', async () => {
        await businessReportsPage.selectMultiSession();
    });

    await test.step('Step 6: Click "Attendance Signatures/Scores PDF" and verify report download and content', async () => {
        const download = await businessReportsPage.downloadAttendanceSignaturesScoresPdf();
        await businessReportsPage.verifyAttendanceSignaturesScoresPdf(download, crName);
    });
});