import {test} from '@playwright/test';
import StudentLoginPage from '../../pages/StudentApplication/StudentLoginPage';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import login from '../../test-data/login.json';
import StudentHomePage from '../../pages/StudentApplication/StudentPortalHomePage';
import AdminHomePage from '../../pages/AdminApplication/AdminPortalHomePage'


/**
 * TC_011: CSP
 * Test Case Title: Verify that the file is getting uploaded
 * Expected Result: File should be uploaded successfully and should be visible under C-Admin > Home Page > Uploaded Files widget
 **/
test('TC_011: CSP - Verify that the file is getting uploaded', async ({page}) => {

    const studentLoginPage = new StudentLoginPage(page);
    const studentHomePage = new StudentHomePage(page);
    const loginPage = new LoginPage(page);
    const adminHomePage = new AdminHomePage(page);

    // Step 1: Navigate to the CSP URL and login using the test credentials
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(login.studentUser.username, login.studentUser.password);

    // Step 2-4: Scroll down to "Upload Files" widget, choose file and upload
    await studentHomePage.uploadFile('test-data/UploadFile.jpg');
    await studentHomePage.verifyUploadSuccess();

    // Verify uploaded file in C-Admin > Uploaded Files widget
    await loginPage.navigateToLoginPage();
    await loginPage.login(login.validUser.username, login.validUser.password);
    await adminHomePage.clickShowFilesToConfirm();
});
