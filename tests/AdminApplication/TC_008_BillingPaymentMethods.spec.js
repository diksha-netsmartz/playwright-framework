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

    // Step 1: Login to C-admin
    await loginPage.navigateToLoginPage();
    await loginPage.login(
        login.validUser.username,
        login.validUser.password
    );

    // Step 2: Click on Student Account on left Navigation -> Enrollment/Billing
    await homePage.openEnrollmentBilling();

    // Step 3: Click on Student not selected, search student with lastname, select and click Go
    await enrollmentBillingPage.selectStudent(studentData.student1.name);

    // Step 4: Click on Add New on Right Side and add Swipe transaction
    await enrollmentBillingPage.addSwipedTransaction();

    // Step 5: Click on Add New and add Check payment
    await enrollmentBillingPage.addCheckPayment();

    // Step 6: Click on Add New and add Cash payment
    await enrollmentBillingPage.addCashPayment();

    // Step 7: Click on Add New and add Adjustment
    await enrollmentBillingPage.addAdjustment();

    // Step 8: Click on Add New and Process Credit Card payment
    await enrollmentBillingPage.processCreditCardPayment();
});