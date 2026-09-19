import { test } from '@playwright/test';
import OnlineEnrollmentPage from '@pages/OnlineEnrollmentApplication/OnlineEnrollmentPage';
import oeData from '@test-data/json/onlineEnrollmentData.json';

/**
 * TC_067: C-OE
 * Test Case Title: To verify that enrollment is working with package parameter
 * URL: https://www.tdsm.app/OE/Customer/studentTeen?companyId=h9YwUPSXnrc=&param=BTW1
 *
 * Steps:
 *   Step 1: Navigate to Teen OE page with package parameter and select month, day and year from the DOB pop-up
 *   Step 2: Add values for all Student info fields
 *   Step 3: Click on Pay later and handle SMS popup
 * Expected Result: Receipt Page should appear and student should be Registered and Enrollment should be done
 **/
test('TC_067: C-OE - To verify that enrollment is working with package parameter', { tag: '@onlineEnrollment' }, async ({ page }) => {
    const oe = new OnlineEnrollmentPage(page);
    const packageParam = oeData.urlParameters?.packageParam || '&param=BTW1';

    await test.step('Step 1: Navigate to Teen OE page with package parameter and select DOB', async () => {
        await oe.navigateToTeenOEPageWithParams(packageParam);
        await oe.selectDOBForPackage();
        await oe.clickContinue();
    });

    await test.step('Step 2: Add values for all Student info fields', async () => {
        await oe.fillStudentInfo();
    });

    await test.step('Step 3: Click on Pay later and handle SMS popup', async () => {
        await oe.clickPayLater();
        await oe.smsPopup();
    });

    await test.step('Step 4: Verify Receipt Page appears and registration is completed', async () => {
        await oe.verifyReceiptPage('REGISTRATION COMPLETED', 'Teen_Registration_Receipt.pdf');
    });
});
