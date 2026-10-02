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

/** @type {any} */
let student1;
/** @type {any} */
let student2;

test.beforeAll(async ({ browser }, testInfo) => {

    testInfo.setTimeout(300000);
    const context = await browser.newContext();
    const page = await context.newPage();
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentPage = new NewStudentEnrollmentPage(page);

    await test.step('Setup: Login to C-admin to enroll shared students', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Setup: Generate dynamic student 1 & student 2 details', async () => {
        student1 = TestDataGenerator.generateStudentData(createAppointmentData.student1);
        student2 = TestDataGenerator.generateStudentData(createAppointmentData.student2);
        console.log("Enrolled shared Student 1:", student1.name);
        console.log("Enrolled shared Student 2:", student2.name);
    });

    await test.step('Setup: Enroll Student 1', async () => {
        await homePage.navigateToNewStudentEnrollment();
        await enrollmentPage.enrollNewStudent({
            packageName: createAppointmentData.packageConfig.packageName,
            fillInfoMethod: createAppointmentData.packageConfig.fillInfoMethod,
            studentData: student1
        });
        await enrollmentPage.closeEnrollmentConfirmationPopup();
    });

    await test.step('Setup: Enroll Student 2', async () => {
        await homePage.navigateToNewStudentEnrollment();
        await enrollmentPage.enrollNewStudent({
            packageName: createAppointmentData.packageConfig.packageName,
            fillInfoMethod: createAppointmentData.packageConfig.fillInfoMethod,
            studentData: student2
        });
        await enrollmentPage.closeEnrollmentConfirmationPopup();
    });

    await context.close();
});

/**
 * TC_086 / TC_087 / TC_091: CSM >> Calendar
 * Test Case Title: To Verify staff is able to Create, Update, and Delete appointment
 * Expected Result:
 *   1. Appointment should be created successfully and all the fields should have the value selected during creation
 *   2. Appointment should get updated successfully and all updated fields should match
 *   3. Appointment should be deleted successfully and removed from the scheduler
 **/
test("TC_086_087_091: CSM - To Verify staff is able to Create, Update, and Delete appointment", { tag: ['@CSM', '@CSMScheduling'] }, async ({ page }) => {
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);
    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);

    await test.step('Step 1: Login to staff portal (CSM) and navigate to Calendar View', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
        await staffHomePage.navigateToCalendarView();
    });

    await test.step('Step 2: Open Create Combined Appointment form', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType, student1);
    });

    await test.step('Step 3: Select fields (Location, Vehicle, Students, Duration)', async () => {
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

    await test.step('Step 4: Store values and submit appointment', async () => {
        await combinedAppointmentPage.storeAppointmentValues();
        await combinedAppointmentPage.submitAppointment();
    });

    await test.step('Step 5: Verify appointment is created successfully and values match runtime students', async () => {
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

    await test.step('Step 6: Open created appointment via Edit Appointment', async () => {
        await schedulerPage.editAppointment(student1);
    });

    await test.step('Step 7: Update pickup location and notes for Student 1 and Student 2', async () => {
        await combinedAppointmentPage.updateStudentDetails(1, updatedStudent1);
        await combinedAppointmentPage.updateStudentDetails(2, updatedStudent2);
    });

    await test.step('Step 8: Submit updated appointment', async () => {
        await combinedAppointmentPage.updateAppointment();
    });

    await test.step('Step 9: Verify updated appointment values match in modal', async () => {
        await schedulerPage.editAppointment(student1);
        await combinedAppointmentPage.verifyCombinedAppointmentCreatedValues(updatedStudent1, updatedStudent2);
    });

    await test.step('Step 10: Delete appointment and verify removal from scheduler', async () => {
        await schedulerPage.deleteAppointment(student1);
    });
});

/**
 * TC_088: CSM >> Calendar
 * Test Case Title: To Verify staff is able to copy / paste appointment
 * Precondition: Staff user is able to create appointment
 * Expected Result: Appointment should get copied successfully and all the data should match the copied appointment
 **/
test("TC_088: CSM - To Verify staff is able to copy / paste appointment", { tag: ['@CSM', '@CSMScheduling'] }, async ({ page }) => {
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);
    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);

    await test.step('Step 1: Login to staff portal (CSM) and navigate to Calendar View', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
        await staffHomePage.navigateToCalendarView();
    });

    await test.step('Step 2: Create initial Combined Appointment with sufficient free slots for copy', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType, student1);
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

    await test.step('Step 3: Copy created appointment', async () => {
        await schedulerPage.copyAppointment(student1);
    });

    await test.step('Step 4: Paste last copied appointment', async () => {
        await schedulerPage.verifyAppointmentIsCopied(student1);
        await schedulerPage.verifyAppointmentIsCopied(student2);
    });

    await test.step('Step 5: Verify copied appointment data matches original', async () => {
        await schedulerPage.editAndVerifyDetailsForAllAppointments(student1, student2);
    });
});

/**
 * TC_089: CSM >> Calendar
 * Test Case Title: To Verify staff is able to cancel appointment
 * Expected Result: Appointment should be cancelled successfully for both students and marked as cancelled
 **/
test("TC_089: CSM - To Verify staff is able to cancel appointment", { tag: ['@CSM', '@CSMScheduling'] }, async ({ page }) => {
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);
    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);

    await test.step('Step 1: Login to staff portal (CSM) and navigate to Calendar View', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
        await staffHomePage.navigateToCalendarView();
    });

    await test.step('Step 2: Create initial Combined Appointment', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType, student1);
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

    await test.step('Step 3: Cancel appointment for Student 1 and verify cancellation', async () => {
        await schedulerPage.editAppointment(student1);
        await combinedAppointmentPage.cancelAppointment(student1);
    });

    await test.step('Step 4: Cancel appointment for Student 2 and verify cancellation', async () => {
        await schedulerPage.editAppointment(student2);
        await combinedAppointmentPage.cancelAppointment(student2);
    });
});

/**
 * TC_090: CSM >> Calendar
 * Test Case Title: To Verify staff is able to No show appointment
 * Expected Result: Appointment should be marked as No Show successfully for both students
 **/
test("TC_090: CSM - To Verify staff is able to No show appointment", { tag: ['@CSM', '@CSMScheduling'] }, async ({ page }) => {
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);
    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);

    await test.step('Step 1: Login to staff portal (CSM) and navigate to Calendar View', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
        await staffHomePage.navigateToCalendarView();
    });

    await test.step('Step 2: Create initial Combined Appointment', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType, student1);
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

    await test.step('Step 3: Mark appointment as No Show for Student 1 and verify', async () => {
        await schedulerPage.editNoShowAppointment(student1);
        await combinedAppointmentPage.markAppointmentAsNoShow(student1);
    });

    await test.step('Step 4: Mark appointment as No Show for Student 2 and verify', async () => {
        await schedulerPage.editNoShowAppointment(student2);
        await combinedAppointmentPage.markAppointmentAsNoShow(student2);
    });
});
