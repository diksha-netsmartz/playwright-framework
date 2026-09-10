import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import OELeadPage from '../../pages/AdminApplication/StudentLeads/OELeadPage';
import login from '../../test-data/json/login.json';

/**
 * TC_043: C-Admin >> Student Leads >> OE Lead
 * Test Case Title: To verify Delete
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Student Leads
 *   Step 3 - Go to OE LEADS tab
 *   Step 4 - Select Show All option from dropdown
 *   Step 5 - Check the checkbox under DELETE column
 *   Step 6 - Scroll down to bottom and click on DELETE SELECTED button
 *   Step 7 - Press YES option in confirmation message
 * Expected Result:
 *   OE LEADS records should be Deleted successfully ("OE Lead Deleted successfully.")
 **/
test('TC_043: C-Admin >> Student Leads >> OE Lead - To verify Delete', { tag: '@studentLeads' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const oeLeadPage = new OELeadPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Student Leads from side menu', async () => {
        await homePage.navigateToStudentLead();
    });

    await test.step('Step 3: Go to OE LEADS tab', async () => {
        await oeLeadPage.clickOELeadsTab();
    });

    await test.step('Step 4: Select Show All option from dropdown', async () => {
        await oeLeadPage.selectOELeadStatus('Show All');
        await oeLeadPage.verifyOELeadsGridVisible();
    });

    await test.step('Step 5: Check the checkbox under DELETE column', async () => {
        await oeLeadPage.checkDeleteLeadCheckbox();
    });

    await test.step('Step 6-8: Click on DELETE SELECTED button, confirm with YES and verify deletion', async () => {
        await oeLeadPage.clickDeleteSelected();
    });
});