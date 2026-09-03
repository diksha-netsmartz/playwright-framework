import { test } from '@playwright/test';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage';
import NewClassPage from '../../pages/AdminApplication/Classroom/NewClassPage';
import login from '../../test-data/json/login.json';
import classroomData from '../../test-data/json/classroomData.json';

/**
 * TC_023: C-Admin > Classroom > New Class
 * Test Case Title: Add Multi Session Classroom
 * Precondition: User should have valid admin login credentials
 * Expected Result: Classroom should be created and saved successfully with confirmation message
 **/
test('TC_023: C-admin > Classroom > New Class - Add Multi Session Classroom', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const newClassPage = new NewClassPage(page);

  const credentials = login[process.env.ENV || 'coreServer2'];

  await test.step('Step 1: Login to Admin Portal with valid credentials', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 2: Navigate to Classroom >> New Class', async () => {
    await homePage.navigateToNewClass();
  });

  await test.step('Step 3: Fill all Multi-Session Classroom fields and submit', async () => {
    await newClassPage.createMultiSessionClassroom(classroomData, credentials.staffUser.username);
  });
});