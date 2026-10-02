import { test } from '@playwright/test';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';
import SidebarNavigationComponent from '@pages/Common/SidebarNavigationComponent';
import { credentials } from '@config/config';

/**
 * TC_080: CSP >> Left Navigation
 * Test Case Title: To Verify all links in left navigation are working.
 * Expected Result: Student is able to navigate through all links and submenus in the left navigation sidebar across environments
 **/
test('TC_080: CSP - To Verify all links in left navigation are working', { tag: ['@CSP', '@CSPHomepage'] }, async ({ page }) => {
  test.setTimeout(600000);
  const studentLoginPage = new StudentLoginPage(page);
  const sidebarNav = new SidebarNavigationComponent(page, { portalType: 'student' });

  await test.step('Step 1: Login to student portal (CSP) with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 2: Navigate and verify each link and submenu in the left navigation', async () => {
    await sidebarNav.openEachLinkInLeftSidebar(credentials);
  });
});
