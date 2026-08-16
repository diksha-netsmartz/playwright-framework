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
    test(`Create student with ${packageName}`, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const enrollmentPage = new NewStudentEnrollmentPage(page);
        const homePage = new HomePage(page);

        // Login
        await loginPage.navigateToLoginPage();
        await loginPage.login(
            login.validUser.username,
            login.validUser.password
        );

        // Navigate & Add Package
        await homePage.navigateToNewStudentEnrollment();
        await enrollmentPage.addPackage(packageName);

        // Fill Student Details
        await enrollmentPage.fillStudentInformation(studentData.student1);
        if (selectDOBInDetails) {
            await enrollmentPage.selectDOBInStudentDetails();
        }

        // Save
        await enrollmentPage.save();
    });
}
