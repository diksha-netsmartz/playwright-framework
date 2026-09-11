import { expect, test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import StudentFilesPage from '../../pages/AdminApplication/StudentAccount/StudentFilesPage';
import login from '../../test-data/json/login.json';

/**
 * TC_054_055: C-admin >> Student Account >> Files
 * Test Case Title: To verify the file is getting uploaded, previewed, downloaded, and deleted with row count assertions
 * Precondition: User should have valid admin login credentials and an active student record
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Student Account > Files
 *   Step 3 - Search and select student
 *   Step 4 - Upload student file, select category, save, and verify success
 *   Step 5 - Click on the preview (eye) icon and verify preview modal opens/closes
 *   Step 6 - Click on the download icon and verify file is downloaded
 *   Step 7 - Click on the delete icon and confirm deletion with "Yes"
 * Expected Result:
 *   - The uploaded file should be previewed successfully
 *   - File should get downloaded successfully
 *   - File should get deleted successfully and row count should increase and decrease accordingly
 **/
test('TC_054_055: C-admin >> Student Account >> Files - Verify file upload, preview, download, and delete', { tag: '@studentAccount' }, async ({ page }) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const studentFilesPage = new StudentFilesPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];
    const targetStudent = credentials.studentUser.name;
    const uploadFilePath = 'test-data/uploads/uploadFile.jpg';

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Student Account -> Files', async () => {
        await homePage.openStudentFiles();
    });

    await test.step(`Step 3: Search and select student: "${targetStudent}"`, async () => {
        await studentFilesPage.selectStudent(targetStudent);
    });

    await test.step(`Step 4: Upload student file`, async () => {
        await studentFilesPage.uploadFile(uploadFilePath);
        await studentFilesPage.selectCategory();
        await studentFilesPage.clickSaveFiles();
        await studentFilesPage.verifyFileUploadSuccess();
    });

    await test.step('Step 5: Preview the uploaded file', async () => {
        await studentFilesPage.previewFile();
    });

    await test.step('Step 6: Download the uploaded file', async () => {
        await studentFilesPage.downloadFile();
    });

    await test.step('Step 7: Delete the uploaded file and verify count decreased', async () => {
        await studentFilesPage.deleteFile();
    });
});