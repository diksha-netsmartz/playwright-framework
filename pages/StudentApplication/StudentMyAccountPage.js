import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the My Account section in the Student Portal (CSP).
 * Handles tab navigation under My Account (//ul[@id='accountTab']//li//a)
 * and verifies each tab and its page title.
 **/
export default class StudentMyAccountPage extends BasePage {

    /**
     * Initializes locators for the Student My Account Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Locators for account tabs
        this.accountTabs = page.locator("//ul[@id='accountTab']//li//a");
        this.accountTabList = page.locator('#accountTab');
        this.pageHeading = page.locator('#selectedTab');
    }

    /**
     * Retrieves the total count of tabs under My Account (//ul[@id='accountTab']//li//a).
     * @returns {Promise<number>} Number of tabs found.
     **/
    async getAccountTabsCount() {
        await this.waitForVisible(this.accountTabs.first(), 5000);
        return await this.accountTabs.count();
    }

    /**
     * Clicks on an account tab by its 0-based index.
     * @param {number} index - Index of the tab to click.
     * @returns {Promise<string>} The text name of the clicked tab.
     **/
    async clickAccountTabByIndex(index) {
        const tab = this.accountTabs.nth(index);
        await this.waitForVisible(tab, 1000);
        const tabName = (await tab.textContent() || '').trim();

        await test.step(`Click My Account tab : "${tabName}"`, async () => {
            await this.click(tab);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 3000 }).catch(() => { });
            await this.waitForLoaders();
        });

        return tabName;
    }


    /**
     * Verifies that the page title matches the expected title for a tab.
     * @param {string} tabName - Name of the tab.
     **/
    async verifyTabTitle(tabName) {
        await test.step(`Verify page title for tab "${tabName}"`, async () => {
            await this.verifyText(this.pageHeading, tabName);
        });
    }

    /**
     * Iterates through each tab under //ul[@id='accountTab']//li//a, clicks it,
     * and verifies the corresponding page title.
     * @returns {Promise<number>} Total count of tabs clicked and verified.
     **/
    async openEachTabAndVerifyTitle() {
        return await test.step('Open each My Account tab and verify title', async () => {
            const count = await this.getAccountTabsCount();
            for (let i = 0; i < count; i++) {
                const tabName = await this.clickAccountTabByIndex(i);
                await this.verifyTabTitle(tabName);
            }

            return count;
        });
    }
}
