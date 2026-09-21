import { test } from '@playwright/test';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '@pages/StudentApplication/StudentPortalHomePage';
import { credentials } from '@config/config';

/**
 * TC_075: CSP >> My Schedule
 * Test Case Title: To Verify My schedule is working
 * Steps:
 *  Step 1: Open CSP (Login with valid student credentials)
 *  Step 2: From the side menu, navigate to my schedule under scheduling
 * Expected Result: Student is able to navigate to My Schedule under Scheduling
 **/
test('TC_075: CSP - To Verify My schedule is working', { tag: '@CSPScheduling' }, async ({ page }) => {

  const studentLoginPage = new StudentLoginPage(page);
  const studentHomePage = new StudentHomePage(page);

  await test.step('Step 1: Open CSP - Login to student portal with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 2: From the side menu, navigate to my schedule under scheduling', async () => {
    await studentHomePage.navigateToMySchedule();
  });
});
