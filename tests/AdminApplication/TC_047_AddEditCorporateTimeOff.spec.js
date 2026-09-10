import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import CorporateTimeOffPage from '../../pages/AdminApplication/Scheduling/CorporateTimeOffPage';
import login from '../../test-data/json/login.json';
import corporateTimeOffData from '../../test-data/json/corporateTimeOffData.json';

/**
 * TC_047: C-Admin >> Scheduling >> Corporate Time Off
 * Test Case Title: To verify user able to add / edit Corporate Time Off
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Scheduling > Corporate Time Off
 *   Step 3 - Click on "Add New" and fill all the fields (Name, Status, Code, Time Off Type, Affected Date(s), Note)
 *   Step 4 - Click on Save button and verify Corporate Time Off is added successfully
 *   Step 5 - Close the modal
 *   Step 6 - Search the created Corporate Time Off and click on Edit
 *   Step 7 - Update fields (Status to Deleted, Note) and save edited Corporate Time Off
 *   Step 8 - Verify Corporate Time Off is updated successfully and close the modal
 * Expected Result:
 *   1. Corporate Time Off should be created successfully
 *   2. Corporate Time Off should be edited successfully
 **/
test('TC_047: C-Admin >> Scheduling >> Corporate Time Off - To verify user able to add / edit Corporate Time Off', { tag: '@scheduling' }, async ({ page }) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const corporateTimeOffPage = new CorporateTimeOffPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Scheduling > Corporate Time Off', async () => {
        await homePage.navigateToCorporateTimeOff();
    });

    await test.step('Step 2.1: Select 100 rows and get occupied dates from Corporate Time Off table', async () => {
        await corporateTimeOffPage.selectPageLength('100');
        await corporateTimeOffPage.getOccupiedDaysFromTable();
    });

    await test.step('Step 3: Click "Add New" and fill Corporate Time Off details', async () => {
        await corporateTimeOffPage.clickAddNew();
        await corporateTimeOffPage.fillCorporateTimeOffDetails(corporateTimeOffData);
    });

    await test.step('Step 4: Click on Save button and verify Corporate Time Off added successfully', async () => {
        await corporateTimeOffPage.clickSave();
        await corporateTimeOffPage.verifyCorporateTimeOffAddedSuccessfully();
        await corporateTimeOffPage.clickClose();
    });

    await test.step('Step 5: Search the created Corporate Time Off and click on Edit', async () => {
        await corporateTimeOffPage.searchAndEdit();
    });

    await test.step('Step 6: Update fields and save edited Corporate Time Off', async () => {
        await corporateTimeOffPage.editCorporateTimeOffDetails(corporateTimeOffData);
        await corporateTimeOffPage.clickSave();
    });

    await test.step('Step 7: Verify Corporate Time Off updated successfully', async () => {
        await corporateTimeOffPage.verifyCorporateTimeOffUpdatedSuccessfully();
        await corporateTimeOffPage.clickClose();
    });
});