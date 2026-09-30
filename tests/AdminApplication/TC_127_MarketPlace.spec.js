import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import CompanyInfoPage from '@pages/AdminApplication/Configuration/CompanyInfoPage';
import { credentials } from '@config/config';

/**
 * TC_127: C-Admin >> Configuration >> Market Place
 * Test Case Title: To Verify Market Place
 * Precondition: Staff should login to C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2: Click on configuration
 *   Step 3: Click on Market Place
 *   Step 4: Page should be working
 *
 * Expected Result:
 *   Market place should open
 **/
test('TC_127: C-Admin >> Configuration >> Market Place - To Verify Market Place', { tag: ['@CAdmin', '@configuration'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const companyInfoPage = new CompanyInfoPage(page);

    await test.step('Step 1: Login to C-Admin', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to marketplace', async () => {
        await homePage.navigateToMarketplace();
    });

    await test.step('Step 3: Page should be working (Market place should open)', async () => {
        await companyInfoPage.verifyMarketPlacePageIsWorking();
    });
});
