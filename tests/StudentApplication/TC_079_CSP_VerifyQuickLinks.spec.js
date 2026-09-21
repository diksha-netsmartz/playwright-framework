import { test } from '@playwright/test';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '@pages/StudentApplication/StudentPortalHomePage';
import { credentials } from '@config/config';

/**
 * TC_079: CSP >> Quick links
 * Test Case Title: To Verify Quick links are working
 * Expected Result: Student is able to navigate and verify all Quick Links on the student portal homepage across environments
 **/
test('TC_079: CSP - To Verify Quick links are working', { tag: '@CSPHomepage' }, async ({ page }) => {

  const studentLoginPage = new StudentLoginPage(page);
  const studentHomePage = new StudentHomePage(page);

  await test.step('Step 1: Login to student portal (CSP) with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 2: Verify Quick Links widget is visible on Student Home page', async () => {
    await studentHomePage.verifyQuickLinksWidgetVisible();
  });

  await test.step('Step 3: Open each Quick Link and verify navigation', async () => {
    await studentHomePage.openEachQuickLink();
  });
});
