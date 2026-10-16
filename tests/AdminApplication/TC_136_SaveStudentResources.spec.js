import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import AdminStudentResourcesPage from '@pages/AdminApplication/Communication/StudentResourcesPage';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '@pages/StudentApplication/StudentPortalHomePage';
import CSPStudentResourcesPage from '@pages/StudentApplication/StudentResourcesPage';
import { credentials } from '@config/config';

/**
 * TC_136: C-Admin >> Communication >> Student Resources
 * Test Case Title: To Verify Staff is able to save Resources and verify reflection in Student Portal
 * Precondition: Staff should be logged in to C-Admin and student credentials must be valid
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2 & 3: Click on Communication -> Student Resources.
 *   Step 4 & 5: Add text in Classroom tab, click Save, and verify success message.
 *   Step 6, 7 & 8: Click on In-Car tab, add text, click Save, and verify success message.
 *   Step 9, 10 & 11: Click on Road Test tab, add text, click Save, and verify success message.
 *   Step 12, 13 & 14: Click on Parents tab, add text, click Save, verify success message, and close notification.
 *   Step 15: Re-navigate to Student Resources to verify persisted content across all tabs.
 *   Step 16: Login to student portal (CSP) with valid credentials.
 *   Step 17: Navigate to Resources > Classes tab.
 *   Step 18: Verify updated resources content is reflected across all tabs in Student Portal.
 *
 * Expected Result:
 *   Staff should be able to add and save Resources across all tabs successfully, changes should persist in C-Admin, and be accurately reflected in the Student Portal.
 **/
test('TC_136: C-Admin >> Communication >> Student Resources - To Verify Staff is able to save Resources and verify reflection in Student Portal', { tag: ['@CAdmin', '@communication'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const studentResourcesPage = new AdminStudentResourcesPage(page);
  const studentLoginPage = new StudentLoginPage(page);
  const studentHomePage = new StudentHomePage(page);
  const cspStudentResourcesPage = new CSPStudentResourcesPage(page);

  const timestamp = Date.now();
  const classText = `Welcome to Driver Education Classroom Training. All students are required to complete all 30 hours of state-mandated classroom instruction and score a minimum of 80% on module evaluations. Please review Chapters 1 through 10 of the State Driver Handbook, focusing on right-of-way rules, traffic control signals, and defensive driving principles. Bring your workbook, valid identification, and completed study questions to every class session. Ref: #CR-${timestamp}`;
  const inCarText = `Behind-the-Wheel Instruction Guidelines: Students must possess a valid learner's permit on their person for every scheduled driving lesson. Please arrive 10 minutes prior to your appointment time wearing flat, closed-toe footwear. Cell phone usage during lessons is strictly prohibited. Each behind-the-wheel session covers vehicle pre-trip inspection, mirror adjustments, smooth braking, lane discipline, and residential maneuvers. Ref: #IC-${timestamp}`;
  const roadTestText = `Official Road Test Preparation and Vehicle Requirements: Candidates must have completed all required driving practice hours and classroom modules prior to test scheduling. Your test vehicle must have valid state registration, proof of insurance, functioning turn signals, clean mirrors, and adequate tire tread depth. Be prepared to demonstrate parallel parking, three-point turns, smooth stopping, and highway merging techniques. Ref: #RT-${timestamp}`;
  const parentsText = `Parent & Guardian Supervised Driving Guide: Parents play a vital role in developing safe, responsible young drivers. State Graduated Driver Licensing (GDL) laws require a minimum of 50 hours of supervised driving practice, including at least 10 hours during nighttime conditions. We encourage practicing in diverse weather conditions and maintaining an updated practice driving log throughout your student's training program. Ref: #PR-${timestamp}`;

  await test.step('Step 1: Login to C-Admin', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 2 & 3: Navigate to Communication -> Student Resources', async () => {
    await homePage.navigateToStudentResources();
  });

  await test.step('Step 4 & 5: Add text in Classroom tab, click Save, and verify success message', async () => {
    await studentResourcesPage.fillEditorContent(classText);
  });

  await test.step('Step 6, 7 & 8: Click on In-Car tab, add text, click Save, and verify success message', async () => {
    await studentResourcesPage.navigateToInCarTab();
    await studentResourcesPage.fillEditorContent(inCarText);
  });

  await test.step('Step 9, 10 & 11: Click on Road Test tab, add text, click Save, and verify success message', async () => {
    await studentResourcesPage.navigateToRoadTestTab();
    await studentResourcesPage.fillEditorContent(roadTestText);
  });

  await test.step('Step 12, 13 & 14: Click on Parents tab, add text, click Save, and verify success message', async () => {
    await studentResourcesPage.navigateToParentsTab();
    await studentResourcesPage.fillEditorContent(parentsText);
    await studentResourcesPage.saveAndVerifySuccess();
  });

  await test.step('Step 15: Re-navigate to Student Resources and verify persisted content across all tabs', async () => {
    await homePage.navigateToStudentResources();

    // Verify Classroom tab
    await studentResourcesPage.verifyEditorContent(classText);

    // Verify In-Car tab
    await studentResourcesPage.navigateToInCarTab();
    await studentResourcesPage.verifyEditorContent(inCarText);

    // Verify Road Test tab
    await studentResourcesPage.navigateToRoadTestTab();
    await studentResourcesPage.verifyEditorContent(roadTestText);

    // Verify Parents tab
    await studentResourcesPage.navigateToParentsTab();
    await studentResourcesPage.verifyEditorContent(parentsText);
  });

  await test.step('Step 16: Login to student portal (CSP) with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 17: Navigate to Resources > Classes tab', async () => {
    await studentHomePage.navigateToClassInResources();
  });

  await test.step('Step 18: Verify updated resources content is reflected across all tabs in Student Portal', async () => {
    // Verify Class tab
    await cspStudentResourcesPage.clickTabAndVerifyContent(0, classText);

    // Verify In-Car tab
    await cspStudentResourcesPage.clickTabAndVerifyContent(1, inCarText);

    // Verify Road Test tab
    await cspStudentResourcesPage.clickTabAndVerifyContent(2, roadTestText);

    // Verify Parents tab
    await cspStudentResourcesPage.clickTabAndVerifyContent(3, parentsText);
  });
});