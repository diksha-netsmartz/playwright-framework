import { test } from '@playwright/test';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '@pages/StudentApplication/StudentPortalHomePage';
import StudentAppointmentsPage from '@pages/StudentApplication/StudentAppointmentsPage';
import { credentials } from '@config/config';

/**
 * TC_074: CSP >> Scheduling >> Classroom makeup
 * Test Case Title: To Verify student is able to perform makeup
 * Precondition: Student should be enrolled in the classroom
 * Steps:
 *  Step 1: Open CSP (Login to student portal with valid credentials)
 *  Step 2: From the side menu, navigate to Appointments under My Account
 *  Step 3: Click on Select appointment type 
 *  Step 4: From dropdown select class and apply filter
 *  Step 5: Click on BOOK MAKEUP
 *  Step 6: Click on select to choose available makeup slot and verify enrollment success
 * Expected Result: Student is able to book makeup class and is enrolled successfully
 **/
test('TC_074: CSP - To Verify student is able to perform makeup', { tag: ['@CSPScheduling'] }, async ({ page }) => {

  const studentLoginPage = new StudentLoginPage(page);
  const studentHomePage = new StudentHomePage(page);
  const studentAppointmentsPage = new StudentAppointmentsPage(page);

  await test.step('Step 1: Open CSP - Login to Student Portal with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 2: From the side menu, navigate to Appointments under My Account', async () => {
    await studentHomePage.navigateToAppointments();
  });

  await test.step('Step 3 & 4: Select appointment type "Class" and apply filter', async () => {
    await studentAppointmentsPage.filterByAppointmentType();
  });

  await test.step('Step 5: Click on BOOK MAKEUP', async () => {
    await studentAppointmentsPage.clickBookMakeup();
  });

  await test.step('Step 6: Select makeup slot and verify enrollment success', async () => {
    await studentAppointmentsPage.selectMakeupSlot();
    await studentAppointmentsPage.verifyEnrollmentSuccess();
  });
});