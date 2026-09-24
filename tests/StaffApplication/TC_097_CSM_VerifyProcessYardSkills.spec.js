import { test } from '@playwright/test';

import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';
import ProcessYardSkillsPage from '@pages/StaffApplication/ProcessYardSkillsPage';

import { credentials } from '@config/config';

/**
 * TC_097: Centralize Staff Mobile (CSM)
 * Test Case Title: Verify process yard skills functionality
 * Expected Result: Success message "Student evaluation saved successfully and lesson marked as Completed" should be displayed and email sent to student
 **/
test('TC_097: CSM - Verify process yard skills functionality', { tag: ['@CSM', '@CSMHomepage'] }, async ({ page }) => {

    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);
    const processYardSkillsPage = new ProcessYardSkillsPage(page);
    let isTitleMatched = false;

    await test.step('Step 1: Login to CSM portal with valid staff credentials', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
    });

    await test.step('Step 2-4: Navigate to "Needs Attention" and click Process', async () => {
        isTitleMatched = await staffHomePage.clickProcess('Process Yard Skills');
    });
    if (!isTitleMatched) {
        await staffHomePage.skipWithScreenshot('Page title did not match "Process Yard Skills". Please turn on process yard skills settings in staff portal and try again. Skipping remaining steps.');
    }
    await test.step('Step 5 & 6: Click Process and select evaluation', async () => {
        await processYardSkillsPage.clickProcess();
        await processYardSkillsPage.selectEvaluation();
    });

    await test.step('Step 7: Answer all evaluation questions', async () => {
        await processYardSkillsPage.answerAllEvaluationQuestions();
    });

    await test.step('Step 8-10: Enter details', async () => {
        await processYardSkillsPage.SelectActualStartAndEndTime();
        await processYardSkillsPage.FillOdometerStartAndEndValue();
        await processYardSkillsPage.enterPublicNotes();
        await processYardSkillsPage.enterPrivateNotes();
    });

    await test.step('Step 11 & 12: Sign student and instructor signatures', async () => {
        await processYardSkillsPage.signStudentSignature();
        await processYardSkillsPage.signInstructorSignature();
    });

    await test.step('Step 13: Complete lesson and confirm', async () => {
        await processYardSkillsPage.completeLesson();
        await processYardSkillsPage.confirmLessonCompletion();
    });

    await test.step('Step 14: Verify lesson completed successfully message', async () => {
        await processYardSkillsPage.verifyLessonCompletedSuccessfully();
    });
});

