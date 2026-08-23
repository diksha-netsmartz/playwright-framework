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
 * TC_004: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting cancelled
 * Precondition: Create new appt using TC_001 (Appointment should be created for past date to verify this test case)
 * Expected Result: Appointment slot should become empty
 **/
test("TC_004: C-admin > Scheduling - Verify that the appt is getting cancelled", async ({ page }) => {
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
    await combinedAppointmentPage.submitAppointment();

    // Step 6: Right click the appointment and select Edit Appointment
    await instructorPage.editAppointment(combinedAppointmentPage.uniqueId);

    // Step 7: Scroll down to Student 1's view and click "Cancel Appointment", enter text, confirm
    await combinedAppointmentPage.cancelAppointment(student1);

    // Step 8: Verify Student 1 appointment is cancelled successfully
    await instructorPage.editAppointment(combinedAppointmentPage.uniqueId);
    await combinedAppointmentPage.verifyAppointmentIsCancelledSuccessfully();

    // Step 9: Repeat cancel appointment for Student 2
    await combinedAppointmentPage.cancelAppointment(student2);
    await combinedAppointmentPage.verifyAppointmentIsCancelledSuccessfully();

    // Cleanup: Delete remaining appointment slot
    // await instructorPage.deleteAppointment(combinedAppointmentPage.uniqueId);
});