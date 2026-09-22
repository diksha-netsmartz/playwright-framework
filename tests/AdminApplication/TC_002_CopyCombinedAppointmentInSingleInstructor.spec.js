import { test } from "@playwright/test";
import LoginPage from "@pages/AdminApplication/AdminLoginPage";
import HomePage from "@pages/AdminApplication/AdminPortalHomePage";
import NewStudentEnrollmentPage from "@pages/AdminApplication/NewStudentEnrollment/NewStudentEnrollmentPage";
import SchedulerPage from "@pages/Common/Scheduling/SchedulerPage";
import CombinedAppointmentPage from "@pages/Common/Scheduling/CombinedAppointmentPage";
import TestDataGenerator from "@utils/TestDataGenerator";
import createAppointmentData from "@test-data/json/createAppointmentData.json";
import { credentials } from '@config/config';

/**
 * TC_002: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting copied
 * Precondition: TC_001 should be successfully executed
 * Expected Result: Appointment should get copied successfully and all the data should match the copied appointment
 **/
test("TC_002: C-admin > Scheduling - Verify that the appt is getting copied", { tag: ['@CAdmin', '@scheduling', '@smoke'] }, async ({ page }) => {
    test.setTimeout(600000);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentPage = new NewStudentEnrollmentPage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

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
            studentData: student1
        });
        await enrollmentPage.closeEnrollmentConfirmationPopup();
    });

    await test.step('Step 4: Create / Enroll Student 2', async () => {
        await homePage.navigateToNewStudentEnrollment();
        await enrollmentPage.enrollNewStudent({
            packageName: createAppointmentData.packageConfig.packageName,
            fillInfoMethod: createAppointmentData.packageConfig.fillInfoMethod,
            studentData: student2
        });
        await enrollmentPage.closeEnrollmentConfirmationPopup();
    });

    await test.step('Step 5: Navigate to Scheduling > Single Instructor and select schedule', async () => {
        await homePage.navigateToSingleInstructor();
        await schedulerPage.selectInstructor(credentials.staffUser.username);
        await schedulerPage.getSchedule();
    });

    await test.step('Precondition / Setup: Create initial Combined Appointment', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType);
        await combinedAppointmentPage.verifyPopup();
        await combinedAppointmentPage.selectMidTimeDropdown();
        await combinedAppointmentPage.selectEndTimeDropdown();
        await combinedAppointmentPage.selectDropdown("Location");
        await combinedAppointmentPage.selectDropdown("Vehicle");
        await combinedAppointmentPage.selectDropdown("Language");
        await combinedAppointmentPage.fillStudentDetails(1, student1);
        await combinedAppointmentPage.fillStudentDetails(2, student2);
        await combinedAppointmentPage.selectDuration();
        await combinedAppointmentPage.storeAppointmentValues();
        await combinedAppointmentPage.submitAppointment();
    });

    await test.step('Step 6: Copy created appointment', async () => {
        await schedulerPage.copyAppointment(student1);
    });

    await test.step('Step 7: Paste last copied appointment', async () => {
        await schedulerPage.verifyAppointmentIsCopied(student1);
        await schedulerPage.verifyAppointmentIsCopied(student2);
    });

    await test.step('Step 8: Verify copied appointment data matches original', async () => {
        await schedulerPage.editAndVerifyDetailsForAllAppointments(student1, student2);
    });
});

