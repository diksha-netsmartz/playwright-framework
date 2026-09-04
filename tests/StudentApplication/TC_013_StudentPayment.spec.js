import { test } from '@playwright/test';
import StudentLoginPage from '../../pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '../../pages/StudentApplication/StudentPortalHomePage';
import login from '../../test-data/json/login.json';

/**
 * TC_013: CSP > Verify Student is able to make Payment
 * Precondition: Student should have Amount balance to be paid
 * Steps:
 *  Step 1: Login to student Portal (CSP)
 *  Step 2: Click on Pay now on Top right
 *  Step 3: Enter values in all payment fields
 *  Step 4: Click on Pay button
 * Expected Result: Payment should be made successfully
 **/
test('TC_013: CSP - Verify Student is able to make Payment', { tag: '@smoke' }, async ({ page }) => {

    const studentLoginPage = new StudentLoginPage(page);
    const studentHomePage = new StudentHomePage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to student Portal (CSP) with valid credentials', async () => {
        await studentLoginPage.navigateToLoginPage();
        await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
    });

    await test.step('Step 2: Click on Pay now on Top right to open Pay Balance modal', async () => {
        await studentHomePage.openPayBalanceModal();
    });

    await test.step('Step 3: Enter payment details in all fields', async () => {
        await studentHomePage.fillPaymentDetails();
    });

    await test.step('Step 4: Click on Pay button and verify payment completion', async () => {
        await studentHomePage.submitPayment();
        await studentHomePage.verifyPaymentSuccess();
    });
});