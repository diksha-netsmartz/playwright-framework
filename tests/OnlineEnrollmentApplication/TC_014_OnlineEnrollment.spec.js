import {test} from '@playwright/test';
import TeenOnlineEnrollmentPage from '../../pages/OnlineEnrollmentApplication/TeenOnlineEnrollmentPage';
import AdultOnlineEnrollmentPage from '../../pages/OnlineEnrollmentApplication/AdultOnlineEnrollmentPage';
import WTOnlineEnrollmentPage from '../../pages/OnlineEnrollmentApplication/WTOnlineEnrollmentPage';


/**
 * TC_014: COE TEEN/ADULT/WT
 * Test Case Title: Verify new student able to register
 * Expected Result: Receipt Page should appear and student should be Registered and Enrollment should be done
 **/
test('TC_014: COE TEEN/ADULT/WT - Verify new student able to register', async ({page}) => {

    const teenOnlineEnrollmentPage = new TeenOnlineEnrollmentPage(page);
    const adultOnlineEnrollmentPage = new AdultOnlineEnrollmentPage(page);
    const wtOnlineEnrollmentPage = new WTOnlineEnrollmentPage(page);

    // Flow 1: Teen Online Enrollment (Select BTW package, fill student info, Pay later, verify receipt)
    await teenOnlineEnrollmentPage.navigateToTeenOEPage();
    await teenOnlineEnrollmentPage.selectBTWPackage();
    await teenOnlineEnrollmentPage.fillStudentInfo();
    await teenOnlineEnrollmentPage.clickPayLater();
    await teenOnlineEnrollmentPage.smsPopup();
    await teenOnlineEnrollmentPage.verifyReceiptPage();

    // Flow 2: Adult Online Enrollment (Select BTW package, fill student info, Pay later, verify receipt)
    await adultOnlineEnrollmentPage.navigateToAdultOEPage();
    await adultOnlineEnrollmentPage.selectBTWPackage();
    await adultOnlineEnrollmentPage.fillStudentInfo();
    await adultOnlineEnrollmentPage.clickPayLater();
    await adultOnlineEnrollmentPage.smsPopup();
    await adultOnlineEnrollmentPage.verifyReceiptPage();

    // Flow 3: WT Online Enrollment (Select BTW package, fill student info, Pay later, verify receipt)
    await wtOnlineEnrollmentPage.navigateToWTOEPage();
    await wtOnlineEnrollmentPage.selectBTWPackage();
    await wtOnlineEnrollmentPage.fillStudentInfo();
    await wtOnlineEnrollmentPage.clickPayLater();
    await wtOnlineEnrollmentPage.smsPopup();
    await wtOnlineEnrollmentPage.verifyReceiptPage();
});
