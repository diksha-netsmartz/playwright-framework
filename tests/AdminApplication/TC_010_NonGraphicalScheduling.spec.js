import {test} from '@playwright/test';

import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import NonGraphicalPage from '../../pages/AdminApplication/Scheduling/NonGraphicalPage';
import login from '../../test-data/login.json';
import studentData from '../../test-data/studentData.json';

/**
 * TC_010: C-Admin > Scheduling > Non Graphical
 * Test Case Title: Student should be able to Schedule in an Appointment
 * Precondition: Appointment should be Available to be Scheduled
 * Expected Result: Appointment should be scheduled to the student.
 **/
test('TC_010: C-admin > Scheduling > Non Graphical - Student should be able to Schedule in an Appointment', async ({page}) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const nonGraphicalPage = new NonGraphicalPage(page);

    // Step 1: Login to site
    await loginPage.navigateToLoginPage();
    await loginPage.login(login.validUser.username, login.validUser.password);

    // Step 2-3: Click on Scheduling -> Non Graphical
    await homePage.navigateToNonGraphical();

    // Step 4: Search by student name
    await nonGraphicalPage.searchStudent(studentData.student1.name);

    // Step 5: Select student test, student 1
    await nonGraphicalPage.selectStudentOption(studentData.student1.name.replace(" ", ", "));

    // Step 6: Click on Select Student
    await nonGraphicalPage.clickSelectStudent();

    // Step 7: Click on Date with Green color
    await nonGraphicalPage.selectFirstAvailableDate();

    // Step 8: Click Select
    await nonGraphicalPage.selectSlot();

    // Step 9: Select Type
    await nonGraphicalPage.selectAppointmentType();

    // Step 10: Select Status
    await nonGraphicalPage.selectStatusType();

    // Step 11: Click Select student into Slot
    await nonGraphicalPage.scheduleIntoSlot();
    await nonGraphicalPage.verifyToastMessageSuccessful();
});
