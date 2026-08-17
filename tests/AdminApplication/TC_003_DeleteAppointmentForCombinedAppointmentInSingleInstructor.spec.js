import {test} from "@playwright/test";

import LoginPage from "../../pages/AdminApplication/AdminLoginPage";
import HomePage from "../../pages/AdminApplication/AdminPortalHomePage";
import SingleInstructorPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/SingleInstructorPage";
import CombinedAppointmentPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/CombinedAppointmentPage";
import studentData from "../../test-data/studentData.json";
import login from "../../test-data/login.json";

/**
 * TC_003: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting deleted
 * Precondition: TC_001 should be executed
 * Expected Result: Appointment should get deleted successfully and removed from the graphical scheduler
 **/
test("TC_003: C-admin > Scheduling - Verify that the appt is getting deleted", async ({page}) => {

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
    await instructorPage.editAppointment(combinedAppointmentPage.uniqueId);
    await combinedAppointmentPage.verifyCombinedAppointmentCreatedValues();

    // Step 3: Hover over the appointment created under TC_001 and click delete icon (x)
    // Step 4: Confirm Delete on popup and verify appointment is deleted
    await instructorPage.deleteAppointment(combinedAppointmentPage.uniqueId);
});