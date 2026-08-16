const BasePage = require('../../utils/BasePage');
const { expect } = require('@playwright/test');

/**
 * Page Object representing the Student Portal Home Page.
 * Handles student document uploads, navigation to marketplace enrollment, and loading state management.
  **/
class StudentPortalHomePage extends BasePage {

    /**
     * Initializes locators for the Student Portal Home Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.fileInput = page.locator('input[type="file"]').first();
        this.uploadBtn = page.locator('#uploadimage');
        this.chooseFileBtn = page.locator("#uploadimageChoose").first()
        this.enrollNavLink = page.locator("//a[@href='/CentralizeSP/StudentMP/MarketPlace']");

    }

    /**
     * Uploads a document/file by setting the file input, clicking upload, and waiting for loaders to disappear.
     * @param {string} filePath - Absolute or relative path to the file to upload.
    **/
    async uploadFile(filePath) {
        await this.fileInput.setInputFiles(filePath);
        await this.click(this.uploadBtn);
        await this.waitForLoaders();
    }

    /**
     * Verifies that the file upload success message is visible and the choose file button is displayed.
    **/
    async verifyUploadSuccess() {
        await this.isVisible(this.chooseFileBtn);
        await expect(this.page.getByText('Success! Upload has been completed.', { exact: true }).first()).toBeVisible();
    }

    /**
     * Navigates to the student marketplace enrollment page by clicking the Enroll nav link.
    **/
    async navigateToEnroll() {
        await this.click(this.enrollNavLink);
    }

    /**
     * Waits for all background loader overlay elements (`.load-area`) on the page to hide.
    **/
    async waitForLoaders() {
        await this.page.waitForFunction(() =>
            [...document.querySelectorAll('.load-area')].every(
                el => el.style.display === 'none'
            )
        );
    }

}

module.exports = StudentPortalHomePage;
