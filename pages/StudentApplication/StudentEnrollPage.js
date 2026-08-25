import BasePage from '../../utils/BasePage';
import { expect, test } from '@playwright/test';
import PdfHelper from '../../utils/PdfHelper';

/**
 * Page Object representing the Student Enrollment and Receipt Page.
 * Handles package selection, Pay Later enrollment, success verification, and popup receipt handling.
 **/
export default class StudentEnrollPage extends BasePage {

    /**
     * Initializes locators for the Student Enrollment Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.payLaterBtn = page.getByRole('button', { name: 'Pay Later' });
        this.printReceiptLink = page.getByRole('link', { name: 'Print Receipt' }).last();
        this.getPackageSelectBtn = page.locator("xpath=(//button[contains(@class,'PriceTax')])[1]");
    }

    /**
     * Selects the available package from the pricing list.
    **/
    async selectPackage() {
        await test.step('Select package from price table', async () => {
            await this.click(this.getPackageSelectBtn);
        });
    }

    /**
     * Clicks the 'Pay Later' button to proceed with enrollment without immediate payment.
    **/
    async clickPayLater() {
        await test.step('Click Pay Later button', async () => {
            await this.click(this.payLaterBtn);
        });
    }

    /**
     * Verifies that the enrollment success message is visible on the page.
    **/
    async verifyEnrollmentSuccess() {
        await test.step('Verify "You have been enrolled successfully." message', async () => {
            await this.verifyVisible(
                this.page.getByText(
                    'You have been enrolled successfully.',
                    { exact: true }
                ).first()
            );
        });
    }

    /**
     * Clicks the Print Receipt link, waits for the new popup browser tab to open, captures the PDF buffer, and returns the popup page object.
     * @returns {Promise<import('@playwright/test').Page>} The popup Page instance with attached pdfBuffer and pdfText properties.
      **/
    async clickPrintReceipt() {
        return await test.step('Click Print Receipt and wait for popup', async () => {
            // Listen for PDF network response
            const responsePromise = this.page.context().waitForEvent('response', {
                predicate: (res) => {
                    const ct = res.headers()['content-type'] || '';
                    return res.status() === 200 && (ct.includes('application/pdf') || ct.includes('application/x-pdf'));
                },
                timeout: 10000
            }).then(async (res) => {
                const body = await res.body().catch(() => null);
                return (body && body.length > 0) ? body : null;
            }).catch(() => null);

            const popupPromise = this.page.waitForEvent('popup');
            await this.click(this.printReceiptLink);
            const receiptPage = await popupPromise;
            await receiptPage.waitForLoadState('domcontentloaded');

            let pdfBuffer = await responsePromise;

            // If not captured from network response, fetch from blob URL or embed in the popup page
            if (!pdfBuffer) {
                try {
                    const targetUrl = receiptPage.url().startsWith('blob:') || receiptPage.url().endsWith('.pdf') || receiptPage.url().includes('pdf')
                        ? receiptPage.url()
                        : await receiptPage.locator('embed').getAttribute('src').catch(() => null);

                    if (targetUrl) {
                        const dataArray = await receiptPage.evaluate(async (url) => {
                            const res = await fetch(url);
                            const buffer = await res.arrayBuffer();
                            return Array.from(new Uint8Array(buffer));
                        }, targetUrl);

                        if (dataArray && dataArray.length > 0) {
                            pdfBuffer = Buffer.from(dataArray);
                        }
                    }
                } catch (e) {
                    console.log('Blob / embed PDF buffer extraction:', e.message);
                }
            }

            let pdfText = '';
            if (pdfBuffer && pdfBuffer.length > 0) {
                pdfText = await PdfHelper.extractText(pdfBuffer);
                if (pdfText) {
                    console.log('Extracted text from PDF receipt:', pdfText.trim().substring(0, 200));
                }
            }

            receiptPage.pdfText = pdfText;
            receiptPage.pdfBuffer = pdfBuffer;

            return receiptPage;
        });
    }

    /**
     * Verifies that the receipt popup page contains the expected heading text and attaches the PDF document to the report.
     * @param {import('@playwright/test').Page} receiptPage - The receipt popup Page instance.
     * @param {string} [expectedText='Enrollment COMPLETED'] - Text to verify on the receipt page.
     * @param {string} [attachmentName='Enrollment_Receipt.pdf'] - Filename for the attached PDF in reports.
    **/
    async verifyReceiptPage(receiptPage, expectedText = 'Enrollment COMPLETED', attachmentName = 'Enrollment_Receipt.pdf') {
        await PdfHelper.verifyAndAttachReceipt(receiptPage, expectedText, attachmentName);
    }
}





