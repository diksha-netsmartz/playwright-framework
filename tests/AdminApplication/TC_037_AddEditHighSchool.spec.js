import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import HighSchoolsPage from '../../pages/AdminApplication/AccountManagement/HighSchoolsPage';
import login from '../../test-data/json/login.json';
import highSchoolData from '../../test-data/json/highSchoolData.json';

/**
 * TC_037: C-Admin >> Account Management >> High School
 * Test Case Title: To verify user able to add / edit High School
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Account Management > High Schools
 *   Step 3 - Click on "Add New" and fill all the fields (Select Active status from dropdown)
 *   Step 4 - Click on Save button and verify High School is created successfully
 *   Step 5 - Search the created High School and click on Edit
 *   Step 6 - Edit High School fields (Notes, Email, Status) and save
 *   Step 7 - Verify High School info is updated successfully
 * Expected Result:
 *   1. High School should be created successfully
 *   2. High School should be edited successfully
 **/
test('TC_037: C-Admin >> Account Management >> High School - To verify user able to add / edit High School', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const highSchoolsPage = new HighSchoolsPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Account Management > High Schools', async () => {
        await homePage.navigateToHighSchools();
    });

    await test.step('Step 3: Click "Add New" and fill High School details', async () => {
        await highSchoolsPage.clickAddNew();
        await highSchoolsPage.fillHighSchoolDetails(highSchoolData);
    });

    await test.step('Step 4: Click on Save button and verify High School created successfully', async () => {
        await highSchoolsPage.clickSave();
        await highSchoolsPage.verifyHighSchoolCreatedSuccessfully();
    });

    await test.step('Step 5: Search the created High School and click on Edit', async () => {
        await highSchoolsPage.searchAndEditHighSchool();
    });

    await test.step('Step 6: Update fields and save edited High School', async () => {
        await highSchoolsPage.editHighSchoolDetails(highSchoolData);
        await highSchoolsPage.clickSaveForUpdate();
    });

    await test.step('Step 7: Verify High School edited successfully', async () => {
        await highSchoolsPage.verifyHighSchoolUpdatedSuccessfully();
    });
});