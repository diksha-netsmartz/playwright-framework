import { test } from '@playwright/test';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';
import { credentials, currentEnv } from '@config/config';

/**
 * TC_084: CSM >> Student details widget
 * Test Case Title: To Verify student details appear
 * Precondition: Staff user has valid login credentials
 * Steps:
 *   Step 1: Login to staff portal (CSM) with valid credentials
 *   Step 2: Search for student in Student Details widget and click Show Details
 *   Step 3: Verify Student Details modal is displayed
 *   Step 4: Click on all available tabs in Student Details modal
 *   Step 5: Search for CR in Student Details widget and click Show Details
 *   Step 6: Verify Student Details modal is displayed
 *   Step 7: Click on all available tabs in Student Details modal
 * Expected Result:
 *   Staff is able to search a student and CR, open student details modal, and click on all available tabs
 **/
test('TC_084: CSM - To Verify student details appear', { tag: ['@CSM', '@CSMHomepage'] }, async ({ page }) => {

  const staffLoginPage = new StaffLoginPage(page);
  const staffHomePage = new StaffHomePage(page);

  const studentName = credentials.studentUser.name;
  const crNames = {
    uat: '15dsss11',
    staging: 'CR26',
    coreServer1: 'dsstest',
    coreServer2: 'automationCR'
  };
  const crName = crNames[currentEnv];

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

  await test.step(`Step 5: Search for CR "${crName}" in Student Details widget and click Show Details`, async () => {
    await staffHomePage.navigateToHomePage();
    await staffHomePage.searchAndSelectCR(crName);
  });

  await test.step('Step 6: Verify Student Details modal is displayed', async () => {
    await staffHomePage.verifyStudentDetailsModalVisible();
  });

  await test.step('Step 7: Click on all available tabs in Student Details modal', async () => {
    await staffHomePage.clickAllStudentDetailsTabs();
  });
});