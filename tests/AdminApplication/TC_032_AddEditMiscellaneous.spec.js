import {test} from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import MiscellaneousPage from '../../pages/AdminApplication/AccountManagement/Services/MiscellaneousPage';
import login from '../../test-data/json/login.json';
import miscData from '../../test-data/json/miscellaneousData.json';

/**
 * TC_032: C-Admin >> Account Management >> Services >> Misc
 * Test Case Title: To verify user able to add /Edit Misc
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Account Management > Services > Miscellaneous
 *   Step 3 - Click on "Add New" and fill all the fields (prefix + Date.now() for item name)
 *   Step 4 - Click on Save button and verify miscellaneous item added successfully
 *   Step 5 - Navigate to the miscellaneous item created in above steps and click on edit button
 *   Step 6 - Edit fields (Category, Status, Price) and save
 *   Step 7 - Verify miscellaneous item edited successfully
 * Expected Result:
 *   1. Miscellaneous item should be created successfully
 *   2. Miscellaneous item should be edited successfully
 **/
test('TC_032: C-Admin >> Account Management >> Services >> Misc - To verify user able to add /Edit Misc', async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const miscPage = new MiscellaneousPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Account Management > Services > Miscellaneous', async () => {
        await homePage.navigateToMiscellaneous();
    });

    await test.step('Step 3: Click "Add New" and fill miscellaneous item details', async () => {
        await miscPage.clickAddNew();
        await miscPage.fillMiscDetails(miscData);
    });

    await test.step('Step 4: Click on Save button and verify miscellaneous item added successfully', async () => {
        await miscPage.clickSave();
        await miscPage.verifyMiscAddedSuccessfully();
    });

    await test.step('Step 5: Search the created Miscellaneous item and click on Edit', async () => {
        await miscPage.searchAndEditMisc();
    });

    await test.step('Step 6: Update fields and save edited Miscellaneous item', async () => {
        await miscPage.editMiscDetails(miscData);
        await miscPage.clickSave();
    });

    await test.step('Step 7: Verify miscellaneous item edited successfully', async () => {
        await miscPage.verifyMiscUpdatedSuccessfully();
    });
});
