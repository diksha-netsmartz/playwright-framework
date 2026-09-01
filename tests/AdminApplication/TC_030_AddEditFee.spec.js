import {test} from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import FeesPage from '../../pages/AdminApplication/AccountManagement/Services/FeesPage';
import login from '../../test-data/json/login.json';
import feeData from '../../test-data/json/feeData.json';

/**
 * TC_030: C-Admin >> Account Management >> Services >> Fee
 * Test Case Title: To verify user able to add/edit Fee
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Account Management > Services > Fees
 *   Step 3 - Click on "Add New" and fill all the fee details with unique date-time name
 *   Step 4 - Click on Save button and verify fee added successfully
 *   Step 5 - Search the created Fee and click on Edit
 *   Step 6 - Update fee fields (Amount, Notes, Status) and save edited Fee
 *   Step 7 - Verify fee updated successfully
 * Expected Result:
 *   1. Fee should be created successfully
 *   2. Fee should be edited successfully
 **/
test('TC_030: C-Admin >> Account Management >> Services >> Fee - To verify user able to add/edit Fee', async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const feesPage = new FeesPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Account Management > Services > Fees', async () => {
        await homePage.navigateToFees();
    });

    await test.step('Step 3: Click "Add New" and fill fee details', async () => {
        await feesPage.clickAddNew();
        await feesPage.fillFeeDetails(feeData);
    });

    await test.step('Step 4: Click on Save button and verify fee added successfully', async () => {
        await feesPage.clickSave();
        await feesPage.verifyFeeAddedSuccessfully();
    });

    await test.step('Step 5: Search the created Fee and click on Edit', async () => {
        await feesPage.searchAndEditFee();
    });

    await test.step('Step 6: Update fields and save edited Fee', async () => {
        await feesPage.editFeeDetails(feeData);
        await feesPage.clickSave();
    });

    await test.step('Step 7: Verify fee edited successfully', async () => {
        await feesPage.verifyFeeUpdatedSuccessfully();
    });
});