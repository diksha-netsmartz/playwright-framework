import { test } from '@playwright/test';
import OnlineEnrollmentPage from '@pages/OnlineEnrollmentApplication/OnlineEnrollmentPage';
import oeData from '@test-data/json/onlineEnrollmentData.json';
import { currentEnv } from '@config/config';

/**
 * TC_070: C-OE
 * Test Case Title: To verify that enrollment is working with package, cr parameter and location parameter
 * URL: https://www.tdsm.app/OE/Customer/studentTeen?companyId=h9YwUPSXnrc=&param=BTWCR1&CR=CR1&loc=LA
 *
 * Steps:
 *   Step 1 - Click on the Select button for any class
 *   Step 2 - From the select package pop-up, select BTW and CR Package
 *   Step 3 - Click on continue
 *   Step 4 - Fill data in all the fields
 *   Step 5 - Click on Pay Later
 * Expected Result: Receipt Page should appear and student should be Registered and Enrollment should be done
 **/
test('TC_070: C-OE - To verify that enrollment is working with package, cr parameter and location parameter', { tag: '@onlineEnrollment' }, async ({ page }) => {
    const oe = new OnlineEnrollmentPage(page);
    const packageCrAndLocParam = oeData.urlParameters?.packageCrAndLocParam || '&param=BTWCR1&CR=CR1&loc=LA';

    await test.step('Step 1: Navigate to Teen OE page with package, CR, and location parameters', async () => {
        await oe.navigateToTeenOEPageWithParams(packageCrAndLocParam);
    });

    await test.step('Step 2: Click on the Select button for any class', async () => {
        if (currentEnv?.toLowerCase() === 'coreserver1') {
            await oe.selectDateOfBirth();
        }
        // await oe.selectDOBForPackage();
        await oe.selectClass();
    });

    await test.step('Step 3: From the select package pop-up, select BTW and CR Package', async () => {
        await oe.selectBtwAndCrPackage();
    });

    // await test.step('Step 4: Click on continue', async () => {
    //     await oe.clickContinue();
    // });

    await test.step('Step 4: Fill data in all the fields', async () => {
        await oe.fillStudentInfo();
    });

    await test.step('Step 5: Click on Pay Later and handle SMS popup', async () => {
        await oe.clickPayLater();
        await oe.smsPopup();
    });

    await test.step('Step 6: Verify Receipt Page appears and registration is completed', async () => {
        await oe.verifyReceiptPage('REGISTRATION COMPLETED', 'Teen_Package_CR_Loc_Registration_Receipt.pdf');
    });
});
