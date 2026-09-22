import { test } from '@playwright/test';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';
import { credentials } from '@config/config';

/**
 * TC_082: CSM >> Left Navigation
 * Test Case Title: To Verify all links are working
 * Expected Result: Staff is able to navigate through all links and submenus in the left navigation sidebar across environments
 **/
test('TC_082: CSM - To Verify all links in left navigation are working', { tag: ['@CSM', '@CSMHomepage'] }, async ({ page }) => {

  const staffLoginPage = new StaffLoginPage(page);
  const staffHomePage = new StaffHomePage(page);

  await test.step('Step 1: Login to staff portal (CSM) with valid credentials', async () => {
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
  });

  await test.step('Step 2: Navigate and verify each link and submenu in the left navigation', async () => {
    await staffHomePage.openEachLinkInLeftSidebar();
  });
});
