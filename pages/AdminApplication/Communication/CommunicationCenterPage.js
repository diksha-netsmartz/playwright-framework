import path from 'path';
import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Communication Center page in Admin Portal (Communication > Communication Center).
 * Handles adding, editing, and managing staff portal messages with file attachments and visibility configurations.
 **/
export default class CommunicationCenterPage extends BasePage {

    /**
     * Initializes locators for the Communication Center page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Tabs
        this.staffCenterTab = page.getByRole('link', { name: 'Staff Center' }).first()

        // Header Actions
        this.studentAddNewBtn = page.locator('#dvStudentCenter').getByRole('link', { name: 'Add New' });
        this.staffAddNewBtn = page.locator('#dvStaffCenter').getByRole('link', { name: 'Add New' });

        // Add / Edit Message Form Locators
        this.studentMessageNameInput = page.locator("#textMessageName");
        this.staffMessageNameInput = page.locator('#textStaffMessageName')

        // Dropdowns
        this.statusDropdown = page.locator("xpath=//select[@id='drp_Status']//parent::div//button");
        this.statusOptionActive = page.locator("xpath=//select[@id='drp_Status']//parent::div//div//span[text()='Active']");
        this.statusOptionDeleted = page.locator("xpath=//select[@id='drp_Status']//parent::div//div//span[text()='Deleted']");
        this.selectedLocationDropDown = page.getByRole('button', { name: 'SELECTED LOCATION' });
        this.selectLocationAll = page.locator("//input[@id='chkSelectAll']//following-sibling::span")

        this.statusDropdownForStaff = page.locator("xpath=//select[@id='drp_StaffStatus']//parent::div//button");
        this.statusOptionActiveForStaff = page.locator("xpath=//select[@id='drp_StaffStatus']//parent::div//div//span[text()='Active']");
        this.statusOptionDeletedForStaff = page.locator("xpath=//select[@id='drp_StaffStatus']//parent::div//div//span[text()='Deleted']");


        // Dates
        this.visibilityDateInput = page.locator('#dtVisibilityDate');
        this.expirationDateInput = page.locator('#dtexpiration');
        this.staffExpirationDateInput = page.locator("#dtStaffexpiration");

        // Radio & Checkbox options
        this.radioOptionAllStudents = page.locator("//input[@id='rbtnShowToAllStudents']//following-sibling::span[1]");
        this.radioOptionSelectStudents = page.locator("//input[@id='rbtnShowToSomeStudents']//following-sibling::span[1]");
        this.radioOptionAllStaff = page.locator("//input[@id='rbtnShowAllStaff']//following-sibling::span[1]");
        this.radioOptionSomeStaff = page.locator("//input[@id='rbtnShowToSomeStaff']//following-sibling::span[1]");
        this.selectStaffMember = page.locator('li.ms-elem-selectable').first()
        this.checkboxWithScheduleCrSession = page.locator("//input[@id='chkWithScheduleCrSession']//following-sibling::span[1]");
        this.checkboxWithScheduleInCarLesson = page.locator("//input[@id='chkWithScheduleInCarLesson']//following-sibling::span[1]");
        this.checkboxWithScheduleRTLesson = page.locator("//input[@id='chkWithScheduleRTLesson']//following-sibling::span[1]");
        this.checkboxWithScheduleForObservation = page.locator("//input[@id='chkWithScheduleForObservation']//following-sibling::span[1]");
        this.checkboxAdminDisplay = page.locator("//input[@id='chkAdminDisplay']//following-sibling::span")
        this.checkboxStaffPortalDisplay = page.locator("//input[@id='chkStaffPortalDisplay']//following-sibling::span")

        // Content
        this.contentInput = page.locator('div.note-editable:visible');

        // File Upload
        this.fileInput = page.locator('input.dz-hidden-input');
        this.deleteIcon = page.getByRole('link', { name: 'Remove file' });

        // Save & Confirmation Modal
        this.saveBtn = page.locator("//button[contains(@data-toggle,'SaveOrUpdateMessage')]");
        this.yesConfirmationBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.successMessage = page.getByText('Success! Information was successfully saved.');

        // Table / Grid Actions
        this.searchBox = page.locator("input[type='search']").first()
        this.editBtn = page.getByTitle('Edit');
    }

    /**
     * Clicks on the Staff Center tab if visible.
     **/
    async clickStaffCenterTab() {
        await test.step('Click on "Staff Center" tab', async () => {
            await this.waitForLoaders();
            await this.click(this.staffCenterTab);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });

        });
    }

    /**
     * Clicks on 'Add New' to open the message creation form for Student Center.
     **/
    async clickAddNewForStudentCenter() {
        await test.step('Click on "Add New" button', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentAddNewBtn);
            await this.click(this.studentAddNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks on 'Add New' to open the message creation form for Staff Center.
     **/
    async clickAddNewForStaffCenter() {
        await test.step('Click on "Add New" button', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.staffAddNewBtn);
            await this.click(this.staffAddNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Selects status from dropdown (Active or Deleted).
     * @param {string} [status='Active'] - Target status.
     **/
    async selectStatus(status = 'Active') {
        await test.step(`Select status: "${status}"`, async () => {
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            const option = status.toLowerCase() === 'deleted' ? this.statusOptionDeleted : this.statusOptionActive;
            await this.waitForVisible(option, { timeout: 3000 });
            await this.click(option);
            await this.waitForLoaders();
        });
    }

    /**
     * Selects staff status from dropdown (Active or Deleted).
     * @param {string} [status='Active'] - Target status.
     **/
    async selectStaffStatus(status = 'Active') {
        await test.step(`Select staff status: "${status}"`, async () => {
            await this.waitForVisible(this.statusDropdownForStaff);
            await this.click(this.statusDropdownForStaff);
            const option = status.toLowerCase() === 'deleted' ? this.statusOptionDeletedForStaff : this.statusOptionActiveForStaff;
            await this.waitForVisible(option, { timeout: 3000 });
            await this.click(option);
            await this.waitForLoaders();
        });
    }

    /**
     * Uploads an attachment file to the message.
     * @param {string} filePath - Path to file (defaults to test-data/uploads/sample.pdf).
     **/
    async uploadFile(filePath = 'test-data/uploads/sample.pdf') {
        await test.step(`Upload file: "${filePath}"`, async () => {
            const resolvedPath = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
            await this.setInputFiles(this.fileInput.first(), resolvedPath);
            await this.waitForVisible(this.deleteIcon, { timeout: 10000 });
            await this.waitForLoaders();
        });
    }

    /**
     * Fills student message details for creation.
     * @param {Object} details - Details object.
     * @param {string} details.name - Message name.
     * @param {string} [details.status='Active'] - Status.
     * @param {string} details.visibilityDate - Visibility date (MM/DD/YYYY).
     * @param {string} details.expirationDate - Expiration date (MM/DD/YYYY).
     * @param {string} details.content - Message content.
     * @param {string} [details.filePath] - Attachment file path.
     **/
    async fillStudentMessageDetails({ name, status = 'Active', visibilityDate, expirationDate, content, filePath }) {
        await test.step('Fill message details', async () => {
            await this.waitForVisible(this.studentMessageNameInput);
            await this.fill(this.studentMessageNameInput, name);
            await this.selectStatus(status);

            if (await this.isVisible(this.visibilityDateInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.visibilityDateInput);
                await this.clear(this.visibilityDateInput);
                await this.pressSequentially(this.visibilityDateInput, visibilityDate);
                await this.page.keyboard.press('Tab');
            }

            if (await this.isVisible(this.expirationDateInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.expirationDateInput);
                await this.clear(this.expirationDateInput);
                await this.pressSequentially(this.expirationDateInput, expirationDate);
                await this.page.keyboard.press('Tab');
            }

            if (await this.isVisible(this.radioOptionAllStudents, { timeout: 100 }).catch(() => false)) {
                await this.click(this.radioOptionAllStudents);
            }

            await this.fill(this.contentInput, content);

            await this.uploadFile(filePath);

        });
    }

    /**
     * Fills staff message details for creation.
     * @param {Object} details - Details object.
     * @param {string} details.name - Staff message name.
     * @param {string} [details.status='Active'] - Status.
     * @param {string} details.visibilityDate - Visibility date (MM/DD/YYYY).
     * @param {string} [details.expirationDate] - Expiration date (MM/DD/YYYY).
     * @param {string} details.content - Message content.
     * @param {string} [details.filePath] - Attachment file path.
     **/
    async fillStaffMessageDetails({ name, status = 'Active', visibilityDate, expirationDate, content, filePath }) {
        await test.step('Fill staff message details', async () => {
            await this.waitForVisible(this.staffMessageNameInput);
            await this.fill(this.staffMessageNameInput, name);
            await this.selectStaffStatus(status);

            if (await this.isVisible(this.visibilityDateInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.visibilityDateInput);
                await this.clear(this.visibilityDateInput);
                await this.pressSequentially(this.visibilityDateInput, visibilityDate);
                await this.page.keyboard.press('Tab');
            }
            if (await this.isVisible(this.staffExpirationDateInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.staffExpirationDateInput);
                await this.clear(this.staffExpirationDateInput);
                await this.pressSequentially(this.staffExpirationDateInput, expirationDate);
                await this.page.keyboard.press('Tab');
            }
            if (await this.isVisible(this.radioOptionAllStaff, { timeout: 100 }).catch(() => false)) {
                await this.click(this.radioOptionAllStaff);
            }

            if (await this.isVisible(this.checkboxAdminDisplay, { timeout: 100 }).catch(() => false)) {
                await this.click(this.checkboxAdminDisplay);
            }

            if (await this.isVisible(this.checkboxStaffPortalDisplay, { timeout: 100 }).catch(() => false)) {
                await this.click(this.checkboxStaffPortalDisplay);
            }

            await this.fill(this.contentInput, content);

            await this.uploadFile(filePath);
        });
    }

    /**
     * Clicks Save button and confirms with Yes.
     **/
    async saveMessage() {
        await test.step('Save message and confirm', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.jsClick(this.saveBtn);
            await this.click(this.yesConfirmationBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies success message notification.
     **/
    async verifySuccessMessage() {
        await test.step(`Verify success message: "Success! Information was successfully saved."`, async () => {
            const successIndicator = this.successMessage;
            await this.waitForVisible(successIndicator, { timeout: 10000 });
            await this.verifyVisible(successIndicator);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 })
        });
    }

    /**
     * Searches for a message by name in the grid and opens it for editing.
     * @param {string} messageName - Message name to search.
     **/
    async searchAndEditMessage(messageName) {
        await test.step(`Search for message "${messageName}" and click Edit`, async () => {
            await this.page.reload();
            await this.waitForLoaders();
            await this.waitForVisible(this.searchBox);
            await this.click(this.searchBox);
            await this.fill(this.searchBox, messageName);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1000);
            await expect(this.editBtn).toHaveCount(1);

            // Locate row corresponding specifically to messageName to avoid clicking arbitrary edit buttons
            const targetRow = this.page.locator('table:visible tbody tr').filter({ hasText: messageName }).first();
            await this.waitForVisible(targetRow, { timeout: 10000 });

            const editButton = targetRow.getByTitle('Edit');
            await this.waitForVisible(editButton, { timeout: 5000 });
            await this.click(editButton);
            await this.waitForLoaders();


        });
    }

    /**
     * Updates message details (content, status, visibilityDate, expirationDate).
     * @param {Object} [updateDetails={}] - Update fields.
     * @param {string} [updateDetails.content] - Updated content.
     * @param {string} [updateDetails.status='Deleted'] - Updated status.
     * @param {string} [updateDetails.visibilityDate] - Visibility date (MM/DD/YYYY).
     * @param {string} [updateDetails.expirationDate] - Expiration date (MM/DD/YYYY).
     **/
    async updateStudentMessageDetails({ content, status = 'Deleted', visibilityDate, expirationDate } = {}) {
        await test.step('Update message details', async () => {
            await this.waitForVisible(this.saveBtn, { timeout: 5000 });

            await this.selectStatus(status);
            if (await this.isVisible(this.visibilityDateInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.visibilityDateInput);
                await this.clear(this.visibilityDateInput);
                await this.pressSequentially(this.visibilityDateInput, visibilityDate);
                await this.page.keyboard.press('Tab');
            }

            if (await this.isVisible(this.expirationDateInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.expirationDateInput);
                await this.clear(this.expirationDateInput);
                await this.pressSequentially(this.expirationDateInput, expirationDate);
                await this.page.keyboard.press('Tab');
            }

            if (await this.isVisible(this.radioOptionSelectStudents, { timeout: 100 }).catch(() => false)) {
                await this.click(this.radioOptionSelectStudents);
            }
            if (await this.isVisible(this.checkboxWithScheduleCrSession, { timeout: 100 }).catch(() => false)) {
                await this.click(this.checkboxWithScheduleCrSession);
            }
            if (await this.isVisible(this.checkboxWithScheduleInCarLesson, { timeout: 100 }).catch(() => false)) {
                await this.click(this.checkboxWithScheduleInCarLesson);
            }
            if (await this.isVisible(this.checkboxWithScheduleRTLesson, { timeout: 100 }).catch(() => false)) {
                await this.click(this.checkboxWithScheduleRTLesson);
            }
            if (await this.isVisible(this.checkboxWithScheduleForObservation, { timeout: 100 }).catch(() => false)) {
                await this.click(this.checkboxWithScheduleForObservation);
            }

            if (await this.isVisible(this.selectedLocationDropDown, { timeout: 100 }).catch(() => false)) {
                await this.click(this.selectedLocationDropDown);
                await this.waitForVisible(this.selectLocationAll)
                await this.click(this.selectLocationAll);
            }

            await this.fill(this.contentInput, content);

        });
    }

    /**
     * Updates staff message details (content, status, visibilityDate, expirationDate).
     * @param {Object} [updateDetails={}] - Update fields.
     * @param {string} [updateDetails.content] - Updated content.
     * @param {string} [updateDetails.status='Deleted'] - Updated status.
     * @param {string} [updateDetails.visibilityDate] - Visibility date (MM/DD/YYYY).
     * @param {string} [updateDetails.expirationDate] - Expiration date (MM/DD/YYYY).
     **/
    async updateStaffMessageDetails({ content, status = 'Deleted', visibilityDate, expirationDate } = {}) {
        await test.step('Update staff message details', async () => {
            await this.waitForVisible(this.staffMessageNameInput);
            await this.selectStaffStatus(status);


            if (await this.isVisible(this.visibilityDateInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.visibilityDateInput);
                await this.clear(this.visibilityDateInput)
                await this.pressSequentially(this.visibilityDateInput, visibilityDate);
                await this.page.keyboard.press('Tab');
            }

            if (await this.isVisible(this.staffExpirationDateInput, { timeout: 100 }).catch(() => false)) {
                await this.click(this.staffExpirationDateInput);
                await this.clear(this.staffExpirationDateInput)
                await this.pressSequentially(this.staffExpirationDateInput, expirationDate);
                await this.page.keyboard.press('Tab');
            }
            if (await this.isVisible(this.radioOptionSomeStaff, { timeout: 100 }).catch(() => false)) {
                await this.click(this.radioOptionSomeStaff);
            }

            if (await this.isVisible(this.selectStaffMember, { timeout: 1000 }).catch(() => false)) {
                await this.click(this.selectStaffMember);
            }
            await this.fill(this.contentInput, content);


        });
    }
}
