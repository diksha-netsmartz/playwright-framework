import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import BusinessReportsPage from '@pages/AdminApplication/ReportCenter/BusinessReportsPage';
import { credentials, currentEnv } from '@config/config';

/**
 * TC_064: C-Admin >> Report Center >> Business Report
 * Test Case Title: To verify that In-Car Evaluation Data Report is getting downloaded
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Report Center >> Business Reports
 *   Step 3 - Search for In-Car Evaluation Data Report and click on the report under Select Report
 *   Step 4 - Select date range from 7/1/2026 to 8/31/2026 (1st of last month to last day of this month via calendar)
 *   Step 5 - Click on Export To Excel and verify report downloaded successfully
 * Expected Result:
 *   Report should get downloaded successfully
 **/
test('TC_064: C-Admin >> Report Center >> Business Report - To verify that In-Car Evaluation Data Report is getting downloaded', { tag: '@reportCenter' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const businessReportsPage = new BusinessReportsPage(page);

    const reportNames = {
        uat: 'Evaluation Report',
        staging: 'Evaluation Report',
        coreServer1: 'Evaluation Report',
        coreServer2: 'In-Car Evaluation Data'
    };
    const reportName = reportNames[currentEnv];

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
        await businessReportsPage.selectInCarEvalDateRange();
    });

    await test.step('Step 5: Click on Export As Excel and verify report downloaded successfully with expected columns and sheet name', async () => {
        const download = await businessReportsPage.exportInCarEvaluationToExcel();
        await businessReportsPage.verifyInCarEvaluationExcelDownloaded(download);
    });
});