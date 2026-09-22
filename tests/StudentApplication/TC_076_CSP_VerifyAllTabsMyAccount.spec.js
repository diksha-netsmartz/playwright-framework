import { test } from '@playwright/test';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '@pages/StudentApplication/StudentPortalHomePage';
import StudentMyAccountPage from '@pages/StudentApplication/StudentMyAccountPage';
import { credentials } from '@config/config';

/**
 * TC_076: CSP >> My Accounts >> All Tabs
 * Test Case Title: To Verify all tabs are functional
 * Expected Result: All tabs under My Account (Overview, Profile, Enrollment/Billing, Appointments, Files, Quiz/Tests, Scan IN/OUT) should load and be functional
 **/
test('TC_076: CSP - Verify all tabs under My Account are functional', { tag: ['@CSP', '@CSPMyAccount'] }, async ({ page }) => {

  const studentLoginPage = new StudentLoginPage(page);
  const studentHomePage = new StudentHomePage(page);
  const studentMyAccountPage = new StudentMyAccountPage(page);

  await test.step('Step 1: Login to student portal (CSP) with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 2: Navigate to My Account > Profile tab', async () => {
    await studentHomePage.navigateToProfile();
  });

  await test.step('Step 3: Open each tab under My Account and verify title', async () => {
    await studentMyAccountPage.openEachTabAndVerifyTitle();

  });
});