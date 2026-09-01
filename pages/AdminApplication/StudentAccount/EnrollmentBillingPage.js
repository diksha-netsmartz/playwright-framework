import BasePage from "../../../utils/BasePage";
import { expect, test } from "@playwright/test";
import paymentData from "../../../test-data/json/paymentData.json";

/**
 * Page Object representing the Student Enrollment and Billing Page in Admin Portal.
 * Handles package enrollment, package modification/deletion, student selection, and various payment types
 * (Swiped Card, Check, Cash, Adjustments, and Credit Card processing).
 **/
export default class EnrollmentBillingPage extends BasePage {

    /**
     * Initializes locators for the Enrollment & Billing Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.studentNotSelected = page.getByRole('link', { name: 'STUDENT NOT SELECTED. CLICK' });
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        this.studentSearch = page.locator('#studentList');

        this.goButton = page.getByRole('button', { name: 'GO' });

        this.selectLocationDropdown = page.getByRole('link', { name: 'Select Location' });

        this.showAllCheckbox = page.getByText('Show All').first();

        this.filterButton = page.getByRole('button', { name: 'Filter' });

        // Add New
        this.addNewButton = page.locator('#divEnrollmentGrid').getByRole('link', { name: 'Add New' });

        // Package Selection
        this.packageSelectionButton = page.getByRole('button', { name: 'Package Selection' });

        this.addPackageButton = page.getByRole('button', { name: 'Add Package' });

        // Location / Appointment
        this.selectLocation = page.getByRole('link', { name: 'Select Location' });
        this.selectButton = page.locator("xpath=//a[text()='Select' and @onclick='showAddButton(this);']").first();
        this.addButton = page.locator("xpath=//button[text()='Add' and contains(@onclick,'showSelect(this);')]").first();
        this.addButtonForAdditionalDetails = page.locator("xpath=//td[text()='RT PRODUCT']//ancestor::tr//button[text()='Add' and contains(@onclick,'addAdditional')]").first();

        this.addToCartButton = page.getByRole('button', { name: 'Add To Cart' });

        // Enroll
        this.enrollButton = page.getByRole('button', { name: 'Enroll' });

        // Edit
        this.editButton = page.locator("xpath=(//table[@id='enrollments']//td[text()='CR Package']//ancestor::tr//a[@data-toggle='dropdown'])[1]");
        this.getLatestPackageID = page.locator("xpath=(//table[@id='enrollments']//td[text()='CR Package']//parent::tr//td[4])[1]");

        // Update
        this.notesTextbox = page.locator('#txtpackageNotes');

        this.updateButton = page.getByRole('button', { name: 'Update' }).first();

        this.skipSelectionButton = page.getByRole('button', { name: 'Skip Selection' }).first();

        // Billing grid
        this.selectButton = page.getByRole('button', { name: 'Select' });
        this.addNewBilling = page.locator('#divBillingGrid').getByRole('link', { name: 'Add New' }).last();

        // Swiped Transaction
        this.swipedTransaction = page.locator('a').filter({ hasText: 'Swiped Transaction' }).last();
        this.swipeAmountTextbox = page.locator('#txtSwipeAmount');
        this.last4Digits = page.getByRole('textbox', { name: 'Last 4 Digits on Card' });
        this.cardTypeSelectDropdown = page.locator("#btnSwipe_CardType");
        this.discover = page.locator("xpath=//ul[@id='ddlCardType']//li//span[text()='Discover']");
        this.transactionNumber = page.getByRole('textbox', { name: 'Transaction#' });
        this.receiptNumber = page.getByRole('textbox', { name: 'Receipt#' });
        this.cashNotesTextbox = page.locator("#txtCashNotes").first();
        this.cashDrawerLocationDropdown = page.locator("//button[@data-id='billingLocation']");
        this.cashDrawerLocationDropdownOption = page.locator("(//div[@id='cashlocations']//ul//li[not(@class='selected')])[1]");
        this.terminalIDTextbox = page.getByRole('textbox', { name: 'Terminal #' });
        this.accountNicknameTextbox = page.getByRole('textbox', { name: 'Account Nickname' });
        this.doNotSendEmailCheckbox = page.locator("//input[@id='chb_DoNotSendEmail']/following-sibling::ins");

        // Check Payment
        this.checkPayment = page.locator('a').filter({ hasText: 'Check Payment' }).last();
        this.checkAmount = page.locator("#txtCheckAmount").first();
        this.checkNumber = page.getByRole('textbox', { name: 'Check#' });
        this.chequeNotesTextbox = page.locator("#txtCheckNotes");
        this.chequeDeposited = page.locator("xpath=//input[@id='chb_ChequeDeposited']/following-sibling::ins");

        // Cash Payment
        this.cashPayment = page.locator('a').filter({ hasText: 'Cash Payment' }).last();
        this.cashAmountTextbox = page.locator("#txtCashAmount").first();

        // Adjustment
        this.adjustment = page.getByText('Adjustment', { exact: true }).last();
        this.refundAddToBalance = page.locator("xpath=//ul[@id='ddlAdjustmentTypeType']//li//span[text()='Refund (Add to balance)']");

        // Process Credit Card
        this.processCreditCard = page.locator('a').filter({ hasText: 'Process Credit Card' }).last();
        this.cardNumber = page.getByRole('textbox', { name: 'Card Number' });
        this.expiryDate = page.getByRole('textbox', { name: 'MM/YYYY' });
        this.cvv = page.getByRole('textbox', { name: 'CVV' });
        this.nameOnCard = page.getByRole('textbox', { name: 'Name on Card' });
        this.sameAddress = page.locator("xpath=//input[@id='chb_Same_Adddress']/following-sibling::ins");
        this.billingAddress = page.getByRole('textbox', { name: 'Billing Address' });
        this.billingCity = page.getByRole('textbox', { name: 'Billing City' });
        this.billStateDropdown = page.locator("xpath=//div[contains(@id,'ddlBillState')]");
        this.billStateDropdownValue = page.locator("xpath=//div[@role='option' and text()='AK']");
        this.billingZipCode = page.getByRole('textbox', { name: 'Zip Code' });

        // Billing amount caption (e.g. "Billing: $1275.00")
        this.billingAmountCaption = page.locator("//div[@id='divBillingGrid']//div[contains(@class,'caption')]");

        // Common buttons
        this.saveButton = page.getByRole('button', { name: 'Save' });
        this.closeButton = page.getByRole('button', { name: 'Close' });
    }

    /**
     * Returns locator for the edit details tab for a given enrollment database ID.
     * @param {string|number} databaseID - Enrollment record ID.
     * @returns {import('@playwright/test').Locator} Edit details tab locator.
      **/
    editDetailsTab(databaseID) {
        return this.page.locator(`xpath=(//a[@onclick='GetEnrollmentDetail(${databaseID})'])[last()]`);
    }

    /**
     * Returns locator for the delete enrollment button for a given enrollment database ID.
     * @param {string|number} databaseID - Enrollment record ID.
     * @returns {import('@playwright/test').Locator} Delete enrollment link locator.
      **/
    deleteLink(databaseID) {
        return this.page.locator(`xpath=(//a[@data-toggle='confirmationDeleteEnrollment' and @data-enrollmentid='${databaseID}'])[1]`);
    }

    /**
     * Returns locator for the student autocomplete list item matching the specified name.
     * @param {string} studentName - Student name. 
     * @returns {import('@playwright/test').Locator} Student dropdown item locator.
      **/
    studentDropdownValue(studentName) {
        return this.page.locator('li').filter({ hasText: studentName });
    }

    /**
     * Clicks the 'Add New' button in the enrollment section.
    **/
    async clickAddNew() {
        await test.step('Click Add New enrollment', async () => {
            await this.click(this.addNewButton);
        });
    }

    /**
     * Opens the package selection modal and clicks the package matching the specified package name.
     * @param {string} packageName - Name of the package to select.
    **/
    async selectPackage(packageName) {
        await test.step(`Select package: "${packageName}"`, async () => {
            await this.click(this.packageSelectionButton);
            await this.click(this.page.getByRole('link', {
                name: packageName,
                exact: true
            }));
        });
    }

    /**
     * Completes the entire workflow to add a CR Package to cart (location, filter, select slot, additional details).
    **/
    async addCRPackage() {
        await test.step('Add CR Package to cart', async () => {
            await this.selectPackage('CR Package');
            await this.click(this.addPackageButton);
            await this.click(this.selectLocationDropdown);
            await this.click(this.showAllCheckbox);
            await this.click(this.filterButton);
            await this.click(this.selectButton);
            await this.click(this.addButtonForAdditionalDetails);
            await this.click(this.addToCartButton);
        });
    }

    /**
     * Clicks the Enroll button and confirms the confirmation dialog.
    **/
    async enroll() {
        await test.step('Enroll student in package', async () => {
            await this.click(this.enrollButton);
            await this.click(this.yesConfirmationButton);
        });
    }

    /**
     * Edits the latest CR package enrollment, updates notes, saves, and confirms.
    **/
    async editAndUpdateNotes() {
        await test.step('Edit package enrollment and update notes', async () => {
            await this.click(this.editButton);
            const packageId = await this.getText(this.getLatestPackageID);
            console.log("package id : " + packageId);
            await this.click(this.editDetailsTab(packageId));
            try {
                await this.waitForVisible(this.skipSelectionButton);
                await this.click(this.skipSelectionButton);
            } catch {
                // Button not present, continue
            }
            await this.fill(this.notesTextbox, "updating package notes");
            await this.click(this.updateButton);
            await this.page.waitForTimeout(2000);
            if (await this.isVisible(this.yesConfirmationButton)) {
                await this.click(this.yesConfirmationButton);
                await this.waitForLoaders();
            }
        });
    }

    /**
     * Deletes the latest CR Package enrollment and confirms the action.
    **/
    async editAndDelete() {
        await test.step('Delete package enrollment', async () => {
            await this.waitForVisible(this.editButton);
            await this.click(this.editButton);
            const packageId = await this.getText(this.getLatestPackageID);
            await this.waitForVisible(this.deleteLink(packageId));
            await this.deleteLink(packageId).click({ force: true });
            await this.click(this.yesConfirmationButton);
        });
    }

    /**
     * Searches for a student by name in the header search input and selects the student account.
     * @param {string} studentName - Student's name to search.
    **/
    async selectStudent(studentName) {
        await test.step(`Search and select student: "${studentName}"`, async () => {
            await this.click(this.studentNotSelected);
            await this.verifyVisible(this.studentSearch);
            await this.pressSequentially(this.studentSearch, studentName);
            await this.click(this.studentDropdownValue(studentName.replace(" ", ", ")));
            await this.click(this.goButton);
        });
    }

    /**
     * Parses and returns the current numeric billing balance from the billing section header caption.
     * @returns {Promise<number|null>} Parsed float amount or null.
      **/
    async getBillingAmount() {
        const text = await this.getText(this.billingAmountCaption);
        const match = text.match(/\$([\d,]+\.?\d*)/);
        return match ? parseFloat(match[1].replace(',', '')) : null;
    }

    /**
     * Adds a swiped card transaction payment, saves, verifies 'Payment Entered' modal, and asserts billing balance update.
    **/
    async addSwipedTransaction() {
        await test.step('Add Swiped Card Transaction payment and verify balance update', async () => {
            const amountBefore = await this.getBillingAmount();

            await this.click(this.addNewBilling);
            await this.click(this.swipedTransaction);
            await this.clear(this.swipeAmountTextbox);
            await this.fill(this.swipeAmountTextbox, paymentData.swipedTransaction.amount);
            await this.fill(this.last4Digits, paymentData.swipedTransaction.last4Digits);
            await this.click(this.cardTypeSelectDropdown);
            await this.click(this.discover);
            await this.click(this.doNotSendEmailCheckbox);
            await this.fill(this.transactionNumber, paymentData.swipedTransaction.transactionNumber);
            await this.fill(this.receiptNumber, paymentData.swipedTransaction.receiptNumber);
            if (await this.isVisible(this.cashDrawerLocationDropdown)) {
                await this.click(this.cashDrawerLocationDropdown);
                await this.waitForVisible(this.cashDrawerLocationDropdownOption);
                await this.click(this.cashDrawerLocationDropdownOption);
            }
            await this.fill(this.cashNotesTextbox, paymentData.swipedTransaction.notes);
            if (await this.isVisible(this.terminalIDTextbox)) {
                await this.fill(this.terminalIDTextbox, paymentData.swipedTransaction.terminalID)
            }

            if (await this.isVisible(this.accountNicknameTextbox)) {
                await this.fill(this.accountNicknameTextbox, paymentData.swipedTransaction.accountNickname)
            }
            await this.click(this.saveButton);
            await this.click(this.yesConfirmationButton);
            await this.waitForHidden(this.yesConfirmationButton);
            await this.waitForVisible(this.closeButton);
            await this.verifyVisible(this.page.getByText('Payment Entered', { exact: true }));
            await this.click(this.closeButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 });
            await this.page.waitForTimeout(3000);
            const amountAfter = await this.getBillingAmount();
            expect(amountAfter).not.toEqual(amountBefore);
        });
    }

    /**
     * Adds a check payment, marks check as deposited, saves, verifies confirmation, and asserts balance update.
    **/
    async addCheckPayment() {
        await test.step('Add Check Payment and verify balance update', async () => {
            const amountBefore = await this.getBillingAmount();

            await this.click(this.addNewBilling);
            await this.click(this.checkPayment);
            await this.clear(this.checkAmount);
            await this.fill(this.checkAmount, paymentData.checkPayment.amount);
            await this.fill(this.checkNumber, paymentData.checkPayment.checkNumber);
            await this.fill(this.receiptNumber, paymentData.checkPayment.receiptNumber);
            await this.fill(this.chequeNotesTextbox, paymentData.checkPayment.notes);
            await this.click(this.chequeDeposited);
            if (await this.isVisible(this.cashDrawerLocationDropdown)) {
                await this.click(this.cashDrawerLocationDropdown);
                await this.waitForVisible(this.cashDrawerLocationDropdownOption);
                await this.click(this.cashDrawerLocationDropdownOption);
            }
            await this.click(this.doNotSendEmailCheckbox);
            await this.click(this.saveButton);
            await this.click(this.yesConfirmationButton);
            await this.waitForHidden(this.yesConfirmationButton);
            await this.waitForVisible(this.closeButton);
            await this.verifyVisible(this.page.getByText('Payment Entered', { exact: true }));
            await this.click(this.closeButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 });
            await this.page.waitForTimeout(3000);
            await this.waitForVisible(this.addNewBilling);

            const amountAfter = await this.getBillingAmount();
            expect(amountAfter).not.toEqual(amountBefore);
        });
    }

    /**
     * Adds a cash payment record, saves, verifies 'Payment Entered' modal, and asserts billing balance update.
    **/
    async addCashPayment() {
        await test.step('Add Cash Payment and verify balance update', async () => {
            const amountBefore = await this.getBillingAmount();

            await this.click(this.addNewBilling);
            await this.click(this.cashPayment);
            await this.clear(this.cashAmountTextbox);
            await this.fill(this.cashAmountTextbox, paymentData.cashPayment.amount);
            await this.fill(this.receiptNumber, paymentData.cashPayment.receiptNumber);
            await this.fill(this.cashNotesTextbox, paymentData.cashPayment.notes);
            if (await this.isVisible(this.cashDrawerLocationDropdown)) {
                await this.click(this.cashDrawerLocationDropdown);
                await this.waitForVisible(this.cashDrawerLocationDropdownOption);
                await this.click(this.cashDrawerLocationDropdownOption);
            }
            await this.click(this.doNotSendEmailCheckbox);
            await this.click(this.saveButton);
            await this.click(this.yesConfirmationButton);
            await this.waitForHidden(this.yesConfirmationButton);
            await this.waitForVisible(this.closeButton);
            await this.verifyVisible(this.page.getByText('Payment Entered', { exact: true }));
            await this.click(this.closeButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 });
            await this.page.waitForTimeout(3000);
            await this.waitForVisible(this.addNewBilling);

            const amountAfter = await this.getBillingAmount();
            expect(amountAfter).not.toEqual(amountBefore);
        });
    }

    /**
     * Adds a balance adjustment payment (Refund / Add to balance), saves, and asserts billing balance update.
    **/
    async addAdjustment() {
        await test.step('Add Balance Adjustment and verify balance update', async () => {
            const amountBefore = await this.getBillingAmount();

            await this.click(this.addNewBilling);
            await this.click(this.adjustment);
            await this.clear(this.cashAmountTextbox);
            await this.fill(this.cashAmountTextbox, paymentData.adjustment.amount);
            await this.click(this.selectButton);
            await this.click(this.refundAddToBalance);
            await this.fill(this.receiptNumber, paymentData.adjustment.receiptNumber);
            await this.fill(this.cashNotesTextbox, paymentData.adjustment.notes);
            if (await this.isVisible(this.cashDrawerLocationDropdown)) {
                await this.click(this.cashDrawerLocationDropdown);
                await this.waitForVisible(this.cashDrawerLocationDropdownOption);
                await this.click(this.cashDrawerLocationDropdownOption);
            }
            await this.click(this.doNotSendEmailCheckbox);
            await this.click(this.saveButton);
            await this.click(this.yesConfirmationButton);
            await this.waitForHidden(this.yesConfirmationButton);
            await this.waitForVisible(this.closeButton);
            await this.verifyVisible(this.page.getByText('Adjustment Entered', { exact: true }));
            await this.click(this.closeButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 });
            await this.page.waitForTimeout(3000);
            await this.waitForVisible(this.addNewBilling);

            const amountAfter = await this.getBillingAmount();
            expect(amountAfter).not.toEqual(amountBefore);
        });
    }

    /**
     * Processes an online credit card transaction with card info and billing address, confirms payment, and asserts balance update.
    **/
    async processCreditCardPayment() {
        await test.step('Process Credit Card payment and verify balance update', async () => {
            const amountBefore = await this.getBillingAmount();

            await this.click(this.addNewBilling);
            await this.click(this.processCreditCard);
            await this.fill(this.cardNumber, paymentData.processCreditCard.cardNumber);
            await this.fill(this.expiryDate, paymentData.processCreditCard.expiryDate);
            await this.fill(this.cvv, paymentData.processCreditCard.cvv);
            await this.fill(this.nameOnCard, paymentData.processCreditCard.nameOnCard);
            await this.fill(this.receiptNumber, paymentData.processCreditCard.receiptNumber);
            await this.fill(this.billingAddress, paymentData.processCreditCard.billingAddress);
            await this.fill(this.billingCity, paymentData.processCreditCard.billingCity);
            await this.click(this.billStateDropdown);
            await this.click(this.billStateDropdownValue);
            await this.fill(this.billingZipCode, paymentData.processCreditCard.billingZipCode);
            await this.fill(this.cashNotesTextbox, paymentData.processCreditCard.notes);
            if (await this.isVisible(this.cashDrawerLocationDropdown)) {
                await this.click(this.cashDrawerLocationDropdown);
                await this.waitForVisible(this.cashDrawerLocationDropdownOption);
                await this.click(this.cashDrawerLocationDropdownOption);
            }
            await this.click(this.doNotSendEmailCheckbox);
            await this.click(this.saveButton);
            await this.click(this.yesConfirmationButton);
            await this.waitForHidden(this.yesConfirmationButton);
            await this.waitForVisible(this.closeButton);
            await this.verifyVisible(this.page.getByText('Payment Approved', { exact: true }));
            await this.click(this.closeButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 });
            await this.page.waitForTimeout(3000);
            await this.waitForVisible(this.addNewBilling);
            const amountAfter = await this.getBillingAmount();
            expect(amountAfter).not.toEqual(amountBefore);
        });
    }
}