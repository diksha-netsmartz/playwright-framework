import {test} from '@playwright/test';

import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import BulkAppointmentPage from '../../pages/AdminApplication/Scheduling/ManageTimeSlots/BulkAppointmentPage';
import login from '../../test-data/json/login.json';

/**
 * TC_009: C-Admin > Scheduling > Manage Appointment Slot > Appointment Bulk Edit
 * Test Case Title: Verify user is able to Edit, Delete, Cancel and Shift Appointment.
 * Precondition: Appointments should be created first with confirm status
 * Expected Result: User should be able to Edit, Delete, Cancel and shift Appointment
 **/
test('TC_009: C-admin > Scheduling > Manage Appointment Slot > Appointment Bulk Edit - Verify user is able to Edit, Delete, Cancel and Shift Appointment', { tag: '@smoke' }, async ({page}) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const bulkAppointmentPage = new BulkAppointmentPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling -> Manage Time Slots -> Bulk Appointment', async () => {
        await homePage.navigateToBulkAppointment();
    });

    await test.step('Step 3: Apply filter to view appointments', async () => {
        await bulkAppointmentPage.applyFilter();
    });

    await test.step('Step 4: Select Appointment and Shift Appointment', async () => {
        await bulkAppointmentPage.shiftAppointment();
    });

    await test.step('Step 5: Select Appointment, edit notes, and update', async () => {
        await bulkAppointmentPage.editAppointment();
    });

    await test.step('Step 6: Select Appointment, delete and confirm', async () => {
        await bulkAppointmentPage.deleteAppointment();
    });

    await test.step('Step 7: Filter by Confirmed status and cancel appointment', async () => {
        await bulkAppointmentPage.filterByStatus("Confirmed");
        await bulkAppointmentPage.cancelAppointment();
    });
});

