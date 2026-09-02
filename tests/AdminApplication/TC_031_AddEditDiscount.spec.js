import {test} from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import DiscountsPage from '../../pages/AdminApplication/AccountManagement/Services/DiscountsPage';
import login from '../../test-data/json/login.json';
import discountData from '../../test-data/json/discountData.json';

/**
 * TC_031: C-Admin >> Account Management >> Services >> Discount
 * Test Case Title: To verify user able to add/edit Discount
 * Precondition: User should have valid admin login credentials
 * Steps:
 *   Step 1 - Login to Admin Portal with valid credentials
 *   Step 2 - From the side menu, navigate to Account Management > Services > Discounts
 *   Step 3 - Click on "Add New" and fill all the discount details (Date.now() name & random code)
 *   Step 4 - Click on Save button and verify discount added successfully
 *   Step 5 - Search the created Discount and click on Edit
 *   Step 6 - Update discount fields (Amount, Notes, Status) and save edited Discount
 *   Step 7 - Verify discount updated successfully
 * Expected Result:
 *   1. Discounts should be created successfully
 *   2. Discounts should be edited successfully
 **/
test('TC_031: C-Admin >> Account Management >> Services >> Discount - To verify user able to add/edit Discount', async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const discountsPage = new DiscountsPage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];

    await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2: Navigate to Account Management > Services > Discounts', async () => {
        await homePage.navigateToDiscounts();
    });

    await test.step('Step 3: Click "Add New" and fill discount details', async () => {
        await discountsPage.clickAddNew();
        await discountsPage.fillDiscountDetails(discountData);
    });

    await test.step('Step 4: Click on Save button and verify discount added successfully', async () => {
        await discountsPage.clickSave();
        await discountsPage.verifyDiscountAddedSuccessfully();
    });

    await test.step('Step 5: Search the created Discount and click on Edit', async () => {
        await discountsPage.searchAndEditDiscount();
    });

    await test.step('Step 6: Update fields and save edited Discount', async () => {
        await discountsPage.editDiscountDetails(discountData);
        await discountsPage.clickSave();
    });

    await test.step('Step 7: Verify discount edited successfully', async () => {
        await discountsPage.verifyDiscountUpdatedSuccessfully();
    });
});