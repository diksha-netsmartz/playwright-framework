import { test } from "@playwright/test";

import LoginPage from "../../pages/AdminApplication/AdminLoginPage";
import HomePage from "../../pages/AdminApplication/AdminPortalHomePage";
import NewStudentEnrollmentPage from "../../pages/AdminApplication/NewStudentEnrollmentPage";
import SingleInstructorPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/SingleInstructorPage";
import CombinedAppointmentPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/CombinedAppointmentPage";
import TestDataGenerator from "../../utils/TestDataGenerator";
import createAppointmentData from "../../test-data/createAppointmentData.json";
import login from "../../test-data/login.json";

/**
 * TC_002: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting copied
 * Precondition: TC_001 should be successfully executed
 * Expected Result: Appointment should get copied successfully and all the data should match the copied appointment
 **/
test("TC_002: C-admin > Scheduling - Verify that the appt is getting copied", async ({ page }) => {
    // test.setTimeout(480000);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentPage = new NewStudentEnrollmentPage(page);
    const instructorPage = new SingleInstructorPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    // Step 1: Login to C-admin
    await loginPage.navigateToLoginPage();
    await loginPage.login(login.validUser.username, login.validUser.password);

    // Step 2: Generate dynamic student 1 & student 2 details at runtime
    const student1 = TestDataGenerator.generateStudentData(createAppointmentData.student1);
    const student2 = TestDataGenerator.generateStudentData(createAppointmentData.student2);
    console.log("Enrolling runtime Student 1:", student1.name);
    console.log("Enrolling runtime Student 2:", student2.name);

    // Step 3: Create / Enroll Student 1 (using TC_006 enrollment flow)
    await homePage.navigateToNewStudentEnrollment();
    await enrollmentPage.enrollNewStudent({
        packageName: createAppointmentData.packageConfig.packageName,
        fillInfoMethod: createAppointmentData.packageConfig.fillInfoMethod,
        studentData: student1,
        selectDOBInDetails: createAppointmentData.packageConfig.selectDOBInDetails
    });
    await enrollmentPage.closeEnrollmentConfirmationPopup();

    // Step 4: Create / Enroll Student 2 (using TC_006 enrollment flow)
    await homePage.navigateToNewStudentEnrollment();
    await enrollmentPage.enrollNewStudent({
        packageName: createAppointmentData.packageConfig.packageName,
        fillInfoMethod: createAppointmentData.packageConfig.fillInfoMethod,
        studentData: student2,
        selectDOBInDetails: createAppointmentData.packageConfig.selectDOBInDetails
    });
    await enrollmentPage.closeEnrollmentConfirmationPopup();

    // Step 5: Navigate to Scheduling > Single Instructor and select instructor schedule
    await homePage.navigateToSingleInstructor();
    await instructorPage.selectInstructor();
    await instructorPage.getSchedule();

    // Precondition / Setup: Create initial Combined Appointment (under TC_001)
    await instructorPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType);
    await combinedAppointmentPage.verifyPopup();
    await combinedAppointmentPage.selectMidTimeDropdown();
    await combinedAppointmentPage.selectEndTimeDropdown();
    await combinedAppointmentPage.selectDropdown("Location");
    await combinedAppointmentPage.selectDropdown("Vehicle");
    await combinedAppointmentPage.fillStudentDetails(1, student1);
    await combinedAppointmentPage.fillStudentDetails(2, student2);
    await combinedAppointmentPage.selectDuration();
    await combinedAppointmentPage.storeAppointmentValues();
    await combinedAppointmentPage.submitAppointment();

    // Step 6: Right click on the appointment created and select "Copy Appointment"
    await instructorPage.copyAppointment(combinedAppointmentPage.uniqueId);

    // Step 7: Right click anywhere else on graphical scheduler and select "Paste Last Copied Appointment"
    await instructorPage.verifyAppointmentIsCopied(combinedAppointmentPage.uniqueId);

    // Step 8: Verify appointment is copied successfully and all data matches
    await instructorPage.editAndVerifyDetailsForAllAppointments(combinedAppointmentPage.uniqueId, combinedAppointmentPage, student1, student2);

    // Cleanup: Delete created and copied appointments
    await instructorPage.deleteAppointment(combinedAppointmentPage.uniqueId);
    await instructorPage.deleteAppointment(combinedAppointmentPage.uniqueId);
})