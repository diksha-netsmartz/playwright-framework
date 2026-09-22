import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import BusinessReportsPage from '@pages/AdminApplication/ReportCenter/BusinessReportsPage';
import { credentials, currentEnv } from '@config/config';

/**
 * TC_057: C-Admin >> Report Center >> Business Report
 * Test Case Title: To verify that Classroom Attendance History report is getting downloaded
 * Precondition: User should have valid admin login credentials and student record
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Report Center >> Business Reports
 *   Step 3 - Search for Classroom Attendance History Report and click on the report under Select Report
 *   Step 4 - Search for student and select the student from the list (using student from login credentials)
 *   Step 5 - Click on "Show CR Attendance History" (report opens in a new tab)
 *   Step 6 - Click on the Export to PDF button and verify report downloaded successfully
 * Expected Result:
 *   Report should get downloaded successfully as PDF and attached to the test report
 **/
test('TC_057: C-Admin >> Report Center >> Business Report - To verify that Classroom Attendance History report is getting downloaded', { tag: ['@CAdmin', '@reportCenter'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const businessReportsPage = new BusinessReportsPage(page);

    const studentName = credentials.studentUser.name;
    const reportName = currentEnv === 'coreServer2' ? 'Classroom Attendance History' : 'CR Attendance History';

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Report Center > Business Reports', async () => {
        await homePage.navigateToBusinessReports();
    });

    await test.step(`Step 3: Search and select ${reportName} Report`, async () => {
        await businessReportsPage.searchAndSelectReport(reportName);
    });

    await test.step(`Step 4: Search and select student: "${studentName}"`, async () => {
        await businessReportsPage.searchAndSelectStudent(studentName);
    });

    let reportPage;
    await test.step('Step 5: Click on "Show CR Attendance History" button', async () => {
        reportPage = await businessReportsPage.clickShowCrAttendanceHistory();
    });

    await test.step('Step 6: Export to PDF and verify report download and content matches web page', async () => {
        const download = await businessReportsPage.exportAttendanceHistoryToPdf(reportPage);
        await businessReportsPage.verifyAttendanceHistoryPdf(download, reportPage);
    });
});