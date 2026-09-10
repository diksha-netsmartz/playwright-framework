import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import OELeadPage from '../../pages/AdminApplication/StudentLeads/OELeadPage';
import login from '../../test-data/json/login.json';

/**
 * TC0044: C-Admin >> Student Leads >> OE Lead
 * Test Case Title: To verify Archive
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Student Leads
 *   Step 3 - Go to OE LEADS tab
 *   Step 4 - Select ACTIVE option from dropdown
 *   Step 5 - Get the 1st lead name and check the checkbox under ARCHIVE column
 *   Step 6 - Scroll down to bottom and click on ARCHIVE SELECTED button
 *   Step 7 - Press YES option in confirmation message
 *   Step 8 - Verify "OE Lead Archived successfully." message appears
 *   Step 9 - Change status to Archived and verify that the archived lead name exists in the list
 * Expected Result:
 *   OE LEADS records should be Archived successfully and appear under Archived status.
 **/
test('TC_044: C-Admin >> Student Leads >> OE Lead - To verify Archive', { tag: '@studentLeads' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const oeLeadPage = new OELeadPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];
    let leadNameToArchive = '';

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

    await test.step('Step 4: Select ACTIVE option from dropdown', async () => {
        await oeLeadPage.selectOELeadStatus('Active');
        await oeLeadPage.verifyOELeadsGridVisible();
    });

    await test.step('Step 5: Get 1st lead name and check the checkbox under ARCHIVE column', async () => {
        leadNameToArchive = await oeLeadPage.getFirstArchiveLeadName();
        await oeLeadPage.checkArchiveLeadCheckbox();
    });

    await test.step('Step 6-8: Click on ARCHIVE SELECTED button, confirm with YES and verify archiving', async () => {
        await oeLeadPage.clickArchiveSelected();
    });

    await test.step('Step 9: Change status dropdown to Archived and verify lead exists in list', async () => {
        await oeLeadPage.selectOELeadStatus('Archived');
        await oeLeadPage.verifyLeadExistsInGrid(leadNameToArchive);
    });
});
