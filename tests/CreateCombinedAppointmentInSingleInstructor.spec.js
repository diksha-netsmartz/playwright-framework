import { test } from "@playwright/test";

import LoginPage from "../pages/LoginPage";
import HomePage from "../pages/HomePage";
import SingleInstructorPage from "../pages/Scheduling/SingleInstructor/SingleInstructorPage";
import CombinedAppointmentPage from "../pages/Scheduling/SingleInstructor/CombinedAppointmentPage";
import studentData from "../test-data/studentData.json";



import login from "../test-data/login.json";

test("Create Combined Appointment", async ({ page }) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const instructorPage = new SingleInstructorPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    // Login
    await loginPage.navigateToLoginPage();

    await loginPage.login(
        login.validUser.username,
        login.validUser.password
    );

    // await loginPage.closeMobilePopup();

    // Navigate to Single Instructor
    await homePage.navigateToSingleInstructor();

    await instructorPage.selectInstructor("dssteststaff");

    await instructorPage.getSchedule();


    await instructorPage.selectCreateAppointment(" Create Combined Appointment (Driver and Observer)");

    // Combined Appointment Popup
    await combinedAppointmentPage.verifyPopup();

    await combinedAppointmentPage.selectDropdown(
        "Location"
    );

    await combinedAppointmentPage.selectDropdown(
        "Vehicle"
    );


    // await combinedAppointmentPage.selectDuration();

await combinedAppointmentPage.fillStudentDetails(1,studentData.student1);
    await combinedAppointmentPage.fillStudentDetails(2,studentData.student2);

    await combinedAppointmentPage.submitAppointment();

});