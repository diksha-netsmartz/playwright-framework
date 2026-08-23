import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import NewStudentEnrollmentPage from '../../pages/AdminApplication/NewStudentEnrollmentPage';
import SingleInstructorPage from '../../pages/AdminApplication/Scheduling/SingleInstructor/SingleInstructorPage';
import CombinedAppointmentPage from '../../pages/AdminApplication/Scheduling/SingleInstructor/CombinedAppointmentPage';
import StaffLoginPage from '../../pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '../../pages/StaffApplication/StaffHomePage';
import TestDataGenerator from '../../utils/TestDataGenerator';
import createAppointmentData from '../../test-data/createAppointmentData.json';
import login from '../../test-data/login.json';

/**
 * TC_017: Centralize Staff Mobile (CSM)
 * Test Case Title: Verify lesson cancellation functionality
 * Precondition: There should be a Past Appointment or should be created using TC-001 with staff - test, instructor6
 * Expected Result: Appointment Cancelled successfully message should display
 **/
test('TC_017: CSM - Verify lesson cancellation functionality', async ({ page }) => {
    // test.setTimeout(480000);
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentPage = new NewStudentEnrollmentPage(page);
    const instructorPage = new SingleInstructorPage(page);
    const combinedAppointmentPage = new CombinedAppointmentPage(page);
    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);

    // Precondition / Setup: Create initial Combined Appointment on a past date (under TC_001)
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

    // Step 6: Create Combined Appointment on past date
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

    // Step 7: Login to the CSM portal as staff instructor
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(login.staffUser.username, login.staffUser.password);

    // Step 8: Navigate to "Needs Attention" widget, click Cancel, enter cancellation text and confirm
    await staffHomePage.markAppointmentAsCancel();
});
