import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import ClassroomAttendancePage from '../../pages/AdminApplication/Classroom/ClassroomAttendancePage';
import login from '../../test-data/json/login.json';

/**
 * TC_027: C-Admin > Classroom > Attendance > Take Attendance
 * Test Case Title: To verify Print Roster
 * Precondition: User should have valid admin login credentials and at least one classroom created with attendance records
 * Expected Result:
 * - CR attendance Roster report should be exported successfully in PDF format
 * - CR attendance Roster report should be exported successfully in EXCEL format
 **/
test('TC_027: C-admin > Classroom > Attendance - To verify Print Roster', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const attendancePage = new ClassroomAttendancePage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];
    let pdfPage;
    let download;

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

    await test.step('Step 4 & 5: Export Roster report to PDF and verify content in new tab', async () => {
        pdfPage = await attendancePage.exportRosterToPdf();
        await attendancePage.verifyPdfReport(pdfPage, 'Roster Report');
    });

    await test.step('Step 6: Export Roster report to Excel and verify downloaded file', async () => {
        download = await attendancePage.exportRosterToExcel();
        await attendancePage.verifyExcelReportDownloaded(download, 'Roster Report');
    });
});

