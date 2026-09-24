import { test } from '@playwright/test';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';
import ScheduleLessonsPage from '@pages/StaffApplication/Scheduling/ScheduleLessonsPage';
import { credentials } from '@config/config';

/**
 * TC_092: CSM >> Scheduling >> Schedule Lesson
 * Test Case Title: To Verify student is able to schedule appointment
 * Expected Result: Lesson should be scheduled successfully and should appear under "Click Here to View Scheduled Lessons"
 **/
test('TC_092: CSM - To Verify student is able to schedule appointment', { tag: ['@CSM', '@CSMScheduling'] }, async ({ page }) => {

  const staffLoginPage = new StaffLoginPage(page);
  const staffHomePage = new StaffHomePage(page);
  const scheduleLessonsPage = new ScheduleLessonsPage(page);

  const studentName = credentials.studentUser.name;
  let slotText;

  await test.step('Step 1: Login to the staff mobile portal (CSM) with valid credentials', async () => {
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
  });

  await test.step('Step 2: From side menu, navigate to Scheduling > Schedule lessons', async () => {
    await staffHomePage.navigateToScheduleLessons();
  });

  await test.step(`Step 3: Search for student "${studentName}" and select the student`, async () => {
    await scheduleLessonsPage.searchAndSelectStudent(studentName);
  });

  await test.step('Step 4: From available slots, select open slot (green button with appt date and time)', async () => {
    slotText = await scheduleLessonsPage.selectAnyOpenSlot();
  });

  await test.step('Step 5: Click on Schedule Lesson and verify confirmation popup appears', async () => {
    await scheduleLessonsPage.clickScheduleLesson();
    await scheduleLessonsPage.verifyLessonScheduledSuccess();
    await scheduleLessonsPage.verifyLessonIsScheduled(slotText);
  });

});