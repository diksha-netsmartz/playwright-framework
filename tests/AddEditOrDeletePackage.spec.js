import {test} from '@playwright/test';

import LoginPage from '../pages/AdminLoginPage';
import EnrollmentBillingPage from '../pages/EnrollmentBillingPage';
import HomePage from '../pages/AdminPortalHomePage'
import login from "../test-data/login.json";
import studentData from "../test-data/studentData.json"

test('Add CR and RT package and delete enrollment', async ({page}) => {

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

    await enrollmentBillingPage.clickAddNew();

    await enrollmentBillingPage.addCRPackage();


    await enrollmentBillingPage.enroll();

    await enrollmentBillingPage.editAndUpdateNotes();


    await enrollmentBillingPage.editAndDelete();
});