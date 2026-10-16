import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import WebsiteContentWidgetPage from '@pages/AdminApplication/Communication/WebsiteContentWidgetPage';
import { credentials } from '@config/config';

/**
 * TC_137: C-Admin >> Communication >> Website content >> Widget
 * Test Case Title: To Verify Staff is able to save Widget website content and verify persistence
 * Precondition: Staff should be logged in to C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2, 3 & 4: Click on Communication -> Website Content -> Widget.
 *   Step 5 & 6: Add Content and Internal note on Home Page tab, click Submit, and verify success message.
 *   Step 7, 8 & 9: Click on Content 2 tab, add Content and Internal note, click Submit, and verify success message.
 *   Step 10, 11 & 12: Click on Content 3 tab, add Content and Internal note, click Submit, and verify success message.
 *   Step 13, 14 & 15: Click on Content 4 tab, add Content and Internal note, click Submit, and verify success message.
 *   Step 16, 17 & 18: Click on Content 5 tab, add Content and Internal note, click Submit, and verify success message.
 *   Step 19: Re-navigate to Communication -> Website Content -> Widget and verify persisted content across all tabs.
 *
 * Expected Result:
 *   Staff should be able to add and save Widget content and internal notes across all tabs (Home Page, Content 2, 3, 4, 5),
 *   and changes should persist upon re-navigating to the page.
 **/
test('TC_137: C-Admin >> Communication >> Website content >> Widget - To Verify Staff is able to save Widget website content and verify persistence', { tag: ['@CAdmin', '@communication'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const widgetPage = new WebsiteContentWidgetPage(page);

  const timestamp = Date.now();
  const homePageContent = `Welcome to Premier Driving Academy Widget Portal. We provide state-certified driver training programs, modern dual-control training vehicles, and professional licensed instructors dedicated to student safety and road confidence. Ref: #HP-${timestamp}`;
  const homePageNote = `Homepage widget announcement and state curriculum certification reference #${timestamp}`;

  const content2Text = `Teen Driver Education Program: Includes 30 hours of comprehensive classroom instruction and 6 hours of one-on-one behind-the-wheel training designed to help new drivers pass their road exams on the first attempt. Ref: #C2-${timestamp}`;
  const content2Note = `Internal review note: Updated teen driver education package specifications #${timestamp}`;

  const content3Text = `Adult Private Driving Lessons: Tailored one-on-one behind-the-wheel instruction for adult learners, nervous drivers, and international drivers seeking state driver license endorsements. Ref: #C3-${timestamp}`;
  const content3Note = `Internal compliance note: Verified adult refresher course guidelines #${timestamp}`;

  const content4Text = `DMV Road Test Preparation & Vehicle Rental: Complete pre-exam refresher session and vehicle hire for the state driver license road exam with certified instructor escort. Ref: #C4-${timestamp}`;
  const content4Note = `Staff coordination note: Road test concierge booking policies confirmed #${timestamp}`;

  const content5Text = `Frequently Asked Questions & Enrollment Support: Access licensing requirements, permit test guidelines, schedule rescheduling policies, and direct contact options for our support specialists. Ref: #C5-${timestamp}`;
  const content5Note = `Customer support note: Updated FAQ guidance and operating hours #${timestamp}`;

  await test.step('Step 1: Login to C-Admin', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 2, 3 & 4: Navigate to Communication -> Website Content -> Widget', async () => {
    await homePage.navigateToWebsiteContentWidget();
  });

  await test.step('Step 5 & 6: Add Content and Internal note on Home Page, click Submit, and verify success message', async () => {
    await widgetPage.fillContent(homePageContent);
    await widgetPage.fillInternalNote(homePageNote);
    await widgetPage.saveAndVerifySuccess();
  });

  await test.step('Step 7, 8 & 9: Click Content 2, add Content and Internal note, click Submit, and verify success message', async () => {
    await widgetPage.navigateToTab('Content 2');
    await widgetPage.fillContent(content2Text);
    await widgetPage.fillInternalNote(content2Note);
    await widgetPage.saveAndVerifySuccess();
  });

  await test.step('Step 10, 11 & 12: Click Content 3, add Content and Internal note, click Submit, and verify success message', async () => {
    await widgetPage.navigateToTab('Content 3');
    await widgetPage.fillContent(content3Text);
    await widgetPage.fillInternalNote(content3Note);
    await widgetPage.saveAndVerifySuccess();
  });

  await test.step('Step 13, 14 & 15: Click Content 4, add Content and Internal note, click Submit, and verify success message', async () => {
    await widgetPage.navigateToTab('Content 4');
    await widgetPage.fillContent(content4Text);
    await widgetPage.fillInternalNote(content4Note);
    await widgetPage.saveAndVerifySuccess();
  });

  await test.step('Step 16, 17 & 18: Click Content 5, add Content and Internal note, click Submit, and verify success message', async () => {
    await widgetPage.navigateToTab('Content 5');
    await widgetPage.fillContent(content5Text);
    await widgetPage.fillInternalNote(content5Note);
    await widgetPage.saveAndVerifySuccess();
  });

  await test.step('Step 19: Re-navigate to Website Content -> Widget and verify persisted content across all tabs', async () => {
    await homePage.navigateToWebsiteContentWidget();

    // Verify Home Page tab (default open tab)
    await widgetPage.verifyContent(homePageContent);
    await widgetPage.verifyInternalNote(homePageNote);

    // Verify Content 2 tab
    await widgetPage.navigateToTab('Content 2');
    await widgetPage.verifyContent(content2Text);
    await widgetPage.verifyInternalNote(content2Note);

    // Verify Content 3 tab
    await widgetPage.navigateToTab('Content 3');
    await widgetPage.verifyContent(content3Text);
    await widgetPage.verifyInternalNote(content3Note);

    // Verify Content 4 tab
    await widgetPage.navigateToTab('Content 4');
    await widgetPage.verifyContent(content4Text);
    await widgetPage.verifyInternalNote(content4Note);

    // Verify Content 5 tab
    await widgetPage.navigateToTab('Content 5');
    await widgetPage.verifyContent(content5Text);
    await widgetPage.verifyInternalNote(content5Note);
  });
});