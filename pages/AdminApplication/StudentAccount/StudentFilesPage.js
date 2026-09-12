import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';
import path from 'path';

/**
 * Page Object representing the Student Account > Files Page in Admin Portal.
 * Handles selecting students, uploading student files, category selection,
 * file preview, download, deletion, and row count assertions.
 **/
export default class StudentFilesPage extends BasePage {

    /**
     * Initializes locators for the Student Files Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Student selection locators (matching StudentProfilePage / EnrollmentBillingPage)
        this.studentNotSelected = page.getByRole('link', { name: 'STUDENT NOT SELECTED. CLICK' });
        this.studentSearch = page.locator('#studentList');
        this.goButton = page.getByRole('button', { name: 'GO' });

        // File upload locators
        this.fileUploadSection = page.locator('#divUploadFielPanel');
        this.fileInput = page.locator('input[type="file"]').first();
        this.categoryDropdown = page.getByRole('button', { name: '--Select--' });
        this.categoryDropdownOption = page.locator("(//select[@name='file_Category']//parent::div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.saveFilesButton = page.getByRole('button', { name: 'SAVE FILES' });

        // File row actions locators
        this.studentFileRows = page.locator("xpath=//div[@class='studentfilerow']");
        this.previewButton = page.locator("xpath=(//div[@class='studentfilerow']//a[contains(@class,'previewPDF')])[1]");
        this.downloadButton = page.locator("xpath=(//div[@class='studentfilerow']//a[contains(@href,'download')])[1]");
        this.deleteButton = page.locator("xpath=(//div[@class='studentfilerow']//a[contains(@data-toggle,'Delete')])[1]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        // Preview modal locators
        this.previewModal = page.locator("//div[@id='previewImage']//div[contains(@class,'modal-content')]");
        this.closePreviewButton = page.locator("//div[@id='previewImage']//button[text()='Close']");

        // Notification & Verification locators
        this.filesTable = page.locator('#divFilesListPanel');
    }

    /**
     * Returns locator for a specific category option in the dropdown list.
     * @param {string} categoryName - Category name to select.
     * @returns {import('@playwright/test').Locator}
     **/
    categoryOption(categoryName) {
        return this.page.locator('a').filter({ hasText: new RegExp(`^${categoryName}$`, 'i') }).first()
            .or(this.page.getByRole('link', { name: categoryName, exact: true }));
    }

    /**
     * Searches and selects a student by name in the Student Profile page.
     * @param {string} studentName - Student's name to search.
     **/
    async selectStudent(studentName) {
        await test.step(`Search and select student: "${studentName}"`, async () => {
            await this.click(this.studentNotSelected);
            await this.waitForVisible(this.studentSearch);
            await this.pressSequentially(this.studentSearch, studentName);

            const studentOption = this.page.getByText(studentName).first();
            await this.waitForVisible(studentOption);
            await this.click(studentOption);

            await this.click(this.goButton);
            await this.waitForLoaders();
            await this.waitForVisible(this.fileUploadSection);
        });
    }

    /**
     * Uploads a file by setting the file input.
     * @param {string} filePath - Path to the file to upload.
     **/
    async uploadFile(filePath) {
        await test.step(`Select file to upload: "${filePath}"`, async () => {
            await this.verifyVisible(this.fileUploadSection);
            const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
            await this.setInputFiles(this.fileInput, resolvedPath);
        });
    }

    /**
     * Selects a file category from the category dropdown.
     **/
    async selectCategory() {
        await test.step('Select file category', async () => {
            await this.click(this.categoryDropdown);
            await this.waitForVisible(this.categoryDropdownOption);
            await this.click(this.categoryDropdownOption);
        });
    }

    /**
     * Clicks the 'SAVE FILES' button and waits for loaders/network to settle.
     **/
    async clickSaveFiles() {
        await test.step('Click "SAVE FILES" button', async () => {
            await this.click(this.saveFilesButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
        });
    }

    /**
     * Completes the entire file upload workflow for a student: staging the file, choosing category, and saving.
     * @param {string} filePath - Path to the file.
     **/
    async uploadStudentFile(filePath) {
        await test.step(`Upload student file "${filePath}"`, async () => {
            await this.uploadFile(filePath);
            await this.selectCategory();
            await this.clickSaveFiles();
        });
    }

    /**
     * Verifies that the success notification "File(s) uploaded successfully." is displayed.
     **/
    async verifyFileUploadSuccess() {
        await test.step('Verify "File(s) uploaded successfully." message', async () => {
            await this.waitForVisible(this.page.getByText('File(s) uploaded successfully.', { exact: true }));
            await this.verifyVisible(this.page.getByText('File(s) uploaded successfully.', { exact: true }));
        });
    }

    /**
     * Returns the current number of uploaded file rows matching `//div[@class='studentfilerow']`
     * and attaches the count to the test report.
     * @param {string} [label='Files Count'] - Optional label describing the count stage.
     * @returns {Promise<number>}
     **/
    async getFilesCount(label = 'Files Count') {
        return await test.step(`Get count of files uploaded (${label})`, async () => {
            await this.page.waitForTimeout(1000);
            await this.waitForVisible(this.filesTable);
            await this.verifyVisible(this.filesTable);
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
            let count = 0;
            if (await this.isVisible(this.studentFileRows.first(), { timeout: 5000 }).catch(() => false)) {
                // await this.waitForVisible(this.studentFileRows.first());
                count = await this.studentFileRows.count();
            }

            // console.log(`[StudentFilesPage] ${label}: ${count}`);

            // try {
            //     // await test.info().attach(label, {
            //     //     body: `${label}: ${count}\nTotal visible file row(s): ${count}`,
            //     //     contentType: 'text/plain'
            //     // });
            //     await test.step(`${label}: ${count}`, async () => { });

            // } catch (e) {
            //     console.log(`[StudentFilesPage] Error attaching count to report: ${e.message}`);
            // }

            return count;
        });
    }

    /**
     * Clicks the preview (eye) icon for the first file row, verifies preview modal opens, and closes it.
     **/
    async previewFile() {
        await test.step('Preview uploaded student file', async () => {
            await this.verifyVisible(this.previewButton);
            await this.click(this.previewButton);
            await this.waitForLoaders();
            await this.page.waitForTimeout(2000);
            await this.waitForVisible(this.previewModal)
            await this.verifyVisible(this.previewModal);
            await this.waitForVisible(this.closePreviewButton)
            await this.click(this.closePreviewButton);
            await this.waitForHidden(this.closePreviewButton);


        });
    }

    /**
     * Clicks the download icon for the first file row, verifies download event, and attaches downloaded file to report.
     * @returns {Promise<import('@playwright/test').Download>}
     **/
    async downloadFile() {
        return await test.step('Download uploaded student file', async () => {
            await this.verifyVisible(this.downloadButton);
            const downloadPromise = this.page.waitForEvent('download');
            await this.click(this.downloadButton);
            const download = await downloadPromise;
            const fileName = download.suggestedFilename();
            console.log(`[StudentFilesPage] File downloaded successfully: ${fileName}`);
            expect(fileName).toBeTruthy();

            try {
                const filePath = await download.path();
                if (filePath) {
                    await test.info().attach(fileName, {
                        path: filePath
                    });
                    console.log(`[StudentFilesPage] Attached "${fileName}" to report.`);
                }
            } catch (error) {
                console.log(`[StudentFilesPage] Error attaching downloaded file to report: ${error.message}`);
            }

            return download;
        });
    }

    /**
     * Clicks the delete icon for the first file row and confirms deletion.
     **/
    async deleteFile() {
        await test.step('Delete uploaded student file and confirm deletion', async () => {
            await this.verifyVisible(this.deleteButton);
            await this.click(this.deleteButton);
            await this.waitForVisible(this.yesConfirmationButton);
            await this.click(this.yesConfirmationButton);
            await this.waitForHidden(this.yesConfirmationButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
            await this.page.waitForTimeout(2000);
        });
    }
}
