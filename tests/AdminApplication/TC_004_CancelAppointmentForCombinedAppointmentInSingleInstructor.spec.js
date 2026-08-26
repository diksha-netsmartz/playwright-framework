import { test } from "@playwright/test";
import LoginPage from "../../pages/AdminApplication/AdminLoginPage";
import HomePage from "../../pages/AdminApplication/AdminPortalHomePage";
import NewStudentEnrollmentPage from "../../pages/AdminApplication/NewStudentEnrollmentPage";
import SingleInstructorPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/SingleInstructorPage";
import CombinedAppointmentPage from "../../pages/AdminApplication/Scheduling/SingleInstructor/CombinedAppointmentPage";
import TestDataGenerator from "../../utils/TestDataGenerator";
import createAppointmentData from "../../test-data/json/createAppointmentData.json";
import login from "../../test-data/json/login.json";

/**
 * TC_004: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting cancelled
 * Precondition: Create new appt using TC_001 (Appointment should be created for past date to verify this test case)
 * Expected Result: Appointment slot should become empty
 **/
test("TC_004: C-admin > Scheduling - Verify that the appt is getting cancelled", { tag: '@smoke' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentPage = new NewStudentEnrollmentPage(page);
    const instructorPage = new SingleInstructorPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];
    let student1;
    let student2;

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Generate dynamic student 1 & student 2 details at runtime', async () => {
        student1 = TestDataGenerator.generateStudentData(createAppointmentData.student1);
        student2 = TestDataGenerator.generateStudentData(createAppointmentData.student2);
        console.log("Enrolling runtime Student 1:", student1.name);
        console.log("Enrolling runtime Student 2:", student2.name);
    });

    await test.step('Step 3: Create / Enroll Student 1', async () => {
        await homePage.navigateToNewStudentEnrollment();
        await enrollmentPage.enrollNewStudent({
            packageName: createAppointmentData.packageConfig.packageName,
            fillInfoMethod: createAppointmentData.packageConfig.fillInfoMethod,
            studentData: student1,
            selectDOBInDetails: createAppointmentData.packageConfig.selectDOBInDetails
        });
        await enrollmentPage.closeEnrollmentConfirmationPopup();
    });

    await test.step('Step 4: Create / Enroll Student 2', async () => {
        await homePage.navigateToNewStudentEnrollment();
        await enrollmentPage.enrollNewStudent({
            packageName: createAppointmentData.packageConfig.packageName,
            fillInfoMethod: createAppointmentData.packageConfig.fillInfoMethod,
            studentData: student2,
            selectDOBInDetails: createAppointmentData.packageConfig.selectDOBInDetails
        });
        await enrollmentPage.closeEnrollmentConfirmationPopup();
    });

    await test.step('Step 5: Navigate to Scheduling > Single Instructor and select schedule', async () => {
        await homePage.navigateToSingleInstructor();
        await instructorPage.selectInstructor();
        await instructorPage.getSchedule();
    });

    await test.step('Precondition / Setup: Create initial Combined Appointment', async () => {
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
    });

    await test.step('Step 6-8: Cancel appointment for Student 1 and verify cancellation', async () => {
        await instructorPage.editAppointment(student1);
        await combinedAppointmentPage.cancelAppointment(student1);
        await combinedAppointmentPage.verifyAppointmentIsCancelledSuccessfully();
    });

    await test.step('Step 9: Cancel appointment for Student 2 and verify cancellation', async () => {
        await instructorPage.editAppointment(student2);
        await combinedAppointmentPage.cancelAppointment(student2);
        await combinedAppointmentPage.verifyAppointmentIsCancelledSuccessfully();
    });
});

