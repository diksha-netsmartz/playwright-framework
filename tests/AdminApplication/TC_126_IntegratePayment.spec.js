import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import CompanyInfoPage from '@pages/AdminApplication/Configuration/CompanyInfoPage';
import { credentials } from '@config/config';

/**
 * TC_126: C-Admin >> Configuration >> Integrate Payment
 * Test Case Title: TO verify Integrate Payment
 * Precondition: Staff should login to C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2: Click on configuration
 *   Step 3: Click on Integrate Payment
 *   Step 4: Page should be working
 *
 * Expected Result:
 *   Integrate payment should open
 **/
test('TC_126: C-Admin >> Configuration >> Integrate Payment - TO verify Integrate Payment', { tag: ['@CAdmin', '@configuration'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const companyInfoPage = new CompanyInfoPage(page);

    await test.step('Step 1: Login to C-Admin', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Integrate Payment', async () => {
        await homePage.navigateToIntegratePayment();
    });

    await test.step('Step 3: Page should be working (Integrate payment should open)', async () => {
        await companyInfoPage.verifyIntegratePaymentPageIsWorking();
    });
});
