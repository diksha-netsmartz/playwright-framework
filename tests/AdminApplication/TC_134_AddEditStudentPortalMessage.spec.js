import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import CommunicationCenterPage from '@pages/AdminApplication/Communication/CommunicationCenterPage';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '@pages/StudentApplication/StudentPortalHomePage';
import DateHelper from '@utils/DateHelper';
import { credentials } from '@config/config';

/**
 * TC_134: C-Admin >> Communication >> Communication Center >> Student Center
 * Test Case Title: To Verify staff is able to Add/Edit student portal Message
 * Precondition: Staff should be login in C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2: Click on communication
 *   Step 3: Click on communication center
 *   Step 4: Click on Add New
 *   Step 5: Add/Select values for fields
 *   Step 6: Upload file
 *   Step 7: Click on save button
 *   Step 8: Click on Edit button
 *   Step 9: Click on save button
 *
 * Expected Result:
 *   Staff should be able to save and update student message.
 **/
test('TC_134: C-Admin >> Communication >> Communication Center >> Student Center - To Verify staff is able to Add/Edit student portal Message', { tag: ['@CAdmin', '@communication'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const communicationCenterPage = new CommunicationCenterPage(page);
  const studentLoginPage = new StudentLoginPage(page);
  const studentHomePage = new StudentHomePage(page);

  const timestamp = Date.now();
  const messageName = `AutoStudentMsg_${timestamp}`;
  const initialContent = `Automated student message content ${timestamp}`;
  const updatedContent = `Automated student message content updated ${timestamp}`;
  const today = DateHelper.formatDate(new Date());
  const tomorrow = DateHelper.formatDate(DateHelper.getNextDay());
  const uploadFilePath = 'test-data/uploads/sample.pdf';

  await test.step('Step 1: Login to C-Admin', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 2 & 3: Navigate to Communication -> Communication Center', async () => {
    await homePage.navigateToCommunicationCenter();
  });

  await test.step('Step 4: Click on Add New', async () => {
    await communicationCenterPage.clickAddNewForStudentCenter();
  });

  await test.step('Step 5 & 6: Add/Select values for fields and upload file', async () => {
    await communicationCenterPage.fillStudentMessageDetails({
      name: messageName,
      status: 'Active',
      visibilityDate: today,
      expirationDate: tomorrow,
      content: initialContent,
      filePath: uploadFilePath
    });
  });

  await test.step('Step 7: Click on Save button and verify confirmation', async () => {
    await communicationCenterPage.saveMessage();
    await communicationCenterPage.verifySuccessMessage();
  });

  await test.step('Step 8: Login to CSP student portal with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 9: Verify the messages displayed in Student Portal and verify attachment', async () => {
    await studentHomePage.verifyStudentMessageVisibilityOnHompegae(
      initialContent,
      true
    );
  });


  await test.step('Step 10: Login to C-Admin', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 12 & 13: Navigate to Communication -> Communication Center', async () => {
    await homePage.navigateToCommunicationCenter();
  });

  await test.step('Step 14: Search created message and click Edit button', async () => {
    await communicationCenterPage.searchAndEditMessage(messageName);
  });

  await test.step('Step 15: Update details, click Save button, and verify confirmation', async () => {
    await communicationCenterPage.updateStudentMessageDetails({
      content: updatedContent,
      status: 'Deleted',
      visibilityDate: today,
      expirationDate: today,
    });
    await communicationCenterPage.saveMessage();
    await communicationCenterPage.verifySuccessMessage();
  });

  await test.step('Step 11: Login to CSP student portal with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 12: Verify the messages is not displayed in Student Portal', async () => {
    await studentHomePage.verifyStudentMessageVisibilityOnHompegae(
      updatedContent,
      false
    );
  });
});
