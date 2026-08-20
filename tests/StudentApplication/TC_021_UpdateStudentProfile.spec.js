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
test('TC_021: CSP - Verify student is able to update the profile', async ({ page }) => {

    const studentLoginPage = new StudentLoginPage(page);
    const studentHomePage = new StudentHomePage(page);
    const studentProfilePage = new StudentProfilePage(page);

    // Generate dynamic runtime values for each test execution
    const dynamicParentName = TestDataGenerator.generateRandomFullName('Guardian');
    const dynamicHomePhone = TestDataGenerator.generateRandomPhoneNumber();
    const dynamicParentPhone = TestDataGenerator.generateRandomPhoneNumber();

    // Step 1: Login to student Portal
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(login.studentUser.username, login.studentUser.password);

    // Step 2: In the left navigation tab, click on My Account > Profile
    await studentHomePage.navigateToProfile();

    // Step 3: Update 2 to 3 fields with dynamic runtime values
    await studentProfilePage.updateProfileDetails({
        parent1GuardianName: dynamicParentName,
        parentPhone: dynamicParentPhone,
        homePhone: dynamicHomePhone
    });

    // Step 4: Click on Update
    await studentProfilePage.clickUpdate();

    // Step 5: Verify success message
    await studentProfilePage.verifyProfileUpdateSuccess();

    // Step 6: Navigate to My Account > Profile again and verify updated values
    await studentHomePage.navigateToProfile();
    await studentProfilePage.verifyProfileDetails({
        parent1GuardianName: dynamicParentName,
        parentPhone: dynamicParentPhone,
        homePhone: dynamicHomePhone
    });
});
