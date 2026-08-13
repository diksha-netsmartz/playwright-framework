import {test} from "@playwright/test";

import LoginPage from "../../pages/AdminApplication/AdminLoginPage";
import HomePage from "../../pages/AdminApplication/AdminPortalHomePage";
import SingleInstructorPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/SingleInstructorPage";
import CombinedAppointmentPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/CombinedAppointmentPage";
import studentData from "../../test-data/studentData.json";
import login from "../../test-data/login.json";

test("Delete created Combined Appointment", async ({page}) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const instructorPage = new SingleInstructorPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
        login.validUser.username,
        login.validUser.password
    );

    await homePage.navigateToSingleInstructor();

    await instructorPage.selectInstructor();

    await instructorPage.getSchedule();


    await instructorPage.selectCreateAppointment(" Create Combined Appointment (Driver and Observer)");

    await combinedAppointmentPage.verifyPopup();

    await combinedAppointmentPage.selectDropdown(
        "Location"
    );

    await combinedAppointmentPage.selectDropdown(
        "Vehicle"
    );

    await combinedAppointmentPage.fillStudentDetails(1, studentData.student1);
    await combinedAppointmentPage.fillStudentDetails(2, studentData.student2);
    await combinedAppointmentPage.selectDuration();

    await combinedAppointmentPage.storeAppointmentValues();
    await combinedAppointmentPage.submitAppointment();

    await instructorPage.editAppointment(combinedAppointmentPage.uniqueId);
    await combinedAppointmentPage.verifyCombinedAppointmentCreatedValues();
    await instructorPage.deleteAppointment(combinedAppointmentPage.uniqueId);

});