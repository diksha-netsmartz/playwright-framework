import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';
import StaffLoginPage from './StaffLoginPage';
import { credentials as defaultCredentials } from '@config/config';
import path from 'path';

/**
 * Page Object representing the Staff Portal Home / Dashboard Page.
 * Handles the 'Needs Attention' widget, processing lessons, marking appointments as No Show, and cancelling appointments.
 **/
export default class StaffHomePage extends BasePage {

    /**
     * Initializes locators for the Staff Home Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        this.needsAttentionWidget = page.getByText('NEEDS ATTENTION', { exact: true });
        this.actionDropdownBtn = page.locator("xpath=(//i[contains(@class,'warning')]//ancestor::div[3]//button[contains(text(),'ACTION')])[1]");
        this.actionDropdownButtonsList = page.locator("//i[contains(@class,'warning')]//ancestor::div[3]//button[contains(text(),'ACTION')]");
        this.processLink = page.locator('.fa-tire:visible')
        this.noShowLink = page.locator('.fa-eye-slash:visible')
        this.noShowTextbox = page.locator("#txtnoShowNotes");
        this.noShowButton = page.locator("#btnNoShowLesson").last();
        this.yesConfirmationButton = page.locator("#btnDeleteConfirmation");
        this.fullAppointmentYesButton = page.locator('#btnDeleteMakeFullAppointment:visible')
        this.cancelLink = page.locator('.fa-times-circle:visible')
        this.cancelTextbox = page.locator("#txtArea_CancelLesson");
        this.cancelButton = page.locator("#btnCancelLesson").first();

        // Student Details Widget Locators
        this.studentNameInput = page.getByRole('textbox', { name: 'Student Name' });
        this.studentNameOption = (name) => page.getByRole('option', { name: new RegExp(name, 'i') }).or(page.locator('.ui-autocomplete li, .typeahead li, [role="option"], ul.ui-menu li').filter({ hasText: name })).first();
        this.showDetailsBtn = page.getByRole('button', { name: 'Show Details' });
        this.studentDetailsModal = page.locator("//h4[text()='Student Details']//ancestor::div[@class='modal-content']");
        this.studentDetailsModalHeading = page.locator("//h4[text()='Student Details']");
        this.studentDetailsTabs = page.locator('#tabStudentInfoDetails ul.nav-tabs li a');

        //upload files widget
        this.studentNameTextbox = page.locator('#txtFileUploadStudentName')
        this.fileInput = page.locator('input[type="file"][multiple]').first();
        this.uploadBtn = page.locator("xpath=//button[text()='UPLOAD' and @id='uploadimage']");
        this.uploadFilesWidget = page.locator("//div[contains(text(),'Upload Files') or contains(text(),'file upload')]");
        this.categoryDropdown = page.getByRole('button', { name: '--Select--' }).first();
        this.categoryDropdownOption = (/** @type {number} */ index) => this.page.locator(`((//select[@name='file_Category'])[${index + 1}]//parent::div//li//span[1][not(contains(text(),'Select'))])[1]`);

        this.previewModal = page.getByRole('heading', { name: 'Preview' });
        this.staffMsgAttachment = (/** @type {string | RegExp} */ messageName) => page.locator(`//div[contains(text(),'${messageName}')]//parent::div//a[contains(@class,'preview')]`).first();

        this.schedulingMenu = page.locator('#Scheduling_li');
        this.scheduleLessonsSubLink = page.locator('#Schul_btwschedulingLessons_li');
        this.staffAppointmentListSubLink = page.locator("#Schul_DailyStaffSchedule_li");
        this.calendarViewSubLink = page.locator("#Schul_Scheduler_li")
        this.myProfileLink = page.locator("#MyProfile_li");

        // Task widget locators
        this.tasksWidget = page.locator("(//div[contains(text(),'Tasks')]//ancestor::div[2])[1]");
        this.noTaskPresent = page.locator("//div[contains(text(),'Tasks')]//ancestor::div[2]//span[text()='No Data Found.']");
        this.taskViewDetailBtn = page.locator('.viewdetail').first();
        this.viewTaskModal = page.locator("//h4[contains(text(),'View Details')]//ancestor::div[@class='modal-content']");
        this.viewTaskCloseBtn = page.locator("//h4[contains(text(),'View Details')]//ancestor::div[@class='modal-content']//button[text()='Close']");
        this.taskEditBtn = page.locator("(//div[contains(text(),'Tasks')]//ancestor::div[2]//span[contains(@class,'fa-edit')])[1]");
        this.taskModal = page.locator("//h4[contains(text(),'Update Task')]//ancestor::div[@class='modal-content']");
        this.taskNoteTextbox = page.getByRole('textbox', { name: 'Note' });
        this.subjectTextbox = page.getByRole('textbox', { name: 'Subject' });
        this.selectTimeDropdown = page.getByRole('button', { name: 'Select Time' });
        this.selectTimeDropdownValue = page.locator("(//button[@title='Select Time ']//parent::div//li[not(contains(@class,'selected'))])[1]");
        this.taskStatusDropdown = page.locator("//button[contains(@data-id,'Status')]");
        this.taskSaveBtn = page.locator("//button[contains(@id,'SaveUpdateTask')]");
        this.taskCloseBtn = page.locator("button[onclick='CloseTaskPopUp()']")
        this.taskConfirmYesBtn = page.locator("//a[@data-apply='confirmation' and text()='Yes']");
        this.taskSuccessNotification = page.getByText('Task updated successfully.');
        this.deleteTaskIcon = page.locator("(//a[@data-toggle='confirmationDeleteTask'])[1]")
        this.taskDeleteNotification = page.getByText('Task deleted successfully.');
        this.taskOldNotes = page.locator("(//div[@id='divOldNotes']//p[contains(@class,'PNote')])[last()]");
    }

    /**
     * Opens the action dropdown on the latest item in the 'Needs Attention' widget and clicks 'Process'.
     * Verifies if the page title matches the expected title.
     * @param {string|RegExp} [expectedTitle=/Process Lesson|Process Yard Skills/i] - Expected page title to match.
     * @returns {Promise<boolean>} True if the page title matches expectedTitle, false otherwise.
     **/
    async clickProcess(expectedTitle = /Process Lesson|Process Yard Skills/i) {
        return await test.step('Click Process in "Needs Attention" widget', async () => {
            await this.waitForVisible(this.needsAttentionWidget);

            for (let i = 0; i < 3; i++) {
                await this.click(this.actionDropdownBtn);
                if (await this.isVisible(this.processLink, { timeout: 3000 }).catch(() => false)) {
                    break;
                }
            }

            await this.click(this.processLink);
            await this.waitForLoaders();

            try {
                const titlePattern = typeof expectedTitle === 'string'
                    ? new RegExp(expectedTitle, 'i')
                    : expectedTitle;
                await expect(this.page).toHaveTitle(titlePattern, { timeout: 15000 });
                return true;
            } catch {
                return false;
            }
        });
    }


    /**
     * Marks an appointment in the 'Needs Attention' widget as No Show with notes and confirms the action.
     **/
    async markAppointmentAsNoShow() {
        await test.step('Mark appointment as No Show and confirm', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.needsAttentionWidget);

            for (let i = 0; i < 3; i++) {
                await this.click(this.actionDropdownBtn);
                if (await this.isVisible(this.noShowLink, { timeout: 3000 }).catch(() => false)) {
                    break;
                }
            }
            await this.click(this.noShowLink);
            await this.waitForVisible(this.noShowTextbox);
            await this.fill(this.noShowTextbox, "no show appointment");
            await this.click(this.noShowButton);

            const toastAppeared = this.page.evaluate((expectedText) => {
                return new Promise((resolve) => {
                    const matches = () => /no show successfully/i.test(document.body.innerText || '') || (document.body.innerText || '').toLowerCase().includes(expectedText.toLowerCase());
                    if (matches()) return resolve(true);

                    const observer = new MutationObserver(() => {
                        if (matches()) {
                            observer.disconnect();
                            resolve(true);
                        }
                    });

                    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

                    setTimeout(() => {
                        observer.disconnect();
                        resolve(false);
                    }, 10000);
                });
            }, 'Appointment marked No Show successfully').catch(() => false);

            await this.click(this.yesConfirmationButton);

            if (await this.isVisible(this.fullAppointmentYesButton, { timeout: 2000 }).catch(() => false)) {
                await this.click(this.fullAppointmentYesButton);
            }

            // Report whether toast appeared or not
            const isToastAppeared = await toastAppeared;
            if (isToastAppeared) {
                await test.step('Toast message "Appointment marked No Show successfully" appeared', async () => {
                });
            } else {
                await test.step('Toast message "Appointment marked No Show successfully" did NOT appear', async () => {
                    expect(isToastAppeared, 'Toast message "Appointment marked No Show successfully" did not appear on page within 10 seconds').toBe(true);
                });
            }
        });
    }

    /**
     * Cancels an appointment in the 'Needs Attention' widget with cancellation notes and confirms the action.
     **/
    async markAppointmentAsCancel() {
        await test.step('Cancel appointment and confirm', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.needsAttentionWidget);

            await this.click(this.actionDropdownBtn);

            for (let i = 0; i < 3; i++) {
                await this.click(this.actionDropdownBtn);
                if (await this.isVisible(this.cancelLink, { timeout: 3000 }).catch(() => false)) {
                    break;
                }
            }

            await this.click(this.cancelLink);
            await this.waitForLoaders();
            await this.waitForVisible(this.cancelTextbox);
            await this.fill(this.cancelTextbox, "cancel appointment");
            await this.click(this.cancelButton);

            const toastAppeared = this.page.evaluate((expectedText) => {
                return new Promise((resolve) => {
                    const matches = () => /cance[l]+ed successfully/i.test(document.body.innerText || '') || (document.body.innerText || '').toLowerCase().includes(expectedText.toLowerCase());
                    if (matches()) return resolve(true);

                    const observer = new MutationObserver(() => {
                        if (matches()) {
                            observer.disconnect();
                            resolve(true);
                        }
                    });

                    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

                    setTimeout(() => {
                        observer.disconnect();
                        resolve(false);
                    }, 10000);
                });
            }, 'Appointment cancelled successfully').catch(() => false);

            // 2. Confirm the cancellation action
            await this.click(this.yesConfirmationButton);

            // 3. Report whether toast appeared or not
            const isToastAppeared = await toastAppeared;
            if (isToastAppeared) {
                await test.step('Toast message "Appointment cancelled successfully" appeared', async () => {
                });
            } else {
                await test.step('Toast message "Appointment cancelled successfully" did NOT appear', async () => {
                    expect(isToastAppeared, 'Toast message "Appointment cancelled successfully" did not appear on page within 10 seconds').toBe(true);
                });
            }

        });
    }

    /**
     * Searches for a student by name in the Student Details widget, selects from the autocomplete dropdown,
     * and clicks 'Show Details'.
     * @param {string} studentName - The student name to search.
     **/
    async searchAndSelectStudent(studentName) {
        await test.step(`Search and select student: "${studentName}" in Student Details widget`, async () => {
            await this.waitForLoaders();
            const option = this.studentNameOption(studentName);
            let optionFound = false;

            for (let attempt = 1; attempt <= 3; attempt++) {
                await this.waitForVisible(this.studentNameInput, 1000);
                await this.click(this.studentNameInput);
                await this.clear(this.studentNameInput);
                await this.studentNameInput.fill(studentName);

                optionFound = await this.isVisible(option, { timeout: 3000 }).catch(() => false);
                if (optionFound) break;
                await this.page.waitForTimeout(500);
            }

            await this.waitForVisible(option, 5000);
            await this.click(option);

            await this.waitForVisible(this.showDetailsBtn, 5000);
            await this.click(this.showDetailsBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the Student Details modal dialog is displayed.
     **/
    async verifyStudentDetailsModalVisible() {
        await test.step('Verify Student Details modal is visible', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentDetailsModalHeading, 3000);
            await this.verifyVisible(this.studentDetailsModalHeading, 1000);
        });
    }

    /**
     * Iterates through and clicks on each available tab in the Student Details modal.
     * @returns {Promise<number>} Total count of tabs clicked and verified.
     **/
    async clickAllStudentDetailsTabs() {
        return await test.step('Click on all available tabs in Student Details modal', async () => {
            await this.waitForVisible(this.studentDetailsTabs.first(), 5000);
            const count = await this.studentDetailsTabs.count();
            let tabsClicked = 0;

            for (let i = 0; i < count; i++) {
                const tab = this.studentDetailsTabs.nth(i);
                const tabText = (await tab.textContent() || '').trim().replace(/\s+/g, ' ');
                await test.step(`Click tab [${i + 1}/${count}]: "${tabText}"`, async () => {
                    await this.waitForVisible(tab, 3000);
                    await this.click(tab);
                    await this.waitForLoaders();
                    await this.page.waitForTimeout(500);
                    await this.waitForLoaders();
                    tabsClicked++;
                });
            }

            return tabsClicked;
        });
    }

    /**
     * Uploads a document/file by setting the file input, clicking upload, and waiting for loaders to disappear.
     * @param {string|string[]} filePaths - Absolute or relative path(s) to the file(s) to upload.
     * @param {string} studentName - Name of the student for whom the file is being uploaded.
     **/
    async uploadFiles(filePaths, studentName) {
        const filesToUpload = Array.isArray(filePaths) ? filePaths : [filePaths];
        const resolvedPaths = filesToUpload.map((filePath) => path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath));

        await test.step(`Upload ${filesToUpload.length} file(s) for student ${studentName}`, async () => {
            await this.waitForVisible(this.uploadFilesWidget);
            await this.verifyVisible(this.uploadFilesWidget, 5000);

            const option = this.studentNameOption(studentName);
            let optionFound = false;

            for (let attempt = 1; attempt <= 3; attempt++) {
                await this.waitForVisible(this.studentNameTextbox, 1000);
                await this.click(this.studentNameTextbox);
                await this.clear(this.studentNameTextbox);
                await this.fill(this.studentNameTextbox, studentName);

                optionFound = await this.isVisible(option, { timeout: 3000 }).catch(() => false);
                if (optionFound) break;
                await this.page.waitForTimeout(500);
            }

            await this.waitForVisible(option, 2000);
            await this.click(option);
            await this.setInputFiles(this.fileInput, resolvedPaths);

            for (let i = 0; i < resolvedPaths.length; i++) {
                await this.waitForVisible(this.categoryDropdown);
                await this.click(this.categoryDropdown);
                await this.waitForVisible(this.categoryDropdownOption(i));
                await this.click(this.categoryDropdownOption(i));
            }

            await this.click(this.uploadBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });

        });

    }

    /**
     * Verifies that the file upload success message is visible.
     **/
    async verifyUploadSuccess() {
        await test.step('Verify file upload success message', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
            await this.waitForVisible(this.page.getByText('Success! Upload has been completed.', { exact: true }).first(), 60000);
            await this.verifyVisible(this.page.getByText('Success! Upload has been completed.', { exact: true }).first(), 20000);
        });
    }

    /**
     * Navigates to Scheduling -> Schedule Lessons from the left sidebar.
     **/
    async navigateToScheduleLessons() {
        await test.step('Navigate to Scheduling > Schedule lessons', async () => {
            await this.waitForLoaders();

            await this.click(this.schedulingMenu);
            await this.waitForVisible(this.scheduleLessonsSubLink);
            await this.click(this.scheduleLessonsSubLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
            await this.waitForLoaders();
            await this.verifyURLContainsText('BTWScheduling/Lessons');
        });
    }

    /**
     * Navigates to Scheduling -> Calendar View page.
     **/
    async navigateToCalendarView() {
        await test.step('Navigate to Scheduling > Calendar View', async () => {
            await this.waitForLoaders();
            await this.click(this.schedulingMenu);
            await this.waitForVisible(this.calendarViewSubLink, { timeout: 5000 })
            await this.click(this.calendarViewSubLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
            await this.waitForLoaders();
            await this.verifyTitle('Single Instructor Scheduler');
        });
    }

    /**
     * Navigates to Scheduling -> Staff Appointment List from the left sidebar.
     **/
    async navigateToStaffAppointmentList() {
        await test.step('Navigate to Scheduling > Staff Appointment List', async () => {
            await this.waitForLoaders();

            const isSubLinkVisible = await this.staffAppointmentListSubLink.isVisible().catch(() => false);
            if (!isSubLinkVisible) {
                await this.click(this.schedulingMenu);
            }
            await this.waitForVisible(this.staffAppointmentListSubLink, 5000);
            await this.click(this.staffAppointmentListSubLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
            await this.waitForLoaders();
            await this.verifyTitle("Staff Appointment List");
        });
    }

    /**
     * Navigates to My Profile from the left sidebar.
     **/
    async navigateToMyProfile() {
        await test.step('Navigate to My Profile', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.myProfileLink, 5000);
            await this.click(this.myProfileLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
            await this.waitForLoaders();
            await this.verifyTitle('My Profile');
        });
    }

    /**
     * Scrolls to the Tasks widget on the Staff Home page.
     * @returns {Promise<boolean>} True if tasks are available, false if 'No Data Found.' is displayed.
     **/
    async scrollToTasksWidget() {
        return await test.step('Scroll into the "Task" widget', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.tasksWidget, 10000);
            await this.tasksWidget.scrollIntoViewIfNeeded();
            await this.verifyVisible(this.tasksWidget);

            const isNoTask = await this.noTaskPresent.isVisible({ timeout: 2000 }).catch(() => false);
            if (isNoTask) {
                console.log('No task');
                return false;
            }
            return true;
        });
    }

    /**
     * Checks if task is present in the Task widget.
     * If 'No Data Found.' locator is visible, logs 'No task' and returns false.
     * @returns {Promise<boolean>} True if tasks are present, false if 'No Data Found.' is displayed.
     **/
    async isTaskPresent() {
        return await test.step('Check if task is present in Task widget', async () => {
            await this.waitForLoaders();
            const isNoTask = await this.noTaskPresent.isVisible({ timeout: 2000 }).catch(() => false);
            if (isNoTask) {
                console.log('No task');
                return false;
            }
            return true;
        });
    }

    /**
     * Clicks the View Details icon for the first task and verifies the View Details modal.
     **/
    async viewTaskDetails() {
        await test.step('Click View Details on task and verify modal is displayed', async () => {
            await this.waitForVisible(this.taskViewDetailBtn, 1000);
            await this.click(this.taskViewDetailBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.viewTaskModal, 1000);
        });
    }

    /**
     * Deletes the first task from the Task widget.
     **/
    async deleteTask() {
        await test.step('Delete the first task', async () => {
            await this.waitForVisible(this.deleteTaskIcon, 2000);
            await this.click(this.deleteTaskIcon);
            await this.waitForLoaders();
            await this.waitForVisible(this.taskConfirmYesBtn, 1000);
            await this.click(this.taskConfirmYesBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.taskDeleteNotification, 5000);
        });
    }

    /**
     * Closes the View Details modal.
     **/
    async closeViewTaskModal() {
        await test.step('Close View Details modal', async () => {
            await this.waitForVisible(this.viewTaskCloseBtn, 2000);
            await this.click(this.viewTaskCloseBtn);
            await this.waitForLoaders();
            await expect(this.viewTaskModal).toBeHidden({ timeout: 5000 }).catch(() => {
            });
        });
    }

    /**
     * Opens the Edit Task modal for the first task.
     **/
    async openEditTaskModal() {
        await test.step('Click Edit on task and verify Edit modal opens', async () => {
            await this.waitForVisible(this.taskEditBtn, 10000);
            await this.click(this.taskEditBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => {
            });
            await this.waitForVisible(this.taskNoteTextbox, 5000);
        });
    }

    /**
     * Edits task note and status.
     * @param {Object} [options]
     * @param {string} [options.note] - Note content.
     * @param {string} [options.status] - Status name to select (e.g. 'Waiting Feedback').
     * @param {string} [options.subject] - Subject
     **/
    async editTaskDetails({ note = '', status = 'Waiting Feedback', subject } = {}) {
        await test.step(`Edit task note to "${note}", subject to "${subject}" and status to "${status}"`, async () => {
            await this.waitForVisible(this.taskSaveBtn, { timeout: 5000 });
            if (note) {
                // await this.waitForVisible(this.taskNoteTextbox, 5000);
                await this.fill(this.taskNoteTextbox, note);
            }
            if (subject) {
                await this.fill(this.subjectTextbox, subject);
            }
            if (status) {
                if (await this.taskStatusDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await this.click(this.taskStatusDropdown);
                    const option = this.page.locator('#taskNotes .dropdown-menu a, .dropdown-menu a').filter({ hasText: new RegExp(`^${status}$`, 'i') }).first();
                    if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
                        await this.click(option);
                    }
                }
            }
            if (await this.isVisible(this.selectTimeDropdown, { timeout: 500 })) {
                await this.click(this.selectTimeDropdown);
                await this.waitForVisible(this.selectTimeDropdownValue, 1000);
                await this.click(this.selectTimeDropdownValue);
                await this.waitForLoaders();
            }
        });
    }

    /**
     * Clicks Save on Edit Task modal and confirms the action.
     **/
    async saveTaskAndConfirm() {
        await test.step('Click Save on task and confirm Yes', async () => {
            await this.waitForVisible(this.taskSaveBtn, 1000);
            await this.click(this.taskSaveBtn);

            // Wait for confirmation and click Yes
            await this.waitForVisible(this.taskConfirmYesBtn, 1000);
            await this.click(this.taskConfirmYesBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the task updated success message is displayed.
     **/
    async verifyTaskUpdateSuccess() {
        await test.step('Verify "Task updated successfully." message', async () => {
            await this.waitForVisible(this.taskSuccessNotification, 10000);
            await expect(this.taskSuccessNotification).toContainText('Task updated successfully.');
        });
    }

    /**
     * Edits task note and status.
     * @param {Object} [options]
     * @param {string} [options.note] - Note content.
     * @param {string} [options.status] - Status name to select (e.g. 'Waiting Feedback').
     * @param {string} [options.subject] - Subject
     **/
    async verifyTaskDetails({ note = '', status, subject } = {}) {
        await test.step(`Verify task values are updated for note to "${note}", subject to "${subject}" and status to "${status}"`, async () => {
            await this.waitForVisible(this.taskSaveBtn, { timeout: 5000 });

            await expect(this.taskOldNotes).toContainText(note);
            await expect(this.subjectTextbox).toHaveValue(subject);
            await this.matchAttributeValue(this.taskStatusDropdown, "title", status);
            await this.click(this.taskCloseBtn);
            await this.waitForHidden(this.taskCloseBtn);

        });
    }


    /**
     * Verifies that the task deleted success message is displayed.
     **/
    async verifyTaskDeleteSuccess() {
        await test.step('Verify "Task deleted successfully." message', async () => {
            await this.waitForVisible(this.taskDeleteNotification, 10000);
            await expect(this.taskDeleteNotification).toContainText('Task deleted successfully.');
        });
    }

    /**
     * Verifies that staff message is visible or not visible on homepage, and validates attachment preview.
     * @param {string} message - Message name/text.
     * @param {boolean} isVisible - Expected visibility state.
     **/
    async verifyStaffMessageVisibilityOnHomepage(message, isVisible) {
        await test.step(`Verify staff message visibility: "${message}" is ${isVisible ? 'visible' : 'not visible'}`, async () => {
            if (isVisible) {
                await this.verifyVisible(this.page.getByText(message, { exact: false }).first());

                await this.click(this.staffMsgAttachment(message));
                await this.verifyVisible(this.previewModal);

            } else {
                await this.verifyNotVisible(this.page.getByText(message, { exact: false }).first());
            }
        });
    }
}

