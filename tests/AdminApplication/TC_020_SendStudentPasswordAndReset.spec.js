import { test } from '@playwright/test';
import AdminLoginPage from '../../pages/AdminApplication/AdminLoginPage';
import AdminPortalHomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import StudentProfilePage from '../../pages/AdminApplication/StudentProfilePage';
import StudentResetPasswordPage from '../../pages/StudentApplication/StudentResetPasswordPage';
import StudentLoginPage from '../../pages/StudentApplication/StudentLoginPage';
import EmailHelper from '../../utils/EmailHelper';
import TestDataGenerator from '../../utils/TestDataGenerator';
import login from '../../test-data/json/login.json';

/**
 * TC_020: C-Admin > Student Profile
 * Test Case Title: Verify send username/password functionality
 * Precondition: Should be logged into C-admin
 * Expected Result: Student gets logged in successfully with the new reset password
 **/
test('TC_020: C-admin > Student Profile - Verify send username/password functionality', { tag: '@smoke' }, async ({ page }) => {

    const loginPage = new AdminLoginPage(page);
    const homePage = new AdminPortalHomePage(page);
    const studentProfilePage = new StudentProfilePage(page);
    const resetPasswordPage = new StudentResetPasswordPage(page);
    const studentLoginPage = new StudentLoginPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];
    let resetPasswordUrl;
    let dynamicNewPassword;

    await test.step('Step 1: Login to Admin Portal using existing login methods', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Student Account -> Profile', async () => {
        await homePage.openStudentProfile();
    });

    await test.step(`Step 3: Search and select student: ${credentials.resetStudent.username}`, async () => {
        await studentProfilePage.selectStudent(credentials.resetStudent.username);
    });

    await test.step('Step 4: Update email if not matching the required email', async () => {
        await studentProfilePage.updateEmailIfDifferent(credentials.resetStudent.email);
    });

    await test.step('Step 5: Send Reset Password / Username email to student', async () => {
        await studentProfilePage.sendUsernamePasswordEmail();
    });

    await test.step('Step 6: Fetch the Reset Password URL directly from email via IMAP', async () => {
        console.log('Fetching Reset Password link from email...');
        resetPasswordUrl = await EmailHelper.getResetPasswordLink({
            recipientEmail: credentials.resetStudent.email,
            subject: 'Student UserName/Password',
            timeoutMs: 20000
        });
        console.log('Navigating to Reset Password URL:', resetPasswordUrl);
    });

    await test.step('Step 7: Navigate to the Reset Password link', async () => {
        await resetPasswordPage.navigateToResetPasswordUrl(resetPasswordUrl);
    });

    await test.step('Step 8 & 9: Generate dynamic password and submit new password', async () => {
        dynamicNewPassword = TestDataGenerator.generateRandomPassword();
        console.log('Setting new password:', dynamicNewPassword);
        await resetPasswordPage.resetPassword(dynamicNewPassword);
    });

    await test.step('Step 10: Verify success message and checkmark icon', async () => {
        await resetPasswordPage.verifyResetPasswordSuccess();
    });

    await test.step(`Step 11: Navigate to CSP and login with username and the updated password`, async () => {
        console.log(`Logging into Student Portal (CSP) with updated credentials for ${credentials.resetStudent.username}...`);
        await studentLoginPage.navigateToLoginPage();
        await studentLoginPage.login(credentials.resetStudent.username, dynamicNewPassword);
    });
});