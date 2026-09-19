import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import BusinessReportsPage from '@pages/AdminApplication/ReportCenter/BusinessReportsPage';
import { credentials } from '@config/config';

/**
 * TC_065: C-Admin >> Report Center >> Business Report
 * Test Case Title: To verify that Student Event Logs report is getting downloaded
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Report Center >> Business Reports
 *   Step 3 - Search for Student Event Logs and click on the report under Select Report
 *   Step 4 - Search and select the student (student1 / testautomation_donotuse)
 *   Step 5 - Click on Export Into Excel and verify report downloaded successfully
 * Expected Result:
 *   Report should get downloaded successfully with expected columns and sheet name
 **/
test('TC_065: C-Admin >> Report Center >> Business Report - To verify that Student Event Logs report is getting downloaded', { tag: '@reportCenter' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const businessReportsPage = new BusinessReportsPage(page);

    const studentName = credentials.studentUser?.name || 'testautomation_donotuse';

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Report Center > Business Reports', async () => {
        await homePage.navigateToBusinessReports();
    });

    await test.step('Step 3: Search and select Student Event Logs Report', async () => {
        await businessReportsPage.searchAndSelectReport('Student Event Logs');
    });

    await test.step(`Step 4: Search and select student: "${studentName}"`, async () => {
        await businessReportsPage.searchAndSelectStudentForEventLogs(studentName);
    });

    await test.step('Step 5: Click on Export Into Excel and verify report downloaded successfully with expected columns and sheet name', async () => {
        const download = await businessReportsPage.exportStudentEventLogsToExcel();
        await businessReportsPage.verifyStudentEventLogsExcelDownloaded(download, studentName);
    });
});