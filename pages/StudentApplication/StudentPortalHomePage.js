import BasePage from '../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Student Portal Home Page.
 * Handles student document uploads, navigation to marketplace enrollment, and loading state management.
 **/
export default class StudentPortalHomePage extends BasePage {

    /**
     * Initializes locators for the Student Portal Home Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.fileInput = page.locator('input[type="file"]').first();
        this.uploadBtn = page.locator("xpath=//button[text()='UPLOAD' and @id='uploadimage']");
        this.uploadFilesWidget = page.locator("//div[contains(text(),'Upload Files')]");
        this.chooseFileBtn = page.locator("#uploadimageChoose").first();
        this.enrollNavLink = page.locator('#Marketplace_li');
        this.myAccountNavLink = page.getByRole('link', { name: ' My Account ' });
        this.profileNavLink = page.locator("xpath=//li[contains(@id,'Profile')]");
    }

    /**
     * Navigates to the student profile page by clicking 'My Account' and then 'Profile' in the left navigation.
    **/
    async navigateToProfile() {
        await test.step('Navigate to Student Profile (My Account -> Profile)', async () => {
            if (!await this.isVisible(this.profileNavLink)) {
                await this.click(this.myAccountNavLink);
            }
            await this.click(this.profileNavLink);
            await this.waitForLoaders();
        });
    }

    /**
     * Uploads a document/file by setting the file input, clicking upload, and waiting for loaders to disappear.
     * @param {string} filePath - Absolute or relative path to the file to upload.
    **/
    async uploadFile(filePath) {
        await test.step(`Upload student file: ${filePath}`, async () => {
            await this.waitForVisible(this.uploadFilesWidget);
            await this.verifyVisible(this.uploadFilesWidget, 5000);
            await this.uploadFilesWidget.scrollIntoViewIfNeeded();
            await this.setInputFiles(this.fileInput, filePath);
            await this.click(this.uploadBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('networkidle');
        });
    }

    /**
     * Verifies that the file upload success message is visible and the choose file button is displayed.
    **/
    async verifyUploadSuccess() {
        await test.step('Verify file upload success message', async () => {
            await this.waitForLoaders();
            await this.isVisible(this.chooseFileBtn);
            await this.verifyVisible(this.page.getByText('Success! Upload has been completed.', { exact: true }).first(), 20000);
        });
    }

    /**
     * Navigates to the student marketplace enrollment page by clicking the Enroll nav link.
    **/
    async navigateToEnroll() {
        await test.step('Navigate to Enrollment page', async () => {
            await this.click(this.enrollNavLink);
        });
    }
}

