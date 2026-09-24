import { test } from '@playwright/test';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';
import StaffAppointmentListPage from '@pages/StaffApplication/Scheduling/StaffAppointmentListPage';
import { credentials } from '@config/config';

/**
 * TC_093: CSM >> Scheduling >> Staff Appointment list
 * Test Case Title: To Verify staff Appointment list working
 * Precondition: Staff user has valid login credentials (using instructor credentials from TC_016)
 * Steps:
 *   Step 1 - Login to the staff mobile portal
 *   Step 2 - From side menu, navigate to scheduling > Staff Appointment List
 *   Step 3 - Select start date as start of this year (01/01/YYYY)
 *   Step 4 - Select end date as current date (MM/DD/YYYY)
 *   Step 5 - Click on filter
 * Expected Result:
 *   Data should appear in the grid
 **/
test('TC_093: CSM - To Verify staff Appointment list working', { tag: ['@CSM', '@CSMScheduling'] }, async ({ page }) => {

  const staffLoginPage = new StaffLoginPage(page);
  const staffHomePage = new StaffHomePage(page);
  const staffAppointmentListPage = new StaffAppointmentListPage(page);

  const startDate = staffAppointmentListPage.getStartOfCurrentYearDate();
  const endDate = staffAppointmentListPage.getCurrentDate();

  await test.step('Step 1: Login to the staff mobile portal (CSM) with valid credentials', async () => {
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
  });

  await test.step('Step 2: From side menu, navigate to Scheduling > Staff Appointment List', async () => {
    await staffHomePage.navigateToStaffAppointmentList();
  });

  await test.step(`Step 3: Select start date as start of this year (${startDate})`, async () => {
    await staffAppointmentListPage.setStartDate(startDate);
  });

  await test.step(`Step 4: Select end date as current date (${endDate})`, async () => {
    await staffAppointmentListPage.setEndDate(endDate);
  });

  await test.step('Step 5: Click on filter and verify data appears in the grid', async () => {
    await staffAppointmentListPage.clickFilter();
    await staffAppointmentListPage.verifyAppointmentsGridData();
  });

});