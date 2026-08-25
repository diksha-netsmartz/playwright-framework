import {test} from '@playwright/test';

import StaffLoginPage from '../../pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '../../pages/StaffApplication/StaffHomePage';
import LessonEvaluationPage from '../../pages/StaffApplication/LessonEvaluationPage';

import login from '../../test-data/login.json';

/**
 * TC_016: Centralize Staff Mobile (CSM)
 * Test Case Title: Verify process lesson functionality
 * Expected Result: Success message "Success! Lesson completed and evaluation saved." should be displayed and email sent to student
 **/
test('TC_016: CSM - Verify process lesson functionality', async ({page}) => {

    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);
    const lessonEvaluationPage = new LessonEvaluationPage(page);

    await test.step('Step 1: Login to CSM portal with valid staff credentials', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(login.staffUser.username, login.staffUser.password);
    });

    await test.step('Step 2-4: Navigate to "Needs Attention" and click Process', async () => {
        await staffHomePage.clickProcess();
    });

    await test.step('Step 5 & 6: Click Process and select evaluation', async () => {
        await lessonEvaluationPage.clickProcess();
        await lessonEvaluationPage.selectEvaluation();
    });

    await test.step('Step 7: Answer all evaluation questions', async () => {
        await lessonEvaluationPage.answerAllEvaluationQuestions();
    });

    await test.step('Step 8-10: Select travel time and enter notes', async () => {
        await lessonEvaluationPage.selectTravelTime();
        await lessonEvaluationPage.enterPublicNotes();
        await lessonEvaluationPage.enterPrivateNotes();
    });

    await test.step('Step 11 & 12: Sign student and instructor signatures', async () => {
        await lessonEvaluationPage.signStudentSignature();
        await lessonEvaluationPage.signInstructorSignature();
    });

    await test.step('Step 13: Complete lesson and confirm', async () => {
        await lessonEvaluationPage.completeLesson();
        await lessonEvaluationPage.confirmLessonCompletion();
    });

    await test.step('Verify lesson completed successfully message', async () => {
        await lessonEvaluationPage.verifyLessonCompletedSuccessfully();
    });
});

