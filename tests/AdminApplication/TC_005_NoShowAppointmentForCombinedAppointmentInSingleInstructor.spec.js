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
 * TC_005: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting marked as no show
 * Precondition: TC_004 should be executed
 * Expected Result: Appointment slot should become empty
 **/
test("TC_005: C-admin > Scheduling - Verify that the appt is getting marked as no show", async ({ page }) => {
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
    await instructorPage.editNoShowAppointment(student1);

    // Step 7: Scroll down to Student 1's view and click "No Show", enter text, confirm
    await combinedAppointmentPage.markAppointmentAsNoShow(student1);

    // Step 8: Verify Student 1 appointment is marked as no show successfully
    await combinedAppointmentPage.verifyAppointmentIsMarkedAsNoShowSuccessfully();

    // Step 9: Repeat no show for Student 2
    await instructorPage.editNoShowAppointment(student2);
    await combinedAppointmentPage.markAppointmentAsNoShow(student2);
    await combinedAppointmentPage.verifyAppointmentIsMarkedAsNoShowSuccessfully();
});