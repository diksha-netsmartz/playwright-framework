import { test } from '@playwright/test';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StaffHomePage from '@pages/StaffApplication/StaffHomePage';
import StaffProfilePage from '@pages/StaffApplication/StaffProfilePage';
import TestDataGenerator from '@utils/TestDataGenerator';
import DateHelper from '@utils/DateHelper';
import { credentials } from '@config/config';

/**
 * TC_094: CSM >> My Profile >> update
 * Test Case Title: To verify staff is able to update profile
 * Precondition: Staff user has valid login credentials
 * Steps:
 *   Step 1 - Login to the staff mobile portal
 *   Step 2 - Navigate to "My Profile"
 *   Step 3 - Update the fields (Emergency Contact Name, Emergency Contact Phone, Instructor/Staff License#) with dynamic runtime data
 *   Step 4 - Click on Update and confirm
 *   Step 5 - Verify success message
 *   Step 6 - Navigate back to "My Profile" and verify updated field values via value attribute
 * Expected Result:
 *   Staff profile details should be updated successfully and verified
 **/
test('TC_094: CSM - To verify staff is able to update profile', { tag: ['@CSM', '@CSMMyProfile'] }, async ({ page }) => {

  const staffLoginPage = new StaffLoginPage(page);
  const staffHomePage = new StaffHomePage(page);
  const staffProfilePage = new StaffProfilePage(page);

  // Generate runtime dynamic data for all profile fields
  const dynamicProfileData = {
    homePhone: TestDataGenerator.generateRandomPhoneNumber(),
    cellPhone: TestDataGenerator.generateRandomPhoneNumber(),
    otherPhone: TestDataGenerator.generateRandomPhoneNumber(),
    emergencyContactName: TestDataGenerator.generateRandomFullName('Emergency'),
    emergencyContactPhone: TestDataGenerator.generateRandomPhoneNumber(),
    emergencyContactRelation: 'Brother',
    licenseNumber: `${Math.floor(1000000000000000 + Math.random() * 9000000000000000)}`,
    instructorPermitNumber: `${Math.floor(100000000 + Math.random() * 900000000)}`,
    city: 'AutomationCity',
    zip: TestDataGenerator.generateRandomZipCode(),
    zoomHostUrl: `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}?pwd=host`,
    zoomUserUrl: `https://zoom.us/j/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
    staffCode: `SC${TestDataGenerator.generateRandomThreeDigitNumber()}`,
    certExpDate: DateHelper.formatDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000 * 5)),
    inCarPermitIssueDate: DateHelper.formatDate(new Date()),
    certificateNumber: `${Math.floor(100000000 + Math.random() * 900000000)}`,
    email: 'testingdata3011@gmail.com',
    notes: 'Updated notes for verification: ' + new Date()
  };

  await test.step('Step 1: Login to the staff mobile portal (CSM) with valid credentials', async () => {
    await staffLoginPage.navigateToLoginPage();
    await staffLoginPage.login(credentials.staffUser.username, credentials.staffUser.password);
  });

  await test.step('Step 2: Navigate to "My Profile"', async () => {
    await staffHomePage.navigateToMyProfile();
  });

  await test.step('Step 3: Update the fields with runtime generated data', async () => {
    await staffProfilePage.updateProfileDetails(dynamicProfileData);
  });

  await test.step('Step 4 & 5: Click on Update, confirm and verify success message', async () => {
    await staffProfilePage.clickUpdate();
    await staffProfilePage.verifyProfileUpdateSuccess();
  });

  await test.step('Step 6: Navigate to My Profile and verify updated details', async () => {
    await staffHomePage.navigateToMyProfile();
    await staffProfilePage.verifyProfileDetails(dynamicProfileData);
  });
});