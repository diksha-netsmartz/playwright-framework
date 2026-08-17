import {test} from '@playwright/test';

import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import BulkAppointmentPage from '../../pages/AdminApplication/Scheduling/BulkAppointmentPage';
import login from '../../test-data/login.json';

/**
 * TC_009: C-Admin > Scheduling > Manage Appointment Slot > Appointment Bulk Edit
 * Test Case Title: Verify user is able to Edit, Delete, Cancel and Shift Appointment.
 * Precondition: Appointments should be created first with confirm status
 * Expected Result: User should be able to Edit, Delete, Cancel and shift Appointment
 **/
test('TC_009: C-admin > Scheduling > Manage Appointment Slot > Appointment Bulk Edit - Verify user is able to Edit, Delete, Cancel and Shift Appointment', async ({page}) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const bulkAppointmentPage = new BulkAppointmentPage(page);

    // Step 1: Login to C-admin
    await loginPage.navigateToLoginPage();
    await loginPage.login(login.validUser.username, login.validUser.password);

    // Step 2: Click on Scheduling on left Navigation -> Manage Time Slots -> Bulk Appointment
    await homePage.navigateToBulkAppointment();

    // Step 3: Click on Filter button
    await bulkAppointmentPage.applyFilter();

    // Step 4: Select Appointment and Shift Appointment (by date, check availability and update)
    await bulkAppointmentPage.shiftAppointment();

    // Step 5: Select Appointment, click Edit Appointment, add notes and update
    await bulkAppointmentPage.editAppointment();

    // Step 6: Select Appointment, click Delete Appointments and confirm Yes
    await bulkAppointmentPage.deleteAppointment();

    // Step 7: Select Appointment with Confirm Status, click Cancel Appointments and confirm Yes
    await bulkAppointmentPage.filterByStatus("Confirmed");
    await bulkAppointmentPage.cancelAppointment();
});
