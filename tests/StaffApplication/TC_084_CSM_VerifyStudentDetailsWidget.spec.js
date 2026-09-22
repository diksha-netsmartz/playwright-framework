import { test } from '@playwright/test';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';
import { credentials } from '@config/config';

/**
 * TC0084: CSM >> Student details widget
 * Test Case Title: To Verify student details appear
 * Expected Result: Staff is able to search a student, open student details modal, and click on all available tabs
 **/
test('TC_084: CSM - To Verify student details appear', { tag: ['@CSM', '@CSMHomepage'] }, async ({ page }) => {

  const staffLoginPage = new StaffLoginPage(page);
  const staffHomePage = new StaffHomePage(page);

  const studentName = credentials.studentUser.name;

  await test.step('Step 1: Login to staff portal (CSM) with valid credentials', async () => {
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
  });

  await test.step(`Step 2: Search for student "${studentName}" in Student Details widget and click Show Details`, async () => {
    await staffHomePage.searchAndSelectStudent(studentName);
  });

  await test.step('Step 3: Verify Student Details modal is displayed', async () => {
    await staffHomePage.verifyStudentDetailsModalVisible();
  });

  await test.step('Step 4: Click on all available tabs in Student Details modal', async () => {
    await staffHomePage.clickAllStudentDetailsTabs();
  });
});