import {test} from '@playwright/test';

import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import EnrollmentBillingPage from '../../pages/AdminApplication/EnrollmentBillingPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage'
import login from "../../test-data/login.json";
import studentData from "../../test-data/studentData.json"

/**
 * TC_008: C-admin > Student > Billing
 * Test Case Title: Verify user is able to make payment.
 * Precondition: Student should be created first
 * Expected Result: Payments should be made by user
 **/
test('TC_008: C-admin > Student > Billing - Verify user is able to make payment', async ({page}) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentBillingPage = new EnrollmentBillingPage(page);

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(
            login.validUser.username,
            login.validUser.password
        );
    });

    await test.step('Step 2: Navigate to Student Account -> Enrollment/Billing', async () => {
        await homePage.openEnrollmentBilling();
    });

    await test.step(`Step 3: Search and select student: "${studentData.student1.name}"`, async () => {
        await enrollmentBillingPage.selectStudent(studentData.student1.name);
    });

    await test.step('Step 4: Add Swipe transaction payment method', async () => {
        await enrollmentBillingPage.addSwipedTransaction();
    });

    await test.step('Step 5: Add Check payment method', async () => {
        await enrollmentBillingPage.addCheckPayment();
    });

    await test.step('Step 6: Add Cash payment method', async () => {
        await enrollmentBillingPage.addCashPayment();
    });

    await test.step('Step 7: Add Adjustment billing method', async () => {
        await enrollmentBillingPage.addAdjustment();
    });

    await test.step('Step 8: Process Credit Card payment', async () => {
        await enrollmentBillingPage.processCreditCardPayment();
    });
});