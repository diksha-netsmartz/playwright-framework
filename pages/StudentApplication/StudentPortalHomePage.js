import path from 'path';
import BasePage from '@utils/BasePage';
import DateHelper from '@utils/DateHelper';
import { expect, test } from '@playwright/test';
import paymentData from '@test-data/json/paymentData.json';
import StudentLoginPage from './StudentLoginPage';
import { credentials as defaultCredentials } from '@config/config';


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
        this.uploadFilesWidget = page.locator("//div[contains(text(),'Upload Files') or contains(text(),'file upload')]");
        this.lastUploadedOnValues = [];
        this.chooseFileBtn = page.locator("#uploadimageChoose").first();
        this.enrollNavLink = page.locator('#Marketplace_li');
        this.myAccountNavLink = page.locator("#MyAccount_li");
        this.profileNavLink = page.locator("xpath=//li[contains(@id,'Profile')]");
        this.appointmentsNavLink = page.locator("#MyAccou_Appt_li");
        this.resourcesNavLink = page.locator("//strong[normalize-space()='Resources']")
        this.classesNavLink = page.locator('#Resources_Class_li:visible');
        this.schedulingNavLink = page.locator('#Scheduling_li');
        this.scheduleMyLessonsSubLink = page.locator('#Schul_InCar_li').first();
        this.myScheduleSubLink = page.locator('#Schul_MySch_li')
        this.contactUsNavLink = page.locator('#Contact_li');
        this.homeNavLink = page.getByRole('link', { name: 'Home' });

        this.categoryDropdowns = page.getByRole('button', { name: '--Select--' }).first();
        this.categoryDropdownOption = (/** @type {number} */ index) => this.page.locator(`((//select[@name='file_Category'])[${index + 1}]//parent::div//li//span[1][not(contains(text(),'Select'))])[1]`);

        // Pay Balance / Payment Modal Locators
        this.payNowLink = page.locator("//a[normalize-space()='Pay Now']")
        this.payBalanceModal = page.locator('.modal-content, .modal-dialog').filter({ hasText: 'PAY BALANCE' }).first();
        this.amountInput = page.locator("//label[contains(text(),'Amount')]//ancestor::div[contains(@class,'form-group')]//input | input[name='Amount'] | #txtPayAmount | #txtAmount").first();

        // Clover iframe locators (Card Number, Expiration Date, CVV, Zip Code)
        this.cardNumberIframe = page.locator('#CARD_NUMBER_ID, iframe[title="CARD NUMBER"]');
        this.cardNumberInIframe = page.frameLocator('#CARD_NUMBER_ID, iframe[title="CARD NUMBER"]').locator('#cardNumber');
        this.expiryDateInIframe = page.frameLocator('#CARD_DATE_ID, iframe[title="CARD DATE"]').locator('#date');
        this.cvvInIframe = page.frameLocator('#CARD_CVV_ID, iframe[title="CARD CVV"]').locator('#cvv');
        this.cardPostalCodeIframe = page.locator('#CARD_POSTAL_CODE_ID, iframe[title="CARD POSTAL CODE"]');
        this.postalCodeInIframe = page.frameLocator('#CARD_POSTAL_CODE_ID, iframe[title="CARD POSTAL CODE"]').locator('#postal');

        // Address & Cardholder Details
        this.openBalanceEnrollmentsCheckbox = page.locator("(//input[@class='chkOpnBlncEnrollments']//following-sibling::span)[1]");
        this.creditCardAmount = page.locator('#txtCCAmount')
        this.cardNumber = page.getByRole('textbox', { name: 'Card Number' });
        this.expiryDate = page.getByRole('textbox', { name: 'MM/YYYY' });
        this.cvv = page.getByRole('textbox', { name: 'CVV' });
        this.nameOnCard = page.getByRole('textbox', { name: 'Name on Card' });
        this.billingAddress = page.getByRole('textbox', { name: 'Billing Address' });
        this.billingCity = page.getByRole('textbox', { name: 'Billing City' });
        this.billStateDropdown = page.locator("//button[@data-id='ddlBillState']")
        this.billStateDropdownValue = page.locator("(//select[@id='ddlBillState']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.billingZipCode = page.getByRole('textbox', { name: 'Zip Code' }).or(page.locator('#stripe-postal-code'));
        this.paymentFormIframe = page.locator("//div[@id='payment-form']//iframe");
        this.paymentFormCardNumber = page.frameLocator("//div[@id='payment-form']//iframe").locator("input.cc-input, input[placeholder='0000 0000 0000 0000']");
        this.paymentFormExpiryDate = page.frameLocator("//div[@id='payment-form']//iframe").locator("input.exp-input, input[placeholder='MM/YY']");
        this.paymentFormCvv = page.frameLocator("//div[@id='payment-form']//iframe").locator("input.cvv-input, input[placeholder='CVV']");

        // Stripe iframe locators
        this.stripeCardNumberIframe = page.locator("#card-number-element iframe[title='Secure card number input frame'], #card-number-element iframe[name^='__privateStripeFrame']").first();
        this.stripeCardNumber = page.frameLocator("#card-number-element iframe[title='Secure card number input frame'], #card-number-element iframe[name^='__privateStripeFrame']").locator("input[name='cardnumber'], input[data-elements-stable-field-name='cardNumber']");
        this.stripeExpiryDate = page.frameLocator("#card-expiry-element iframe[name^='__privateStripeFrame'], iframe[title*='expiration']").locator("input[name='exp-date'], input[data-elements-stable-field-name='cardExpiry']");
        this.stripeCvv = page.frameLocator("#card-cvc-element iframe[name^='__privateStripeFrame'], iframe[title='Secure CVC input frame']").locator("input[name='cvc'], input[data-elements-stable-field-name='cardCvc']");

        // Action Buttons
        this.payButton = page.locator('#btnAmt');

        this.previewModal = page.getByRole('heading', { name: 'Preview' });
        this.studentMsgAttachment = (/** @type {string | RegExp} */ messageName) => page.locator(`//div[contains(text(),'${messageName}')]//parent::div//a[contains(@class,'preview')]`).first();
    }

    /**
     * Navigates to the student profile page by clicking 'My Account' and then 'Profile' in the left navigation.
     **/
    async navigateToProfile() {
        await test.step('Navigate to Student Profile (My Account -> Profile)', async () => {
            if (!await this.isVisible(this.profileNavLink, { timeout: 5000 }).catch(() => false)) {
                await this.click(this.myAccountNavLink);
            }
            await this.click(this.profileNavLink);
            await this.waitForLoaders();
        });
    }

    /**
     * Navigates to the home page by clicking 'Home' in the left navigation.
     **/
    async navigateToHome() {
        await test.step('Navigate to Home page', async () => {
            await this.waitForVisible(this.homeNavLink);
            await this.click(this.homeNavLink);
            await this.waitForLoaders();
        });
    }


    /**
     * Navigates to the Appointments page by clicking 'My Account' and then 'Appointments' in the left navigation.
     **/
    async navigateToAppointments() {
        await test.step('Navigate to Appointments (My Account -> Appointments)', async () => {
            await this.waitForLoaders();
            if (!await this.isVisible(this.appointmentsNavLink, { timeout: 5000 }).catch(() => false)) {
                await this.click(this.myAccountNavLink);
            }
            await this.waitForVisible(this.appointmentsNavLink, 5000);
            await this.click(this.appointmentsNavLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
            await this.waitForLoaders();
        });
    }

    /**
     * Navigates to the contact us page by clicking 'Contact' in the left navigation.
     **/
    async navigateToContactUs() {
        await test.step('Navigate to Contact Us', async () => {
            await this.waitForVisible(this.contactUsNavLink);
            await this.click(this.contactUsNavLink);
            await this.waitForLoaders();
            await this.verifyTitle("Contact")
        });
    }

    /**
     * Navigates to the classes page by clicking 'Resources' and then 'Classes' in the left navigation.
     **/
    async navigateToClassInResources() {
        await test.step('Navigate to Classes (Resources -> Classes)', async () => {
            await this.click(this.resourcesNavLink);
            await this.waitForVisible(this.classesNavLink);
            await this.click(this.classesNavLink);
            await this.waitForLoaders();
        });
    }

    /**
     * Navigates to Scheduling > Schedule My Lessons from the left sidebar.
     **/
    async navigateToScheduleMyLessons() {
        await test.step('Navigate to Scheduling > Schedule My Lessons', async () => {
            await this.waitForLoaders();
            await this.click(this.schedulingNavLink);
            await this.waitForLoaders();
            await this.waitForVisible(this.scheduleMyLessonsSubLink, 2000);
            await this.click(this.scheduleMyLessonsSubLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 15000 }).catch(() => {
            });
            await this.waitForLoaders();
            await this.verifyURLContainsText("BtwScheduling/Lessons");
        });
    }

    /**
     * Navigates to Scheduling > My Schedule from the left sidebar.
     **/
    async navigateToMySchedule() {
        await test.step('Navigate to Scheduling > My Schedule', async () => {
            await this.waitForLoaders();
            await this.click(this.schedulingNavLink);
            await this.waitForLoaders();
            await this.waitForVisible(this.myScheduleSubLink, 2000);
            await this.click(this.myScheduleSubLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 15000 }).catch(() => {
            });
            await this.waitForLoaders();
            await this.verifyURLContainsText("BtwScheduling/Lessons");
        });
    }

    /**
     * Uploads one or more documents/files and selects a category for each staged file.
     * @param {string|string[]} filePaths - Absolute or relative path(s) to the file(s) to upload.
     **/
    async uploadFiles(filePaths) {
        const filesToUpload = Array.isArray(filePaths) ? filePaths : [filePaths];
        const resolvedPaths = filesToUpload.map((filePath) => path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath));

        await test.step(`Upload ${filesToUpload.length} student file(s)`, async () => {
            await this.waitForVisible(this.uploadFilesWidget);
            await this.verifyVisible(this.uploadFilesWidget, 5000);
            await this.uploadFilesWidget.scrollIntoViewIfNeeded();
            await this.setInputFiles(this.fileInput, resolvedPaths);

            for (let i = 0; i < resolvedPaths.length; i++) {
                await this.waitForVisible(this.categoryDropdowns);
                await this.click(this.categoryDropdowns);
                await this.waitForVisible(this.categoryDropdownOption(i));
                await this.click(this.categoryDropdownOption(i));
            }

            const uploadResponsePromise = this.page.waitForResponse((response) =>
                response.url().includes('StudentCenterUploadCategory')
                && response.request().method() === 'POST'
                && response.status() === 200
                , { timeout: 60000 });

            await this.click(this.uploadBtn);
            const uploadResponse = await uploadResponsePromise;
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });

            this.lastUploadedOnValues = this.getUploadedOnValuesFromResponse(uploadResponse, filesToUpload.length);
        });
    }

    /**
     * Returns the last uploaded-on values captured from the upload API response.
     * @returns {string[]}
     **/
    getLastUploadedOnValues() {
        return [...this.lastUploadedOnValues];
    }

    /**
     * Returns one admin-portal-formatted uploaded-on value per uploaded file using the upload API response Date header.
     * @param {import('@playwright/test').Response} response - Upload API response.
     * @param {number} fileCount - Number of uploaded files.
     * @returns {string[]}
     **/
    getUploadedOnValuesFromResponse(response, fileCount) {
        const responseDateHeader = response.headers()['date'];
        expect(responseDateHeader, 'Expected upload response to include a Date header.').toBeTruthy();

        const uploadedOnValue = DateHelper.convertGMTToEST(responseDateHeader);
        return Array.from({ length: fileCount }, () => uploadedOnValue);
    }

    /**
     * Verifies that the file upload success message is visible and the choose file button is displayed.
     **/
    async verifyUploadSuccess() {
        await test.step('Verify file upload success message', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
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
            const expRaw = data.expiryDate;
            const expFormatted = expRaw.length === 6 ? `${expRaw.slice(0, 2)}${expRaw.slice(4)}` : expRaw;

            await this.waitForVisible(this.payButton);
            await this.verifyVisible(this.payButton);

            if (await this.isVisible(this.openBalanceEnrollmentsCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.openBalanceEnrollmentsCheckbox);
            } else {
                await this.clear(this.creditCardAmount);
                await this.pressSequentially(this.creditCardAmount, data.amount);
            }

            // Wait for whichever card gateway renders first (Clover, Stripe, Payment Form, or Standard)
            const cardGateway = this.cardNumberIframe
                .or(this.stripeCardNumberIframe)
                .or(this.paymentFormCardNumber)
                .or(this.cardNumber);

            await cardGateway.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {
            });

            // Fill card details for the active gateway only
            if (await this.stripeCardNumberIframe.isVisible().catch(() => false)) {
                await this.waitForVisible(this.stripeCardNumber, { timeout: 5000 });
                await this.click(this.stripeCardNumber);
                await this.fill(this.stripeCardNumber, paymentData.processCreditCard.cardNumber);
                await this.fill(this.stripeExpiryDate, expFormatted);
                await this.fill(this.stripeCvv, paymentData.processCreditCard.cvv);
            } else if (await this.cardNumberIframe.isVisible().catch(() => false)) {
                await this.waitForVisible(this.cardNumberInIframe, { timeout: 5000 });
                await this.click(this.cardNumberInIframe);
                await this.fill(this.cardNumberInIframe, paymentData.processCreditCard.cardNumber);
                await this.fill(this.expiryDateInIframe, expFormatted);
                await this.fill(this.cvvInIframe, paymentData.processCreditCard.cvv);
            } else if (await this.paymentFormCardNumber.isVisible().catch(() => false)) {
                await this.click(this.paymentFormCardNumber);
                await this.fill(this.paymentFormCardNumber, paymentData.processCreditCard.cardNumber);
                await this.fill(this.paymentFormExpiryDate, expFormatted);
                await this.fill(this.paymentFormCvv, paymentData.processCreditCard.cvv);
            } else if (await this.cardNumber.isVisible().catch(() => false)) {
                await this.pressSequentially(this.cardNumber, paymentData.processCreditCard.cardNumber);
                await this.fill(this.expiryDate, paymentData.processCreditCard.expiryDate);
                await this.fill(this.cvv, paymentData.processCreditCard.cvv);
            }

            await this.fill(this.nameOnCard, data.nameOnCard);
            await this.fill(this.billingAddress, data.billingAddress);
            await this.fill(this.billingCity, data.billingCity);
            await this.click(this.billStateDropdown);
            await this.click(this.billStateDropdownValue);

            if (await this.isVisible(this.cardPostalCodeIframe, { timeout: 1000 }).catch(() => false)) {
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
        await test.step('Verify payment success', async () => {
            await this.waitForLoaders();
            await this.page.waitForTimeout(2000);
            await this.waitForVisible(this.page.getByText('Your payment has been processed successfully.', { exact: true }).first(), { timeout: 10000 });
            await this.verifyVisible(this.page.getByText('Your payment has been processed successfully.', { exact: true }).first());

        });
    }

    /**
     * Verifies student message visibility on homepage and validates attachment preview.
     * @param {string} message - Message text.
     * @param {boolean} isVisible - Expected visibility state.
     **/
    async verifyStudentMessageVisibilityOnHompegae(message, isVisible) {
        await test.step(`Verify student message visibility: "${message}" is ${isVisible ? 'visible' : 'not visible'}`, async () => {
            if (isVisible) {
                await this.verifyVisible(this.page.getByText(message, { exact: false }).first());
                await this.click(this.studentMsgAttachment(message));
                await this.verifyVisible(this.previewModal);

            } else {
                await this.verifyNotVisible(this.page.getByText(message, { exact: false }).first());
            }
        });
    }
}
