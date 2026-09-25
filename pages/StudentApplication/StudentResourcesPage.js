import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Resources section in the Student Portal (CSP).
 * Handles tab navigation under Resources (//ul[contains(@class,'nav-tabs')]//li//a)
 * and verifies each tab responds with HTTP status 200.
 **/
export default class StudentResourcesPage extends BasePage {

    /**
     * Initializes locators for the Student Resources Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Locators for resources tabs
        this.tabs = page.locator("//ul[contains(@class,'nav-tabs')]//li//a");
    }

    /**
     * Retrieves the total count of tabs under Resources.
     * @returns {Promise<number>} Number of tabs found.
     **/
    async getResourcesTabsCount() {
        await this.waitForVisible(this.tabs.first(), 5000);
        return await this.tabs.count();
    }

    /**
     * Clicks on a resources tab by its 0-based index and verifies that the tab returns HTTP status 200.
     * @param {number} index - Index of the tab to click.
     * @returns {Promise<string>} The text name of the clicked tab.
     **/
    async clickResourcesTabByIndex(index) {
        const tab = this.tabs.nth(index);
        await this.waitForVisible(tab, 5000);
        const tabName = (await tab.textContent() || '').trim();

        await test.step(`Click Resources tab: "${tabName}" and verify response 200`, async () => {
            const responsePromise = this.page.waitForResponse(
                (response) => response.url().toLowerCase().includes('/resources/'),
                { timeout: 10000 }
            );

            await this.click(tab);
            const response = await responsePromise;
            expect(response.status()).toBe(200);
            await this.waitForLoaders();
        });

        return tabName;
    }

    /**
     * Iterates through each tab in resources, clicks it,
     * and verifies that each tab responds with HTTP status 200.
     * @returns {Promise<number>} Total count of tabs clicked and verified.
     **/
    async openEachTab() {
        return await test.step('Open each Resources tab and verify response 200', async () => {
            const count = await this.getResourcesTabsCount();
            for (let i = 0; i < count; i++) {
                await this.clickResourcesTabByIndex(i);
            }

            return count;
        });
    }
}
