import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';
import PdfHelper from '../../../utils/PdfHelper';
import ExcelHelper from '../../../utils/ExcelHelper';

/**
 * Page Object representing the Classroom Attendance Page in Admin Portal.
 * Handles selecting sessions, adding students, marking attendance (Present/Absent),
 * handling file upload prompts, and verifying attendance submission.
 **/
export default class ClassroomAttendancePage extends BasePage {

    /**
     * Initializes locators for the Classroom Attendance Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);
        this.selectedAttendanceAction = null;
        this.beforeCheckedCount = 0;

        // Session selection
        this.sessionRadioBtn = page.locator('.radioinner').first();
        this.sessionRadioBtns = page.locator('.radioinner');
        this.noRecordMessage = page.getByText('No record exists.', { exact: true });

        // Student search & addition
        // this.searchStudentInput = page.getByRole('textbox', { name: 'Search Student' });
        this.addStudentBtn = page.getByRole('button', { name: 'ADD' });
        this.confirmYesBtn = page.locator("xpath=//div[contains(@id,'confirmation')]//a[text()='Yes']");

        // Attendance radio options
        this.presentRadioBtn = page.locator("xpath=(//label[not(contains(@class,'checkedTruePresent'))]//span[@class='checkstudentp1'])[1]");
        this.absentRadioBtn = page.locator("xpath=(//label[not(contains(@class,'checkedTrueAbsent'))]//span[@class='checkstudenta1'])[last()]");

        // Save & Feedback
        this.saveAttendanceBtn = page.getByRole('link', { name: 'SAVE' });
        this.alertNoButton = page.locator("xpath=//button[text()='No']");
        this.noFileUploadBtn = page.locator("xpath=//a[text()='No' and @data-apply='confirmation'] | //div[contains(@id,'confirmation')]//a[text()='No'] | //button[text()='No']");

        // Print Attendance Locators
        this.printAttendanceBtn = page.locator("xpath=//button[contains(text(),'PRINT ATTENDANCE')]");
        this.exportToPdfOption = page.locator("xpath=//button[contains(text(),'PRINT ATTENDANCE')]//parent::div//strong[contains(text(),'Export to PDF')]");
        this.exportToExcelOption = page.locator("xpath=//button[contains(text(),'PRINT ATTENDANCE')]//parent::div//strong[contains(text(),'Export to Excel')]");

        // Print Roster Locators
        this.printRosterBtn = page.locator("xpath=//button[contains(text(),'PRINT Roster')]");
        this.exportRosterToPdfOption = page.locator("xpath=//button[contains(text(),'PRINT Roster')]//parent::div//strong[contains(text(),'Export to PDF')]");
        this.exportRosterToExcelOption = page.locator("xpath=//button[contains(text(),'PRINT Roster')]//parent::div//strong[contains(text(),'Export to Excel')]");

        // Send Session Email Locators
        this.sendSessionEmailBtn = page.locator("xpath=//a[text()='SEND SESSION EMAIL']");
        this.selectAllStudentEmailCheckbox = page.locator("xpath=//input[@id='chkSelectAllStudentEmail']//following-sibling::span");
        this.composeEmailBtn = page.locator("xpath=//button[contains(text(),'COMPOSE') and contains(text(),'EMAIL')]");
        this.emailSubjectInput = page.getByPlaceholder('Email Subject');
        this.emailBodyContent = page.locator('.note-editable');
        this.sendEmailSubmitBtn = page.locator("xpath=(//button[text()='Send'])[1]");
        this.emailSentSuccessMessage = page.getByText('Email sent successfully.', { exact: true });

        // Tracked locators
        this.presentLabelLocator = null;
        this.absentLabelLocator = null;
    }


    /**
     * Selects a session radio button. If 'No record exists.' appears, clicks next sessions until records are found.
     **/
    async selectSession() {
        return await test.step('Select a classroom session with student records', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
            await this.waitForVisible(this.sessionRadioBtns.first());
            const count = await this.sessionRadioBtns.count();
            console.log(`Found ${count} sessions.`);
            for (let i = 0; i < count; i++) {
                const sessionRadio = this.sessionRadioBtns.nth(i);
                await this.click(sessionRadio);
                await this.waitForLoaders();
                await this.page.waitForLoadState('load');
                await this.page.waitForTimeout(5000);
                const isNoRecord = await this.noRecordMessage.isVisible({ timeout: 5000 }).catch(() => false);
                if (!isNoRecord) {
                    console.log(`Selected session #${i + 1} which has student records.`);
                    return;
                }
                console.log(`Session #${i + 1} has 'No record exists.'. Trying next session...`);
            }
            throw new Error('No session with student records found.');
        });
    }

    /**
     * Randomly marks a student as Present or Absent and records the checked count before selection.
     * @returns {Promise<{action: string, beforeCount: number}>}
     **/
    async markRandomAttendance() {

        await this.waitForLoaders();

        if (await this.isVisible(this.presentRadioBtn)) {
            await test.step(`Randomly mark student attendance as Present`, async () => {
                this.selectedAttendanceAction = 'Present';
                await this.waitForVisible(this.presentRadioBtn);
                this.beforeCheckedCount = await this.page.locator("xpath=//label[contains(@class,'checkedTruePresent')]").count();
                console.log(`[Random Selection] Chose: Present. Checked Present count before: ${this.beforeCheckedCount}`);
                await this.click(this.presentRadioBtn);
            });
        } else {
            await test.step(`Randomly mark student attendance as Absent`, async () => {
                this.selectedAttendanceAction = 'Absent';
                await this.waitForVisible(this.absentRadioBtn);
                this.beforeCheckedCount = await this.page.locator("xpath=//label[contains(@class,'checkedTrueAbsent')]").count();
                console.log(`[Random Selection] Chose: Absent. Checked Absent count before: ${this.beforeCheckedCount}`);
                await this.click(this.absentRadioBtn);
            });
        }

        await this.waitForLoaders();
        return { action: this.selectedAttendanceAction, beforeCount: this.beforeCheckedCount };

    }

    /**
     * Clicks the SAVE button and handles the file upload prompt by clicking NO if prompted.
     **/
    async saveAttendance() {
        await test.step('Click SAVE attendance button', async () => {
            await this.waitForVisible(this.saveAttendanceBtn);
            await this.click(this.saveAttendanceBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.alertNoButton);
            await this.click(this.alertNoButton);
            await this.waitForHidden(this.alertNoButton);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that 'Classroom attendance marked successfully.' confirmation message is displayed.
     **/
    async verifyAttendanceMarkedSuccessfully() {
        await test.step('Verify "Classroom attendance marked successfully." confirmation message', async () => {
            await this.waitForVisible(this.page.getByText('Classroom attendance marked successfully.', { exact: true }));
            await this.verifyVisible(this.page.getByText('Classroom attendance marked successfully.', { exact: true }));
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the checked count for the randomly selected action increased by 1 after saving.
     **/
    async verifyAttendanceCountIncremented() {
        await test.step(`Verify checked count for "${this.selectedAttendanceAction}" incremented by 1`, async () => {
            await this.waitForLoaders();

            if (this.selectedAttendanceAction === 'Present') {
                const afterCount = await this.page.locator("xpath=//label[contains(@class,'checkedTruePresent')]").count();
                console.log(`Checked Present count after save: ${afterCount}, expected: ${this.beforeCheckedCount + 1}`);
                expect(afterCount).toBe(this.beforeCheckedCount + 1);
            } else {
                const afterCount = await this.page.locator("xpath=//label[contains(@class,'checkedTrueAbsent')]").count();
                console.log(`Checked Absent count after save: ${afterCount}, expected: ${this.beforeCheckedCount + 1}`);
                expect(afterCount).toBe(this.beforeCheckedCount + 1);
            }
        });
    }

    /**
     * Clicks the PRINT ATTENDANCE button to open the export options dropdown.
     **/
    async clickPrintAttendance() {
        await test.step('Click on PRINT ATTENDANCE button', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.printAttendanceBtn);
            await this.click(this.printAttendanceBtn);
        });
    }

    /**
     * Selects 'Export to PDF' option, captures the PDF response/buffer, and waits for new popup tab to load.
     * @returns {Promise<import('@playwright/test').Page>} The popup Page instance with attached pdfText property.
     **/
    async exportToPdf() {
        await this.clickPrintAttendance();
        return await test.step('Click "Export to PDF" and wait for PDF tab to open', async () => {
            const popupPromise = this.page.waitForEvent('popup');
            await this.waitForVisible(this.exportToPdfOption);
            await this.click(this.exportToPdfOption);
            const pdfPage = await popupPromise;
            await pdfPage.waitForLoadState('domcontentloaded');
            return pdfPage;
        });
    }


    /**
     * Selects 'Export to EXCEL' option, waits for file download to complete.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async exportToExcel() {
        await this.clickPrintAttendance();

        return await test.step('Click "Export to Excel" and wait for file download', async () => {
            const downloadPromise = this.page.waitForEvent('download');
            await this.waitForVisible(this.exportToExcelOption);
            await this.click(this.exportToExcelOption);
            return await downloadPromise;
        });
    }

    /**
     * Verifies that an Excel file is downloaded successfully and contains the specified expected text.
     * Attaches the Excel file to Allure and Playwright HTML reports.
     * @param {import('@playwright/test').Download} download - The Playwright Download instance.
     * @param {string} expectedText - Text expected inside the downloaded Excel file (e.g., 'Attendance Report', 'Roster Report').
     **/
    async verifyExcelReportDownloaded(download, expectedText) {
        await test.step(`Verify downloaded Excel file contains text: "${expectedText}"`, async () => {
            expect(download).toBeTruthy();
            const fileName = download.suggestedFilename();
            console.log(`Downloaded file name: ${fileName}`);
            expect(fileName).toMatch(/\.xlsx?$/i);

            const content = await ExcelHelper.readContent(download);
            console.log(`Verifying Excel content contains: "${expectedText}"`);
            expect(content.toLowerCase()).toContain(expectedText.toLowerCase());
            console.log(`Excel content "${expectedText}" verified successfully.`);

            // Attach Excel file to Playwright and Allure Reports
            try {
                const filePath = await download.path();
                if (filePath) {
                    test.info().attach(fileName || 'Exported_Report.xls', {
                        path: filePath,
                        contentType: 'application/vnd.ms-excel'
                    });
                }
            } catch (e) {
                console.log('Error attaching Excel file:', e.message);
            }
        });
    }

    /**
     * Verifies the Roster PDF report in a new tab, using a polling wait for the page title
     * to become non-empty before asserting. This handles slower PDF load times in headless mode.
     * @param {import('@playwright/test').Page} pdfPage - The popup Page instance.
     * @param {string} expectedText - The expected text inside the PDF document (e.g., 'Roster Report').
     * @param {string} [attachmentName] - Filename for the attached PDF in reports.
     **/
    async verifyRosterPdfReport(pdfPage, expectedText, attachmentName = `${expectedText.replace(/\s+/g, '_')}.pdf`) {
        await test.step(`Verify Roster PDF report tab is loaded`, async () => {
            await pdfPage.waitForFunction(() => document.title.trim().length > 0, { timeout: 30000 }).catch(() => {
                console.log('Title did not become non-empty within 30s; proceeding with assertion.');
            });
            await expect(pdfPage).toHaveTitle(/Report/i, { timeout: 15000 });
        });
        await PdfHelper.downloadVerifyAndAttach(pdfPage, expectedText, attachmentName);
        await pdfPage.close().catch(() => {
        });
    }

    /**
     * Clicks the PRINT ROSTER button to open the export options dropdown.
     **/
    async clickPrintRoster() {
        await test.step('Click on PRINT ROSTER button', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.printRosterBtn);
            await this.click(this.printRosterBtn);
        });
    }

    /**
     * Selects 'Export to PDF' under PRINT ROSTER, captures the PDF response/buffer, and waits for new popup tab to load.
     * @returns {Promise<import('@playwright/test').Page>} The popup Page instance with attached pdfText property.
     **/
    async exportRosterToPdf() {
        await this.clickPrintRoster();
        return await test.step('Click "Export to PDF" under Print Roster and wait for PDF tab', async () => {
            const popupPromise = this.page.waitForEvent('popup');
            await this.waitForVisible(this.exportRosterToPdfOption);
            await this.click(this.exportRosterToPdfOption);
            const pdfPage = await popupPromise;
            await pdfPage.waitForLoadState('domcontentloaded');
            return pdfPage;
        });
    }

    /**
     * Selects 'Export to EXCEL' under PRINT ROSTER, waits for file download to complete.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async exportRosterToExcel() {
        await this.clickPrintRoster();

        return await test.step('Click "Export to Excel" under Print Roster and wait for download', async () => {
            const downloadPromise = this.page.waitForEvent('download');
            await this.waitForVisible(this.exportRosterToExcelOption);
            await this.click(this.exportRosterToExcelOption);
            return await downloadPromise;
        });
    }

    /**
     * Clicks 'SEND SESSION EMAIL' button on the Attendance page.
     **/
    async clickSendSessionEmail() {
        await test.step('Click SEND SESSION EMAIL button', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.sendSessionEmailBtn);
            await this.click(this.sendSessionEmailBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * In Communication Center popup, selects all Student Emails and clicks COMPOSE EMAIL.
     **/
    async selectStudentsAndComposeEmail() {
        await test.step('Select all student email checkbox and click COMPOSE EMAIL', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.selectAllStudentEmailCheckbox);
            await this.click(this.selectAllStudentEmailCheckbox);
            await this.page.waitForTimeout(1500);
            await this.waitForVisible(this.composeEmailBtn);
            await this.click(this.composeEmailBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * In Send Email popup, fills the Subject and Body content, and clicks SEND.
     * @param {string} subject - The email subject text.
     * @param {string} body - The email body content.
     **/
    async fillAndSendEmail(subject, body) {
        await test.step('Fill email subject, body content and click SEND', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.emailSubjectInput);
            await this.fill(this.emailSubjectInput, subject);
            await this.waitForVisible(this.emailBodyContent);
            await this.fill(this.emailBodyContent, body);

            // Listen for send email API response
            this.sendEmailResponsePromise = this.page.waitForResponse(
                response => response.url().includes('Classroom/CRAttendanceSendEmailToMultipleRecipient') && response.status() === 200
                , { timeout: 30000 });

            await this.waitForVisible(this.sendEmailSubmitBtn);
            await this.click(this.sendEmailSubmitBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
        });
    }

    /**
     * Verifies that the CRAttendanceSendEmailToMultipleRecipient API response returned IsSuccess: true.
     **/
    async verifySendEmailResponse() {
        await test.step('Verify send session email API response is successful', async () => {
            const response = await this.sendEmailResponsePromise;
            const responseData = await response.json();
            expect(responseData.IsSuccess).toBe(true);
        });
    }

    /**
     * Verifies that 'Email sent successfully.' confirmation message appears.
     **/
    async verifyEmailSentSuccessfully() {
        await test.step('Verify "Email sent successfully." message is displayed', async () => {
            await this.waitForVisible(this.emailSentSuccessMessage, { timeout: 30000 });
            await this.verifyVisible(this.emailSentSuccessMessage, { timeout: 30000 });
            await this.waitForLoaders();
        });
    }
}








