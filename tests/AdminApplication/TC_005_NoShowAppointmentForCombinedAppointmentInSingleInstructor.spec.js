import { test } from "@playwright/test";

import LoginPage from "../../pages/AdminApplication/AdminLoginPage";
import HomePage from "../../pages/AdminApplication/AdminPortalHomePage";
import SingleInstructorPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/SingleInstructorPage";
import CombinedAppointmentPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/CombinedAppointmentPage";
import studentData from "../../test-data/studentData.json";
import login from "../../test-data/login.json";

/**
 * TC_005: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting marked as no show
 * Precondition: TC_004 should be executed
 * Expected Result: Appointment slot should become empty
 **/
test("TC_005: C-admin > Scheduling - Verify that the appt is getting marked as no show", async ({ page }) => {
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
    await instructorPage.editNoShowAppointment(combinedAppointmentPage.uniqueId);

    // Step 4: Scroll down to Student 1's view and click "No Show", enter text, confirm
    await combinedAppointmentPage.markAppointmentAsNoShow(studentData.student1.name.replace(" ", ", "));

    // Step 5: Verify Student 1 appointment is marked as no show successfully
    await combinedAppointmentPage.verifyAppointmentIsMarkedAsNoShowSuccessfully();

    // Step 6: Repeat no show for Student 2
    await instructorPage.editNoShowAppointment(combinedAppointmentPage.uniqueId);
    await combinedAppointmentPage.markAppointmentAsNoShow(studentData.student2.name.replace(" ", ", "));
    await combinedAppointmentPage.verifyAppointmentIsMarkedAsNoShowSuccessfully();
});