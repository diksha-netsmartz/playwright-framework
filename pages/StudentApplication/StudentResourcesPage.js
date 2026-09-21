import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Resources section in the Student Portal (CSP).
 * Handles tab navigation under Resources (//ul[contains(@class,'nav-tabs')]//li//a)
 * and verifies each tab and its content container (e.g. #dvResourceInCar, #dvResourceParent).
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

        // Resource Tab Content Containers
        this.inCarResourceContent = page.locator('#dvResourceInCar');
        this.parentResourceContent = page.locator('#dvResourceParent');
        this.classResourceContent = page.locator('#dvResourceClass');
        this.roadTestResourceContent = page.locator('#dvResourceRoadTest');
        this.saddResourceContent = page.locator('#dvResourceSadd')
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
     * Clicks on a resources tab by its 0-based index and verifies its content container is visible.
     * @param {number} index - Index of the tab to click.
     * @returns {Promise<string>} The text name of the clicked tab.
     **/
    async clickResourcesTabByIndex(index) {
        const tab = this.tabs.nth(index);
        await this.waitForVisible(tab, 5000);
        const tabName = (await tab.textContent() || '').trim();
        const href = await tab.getAttribute('href');

        await test.step(`Click Resources tab: "${tabName}" and verify content`, async () => {
            await this.click(tab);
            await this.waitForLoaders();

            // Determine expected content container by href or tab name
            let container = null;
            if (href && href.startsWith('#') && href.length > 1) {
                container = this.page.locator(href);
            } else if (tabName.toLowerCase().includes('in-car')) {
                container = this.inCarResourceContent;
            } else if (tabName.toLowerCase().includes('parent')) {
                container = this.parentResourceContent;
            } else if (tabName.toLowerCase().includes('road')) {
                container = this.roadTestResourceContent;
            } else if (tabName.toLowerCase().includes('class')) {
                container = this.classResourceContent;
            }
            else if (tabName.toLowerCase().includes('sadd')) {
                container = this.saddResourceContent;
            }

            if (container) {
                await this.waitForVisible(container, 5000);
                await this.verifyVisible(container);
            }
        });

        return tabName;
    }

    /**
     * Iterates through each tab in resources, clicks it,
     * and verifies that its corresponding content container is displayed.
     * @returns {Promise<number>} Total count of tabs clicked and verified.
     **/
    async openEachTab() {
        return await test.step('Open each Resources tab and verify content container', async () => {
            const count = await this.getResourcesTabsCount();
            for (let i = 0; i < count; i++) {
                await this.clickResourcesTabByIndex(i);
            }

            return count;
        });
    }
}
