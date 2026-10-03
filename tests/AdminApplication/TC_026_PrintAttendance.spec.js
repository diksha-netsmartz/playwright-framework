import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import ClassroomAttendancePage from '@pages/AdminApplication/Classroom/ClassroomAttendancePage';
import { credentials, currentEnv } from '@config/config';
import BasePage from '@utils/BasePage';

/**
 * TC_026: C-Admin > Classroom > Attendance > Take Attendance
 * Test Case Title: To verify Print Attendance
 * Precondition: User should have valid admin login credentials and at least one classroom created with attendance records
 * Expected Result:
 * - CR attendance report should be exported successfully in PDF format
 * - CR attendance report should be exported successfully in EXCEL format
 **/
test('TC_026: C-admin > Classroom > Attendance - To verify Print Attendance', { tag: ['@CAdmin', '@classroom'] }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const attendancePage = new ClassroomAttendancePage(page);
    const basePage = new BasePage(page);
    const crNames = {
        uat: '15dsss11',
        staging: 'CR26',
        coreServer1: 'dsstest',
        coreServer2: 'automationCR'
    };
    const crName = crNames[currentEnv];
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
        await attendancePage.selectSession(crName);
    });

    await test.step('Step 4 & 5: Export Attendance report to PDF and verify content in new tab', async () => {
        pdfPage = await attendancePage.exportToPdf();
        await attendancePage.verifyRosterPdfReport(pdfPage, 'Attendance Report');
    });

    await test.step('Step 6: Export Attendance report to Excel and verify downloaded file', async () => {
        await basePage.reload();
        await attendancePage.selectSession(crName);
        download = await attendancePage.exportToExcel();
        await attendancePage.verifyExcelReportDownloaded(download, 'Attendance Report');
    });
});

