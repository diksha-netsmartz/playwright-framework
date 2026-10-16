import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import ZipCodePage from '@pages/AdminApplication/Configuration/ZipCodePage';
import TestDataGenerator from '@utils/TestDataGenerator';
import { credentials } from '@config/config';

/**
 * TC_129: C-Admin >> Configuration >> Zipcodes
 * Test Case Title: To Verify staff is able to update zipcode
 * Precondition: Staff should login to C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2: Click on configuration
 *   Step 3: Click on zip code
 *   Step 4: Add Zip code in textbox
 *   Step 5: Click on Add button
 *   Step 6: Select added zip code, click Save and confirm
 *
 * Expected Result:
 *   Staff should be able to add Zipcode and save changes successfully
 **/
test('TC_129: C-Admin >> Configuration >> Zipcodes - To Verify staff is able to update zipcode', { tag: ['@CAdmin', '@configuration'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const zipCodePage = new ZipCodePage(page);

    const randomZipCode = TestDataGenerator.generateRandomZipCode();

    await test.step('Step 1: Login to C-Admin', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2 & 3: Navigate to Configuration -> Zip Code', async () => {
        await homePage.navigateToZipCode();
    });

    await test.step(`Step 4 & 5: Add Zip code "${randomZipCode}" and click Add`, async () => {
        await zipCodePage.addZipCode(randomZipCode);
    });

    await test.step(`Step 6: Select added zip code "${randomZipCode}", click Save and confirm`, async () => {
        await zipCodePage.selectZipCode(randomZipCode);
    });
});