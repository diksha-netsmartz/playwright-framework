import { test } from '@playwright/test';
import StudentLoginPage from '../../pages/StudentApplication/StudentLoginPage';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import login from '../../test-data/json/login.json';
import StudentHomePage from '../../pages/StudentApplication/StudentPortalHomePage';
import AdminHomePage from '../../pages/AdminApplication/AdminPortalHomePage'


/**
 * TC_011: CSP
 * Test Case Title: Verify that the file is getting uploaded
 * Expected Result: File should be uploaded successfully and should be visible under C-Admin > Home Page > Uploaded Files widget
 **/
test('TC_011: CSP - Verify that the file is getting uploaded', { tag: '@smoke' }, async ({ page }) => {

    const studentLoginPage = new StudentLoginPage(page);
    const studentHomePage = new StudentHomePage(page);
    const loginPage = new LoginPage(page);
    const adminHomePage = new AdminHomePage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to CSP student portal with valid credentials', async () => {
        await studentLoginPage.navigateToLoginPage();
        await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
    });

    await test.step('Step 2-4: Upload file in "Upload Files" widget and verify success', async () => {
        await studentHomePage.uploadFile('test-data/uploads/uploadFile.jpg');
        await studentHomePage.verifyUploadSuccess();
    });

    await test.step('Verify uploaded file under C-Admin -> Uploaded Files widget', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
        await adminHomePage.clickShowFilesToConfirm(credentials.studentUser.name);
    });
});

