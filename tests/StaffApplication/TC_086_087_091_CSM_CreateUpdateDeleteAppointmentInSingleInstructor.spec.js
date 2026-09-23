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
 * TC0086 / TC0087 / TC0091: CSM >> Calendar
 * Test Case Title: To Verify staff is able to Create, Update, and Delete appointment
 * Expected Result:
 *   1. Appointment should be created successfully and all the fields should have the value selected during creation
 *   2. Appointment should get updated successfully and all updated fields should match
 *   3. Appointment should be deleted successfully and removed from the scheduler
 **/
test("TC_086_087_091: CSM - To Verify staff is able to Create, Update, and Delete appointment", { tag: ['@CSM', '@CSMScheduling'] }, async ({ page }) => {
    test.setTimeout(600000);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentPage = new NewStudentEnrollmentPage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);
    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);

    /** @type {any} */
    let student1;
    /** @type {any} */
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

    await test.step('Step 6: Open Create Combined Appointment form', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType);
    });

    await test.step('Step 7: Select fields (Location, Vehicle, Students, Duration)', async () => {
        await combinedAppointmentPage.verifyPopup();
        await combinedAppointmentPage.selectMidTimeDropdown();
        await combinedAppointmentPage.selectEndTimeDropdown();
        await combinedAppointmentPage.selectDropdown("Location");
        await combinedAppointmentPage.selectDropdown("Vehicle");
        await combinedAppointmentPage.selectDropdown("Language");
        await combinedAppointmentPage.fillStudentDetails(1, student1);
        await combinedAppointmentPage.fillStudentDetails(2, student2);
        await combinedAppointmentPage.selectDuration();
    });

    await test.step('Step 8: Store values and submit appointment', async () => {
        await combinedAppointmentPage.storeAppointmentValues();
        await combinedAppointmentPage.submitAppointment();
    });

    await test.step('Step 9: Verify appointment is created successfully and values match runtime students', async () => {
        await schedulerPage.editAppointment(student1);
        await combinedAppointmentPage.verifyCombinedAppointmentCreatedValues(student1, student2);
    });

    const updatedStudent1 = {
        ...student1,
        pickup: "updated pickup location one",
        dropoff: "updated dropoff location one",
        notes: "updated note student1"
    };
    const updatedStudent2 = {
        ...student2,
        pickup: "updated pickup location two",
        dropoff: "updated dropoff location two",
        notes: "updated note student2"
    };

    await test.step('Step 10: Open created appointment via Edit Appointment', async () => {
        await schedulerPage.editAppointment(student1);
    });

    await test.step('Step 11: Update pickup location and notes for Student 1 and Student 2', async () => {
        await combinedAppointmentPage.updateStudentDetails(1, updatedStudent1);
        await combinedAppointmentPage.updateStudentDetails(2, updatedStudent2);
    });

    await test.step('Step 12: Submit updated appointment', async () => {
        await combinedAppointmentPage.updateAppointment();
    });

    await test.step('Step 13: Verify updated appointment values match in modal', async () => {
        await schedulerPage.editAppointment(student1);
        await combinedAppointmentPage.verifyCombinedAppointmentCreatedValues(updatedStudent1, updatedStudent2);
    });

    await test.step('Step 14: Delete appointment and verify removal from scheduler', async () => {
        await schedulerPage.deleteAppointment(student1);
    });
});
