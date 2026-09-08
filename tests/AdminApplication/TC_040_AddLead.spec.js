import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import LeadPage from '../../pages/AdminApplication/StudentLeads/LeadPage';
import login from '../../test-data/json/login.json';
import leadData from '../../test-data/json/leadData.json';

/**
 * TC_040: C-Admin >> Student Leads >> Add Lead
 * Test Case Title: To verify user able to add a Lead
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Student Leads > Add Lead
 *   Step 3 - Fill all required fields (First Name, Last Name, Address, City, State,
 *             Zip, Email, Student Type, Birth Date, Phone Numbers)
 *   Step 4 - Click Save, confirm the Yes dialog, and verify Lead is added successfully
 * Expected Result:
 *   1. Lead should be added successfully with confirmation message 'Lead added successfully.'
 **/
test('TC_040: C-Admin >> Student Leads >> Add Lead - To verify user able to add a Lead', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const leadPage = new LeadPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Student Leads > Add Lead', async () => {
        await homePage.navigateToStudentLead();
    });

    await test.step('Step 3: Fill all required fields in the Add Lead form', async () => {
        await leadPage.clickOnAddNewButton();
        await leadPage.fillLeadDetails(leadData);
    });

    await test.step('Step 4: Save Lead and verify it is added successfully', async () => {
        await leadPage.clickSave();
        await leadPage.verifyLeadAddedSuccessfully();
    });
});