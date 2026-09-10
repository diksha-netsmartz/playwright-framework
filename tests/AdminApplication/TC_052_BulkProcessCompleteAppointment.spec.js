import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import BulkProcessPage from '../../pages/AdminApplication/Scheduling/ManageTimeSlots/BulkProcessPage';
import login from '../../test-data/json/login.json';

/**
 * TC_052: C-Admin >> Scheduling >> Manage Time Slots >> Bulk Process
 * Test Case Title: To Verify user able to complete appointment
 * Precondition: Appointments should exist in the selected past date range
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Scheduling > Manage Time Slots > Bulk Process
 *   Step 3 - Select the appointment type -- Show All
 *   Step 4 - Select past whole month date range and click on Filter button
 *   Step 5 - Select the complete checkbox for any appointment
 *   Step 6 - Scroll down to end of the page, click on UPDATE button, and confirm modal
 * Expected Result:
 *   Appointment status should change to completed ("Appointments status updated successfully!!")
 **/
test('TC_052: C-Admin >> Scheduling >> Manage Time Slots >> Bulk Process - To Verify user able to complete appointment', { tag: '@scheduling' }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const bulkProcessPage = new BulkProcessPage(page);

  const credentials = login[process.env.ENV || 'coreServer2'];

  await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 2: Navigate to Scheduling -> Manage Time Slots -> Bulk Process', async () => {
    await homePage.navigateToBulkProcess();
  });

  await test.step('Step 3: Select appointment type "Show All", past whole month date range, and apply filter', async () => {
    await bulkProcessPage.filterAppointments();
  });

  await test.step('Step 4: Select the Complete checkbox for an appointment', async () => {
    await bulkProcessPage.selectCompleteCheckbox();
  });

  await test.step('Step 5: Scroll down, click UPDATE button, confirm modal, and verify completion status', async () => {
    await bulkProcessPage.clickUpdateAndVerifyCompleted();
  });
});