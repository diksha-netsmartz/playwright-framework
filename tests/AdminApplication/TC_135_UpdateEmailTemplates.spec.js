import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import EmailTemplatesPage from '@pages/AdminApplication/Communication/EmailTemplatesPage';
import { credentials } from '@config/config';
import TestDataGenerator from '@utils/TestDataGenerator';

/**
 * TC_135: C-Admin >> Communication >> Email Templates
 * Test Case Title: To Verify staff is able to update email Template
 * Precondition: Staff should be login in C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2: Click on communication
 *   Step 3: Click on Email Template
 *   Step 4: Click on Edit button for first email
 *   Step 5: Click on save button
 *   Step 6: Click on staff Mobile Tab
 *   Step 7: Click on Edit button for first email
 *   Step 8: Click on save button
 *   Step 9: Click on Admin Portal Tab
 *   Step 10: Click on Edit button for first email
 *   Step 11: Click on save button
 *   Step 12: Click on Reminders Tab
 *   Step 13: Click on Edit button for first email
 *   Step 14: Click on save button
 *
 * Expected Result:
 *   Staff should able to update email Template.
 **/
test('TC_135: C-Admin >> Communication >> Email Templates - To Verify staff is able to update email Template', { tag: ['@CAdmin', '@communication'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const emailTemplatesPage = new EmailTemplatesPage(page);

    const timestamp = Date.now();
    const emailId = `${timestamp}@test.com`;
    const numberOfDays = TestDataGenerator.generateRandomThreeDigitNumber();

    await test.step('Step 1: Login to C-Admin', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2 & 3: Navigate to Communication -> Email Templates', async () => {
        await homePage.navigateToEmailTemplates();
    });

    await test.step('Step 4 & 5: Edit and save first email template in initial tab', async () => {
        await emailTemplatesPage.editSaveAndVerifyFirstEmail(emailId, numberOfDays);
    });

    await test.step('Step 6: Click on Staff Mobile Tab', async () => {
        await emailTemplatesPage.clickStaffMobileTab();
    });

    await test.step('Step 7 & 8: Edit and save first email template in Staff Mobile tab', async () => {
        await emailTemplatesPage.editSaveAndVerifyFirstEmail(emailId, numberOfDays);
    });

    await test.step('Step 9: Click on Admin Portal Tab', async () => {
        await emailTemplatesPage.clickAdminPortalTab();
    });

    await test.step('Step 10 & 11: Edit and save first email template in Admin Portal tab', async () => {
        await emailTemplatesPage.editSaveAndVerifyFirstEmail(emailId, numberOfDays);
    });

    await test.step('Step 12: Click on Reminders Tab', async () => {
        await emailTemplatesPage.clickRemindersTab();
    });

    await test.step('Step 13 & 14: Edit and save first email template in Reminders tab', async () => {
        await emailTemplatesPage.editSaveAndVerifyFirstEmail(emailId, numberOfDays);
    });
});

