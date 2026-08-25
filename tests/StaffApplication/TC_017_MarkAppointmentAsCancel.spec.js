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

    await test.step('Step 1: Login to CSM portal with valid staff credentials', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(login.staffUser.username, login.staffUser.password);
    });

    await test.step('Step 2: Navigate to "Needs Attention" widget, cancel appointment and confirm', async () => {
        await staffHomePage.markAppointmentAsCancel();
    });
});

