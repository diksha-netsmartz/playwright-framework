import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import SchedulerSettingsPage from '@pages/AdminApplication/Configuration/SchedulerSettingsPage';
import { credentials } from '@config/config';

/**
 * TC_130: C-Admin >> Configuration >> Scheduler Settings
 * Test Case Title: To Verify staff is able to update Scheduler settings
 * Precondition: Staff should login to C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2: Navigate to Configuration -> Scheduler Settings.
 *   Step 3: Update Scheduler Settings (toggle checkboxes, update pickup & drop-off locations) and verify success message.
 *   Step 4: Switch to Graphical Scheduler Settings tab.
 *   Step 5: Update Graphical Scheduler Settings (toggle checkbox, update setting value between 25 and 30) and verify success message.
 *   Step 6: Re-navigate to Configuration -> Scheduler Settings to verify persistence.
 *   Step 7: Verify updated values persisted for Scheduler Settings.
 *   Step 8: Switch to Graphical Scheduler Settings tab and verify updated values persisted.
 *
 * Expected Result:
 *   Staff should be able to update Scheduler settings and all updated values should persist after re-navigation.
 **/
test('TC_130: C-Admin >> Configuration >> Scheduler Settings - To Verify staff is able to update Scheduler settings', { tag: ['@CAdmin', '@configuration'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const schedulerSettingsPage = new SchedulerSettingsPage(page);

  let updatedSchedulerValues;
  let updatedGraphicalValues;

  await test.step('Step 1: Login to C-Admin', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 2: Navigate to Configuration -> Scheduler Settings', async () => {
    await homePage.navigateToSchedulerSettings();
  });

  await test.step('Step 3: Update Scheduler Settings and verify success message', async () => {
    updatedSchedulerValues = await schedulerSettingsPage.updateSchedulerSettings();
  });

  await test.step('Step 4 & 5: Switch to Graphical Scheduler Settings tab, update fields, and verify success message', async () => {
    await schedulerSettingsPage.navigateToGraphicalSchedulerSettingsTab();
    updatedGraphicalValues = await schedulerSettingsPage.updateGraphicalSchedulerSettings();
  });

  await test.step('Step 6: Re-navigate to Configuration -> Scheduler Settings to verify persistence', async () => {
    await homePage.navigateToSchedulerSettings();
  });

  await test.step('Step 7: Verify updated values persisted for Scheduler Settings', async () => {
    await schedulerSettingsPage.verifySchedulerSettings(updatedSchedulerValues);
  });

  await test.step('Step 8: Switch to Graphical Scheduler Settings tab and verify updated values persisted', async () => {
    await schedulerSettingsPage.navigateToGraphicalSchedulerSettingsTab();
    await schedulerSettingsPage.verifyGraphicalSchedulerSettings(updatedGraphicalValues);
  });
});