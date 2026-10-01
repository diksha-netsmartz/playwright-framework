import { test } from '@playwright/test';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import HomePageWidgets from '@pages/Common/HomePageWidgets';
import { credentials } from '@config/config';

/**
 * TC0083: CSM >> Quick links
 * Test Case Title: To Verify quick links are working
 * Expected Result: Staff is able to navigate and verify all Quick Links on the staff portal homepage across environments (or logs no quick links found if empty)
 **/
test('TC_083: CSM - To Verify quick links are working', { tag: ['@CSM', '@CSMQuickLinks'] }, async ({ page }) => {

  const staffLoginPage = new StaffLoginPage(page);
  const homePageWidgets = new HomePageWidgets(page, { portalType: 'staff' });

  await test.step('Step 1: Login to staff portal (CSM) with valid credentials', async () => {
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
  });

  await test.step('Step 2: Verify Quick Links widget is visible on Staff Home page', async () => {
    await homePageWidgets.verifyQuickLinksWidgetVisible();
  });

  await test.step('Step 3: Open each Quick Link and verify navigation', async () => {
    await homePageWidgets.openEachQuickLink(credentials);
  });
});
