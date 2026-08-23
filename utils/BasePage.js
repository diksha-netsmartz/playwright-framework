import { expect } from '@playwright/test';

/**
 * Base Page Object Model class providing common reusable browser actions,
 * waits, assertions, and utilities across all application pages.
 */
export default class BasePage {

    /**
     * Initializes BasePage with the Playwright Page instance.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     */
    constructor(page) {
        this.page = page;
    }

    /**
     * Navigates to a URL and waits for network idle state.
     * @param {string} url - Target URL to navigate to.
     */
    async navigate(url) {
        await this.page.goto(url);
        await this.page.waitForLoadState("networkidle");
    }

    /**
     * Reloads the current page.
     * @param {Object} [options={ waitUntil: 'networkidle' }] - Reload options.
     */
    async reload(options = { waitUntil: 'networkidle' }) {
        await this.page.reload(options);
    }

    /**
     * Clicks on an element.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {Object} [options={}] - Click options (e.g. { force: true, button: 'right' }).
     */
    async click(locator, options = {}) {
        await locator.click(options);
    }

    /**
     * Fills an input or textarea element with a text value.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {string} value - Text value to input.
     * @param {Object} [options={}] - Fill options.
     */
    async fill(locator, value, options = {}) {
        await locator.fill(value, options);
    }

    /**
     * Types text character by character with optional delay.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {string} text - Text to type.
     * @param {Object} [options={ delay: 100 }] - Sequencing options.
     */
    async pressSequentially(locator, text, options = { delay: 100 }) {
        await locator.pressSequentially(text, options);
    }

    /**
     * Clears an input field.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     */
    async clear(locator) {
        await locator.clear();
    }

    /**
     * Hovers over an element.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     */
    async hover(locator) {
        await locator.hover();
    }

    /**
     * Checks a checkbox or radio button.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {Object} [options={ force: true }] - Check options.
     */
    async check(locator, options = { force: true }) {
        await locator.check(options);
    }

    /**
     * Unchecks a checkbox.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {Object} [options={ force: true }] - Uncheck options.
     */
    async uncheck(locator, options = { force: true }) {
        await locator.uncheck(options);
    }

    /**
     * Selects option(s) in a dropdown select element.
     * @param {import('@playwright/test').Locator} locator - Target select element locator.
     * @param {string|string[]|Object} values - Value(s) or label(s) to select.
     * @param {Object} [options={}] - Selection options.
     */
    async selectOption(locator, values, options = {}) {
        return await locator.selectOption(values, options);
    }

    /**
     * Sets file(s) on a file input element for uploading.
     * @param {import('@playwright/test').Locator} locator - File input locator.
     * @param {string|string[]|Object} files - File path(s) to upload.
     */
    async setInputFiles(locator, files) {
        await locator.setInputFiles(files);
    }

    /**
     * Retrieves the text content of an element.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @returns {Promise<string>} Text content.
     */
    async getText(locator) {
        return await locator.textContent();
    }

    /**
     * Retrieves the value of an input or textarea element.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @returns {Promise<string>} Input value.
     */
    async getInputValue(locator) {
        return await locator.inputValue();
    }

    /**
     * Retrieves the value of an element's attribute.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {string} attributeName - Attribute name.
     * @returns {Promise<string|null>} Attribute value.
     */
    async getAttribute(locator, attributeName) {
        return await locator.getAttribute(attributeName);
    }

    /**
     * Waits for an element to become visible on the page with optional timeout.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {number|Object} [options={}] - Timeout in ms or options object.
     */
    async waitForVisible(locator, options = {}) {
        const opt = typeof options === 'number' ? { timeout: options } : options;
        await locator.waitFor({
            state: 'visible',
            ...opt
        });
    }

    /**
     * Waits for an element to become hidden / detached with optional timeout.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {number|Object} [options={}] - Timeout in ms or options object.
     */
    async waitForHidden(locator, options = {}) {
        const opt = typeof options === 'number' ? { timeout: options } : options;
        await locator.waitFor({
            state: 'hidden',
            ...opt
        });
    }

    /**
     * Checks if an element is currently visible.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @returns {Promise<boolean>} True if visible, false otherwise.
     */
    async isVisible(locator) {
        return await locator.isVisible();
    }

    /**
     * Waits for all background loader overlay elements (`.load-area`) on the page to hide.
     */
    async waitForLoaders() {
        await this.page.waitForFunction(() =>
            [...document.querySelectorAll('.load-area')].every(
                el => el.style.display === 'none'
            )
        );
    }

    /**
     * Asserts that an element is visible on the page, with optional timeout.
     * Can accept a number (ms) or an options object like `{ timeout: 10000 }`.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {number|Object} [options={}] - Timeout in ms or options object.
     */
    async verifyVisible(locator, options = {}) {
        const opt = typeof options === 'number' ? { timeout: options } : options;
        await expect(locator).toBeVisible(opt);
    }

    /**
     * Asserts that an element has exact matching text.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {string|RegExp} expectedText - Expected text.
     * @param {number|Object} [options={}] - Timeout in ms or options object.
     */
    async verifyText(locator, expectedText, options = {}) {
        const opt = typeof options === 'number' ? { timeout: options } : options;
        await expect(locator).toHaveText(expectedText, opt);
    }

    /**
     * Asserts that an element contains expected text substring.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {string|RegExp} expectedText - Expected substring.
     * @param {number|Object} [options={}] - Timeout in ms or options object.
     */
    async verifyContainsText(locator, expectedText, options = {}) {
        const opt = typeof options === 'number' ? { timeout: options } : options;
        await expect(locator).toContainText(expectedText, opt);
    }

    /**
     * Asserts that an element has the specified attribute and value.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {string} attribute - Attribute name.
     * @param {string|RegExp} expectedValue - Expected value.
     * @param {number|Object} [options={}] - Timeout in ms or options object.
     */
    async verifyAttribute(locator, attribute, expectedValue, options = {}) {
        const opt = typeof options === 'number' ? { timeout: options } : options;
        await expect(locator).toHaveAttribute(attribute, expectedValue, opt);
    }

    /**
     * Asserts that a checkbox or radio button is checked.
     * @param {import('@playwright/test').Locator} locator - Target checkbox locator.
     * @param {number|Object} [options={}] - Timeout in ms or options object.
     */
    async verifyChecked(locator, options = {}) {
        const opt = typeof options === 'number' ? { timeout: options } : options;
        await expect(locator).toBeChecked(opt);
    }

    /**
     * Asserts that the page URL matches the expected URL.
     * @param {string|RegExp} expectedURL - Expected page URL.
     */
    async verifyURL(expectedURL) {
        await expect(this.page).toHaveURL(expectedURL);
    }

    /**
     * Gets current page title.
     * @returns {Promise<string>} Page title.
     */
    async getPageTitle() {
        return await this.page.title();
    }

    /**
     * Asserts that the page title matches expected title.
     * @param {string|RegExp} expectedTitle - Expected title string or regex.
     */
    async verifyTitle(expectedTitle) {
        await expect(this.page).toHaveTitle(expectedTitle);
    }

    /**
     * Captures and saves a full screenshot.
     * @param {string} fileName - Base filename without extension.
     */
    async takeScreenshot(fileName) {
        await this.page.screenshot({
            path: `screenshots/${fileName}.png`
        });
    }

}