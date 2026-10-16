import {test} from '@playwright/test';
import LoginPage from '@pages/AdminApplication/AdminLoginPage';
import HomePage from '@pages/AdminApplication/AdminPortalHomePage';
import WebsiteFAQPage from '@pages/AdminApplication/Communication/WebsiteFAQPage';
import {credentials} from '@config/config';

/**
 * TC_138: C-Admin >> Communication >> Website content >> FAQ
 * Test Case Title: To Verify staff is able to add Category and Question
 * Precondition: Staff should be logged in to C-Admin
 *
 * Steps:
 *   Step 1: Login to C-Admin.
 *   Step 2, 3 & 4: Click on Communication -> Website Content -> Website FAQ.
 *   Step 5 to 10: Select Template, click Continue, click Edit, add Category name, and save.
 *   Step 11 to 14: Add Question, select Category, add Answer, and save.
 *   Step 15 to 18: Repeat the same FAQ setup flow for FAQ 2, FAQ 3, FAQ 4, and FAQ 5 tabs.
 *
 * Expected Result:
 *   Staff should be able to add Category and Question successfully in all FAQ tabs.
 **/
test('TC_138: C-Admin >> Communication >> Website content >> FAQ - To Verify staff is able to add Category and Question', {tag: ['@CAdmin', '@communication']}, async ({page}) => {
    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const websiteFAQPage = new WebsiteFAQPage(page);

    const timestamp = Date.now();
    const faqTabs = [
        {
            stepLabel: 'FAQ',
            tabName: undefined,
            categoryName: `FAQ_Category_1_${timestamp}`,
            question: `What is FAQ question 1 ${timestamp}?`,
            answer: `This is FAQ answer 1 for automated validation ${timestamp}.`
        },
        {
            stepLabel: 'FAQ 2',
            tabName: 'FAQ 2',
            categoryName: `FAQ_Category_2_${timestamp}`,
            question: `What is FAQ question 2 ${timestamp}?`,
            answer: `This is FAQ answer 2 for automated validation ${timestamp}.`
        },
        {
            stepLabel: 'FAQ 3',
            tabName: 'FAQ 3',
            categoryName: `FAQ_Category_3_${timestamp}`,
            question: `What is FAQ question 3 ${timestamp}?`,
            answer: `This is FAQ answer 3 for automated validation ${timestamp}.`
        },
        {
            stepLabel: 'FAQ 4',
            tabName: 'FAQ 4',
            categoryName: `FAQ_Category_4_${timestamp}`,
            question: `What is FAQ question 4 ${timestamp}?`,
            answer: `This is FAQ answer 4 for automated validation ${timestamp}.`
        },
        {
            stepLabel: 'FAQ 5',
            tabName: 'FAQ 5',
            categoryName: `FAQ_Category_5_${timestamp}`,
            question: `What is FAQ question 5 ${timestamp}?`,
            answer: `This is FAQ answer 5 for automated validation ${timestamp}.`
        }
    ];

    await test.step('Step 1: Login to C-Admin', async () => {
        await loginPage.navigateToLoginPage();
        await loginPage.login(credentials.cadmin.username, credentials.cadmin.password);
    });

    await test.step('Step 2, 3 & 4: Navigate to Communication -> Website Content -> Website FAQ', async () => {
        await homePage.navigateToWebsiteFAQ();
    });

    for (const faqTab of faqTabs) {
        await test.step(`Configure ${faqTab.stepLabel} tab with category, question, and answer`, async () => {
            await websiteFAQPage.configureFaqTab(faqTab);
        });
    }

    await test.step('Step 5: Navigate to Communication -> Website Content -> Website FAQ', async () => {
        await homePage.navigateToWebsiteFAQ();
    });

    for (const faqTab of faqTabs) {
        await test.step(`Verify ${faqTab.stepLabel} tab with category, question, and answer`, async () => {
            await websiteFAQPage.verifyFaqTab(faqTab, true);
        });
    }

    await test.step('Step 6: Navigate to Communication -> Website Content -> Website FAQ', async () => {
        await homePage.navigateToWebsiteFAQ();
    });

    for (const faqTab of faqTabs) {
        await test.step(`Delete ${faqTab.stepLabel} tab with category, question, and answer`, async () => {
            await websiteFAQPage.deleteFaqData(faqTab);
        });
    }
});