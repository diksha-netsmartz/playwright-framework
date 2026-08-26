import { test } from '@playwright/test';
import StudentLoginPage from '../../pages/StudentApplication/StudentLoginPage';
import StudentEnrollPage from '../../pages/StudentApplication/StudentEnrollPage';
import login from '../../test-data/login.json';
import StudentHomePage from '../../pages/StudentApplication/StudentPortalHomePage'

/**
 * TC_012: CSP
 * Test Case Title: Verify student is able to Enroll Package
 * Expected Result: Student should be enrolled to selected Package and Receipt should appear
 **/
test('TC_012: CSP - Verify student is able to Enroll Package', { tag: '@smoke' }, async ({ page }) => {

    const studentLoginPage = new StudentLoginPage(page);
    const studentEnrollPage = new StudentEnrollPage(page);
    const studentHomePage = new StudentHomePage(page);

    let receiptPage;

    await test.step('Step 1: Login to student portal (CSP)', async () => {
        await studentLoginPage.navigateToLoginPage();
        await studentLoginPage.login(login.studentUser.username, login.studentUser.password);
    });

    await test.step('Step 2: Navigate to Enroll on left navigation', async () => {
        await studentHomePage.navigateToEnroll();
    });

    await test.step('Step 3 & 4: Select Package and click Pay Later', async () => {
        await studentEnrollPage.selectPackage();
        await studentEnrollPage.clickPayLater();
    });

    await test.step('Verify student enrollment success', async () => {
        await studentEnrollPage.verifyEnrollmentSuccess();
    });

    await test.step('Step 5: Click Print Receipt and verify receipt page', async () => {
        receiptPage = await studentEnrollPage.clickPrintReceipt();
        await studentEnrollPage.verifyReceiptPage(receiptPage);
    });
});

