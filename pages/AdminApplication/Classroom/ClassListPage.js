import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

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
        this.editInfoSessionsModal = page.locator('#div_Sessions_ListOfSessions:visible');
        this.editInfoCloseBtn = page.locator('#btn_SessionList_Close');
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

    /**
     * Verifies that Edit Info modal (#div_Sessions_ListOfSessions:visible) is opened and closes it using #btn_SessionList_Close.
     **/
    async verifyAndCloseEditInfoModal() {
        await test.step('Verify Edit Info modal is opened and close it', async () => {
            await this.waitForVisible(this.editInfoSessionsModal, 15000);
            await expect(this.editInfoSessionsModal).toBeVisible();
            await this.waitForVisible(this.editInfoCloseBtn, 5000);
            await this.click(this.editInfoCloseBtn);
            await this.waitForHidden(this.editInfoSessionsModal, 10000);
        });
    }
}
