import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import SecurityPoliciesPage from '@pages/AdminApplication/Configuration/SecurityPoliciesPage';
import { credentials } from '@config/config';

/**
 * TC_128: C-Admin >> Configuration >> Security Policies
 * Test Case Title: To Verify staff is able to update security policies
 * Precondition: Staff should login to C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2: Navigate to Configuration -> Security Policies.
 *   Step 3 & 4: Update Staff Password Policies fields (toggling between two values) and verify success message.
 *   Step 5, 6 & 7: Click on Student Password Policies tab, update fields (toggling between two values), and verify success message.
 *   Step 8: Re-navigate to Configuration -> Security Policies to verify persistence.
 *   Step 9: Verify updated values for Staff Password Policies.
 *   Step 10: Switch to Student Password Policies tab and verify updated values.
 *
 * Expected Result:
 *   Staff should be able to update staff policies and student policies, and all updated values should persist after re-navigation.
 **/
test('TC_128: C-Admin >> Configuration >> Security Policies - To Verify staff is able to update security policies', { tag: ['@CAdmin', '@configuration'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const securityPoliciesPage = new SecurityPoliciesPage(page);

  let updatedStaffValues;
  let updatedStudentValues;

  await test.step('Step 1: Login to C-Admin', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 2: Navigate to Configuration -> Security Policies', async () => {
    await homePage.navigateToSecurityPolicies();
  });

  await test.step('Step 3 & 4: Update Staff Password Policies and verify success message', async () => {
    updatedStaffValues = await securityPoliciesPage.updateStaffPasswordPolicies();
  });

  await test.step('Step 5, 6 & 7: Switch to Student Password Policies tab, update fields, and verify success message', async () => {
    await securityPoliciesPage.navigateToStudentPoliciesTab();
    updatedStudentValues = await securityPoliciesPage.updateStudentPasswordPolicies();
  });

  await test.step('Step 8: Re-navigate to Configuration -> Security Policies to verify persistence', async () => {
    await homePage.navigateToSecurityPolicies();
  });

  await test.step('Step 9: Verify updated values persisted for Staff Password Policies', async () => {
    await securityPoliciesPage.verifyStaffPasswordPolicies(updatedStaffValues);
  });

  await test.step('Step 10: Switch to Student Password Policies tab and verify updated values persisted', async () => {
    await securityPoliciesPage.navigateToStudentPoliciesTab();
    await securityPoliciesPage.verifyStudentPasswordPolicies(updatedStudentValues);
  });
});