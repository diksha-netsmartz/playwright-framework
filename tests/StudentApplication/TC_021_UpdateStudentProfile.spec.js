import { test } from '@playwright/test';
import StudentLoginPage from '../../pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '../../pages/StudentApplication/StudentPortalHomePage';
import StudentProfilePage from '../../pages/StudentApplication/StudentProfilePage';
import TestDataGenerator from '../../utils/TestDataGenerator';
import login from '../../test-data/login.json';

/**
 * TC_021: CSP
 * Test Case Title: Verify student is able to update the profile
 * Expected Result: Fields should be updated successfully
 **/
test('TC_021: CSP - Verify student is able to update the profile', { tag: '@smoke' }, async ({ page }) => {

    const studentLoginPage = new StudentLoginPage(page);
    const studentHomePage = new StudentHomePage(page);
    const studentProfilePage = new StudentProfilePage(page);

    let dynamicParentName;
    let dynamicHomePhone;
    let dynamicParentPhone;

    await test.step('Step 1: Login to student portal (CSP) with valid credentials', async () => {
        await studentLoginPage.navigateToLoginPage();
        await studentLoginPage.login(login.studentUser.username, login.studentUser.password);
    });

    await test.step('Step 2: Navigate to My Account > Profile', async () => {
        await studentHomePage.navigateToProfile();
    });

    await test.step('Step 3: Update profile fields with dynamic runtime values', async () => {
        dynamicParentName = TestDataGenerator.generateRandomFullName('Guardian');
        dynamicHomePhone = TestDataGenerator.generateRandomPhoneNumber();
        dynamicParentPhone = TestDataGenerator.generateRandomPhoneNumber();

        await studentProfilePage.updateProfileDetails({
            parent1GuardianName: dynamicParentName,
            parentPhone: dynamicParentPhone,
            homePhone: dynamicHomePhone
        });
    });

    await test.step('Step 4 & 5: Click Update and verify success message', async () => {
        await studentProfilePage.clickUpdate();
        await studentProfilePage.verifyProfileUpdateSuccess();
    });

    await test.step('Step 6: Navigate back to Profile and verify updated values', async () => {
        await studentHomePage.navigateToProfile();
        await studentProfilePage.verifyProfileDetails({
            parent1GuardianName: dynamicParentName,
            parentPhone: dynamicParentPhone,
            homePhone: dynamicHomePhone
        });
    });
});

