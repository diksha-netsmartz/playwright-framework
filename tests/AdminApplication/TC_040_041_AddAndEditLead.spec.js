import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import LeadPage from '../../pages/AdminApplication/StudentLeads/LeadPage';
import login from '../../test-data/json/login.json';
import leadData from '../../test-data/json/leadData.json';

/**
 * TC_040_041: C-Admin >> Student Leads >> Add and Edit Lead
 * Test Case Title: To verify user is able to add a Lead and then edit the created Lead
 * Precondition: User should have valid admin login credentials
 *
 * Steps:
 *   [Part 1: TC_040 - Add Lead]
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Student Leads > Add Lead
 *   Step 3 - Fill all required fields in the Add Lead form
 *   Step 4 - Click Save, confirm Yes dialog, and verify Lead is added successfully
 *
 *   [Part 2: TC_041 - Edit Lead]
 *   Step 5 - Navigate to Student Leads tab / board view and filter all leads
 *   Step 6 - Click on the newly created Lead card to open for editing
 *   Step 7 - Verify the saved fields appear correctly
 *   Step 8 - Update the fields with new values
 *   Step 9 - Click on SAVE button and confirm
 *   Step 10 - Verify Lead is updated successfully ("Details updated successfully.")
 *
 * Expected Result:
 *   1. Lead should be added successfully with confirmation message "Lead added successfully."
 *   2. The newly created Lead should open in the edit modal with saved values intact.
 *   3. Updating fields and clicking Save should update the lead with "Details updated successfully."
 **/
test('TC_040_041: C-Admin >> Student Leads - Add and Edit Lead', { tag: '@studentLeads' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const leadPage = new LeadPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];
    /** @type {any} */
    let createdLead = {};

    // --- Part 1: TC_040 - Add Lead ---
    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Student Leads > Add Lead', async () => {
        await homePage.navigateToStudentLead();
    });

    await test.step('Step 3: Fill all required fields in the Add Lead form', async () => {
        await leadPage.clickOnAddNewButton();
        createdLead = await leadPage.fillLeadDetails(leadData);
    });

    await test.step('Step 4: Save Lead and verify it is added successfully', async () => {
        await leadPage.clickSave();
        await leadPage.verifyLeadAddedSuccessfully();
    });

    // --- Part 2: TC_041 - Edit Lead ---
    await test.step('Step 5: Filter all leads', async () => {
        await leadPage.filterShowAllStaffLeads();
    });

    await test.step(`Step 6: Click on the newly created Lead card ("${createdLead.firstName}") to edit`, async () => {
        await leadPage.openLeadForEdit(createdLead.firstName);
    });

    await test.step('Step 8: Update the fields with new values', async () => {
        await leadPage.updateLeadFields(leadData.editLead);
        await leadPage.updateNotes(leadData.editLead.notes);
        await leadPage.updateTask(leadData.editLead.taskSubject, leadData.editLead.taskNote);
    });

    await test.step('Step 9: Click SAVE button and confirm', async () => {
        await leadPage.saveEditedLead();
    });

    await test.step('Step 10: Verify Lead is updated successfully', async () => {
        await leadPage.verifyLeadUpdatedSuccessfully();
    });

    await test.step(`Step 11: Click on the recently updated Lead card ("${createdLead.firstName}") to edit`, async () => {
        await leadPage.openLeadForEdit(createdLead.firstName);
    });

    await test.step('Step 12: Verify Lead details are updated successfully', async () => {
        await leadPage.verifyLeadDeatilsAreUpdatedSuccessfully(leadData.editLead);
    });
});
