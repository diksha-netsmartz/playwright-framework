import {test} from '@playwright/test';

import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import EnrollmentBillingPage from '../../pages/AdminApplication/EnrollmentBillingPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage'
import login from "../../test-data/login.json";
import studentData from "../../test-data/studentData.json"

test('Verify payment methods for billing', async ({page}) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentBillingPage = new EnrollmentBillingPage(page);


    await loginPage.navigateToLoginPage();

    await loginPage.login(
        login.validUser.username,
        login.validUser.password
    );

    await homePage.openEnrollmentBilling();


    await enrollmentBillingPage.selectStudent(studentData.student1.name);

    await enrollmentBillingPage.addSwipedTransaction();

    await enrollmentBillingPage.addCheckPayment();

    await enrollmentBillingPage.addCashPayment();

    await enrollmentBillingPage.addAdjustment();

    await enrollmentBillingPage.processCreditCardPayment();
});