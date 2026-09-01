import {test} from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import ComponentsPage from '../../pages/AdminApplication/AccountManagement/Services/ComponentsPage';
import login from '../../test-data/json/login.json';
import componentData from '../../test-data/json/componentData.json';

/**
 * TC_029: C-Admin >> Account Management >> Services >> Component
 * Test Case Title: To verify user able to add/edit component
 * Precondition: User should have valid admin login credentials
 * Expected Result:
 *   1. Components (Products) should be created successfully
 *   2. Components (Products) should be edited successfully
 **/
test('TC_029: C-Admin >> Account Management >> Services >> Component - To verify user able to add/edit component', async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const componentsPage = new ComponentsPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Account Management > Services > Components (Products)', async () => {
        await homePage.navigateToComponents();
    });

    await test.step('Step 3: Click "Add New" and fill component details', async () => {
        await componentsPage.clickAddNew();
        await componentsPage.fillComponentDetails(componentData);
    });

    await test.step('Step 4: Click on Save button and verify component created successfully', async () => {
        await componentsPage.clickSave();
        await componentsPage.verifyComponentAddedSuccessfully();
    });

    await test.step('Step 5: Search the created component and click on Edit', async () => {
        await componentsPage.searchAndEditComponent();
    });


    await test.step('Step 6: Update fields and save edited component', async () => {
        await componentsPage.editComponentFields();
        await componentsPage.clickSave();
    });

    await test.step('Step 7: Verify component edited successfully', async () => {
        await componentsPage.verifyComponentUpdatedSuccessfully();
    });
});