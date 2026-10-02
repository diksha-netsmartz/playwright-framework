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
 * TC_108 / TC_109 / TC_113: C-Admin >> Single Location
 * Test Case Title: To Verify staff is able to Create, Edit, and Delete appointment
 * Expected Result:
 *   1. The appointment should be created successfully and values match runtime students.
 *   2. The appointment details should get updated and modified details should be displayed correctly.
 *   3. The appointment should be deleted successfully.
 **/
test("TC_108_109_113: C-Admin >> Single Location - To Verify staff is able to Create, Edit, and Delete appointment", { tag: ['@CAdmin', '@scheduling'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Single Location and select location', async () => {
        await homePage.navigateToSingleLocation();
        await schedulerPage.selectLocation();
        await schedulerPage.getSchedule();
    });

    await test.step('Step 3: Directly select calendar date and open Create Combined Appointment form', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType, student1);
    });

    await test.step('Step 4: Select fields (Location, Vehicle, Students, Duration)', async () => {
        await combinedAppointmentPage.verifyPopup();
        await combinedAppointmentPage.selectMidTimeDropdown();
        await combinedAppointmentPage.selectEndTimeDropdown();
        await combinedAppointmentPage.selectDropdown("InstID");
        await combinedAppointmentPage.selectDropdown("Vehicle");
        await combinedAppointmentPage.selectDropdown("Language");
        await combinedAppointmentPage.fillStudentDetails(1, student1);
        await combinedAppointmentPage.fillStudentDetails(2, student2);
        await combinedAppointmentPage.selectDuration();
    });

    await test.step('Step 5: Store values and submit appointment', async () => {
        await combinedAppointmentPage.storeAppointmentValues();
        await combinedAppointmentPage.submitAppointment();
    });

    await test.step('Step 6: Verify appointment is created successfully and values match runtime students', async () => {
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

    await test.step('Step 7: Select existing appointment and click Edit option', async () => {
        await schedulerPage.editAppointment(student1);
    });

    await test.step('Step 8: Update appointment details for Student 1 and Student 2', async () => {
        await combinedAppointmentPage.updateStudentDetails(1, updatedStudent1);
        await combinedAppointmentPage.updateStudentDetails(2, updatedStudent2);
    });

    await test.step('Step 9: Submit updated appointment', async () => {
        await combinedAppointmentPage.updateAppointment();
    });

    await test.step('Step 10: Verify modified details are displayed correctly under Single Location', async () => {
        await schedulerPage.editAppointment(student1);
        await combinedAppointmentPage.verifyCombinedAppointmentCreatedValues(updatedStudent1, updatedStudent2);
    });

    await test.step('Step 11: Select existing appointment, click Delete, and confirm deletion', async () => {
        await schedulerPage.deleteAppointment(student1);
    });
});

/**
 * TC_110: C-Admin >> Single Location
 * Test Case Title: To verify staff is able to cancel appointment
 * Expected Result: Appointment slot should become empty
 **/
test("TC_110: C-Admin >> Single Location - To verify staff is able to cancel appointment", { tag: ['@CAdmin', '@scheduling'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Single Location and select location', async () => {
        await homePage.navigateToSingleLocation();
        await schedulerPage.selectLocation();
        await schedulerPage.getSchedule();
    });

    await test.step('Step 3: Create initial Combined Appointment under Single Location', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType, student1);
        await combinedAppointmentPage.verifyPopup();
        await combinedAppointmentPage.selectMidTimeDropdown();
        await combinedAppointmentPage.selectEndTimeDropdown();
        await combinedAppointmentPage.selectDropdown("InstID");
        await combinedAppointmentPage.selectDropdown("Vehicle");
        await combinedAppointmentPage.selectDropdown("Language");
        await combinedAppointmentPage.fillStudentDetails(1, student1);
        await combinedAppointmentPage.fillStudentDetails(2, student2);
        await combinedAppointmentPage.selectDuration();
        await combinedAppointmentPage.storeAppointmentValues();
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
 * TC_111: C-Admin >> Single Location
 * Test Case Title: To Verify staff is able to No show appointment
 * Expected Result: Appointment slot should become empty
 **/
test("TC_111: C-Admin >> Single Location - To Verify staff is able to No show appointment", { tag: ['@CAdmin', '@scheduling'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Single Location and select location', async () => {
        await homePage.navigateToSingleLocation();
        await schedulerPage.selectLocation();
        await schedulerPage.getSchedule();
    });

    await test.step('Step 3: Create initial Combined Appointment under Single Location', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType, student1);
        await combinedAppointmentPage.verifyPopup();
        await combinedAppointmentPage.selectMidTimeDropdown();
        await combinedAppointmentPage.selectEndTimeDropdown();
        await combinedAppointmentPage.selectDropdown("InstID");
        await combinedAppointmentPage.selectDropdown("Vehicle");
        await combinedAppointmentPage.selectDropdown("Language");
        await combinedAppointmentPage.fillStudentDetails(1, student1);
        await combinedAppointmentPage.fillStudentDetails(2, student2);
        await combinedAppointmentPage.selectDuration();
        await combinedAppointmentPage.storeAppointmentValues();
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

/**
 * TC_112: C-Admin >> Single Location
 * Test Case Title: To Verify staff is able to copy/paste appointment
 * Expected Result: Appointment should get copied successfully and all the data should match the copied appointment
 **/
test("TC_112: C-Admin >> Single Location - To Verify staff is able to copy/paste appointment", { tag: ['@CAdmin', '@scheduling'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const schedulerPage = new SchedulerPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Single Location and select location', async () => {
        await homePage.navigateToSingleLocation();
        await schedulerPage.selectLocation();
        await schedulerPage.getSchedule();
    });

    await test.step('Step 3: Create initial Combined Appointment under Single Location', async () => {
        await schedulerPage.selectCreateAppointment(createAppointmentData.appointmentDetails.appointmentType, student1);
        await combinedAppointmentPage.verifyPopup();
        await combinedAppointmentPage.selectMidTimeDropdown();
        await combinedAppointmentPage.selectEndTimeDropdown();
        await combinedAppointmentPage.selectDropdown("InstID");
        await combinedAppointmentPage.selectDropdown("Vehicle");
        await combinedAppointmentPage.selectDropdown("Language");
        await combinedAppointmentPage.fillStudentDetails(1, student1);
        await combinedAppointmentPage.fillStudentDetails(2, student2);
        await combinedAppointmentPage.selectDuration();
        await combinedAppointmentPage.storeAppointmentValues();
        await combinedAppointmentPage.submitAppointment();
    });

    await test.step('Step 4: Copy selected appointment and paste into available slot', async () => {
        await schedulerPage.copyAppointment(student1);
    });

    await test.step('Step 5: Verify appointment is duplicated in scheduler', async () => {
        await schedulerPage.verifyAppointmentIsCopied(student1);
        await schedulerPage.verifyAppointmentIsCopied(student2);
    });

    await test.step('Step 6: Verify copied appointment data matches original', async () => {
        await schedulerPage.editAndVerifyDetailsForAllAppointments(student1, student2);
    });
});
