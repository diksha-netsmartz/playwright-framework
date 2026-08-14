import {test} from '@playwright/test';

import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import NonGraphicalPage from '../../pages/AdminApplication/Scheduling/NonGraphicalPage';
import login from '../../test-data/login.json';
import studentData from '../../test-data/studentData.json';

test('Schedule Student Into Slot via Non Graphical', async ({page}) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const nonGraphicalPage = new NonGraphicalPage(page);

    // Step 1: Login
    await loginPage.navigateToLoginPage();
    await loginPage.login(login.validUser.username, login.validUser.password);

    // Step 2-3: Scheduling → Non Graphical
    await homePage.navigateToNonGraphical();

    // Step 4: Search by student name
    await nonGraphicalPage.searchStudent(studentData.student1.name);

    // Step 5: Select student from autocomplete dropdown
    await nonGraphicalPage.selectStudentOption(studentData.student1.name.replace(" ", ", "));

    // Step 6: Click Select Student
    await nonGraphicalPage.clickSelectStudent();

    // Step 7: Click on a date with green color (first available date)
    await nonGraphicalPage.selectFirstAvailableDate();

    // Step 8: Click Select (first slot checkbox)
    await nonGraphicalPage.selectSlot();

    // Step 9-10: Select appointment type
    await nonGraphicalPage.selectAppointmentType();
    await nonGraphicalPage.selectStatusType();

    // Step 11: Click Schedule Student Into Slot(s) and confirm
    await nonGraphicalPage.scheduleIntoSlot();
    await nonGraphicalPage.verifyToastMessageSuccessful();
});
