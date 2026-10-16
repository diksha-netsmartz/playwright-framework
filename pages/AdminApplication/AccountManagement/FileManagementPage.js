import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';
import path from 'path';
import { credentials } from '@config/config';

/**
 * Page Object representing the File Management module in C-Admin
 * (Account Management > File Management).
 *
 * Handles:
 * - Student(s) File Upload (TC139)
 * - File Categories Add / Edit / Verify / Delete (TC140)
 * - File Search, Download, and Show To Student update (TC141)
 **/
export default class FileManagementPage extends BasePage {

    /**
     * Initializes locators for File Management page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Sidebar Navigation within File Management
        this.studentFileUploadLink = page.getByRole('link', { name: 'Student(s) File Upload' });
        this.classFileUploadLink = page.getByRole('link', { name: 'Class File Upload' });
        this.classSessionFileUploadLink = page.getByRole('link', { name: 'Class Session File Upload' });
        this.fileManagementLink = page.locator('.title').filter({ hasText: 'File Management' });
        this.fileSearchLink = page.getByRole('link', { name: 'File Search' })
        this.activityLogLink = page.getByRole('link', { name: 'Activity Log', exact: true });

        // Student File Upload Locators
        this.studentSearchInput = page.locator("//ul[contains(@id,'StudentMultiSelect')]//following-sibling::input");
        this.chooseFileInput = page.locator('input[type="file"]').filter({ visible: true });
        this.selectCategoriesBtn = page.getByRole('button', { name: 'Select Categories' }).first();
        this.selectAllCategoriesCheckbox = page.locator("input[value='multiselect-all']:visible");
        this.startButton = page.locator('.files .start:visible').first();
        this.previewLink = page.locator("//a//span[normalize-space()='Preview']").filter({ visible: true });
        this.filePreviewModal = page.getByRole('heading', { name: 'Uploaded File' }).filter({ visible: true });
        this.previewFrame = page.locator('#objFileViewinpopup:visible');
        this.closePreviewBtn = page.locator('#fileViewheader').getByRole('button', { name: 'Close' }).filter({ visible: true });
        this.verifyTableBtn = page.locator("//a//span[normalize-space()='Verify']").filter({ visible: true });
        this.verifyModalConfirmBtn = page.getByRole('button', { name: 'Verify', exact: true }).filter({ visible: true });
        this.verifiedAndSavedStatus = page.locator('td').filter({ hasText: 'Verified and Saved' });
        this.uploadSuccessMsg = page.getByText('Document(s) uploaded. Please preview and verify to save the documents.');
        this.fileVerifiedSuccessMsg = page.getByText('Document(s) saved successfully.');
        this.deleteFileUploadIcon = page.locator('i.fa.fa-trash-o:visible')
        this.cancelFileUploadButton = page.locator('.files .cancel:visible').first();
        this.fileUploadRows = page.locator('.fileupload tbody tr');


        // Class & Class Session File Upload Locators
        this.classSearchInput = page.getByRole('textbox', { name: 'Select Class Room' }).filter({ visible: true });
        this.classSearchOption = (/** @type {string | RegExp} */ classRoomName) => page.getByRole('option', { name: new RegExp(classRoomName, 'i') }).filter({ visible: true }).first();
        this.getSessionsBtn = page.getByRole('button', { name: /Get Sessions/i });
        this.selectSessionsBtn = page.getByRole('button', { name: /Select Sessions/i });
        this.selectAllSessionsOption = page.locator("//input[@id='chkSessionSelect']//following-sibling::ins")

        // File Category Locators
        this.addNewCategoryBtn = page.locator('#btnNewCategory:visible');
        this.categoryNameInput = page.getByRole('textbox', { name: 'Enter Category Name' }).first();
        this.signatureLinkInput = page.getByRole('textbox', { name: 'Enter Signature Link' }).first();
        this.categoryNoteInput = page.getByRole('textbox', { name: 'Category Note' }).first();
        this.packagesSelectableItemForAdd = page.locator("xpath=//div[contains(@id,'MultiPackagesAdd')]//li[@class='ms-elem-selectable']");
        this.packagesSelectableItemForUpdate = page.locator("xpath=//div[contains(@id,'MultiPackagesUpdate')]//li[@class='ms-elem-selectable']");
        this.packagesSelectedForUpdate = page.locator("xpath=//div[contains(@id,'MultiPackagesUpdate')]//li[@class='ms-elem-selection ms-selected']");
        this.categoryModalSwitches = page.locator('.bootstrap-switch:visible');
        this.categoryModalSwitchLabels = page.locator('.bootstrap-switch-label:visible');
        this.saveCategoryBtn = page.locator('#btnSaveCategory');
        this.updateCategoryBtn = page.getByRole('button', { name: 'Update' });
        this.categoryUpdateSuccessAlert = page.getByText('Success! Category updated');
        this.closeCategoryModalBtn = page.locator("(//div[@id='editCategory' or @id='addCategory']//button[text()='Close'])[last()]");
        this.deleteConfirmYesBtn = page.locator('#btnYesDelete:visible');
        this.savedToggleStates = [];

        // Form State / Runtime Values
        this.isPackagesSelected = false;
        this.isPackagesUpdated = false;
        this.categoryName = '';
        this.signatureLink = '';
        this.categoryNote = '';
        this.updatedCategoryName = '';
        this.updatedSignatureLink = '';
        this.updatedCategoryNote = '';

        // File Search Locators
        this.searchBtn = page.getByRole('button', { name: 'Search' });
        this.selectFileCheckbox = page.locator("(//input[contains(@class,'gridCheckbox')]//following-sibling::ins)[1]");
        this.selectShowToStudentCheckbox = page.locator("(//input[contains(@class,'gridCheckboxshowtostudent')]//following-sibling::ins)[1]");
        this.selectShowToStudentCheckboxWrapper = page.locator("(//input[contains(@class,'gridCheckboxshowtostudent')]//parent::div)[1]");
        this.downloadSelectedFilesBtn = page.getByRole('button', { name: 'Download Selected Files' });
        this.updateShowToStudentBtn = page.getByRole('button', { name: 'Update Show To Student' });
        this.updateShowToStudentSuccessMsg = page.getByText('Successfully updated Show to Student .');
        this.previousShowToStudentState = false;

        // Activity Log Locators
        this.activityLogFromDateInput = page.locator('#txtFromDate')
        this.activityLogToDateInput = page.locator('#txtToDate')
        this.monthFirstDay = page.locator("(//td[@class='day'])[1]");
        this.monthToday = page.locator("(//td[@class='today day'])[1]");
        this.activityLogTableWrapper = page.locator('#ActivityLogGrid');
        this.activityLogRows = page.locator('#ActivityLogGrid tbody tr');
        this.activityLogNoDataMessage = page.getByText('No data available in table', { exact: true });

        // Settings & Rights Management Locators
        this.settingsLink = page.getByRole('link', { name: /Settings/i });
        this.rightsManagementLink = page.locator('a').filter({ hasText: 'Rights Management' }).first();
        this.selectGroupDropdown = page.getByRole('link', { name: /Select Group/i });
        this.groupOption = page.locator("(//span[text()='Select Group']//parent::a//following-sibling::ul//li//a[not(text()='Select')])[1]");
        this.submitRightsBtn = page.getByRole('button', { name: /Submit/i });
        this.userRightsSuccessMsg = page.getByText('Success! Rights updated successfully.');
        this.fileUploadSetting = page.getByRole('link', { name: /File Upload Setting/i });
        this.learnMoreDescriptionEditor = page.locator("//label[text()='Learn More Description ']//parent::div//div[@class='note-editable']//p").first();
        this.viewEditorListItems = page.locator("//label[text()='View']//parent::div//div[@class='note-editable']//ul//li");
        this.viewEditor = page.locator("//label[text()='View']//parent::div//div[@class='note-editable']");
        this.categoryMandatoryToggle = page.locator("//label[contains(text(),'Category Mandatory')]//parent::div//label[contains(@class,'switch')]");
        this.categoryMandatoryToggleWrapper = page.locator("//label[contains(text(),'Category Mandatory')]//parent::div//div[contains(@class,'bootstrap-switch-wrapper')]");
        this.fileSize = page.locator('#txt_int_FileSize');
        this.allowedNumberOfFiles = page.locator('#txt_int_AllowedNoOfFiles');
        this.saveButton = page.getByRole('button', { name: 'SAVE' }).filter({ visible: true });
        this.successMsg = page.getByText('Success! Information was successfully saved.');
        this.fileUploadCategorySetting = page.getByRole('link', { name: /File Upload Category Setting/i });
        this.categoryLearnMoreDescriptionEditor = page.locator("//div[@id='file_upload_category_settings']//label[contains(text(),'Learn More Description')]//parent::div//div[@class='note-editable']//p");
        this.widgetViewDescriptionEditor = page.locator("//label[text()='Widget View Description']//parent::div//div[@class='note-editable']//ol//li//span");
        this.widgetViewDescriptionEditorListItems = page.locator("//label[text()='Widget View Description']//parent::div//div[@class='note-editable']//ol//li");
        this.uploadViewDescriptionEditor = page.locator("//label[text()='Upload View Description']//parent::div//div[@class='note-editable']//ol//li//span");
        this.uploadViewDescriptionEditorListItems = page.locator("//label[text()='Upload View Description']//parent::div//div[@class='note-editable']//ol//li");
        this.categoryFileSize = page.locator('#txt_int_FileSize_Category');
    }

    /* =========================================================================
     * Navigation Methods within File Management Module
     * ========================================================================= */

    /**
     * Navigates to Student(s) File Upload page.
     **/
    async navigateToStudentFileUpload() {
        await test.step('Navigate to Student(s) File Upload', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentFileUploadLink);
            await this.click(this.studentFileUploadLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            });
            await this.waitForVisible(this.studentSearchInput);
        });
    }

    /**
     * Navigates to Class File Upload page.
     **/
    async navigateToClassFileUpload() {
        await test.step('Navigate to Class File Upload', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.classFileUploadLink);
            await this.click(this.classFileUploadLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            });
            await this.waitForVisible(this.classSearchInput);
        });
    }

    /**
     * Navigates to Class Session File Upload page.
     **/
    async navigateToClassSessionFileUpload() {
        await test.step('Navigate to Class Session File Upload', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.classSessionFileUploadLink);
            await this.click(this.classSessionFileUploadLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            });
            await this.waitForVisible(this.classSearchInput);
        });
    }

    /**
     * Navigates to File Search page.
     **/
    async navigateToFileSearch() {
        await test.step('Navigate to File Search', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.fileManagementLink)
            await this.click(this.fileManagementLink)
            await this.waitForVisible(this.fileSearchLink);
            await this.click(this.fileSearchLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            });
            await this.waitForVisible(this.searchBtn);
        });
    }

    /**
     * Navigates to Activity Log within File Management.
     **/
    async navigateToActivityLog() {
        await test.step('Navigate to Activity Log', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.fileManagementLink);
            await this.click(this.fileManagementLink);
            await this.waitForVisible(this.activityLogLink);
            await this.click(this.activityLogLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            });
            await this.verifyURLContainsText('ActivityLog');
        });
    }

    /**
     * Clicks on Rights Management under Settings.
     **/
    async navigateToRightsManagement() {
        await test.step('Navigate to Setting > Rights Management', async () => {
            await this.waitForVisible(this.settingsLink);
            await this.click(this.settingsLink);
            await this.waitForVisible(this.rightsManagementLink);
            await this.click(this.rightsManagementLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            });
            await this.verifyTitle('User Rights');
        });
    }

    /* =========================================================================
     *  File Upload Methods 
     * ========================================================================= */

    /**
     * Searches and selects a student by name.
     * @param {string} [studentName] - Student username or name keyword. Defaults to credentials.studentUser.name.
     **/
    async selectStudent(studentName = credentials?.studentUser?.name || 'testautomation_donotuse') {
        await test.step(`Select student: "${studentName}"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentSearchInput);
            await this.pressSequentially(this.studentSearchInput, studentName);
            const studentOption = this.page.getByRole('option', { name: new RegExp(studentName, 'i') });
            await this.waitForVisible(studentOption);
            await this.click(studentOption);
        });
    }

    /**
     * Searches and selects a class room by name.
     * @param {string} classRoomName - Class room name or keyword.
     **/
    async selectClassRoom(classRoomName) {
        await test.step(`Select class room: "${classRoomName}"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.classSearchInput);
            await this.pressSequentially(this.classSearchInput, classRoomName);
            const classOption = this.classSearchOption(classRoomName);
            await this.waitForVisible(classOption);
            await this.click(classOption);
        });
    }

    /**
     * Clicks Get Sessions button and waits for sessions dropdown.
     **/
    async clickGetSessions() {
        await test.step('Click Get Sessions button', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.getSessionsBtn);
            await this.click(this.getSessionsBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.selectSessionsBtn);
        });
    }

    /**
     * Selects all class sessions from the Sessions dropdown.
     **/
    async selectAllSessions() {
        await test.step(`Select session(s)"`, async () => {
            await this.waitForVisible(this.selectSessionsBtn);
            await this.click(this.selectSessionsBtn);
            await this.waitForVisible(this.selectAllSessionsOption);
            await this.click(this.selectAllSessionsOption);
            await this.waitForHidden(this.selectSessionsBtn);

        });
    }


    /**
     * Selects and attaches a file for upload.
     * @param {string|string[]} filePaths - Absolute or relative path(s) to the file(s) to upload.
     **/
    async selectUploadFile(filePaths) {
        const filesToUpload = Array.isArray(filePaths) ? filePaths : [filePaths];
        const resolvedPaths = filesToUpload.map((filePath) => path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath));

        await test.step(`Upload ${filesToUpload.length} file(s) for}`, async () => {
            await this.setInputFiles(this.chooseFileInput, resolvedPaths);
            await this.waitForVisible(this.fileUploadRows.first());
            await expect(this.fileUploadRows).toHaveCount(filesToUpload.length);
        });
    }

    /**
     * Selects all categories from the Categories dropdown.
     **/
    async selectAllCategories() {
        await test.step('Select all file categories', async () => {
            await this.waitForVisible(this.selectCategoriesBtn);
            await this.click(this.selectCategoriesBtn);
            await this.waitForVisible(this.selectAllCategoriesCheckbox);
            await this.selectAllCategoriesCheckbox.check();
        });
    }

    /**
     * Clicks the Start upload button and verifies the upload success notification.
     **/
    async startUploadAndVerify() {
        await test.step('Click Start button and verify upload notification', async () => {
            await this.waitForVisible(this.startButton);
            await this.click(this.startButton);
            await this.waitForVisible(this.uploadSuccessMsg);
            await this.verifyVisible(this.uploadSuccessMsg);
        });
    }

    /**
     * Opens file preview modal and verifies the uploaded file preview.
     * @param {string} [fileType]
     */
    async previewFileAndClose(fileType) {
        await test.step('Preview uploaded file and close preview modal', async () => {
            await this.waitForVisible(this.previewLink);

            const previewResponsePromise = this.page.waitForResponse(
                (resp) => resp.url().includes('/Upload/Preview') && resp.status() === 200,
                { timeout: 20000 }
            ).catch(() => null);

            await this.click(this.previewLink);
            const previewResponse = await previewResponsePromise;

            await this.waitForVisible(this.filePreviewModal);
            await this.verifyVisible(this.filePreviewModal);
            await this.waitForVisible(this.previewFrame);
            await this.verifyVisible(this.previewFrame);

            const src = await this.previewFrame.getAttribute('src');
            expect(src && src.includes('Preview')).toBeTruthy();

            if (fileType === 'pdf') {
                const contentType = previewResponse.headers()['content-type'] || '';
                expect(contentType.toLowerCase()).toContain('application/pdf');

            } else {
                expect(src && src.length > 0).toBeTruthy();
            }

            await this.click(this.closePreviewBtn);
            await this.waitForHidden(this.filePreviewModal);
        });
    }


    /**
     * Deletes file upload and verifies the uploaded file is removed.
     **/
    async deleteFileUpload() {
        await test.step('Delete file upload', async () => {
            const matchingRows = this.fileUploadRows;
            const rowCountBefore = await matchingRows.count();
            await this.waitForVisible(this.deleteFileUploadIcon);
            await this.click(this.deleteFileUploadIcon);
            await this.waitForHidden(this.deleteFileUploadIcon);
            await expect(matchingRows).toHaveCount(rowCountBefore - 1);

        });
    }

    /**
    * Cancels file upload and verifies the uploaded file is removed.
    **/
    async cancelFileUpload() {
        await test.step('Cancel file upload', async () => {
            const matchingRows = this.fileUploadRows;
            const rowCountBefore = await matchingRows.count();
            await this.waitForVisible(this.cancelFileUploadButton);
            await this.click(this.cancelFileUploadButton);
            await expect(matchingRows).toHaveCount(rowCountBefore - 1);

        });
    }

    /**
     * Clicks Verify button in the file list and confirms verification in the modal.
     **/
    async verifyAndSaveDocument() {
        await test.step('Click Verify button and confirm document save', async () => {
            await this.waitForVisible(this.verifyTableBtn);
            await this.click(this.verifyTableBtn);
            await this.waitForVisible(this.verifyModalConfirmBtn);
            await this.click(this.verifyModalConfirmBtn);
            await this.waitForHidden(this.verifyModalConfirmBtn);
            await this.waitForVisible(this.fileVerifiedSuccessMsg);
            await this.verifyVisible(this.fileVerifiedSuccessMsg);
            await this.waitForVisible(this.verifiedAndSavedStatus);
            await this.verifyVisible(this.verifiedAndSavedStatus);
        });
    }

    /* =========================================================================
     * File Category Methods 
     * ========================================================================= */

    /**
     * Clicks "Add New Category" button.
     **/
    async clickAddNewCategory() {
        await test.step('Click "Add New Category" button', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewCategoryBtn);
            await this.click(this.addNewCategoryBtn);
            await this.waitForVisible(this.categoryNameInput);
        });
    }

    /**
     * Toggles all switches present in the visible modal and stores their states after clicking.
     * @returns {Promise<boolean[]>} Stored states of switches after clicking.
     **/
    async toggleAllVisibleSwitches() {
        return await test.step('Toggle all switches present in modal and store states', async () => {
            await this.page.waitForTimeout(300);
            await this.waitForVisible(this.categoryModalSwitches.first());
            const count = await this.categoryModalSwitches.count();
            for (let i = 0; i < count; i++) {
                const switchLabel = this.categoryModalSwitchLabels.nth(i);
                if (await switchLabel.isVisible().catch(() => false)) {
                    await switchLabel.click();
                } else {
                    await this.categoryModalSwitches.nth(i).click();
                }
                await this.page.waitForTimeout(150);
            }

            // Store their states after clicking
            this.savedToggleStates = [];
            for (let i = 0; i < count; i++) {
                const cls = (await this.categoryModalSwitches.nth(i).getAttribute('class').catch(() => '')) || '';
                const isOn = cls.includes('bootstrap-switch-on') || cls.includes('switch-on');
                this.savedToggleStates.push(isOn);
            }
            return this.savedToggleStates;
        });
    }

    /**
     * Verifies that all switches in the modal match the saved states.
     **/
    async verifyVisibleSwitchStates() {
        return await test.step('Verify switches in modal match saved states', async () => {
            if (!this.savedToggleStates || this.savedToggleStates.length === 0) return;
            await this.page.waitForTimeout(300);
            const count = await this.categoryModalSwitches.count();
            expect(count, 'Expected number of switches to match saved count').toBe(this.savedToggleStates.length);

            for (let i = 0; i < count; i++) {
                const cls = (await this.categoryModalSwitches.nth(i).getAttribute('class').catch(() => '')) || '';
                const isOn = cls.includes('bootstrap-switch-on') || cls.includes('switch-on');
                expect(isOn, `Expected switch ${i + 1} state to match saved state`).toBe(this.savedToggleStates[i]);
            }
        });
    }


    /**
     * Fills in Category form fields: name, signature link, note, toggles all switches
     * while storing their states after clicking, and selects all available packages.
     * @param {Object} details
     * @param {string} details.name - Category Name.
     * @param {string} details.signatureLink - Signature Link URL/text.
     * @param {string} details.note - Category note.
     * @param {string} [details.packageText] - Optional single package text fallback.
     **/
    async fillCategoryForm({ name, signatureLink, note, packageText }) {
        await test.step(`Fill Category form with name: "${name}"`, async () => {
            this.categoryName = name;
            this.signatureLink = signatureLink;
            this.categoryNote = note;

            await this.waitForVisible(this.categoryNameInput);
            await this.fill(this.categoryNameInput, name);

            await this.fill(this.signatureLinkInput, signatureLink);

            await this.fill(this.categoryNoteInput, note);

            // Toggle all switches present on page/modal and store their states after clicking
            await this.toggleAllVisibleSwitches();

            const selectableCount = await this.packagesSelectableItemForAdd.count();
            if (selectableCount > 0) {
                for (let i = 0; i < selectableCount; i++) {
                    if (await this.isVisible(this.packagesSelectableItemForAdd.first())) {
                        await this.jsClick(this.packagesSelectableItemForAdd.first());
                    }
                }
                this.isPackagesSelected = true;
                this.selectedPackagesCount = selectableCount;
            } else {
                this.isPackagesSelected = false;
                this.selectedPackagesCount = 0;
            }
        });
    }

    /**
     * Clicks Save button in Category modal.
     **/
    async saveCategory() {
        await test.step('Click Save button for new Category', async () => {
            await this.waitForVisible(this.saveCategoryBtn);
            await this.click(this.saveCategoryBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            });
        });
    }

    /**
     * Finds a category row across pages by clicking "Next" until found.
     * @param {string} categoryName
     * @returns {Promise<import('@playwright/test').Locator>}
     **/
    async findCategoryRow(categoryName) {
        await this.waitForLoaders();
        const row = this.page.locator('#DashboardCategoryList tr').filter({ hasText: categoryName }).first();
        const nextBtn = this.page.locator('#DashboardCategoryList_paginate li.next:not(.disabled) a');

        while (!await row.isVisible().catch(() => false) && await nextBtn.isVisible().catch(() => false)) {
            await this.click(nextBtn);
            await this.waitForLoaders();
        }
        return row;
    }

    /**
     * Finds a category by name in the grid (paginating if necessary) and clicks its Edit button.
     * @param {string} categoryName - Category name to locate.
     **/
    async clickEditCategory(categoryName) {
        await test.step(`Click Edit button for Category: "${categoryName}"`, async () => {
            const categoryRow = await this.findCategoryRow(categoryName);
            await this.waitForVisible(categoryRow);
            const editBtn = categoryRow.locator('a[onclick*="Edit"]').first();
            await this.click(editBtn);
            await this.waitForVisible(this.categoryNameInput);
        });
    }

    /**
     * Verifies that the fields in the Category modal match expected saved/updated details,
     * verifies that toggle states match saved states, and verifies packages selection based on runtime values.
     * @param {Object} [expected={}]
     * @param {string} [expected.name] - Expected Category Name (defaults to runtime categoryName / updatedCategoryName).
     * @param {string} [expected.signatureLink] - Expected Signature Link (defaults to runtime signatureLink / updatedSignatureLink).
     * @param {string} [expected.note] - Expected Category Note (defaults to runtime categoryNote / updatedCategoryNote).
     * @param {boolean} [expected.verifyToggles=true] - Whether to verify switches match saved states.
     * @param {boolean} [expected.verifyPackages=true] - Whether to verify packages selection state.
     **/
    async verifyCategoryDetailsInModal({ name, signatureLink, note, verifyToggles = true, verifyPackages = true } = {}) {
        const expectedName = name || (this.isPackagesUpdated ? this.updatedCategoryName : this.categoryName);
        const expectedSigLink = signatureLink || (this.isPackagesUpdated ? this.updatedSignatureLink : this.signatureLink);
        const expectedNote = note || (this.isPackagesUpdated ? this.updatedCategoryNote : this.categoryNote);

        await test.step(`Verify Category details inside modal for "${expectedName}"`, async () => {
            await this.waitForVisible(this.categoryNameInput);
            await expect(this.categoryNameInput).toHaveValue(expectedName);
            await expect(this.signatureLinkInput).toHaveValue(expectedSigLink);
            await expect(this.categoryNoteInput).toHaveValue(expectedNote);

            if (verifyToggles) {
                await this.verifyVisibleSwitchStates();
            }

            if (verifyPackages) {
                if (this.isPackagesSelected && !this.isPackagesUpdated) {
                    await expect(this.packagesSelectableItemForUpdate).toHaveCount(0);
                    expect(await this.packagesSelectedForUpdate.count()).toBeGreaterThan(0);
                } else if (this.isPackagesUpdated) {
                    await expect(this.packagesSelectedForUpdate).toHaveCount(0);
                    expect(await this.packagesSelectableItemForUpdate.count()).toBeGreaterThan(0);
                }
            }
        });
    }

    /**
     * Updates category details: updates name, signature link, and note, toggles all switches
     * and stores resulting states, removes all packages from selected list, clicks Update button,
     * and verifies the update success message.
     * @param {Object} updatedDetails
     * @param {string} updatedDetails.name - Updated Category Name.
     * @param {string} updatedDetails.signatureLink - Updated Signature Link.
     * @param {string} updatedDetails.note - Updated Category Note.
     * @param {string} [updatedDetails.packageText] - Optional package text.
     **/
    async updateCategoryDetails({ name, signatureLink, note, packageText }) {
        await test.step(`Update Category details to name: "${name}"`, async () => {
            this.updatedCategoryName = name;
            this.updatedSignatureLink = signatureLink;
            this.updatedCategoryNote = note;

            await this.waitForVisible(this.categoryNameInput);
            await this.fill(this.categoryNameInput, name);

            await this.click(this.signatureLinkInput);
            await this.fill(this.signatureLinkInput, signatureLink);

            await this.click(this.categoryNoteInput);
            await this.fill(this.categoryNoteInput, note);

            // Toggle all switches present in modal and store states after clicking (same for update)
            await this.toggleAllVisibleSwitches();

            // In update remove all from selected and verify no items are selected
            const selectedCount = await this.packagesSelectedForUpdate.count();
            if (selectedCount > 0) {
                for (let i = 0; i < selectedCount; i++) {
                    if (await this.isVisible(this.packagesSelectedForUpdate.first())) {
                        await this.jsClick(this.packagesSelectedForUpdate.first());
                    }
                }
                this.isPackagesUpdated = true;
            } else {
                this.isPackagesUpdated = false;
            }

            await this.click(this.updateCategoryBtn);
            await this.waitForVisible(this.categoryUpdateSuccessAlert);
            await this.verifyVisible(this.categoryUpdateSuccessAlert);
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks close button in add/edit category modal.
     **/
    async closeCategoryModal() {
        await test.step('Click close button in category modal', async () => {
            await this.waitForVisible(this.closeCategoryModalBtn);
            await this.click(this.closeCategoryModalBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            });
        });
    }


    /**
     * Deletes a category by name (paginating if necessary) and confirms deletion.
     * @param {string} categoryName - Category name to delete.
     **/
    async deleteCategory(categoryName) {
        await test.step(`Delete Category: "${categoryName}"`, async () => {
            const categoryRow = await this.findCategoryRow(categoryName);
            await this.waitForVisible(categoryRow);
            const deleteBtn = categoryRow.locator('a[onclick*="Delete"]').first();
            await this.click(deleteBtn);
            await this.waitForVisible(this.deleteConfirmYesBtn);
            await this.click(this.deleteConfirmYesBtn);
            await this.waitForLoaders();
            await expect(this.page.locator('#DashboardCategoryList tbody tr, tr').filter({ hasText: categoryName })).toHaveCount(0);
        });
    }

    /* =========================================================================
     * File Search Methods
     * ========================================================================= */

    /**
     * Clicks Search button in File Search.
     **/
    async searchFiles() {
        await test.step('Click Search button in File Search', async () => {
            await this.waitForVisible(this.searchBtn);
            await this.click(this.searchBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            });
        });
    }

    /**
     * Selects file row checkbox and downloads the selected file.
     * @returns {Promise<import('@playwright/test').Download>}
     **/
    async selectAndDownloadFile() {
        return await test.step('Select file and click Download Selected Files', async () => {

            await this.waitForVisible(this.selectFileCheckbox);
            await this.click(this.selectFileCheckbox);

            const downloadPromise = this.page.waitForEvent('download');
            await this.waitForVisible(this.downloadSelectedFilesBtn);
            await this.click(this.downloadSelectedFilesBtn);

            const download = await downloadPromise;
            const fileName = download.suggestedFilename() || 'Downloaded File';

            try {
                const filePath = await download.path();
                if (filePath) {
                    await test.info().attach(fileName, {
                        path: filePath
                    });
                }
            } catch (error) {
                console.log(`[FileManagementPage] Error attaching downloaded file to report: ${error.message}`);
            }

            return download;
        });
    }

    /**
     * Toggles the "Show to Student" checkbox and updates status.
     * Records the state before toggling so it can be verified after reload/search.
     * @returns {Promise<boolean>} Whether the checkbox was checked before toggling.
     **/
    async toggleAndUpdateShowToStudent() {
        return await test.step('Toggle Show to Student checkbox and click Update', async () => {
            await this.waitForVisible(this.selectShowToStudentCheckboxWrapper);
            const classAttr = (await this.selectShowToStudentCheckboxWrapper.getAttribute('class')) || '';
            const wasChecked = classAttr.includes('checked');

            await this.waitForVisible(this.selectShowToStudentCheckbox);
            await this.click(this.selectShowToStudentCheckbox);
            await this.waitForVisible(this.updateShowToStudentBtn);
            await this.click(this.updateShowToStudentBtn);
            await this.waitForVisible(this.updateShowToStudentSuccessMsg);
            await this.verifyVisible(this.updateShowToStudentSuccessMsg);

            this.previousShowToStudentState = wasChecked;
            return wasChecked;
        });
    }

    /**
     * Verifies that the Show to Student checkbox state has inverted compared to before.
     * If it was checked before, verifies it is now unchecked (does not have 'checked' class).
     * If it was unchecked before, verifies it is now checked (has 'checked' class).
     * @param {boolean} [wasChecked=this.previousShowToStudentState] - Previous state before toggle.
     **/
    async verifyShowToStudentState(wasChecked = this.previousShowToStudentState) {
        await test.step(`Verify Show to Student checkbox state inverted (wasChecked: ${wasChecked})`, async () => {
            await this.waitForVisible(this.selectShowToStudentCheckboxWrapper);
            if (wasChecked) {
                await expect(this.selectShowToStudentCheckboxWrapper).not.toHaveClass(/checked/);
            } else {
                await expect(this.selectShowToStudentCheckboxWrapper).toHaveClass(/checked/);
            }
        });
    }

    /* =========================================================================
    * Activity Log Methods
    * ========================================================================= */

    /**
     * Selects the Activity Log date range.
     **/
    async setActivityLogDateRange() {
        await test.step(`Set Activity Log date range for the current month`, async () => {
            await this.waitForVisible(this.activityLogToDateInput);
            await this.click(this.activityLogFromDateInput);
            await this.waitForVisible(this.monthFirstDay);
            await this.click(this.monthFirstDay);

            await this.click(this.activityLogToDateInput);
            await this.waitForVisible(this.monthToday);
            await this.click(this.monthToday);

        });
    }

    /**
     * Searches Activity Log entries.
     **/
    async searchActivityLogs() {
        await test.step('Search Activity Log entries', async () => {
            await this.waitForVisible(this.searchBtn);
            await this.click(this.searchBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            });
        });
    }

    /**
     * Verifies Activity Log entries are shown.
     **/
    async verifyActivityLogsVisible() {
        await test.step('Verify Activity Log entries are visible', async () => {
            await this.waitForVisible(this.activityLogTableWrapper);
            await expect(this.activityLogNoDataMessage).not.toBeVisible();
            expect(await this.activityLogRows.count()).toBeGreaterThan(0);
        });
    }

    /* =========================================================================
     * Settings & Rights Management Methods
     * ========================================================================= */

    /**
     * Selects a user group in Rights Management.
     **/
    async selectGroup() {
        await test.step(`Select group"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.selectGroupDropdown);
            await this.hover(this.selectGroupDropdown);
            await this.waitForVisible(this.groupOption);
            await this.click(this.groupOption);
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks on the submit button and verifies the rights updated success message.
     **/
    async submitRightsAndVerifySuccess() {
        await test.step('Click on submit button and verify rights updated', async () => {
            await this.waitForVisible(this.submitRightsBtn);
            await this.click(this.submitRightsBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.userRightsSuccessMsg);
            await this.verifyVisible(this.userRightsSuccessMsg);
        });
    }

    /* =========================================================================
     * File Upload Settings Methods
     * ========================================================================= */

    /**
     * Navigates to File Upload Setting tab under Settings / Rights Management.
     **/
    async navigateToFileUploadSettings() {
        await test.step('Click on File upload settings Tab', async () => {
            await this.waitForVisible(this.fileUploadSetting);
            await this.click(this.fileUploadSetting);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => {
            });
            await this.waitForVisible(this.fileSize);
            await this.waitForLoaders();
        });
    }

    /**
     * Updates File Upload settings (Max File Size, Allowed No of Files, Learn More Description, View text).
     * If no settings data is provided, alternates between two realistic sets of values based on current file size.
     * @param {Object} [settingsData] - Optional settings data.
     * @returns {Promise<Object>} The settings data applied.
     **/
    async updateFileUploadSettings(settingsData = null) {
        return await test.step('Update File Upload settings', async () => {
            await this.waitForVisible(this.fileSize);
            await this.waitForLoaders();
            // eslint-disable-next-line playwright/no-conditional-expect
            await expect(this.fileSize).not.toHaveValue('', { timeout: 5000 }).catch(() => { });
            const currentSize = (await this.fileSize.inputValue() || '').trim();
            const currentLearnMore = (await this.learnMoreDescriptionEditor.textContent().catch(() => '')) || '';
            const isCurrentlyOriginal = currentSize === '10' || currentLearnMore.includes('This feature allows you');

            const data = settingsData || (isCurrentlyOriginal ? {
                maxFileSize: '15',
                allowedNumberOfFiles: '5',
                learnMoreDescription: 'Use this secure upload service to transmit official documents, medical forms, and signed agreements to our administrative office. Please verify that all uploaded files are legible and up-to-date.',
                viewItems: [
                    'Select "CHOOSE FILE" to pick digital documents or photos from your device (PDF, JPG, or PNG only).',
                    'Choose the appropriate document category for your upload from the available list.',
                    'Press Upload to finalize your file submission.'
                ]
            } : {
                maxFileSize: '10',
                allowedNumberOfFiles: '3',
                learnMoreDescription: 'This feature allows you to easily upload forms and/or images directly to your school. If you have any questions or concerns about a file you have uploaded, please contact the school.',
                viewItems: [
                    'Click “CHOOSE FILE” below to choose an image or to take a picture from your mobile device to upload to the school (jpg, png, or pdf ONLY).',
                    'After selecting the file, choose the correct category for your image or form from the dropdown menu.',
                    'Click Upload.'
                ]
            });

            // Update Learn More Description
            if (await this.isVisible(this.learnMoreDescriptionEditor)) {
                await this.fill(this.learnMoreDescriptionEditor, data.learnMoreDescription);
            }

            // Update View Editor list items (li)
            const liCount = await this.viewEditorListItems.count();
            if (liCount > 0) {
                for (let i = 0; i < liCount; i++) {
                    const text = data.viewItems[i] || `Document upload instruction ${i + 1}.`;
                    await this.fill(this.viewEditorListItems.nth(i), text);
                }
            } else if (await this.isVisible(this.viewEditor)) {
                await this.fill(this.viewEditor, data.viewItems ? data.viewItems.join('\n') : '');
            }

            // Update Category Mandatory Toggle
            if (await this.isVisible(this.categoryMandatoryToggle)) {
                const switchCls = (await this.categoryMandatoryToggle.getAttribute('class').catch(() => '')) || '';
                const isCurrentlyOn = switchCls.includes('bootstrap-switch-on');
                await this.click(this.categoryMandatoryToggle);
                data.isCategoryMandatory = !isCurrentlyOn;
            }

            // Update Max File Size
            await this.fill(this.fileSize, data.maxFileSize);

            // Update Allowed No. of Files
            await this.fill(this.allowedNumberOfFiles, data.allowedNumberOfFiles);

            return data;
        });
    }

    /**
     * Clicks on the SAVE button and verifies the success message.
     **/
    async saveFileUploadSettings() {
        await test.step('Click on save button and verify success message', async () => {
            await this.waitForVisible(this.saveButton);
            await this.click(this.saveButton);
            await this.waitForLoaders();
            await this.waitForVisible(this.successMsg.first());
            await this.verifyVisible(this.successMsg.first());
        });
    }

    /**
     * Verifies that the updated File Upload settings are displayed.
     * @param {Object} expectedData - Expected settings data.
     **/
    async verifyFileUploadSettings(expectedData) {
        await test.step('Verify updated File Upload settings', async () => {
            if (expectedData.maxFileSize) {
                await expect(this.fileSize).toHaveValue(expectedData.maxFileSize);
            }
            if (expectedData.allowedNumberOfFiles) {
                await expect(this.allowedNumberOfFiles).toHaveValue(expectedData.allowedNumberOfFiles);
            }
            if (expectedData.learnMoreDescription && await this.isVisible(this.learnMoreDescriptionEditor)) {
                await expect(this.learnMoreDescriptionEditor).toContainText(expectedData.learnMoreDescription.trim().substring(0, 40));
            }
            if (expectedData.viewItems && expectedData.viewItems.length > 0) {
                const count = await this.viewEditorListItems.count();
                for (let i = 0; i < Math.min(count, expectedData.viewItems.length); i++) {
                    await expect(this.viewEditorListItems.nth(i)).toContainText(expectedData.viewItems[i]);
                }
            } else if (expectedData.viewText && await this.isVisible(this.viewEditor)) {
                await expect(this.viewEditor).toContainText(expectedData.viewText);
            }
            if (expectedData.isCategoryMandatory !== undefined && await this.isVisible(this.categoryMandatoryToggle)) {
                const switchCls = (await this.categoryMandatoryToggle.getAttribute('class').catch(() => '')) || '';
                const isOn = switchCls.includes('bootstrap-switch-on');
                expect(isOn).toBe(expectedData.isCategoryMandatory);
            }
        });
    }

    /* =========================================================================
     * File Upload Category Settings Methods (TC_147)
     * ========================================================================= */

    /**
     * Navigates to File Upload Category Setting tab under Settings / Rights Management.
     **/
    async navigateToFileUploadCategorySettings() {
        await test.step('Click on File upload category settings Tab', async () => {
            await this.waitForVisible(this.fileUploadCategorySetting);
            await this.click(this.fileUploadCategorySetting);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => { });
            await this.waitForVisible(this.categoryFileSize);
            await this.waitForLoaders();
        });
    }

    /**
     * Updates File Upload Category settings (Max File Size, Learn More Description, Widget View, Upload View).
     * If no settings data is provided, alternates between two realistic sets of values based on current category file size.
     * @param {Object} [settingsData] - Optional settings data.
     * @returns {Promise<Object>} The settings data applied.
     **/
    async updateFileUploadCategorySettings(settingsData = null) {
        return await test.step('Update File Upload Category settings', async () => {
            await this.waitForVisible(this.categoryFileSize);
            await this.waitForLoaders();
            // eslint-disable-next-line playwright/no-conditional-expect
            await expect(this.categoryFileSize).not.toHaveValue('', { timeout: 5000 }).catch(() => { });
            const currentSize = (await this.categoryFileSize.inputValue() || '').trim();
            const currentLearnMore = (await this.categoryLearnMoreDescriptionEditor.textContent().catch(() => '')) || '';
            const isCurrentlyOriginal = currentSize === '10' || currentLearnMore.includes('This feature allows you');

            const data = settingsData || (isCurrentlyOriginal ? {
                categoryFileSize: '15',
                learnMoreDescription: 'Use this secure upload service to transmit official documents, medical forms, and signed agreements to our administrative office. Please verify that all uploaded files are legible and up-to-date.',
                widgetViewItems: [
                    'Select "CHOOSE FILE" to pick digital files or photos from your device (PDF, JPG, or PNG only).',
                    'Choose the appropriate category for your submission from the available options.',
                    'Click Upload to submit your files.'
                ],
                uploadViewItems: [
                    'Select "CHOOSE FILE" to pick digital files or photos from your device (PDF, JPG, or PNG only).',
                    'Choose the appropriate category for your submission from the available options.',
                    'Click Upload to submit your files.'
                ]
            } : {
                categoryFileSize: '10',
                learnMoreDescription: 'This feature allows you to easily upload forms and/or images directly to your school. If you have any questions or concerns about a file you have uploaded, please contact the school.',
                widgetViewItems: [
                    'Click “CHOOSE FILE” below to choose an image or form to upload to the school (jpg, png, or pdf ONLY).',
                    'After selecting the file, choose the correct category for your image or form from the dropdown menu.',
                    'Click Upload.'
                ],
                uploadViewItems: [
                    'Click “CHOOSE FILE” below to choose an image or form to upload to the school (jpg, png, or pdf ONLY).',
                    'After selecting the file, choose the correct category for your image or form from the dropdown menu.',
                    'Click Upload.'
                ]
            });

            // Update Learn More Description
            if (await this.isVisible(this.categoryLearnMoreDescriptionEditor)) {
                await this.fill(this.categoryLearnMoreDescriptionEditor, data.learnMoreDescription);
            }

            // Update Widget View Description
            const widgetSpansCount = await this.widgetViewDescriptionEditor.count();
            if (widgetSpansCount > 0) {
                for (let i = 0; i < widgetSpansCount; i++) {
                    const text = data.widgetViewItems[i] || `Instruction ${i + 1}.`;
                    await this.fill(this.widgetViewDescriptionEditor.nth(i), text);
                }
            } else {
                const widgetLiCount = await this.widgetViewDescriptionEditorListItems.count();
                if (widgetLiCount > 0) {
                    for (let i = 0; i < widgetLiCount; i++) {
                        const text = data.widgetViewItems[i] || `Instruction ${i + 1}.`;
                        await this.fill(this.widgetViewDescriptionEditorListItems.nth(i), text);
                    }
                }
            }

            // Update Upload View Description
            const uploadSpansCount = await this.uploadViewDescriptionEditor.count();
            if (uploadSpansCount > 0) {
                for (let i = 0; i < uploadSpansCount; i++) {
                    const text = data.uploadViewItems[i] || `Instruction ${i + 1}.`;
                    await this.fill(this.uploadViewDescriptionEditor.nth(i), text);
                }
            } else {
                const uploadLiCount = await this.uploadViewDescriptionEditorListItems.count();
                if (uploadLiCount > 0) {
                    for (let i = 0; i < uploadLiCount; i++) {
                        const text = data.uploadViewItems[i] || `Instruction ${i + 1}.`;
                        await this.fill(this.uploadViewDescriptionEditorListItems.nth(i), text);
                    }
                }
            }

            // Update Category Max File Size
            await this.fill(this.categoryFileSize, data.categoryFileSize);

            return data;
        });
    }

    /**
     * Clicks on the SAVE button on File Upload Category Settings tab and verifies the success message.
     **/
    async saveFileUploadCategorySettings() {
        await test.step('Click on save button and verify success message', async () => {
            await this.waitForVisible(this.saveButton);
            await this.click(this.saveButton);
            await this.waitForLoaders();
            await this.waitForVisible(this.successMsg.first());
            await this.verifyVisible(this.successMsg.first());
        });
    }

    /**
     * Verifies that the updated File Upload Category settings are displayed.
     * @param {Object} expectedData - Expected settings data.
     **/
    async verifyFileUploadCategorySettings(expectedData) {
        await test.step('Verify updated File Upload Category settings', async () => {
            if (expectedData.categoryFileSize) {
                await expect(this.categoryFileSize).toHaveValue(expectedData.categoryFileSize);
            }
            if (expectedData.learnMoreDescription && await this.isVisible(this.categoryLearnMoreDescriptionEditor)) {
                await expect(this.categoryLearnMoreDescriptionEditor).toContainText(expectedData.learnMoreDescription.trim().substring(0, 40));
            }
            if (expectedData.widgetViewItems && expectedData.widgetViewItems.length > 0) {
                const spansCount = await this.widgetViewDescriptionEditor.count();
                const targetLocator = spansCount > 0 ? this.widgetViewDescriptionEditor : this.widgetViewDescriptionEditorListItems;
                const count = await targetLocator.count();
                for (let i = 0; i < Math.min(count, expectedData.widgetViewItems.length); i++) {
                    await expect(targetLocator.nth(i)).toContainText(expectedData.widgetViewItems[i]);
                }
            }
            if (expectedData.uploadViewItems && expectedData.uploadViewItems.length > 0) {
                const spansCount = await this.uploadViewDescriptionEditor.count();
                const targetLocator = spansCount > 0 ? this.uploadViewDescriptionEditor : this.uploadViewDescriptionEditorListItems;
                const count = await targetLocator.count();
                for (let i = 0; i < Math.min(count, expectedData.uploadViewItems.length); i++) {
                    await expect(targetLocator.nth(i)).toContainText(expectedData.uploadViewItems[i]);
                }
            }
        });
    }

}
