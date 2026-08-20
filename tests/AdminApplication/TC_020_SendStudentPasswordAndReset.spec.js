import { test } from '@playwright/test';
import AdminLoginPage from '../../pages/AdminApplication/AdminLoginPage';
import AdminPortalHomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import StudentProfilePage from '../../pages/AdminApplication/StudentProfilePage';
import StudentResetPasswordPage from '../../pages/StudentApplication/StudentResetPasswordPage';
import StudentLoginPage from '../../pages/StudentApplication/StudentLoginPage';
import EmailHelper from '../../utils/EmailHelper';
import TestDataGenerator from '../../utils/TestDataGenerator';
import login from '../../test-data/login.json';

/**
 * TC_020: C-Admin > Student Profile
 * Test Case Title: Verify send username/password functionality
 * Precondition: Should be logged into C-admin
 * Expected Result: Student gets logged in successfully with the new reset password
 **/
test('TC_020: C-admin > Student Profile - Verify send username/password functionality', async ({ page }) => {

    const loginPage = new AdminLoginPage(page);
    const homePage = new AdminPortalHomePage(page);
    const studentProfilePage = new StudentProfilePage(page);
    const resetPasswordPage = new StudentResetPasswordPage(page);
    const studentLoginPage = new StudentLoginPage(page);

    // Step 1: Login to Admin Portal using existing login methods
    await loginPage.navigateToLoginPage();
    await loginPage.login(login.validUser.username, login.validUser.password);

    // Step 2: Navigate to Student Account -> Profile
    await homePage.openStudentProfile();

    // Step 3: Search and select student
    await studentProfilePage.selectStudent(login.resetStudent.username);

    // Step 4: Update email if not matching the required email
    await studentProfilePage.updateEmailIfDifferent(login.resetStudent.email);

    // Step 5: Send Reset Password / Username email to student
    await studentProfilePage.sendUsernamePasswordEmail();

    // Step 6: Fetch the Reset Password URL directly from email via IMAP in background
    console.log('Fetching Reset Password link from email...');
    const resetPasswordUrl = await EmailHelper.getResetPasswordLink({
        recipientEmail: login.resetStudent.email,
        subject: 'Student UserName/Password',
        timeoutMs: 20000
    });
    console.log('Navigating to Reset Password URL:', resetPasswordUrl);

    // Step 7: Navigate to the Reset Password link
    await resetPasswordPage.navigateToResetPasswordUrl(resetPasswordUrl);

    // Step 8: Generate a fresh random password for this execution
    const dynamicNewPassword = TestDataGenerator.generateRandomPassword();
    console.log('Setting new password:', dynamicNewPassword);

    // Step 9: Fill new password, confirm password, and submit
    await resetPasswordPage.resetPassword(dynamicNewPassword);

    // Step 10: Verify success message and checkmark icon
    await resetPasswordPage.verifyResetPasswordSuccess();

    // Step 11: Navigate to CSP and login with username and the updated password
    console.log(`Logging into Student Portal (CSP) with updated credentials for ${login.resetStudent.username}...`);
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(login.resetStudent.username, dynamicNewPassword);
});