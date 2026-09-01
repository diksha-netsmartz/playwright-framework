import {test} from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import ClassroomAttendancePage from '../../pages/AdminApplication/Classroom/ClassroomAttendancePage';
import login from '../../test-data/json/login.json';

/**
 * TC_028: C-Admin > Classroom > Attendance > Take Attendance
 * Test Case Title: To verify send Session Email
 * Precondition: User should have valid admin login credentials and at least one classroom session with student records
 * Expected Result: CR SESSION mail should be sent successfully
 **/
test('TC_028: C-admin > Classroom > Attendance - To verify send Session Email', async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const attendancePage = new ClassroomAttendancePage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Classroom >> Attendance tab', async () => {
        await homePage.navigateToAttendance();
    });

    await test.step('Step 3: Select a Classroom session with student records', async () => {
        await attendancePage.selectSession();
    });

    await test.step('Step 4: Click on SEND SESSION EMAIL button', async () => {
        await attendancePage.clickSendSessionEmail();
    });

    await test.step('Step 5 & 6: In Popup, select Student Emails and click COMPOSE EMAIL', async () => {
        await attendancePage.selectStudentsAndComposeEmail();
    });

    await test.step('Step 7 & 8: Fill required fields in Send Email popup and click SEND', async () => {
        await attendancePage.fillAndSendEmail('CR Session Notification', 'This is an automated CR Session notification email.');
    });

    await test.step('Verify send email API response is successful', async () => {
        await attendancePage.verifySendEmailResponse();
    });

    await test.step('Verify CR Session email is sent successfully', async () => {
        await attendancePage.verifyEmailSentSuccessfully();
    });
});

