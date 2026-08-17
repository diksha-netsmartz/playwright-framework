import { test } from '@playwright/test';
import StudentLoginPage from '../../pages/StudentApplication/StudentLoginPage';
import StudentEnrollPage from '../../pages/StudentApplication/StudentEnrollPage';
import login from '../../test-data/login.json';
import studentData from '../../test-data/studentData.json';
import StudentHomePage from '../../pages/StudentApplication/StudentPortalHomePage'

/**
 * TC_012: CSP
 * Test Case Title: Verify student is able to Enroll Package
 * Expected Result: Student should be enrolled to selected Package and Receipt should appear
 **/
test('TC_012: CSP - Verify student is able to Enroll Package', async ({ page }) => {

    const studentLoginPage = new StudentLoginPage(page);
    const studentEnrollPage = new StudentEnrollPage(page);
    const studentHomePage = new StudentHomePage(page);

    // Step 1: Login to student portal (CSP)
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(login.studentUser.username, login.studentUser.password);

    // Step 2: Click on Enroll on left Navigation
    await studentHomePage.navigateToEnroll();

    // Step 3: Select Package
    await studentEnrollPage.selectPackage();

    // Step 4: Click on Pay Later
    await studentEnrollPage.clickPayLater();

    // Verify student is enrolled successfully
    await studentEnrollPage.verifyEnrollmentSuccess();

    // Step 5: Click on Print Receipt
    const receiptPage = await studentEnrollPage.clickPrintReceipt();

    // Verify receipt shows Enrollment COMPLETED
    await studentEnrollPage.verifyReceiptPage(receiptPage);
});
