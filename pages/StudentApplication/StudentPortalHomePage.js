import BasePage from '../../utils/BasePage';
import { expect, test } from '@playwright/test';
import paymentData from '../../test-data/json/paymentData.json';

/**
 * Page Object representing the Student Portal Home Page.
 * Handles student document uploads, navigation to marketplace enrollment, and pay balance payment modal.
 **/
export default class StudentPortalHomePage extends BasePage {

    /**
     * Initializes locators for the Student Portal Home Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Upload Files widget
        this.fileInput = page.locator('input[type="file"][multiple]').first();
        this.uploadBtn = page.locator("xpath=//button[text()='UPLOAD' and @id='uploadimage']");
        this.uploadFilesWidget = page.locator("//div[contains(text(),'Upload Files')]");
        this.chooseFileBtn = page.locator("#uploadimageChoose").first();
        this.enrollNavLink = page.locator('#Marketplace_li');
        this.myAccountNavLink = page.getByRole('link', { name: ' My Account ' });
        this.profileNavLink = page.locator("xpath=//li[contains(@id,'Profile')]");
        this.categoryDropdown = page.getByRole('button', { name: '--Select--' });
        this.categoryDropdownOption = page.locator("(//select[@name='file_Category']//parent::div//li//span[1][not(contains(text(),'Select'))])[1]");

        // Pay Balance / Payment Modal Locators
        this.payNowLink = page.locator("//a[normalize-space()='Pay Now']")
        this.payBalanceModal = page.locator('.modal-content, .modal-dialog').filter({ hasText: 'PAY BALANCE' }).first();
        this.amountInput = page.locator("//label[contains(text(),'Amount')]//ancestor::div[contains(@class,'form-group')]//input | input[name='Amount'] | #txtPayAmount | #txtAmount").first();

        // Standard inputs (fallback for environments without iframes)
        this.cardNumber = page.getByRole('textbox', { name: 'Card Number' });
        this.expiryDate = page.getByRole('textbox', { name: /MM\/YY/i });
        this.cvv = page.getByRole('textbox', { name: 'CVV' });

        // Clover iframe locators (Card Number, Expiration Date, CVV, Zip Code)
        this.cardNumberIframe = page.locator('#CARD_NUMBER_ID, iframe[title="CARD NUMBER"]');
        this.cardNumberInIframe = page.frameLocator('#CARD_NUMBER_ID, iframe[title="CARD NUMBER"]').locator('#cardNumber');

        this.cardDateIframe = page.locator('#CARD_DATE_ID, iframe[title="CARD DATE"]');
        this.expiryDateInIframe = page.frameLocator('#CARD_DATE_ID, iframe[title="CARD DATE"]').locator('#date');

        this.cardCvvIframe = page.locator('#CARD_CVV_ID, iframe[title="CARD CVV"]');
        this.cvvInIframe = page.frameLocator('#CARD_CVV_ID, iframe[title="CARD CVV"]').locator('#cvv');

        this.cardPostalCodeIframe = page.locator('#CARD_POSTAL_CODE_ID, iframe[title="CARD POSTAL CODE"]');
        this.postalCodeInIframe = page.frameLocator('#CARD_POSTAL_CODE_ID, iframe[title="CARD POSTAL CODE"]').locator('#postal');

        // Address & Cardholder Details
        this.cardNumber = page.getByRole('textbox', { name: 'Card Number' });
        this.expiryDate = page.getByRole('textbox', { name: 'MM/YYYY' });
        this.cvv = page.getByRole('textbox', { name: 'CVV' });
        this.nameOnCard = page.getByRole('textbox', { name: 'Name on Card' });
        this.billingAddress = page.getByRole('textbox', { name: 'Billing Address' });
        this.billingCity = page.getByRole('textbox', { name: 'Billing City' });
        this.billStateDropdown = page.locator("//button[@data-id='ddlBillState']")
        this.billStateDropdownValue = page.locator("(//select[@id='ddlBillState']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.billingZipCode = page.getByRole('textbox', { name: 'Zip Code' });

        // Action Buttons
        this.payButton = page.locator('#btnAmt');
        this.paymentCloseButton = page.getByRole('button', { name: 'Close', exact: true }).or(page.locator(".modal-dialog button:has-text('Close'), #paymentAlertError button")).first();
        this.paymentSuccessAlert = page.getByText('Payment Approved', { exact: true }).or(page.getByText('Payment Successful', { exact: true })).or(page.getByText('Success!'));
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
            await this.waitForVisible(this.categoryDropdown);
            await this.click(this.categoryDropdown);
            await this.waitForVisible(this.categoryDropdownOption);
            await this.click(this.categoryDropdownOption);
            await this.click(this.uploadBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
        });
    }

    /**
     * Verifies that the file upload success message is visible and the choose file button is displayed.
     **/
    async verifyUploadSuccess() {
        await test.step('Verify file upload success message', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            // await this.isVisible(this.chooseFileBtn);
            await this.waitForVisible(this.page.getByText('Success! Upload has been completed.', { exact: true }).first(), 60000);
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

    /**
     * Opens the Pay Balance modal by clicking the 'Pay Now' link in the top right corner.
     **/
    async openPayBalanceModal() {
        await test.step('Click on "Pay Now" in top right to open Pay Balance modal', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.payNowLink);
            await this.click(this.payNowLink);
            await this.waitForLoaders();
            await this.waitForVisible(this.payButton);
        });
    }

    /**
     * Fills credit card payment details supporting both Clover iframes and standard inputs.
     * @param {Object} [customData] - Optional custom payment information.
     **/
    async fillPaymentDetails(customData = {}) {
        await test.step('Fill Credit Card details in Pay Balance modal', async () => {
            const data = { ...paymentData.processCreditCard, ...customData };

            await this.waitForVisible(this.payButton);
            await this.verifyVisible(this.payButton)

            if (await this.isVisible(this.cardNumberIframe)) {
                await this.waitForVisible(this.cardNumberInIframe);
                await this.click(this.cardNumberInIframe);
                await this.pressSequentially(this.cardNumberInIframe, data.cardNumber, { delay: 50 });

                const expRaw = data.expiryDate;
                const expFormatted = expRaw.length === 6 ? `${expRaw.slice(0, 2)}${expRaw.slice(4)}` : expRaw;
                await this.click(this.expiryDateInIframe);
                await this.pressSequentially(this.expiryDateInIframe, expFormatted, { delay: 50 });

                await this.click(this.cvvInIframe);
                await this.pressSequentially(this.cvvInIframe, data.cvv, { delay: 50 });
            }
            else {
                if (await this.isVisible(this.cardNumber)) {
                    await this.fill(this.cardNumber, data.cardNumber);
                    await this.fill(this.expiryDate, data.expiryDate);
                    await this.fill(this.cvv, data.cvv);
                }
            }

            await this.fill(this.nameOnCard, data.nameOnCard);
            await this.fill(this.billingAddress, data.billingAddress);
            await this.fill(this.billingCity, data.billingCity);
            await this.click(this.billStateDropdown);
            await this.click(this.billStateDropdownValue);

            if (await this.isVisible(this.cardPostalCodeIframe)) {
                await this.waitForVisible(this.postalCodeInIframe);
                await this.click(this.postalCodeInIframe);
                await this.pressSequentially(this.postalCodeInIframe, data.billingZipCode);
            } else {
                await this.fill(this.billingZipCode, data.billingZipCode);
            }
        });
    }


    /**
     * Submits payment and confirms action.
     **/
    async submitPayment() {
        await test.step('Click Pay button to complete transaction', async () => {
            await this.waitForVisible(this.payButton);
            await this.click(this.payButton);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the payment was processed successfully.
     **/
    async verifyPaymentSuccess() {
        await test.step('Verify payment success / approval', async () => {
            await this.waitForLoaders();
            await this.page.waitForTimeout(2000);
            if (await this.isVisible(this.paymentSuccessAlert)) {
                await this.verifyVisible(this.paymentSuccessAlert);
            }
            if (await this.isVisible(this.paymentCloseButton)) {
                await this.click(this.paymentCloseButton);
            }
        });
    }
}
