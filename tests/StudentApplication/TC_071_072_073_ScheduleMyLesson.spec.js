import { test } from '@playwright/test';
import StudentLoginPage from '../../pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '../../pages/StudentApplication/StudentPortalHomePage';
import StudentScheduleLessonsPage from '../../pages/StudentApplication/StudentScheduleLessonsPage';
import login from '../../test-data/json/login.json';

/**
 * TC_071: CSP >> Scheduling >> Schedule My lesson
 * Test Case Title: To Verify student is able to schedule appointment
 * Expected Result: Lesson should be scheduled successfully and appear under "Click Here to View Scheduled Lessons"
 *
 *  TC_072: CSP >> Scheduling >> reschedule
 * Test Case Title: To Verify Student is able to reschedule Appointment
 * Expected Result: Scheduled appointment is rescheduled successfully
 * 
 * TC_073: CSP >> Scheduling >> Cancel
 * Test Case Title: To Verify Student is able to Cancel Appointment
 * Expected Result: Scheduled appointment is cancelled successfully
 **/
test('TC_071 , TC_072 and TC_073: CSP - To Verify student is able to schedule ,reschedule and cancel appointment', { tag: '@CSPScheduling' }, async ({ page }) => {

  const studentLoginPage = new StudentLoginPage(page);
  const studentHomePage = new StudentHomePage(page);
  const studentScheduleLessonsPage = new StudentScheduleLessonsPage(page);

  const credentials = login[process.env.ENV || 'coreServer2'];
  let slotText, rescheduledSlotText, cancelledSlotText;

  await test.step('Step 1: Login to student portal (CSP) with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 2: From side menu, navigate to Scheduling > Schedule My Lessons', async () => {
    await studentHomePage.navigateToScheduleMyLessonsAdult();
  });

  await test.step('Step 3: From available slots, select open slot (button with appt date and time)', async () => {
    slotText = await studentScheduleLessonsPage.selectAnyOpenSlot();
  });

  await test.step('Step 4: Click on Schedule Lesson and verify confirmation popup appears', async () => {
    await studentScheduleLessonsPage.clickScheduleLesson('pu location', 'do location');
    await studentScheduleLessonsPage.verifyLessonScheduledSuccess();
  });

  await test.step('Step 5 : Verify lesson is scheduled under "Click Here to View Scheduled Lessons"', async () => {
    await studentScheduleLessonsPage.verifyLessonIsScheduled(slotText);
  });

  await test.step('Step 6 : Reschedule the scheduled lesson', async () => {
    rescheduledSlotText = await studentScheduleLessonsPage.rescheduleScheduledLesson();
    slotText = await studentScheduleLessonsPage.selectAnyOpenSlotForReschedule();
    await studentScheduleLessonsPage.clickScheduleLesson('pu location', 'do location');
    await studentScheduleLessonsPage.verifyLessonScheduledSuccess();
  });

  await test.step('Step 7 : Verify appointment is rescheduled successfully', async () => {
    await studentScheduleLessonsPage.verifyLessonIsScheduled(slotText);
    await studentScheduleLessonsPage.verifyLessonIsCancelledOrRescheduled(rescheduledSlotText);
  });

  await test.step('Step 8 : Cancel any scheduled lesson and confirm cancellation', async () => {
    cancelledSlotText = await studentScheduleLessonsPage.cancelScheduledLesson();
    await studentScheduleLessonsPage.verifyCancellationSuccess();
  });

  await test.step('Step 9 : Verify appointment is cancelled successfully', async () => {
    await studentScheduleLessonsPage.verifyLessonIsCancelledOrRescheduled(cancelledSlotText);
  });

});