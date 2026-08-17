const BasePage = require('../../utils/BasePage');
const { expect } = require('@playwright/test');

/**
 * Page Object representing the Student Enrollment and Receipt Page.
 * Handles package selection, Pay Later enrollment, success verification, and popup receipt handling.
  **/
class StudentEnrollPage extends BasePage {

    /**
     * Initializes locators for the Student Enrollment Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.payLaterBtn = page.getByRole('button', { name: 'Pay Later' });
        this.printReceiptLink = page.getByRole('link', { name: 'Print Receipt' }).last();
        this.getPackageSelectBtn = page.locator("xpath=(//button[contains(@class,'PriceTax')])[1]")
    }

    /**
     * Selects the available package from the pricing list.
    **/
    async selectPackage() {
        await this.click(this.getPackageSelectBtn);
    }

    /**
     * Clicks the 'Pay Later' button to proceed with enrollment without immediate payment.
    **/
    async clickPayLater() {
        await this.click(this.payLaterBtn);
    }

    /**
     * Verifies that the enrollment success message is visible on the page.
    **/
    async verifyEnrollmentSuccess() {
        await this.verifyVisible(
            this.page.getByText(
                'You have been enrolled successfully.',
                { exact: true }
            ).first()
        );
    }

    /**
     * Clicks the Print Receipt link, waits for the new popup browser tab to open, and returns the popup page object.
     * @returns {Promise<import('@playwright/test').Page>} The popup Page instance representing the receipt page.
      **/
    async clickPrintReceipt() {
        const popupPromise = this.page.waitForEvent('popup');
        await this.click(this.printReceiptLink);
        const receiptPage = await popupPromise;
        await receiptPage.waitForLoadState();
        return receiptPage;
    }

    /**
     * Verifies that the receipt popup page contains the 'Enrollment COMPLETED' heading text.
     * @param {import('@playwright/test').Page} receiptPage - The receipt popup Page instance.
    **/
    async verifyReceiptPage(receiptPage) {

        await expect(receiptPage.getByRole('heading')).toContainText('Enrollment COMPLETED');
    }

}

module.exports = StudentEnrollPage;
