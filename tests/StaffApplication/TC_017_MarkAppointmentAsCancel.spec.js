import { test } from '@playwright/test';
import StaffLoginPage from '../../pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '../../pages/StaffApplication/StaffHomePage';
import login from '../../test-data/login.json';

/**
 * TC_017: Centralize Staff Mobile (CSM)
 * Test Case Title: Verify lesson cancellation functionality
 * Precondition: There should be a Past Appointment or should be created using TC-001 with staff - test, instructor6
 * Expected Result: Appointment Cancelled successfully message should display
 **/
test('TC_017: CSM - Verify lesson cancellation functionality', async ({ page }) => {

    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);

    // Step 1: Login to the CSM portal as staff instructor
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(login.staffUser.username, login.staffUser.password);

    // Step 2: Navigate to "Needs Attention" widget, click Cancel, enter cancellation text and confirm
    await staffHomePage.markAppointmentAsCancel();
});
