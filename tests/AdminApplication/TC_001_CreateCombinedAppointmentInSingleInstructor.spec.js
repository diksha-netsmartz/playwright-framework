import { test } from "@playwright/test";

import LoginPage from "../../pages/AdminApplication/AdminLoginPage";
import HomePage from "../../pages/AdminApplication/AdminPortalHomePage";
import SingleInstructorPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/SingleInstructorPage";
import CombinedAppointmentPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/CombinedAppointmentPage";
import studentData from "../../test-data/studentData.json";
import login from "../../test-data/login.json";


/**
 * TC_001: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting created
 * Expected Result: Appointment should be created successfully and all the fields should have the value selected during creation
 **/
test("TC_001: C-admin > Scheduling - Verify that the appt is getting created", async ({ page }) => {
    test.setTimeout(600000);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const instructorPage = new SingleInstructorPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    // Step 1: On C-admin, login with valid credentials
    await loginPage.navigateToLoginPage();
    await loginPage.login(
        login.validUser.username,
        login.validUser.password
    );

    // Step 2: Navigate to Scheduling > Single Instructor
    await homePage.navigateToSingleInstructor();

    // Step 3: Select staff from left dropdown
    await instructorPage.selectInstructor();

    // Step 4: Click on Get Schedule
    await instructorPage.getSchedule();

    // Step 5: Right click on page, select -- Create Combined Appointment (Driver and Observer)
    await instructorPage.selectCreateAppointment(" Create Combined Appointment (Driver and Observer)");

    // Step 6: Select all the fields (Location, Vehicle, Students, Duration)
    await combinedAppointmentPage.verifyPopup();
    await combinedAppointmentPage.selectMidTimeDropdown();
    await combinedAppointmentPage.selectEndTimeDropdown();
    await combinedAppointmentPage.selectDropdown("Location");
    await combinedAppointmentPage.selectDropdown("Vehicle");
    await combinedAppointmentPage.fillStudentDetails(1, studentData.student1);
    await combinedAppointmentPage.fillStudentDetails(2, studentData.student2);
    await combinedAppointmentPage.selectDuration();

    // Step 7: Store values and click Submit
    await combinedAppointmentPage.storeAppointmentValues();
    await combinedAppointmentPage.submitAppointment();

    // Step 8: Verify appointment is created successfully and values match
    await instructorPage.editAppointment(combinedAppointmentPage.uniqueId);
    await combinedAppointmentPage.verifyCombinedAppointmentCreatedValues();

    // await instructorPage.deleteAppointment(combinedAppointmentPage.uniqueId);
});