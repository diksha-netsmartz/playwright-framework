import { test } from '@playwright/test';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';
import { credentials } from '@config/config';

/**
 * TC_101: CSM >> Logout
 * Test Case Title: To Verify user is able to logout.
 * Expected Result: Staff user is able to log out from the staff portal (CSM) and is redirected to the login page
 **/
test('TC_101: CSM - To Verify user is able to logout', { tag: ['@CSM', '@CSMLogout'] }, async ({ page }) => {

  const staffLoginPage = new StaffLoginPage(page);
  const staffHomePage = new StaffHomePage(page);

  await test.step('Step 1: Login to staff portal (CSM) with valid credentials', async () => {
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
  });

  await test.step('Step 2: Logout from staff portal', async () => {
    await staffHomePage.logout();
  });

  await test.step('Step 3: Verify user is successfully logged out', async () => {
    await staffLoginPage.verifyLogoutSuccessful();
  });
});
