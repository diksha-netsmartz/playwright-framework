import { test } from "@playwright/test";

import LoginPage from "../../pages/AdminApplication/AdminLoginPage";
import HomePage from "../../pages/AdminApplication/AdminPortalHomePage";
import SingleInstructorPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/SingleInstructorPage";
import CombinedAppointmentPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/CombinedAppointmentPage";
import studentData from "../../test-data/studentData.json";
import login from "../../test-data/login.json";

/**
 * TC_004: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting cancelled
 * Precondition: Create new appt using TC_001 (Appointment should be created for past date to verify this test case)
 * Expected Result: Appointment slot should become empty
 **/
test("TC_004: C-admin > Scheduling - Verify that the appt is getting cancelled", async ({ page }) => {
    test.setTimeout(600000);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const instructorPage = new SingleInstructorPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    // Step 1: Login to C-admin
    await loginPage.navigateToLoginPage();
    await loginPage.login(
        login.validUser.username,
        login.validUser.password
    );

    // Step 2: Navigate to Scheduling > Single Instructor and select instructor schedule
    await homePage.navigateToSingleInstructor();
    await instructorPage.selectInstructor();
    await instructorPage.getSchedule();

    // Precondition / Setup: Create initial Combined Appointment (under TC_001)
    await instructorPage.selectCreateAppointment(" Create Combined Appointment (Driver and Observer)");
    await combinedAppointmentPage.verifyPopup();
    await combinedAppointmentPage.selectMidTimeDropdown();
    await combinedAppointmentPage.selectEndTimeDropdown();
    await combinedAppointmentPage.selectDropdown("Location");
    await combinedAppointmentPage.selectDropdown("Vehicle");
    await combinedAppointmentPage.fillStudentDetails(1, studentData.student1);
    await combinedAppointmentPage.fillStudentDetails(2, studentData.student2);
    await combinedAppointmentPage.selectDuration();
    await combinedAppointmentPage.submitAppointment();

    // Step 3: Right click the appointment and select Edit Appointment
    await instructorPage.editAppointment(combinedAppointmentPage.uniqueId);

    // Step 4: Scroll down to Student 1's view and click "Cancel Appointment", enter text, confirm
    await combinedAppointmentPage.cancelAppointment(studentData.student1.name.replace(" ", ", "));

    // Step 5: Verify Student 1 appointment is cancelled successfully
    await instructorPage.editAppointment(combinedAppointmentPage.uniqueId);
    await combinedAppointmentPage.verifyAppointmentIsCancelledSuccessfully();

    // Step 6: Repeat cancel appointment for Student 2
    await combinedAppointmentPage.cancelAppointment(studentData.student2.name.replace(" ", ", "));
    await combinedAppointmentPage.verifyAppointmentIsCancelledSuccessfully();

    // Cleanup: Delete remaining appointment slot
    // await instructorPage.deleteAppointment(combinedAppointmentPage.uniqueId);
});