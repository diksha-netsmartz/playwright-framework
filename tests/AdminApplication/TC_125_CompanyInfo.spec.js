import { test } from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import CompanyInfoPage from '@pages/AdminApplication/Configuration/CompanyInfoPage';
import TestDataGenerator from '@utils/TestDataGenerator';
import { credentials } from '@config/config';

/**
 * TC_125: C-Admin >> Configuration >> Company info
 * Test Case Title: TO verify staff is able to update company info
 * Precondition: Staff should login to C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2: Click on Configuration -> Company info.
 *   Step 3: Update company info fields with runtime generated data and click Save.
 *   Step 4: Confirm save on confirmation dialog and verify success message.
 *   Step 5: Navigate again to Company Info.
 *   Step 6: Verify data is updated with runtime generated values.
 *
 * Expected Result:
 *   Staff should be able to update company info and verified data should persist.
 **/
test('TC_125: C-Admin >> Configuration >> Company info - TO verify staff is able to update company info', { tag: ['@CAdmin', '@configuration'] }, async ({ page }) => {
  const loginPage = new LoginPage(page);
  const homePage = new HomePage(page);
  const companyInfoPage = new CompanyInfoPage(page);

  // Generate unique runtime data for each field
  const runtimeCompanyData = {
    licenseNumber: TestDataGenerator.generateRandomThreeDigitNumber(),
    ownerName: TestDataGenerator.generateRandomFullName('Owner'),
    address: `${Math.floor(100 + Math.random() * 900)} Test Automation Rd`,
    city: `City${Math.floor(100 + Math.random() * 900)}`,
    zipCode: TestDataGenerator.generateRandomZipCode(5),
    schoolCode: `${Math.floor(1000000 + Math.random() * 9000000)}`,
    email: `company${Date.now()}@test.com`,
    phone: `${Math.floor(2000000000 + Math.random() * 8000000000)}`,
    fax: `${Math.floor(2000000000 + Math.random() * 8000000000)}`,
    other: `${Math.floor(2000000000 + Math.random() * 8000000000)}`,
    website: `https://company${Date.now()}.com`,
    notes: `Automation Notes ${Date.now()}`
  };

  await test.step('Step 1: Login to C-Admin', async () => {
    await loginPage.navigateToLoginPage();
    await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
  });

  await test.step('Step 2: Navigate to Configuration -> Company info', async () => {
    await homePage.navigateToCompanyInfo();
  });

  await test.step('Step 3 & 4: Update company info with runtime data, click Save and confirm', async () => {
    await companyInfoPage.updateCompanyInfo(runtimeCompanyData);
  });

  await test.step('Step 5: Navigate again to Company info', async () => {
    await homePage.navigateToCompanyInfo();
  });

  await test.step('Step 6: Verify company info data is updated with runtime values', async () => {
    await companyInfoPage.verifyCompanyInfo(runtimeCompanyData);
  });
});