import {test} from '@playwright/test';
import OnlineEnrollmentPage from '../../pages/OnlineEnrollmentApplication/RTStudentOnlineEnrollmentPage';


/**
 * TC_015: COE RT
 * Test Case Title: Verify new student able to register
 * Expected Result: Receipt Page should appear and student should be Registered and Enrollment should be done
 **/
test('TC_015: COE RT - Verify new student able to register', { tag: '@smoke' }, async ({page}) => {

    const onlineEnrollmentPage = new OnlineEnrollmentPage(page);

    await test.step('Step 1: Navigate to RT Online Enrollment page', async () => {
        await onlineEnrollmentPage.navigateToRTOEPage();
    });

    await test.step('Step 2: Select RT Package', async () => {
        await onlineEnrollmentPage.selectRTPackage();
    });

    await test.step('Step 3: Select Appointment and fill student info', async () => {
        await onlineEnrollmentPage.fillStudentInfo();
    });

    await test.step('Step 4: Click Pay later and handle SMS popup', async () => {
        await onlineEnrollmentPage.clickPayLater();
        await onlineEnrollmentPage.smsPopup();
    });

    await test.step('Step 5: Verify receipt page appears and enrollment is completed', async () => {
        await onlineEnrollmentPage.verifyReceiptPage();
    });
});

