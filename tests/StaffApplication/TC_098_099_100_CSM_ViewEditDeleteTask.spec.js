import { test } from '@playwright/test';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';
import { credentials } from '@config/config';

/**
 * TC_098: CSM >> Task >> View - To Verify staff is able to view task
 * TC_099: CSM >> Task >> Edit - To Verify staff is able to edit task
 * TC_100: CSM >> Task >> Delete - To Verify staff is able to delete task
 * Precondition: Staff user has valid login credentials
 * Steps:
 *   Step 1 - Login to staff portal
 *   Step 2 - Scroll into the "Task" widget
 *   Step 3 - Click on View Details of a task and verify modal
 *   Step 4 - Close the View Details modal
 *   Step 5 - Click on Edit icon on a task
 *   Step 6 - Update the Note and Status
 *   Step 7 - Click on Save and confirm Yes
 *   Step 8 - Verify "Task updated successfully." notification
 * Expected Result:
 *   Staff is able to view, edit and delete task successfully
 **/
test('TC_098_099_100: CSM >> Task - To Verify staff is able to view, edit and delete task', { tag: ['@CSM', '@CSMTasks'] }, async ({ page }) => {

  const staffLoginPage = new StaffLoginPage(page);
  const staffHomePage = new StaffHomePage(page);

  const dynamicNote = `Task Note ${Date.now()}`;
  const dynamicSubject = `Task Automation ${Date.now()}`;

  await test.step('Step 1: Login to staff portal (CSM) with valid credentials', async () => {
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
  });

  await test.step('Step 2: Scroll into the "Task" widget', async () => {
    await staffHomePage.scrollToTasksWidget();
  });

  if (!await staffHomePage.isTaskPresent()) {
    return;
  }

  await test.step('Step 3: Click on View Details of a task and verify modal', async () => {
    await staffHomePage.viewTaskDetails();
  });

  await test.step('Step 4: Close the View Details modal', async () => {
    await staffHomePage.closeViewTaskModal();
  });

  await test.step('Step 5: Click on Edit icon on a task', async () => {
    await staffHomePage.openEditTaskModal();
  });

  await test.step('Step 6: Update the Note and Status', async () => {
    await staffHomePage.editTaskDetails({
      note: dynamicNote,
      status: 'Waiting Feedback',
      subject: dynamicSubject
    });
  });

  await test.step('Step 7: Click on Save and confirm Yes', async () => {
    await staffHomePage.saveTaskAndConfirm();
  });

  await test.step('Step 8: Verify "Task updated successfully." message', async () => {
    await staffHomePage.verifyTaskUpdateSuccess();
  });

  await test.step('Step 9: Open task again and verify details are updated successfully', async () => {
    await staffHomePage.openEditTaskModal();
    await staffHomePage.verifyTaskDetails({
      note: dynamicNote,
      status: 'Waiting Feedback',
      subject: dynamicSubject
    });
  });

  await test.step('Step 10: Delete the task', async () => {
    await staffHomePage.deleteTask();
  });

  await test.step('Step 11: Verify "Task deleted successfully." message', async () => {
    await staffHomePage.verifyTaskDeleteSuccess();
  });
});