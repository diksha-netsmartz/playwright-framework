import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Student Resources page in C-Admin (Communication > Student Resources).
 * Handles updating and verifying rich text resource content across tabs:
 * - Classroom / Class
 * - In-Car
 * - Road Test
 * - Parents
 **/
export default class StudentResourcesPage extends BasePage {

    /**
     * Initializes locators for Student Resources page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Tab Navigation Locators
        this.classTab = page.locator("//ul[@id='emailtab']//a[normalize-space()='Class']");
        this.inCarTab = page.locator("//ul[@id='emailtab']//a[normalize-space()='In-Car']");
        this.roadTestTab = page.locator("//ul[@id='emailtab']//a[normalize-space()='Road Test']");
        this.parentsTab = page.locator("//ul[@id='emailtab']//a[normalize-space()='Parents']");

        // Common Buttons & Messages
        this.saveButton = page.locator("button[onclick='saveResourceContent();']");
        this.successMsg = page.getByText('Success! Content was successfully saved.').last();
        this.closeSuccessBtn = page.locator('#dvSuccessMg').getByText('Close').last();
    }

    /**
     * Returns locator for the editable body in the currently visible / active tab rich text editor iframe.
     * Uses .tab-pane.active iframe to dynamically scope to whichever tab is currently active and visible.
     * @returns {import('@playwright/test').Locator}
     **/
    getEditorBody() {
        return this.page.frameLocator('.tab-pane.active iframe, iframe:visible').locator('body');
    }

    /**
     * Getter for the visible editor body locator.
     * @returns {import('@playwright/test').Locator}
     **/
    get editorBody() {
        return this.getEditorBody();
    }

    /**
     * Clicks on the Classroom / Class tab.
     **/
    async navigateToClassTab() {
        await test.step('Click on Class tab', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.classTab);
            await this.click(this.classTab);
            await this.waitForLoaders();
            await this.waitForVisible(this.editorBody);
        });
    }

    /**
     * Clicks on the In-Car tab.
     **/
    async navigateToInCarTab() {
        await test.step('Click on In-Car tab', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.inCarTab);
            await this.click(this.inCarTab);
            await this.waitForLoaders();
            await this.waitForVisible(this.editorBody);
        });
    }

    /**
     * Clicks on the Road Test tab.
     **/
    async navigateToRoadTestTab() {
        await test.step('Click on Road Test tab', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.roadTestTab);
            await this.click(this.roadTestTab);
            await this.waitForLoaders();
            await this.waitForVisible(this.editorBody);
        });
    }

    /**
     * Clicks on the Parents tab.
     **/
    async navigateToParentsTab() {
        await test.step('Click on Parents tab', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.parentsTab);
            await this.click(this.parentsTab);
            await this.waitForLoaders();
            await this.waitForVisible(this.editorBody);
        });
    }

    /**
     * Fills content into the currently visible rich text editor.
     * @param {string} text - Content to fill.
     **/
    async fillEditorContent(text) {
        await test.step(`Fill active editor with text: "${text}"`, async () => {
            const editor = this.editorBody;
            await this.waitForVisible(editor);
            await this.click(editor);
            await this.fill(editor, text);
        });
    }

    /**
     * Clicks Save button and verifies success notification.
     **/
    async saveAndVerifySuccess() {
        await test.step('Click Save and verify success notification', async () => {
            await this.waitForVisible(this.saveButton);
            await this.click(this.saveButton);
            await this.waitForVisible(this.successMsg);
            await this.verifyVisible(this.successMsg);
            // if (await this.isVisible(this.closeSuccessBtn, { timeout: 1000 }).catch(() => false)) {
            //     await this.click(this.closeSuccessBtn);
            // }
        });
    }

    /**
     * Verifies that the currently visible editor contains the expected text.
     * @param {string} expectedText - Text expected in the active editor.
     **/
    async verifyEditorContent(expectedText) {
        await test.step(`Verify active editor content contains: "${expectedText}"`, async () => {
            const editor = this.editorBody;
            await this.waitForVisible(editor);
            await expect(editor).toContainText(expectedText);
        });
    }
}
