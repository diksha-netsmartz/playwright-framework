import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import HowDidYouHearPage from '../../pages/AdminApplication/AccountManagement/HowDidYouHearPage';
import login from '../../test-data/json/login.json';
import howDidYouHearData from '../../test-data/json/howDidYouHearData.json';

/**
 * TC_038: C-Admin >> Account Management >> How do you hear
 * Test Case Title: To verify user able to add / edit How do you hear
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Account Management > How did you hear
 *   Step 3 - Click on "Add New" and fill all the fields (Select Active status from dropdown)
 *   Step 4 - Click on Save button and verify How did you hear created successfully
 *   Step 5 - Search the created How did you hear and click on Edit
 *   Step 6 - Update fields (Notes, Status) and save
 *   Step 7 - Verify How did you hear edited successfully
 * Expected Result:
 *   1. How do you hear should be created successfully
 *   2. How do you hear should be edited successfully
 **/
test('TC_038: C-Admin >> Account Management >> How do you hear - To verify user able to add / edit How do you hear', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const howDidYouHearPage = new HowDidYouHearPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Account Management > How did you hear', async () => {
        await homePage.navigateToHowDidYouHear();
    });

    await test.step('Step 3: Click "Add New" and fill How did you hear details', async () => {
        await howDidYouHearPage.clickAddNew();
        await howDidYouHearPage.fillHowDidYouHearDetails(howDidYouHearData);
    });

    await test.step('Step 4: Click on Save button and verify How did you hear created successfully', async () => {
        await howDidYouHearPage.clickSave();
        await howDidYouHearPage.verifyHowDidYouHearCreatedSuccessfully();
    });

    await test.step('Step 5: Search the created How did you hear and click on Edit', async () => {
        await howDidYouHearPage.searchAndEditHowDidYouHear();
    });

    await test.step('Step 6: Update fields and save edited How did you hear', async () => {
        await howDidYouHearPage.editHowDidYouHearDetails(howDidYouHearData);
        await howDidYouHearPage.clickSave();
    });

    await test.step('Step 7: Verify How did you hear edited successfully', async () => {
        await howDidYouHearPage.verifyHowDidYouHearUpdatedSuccessfully();
    });
});