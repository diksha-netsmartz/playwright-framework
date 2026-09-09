import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import OpenTimeSlotsPage from '../../pages/AdminApplication/Scheduling/ManageTimeSlots/OpenTimeSlotsPage';
import login from '../../test-data/json/login.json';
import openTimeSlotsData from '../../test-data/json/openTimeSlotsData.json';

/**
 * TC_049 / TC_050 / TC_051: C-Admin >> Scheduling >> Manage time slot >> Open time slot
 * Test Case Title: To verify user able to Create, Edit and Delete open time slot
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Scheduling > Manage Time Slots > Open Time Slots
 *   Step 3 - Click on ADD NEW button under Open Time Slots tab
 *   Step 4 - Fill all required fields in popup with dynamic PU Location
 *   Step 5 - Set duration of slot under COMMON DURATION
 *   Step 6 - Click on CREATE EMPTY TIME SLOTS button and confirm
 *   Step 7 - Verify Open Time slots appointments are created successfully and close modal
 *   Step 8 - Select date range from prev month 1st to this month last date and click FILTER
 *   Step 9 - Search created open time slot and click on Edit icon
 *   Step 10 - Update PU Location with new dynamic value
 *   Step 11 - Click on UPDATE APPOINTMENT button and confirm
 *   Step 12 - Verify Open Time slots appointments updated successfully and close modal
 *   Step 13 - Search updated open time slot and click on Delete icon
 *   Step 14 - Confirm deletion in confirmation popup
 *   Step 15 - Verify Open Time slots appointment deleted successfully
 * Expected Result:
 *   1. Open Time slots appointments should be created successfully
 *   2. Open Time slots appointments should be edited successfully
 *   3. Open Time slots appointments should be deleted successfully
 **/
test('TC_049_050_051: C-Admin >> Scheduling >> Manage time slot >> Open time slot - To verify user able to Create, Edit and Delete open time slot', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const openTimeSlotsPage = new OpenTimeSlotsPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    let createdPuLocation = '';

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Manage Time Slots > Open Time Slots', async () => {
        await homePage.navigateToOpenTimeSlots();
    });

    await test.step('Step 2.1: Filter by current month, instructor, and appointment type to check occupied dates', async () => {
        await openTimeSlotsPage.applyFilterWithCurrentMonth({
            instructorName: credentials.staffUser.username,
            appointmentType: openTimeSlotsData.appointmentType
        });
    });

    await test.step('Step 3: Click on ADD NEW button under Open Time Slots tab', async () => {
        await openTimeSlotsPage.clickAddNew();
    });

    await test.step('Step 4: Fill all required fields in popup', async () => {
        createdPuLocation = await openTimeSlotsPage.fillOpenTimeSlotDetails(openTimeSlotsData, {
            instructorName: credentials.staffUser.username
        });
    });

    await test.step('Step 5: Click on CREATE EMPTY TIME SLOTS button and confirm', async () => {
        await openTimeSlotsPage.clickCreateEmptyTimeSlots();
    });

    await test.step('Step 6: Verify Open Time slots appointments created successfully and close modal', async () => {
        await openTimeSlotsPage.verifyOpenTimeSlotsCreatedSuccessfully();
        await openTimeSlotsPage.closeSuccessModal();
    });

    await test.step('Step 7: Apply filter with current month, instructor, and appointment type', async () => {
        await openTimeSlotsPage.applyFilterWithCurrentMonth({
            instructorName: credentials.staffUser.username,
            appointmentType: openTimeSlotsData.appointmentType
        });
    });

    await test.step('Step 8: Search created open time slot and click on Edit icon', async () => {
        await openTimeSlotsPage.searchOpenSlot(createdPuLocation);
        await openTimeSlotsPage.editOpenSlot();
    });

    await test.step('Step 9: Update PU Location with dynamic timestamp', async () => {
        await openTimeSlotsPage.editOpenTimeSlotDetails(openTimeSlotsData);
    });

    await test.step('Step 10: Click on UPDATE APPOINTMENT button and confirm', async () => {
        await openTimeSlotsPage.clickUpdateAppointment();
    });

    await test.step('Step 11: Verify Open Time slots appointments updated successfully and close modal', async () => {
        await openTimeSlotsPage.verifyOpenTimeSlotsUpdatedSuccessfully();
        await openTimeSlotsPage.closeSuccessModal();
    });

    await test.step('Step 12: Search updated open time slot and click on Delete icon', async () => {
        await openTimeSlotsPage.searchOpenSlot(createdPuLocation);
        await openTimeSlotsPage.deleteOpenSlot(createdPuLocation);
    });

    await test.step('Step 13: Verify Open Time slots appointment deleted successfully', async () => {
        await openTimeSlotsPage.verifyOpenTimeSlotsDeletedSuccessfully(createdPuLocation);
    });
});