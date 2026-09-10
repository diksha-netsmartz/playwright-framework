import { test } from '@playwright/test';

import StaffLoginPage from '../../pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '../../pages/StaffApplication/StaffHomePage';
import ProcessLessonPage from '../../pages/StaffApplication/ProcessLessonPage';

import login from '../../test-data/json/login.json';

/**
 * TC_016: Centralize Staff Mobile (CSM)
 * Test Case Title: Verify process lesson functionality
 * Expected Result: Success message "Success! Lesson completed and evaluation saved." should be displayed and email sent to student
 **/
test('TC_016: CSM - Verify process lesson functionality', { tag: '@smoke' }, async ({ page }) => {

    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);
    const processLessonPage = new ProcessLessonPage(page);
    let isTitleMatched = false;

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to CSM portal with valid staff credentials', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
    });

    await test.step('Step 2-4: Navigate to "Needs Attention" and click Process', async () => {
        isTitleMatched = await staffHomePage.clickProcess('Process Lesson');
    });
    if (!isTitleMatched) {
        test.skip(true, 'Page title did not match "Process Lesson". Please turn off process yard skills settings in staff portal and try again. Skipping remaining steps.');
    }
    await test.step('Step 5 & 6: Click Process and select evaluation', async () => {
        await processLessonPage.clickProcess();
        await processLessonPage.selectEvaluation();
    });

    await test.step('Step 7: Answer all evaluation questions', async () => {
        await processLessonPage.answerAllEvaluationQuestions();
    });

    await test.step('Step 8-10: Enter details', async () => {
        await processLessonPage.selectTravelTime();
        await processLessonPage.SelectActualStartAndEndTime();
        await processLessonPage.FillOdometerStartAndEndValue();
        await processLessonPage.enterPublicNotes();
        await processLessonPage.enterPrivateNotes();
    });

    await test.step('Step 11 & 12: Sign student and instructor signatures', async () => {
        await processLessonPage.signStudentSignature();
        await processLessonPage.signInstructorSignature();
    });

    await test.step('Step 13: Complete lesson and confirm', async () => {
        await processLessonPage.completeLesson();
        await processLessonPage.confirmLessonCompletion();
    });

    await test.step('Verify lesson completed successfully message', async () => {
        await processLessonPage.verifyLessonCompletedSuccessfully();
    });
});

