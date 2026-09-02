import {test} from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import OnlineQuizTestsPage from '../../pages/AdminApplication/AccountManagement/Services/OnlineQuizTestsPage';
import login from '../../test-data/json/login.json';
import quizData from '../../test-data/json/quizData.json';

/**
 * TC_033: C-Admin >> Account Management >> Services >> Online quiz/test
 * Test Case Title: To verify user able to Add Quiz
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - From the side menu, navigate to Account Management > Services > Online Quiz / Tests
 *   Step 2 - Click on "Add New"
 *   Step 3 - Enter all the required fields (prefix + Date.now() for quiz name, Active status)
 *   Step 4 - Click on Save
 *   Step 5 - Verify "Quiz Added successfully.Now you can add questions." message displays
 *   Step 6 - Click on Back button
 *   Step 7 - Verify the added quiz is visible in the grid
 * Expected Result:
 *   1. "Quiz Added successfully.Now you can add questions." message should display
 *   2. The added quiz should be visible in the grid
 **/
test('TC_033: C-Admin >> Account Management >> Services >> Online quiz/test - To verify user able to Add Quiz', async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const quizPage = new OnlineQuizTestsPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Account Management > Services > Online Quiz / Tests', async () => {
        await homePage.navigateToOnlineQuizTests();
    });

    await test.step('Step 3: Click "Add New" and fill quiz details', async () => {
        await quizPage.clickAddNew();
        await quizPage.fillQuizDetails(quizData);
    });

    await test.step('Step 4: Click on Save button', async () => {
        await quizPage.clickSave();
    });

    await test.step('Step 5: Verify "Quiz Added successfully.Now you can add questions." message displays', async () => {
        await quizPage.verifyQuizAddedSuccessfully();
    });

    await test.step('Step 6: Click on Back button', async () => {
        await quizPage.clickBack();
    });

    await test.step('Step 7: Verify the added quiz is visible in the grid', async () => {
        await quizPage.verifyQuizVisibleInGrid();
    });

    await test.step('Step 8: Click Edit on the created quiz', async () => {
        await quizPage.editQuiz();
    });

    await test.step('Step 9: Change Quiz Status to Deleted and click Save', async () => {
        await quizPage.updateQuizStatusToDeleted();
        await quizPage.clickSave();
    });

    await test.step('Step 10: Verify "Quiz Updated successfully !" notification', async () => {
        await quizPage.verifyQuizUpdatedSuccessfully();
    });
});