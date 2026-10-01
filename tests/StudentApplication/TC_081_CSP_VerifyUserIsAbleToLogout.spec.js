import { test } from '@playwright/test';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';
import HeaderComponent from '@pages/Common/HeaderComponent';
import { credentials } from '@config/config';

/**
 * TC_081: CSP >> Logout
 * Test Case Title: To Verify user is able to logout.
 * Expected Result: Student user is able to log out from the student portal (CSP) and is redirected to the login page
 **/
test('TC_081: CSP - To Verify user is able to logout', { tag: ['@CSP', '@CSPLogout'] }, async ({ page }) => {

  const studentLoginPage = new StudentLoginPage(page);
  const header = new HeaderComponent(page, { portalType: 'student' });

  await test.step('Step 1: Login to student portal (CSP) with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 2: Logout from student portal', async () => {
    await header.logout();
  });

  await test.step('Step 3: Verify user is successfully logged out', async () => {
    await header.verifyLogoutSuccessful();
  });
});
