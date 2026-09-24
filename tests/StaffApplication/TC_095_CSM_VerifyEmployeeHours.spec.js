import { test } from '@playwright/test';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';
import StaffProfilePage from '@pages/StaffApplication/StaffProfilePage';
import { credentials } from '@config/config';

/**
 * TC0095: CSM >> My Profile >> other tabs
 * Test Case Title: To verify Employee hours
 * Precondition: Staff user has valid login credentials
 * Steps:
 *   Step 1 - Login to the staff mobile portal
 *   Step 2 - From the side menu, navigate to Profile
 *   Step 3 - Verify both teaching and other tabs are accessible
 * Expected Result:
 *   Both teaching and other tabs are accessible. If no tabs other than My Profile are present, print the same in the report.
 **/
test('TC_095: CSM - To verify Employee hours and profile tabs accessibility', { tag: ['@CSM', '@CSMMyProfile'] }, async ({ page }) => {

  const staffLoginPage = new StaffLoginPage(page);
  const staffHomePage = new StaffHomePage(page);
  const staffProfilePage = new StaffProfilePage(page);

  await test.step('Step 1: Login to the staff mobile portal (CSM) with valid credentials', async () => {
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
  });

  await test.step('Step 2: From the side menu, navigate to Profile', async () => {
    await staffHomePage.navigateToMyProfile();
  });

  await test.step('Step 3: Verify both teaching and other tabs are accessible', async () => {
    await staffProfilePage.clickEmployeeHoursTab();
    await staffProfilePage.clickOtherSubTab();
    await staffProfilePage.clickTeachingSubTab();
    await staffProfilePage.verifyTeachingEmpHoursVisible();
  });
});
