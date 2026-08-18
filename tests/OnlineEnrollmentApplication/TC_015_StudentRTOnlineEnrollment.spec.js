import {test} from '@playwright/test';
import OnlineEnrollmentPage from '../../pages/OnlineEnrollmentApplication/RTStudentOnlineEnrollmentPage';


/**
 * TC_015: COE RT
 * Test Case Title: Verify new student able to register
 * Expected Result: Receipt Page should appear and student should be Registered and Enrollment should be done
 **/
test('TC_015: COE RT - Verify new student able to register', async ({page}) => {

    const onlineEnrollmentPage = new OnlineEnrollmentPage(page);

    // Step 1: Navigate to RT Online Enrollment page
    await onlineEnrollmentPage.navigateToRTOEPage();

    // Step 2: Select RT Package
    await onlineEnrollmentPage.selectRTPackage();

    // Step 3: Select Appointment and fill student info
    await onlineEnrollmentPage.fillStudentInfo();

    // Step 4: Click on Pay later and confirm SMS popup
    await onlineEnrollmentPage.clickPayLater();
    await onlineEnrollmentPage.smsPopup();

    // Step 5: Verify receipt page appears and enrollment is completed
    await onlineEnrollmentPage.verifyReceiptPage();
});
