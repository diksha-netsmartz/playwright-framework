import {test} from "@playwright/test";

import LoginPage from "../pages/AdminLoginPage";
import HomePage from "../pages/AdminPortalHomePage";
import SingleInstructorPage from "../pages/Scheduling/SingleInstructor/SingleInstructorPage";
import AppointmentPage from "../pages/Scheduling/SingleInstructor/SingleInstructorAppointmentPage";

import login from "../test-data/login.json";

test("Create Appointment", async ({page}) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const instructorPage = new SingleInstructorPage(page);
    const appointmentPage = new AppointmentPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
        login.validUser.username,
        login.validUser.password
    );

    await loginPage.closeMobilePopup();
    await homePage.navigateToSingleInstructor();
    await instructorPage.selectInstructor("dssteststaff");
    await instructorPage.getSchedule();
    await instructorPage.rightClickTimeSlot();
    await instructorPage.selectCreateAppointment();
    await appointmentPage.verifyPopup();
    await appointmentPage.selectDropdown("Location");
    await appointmentPage.selectDropdown("Vehicle");
    await appointmentPage.selectDropdown("Language");
    await appointmentPage.selectStudent("dsstestjuly22");
    await appointmentPage.selectService("ABTestBTWComp");
    await appointmentPage.submitAppointment();

});