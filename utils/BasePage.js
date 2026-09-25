import { expect, test } from '@playwright/test';

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
        await this.page.waitForLoadState("load", { timeout: 10000 });
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
     * Clicks on an element, awaits the document navigation response, verifies the HTTP status code,
     * and waits for page loaders and load state to complete.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {Object} [options] - Navigation options.
     * @param {number} [options.expectedStatus=200] - Expected HTTP status code.
     * @param {number} [options.responseTimeout=5000] - Timeout waiting for navigation response in ms.
     * @param {number} [options.loadTimeout=3000] - Timeout waiting for load state in ms.
     * @returns {Promise<import('@playwright/test').Response|null>} The navigation response or null.
     */
    async clickAndVerifyNavigation(locator, options = {}) {
        const expectedStatus = options.expectedStatus ?? 200;
        const responseTimeout = options.responseTimeout ?? 5000;
        const loadTimeout = options.loadTimeout ?? 3000;

        const responsePromise = this.page.waitForResponse(
            (resp) => resp.request().isNavigationRequest() && !resp.status().toString().startsWith('3'),
            { timeout: responseTimeout }
        ).catch(() => null);

        await this.click(locator);
        const response = await responsePromise;

        if (response) {
            expect(response.status()).toBe(expectedStatus);
        }

        await this.waitForLoaders();
        await this.page.waitForLoadState('load', { timeout: loadTimeout }).catch(() => { });
        await this.waitForLoaders();

        return response;
    }

    /**
     * Verifies the document navigation response status of a popup/newly-opened page.
     * @param {import('@playwright/test').Page} popupPage - The newly opened page/tab.
     * @param {Object} [options] - Options.
     * @param {number} [options.expectedStatus=200] - Expected HTTP status code.
     * @param {number} [options.responseTimeout=5000] - Timeout waiting for navigation response in ms.
     * @returns {Promise<import('@playwright/test').Response|null>}
     */
    async verifyPopupNavigation(popupPage, options = {}) {
        const expectedStatus = options.expectedStatus ?? 200;
        const responseTimeout = options.responseTimeout ?? 5000;

        const response = await popupPage.waitForResponse(
            (resp) => resp.request().isNavigationRequest() && !resp.status().toString().startsWith('3'),
            { timeout: responseTimeout }
        ).catch(() => null);

        if (response) {
            expect(response.status()).toBe(expectedStatus);
        }

        return response;
    }

    /**
     * Performs a JavaScript DOM click directly on an element in browser context.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     */
    async jsClick(locator) {
        await locator.evaluate((/** @type {HTMLElement} */ el) => el.click());
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
     * Fills an input only if a value is provided and the element is visible on page.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {string} [value] - Text value to fill.
     * @param {number} [timeout=1000] - Visibility timeout in ms.
     **/
    async fillIfAvailable(locator, value, timeout = 1000) {
        if (value && await this.isVisible(locator, { timeout }).catch(() => false)) {
            await this.fill(locator, value);
        }
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
     * Asserts that an element's attribute matches the expected value.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {string} attributeName - Attribute name.
     * @param {string|RegExp} expectedValue - Expected attribute value.
     */
    async matchAttributeValue(locator, attributeName, expectedValue) {
        await expect(locator).toHaveAttribute(attributeName, expectedValue);
    }

    /**
     * Formats a 10-digit number or phone string into application mask format: (XXX) XXX-XXXX.
     * @param {string} phone - Raw digits or phone string.
     * @returns {string} Formatted phone string, e.g. "(555) 123-4567".
     */
    formatPhoneNumber(phone) {
        if (!phone) return phone;
        const digits = ('' + phone).replace(/\D/g, '');
        if (digits.length === 10) {
            return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
        }
        return phone;
    }

    /**
     * Formats an 8-digit date string (MMDDYYYY) into MM/DD/YYYY format.
     * @param {string} date - Raw 8-digit date string or already formatted date.
     * @returns {string} Formatted date string, e.g. "11/09/2027".
     */
    formatDateWithSlashes(date) {
        if (!date) return date;
        const str = '' + date;
        if (str.includes('/')) return str;
        const digits = str.replace(/\D/g, '');
        if (digits.length === 8) {
            return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
        }
        return date;
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
     * Checks if an element is visible, optionally waiting up to a specified timeout.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {number|{ timeout?: number }} [options] - Optional timeout in milliseconds or options object.
     * @returns {Promise<boolean>} True if visible, false otherwise.
     */
    async isVisible(locator, options) {
        const timeout = typeof options === 'number' ? options : options?.timeout;
        if (typeof timeout === 'number' && timeout > 0) {
            const startTime = Date.now();
            while (Date.now() - startTime < timeout) {
                if (await locator.isVisible()) return true;
                await this.page.waitForTimeout(250);
            }
            return false;
        }
        return await locator.isVisible();
    }


    /**
     * Checks if a field element is visible and not disabled / frozen.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @returns {Promise<boolean>} True if visible and enabled, false otherwise.
     **/
    async isVisibleAndEnabled(locator) {
        if (!await this.isVisible(locator).catch(() => false)) return false;
        if (await locator.isDisabled().catch(() => false)) return false;
        const disabled = await locator.getAttribute('disabled').catch(() => null);
        if (disabled !== null && disabled !== 'false') return false;
        const attrEnabled = await locator.getAttribute('attrenabled').catch(() => null);
        if (attrEnabled && attrEnabled.toLowerCase() === 'false') return false;
        const classAttr = await locator.getAttribute('class').catch(() => '') || '';
        if (classAttr.includes('disabled') || classAttr.includes('freezeClass')) return false;
        return true;
    }

    /**
     * Checks if a field element has an input mask applied (e.g. contains 'mask' in class or data-mask).
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @returns {Promise<boolean>} True if masked, false otherwise.
     **/
    async isMasked(locator) {
        const classAttr = await locator.getAttribute('class').catch(() => '') || '';
        const dataMask = await locator.getAttribute('data-mask').catch(() => null);
        return /mask/i.test(classAttr) || dataMask !== null;
    }

    /**
   * Waits for all background loader overlay elements on the page to hide.
   * @param {number} [timeout=90000] - Optional timeout in milliseconds.
   */
    async waitForLoaders(timeout = 90000) {
        // Brief settling delay to allow newly triggered loaders to attach to the DOM
        await this.page.waitForTimeout(150);

        const loaderSelector = '.load-area, #loading, .blockUI, .blockOverlay, .k-loading-mask, .loading-message';

        await this.page.waitForFunction((selector) => {
            const loaders = Array.from(document.querySelectorAll(selector));
            if (loaders.length === 0) return true;

            return loaders.every(node => {
                const el = /** @type {HTMLElement} */ (node);
                const style = window.getComputedStyle(el);

                if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                    return true;
                }

                // Check geometry: if element has no dimensions, it's not visible
                const rect = el.getBoundingClientRect();
                return rect.width === 0 && rect.height === 0;
            });
        }, loaderSelector, { timeout }).catch(() => { });
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
     * Asserts that an element is not visible on the page, with optional timeout.
     * @param {import('@playwright/test').Locator} locator - Target element locator.
     * @param {number|Object} [options={}] - Timeout in ms or options object.
     */
    async verifyNotVisible(locator, options = {}) {
        const opt = typeof options === 'number' ? { timeout: options } : options;
        await expect(locator).not.toBeVisible(opt);
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
     * Asserts that the current page URL contains the expected text substring.
     * @param {string} text - Expected text in page URL.
     */
    async verifyURLContainsText(text) {
        await expect(this.page.url()).toContain(text);
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

    /**
     * Simulates drawing a signature stroke on an HTML5 canvas element using mouse coordinates.
     * @param {import('@playwright/test').Locator} canvas - Locator for the signature canvas element.
     **/
    async drawSignature(canvas) {
        await canvas.scrollIntoViewIfNeeded();
        const box = await canvas.boundingBox();
        if (!box) return;

        const startX = box.x + box.width * 0.2;
        const startY = box.y + box.height * 0.5;
        const endX = box.x + box.width * 0.8;
        const endY = box.y + box.height * 0.5;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(endX, endY, { steps: 10 });
        await this.page.mouse.up();
    }

    /**
 * Verifies that an HTML5 signature canvas has a drawn signature (is not blank).
 * @param {import('@playwright/test').Locator} canvas - Locator for the signature canvas element.
 * @param {boolean} isVisible - Whether signature is expected to be visible.
 **/
    async verifySignatureVisibility(canvas, isVisible) {
        await this.waitForVisible(canvas);
        const isSigned = await canvas.evaluate((/** @type {HTMLCanvasElement} */ el) => {
            const ctx = el.getContext('2d');
            if (!ctx) return false;
            const pixelData = ctx.getImageData(0, 0, el.width, el.height).data;
            return pixelData.some(channel => channel !== 0);
        });
        expect(isSigned).toBe(isVisible);
    }

    /**
     * Captures a screenshot, attaches it to the test report, and skips the remaining test execution.
     * @param {string} reason - The reason for skipping the test.
     * @param {string} [attachmentName='Skipped_Test_Screenshot'] - Attachment name for the test report.
     */
    async skipWithScreenshot(reason, attachmentName = 'Skipped_Test_Screenshot') {
        try {
            const screenshot = await this.page.screenshot();
            await test.info().attach(attachmentName, {
                body: screenshot,
                contentType: 'image/png'
            });
        } catch (error) {
            console.warn(`[BasePage] Failed to capture/attach screenshot before skipping: ${error.message}`);
        }
        test.skip(true, reason);
    }

}