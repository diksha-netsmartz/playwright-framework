import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import BusinessReportsPage from '@pages/AdminApplication/ReportCenter/BusinessReportsPage';
import { credentials } from '@config/config';

/**
 * TC_060: C-Admin >> Report Center >> Business Report
 * Test Case Title: To verify that Classroom Absences Report report is getting downloaded
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Report Center >> Business Reports
 *   Step 3 - Search for Classroom Absences Report and click on the report under Select Report
 *   Step 4 - Select start date as 1-1-2026 and end date as 12-31-2026
 *   Step 5 - Click on Export to Excel button and verify file downloaded successfully
 * Expected Result:
 *   Report should get downloaded successfully as Excel and attached to the test report
 **/
test('TC_060: C-Admin >> Report Center >> Business Report - To verify that Classroom Absences Report report is getting downloaded', { tag: ['@CAdmin', '@reportCenter'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const businessReportsPage = new BusinessReportsPage(page);

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Report Center > Business Reports', async () => {
        await homePage.navigateToBusinessReports();
    });

    await test.step('Step 3: Search and select Classroom Absences Report', async () => {
        await businessReportsPage.searchAndSelectReport('Classroom Absences');
    });

    await test.step('Step 4: Select date range in calendar (currentYear: Jan 1 to Dec 31)', async () => {
        await businessReportsPage.enterClassroomAbsencesDateRange('currentYear');
    });

    await test.step('Step 5: Click Export to Excel and verify download', async () => {
        const download = await businessReportsPage.exportClassroomAbsencesToExcel();
        await businessReportsPage.verifyClassroomAbsencesExcelDownloaded(download);
    });
});
