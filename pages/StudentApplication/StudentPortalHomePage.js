const BasePage = require('../../utils/BasePage');
const {expect} = require('@playwright/test');

class StudentPortalHomePage extends BasePage {

    constructor(page) {
        super(page);

        this.fileInput = page.locator('input[type="file"]').first();
        this.uploadBtn = page.locator('#uploadimage');
        this.chooseFileBtn = page.locator("#uploadimageChoose").first()
        this.enrollNavLink = page.locator("//a[@href='/CentralizeSP/StudentMP/MarketPlace']");

    }

    async uploadFile(filePath) {
        await this.fileInput.setInputFiles(filePath);
        await this.click(this.uploadBtn);
        await this.waitForLoaders();
    }

    async verifyUploadSuccess() {
        await this.isVisible(this.chooseFileBtn);
        await expect(this.page.getByText('Success! Upload has been completed.', {exact: true}).first()).toBeVisible();
    }

    async navigateToEnroll() {
        await this.click(this.enrollNavLink);
    }


    async waitForLoaders() {
        await this.page.waitForFunction(() =>
            [...document.querySelectorAll('.load-area')].every(
                el => el.style.display === 'none'
            )
        );
    }

}

module.exports = StudentPortalHomePage;
