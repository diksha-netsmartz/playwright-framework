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
 * TC_003: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting deleted
 * Precondition: TC_001 should be executed
 * Expected Result: Appointment should get deleted successfully and removed from the graphical scheduler
 **/
test("TC_003: C-admin > Scheduling - Verify that the appt is getting deleted", async ({ page }) => {
    // test.setTimeout(480000);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentPage = new NewStudentEnrollmentPage(page);
    const instructorPage = new SingleInstructorPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    // Step 1: On C-admin, login with valid credentials
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

    // Step 5: Navigate to Scheduling > Single Instructor
    await homePage.navigateToSingleInstructor();

    // Step 6: Select staff from left dropdown
    await instructorPage.selectInstructor();

    // Step 7: Click on Get Schedule
    await instructorPage.getSchedule();

    // Step 8: Right click on page, select -- Create Combined Appointment (Driver and Observer)
    await instructorPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType);

    // Step 9: Select all the fields (Location, Vehicle, Students, Duration)
    await combinedAppointmentPage.verifyPopup();
    await combinedAppointmentPage.selectMidTimeDropdown();
    await combinedAppointmentPage.selectEndTimeDropdown();
    await combinedAppointmentPage.selectDropdown("Location");
    await combinedAppointmentPage.selectDropdown("Vehicle");
    await combinedAppointmentPage.fillStudentDetails(1, student1);
    await combinedAppointmentPage.fillStudentDetails(2, student2);
    await combinedAppointmentPage.selectDuration();

    // Step 10: Store values and click Submit
    await combinedAppointmentPage.storeAppointmentValues();
    await combinedAppointmentPage.submitAppointment();

    // Step 11: Delete appointment
    await instructorPage.deleteAppointment(combinedAppointmentPage.uniqueId);
});