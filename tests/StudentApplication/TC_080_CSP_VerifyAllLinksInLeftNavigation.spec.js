import { test } from '@playwright/test';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '@pages/StudentApplication/StudentPortalHomePage';
import { credentials } from '@config/config';

/**
 * TC_080: CSP >> Left Navigation
 * Test Case Title: To Verify all links in left navigation are working.
 * Expected Result: Student is able to navigate through all links and submenus in the left navigation sidebar across environments
 **/
test('TC_080: CSP - To Verify all links in left navigation are working', { tag: '@CSPHomepage' }, async ({ page }) => {

  const studentLoginPage = new StudentLoginPage(page);
  const studentHomePage = new StudentHomePage(page);

  await test.step('Step 1: Login to student portal (CSP) with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 2: Navigate and verify each link and submenu in the left navigation', async () => {
    await studentHomePage.openEachLinkInLeftSidebar();
  });
});
