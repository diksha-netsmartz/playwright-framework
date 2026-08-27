import BasePage from '../../../utils/BasePage';
import { test } from '@playwright/test';

/**
 * Page Object representing the Classroom Class List Page in Admin Portal.
 * Handles viewing, filtering, and verifying the Classroom Class List.
 **/
export default class ClassListPage extends BasePage {

    /**
     * Initializes locators for the Class List Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        this.classroomHeading = page.getByRole('heading').getByText('Classroom', { exact: true });
        this.classList = page.locator('#classListtable');
    }

    /**
     * Verifies that the Class List page heading is displayed successfully.
     **/
    async verifyClassListIsDisplayed() {
        await test.step('Verify Class List page heading and table are displayed', async () => {
            await this.waitForLoaders();
            await this.verifyVisible(this.classroomHeading);
            await this.waitForVisible(this.classList);
            await this.verifyVisible(this.classList);
        });
    }
}
