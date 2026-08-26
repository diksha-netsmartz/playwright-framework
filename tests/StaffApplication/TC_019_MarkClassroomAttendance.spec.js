import {test} from '@playwright/test';

import StaffLoginPage from '../../pages/StaffApplication/StaffLoginPage';
import ClassroomAttendancePage from '../../pages/StaffApplication/ClassroomAttendancePage';

import login from '../../test-data/json/login.json';

/**
 * TC_019: Centralize Staff Mobile (CSM)
 * Test Case Title: Verify attendance can be marked
 * Expected Result: Classroom attendance marked successfully message should display
 **/
test('TC_019: CSM - Verify attendance can be marked', { tag: '@smoke' }, async ({page}) => {

    const staffLoginPage = new StaffLoginPage(page);
    const classroomAttendancePage = new ClassroomAttendancePage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to CSM portal as classroom instructor', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(credentials.classroomInstructor.username, credentials.classroomInstructor.password);
    });

    await test.step('Step 2 & 3: Navigate to Upcoming Schedule and view all', async () => {
        await classroomAttendancePage.clickViewInUpcomingSchedule();
        await classroomAttendancePage.clickViewAll();
    });

    await test.step('Step 4 & 5: Filter by Class and Last 26 Weeks', async () => {
        await classroomAttendancePage.selectClassFilter();
        await classroomAttendancePage.selectLast26WeeksAndFilter();
    });

    await test.step('Step 6: Click Take Attendance', async () => {
        await classroomAttendancePage.clickTakeAttendance();
    });

    await test.step('Step 7 & 8: Mark student present and sign signature', async () => {
        await classroomAttendancePage.markStudentPresent();
        await classroomAttendancePage.signInstructorSignature();
    });

    await test.step('Step 9: Save attendance and verify success message', async () => {
        await classroomAttendancePage.saveAttendance();
        await classroomAttendancePage.verifyAttendanceMarkedSuccessfully();
    });
});

