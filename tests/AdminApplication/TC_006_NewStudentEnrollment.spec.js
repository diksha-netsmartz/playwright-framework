import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import NewStudentEnrollmentPage from '../../pages/AdminApplication/NewStudentEnrollmentPage';
import HomePage from "../../pages/AdminApplication/AdminPortalHomePage";
import login from "../../test-data/login.json";
import studentData from "../../test-data/studentData.json";

// Define the packages and their specific requirements
const packageScenarios = [
    { packageName: 'BTW and CR Package', selectDOBInDetails: false },
    { packageName: 'CR Package', selectDOBInDetails: false },
    { packageName: 'RT Package', selectDOBInDetails: true },
    { packageName: 'BTW Package', selectDOBInDetails: true },
];

for (const { packageName, selectDOBInDetails } of packageScenarios) {
    /**
     * TC_006: C-admin > New student enrollment
     * Test Case Title: Verify new student getting created and Packages are Enrolled.
     * Expected Result: New student should get created Enrollements should be done
     **/
    test(`TC_006: C-admin > New student enrollment - Verify new student getting created and Packages are Enrolled (${packageName})`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const enrollmentPage = new NewStudentEnrollmentPage(page);
        const homePage = new HomePage(page);

        // Step 1: Login to C-admin
        await loginPage.navigateToLoginPage();
        await loginPage.login(
            login.validUser.username,
            login.validUser.password
        );

        // Step 2: Click on New student enrollment in Left Navigation
        await homePage.navigateToNewStudentEnrollment();

        // Step 3: Select Package in package selection dropdown and add it
        await enrollmentPage.addPackage(packageName);

        // Step 4: Select student information Type and fill student details
        await enrollmentPage.fillStudentInformation(studentData.student1);
        if (selectDOBInDetails) {
            await enrollmentPage.selectDOBInStudentDetails();
        }

        // Step 5: Click on Save button and verify student enrollment
        await enrollmentPage.save();
    });
}
