import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import SettingsPage from '@pages/AdminApplication/Configuration/SettingsPage';
import { credentials } from '@config/config';

/**
 * TC_131: C-Admin >> Configuration >> User Rights
 * Test Case Title: To Verify staff is able to update user rights
 * Precondition: Login to C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2: Click on configuration
 *   Step 3: Click on user Rights
 *   Step 4: Click on Submit button.
 *   Step 5: Click on Instructor Tab.
 *   Step 6: Click on Submit button
 *
 * Expected Result:
 *   User rights should be saved successfully
 **/
test('TC_131: C-Admin >> Configuration >> User Rights - To Verify staff is able to update user rights', { tag: ['@CAdmin', '@configuration'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const settingsPage = new SettingsPage(page);

    await test.step('Step 1: Login to C-Admin', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2 & 3: Navigate to Configuration -> User Rights', async () => {
        await homePage.navigateToUserRights();
    });

    await test.step('Step 4: Click on Submit button and verify success message', async () => {
        await settingsPage.clickSubmitButton();
        await settingsPage.verifySuccessMessage();
    });

    await test.step('Step 5: Click on Instructor tab', async () => {
        await settingsPage.clickInstructorTab();
    });

    await test.step('Step 6: Click on Submit button and verify success message', async () => {
        await settingsPage.clickSubmitButton();
        await settingsPage.verifySuccessMessage();
    });
});
