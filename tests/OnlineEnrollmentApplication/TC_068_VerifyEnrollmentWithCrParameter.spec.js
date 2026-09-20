import { test } from '@playwright/test';
import OnlineEnrollmentPage from '@pages/OnlineEnrollmentApplication/OnlineEnrollmentPage';
import oeData from '@test-data/json/onlineEnrollmentData.json';
import { currentEnv } from '@config/config';

/**
 * TC_068: C-OE
 * Test Case Title: To verify that enrollment is working with cr parameter
 * URL: https://www.tdsm.app/OE/Customer/studentTeen?companyId=h9YwUPSXnrc=&CR=CR1
 *
 * Steps:
 *   Step 1 - Click on the Select button for any class
 *   Step 2 - From the select package pop-up, select BTW and CR Package
 *   Step 3 - Click on continue
 *   Step 4 - Fill data in all the fields
 *   Step 5 - Click on Pay Later
 * Expected Result: Receipt Page should appear and student should be Registered and Enrollment should be done
 **/
test('TC_068: C-OE - To verify that enrollment is working with cr parameter', { tag: '@onlineEnrollment' }, async ({ page }) => {
    const oe = new OnlineEnrollmentPage(page);
    const crParam = oeData.urlParameters?.crParam || '&CR=CR1';

    await test.step('Step 1: Navigate to Teen OE page with CR parameter', async () => {
        await oe.navigateToTeenOEPageWithParams(crParam);
    });

    await test.step('Step 2: Click on the Select button for any class', async () => {
        if (currentEnv?.toLowerCase() === 'coreserver1') {
            await oe.selectDateOfBirth();
        }

        await oe.selectClass();
        // await oe.selectDOBForPackage();
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
        await oe.verifyReceiptPage('REGISTRATION COMPLETED', 'Teen_CR_Registration_Receipt.pdf');
    });
});
