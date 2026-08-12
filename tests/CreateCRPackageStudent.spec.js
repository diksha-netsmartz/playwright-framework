import {test} from '@playwright/test';
import LoginPage from '../pages/AdminLoginPage';
import NewStudentEnrollmentPage from '../pages/NewStudentEnrollmentPage';
import login from "../test-data/login.json";
import HomePage from "../pages/AdminPortalHomePage";
import studentData from "../test-data/studentData.json";


test('Create student with CR package', async ({page}) => {

    const loginPage = new LoginPage(page);
    const enrollmentPage = new NewStudentEnrollmentPage(page);
    const homePage = new HomePage(page);


    await loginPage.navigateToLoginPage();

    await loginPage.login(
        login.validUser.username,
        login.validUser.password
    );

    await homePage.navigateToNewStudentEnrollment();

    await enrollmentPage.addPackage('CR Package');

    await enrollmentPage.fillStudentInformation(studentData.student1);
    // await enrollmentPage.selectDOBInStudentDetails();

    await enrollmentPage.save();

});