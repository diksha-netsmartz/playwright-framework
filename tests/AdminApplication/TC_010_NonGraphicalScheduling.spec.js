import { test } from '@playwright/test';

import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import NonGraphicalPage from '../../pages/AdminApplication/Scheduling/NonGraphicalPage';
import login from '../../test-data/json/login.json';

/**
 * TC_010: C-Admin > Scheduling > Non Graphical
 * Test Case Title: Student should be able to Schedule in an Appointment
 * Precondition: Appointment should be Available to be Scheduled
 * Expected Result: Appointment should be scheduled to the student.
 **/
test('TC_010: C-admin > Scheduling > Non Graphical - Student should be able to Schedule in an Appointment', { tag: ['@scheduling', '@smoke'] }, async ({ page }) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const nonGraphicalPage = new NonGraphicalPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];
    const targetStudent = credentials.studentUser.name;

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2 & 3: Navigate to Scheduling -> Non Graphical', async () => {
        await homePage.navigateToNonGraphical();
    });

    await test.step(`Step 4-6: Search and select student: "${targetStudent}"`, async () => {
        await nonGraphicalPage.searchStudent(targetStudent);
        await nonGraphicalPage.selectStudentOption(targetStudent.replace(" ", ", "));
        await nonGraphicalPage.clickSelectStudent();
    });

    await test.step('Step 7: Select first available green date', async () => {
        await nonGraphicalPage.selectFirstAvailableDate();
    });

    await test.step('Step 8-11: Select slot, appointment type, status, schedule student and verify confirmation', async () => {
        await nonGraphicalPage.scheduleIntoSlot();
    });
});

