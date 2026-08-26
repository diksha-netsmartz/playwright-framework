import { test } from '@playwright/test';
import StaffLoginPage from '../../pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '../../pages/StaffApplication/StaffHomePage';
import login from '../../test-data/json/login.json';

/**
 * TC_018: Centralize Staff Mobile (CSM)
 * Test Case Title: Verify no show functionality
 * Precondition: There should be a Past Appointment or should be created using TC-001 with staff - test, instructor6
 * Expected Result: Appointment Marked No show successfully message should display
 **/
test('TC_018: CSM - Verify no show functionality', { tag: '@smoke' }, async ({ page }) => {

    const staffLoginPage = new StaffLoginPage(page);
    const staffHomePage = new StaffHomePage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to CSM portal with valid staff credentials', async () => {
        await staffLoginPage.navigateToLoginPage();
        await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
    });

    await test.step('Step 2: Navigate to "Needs Attention" widget, mark appointment as No Show and confirm', async () => {
        await staffHomePage.markAppointmentAsNoShow();
    });
});

