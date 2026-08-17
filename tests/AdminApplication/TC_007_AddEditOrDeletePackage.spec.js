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
test('TC_007: C-admin > Student > Enrollment - Verify User can Add, Edit and Delete Package', async ({ page }) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const enrollmentBillingPage = new EnrollmentBillingPage(page);

    // Step 1: Login to C-admin
    await loginPage.navigateToLoginPage();
    await loginPage.login(
        login.validUser.username,
        login.validUser.password
    );

    // Step 2: Click on Student Account on left Navigation -> Enrollment/Billing
    await homePage.openEnrollmentBilling();

    // Step 3: Click on Student not selected, search student with name, select and click Go
    await enrollmentBillingPage.selectStudent(studentData.student1.name);

    // Step 4: Click on Add New button on Left Side and add CR Package
    await enrollmentBillingPage.clickAddNew();
    await enrollmentBillingPage.addCRPackage();

    // Step 5: Click on Enroll Button
    await enrollmentBillingPage.enroll();

    // Step 6: Click on Edit button, select Edit, update notes, and click Update button
    await enrollmentBillingPage.editAndUpdateNotes();

    // Step 7: Click on Edit and click Delete
    await enrollmentBillingPage.editAndDelete();
});