import { test } from '@playwright/test';
import StudentLoginPage from '../../pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '../../pages/StudentApplication/StudentPortalHomePage';
import StudentProfilePage from '../../pages/StudentApplication/StudentProfilePage';
import TestDataGenerator from '../../utils/TestDataGenerator';
import login from '../../test-data/json/login.json';

/**
 * TC_021: CSP
 * Test Case Title: Verify student is able to update the profile
 * Expected Result: Fields should be updated successfully
 **/
test('TC_021: CSP - Verify student is able to update the profile', { tag: '@smoke' }, async ({ page }) => {

    const studentLoginPage = new StudentLoginPage(page);
    const studentHomePage = new StudentHomePage(page);
    const studentProfilePage = new StudentProfilePage(page);

    const credentials = login[process.env.ENV || 'coreServer2'];
    let dynamicParentPhone;
    let dynamicParentEmail;
    let dynamicAddress;
    let dynamicZipcode;
    let dynamicPermitNumber;

    await test.step('Step 1: Login to student portal (CSP) with valid credentials', async () => {
        await studentLoginPage.navigateToLoginPage();
        await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
    });

    await test.step('Step 2: Navigate to My Account > Profile', async () => {
        await studentHomePage.navigateToProfile();
    });

    await test.step('Step 3: Update profile fields with dynamic runtime values', async () => {
        dynamicParentPhone = TestDataGenerator.generateRandomPhoneNumber();
        dynamicParentEmail = `parent_${Date.now()}@test.com`;
        dynamicAddress = `${Math.floor(100 + Math.random() * 900)} Main Street`;
        dynamicZipcode = `${Math.floor(10000 + Math.random() * 90000)}`;
        dynamicPermitNumber = `PM${Math.floor(10000 + Math.random() * 90000)}`;

        await studentProfilePage.updateProfileDetails({
            parentPhone: dynamicParentPhone,
            parentGuardianEmail: dynamicParentEmail,
            address: dynamicAddress,
            permit: dynamicPermitNumber,
        });
    });

    await test.step('Step 4 & 5: Click Update and verify success message', async () => {
        await studentProfilePage.clickUpdate();
        await studentProfilePage.verifyProfileUpdateSuccess();
    });

    await test.step('Step 6: Navigate back to Profile and verify updated values', async () => {
        await studentHomePage.navigateToProfile();
        await studentProfilePage.verifyProfileDetails({
            parentPhone: dynamicParentPhone,
            parentGuardianEmail: dynamicParentEmail,
            address: dynamicAddress,
            permit: dynamicPermitNumber,
        });
    });
});

