import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Website Content - Widget page in C-Admin
 * (Communication > Website Content > Widget).
 * 
 * Provides unified, reusable methods to navigate tabs, fill rich text content,
 * fill internal notes, submit, and verify persistence using the active tab's visible elements.
 **/
export default class WebsiteContentWidgetPage extends BasePage {

    /**
     * Initializes locators for Website Content Widget page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Active Tab Locators
        this.editorBody = page.frameLocator('.tab-pane:visible iframe').locator('body');
        this.internalNoteInput = page.locator('textarea:visible');
        this.submitButton = page.locator('.tab-pane:visible button[type="submit"]');

        // Success Alert & Dismiss Locators
        this.successMsg = page.getByText('Success! Content was successfully saved.').last();
        this.closeSuccessBtn = page.locator('#alertSuccess2').getByText('Close').last().or(page.locator('#alertSuccess2 button.close').last());
    }

    /**
     * Navigates to a specific tab by name.
     * @param {string} tabName - Name of the tab (e.g. 'Home Page', 'Content 2', 'Content 3', 'Content 4', 'Content 5').
     **/
    async navigateToTab(tabName) {
        await test.step(`Click on ${tabName} tab`, async () => {
            await this.waitForLoaders();
            const tabLocator = this.page.locator(`//strong[normalize-space()='${tabName}']`);
            await this.waitForVisible(tabLocator);
            await this.click(tabLocator);
            await this.waitForLoaders();
            await this.waitForVisible(this.editorBody);
        });
    }

    /**
     * Fills content into the currently visible rich text editor.
     * @param {string} content - Rich text editor content.
     **/
    async fillContent(content) {
        await test.step(`Fill rich text editor content`, async () => {
            const editor = this.editorBody;
            await this.waitForVisible(editor);
            await this.click(editor);
            await this.fill(editor, content);
        });
    }

    /**
     * Fills internal note in the currently visible tab.
     * @param {string} note - Internal note text.
     **/
    async fillInternalNote(note) {
        await test.step(`Fill internal note`, async () => {
            const noteInput = this.internalNoteInput;
            await this.waitForVisible(noteInput);
            await this.click(noteInput);
            await this.fill(noteInput, note);
        });
    }

    /**
     * Submits the currently visible tab and verifies success notification.
     **/
    async saveAndVerifySuccess() {
        await test.step(`Click Submit button and verify success notification`, async () => {
            await this.waitForVisible(this.submitButton);
            await this.click(this.submitButton);
            await this.waitForVisible(this.successMsg);
            await this.verifyVisible(this.successMsg);
            await this.click(this.closeSuccessBtn);
            await this.waitForHidden(this.closeSuccessBtn);
        });
    }

    /**
     * Verifies that the currently visible rich text editor contains expected text.
     * @param {string} expectedContent - Expected text in editor.
     **/
    async verifyContent(expectedContent) {
        await test.step(`Verify active editor content contains: "${expectedContent}"`, async () => {
            const editor = this.editorBody;
            await this.waitForVisible(editor);
            await expect(editor).toContainText(expectedContent);
        });
    }

    /**
     * Verifies that the currently visible internal note textarea has expected text value.
     * @param {string} expectedNote - Expected internal note.
     **/
    async verifyInternalNote(expectedNote) {
        await test.step(`Verify active internal note has value: "${expectedNote}"`, async () => {
            const noteInput = this.internalNoteInput;
            await this.waitForVisible(noteInput);
            await expect(noteInput).toHaveValue(expectedNote);
        });
    }
}
