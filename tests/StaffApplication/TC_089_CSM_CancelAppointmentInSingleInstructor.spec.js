import { test } from "@playwright/test";
import LoginPage from "@pages/AdminApplication/AdminLoginPage";
import HomePage from "@pages/AdminApplication/AdminPortalHomePage";
import NewStudentEnrollmentPage from "@pages/AdminApplication/NewStudentEnrollment/NewStudentEnrollmentPage";
import SchedulerPage from "@pages/Common/Scheduling/SchedulerPage";
import CombinedAppointmentPage from "@pages/Common/Scheduling/CombinedAppointmentPage";
import StaffLoginPage from "@pages/StaffApplication/StaffLoginPage";
import StaffHomePage from "@pages/StaffApplication/StaffHomePage";
import TestDataGenerator from "@utils/TestDataGenerator";
import createAppointmentData from "@test-data/json/createAppointmentData.json";
import { credentials } from '@config/config';

/**
 * TC0089: CSM >> Calender
 * Test Case Title: To Verfiy staff is able to cancel appointment
 * Expected Result: Appointment should be cancelled successfully for both students and marked as cancelled
 **/
test("TC_089: CSM - To Verify staff is able to cancel appointment", { tag: ['@CSM', '@CSMScheduling'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentPage = new NewStudentEnrollmentPage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);
    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);

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

    await test.step('Step 5: Login to staff portal (CSM) and navigate to Calendar View', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
        await staffHomePage.navigateToCalendarView();
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
        await combinedAppointmentPage.submitAppointment();
    });

    await test.step('Step 6-8: Cancel appointment for Student 1 and verify cancellation', async () => {
        await schedulerPage.editAppointment(student1);
        await combinedAppointmentPage.cancelAppointment(student1);
    });

    await test.step('Step 9: Cancel appointment for Student 2 and verify cancellation', async () => {
        await schedulerPage.editAppointment(student2);
        await combinedAppointmentPage.cancelAppointment(student2);
    });
});
