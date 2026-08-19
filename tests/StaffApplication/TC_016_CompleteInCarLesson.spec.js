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

    // Step 1: Login to the CSM portal
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(login.staffUser.username, login.staffUser.password);

    // Step 2-4: Navigate to the "Needs Attention" widget, click action dropdown and click Process
    await staffHomePage.clickProcess();

    // Step 5: Click on the Process button
    await lessonEvaluationPage.clickProcess();

    // Step 6: From the "Select Evaluation" dropdown, select the evaluation
    await lessonEvaluationPage.selectEvaluation();

    // Step 7: Mark all the questions for the evaluation
    await lessonEvaluationPage.answerAllEvaluationQuestions();

    // Step 8: Select the travel time option
    await lessonEvaluationPage.selectTravelTime();

    // Step 9: Enter text in the Public Notes text area
    await lessonEvaluationPage.enterPublicNotes();

    // Step 10: Enter text in the Private Notes text area
    await lessonEvaluationPage.enterPrivateNotes();

    // Step 11: Sign the signature pad for the student
    await lessonEvaluationPage.signStudentSignature();

    // Step 12: Sign the signature pad for the instructor
    await lessonEvaluationPage.signInstructorSignature();

    // Step 13: Click on "Complete Lesson (Send Email)" button
    await lessonEvaluationPage.completeLesson();
    await lessonEvaluationPage.confirmLessonCompletion();

    // Verify lesson completed successfully
    await lessonEvaluationPage.verifyLessonCompletedSuccessfully();

});
