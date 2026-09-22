import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import BusinessReportsPage from '@pages/AdminApplication/ReportCenter/BusinessReportsPage';
import { credentials } from '@config/config';

/**
 * TC_062: C-Admin >> Report Center >> Business Report
 * Test Case Title: To verify that Student Info Report report is getting opened and exported
 * Precondition: User should have valid admin login credentials and student records
 * Steps:
 *   Step 1 - From the side menu, navigate to Report Center >> Business Reports
 *   Step 2 - Search for Student Info Report and click on the report under Select Report
 *   Step 3 - Search for the student (student1 / donotuse)
 *   Step 4 - Select all the BTW Statuses from BTW Status dropdown
 *   Step 5 - Click on Student Information and verify report opens in a new tab
 *   Step 6 - (Optional) Click Export TO PDF and verify downloaded PDF matches page content
 * Expected Result:
 *   Report should get opened successfully in another tab
 **/
test('TC_062: C-Admin >> Report Center >> Business Report - To verify that Student Info Report report is getting opened in a new tab', { tag: ['@CAdmin', '@reportCenter'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const businessReportsPage = new BusinessReportsPage(page);

    const studentName = credentials.studentUser.name;

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Report Center > Business Reports', async () => {
        await homePage.navigateToBusinessReports();
    });

    await test.step('Step 3: Search and select Student Info Report', async () => {
        await businessReportsPage.searchAndSelectReport('Student Info Report');
    });

    await test.step(`Step 4: Search and select student: "${studentName}"`, async () => {
        await businessReportsPage.searchAndSelectStudent(studentName);
    });

    await test.step('Step 5: Select all BTW Statuses from dropdown', async () => {
        await businessReportsPage.selectAllStudentInfoBtwStatuses();
    });

    await test.step('Step 6: Click Student Information and verify report opened in new tab with student details and field keys', async () => {
        const reportPage = await businessReportsPage.openStudentInformationReportTab();
        await businessReportsPage.verifyStudentInfoReportTab(reportPage, studentName);
        await businessReportsPage.exportAndAttachStudentInfoPdf(reportPage);
        await reportPage.close();
    });
});