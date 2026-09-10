import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import StaffAppointmentListPage from '../../pages/AdminApplication/Scheduling/StaffAppointmentListPage';
import login from '../../test-data/json/login.json';

/**
 * TC_048: C-Admin >> Scheduling >> Staff Appointment List
 * Test Case Title: To verify staff appointment list working
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Scheduling > Staff Appointment List
 *   Step 3 - Verify Start Date (1st of previous month) and End Date (today) are pre-selected
 *   Step 4 - Click on FILTER button
 * Expected Result:
 *   Staff appointment records should be displayed
 **/
test('TC_048: C-Admin >> Scheduling >> Staff Appointment List - To verify staff appointment list working', { tag: '@scheduling' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const staffAppointmentListPage = new StaffAppointmentListPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Staff Appointment List', async () => {
        await homePage.navigateToStaffAppointmentList();
    });

    await test.step('Step 3: Verify Start Date and End Date are pre-selected', async () => {
        await staffAppointmentListPage.verifyDatesPreSelected();
    });

    await test.step('Step 4: Click FILTER button and verify staff appointment records appear', async () => {
        await staffAppointmentListPage.clickFilter();
        await staffAppointmentListPage.verifyAppointmentsResultsDisplayed();
    });
});
