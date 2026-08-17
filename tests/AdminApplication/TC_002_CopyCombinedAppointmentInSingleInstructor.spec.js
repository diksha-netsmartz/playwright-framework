import { test } from "@playwright/test";

import LoginPage from "../../pages/AdminApplication/AdminLoginPage";
import HomePage from "../../pages/AdminApplication/AdminPortalHomePage";
import SingleInstructorPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/SingleInstructorPage";
import CombinedAppointmentPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/CombinedAppointmentPage";
import studentData from "../../test-data/studentData.json";
import login from "../../test-data/login.json";

/**
 * TC_002: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting copied
 * Precondition: TC_001 should be successfully executed
 * Expected Result: Appointment should get copied successfully and all the data should match the copied appointment
 **/
test("TC_002: C-admin > Scheduling - Verify that the appt is getting copied", async ({ page }) => {

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
    await combinedAppointmentPage.storeAppointmentValues();
    await combinedAppointmentPage.submitAppointment();

    // Step 3: Right click on the appointment created and select "Copy Appointment"
    await instructorPage.copyAppointment(combinedAppointmentPage.uniqueId);

    // Step 4: Right click anywhere else on graphical scheduler and select "Paste Last Copied Appointment"
    await instructorPage.verifyAppointmentIsCopied(combinedAppointmentPage.uniqueId);

    // Step 5: Verify appointment is copied successfully and all data matches
    await instructorPage.editAndVerifyDetailsForAllAppointments(combinedAppointmentPage.uniqueId, combinedAppointmentPage);

    // Cleanup: Delete created and copied appointments
    await instructorPage.deleteAppointment(combinedAppointmentPage.uniqueId);
    await instructorPage.deleteAppointment(combinedAppointmentPage.uniqueId);
});