import { test } from '@playwright/test';

import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import EnrollmentBillingPage from '../../pages/AdminApplication/EnrollmentBillingPage';
import HomePage from '../../pages/AdminApplication/AdminPortalHomePage'
import login from "../../test-data/login.json";
import studentData from "../../test-data/studentData.json"

/**
 * TC_007: C-admin > Student > Enrollment
 * Test Case Title: Verify User can Add, Edit and Delete Package.
 * Precondition: Student should be created first
 * Expected Result: Enrollment is Added, Edit and Deleted.
 **/
test('TC_007: C-admin > Student > Enrollment - Verify User can Add, Edit and Delete Package', { tag: '@smoke' }, async ({ page }) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentBillingPage = new EnrollmentBillingPage(page);

    await test.step('Step 1: Login to C-admin with valid credentials', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(
            login.validUser.username,
            login.validUser.password
        );
    });

    await test.step('Step 2: Navigate to Student Account -> Enrollment/Billing', async () => {
        await homePage.openEnrollmentBilling();
    });

    await test.step(`Step 3: Search and select student: "${studentData.student1.name}"`, async () => {
        await enrollmentBillingPage.selectStudent(studentData.student1.name);
    });

    await test.step('Step 4: Click Add New and add CR Package', async () => {
        await enrollmentBillingPage.clickAddNew();
        await enrollmentBillingPage.addCRPackage();
    });

    await test.step('Step 5: Click Enroll Button to enroll student in package', async () => {
        await enrollmentBillingPage.enroll();
    });

    await test.step('Step 6: Edit package notes and update', async () => {
        await enrollmentBillingPage.editAndUpdateNotes();
    });

    await test.step('Step 7: Delete the enrolled package', async () => {
        await enrollmentBillingPage.editAndDelete();
    });
});