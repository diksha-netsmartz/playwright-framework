import { test } from '@playwright/test';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '@pages/StudentApplication/StudentPortalHomePage';
import { credentials } from '@config/config';
import StudentResourcesPage from '@pages/StudentApplication/StudentResourcesPage';

/**
 * TC_077: CSP >> Resources >> All Tabs
 * Test Case Title: To Verify all tabs are functional
 * Expected Result: All tabs under Resources should load and be functional
 **/
test('TC_077: CSP - Verify all tabs under Resources are functional', { tag: ['@CSP', '@CSPResources'] }, async ({ page }) => {

  const studentLoginPage = new StudentLoginPage(page);
  const studentHomePage = new StudentHomePage(page);
  const studentResourcesPage = new StudentResourcesPage(page);

  await test.step('Step 1: Login to student portal (CSP) with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 2: Navigate to Resources > Classes tab', async () => {
    await studentHomePage.navigateToClassInResources();
  });

  await test.step('Step 3: Open each tab under Resources', async () => {
    await studentResourcesPage.openEachTab();
  });
});