import { test } from "@playwright/test";
import LoginPage from "@pages/AdminApplication/AdminLoginPage";
import HomePage from "@pages/AdminApplication/AdminPortalHomePage";
import NewStudentEnrollmentPage from "@pages/AdminApplication/NewStudentEnrollment/NewStudentEnrollmentPage";
import SchedulerPage from "@pages/Common/Scheduling/SchedulerPage";
import CombinedAppointmentPage from "@pages/Common/Scheduling/CombinedAppointmentPage";
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
 * TC_001: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting created
 * Expected Result: Appointment should be created successfully and all the fields should have the value selected during creation
 **/
test("TC_001: C-admin > Scheduling - Verify that the appt is getting created", { tag: ['@CAdmin', '@scheduling', '@smoke'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Single Instructor', async () => {
        await homePage.navigateToSingleInstructor();
    });

    await test.step('Step 3: Select instructor and click Get Schedule', async () => {
        await schedulerPage.selectInstructor(credentials.staffUser.username);
        await schedulerPage.getSchedule();
    });

    await test.step('Step 4: Open Create Combined Appointment form', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType, student1);
    });

    await test.step('Step 5: Select fields (Location, Vehicle, Students, Duration)', async () => {
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

    await test.step('Step 6: Store values and submit appointment', async () => {
        await combinedAppointmentPage.storeAppointmentValues();
        await combinedAppointmentPage.submitAppointment();
    });

    await test.step('Step 7: Verify appointment is created successfully and values match runtime students', async () => {
        await schedulerPage.editAppointment(student1);
        await combinedAppointmentPage.verifyCombinedAppointmentCreatedValues(student1, student2);
    });
});

/**
 * TC_002: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting copied
 * Precondition: TC_001 should be successfully executed
 * Expected Result: Appointment should get copied successfully and all the data should match the copied appointment
 **/
test("TC_002: C-admin > Scheduling - Verify that the appt is getting copied", { tag: ['@CAdmin', '@scheduling', '@smoke'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Single Instructor and select schedule', async () => {
        await homePage.navigateToSingleInstructor();
        await schedulerPage.selectInstructor(credentials.staffUser.username);
        await schedulerPage.getSchedule();
    });

    await test.step('Step 3: Create initial Combined Appointment', async () => {
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

    await test.step('Step 4: Copy created appointment', async () => {
        await schedulerPage.copyAppointment(student1);
    });

    await test.step('Step 5: Paste last copied appointment', async () => {
        await schedulerPage.verifyAppointmentIsCopied(student1);
        await schedulerPage.verifyAppointmentIsCopied(student2);
    });

    await test.step('Step 6: Verify copied appointment data matches original', async () => {
        await schedulerPage.editAndVerifyDetailsForAllAppointments(student1, student2);
    });
});

/**
 * TC_003: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting deleted
 * Precondition: TC_001 should be executed
 * Expected Result: Appointment should get deleted successfully and removed from the graphical scheduler
 **/
test("TC_003: C-admin > Scheduling - Verify that the appt is getting deleted", { tag: ['@CAdmin', '@scheduling', '@smoke'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Single Instructor', async () => {
        await homePage.navigateToSingleInstructor();
    });

    await test.step('Step 3: Select instructor and click Get Schedule', async () => {
        await schedulerPage.selectInstructor(credentials.staffUser.username);
        await schedulerPage.getSchedule();
    });

    await test.step('Step 4: Open Create Combined Appointment form', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType, student1);
    });

    await test.step('Step 5: Select fields (Location, Vehicle, Students, Duration)', async () => {
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

    await test.step('Step 6: Submit appointment', async () => {
        await combinedAppointmentPage.submitAppointment();
    });

    await test.step('Step 7: Delete appointment and verify removal from scheduler', async () => {
        await schedulerPage.deleteAppointment(student1);
    });
});

/**
 * TC_004: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting cancelled
 * Precondition: Create new appt using TC_001 (Appointment should be created for past date to verify this test case)
 * Expected Result: Appointment slot should become empty
 **/
test("TC_004: C-admin > Scheduling - Verify that the appt is getting cancelled", { tag: ['@CAdmin', '@scheduling', '@smoke'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Single Instructor and select schedule', async () => {
        await homePage.navigateToSingleInstructor();
        await schedulerPage.selectInstructor(credentials.staffUser.username);
        await schedulerPage.getSchedule();
    });

    await test.step('Step 3: Create initial Combined Appointment', async () => {
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

    await test.step('Step 4: Cancel appointment for Student 1 and verify cancellation', async () => {
        await schedulerPage.editAppointment(student1);
        await combinedAppointmentPage.cancelAppointment(student1);
    });

    await test.step('Step 5: Cancel appointment for Student 2 and verify cancellation', async () => {
        await schedulerPage.editAppointment(student2);
        await combinedAppointmentPage.cancelAppointment(student2);
    });
});

/**
 * TC_005: C-admin > Scheduling
 * Test Case Title: Verify that the appt is getting marked as no show
 * Precondition: TC_004 should be executed
 * Expected Result: Appointment slot should become empty
 **/
test("TC_005: C-admin > Scheduling - Verify that the appt is getting marked as no show", { tag: ['@CAdmin', '@scheduling', '@smoke'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Single Instructor and select schedule', async () => {
        await homePage.navigateToSingleInstructor();
        await schedulerPage.selectInstructor(credentials.staffUser.username);
        await schedulerPage.getSchedule();
    });

    await test.step('Step 3: Create initial Combined Appointment', async () => {
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

    await test.step('Step 4: Mark appointment as No Show for Student 1 and verify', async () => {
        await schedulerPage.editNoShowAppointment(student1);
        await combinedAppointmentPage.markAppointmentAsNoShow(student1);
    });

    await test.step('Step 5: Mark appointment as No Show for Student 2 and verify', async () => {
        await schedulerPage.editNoShowAppointment(student2);
        await combinedAppointmentPage.markAppointmentAsNoShow(student2);
    });
});
