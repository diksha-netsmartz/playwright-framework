import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import ClassListPage from '../../pages/AdminApplication/ClassListPage';
import login from '../../test-data/login.json';

/**
 * TC_022: C-Admin > Classroom > Classroom List
 * Test Case Title: To verify CR List showing
 * Precondition: User should have valid admin login credentials
 * Expected Result: The class list should appear successfully
 **/
test('TC_022: C-admin > Classroom > Classroom List - To verify CR List showing', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const classListPage = new ClassListPage(page);

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(login.validUser.username, login.validUser.password);
    });

    await test.step('Step 2: Navigate to Classroom >> Class List', async () => {
        await homePage.navigateToClassList();
    });

    await test.step('Step 3: Verify the class list appears successfully', async () => {
        await classListPage.verifyClassListIsDisplayed();
    });
});