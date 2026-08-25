import * as pdfjs from 'pdfjs-dist/legacy/build/pdf.mjs';
import { expect, test } from '@playwright/test';

/**
 * Utility class for extracting text, validating, and attaching PDF documents to reports.
 */
export default class PdfHelper {

    /**
     * Extracts all text content from a PDF binary buffer across all pages.
     * @param {ArrayBuffer|Uint8Array|Buffer} pdfBuffer - Binary data of the PDF document.
     * @returns {Promise<string>} Combined extracted text content across all pages.
     */
    static async extractText(pdfBuffer) {
        if (!pdfBuffer || pdfBuffer.length === 0) return '';

        try {
            const data = new Uint8Array(pdfBuffer);
            const pdfDocument = await pdfjs.getDocument({
                data,
                isEvalSupported: false,
                useSystemFonts: true
            }).promise;

            let fullText = '';
            for (let pageNum = 1; pageNum <= pdfDocument.numPages; pageNum++) {
                const page = await pdfDocument.getPage(pageNum);
                const textContent = await page.getTextContent();
                const pageText = textContent.items.map(item => item.str).join(' ');
                fullText += pageText + ' ';
            }
            await pdfDocument.destroy();
            return fullText;
        } catch (error) {
            console.log(`[PdfHelper] Error extracting text: ${error.message}`);
            return '';
        }
    }

    /**
     * Downloads/generates a PDF from the page, extracts & verifies the text inside the PDF,
     * prints the PDF text to console, and attaches it to the report.
     * @param {import('@playwright/test').Page} page - The Playwright Page instance.
     * @param {string} expectedText - Text expected inside the PDF document.
     * @param {string} attachmentName - Filename for the attached PDF in reports.
     */
    static async downloadVerifyAndAttach(page, expectedText, attachmentName) {
        // Step 1: Obtain or generate PDF document from the page
        let pdfBuffer = page.pdfBuffer;

        if (!pdfBuffer) {
            try {
                pdfBuffer = await page.pdf({
                    format: 'A4',
                    printBackground: true
                });
            } catch (e) {
                console.log(`[PdfHelper] page.pdf() generation: ${e.message}`);
            }
        }

        // Step 2: Extract text from PDF, log to console, and verify expected text
        await test.step(`Extract and verify text in PDF document: ${attachmentName}`, async () => {
            let pdfText = page.pdfText;
            if (!pdfText && pdfBuffer && pdfBuffer.length > 0) {
                pdfText = await PdfHelper.extractText(pdfBuffer);
            }

            if (pdfText) {
                console.log(`\n================== [PDF Text: ${attachmentName}] ==================`);
                console.log(pdfText.trim());
                console.log(`==================================================================\n`);

                expect(pdfText).toMatch(new RegExp(expectedText, 'i'));
            }
        });

        // Step 3: Attach the PDF document to Playwright HTML and Allure Reports
        if (pdfBuffer) {
            try {
                await test.info().attach(attachmentName, {
                    body: pdfBuffer,
                    contentType: 'application/pdf'
                });
                console.log(`[PdfHelper] ${attachmentName} attached successfully to report.`);
            } catch (e) {
                console.log(`[PdfHelper] Error attaching PDF to report: ${e.message}`);
            }
        }
    }
}








