import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import NewStudentEnrollmentPage from '../../pages/AdminApplication/NewStudentEnrollmentPage';
import HomePage from "../../pages/AdminApplication/AdminPortalHomePage";
import login from "../../test-data/json/login.json";
import studentData from "../../test-data/json/studentData.json";


// Define the packages, their student information type, and specific requirements
const packageScenarios = [
    {
        packageName: 'BTW and CR Package',
        selectDOBInDetails: false,
        fillInfoMethod: 'fillTeenStudentInformation',
    },
    {
        packageName: 'CR Package',
        selectDOBInDetails: false,
        fillInfoMethod: 'fillRoadTestStudentInformation',
    },
    {
        packageName: 'RT Package',
        selectDOBInDetails: true,
        fillInfoMethod: 'fillAdultStudentInformation',
    },
    {
        packageName: 'BTW Package',
        selectDOBInDetails: true,
        fillInfoMethod: 'fillKnowledgeTestStudentInformation',
    },
];

for (const { packageName, selectDOBInDetails, fillInfoMethod } of packageScenarios) {
    /**
     * TC_006: C-admin > New student enrollment
     * Test Case Title: Verify new student getting created and Packages are Enrolled.
     * Expected Result: New student should get created Enrollements should be done
     **/
    test(`TC_006: C-admin > New student enrollment - Verify new student getting created and Packages are Enrolled (${packageName})`, { tag: '@smoke' }, async ({ page }) => {
        const loginPage = new LoginPage(page);
        const enrollmentPage = new NewStudentEnrollmentPage(page);
        const homePage = new HomePage(page);

        const credentials = login[process.env.ENV || 'coreServer2'];

        await test.step('Step 1: Login to C-admin with valid credentials', async () => {
            await loginPage.navigateToLoginPage();
            await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
        });

        await test.step('Step 2: Click on New student enrollment in Left Navigation', async () => {
            await homePage.navigateToNewStudentEnrollment();
        });

        await test.step(`Step 3: Select Package: "${packageName}" and add it`, async () => {
            await enrollmentPage.addPackage(packageName);
        });

        await test.step('Step 4: Select student information Type and fill student details', async () => {
            await enrollmentPage[fillInfoMethod](studentData.student1);
            if (selectDOBInDetails) {
                await enrollmentPage.selectDOBInStudentDetails();
            }
        });

        await test.step('Step 5: Click on Save button and verify student enrollment', async () => {
            await enrollmentPage.save();
        });
    });
}

