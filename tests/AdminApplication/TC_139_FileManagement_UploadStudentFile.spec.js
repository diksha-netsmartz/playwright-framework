import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import FileManagementPage from '@pages/AdminApplication/AccountManagement/FileManagementPage';
import { credentials } from '@config/config';

/**
 * TC_139: C-Admin >> Account Management >> File Management
 * Test Case Title: To Verify staff able to upload student file
 * Precondition: Staff should be logged in to C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2 & 3: Navigate to Account Management -> File Management.
 *   Step 4: Click on Student(s) File Upload.
 *   Step 5: Search and select student.
 *   Step 6: Choose files from system.
 *   Step 7: Select Category, Start Upload, Preview and Verify files.
 *   Step 8: Select Category, Start Upload, Preview and Delete files.
 *   Step 9: Select Category and Cancel Upload.
 *
 * Expected Result:
 *   Staff should be able to upload, preview, verify, delete, and cancel student files successfully.
 **/
test('TC_139: C-Admin >> Account Management >> File Management - To Verify staff able to upload student file', { tag: ['@CAdmin', '@accountManagement'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const fileManagementPage = new FileManagementPage(page);
  const uploadFilePaths = [
    'test-data/uploads/uploadFile.jpg',
    'test-data/uploads/sample.pdf',
    'test-data/uploads/vehicle.png'
  ];

  await test.step('Step 1: Login to C-Admin', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 2 & 3: Navigate to Account Management -> File Management', async () => {
    await homePage.navigateToFileManagement();
  });

  await test.step('Step 4: Click on Student(s) File Upload', async () => {
    await fileManagementPage.navigateToStudentFileUpload();
  });

  await test.step('Step 5: Search and select student', async () => {
    await fileManagementPage.selectStudent(credentials.studentUser.name);
  });

  await test.step('Step 6: Choose files from system', async () => {
    await fileManagementPage.selectUploadFile(uploadFilePaths);

  });
  await test.step('Step 7: Select Category, Start Upload, Preview and Verify files', async () => {
    await fileManagementPage.selectAllCategories();
    await fileManagementPage.startUploadAndVerify();
    await fileManagementPage.previewFileAndClose();
    await fileManagementPage.verifyAndSaveDocument();
  });

  await test.step('Step 8: Select Category, Start Upload, Preview and Delete files', async () => {
    await fileManagementPage.selectAllCategories();
    await fileManagementPage.startUploadAndVerify();
    await fileManagementPage.previewFileAndClose('pdf');
    await fileManagementPage.deleteFileUpload();
  });

  await test.step('Step 9: Select Category and Cancel Upload', async () => {
    await fileManagementPage.selectAllCategories();
    await fileManagementPage.cancelFileUpload();
  });


});