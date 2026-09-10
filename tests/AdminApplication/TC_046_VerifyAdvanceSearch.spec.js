import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import AdvancedSearchPage from '../../pages/AdminApplication/AdvancedSearch/AdvancedSearchPage';
import login from '../../test-data/json/login.json';

/**
 * TC_046: C-Admin >> Advance Search
 * Test Case Title: To Verify Advance Search
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Advance Search
 *   Step 3 - Select last whole month for Date Account Created
 *   Step 4 - Select Student Type as "Adult"
 *   Step 5 - Click Filter
 * Expected Result:
 *   List of students should display
 **/
test('TC_046: C-Admin >> Advance Search - To Verify Advance Search', { tag: '@advancedSearch' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const advancedSearchPage = new AdvancedSearchPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Advanced Search from side menu', async () => {
        await homePage.navigateToAdvancedSearch();
    });

    await test.step('Step 3: Select last whole month for Date Account Created', async () => {
        await advancedSearchPage.selectDateAccountCreated();
    });

    await test.step('Step 4: Select Student Type as "Adult"', async () => {
        await advancedSearchPage.selectStudentTypeAdult();
    });

    await test.step('Step 5: Click Filter and verify student list is displayed', async () => {
        await advancedSearchPage.clickFilter();
        await advancedSearchPage.verifyStudentListDisplayed();
    });
});
