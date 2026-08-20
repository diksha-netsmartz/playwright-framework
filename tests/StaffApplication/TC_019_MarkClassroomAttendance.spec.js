import {test} from '@playwright/test';

import StaffLoginPage from '../../pages/StaffApplication/StaffLoginPage';
import ClassroomAttendancePage from '../../pages/StaffApplication/ClassroomAttendancePage';

import login from '../../test-data/login.json';

/**
 * TC_019: Centralize Staff Mobile (CSM)
 * Test Case Title: Verify attendance can be marked
 * Expected Result: Classroom attendance marked successfully message should display
 **/
test('TC_019: CSM - Verify attendance can be marked', async ({page}) => {

    const staffLoginPage = new StaffLoginPage(page);
    const classroomAttendancePage = new ClassroomAttendancePage(page);

    // Step 1: Login to the CSM portal as classroom instructor
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(login.classroomInstructor.username, login.classroomInstructor.password);

    // Step 2: In the "Upcoming Schedule" widget, click View
    await classroomAttendancePage.clickViewInUpcomingSchedule();

    // Step 3: Click the View All button
    await classroomAttendancePage.clickViewAll();

    // Step 4: From first filter, uncheck all and select Class
    await classroomAttendancePage.selectClassFilter();

    // Step 5: From last filter select "Last 26 Weeks" and click Filter
    await classroomAttendancePage.selectLast26WeeksAndFilter();

    // Step 6: Click on "Take Attendance" button
    await classroomAttendancePage.clickTakeAttendance();

    // Step 7: Check the checkbox in front of student name to mark them as present
    await classroomAttendancePage.markStudentPresent();

    // Step 8: Sign on the signature pad
    await classroomAttendancePage.signInstructorSignature();

    // Step 9: Click on Save button
    await classroomAttendancePage.saveAttendance();

    // Verify attendance marked successfully
    await classroomAttendancePage.verifyAttendanceMarkedSuccessfully();

});
