const { expect } = require('@playwright/test');

class BasePage {

    constructor(page) {
        this.page = page;
    }

    async navigate(url) {
        await this.page.goto(url);
        await this.page.waitForLoadState("networkidle");
    }

    async click(locator) {
        await locator.click();
    }

    async fill(locator, value) {
        await locator.fill(value);
    }

    async getText(locator) {
        return await locator.textContent();
    }

    async waitForVisible(locator) {
        await locator.waitFor({
            state: 'visible'
        });
    }

    async isVisible(locator) {
        return await locator.isVisible();
    }

    async verifyText(locator, expectedText) {
        await expect(locator).toHaveText(expectedText);
    }

    async verifyVisible(locator) {
        await expect(locator).toBeVisible();
    }

    async verifyURL(expectedURL) {
        await expect(this.page).toHaveURL(expectedURL);
    }

    async getPageTitle() {
        return await this.page.title();
    }

    async verifyTitle(expectedTitle) {
        await expect(this.page).toHaveTitle(expectedTitle);
    }

    async takeScreenshot(fileName) {

        await this.page.screenshot({

            path: `screenshots/${fileName}.png`

        });

    }

}

module.exports = BasePage;