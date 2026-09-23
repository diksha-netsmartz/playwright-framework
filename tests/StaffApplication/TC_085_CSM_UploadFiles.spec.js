import { test } from '@playwright/test';
import { credentials } from '@config/config';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';

/**
 * TC_085: CSM
 * Test Case Title: Verify that the file is getting uploaded
 * Expected Result: File should be uploaded successfully and should be visible under CSM > Home Page > Upload Files widget
 **/
test('TC_085: CSM - Verify that the file is getting uploaded', { tag: ['@CSM', '@CSMHomepage'] }, async ({ page }) => {

    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);
    const studentName = credentials.studentUser.name;
    const uploadFilePaths = [
        'test-data/uploads/uploadFile.jpg',
        'test-data/uploads/vehicle.png',
        'test-data/uploads/sample.pdf'
    ];

    await test.step('Step 1: Login to staff portal (CSM) with valid credentials', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
    });

    await test.step('Step 2-4: Upload file in "Upload Files" widget and verify success', async () => {
        await staffHomePage.uploadFiles(uploadFilePaths, studentName);
        await staffHomePage.verifyUploadSuccess();
    });

});

