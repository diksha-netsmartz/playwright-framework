import { test } from '@playwright/test';
import OnlineEnrollmentPage from '../../pages/OnlineEnrollmentApplication/OnlineEnrollmentPage';

/**
 * TC_014: COE TEEN/ADULT/WT
 * Test Case Title: Verify new student able to register
 * Expected Result: Receipt Page should appear and student should be Registered and Enrollment should be done
 **/
test('TC_014: COE TEEN/ADULT/WT - Verify new student able to register', { tag: '@smoke' }, async ({ page }) => {
    const oe = new OnlineEnrollmentPage(page);

    const enrollmentFlows = [
        { name: 'Teen', navigate: () => oe.navigateToTeenOEPage() },
        { name: 'Adult', navigate: () => oe.navigateToAdultOEPage() },
        { name: 'WT', navigate: () => oe.navigateToWTOEPage() }
    ];

    for (const flow of enrollmentFlows) {
        await test.step(`Complete ${flow.name} Online Enrollment (BTW package, Pay later, verify receipt)`, async () => {
            await flow.navigate();
            await oe.selectDOBForPackage();
            await oe.selectBTWPackage();
            await oe.fillStudentInfo();
            await oe.clickPayLater();
            await oe.smsPopup();
            await oe.verifyReceiptPage('REGISTRATION COMPLETED', `${flow.name}_Registration_Receipt.pdf`);
        });
    }
});

