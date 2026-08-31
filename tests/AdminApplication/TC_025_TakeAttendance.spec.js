import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import ClassListPage from '../../pages/AdminApplication/Classroom/ClassListPage';
import ClassroomAttendancePage from '../../pages/AdminApplication/Classroom/ClassroomAttendancePage';
import login from '../../test-data/json/login.json';

/**
 * TC_025: C-Admin > Classroom > Attendance > Take Attendance
 * Test Case Title: To verify user is able to take attendance
 * Precondition: User should have valid admin login credentials and at least one classroom created
 * Expected Result: Attendance should be marked successfully for that session and student
 **/
test('TC_025: C-admin > Classroom > Attendance - Take Attendance', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const attendancePage = new ClassroomAttendancePage(page);

  const credentials = login[process.env.ENV || 'coreServer2'];

  await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 2: Navigate to Classroom >> Attendance tab', async () => {
    await homePage.navigateToAttendance();
  });

  await test.step('Step 3: Select a Classroom session with student records', async () => {
    await attendancePage.selectSession();
  });

  await test.step('Step 4: Randomly select radio button (Present or Absent) for a student', async () => {
    await attendancePage.markRandomAttendance();
  });

  await test.step('Step 5: Click on SAVE button to submit attendance', async () => {
    await attendancePage.saveAttendance();
  });

  await test.step('Step 6: Verify attendance is marked successfully confirmation', async () => {
    await attendancePage.verifyAttendanceMarkedSuccessfully();
  });

  await test.step('Step 7: Verify that the checked count for the selected status increased by 1', async () => {
    await attendancePage.verifyAttendanceCountIncremented();
  });
});