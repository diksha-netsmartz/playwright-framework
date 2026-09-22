import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import BusinessReportsPage from '@pages/AdminApplication/ReportCenter/BusinessReportsPage';
import { credentials } from '@config/config';

/**
 * TC_066: C-Admin >> Report Center >> Business Report
 * Test Case Title: To verify that High School Report is getting displayed in popup
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Report Center >> Business Reports
 *   Step 3 - Search for High School Report and click on the report under Select Report
 *   Step 4 - Click on "Date Created" radio button
 *   Step 5 - Select date range (1st of last month to last day of this month) in date range textbox
 *   Step 6 - Select all the checkboxes in front of High School
 *   Step 7 - Click on Display button
 *   Step 8 - Verify High School Report is displayed in popup modal
 * Expected Result:
 *   Report should get displayed in pop-up modal with High School and # of Students
 **/
test('TC_066: C-Admin >> Report Center >> Business Report - To verify that High School Report is getting displayed in popup', { tag: ['@CAdmin', '@reportCenter'] }, async ({ page }) => {
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

    await test.step('Step 3: Search and select High School Report', async () => {
        await businessReportsPage.searchAndSelectReport('High School Report');
    });

    await test.step('Step 4: Select "Date Created" radio button', async () => {
        await businessReportsPage.selectHighSchoolDateCreatedRadio();
    });

    await test.step('Step 5: Enter date range in textbox', async () => {
        await businessReportsPage.enterHighSchoolDateRange();
    });

    await test.step('Step 6: Select student status "Activated" from dropdown', async () => {
        await businessReportsPage.selectStudentStatusAsActivated();
    });

    await test.step('Step 7: Select all High Schools from dropdown', async () => {
        await businessReportsPage.selectAllHighSchools();
    });

    await test.step('Step 8: Click on Display button', async () => {
        await businessReportsPage.clickDisplayHighSchoolReport();
    });

    await test.step('Step 9: Verify High School Report displayed in popup modal', async () => {
        await businessReportsPage.verifyHighSchoolReportModal();
    });
});