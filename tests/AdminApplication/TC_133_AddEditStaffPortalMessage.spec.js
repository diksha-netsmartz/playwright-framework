import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import CommunicationCenterPage from '@pages/AdminApplication/Communication/CommunicationCenterPage';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';
import PageSettingsPage from '@pages/AdminApplication/PageSettingsPage';
import DateHelper from '@utils/DateHelper';
import { credentials } from '@config/config';

/**
 * TC_133: C-Admin >> Communication >> Communication Center >> Staff Center
 * Test Case Title: To Verify staff is able to Add/Edit staff portal Message
 * Precondition: Login to C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2 & 3: Navigate to Communication -> Communication Center
 *   Step 4: Click on Staff Center tab
 *   Step 5: Click on Add New
 *   Step 6 & 7: Add/Select values for fields and upload file
 *   Step 8: Click on save button
 *   Step 9: Login to CSM staff portal with valid credentials
 *   Step 10: Verify the messages displayed in Staff Portal and verify attachment
 *   Step 11: Login to C-Admin
 *   Step 12 & 13: Navigate to Communication -> Communication Center
 *   Step 14: Click on Staff Center tab
 *   Step 15: Search created message and click Edit button
 *   Step 16: Update details, click Save button, and verify confirmation
 *   Step 17: Login to CSM staff portal with valid credentials
 *   Step 18: Verify the message is not displayed in Staff Portal
 *
 * Expected Result:
 *   Staff should be able to save and update staff message successfully, and visibility on Staff Portal should be verified.
 **/
test('TC_133: C-Admin >> Communication >> Communication Center >> Staff Center - To Verify staff is able to Add/Edit staff portal Message', { tag: ['@CAdmin', '@communication'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const communicationCenterPage = new CommunicationCenterPage(page);
  const staffLoginPage = new StaffLoginPage(page);
  const staffHomePage = new StaffHomePage(page);

  const timestamp = Date.now();
  const messageName = `AutoMsg_${timestamp}`;
  const initialContent = `Automated staff message content ${timestamp}`;
  const updatedContent = `Automated staff message content updated ${timestamp}`;
  const today = DateHelper.formatDate(new Date());
  const tomorrow = DateHelper.formatDate(DateHelper.getNextDay());
  const uploadFilePath = 'test-data/uploads/sample.pdf';

  await test.step('Step 1: Login to C-Admin', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Precondition: Ensure Communication Message Widget is enabled on Home screen', async () => {
    const settingsPopup = await homePage.openPageSettings();
    const pageSettings = new PageSettingsPage(settingsPopup);
    const wasAlreadyChecked = await pageSettings.ensureCommunicationMessageWidgetEnabled();
    if (!wasAlreadyChecked) {
      await homePage.reload();
    }
  });

  await test.step('Step 2 & 3: Navigate to Communication -> Communication Center', async () => {
    await homePage.navigateToCommunicationCenter();
  });

  await test.step('Step 4: Click on Staff Center tab', async () => {
    await communicationCenterPage.clickStaffCenterTab();
  });

  await test.step('Step 5: Click on Add New', async () => {
    await communicationCenterPage.clickAddNewForStaffCenter();
  });

  await test.step('Step 6 & 7: Add/Select values for fields and upload file', async () => {
    await communicationCenterPage.fillStaffMessageDetails({
      name: messageName,
      status: 'Active',
      visibilityDate: today,
      expirationDate: tomorrow,
      content: initialContent,
      filePath: uploadFilePath
    });
  });

  await test.step('Step 8: Click on Save button and verify confirmation', async () => {
    await communicationCenterPage.saveMessage();
    await communicationCenterPage.verifySuccessMessage();
  });

  await test.step('Step 17: Verify the message is displayed in Admin Portal', async () => {
    await homePage.navigateToHomePage();
    await homePage.verifyStaffMessageVisibilityOnAdminHomepage(
      initialContent,
      true
    );
  });



  await test.step('Step 9: Login to CSM staff portal with valid credentials', async () => {
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
  });

  await test.step('Step 10: Verify the messages displayed in Staff Portal and verify attachment', async () => {
    await staffHomePage.verifyStaffMessageVisibilityOnHomepage(
      initialContent,
      true
    );
  });

  await test.step('Step 11: Login to C-Admin', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 12 & 13: Navigate to Communication -> Communication Center', async () => {
    await homePage.navigateToCommunicationCenter();
  });

  await test.step('Step 14: Click on Staff Center tab', async () => {
    await communicationCenterPage.clickStaffCenterTab();
  });

  await test.step('Step 15: Search created message and click Edit button', async () => {
    await communicationCenterPage.searchAndEditMessage(messageName);
  });

  await test.step('Step 16: Update details, click Save button, and verify confirmation', async () => {
    await communicationCenterPage.updateStaffMessageDetails({
      content: updatedContent,
      status: 'Deleted',
      visibilityDate: today,
      expirationDate: today,
    });
    await communicationCenterPage.saveMessage();
    await communicationCenterPage.verifySuccessMessage();
  });

  await test.step('Step 17: Verify the message is not displayed in Admin Portal', async () => {
    await homePage.navigateToHomePage();
    await homePage.verifyStaffMessageVisibilityOnAdminHomepage(
      updatedContent,
      false
    );
  });

  await test.step('Step 17: Login to CSM staff portal with valid credentials', async () => {
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
  });

  await test.step('Step 18: Verify the message is not displayed in Staff Portal', async () => {
    await staffHomePage.verifyStaffMessageVisibilityOnHomepage(
      updatedContent,
      false
    );
  });
});