import BasePage from "../../utils/BasePage";
import {expect} from "@playwright/test";
import paymentData from "../../test-data/paymentData.json";

export class EnrollmentBillingPage extends BasePage {

    constructor(page) {
        super(page);

        this.studentNotSelected = page.getByRole('link', {
            name: 'STUDENT NOT SELECTED. CLICK'
        });
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        this.studentSearch = page.locator('#studentList');

        this.goButton = page.getByRole('button', {
            name: 'GO'
        });

        this.selectLocationDropdown = page.getByRole('link', {
            name: 'Select Location'
        });

        this.showAllCheckbox = page.getByText('Show All').first();

        this.filterButton = page.getByRole('button', {
            name: 'Filter'
        });

        // Add New
        this.addNewButton = page
            .locator('#divEnrollmentGrid')
            .getByRole('link', {
                name: 'Add New'
            });

        // Package Selection
        this.packageSelectionButton = page.getByRole('button', {
            name: 'Package Selection'
        });

        this.addPackageButton = page.getByRole('button', {
            name: 'Add Package'
        });

        // Location / Appointment
        this.selectLocation = page.getByRole('link', {
            name: 'Select Location'
        });


        this.filterButton = page.getByRole('button', {
            name: 'Filter'
        });

        this.selectButton = page.locator("xpath=//a[text()='Select' and @onclick='showAddButton(this);']").first();

        this.addButton = page.locator("xpath=//button[text()='Add' and contains(@onclick,'showSelect(this);')]").first();
        this.addButtonForAdditionalDetails = page.locator("xpath=//td[text()='RT PRODUCT']//ancestor::tr//button[text()='Add' and contains(@onclick,'addAdditional')]").first();

        this.addToCartButton = page.getByRole('button', {
            name: 'Add To Cart'
        });


        // Enroll
        this.enrollButton = page.getByRole('button', {
            name: 'Enroll'
        });


        // Edit
        this.editButton = page.locator("xpath=(//table[@id='enrollments']//td[text()='CR Package']//ancestor::tr//a[@data-toggle='dropdown'])[1]");
        this.getLatestPackageID = page.locator("xpath=(//table[@id='enrollments']//td[text()='CR Package']//parent::tr//td[4])[1]");


        // Update
        this.notesTextbox = page.locator('#txtpackageNotes');

        this.updateButton = page.getByRole('button', {
            name: 'Update'
        }).first();

        this.skipSelectionButton = page.getByRole('button', {name: 'Skip Selection'}).first();

        // Billing grid
        this.selectButton = page.getByRole('button', {name: 'Select'});
        this.addNewBilling = page
            .locator('#divBillingGrid')
            .getByRole('link', {name: 'Add New'}).last();

        // Swiped Transaction
        this.swipedTransaction = page.locator('a').filter({hasText: 'Swiped Transaction'}).last();
        this.swipeAmountTextbox = page.locator('#txtSwipeAmount');
        this.last4Digits = page.getByRole('textbox', {
            name: 'Last 4 Digits on Card'
        });

        this.cardTypeSelectDropdown = page.locator("#btnSwipe_CardType");

        this.discover = page.locator("xpath=//ul[@id='ddlCardType']//li//span[text()='Discover']");

        this.transactionNumber = page.getByRole('textbox', {
            name: 'Transaction#'
        });

        this.receiptNumber = page.getByRole('textbox', {
            name: 'Receipt#'
        });
        this.cashNotesTextbox = page.locator("#txtCashNotes").first();

        // Check Payment
        this.checkPayment = page.locator('a').filter({hasText: 'Check Payment'}).last();

        this.checkAmount = page.locator("#txtCheckAmount").first();

        this.checkNumber = page.getByRole('textbox', {
            name: 'Check#'
        });

        this.chequeNotesTextbox = page.locator("#txtCheckNotes");


        this.chequeDeposited = page.locator("xpath=//input[@id='chb_ChequeDeposited']/following-sibling::ins");


        // Cash Payment
        this.cashPayment = page.locator('a').filter({hasText: 'Cash Payment'}).last();
        this.cashAmountTextbox = page.locator("#txtCashAmount").first();

        // Adjustment
        this.adjustment = page.getByText('Adjustment', {exact: true}).last();

        this.refundAddToBalance = page.locator("xpath=//ul[@id='ddlAdjustmentTypeType']//li//span[text()='Refund (Add to balance)']");


        // Process Credit Card
        this.processCreditCard = page.locator('a').filter({hasText: 'Process Credit Card'}).last()

        this.cardNumber = page.getByRole('textbox', {
            name: 'Card Number'
        });

        this.expiryDate = page.getByRole('textbox', {
            name: 'MM/YYYY'
        });

        this.cvv = page.getByRole('textbox', {
            name: 'CVV'
        });

        this.nameOnCard = page.getByRole('textbox', {
            name: 'Name on Card'
        });

        this.sameAddress = page.locator("xpath=//input[@id='chb_Same_Adddress']/following-sibling::ins");
        this.billingAddress = page.getByRole('textbox', {name: 'Billing Address'});
        this.billingCity = page.getByRole('textbox', {name: 'Billing City'});
        this.billStateDropdown = page.locator("xpath=//div[contains(@id,'ddlBillState')]");
        this.billStateDropdownValue = page.locator("xpath=//div[@role='option' and text()='AK']");
        this.billingZipCode = page.getByRole('textbox', {name: 'Zip Code'})

        // Billing amount caption (e.g. "Billing: $1275.00")
        this.billingAmountCaption = page.locator("//div[@id='divBillingGrid']//div[contains(@class,'caption')]");

        // Common buttons
        this.saveButton = page.getByRole('button', {
            name: 'Save'
        });

        this.closeButton = page.getByRole('button', {
            name: 'Close'
        });


    }


    editDetailsTab(databaseID) {
        return this.page.locator(`xpath=//a[@onclick='GetEnrollmentDetail(${databaseID})']`);
    }


    deleteLink(databaseID) {
        return this.page.locator(`xpath=//a[@data-toggle='confirmationDeleteEnrollment' and @data-enrollmentid='${databaseID}']`);
    }

    studentDropdownValue(studentName) {
        return this.page.locator('li').filter({hasText: studentName});
    }

    async clickAddNew() {
        await this.addNewButton.click();
    }


    async selectPackage(packageName) {

        await this.packageSelectionButton.click();

        await this.page.getByRole('link', {
            name: packageName,
            exact: true
        }).click();
    }


    async addCRPackage() {

        await this.selectPackage('CR Package');
        await this.addPackageButton.click();
        await this.selectLocationDropdown.click();
        await this.showAllCheckbox.click();
        await this.filterButton.click();
        await this.selectButton.click();
        // await this.addButton.click();
        await this.addButtonForAdditionalDetails.click();
        await this.addToCartButton.click();
    }


    async enroll() {

        await this.enrollButton.click();
        await this.click(this.yesConfirmationButton);
    }


    async editAndUpdateNotes() {

        await this.editButton.click();
        const packageId = await this.getText(this.getLatestPackageID);
        await this.editDetailsTab(packageId).click();
        try {
            await this.skipSelectionButton.waitFor({state: 'visible', timeout: 5000});
            await this.skipSelectionButton.click();
        } catch {
            // Button not present, continue
        }
        await this.notesTextbox.fill("updating package notes");
        await this.updateButton.click();
        await this.yesConfirmationButton.click();
    }


    async editAndDelete() {
        await this.editButton.click();
        const packageId = await this.getText(this.getLatestPackageID);
        await this.deleteLink(packageId).click();
        await this.yesConfirmationButton.click();
    }

    async selectStudent(studentName) {

        await this.studentNotSelected.click();
        await this.studentSearch.isVisible();
        await this.studentSearch.pressSequentially(studentName, {delay: 100});


        await this.studentDropdownValue(studentName.replace(" ", ", ")).click();

        await this.goButton.click();
    }

    async waitForLoaders() {
        await this.page.waitForFunction(() =>
            [...document.querySelectorAll('.load-area')].every(
                el => el.style.display === 'none'
            )
        );
    }

    async getBillingAmount() {
        const text = await this.billingAmountCaption.textContent();
        // console.log("billing amount : " + text);
        const match = text.match(/\$([\d,]+\.?\d*)/);
        return match ? parseFloat(match[1].replace(',', '')) : null;
    }

    async addSwipedTransaction() {
        const amountBefore = await this.getBillingAmount();

        await this.addNewBilling.click();

        await this.swipedTransaction.click();
        await this.swipeAmountTextbox.clear();
        await this.swipeAmountTextbox.fill(paymentData.swipedTransaction.amount);

        await this.last4Digits.fill(paymentData.swipedTransaction.last4Digits);

        await this.cardTypeSelectDropdown.click();

        await this.discover.click();

        await this.transactionNumber.fill(paymentData.swipedTransaction.transactionNumber);

        await this.receiptNumber.fill(paymentData.swipedTransaction.receiptNumber);
        await this.cashNotesTextbox.fill(paymentData.swipedTransaction.notes)

        await this.saveButton.click();

        await this.yesConfirmationButton.click();

        await this.page.getByText('Payment Entered', {exact: true})

        await expect(
            this.page.getByText(
                'Payment Entered',
                {exact: true}
            )
        ).toBeVisible();

        await this.closeButton.click();
        // await this.page.waitForLoadState('networkidle');
        await this.waitForLoaders();
        // await this.addNewBilling.waitFor({state: 'visible'});

        const amountAfter = await this.getBillingAmount();
        expect(amountAfter).not.toEqual(amountBefore);
    }

    async addCheckPayment() {
        const amountBefore = await this.getBillingAmount();

        await this.addNewBilling.click();
        await this.checkPayment.click();
        await this.checkAmount.clear();
        await this.checkAmount.fill(paymentData.checkPayment.amount);
        await this.checkNumber.fill(paymentData.checkPayment.checkNumber);
        await this.receiptNumber.fill(paymentData.checkPayment.receiptNumber);
        await this.chequeNotesTextbox.fill(paymentData.checkPayment.notes);
        await this.chequeDeposited.click();
        await this.saveButton.click();

        await this.yesConfirmationButton.click();
        await this.page.getByText('Payment Entered', {exact: true})

        await expect(
            this.page.getByText(
                'Payment Entered',
                {exact: true}
            )
        ).toBeVisible();


        await this.closeButton.click();
        // await this.page.waitForLoadState('networkidleidle');
        await this.waitForLoaders();
        await this.addNewBilling.waitFor({state: 'visible'});

        const amountAfter = await this.getBillingAmount();
        expect(amountAfter).not.toEqual(amountBefore);
    }

    async addCashPayment() {
        const amountBefore = await this.getBillingAmount();

        await this.addNewBilling.click();
        await this.cashPayment.click();
        await this.cashAmountTextbox.clear();
        await this.cashAmountTextbox.fill(paymentData.cashPayment.amount);
        await this.receiptNumber.fill(paymentData.cashPayment.receiptNumber);
        await this.cashNotesTextbox.fill(paymentData.cashPayment.notes);
        await this.saveButton.click();
        await this.yesConfirmationButton.click();
        await this.page.getByText('Payment Entered', {exact: true})

        await expect(
            this.page.getByText(
                'Payment Entered',
                {exact: true}
            )
        ).toBeVisible();

        await this.closeButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.waitForLoaders();
        await this.addNewBilling.waitFor({state: 'visible'});

        const amountAfter = await this.getBillingAmount();
        expect(amountAfter).not.toEqual(amountBefore);
    }

    async addAdjustment() {
        const amountBefore = await this.getBillingAmount();

        await this.addNewBilling.click();

        await this.adjustment.click();
        await this.cashAmountTextbox.clear();
        await this.cashAmountTextbox.fill(paymentData.adjustment.amount);

        await this.selectButton.click();

        await this.refundAddToBalance.click();

        await this.receiptNumber.fill(paymentData.adjustment.receiptNumber);

        await this.cashNotesTextbox.fill(paymentData.adjustment.notes);

        await this.saveButton.click();

        await this.yesConfirmationButton.click();


        await this.page.getByText('Adjustment Entered', {exact: true})

        await expect(
            this.page.getByText(
                'Adjustment Entered',
                {exact: true}
            )
        ).toBeVisible();

        await this.closeButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.waitForLoaders();
        await this.addNewBilling.waitFor({state: 'visible'});

        const amountAfter = await this.getBillingAmount();
        expect(amountAfter).not.toEqual(amountBefore);
    }

    async processCreditCardPayment() {
        const amountBefore = await this.getBillingAmount();

        await this.addNewBilling.click();

        await this.processCreditCard.click();

        // await this.amount.click();
        // await this.sameAddress.click();

        await this.cardNumber.fill(paymentData.processCreditCard.cardNumber);

        await this.expiryDate.fill(paymentData.processCreditCard.expiryDate);

        await this.cvv.fill(paymentData.processCreditCard.cvv);

        await this.nameOnCard.fill(paymentData.processCreditCard.nameOnCard);


        await this.receiptNumber.fill(paymentData.processCreditCard.receiptNumber);

        await this.nameOnCard.fill(paymentData.processCreditCard.nameOnCard);
        await this.billingAddress.fill(paymentData.processCreditCard.billingAddress);
        await this.billingCity.fill(paymentData.processCreditCard.billingCity);
        await this.billStateDropdown.click();
        await this.billStateDropdownValue.click();
        await this.billingZipCode.fill(paymentData.processCreditCard.billingZipCode);


        await this.cashNotesTextbox.fill(paymentData.processCreditCard.notes);

        await this.saveButton.click();

        await this.yesConfirmationButton.click();

        await this.page.getByText('Payment Approved', {exact: true})

        await expect(
            this.page.getByText(
                'Payment Approved',
                {exact: true}
            )
        ).toBeVisible();
        await this.closeButton.click();
        await this.page.waitForLoadState('networkidle');
        await this.waitForLoaders();
        await this.addNewBilling.waitFor({state: 'visible'});
        const amountAfter = await this.getBillingAmount();
        expect(amountAfter).not.toEqual(amountBefore);
    }
}

module.exports = EnrollmentBillingPage;