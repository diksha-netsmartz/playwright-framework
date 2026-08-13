import {test} from '@playwright/test';

import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import BulkAppointmentPage from '../../pages/AdminApplication/Scheduling/BulkAppointmentPage';
import login from '../../test-data/login.json';

test('Bulk Appointment - Edit, Delete, Shift and Cancel Confirmed Appointment', async ({page}) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const bulkAppointmentPage = new BulkAppointmentPage(page);

    await loginPage.navigateToLoginPage();
    await loginPage.login(login.validUser.username, login.validUser.password);

    await homePage.navigateToBulkAppointment();

    await bulkAppointmentPage.applyFilter();
    await bulkAppointmentPage.shiftAppointment();
    await bulkAppointmentPage.editAppointment();
    await bulkAppointmentPage.deleteAppointment();
    await bulkAppointmentPage.filterByStatus("Confirmed");
    await bulkAppointmentPage.cancelAppointment();

});
