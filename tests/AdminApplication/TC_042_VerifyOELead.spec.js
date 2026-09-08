import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import OELeadPage from '../../pages/AdminApplication/StudentLeads/OELeadPage';
import login from '../../test-data/json/login.json';

/**
 * TC_042: C-Admin >> Student Leads >> OE Lead
 * Test Case Title: To verify OE lead appear
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Student Leads
 *   Step 3 - Go to OE LEADS tab
 *   Step 4 - Select ACTIVE option from dropdown
 *             Then OE LEADS records should appear
 *   Step 5 - Now Select SHOW ALL option from dropdown
 *             Then OE LEADS records should appear
 * Expected Result:
 *   OE LEADS records should appear for both ACTIVE and SHOW ALL filter options.
 **/
test('TC_042: C-Admin >> Student Leads >> OE Lead - To verify OE lead appear', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const oeLeadPage = new OELeadPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Student Leads', async () => {
        await homePage.navigateToStudentLead();
    });

    await test.step('Step 3: Go to OE Leads tab', async () => {
        await oeLeadPage.clickOELeadsTab();
    });

    await test.step('Step 4: Select SHOW ALL from dropdown and verify OE Leads records appear', async () => {
        await oeLeadPage.selectOELeadStatus('Show All');
        await oeLeadPage.verifyOELeadsGridVisible();
    });

    await test.step('Step 5: Select ACTIVE from dropdown and verify OE Leads records appear', async () => {
        await oeLeadPage.selectOELeadStatus('Active');
        await oeLeadPage.verifyOELeadsGridVisible();
    });


});
