import BasePage from '../../../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Online Quiz / Tests Page in Admin Portal (Account Management > Services > Online Quiz / Tests).
 * Handles adding new quizzes with prefix and Date.now() naming, configuring quiz settings,
 * verifying creation messages, navigating back, searching the data grid, and verifying toggle switches.
 **/
export default class OnlineQuizTestsPage extends BasePage {

    /**
     * Initializes locators for Online Quiz / Tests Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("xpath=//a[contains(@href,'AddQuiz') and contains(@class,'btn')]");

        // Form Input Locators
        this.quizNameInput = page.locator('#QuizName');
        this.statusDropdown = page.locator("xpath=//select[@name='Status']//parent::div//button");
        this.statusOptionActive = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Active']");
        this.statusOptionDeleted = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Deleted']");

        this.sizeInput = page.locator('#Size');
        this.passingMarksInput = page.locator('#PassingMarks');
        this.associateWithClassSessionsInput = page.locator('#AssociatewithClassSessions');
        this.timerInput = page.locator('#TimetoComplete');

        // Multi-Select Products
        this.productSelectable = page.locator("xpath=//div[contains(@id,'AssociatedProduct')]//li[@class='ms-elem-selectable']");
        this.productSelected = page.locator("xpath=//div[contains(@id,'AssociatedProduct')]//li[@class='ms-elem-selection ms-selected']");
        this.crProductSelectable = page.locator("xpath=//div[contains(@id,'AssociatedCRProduct')]//li");
        this.crProductSelected = page.locator("xpath=//div[contains(@id,'AssociatedCRProduct')]//li[@class='ms-elem-selection ms-selected']");

        // Rich Textareas
        this.passFeedbackTextarea = page.locator("xpath=//div[@id='AddQuizpassfeed']//parent::div//div[@class='note-editable']");
        this.failFeedbackTextarea = page.locator("xpath=//div[@id='AddQuizfailfeed']//parent::div//div[@class='note-editable']");
        this.welcomeTextarea = page.locator("xpath=//div[@id='AddQuizWelcomeText']//parent::div//div[@class='note-editable']");

        // Dynamic Switch & Wrapper Locators
        this.switchToggle = (labelText) => page.locator(`xpath=//label[contains(text(),'${labelText}')]//parent::div//label[contains(@class,'switch')]`);
        this.switchWrapper = (labelText) => page.locator(`xpath=//label[contains(text(),'${labelText}')]//parent::div//div[contains(@class,'bootstrap-switch-wrapper')]`);


        // Action Buttons
        this.saveBtn = page.locator("xpath=(//div[contains(@id,'Quiz')]//button[contains(text(),'Save')])[1]");
        this.backBtn = page.getByRole('link', { name: 'Back' });

        // Grid Locators
        this.searchTextbox = page.locator("input[type='search']").first();
        this.quizzesTable = page.locator('#onlineQuizzes');
        this.editIcon = page.getByRole('link', { name: 'Edit' }).first();

        // Mutually Exclusive Switch Definitions
        this.attendanceSwitches = [
            'Attendance Required for Associated Session only',
            'Attendance Required for Preceding and Associated CR Session',
            'Attendance Required for All Preceding CR Sessions Only'
        ];

        this.questionOrderSwitches = [
            'Randomize Questions Order',
            'Customize Questions Order'
        ];

        // Form State
        this.isProductSelected = false;
        this.isCrProductSelected = false;
        this.isProductUpdated = false;
        this.isCrProductUpdated = false;

        this.quizName = '';
        this.size = '';
        this.passingMarks = '';
        this.associateSessions = '';
        this.timeToComplete = '';
        this.passFeedback = '';
        this.failFeedback = '';
        this.welcomeText = '';
        this.selectedAttendanceSwitch = '';
        this.selectedQuestionOrderSwitch = '';
        this.updatedQuizName = '';
        this.updatedSize = '';
        this.updatedPassingMarks = '';
        this.updatedAssociateSessions = '';
        this.updatedTimeToComplete = '';
        this.updatedPassFeedback = '';
        this.updatedFailFeedback = '';
        this.updatedWelcomeText = '';
        this.updatedAttendanceSwitch = '';
        this.updatedQuestionOrderSwitch = '';
    }

    /**
     * Returns the bootstrap-switch-wrapper locator for a given switch label.
     * @param {string} labelText - The label text of the switch.
     * @returns {import('@playwright/test').Locator} Locator for the switch wrapper.
     **/
    getSwitchWrapper(labelText) {
        return this.switchWrapper(labelText);
    }

    /**
     * Toggles a toggle switch next to a specific label text.
     * @param {string} labelText - The text of the label preceding the switch.
     **/
    async toggleSwitch(labelText) {
        await test.step(`Toggle switch: "${labelText}"`, async () => {
            const switchLocator = this.switchToggle(labelText);
            await this.waitForVisible(switchLocator);
            await this.click(switchLocator);
        });
    }

    /**
     * Clicks the 'Add New' button to open the Add Quiz form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button for Online Quiz', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
            await this.verifyTitle("Add Quiz");
        });
    }

    /**
     * Fills the Quiz creation form with data from fixture, randomly selecting one switch from each mutually exclusive set.
     * @param {Object} data - Quiz test data fixture.
     * @returns {Promise<string>} The generated unique quiz name.
     **/
    async fillQuizDetails(data = {}) {
        return await test.step('Fill quiz details', async () => {
            const prefix = data.quizName;
            this.quizName = `${prefix}_${Date.now()}`;
            this.size = data.size;
            this.passingMarks = data.passingMarks;
            this.associateSessions = data.associateWithClassSessions;
            this.timeToComplete = data.timeToComplete;
            this.passFeedback = data.passFeedback;
            this.failFeedback = data.failFeedback;
            this.welcomeText = data.welcomeText;

            await this.waitForLoaders();
            await this.waitForVisible(this.quizNameInput);
            await this.fill(this.quizNameInput, this.quizName);

            // Toggle Display Quiz Name switch
            await this.toggleSwitch('Display Quiz Name to Student');

            // Select Status as Active
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusOptionActive);
            await this.click(this.statusOptionActive);

            // Size / Number of questions
            await this.waitForVisible(this.sizeInput);
            await this.fill(this.sizeInput, this.size);

            // Passing Marks
            await this.waitForVisible(this.passingMarksInput);
            await this.fill(this.passingMarksInput, this.passingMarks);

            // Final Exam Switch
            await this.toggleSwitch('Final Exam');

            // Associate with Class Sessions if visible
            if (await this.isVisible(this.associateWithClassSessionsInput, { timeout: 2000 }).catch(() => false)) {
                await this.fill(this.associateWithClassSessionsInput, this.associateSessions);
            }

            // Set 1: Mutually exclusive Attendance switches - pick one at random at runtime
            const randomAttendanceIndex = Math.floor(Math.random() * this.attendanceSwitches.length);
            this.selectedAttendanceSwitch = this.attendanceSwitches[randomAttendanceIndex];
            await this.toggleSwitch(this.selectedAttendanceSwitch);

            // Display Progress Bar switch
            await this.toggleSwitch('Display Progress Bar During Quiz');

            // Set 2: Mutually exclusive Question Order switches - pick one at random at runtime
            const randomOrderIndex = Math.floor(Math.random() * this.questionOrderSwitches.length);
            this.selectedQuestionOrderSwitch = this.questionOrderSwitches[randomOrderIndex];
            await this.toggleSwitch(this.selectedQuestionOrderSwitch);

            // Enable Quiz Timer
            await this.toggleSwitch('Enable Quiz Timer');
            await this.fill(this.timerInput, this.timeToComplete);

            // Toggle Feedback, Expiration & Submission switches
            await this.toggleSwitch('Allow Students to View Completed Quizzes');
            await this.toggleSwitch('Allow  to View Completed Quizzes Answer Feedback');
            await this.toggleSwitch('LMS Link Expiration');
            await this.toggleSwitch('Do not allow submit if questions skipped');
            await this.toggleSwitch('Delay Next Attempts If Student Failed');

            // Select Product if selectable items are present
            if (await this.isVisible(this.productSelectable.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.productSelectable.first());
                this.isProductSelected = true;
            } else {
                this.isProductSelected = false;
            }

            // Select CR Product if selectable items are present
            if (await this.isVisible(this.crProductSelectable.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.crProductSelectable.first());
                this.isCrProductSelected = true;
            } else {
                this.isCrProductSelected = false;
            }

            await this.waitForVisible(this.passFeedbackTextarea);
            await this.fill(this.passFeedbackTextarea, this.passFeedback);

            await this.waitForVisible(this.failFeedbackTextarea);
            await this.fill(this.failFeedbackTextarea, this.failFeedback);

            await this.waitForVisible(this.welcomeTextarea);
            await this.fill(this.welcomeTextarea, this.welcomeText);

            return this.quizName;
        });
    }

    /**
     * Verifies that all quiz fields, inputs, dropdowns, and toggle switches match configured values.
     * Asserts mutually exclusive switches: selected switch is 'switch-on', remaining are 'switch-off'.
     * @param {Object} data - Expected quiz test data.
     **/
    async verifyQuizDetails(data = {}) {
        await test.step('Verify Quiz fields, inputs, dropdowns and toggle switches', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.quizNameInput, { timeout: 5000 });

            // 1. Text Inputs & Dropdown
            await expect(this.quizNameInput).toHaveValue(this.quizName);
            await expect(this.statusDropdown).toContainText('Active');
            await expect(this.sizeInput).toHaveValue(data.size);
            await expect(this.passingMarksInput).toHaveValue(data.passingMarks);

            if (await this.isVisible(this.associateWithClassSessionsInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.associateWithClassSessionsInput).toHaveValue(data.associateWithClassSessions);
            }

            await expect(this.timerInput).toHaveValue(data.timeToComplete);

            // 2. Standard (Non-Exclusive) Toggle Switches - verify switch-on
            const standardSwitches = [
                'Display Quiz Name to Student',
                'Final Exam',
                'Display Progress Bar During Quiz',
                'Enable Quiz Timer',
                'Allow Students to View Completed Quizzes',
                'Allow  to View Completed Quizzes Answer Feedback',
                'LMS Link Expiration',
                'Do not allow submit if questions skipped',
                'Delay Next Attempts If Student Failed'
            ];

            for (const label of standardSwitches) {
                await expect(this.switchWrapper(label)).toHaveClass(/switch-on/);
            }

            // 3. Set 1: Verify Mutually Exclusive Attendance Switches
            for (const label of this.attendanceSwitches) {
                const wrapper = this.switchWrapper(label);
                if (label === this.selectedAttendanceSwitch) {
                    await expect(wrapper).toHaveClass(/switch-on/);
                } else {
                    await expect(wrapper).toHaveClass(/switch-off/);
                }
            }

            // 4. Set 2: Verify Mutually Exclusive Question Order Switches
            for (const label of this.questionOrderSwitches) {
                const wrapper = this.switchWrapper(label);
                if (label === this.selectedQuestionOrderSwitch) {
                    await expect(wrapper).toHaveClass(/switch-on/);
                } else {
                    await expect(wrapper).toHaveClass(/switch-off/);
                }
            }

            // 5. Rich Textareas
            await expect(this.passFeedbackTextarea).toContainText(data.passFeedback);
            await expect(this.failFeedbackTextarea).toContainText(data.failFeedback);
            await expect(this.welcomeTextarea).toContainText(data.welcomeText);

            if (this.isProductSelected) {
                await this.verifyVisible(this.productSelected.first());
            }

            if (this.isCrProductSelected) {
                await this.verifyVisible(this.crProductSelected.first());
            }
        });
    }

    /**
     * Clicks the Save button to save the quiz.
     **/
    async clickSave() {
        await test.step('Click Save button', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the 'Quiz Added successfully.Now you can add questions.' message is displayed.
     **/
    async verifyQuizAddedSuccessfully() {
        await test.step('Verify "Quiz Added successfully.Now you can add questions." message', async () => {
            await this.waitForVisible(this.page.getByText('Quiz Added successfully.Now you can add questions.'));
            await this.verifyVisible(this.page.getByText('Quiz Added successfully.Now you can add questions.'));
        });
    }

    /**
     * Clicks the Back button to return to the quiz list grid.
     **/
    async clickBack() {
        await test.step('Click Back button', async () => {
            await this.waitForVisible(this.backBtn);
            await this.click(this.backBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
    * Searches for the location in a retry loop up to maxRetries times, reloading and filtering by All status if needed.
    * @param {string} [quizName=this.quizName] - Location name to search and edit.
    * @param {number} [maxRetries=5] - Maximum retry attempts.
    **/
    async searchAndEditQuiz(quizName = this.quizName, maxRetries = 5) {
        await test.step(`Search and edit Location: "${quizName}"`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForLoadState('load').catch(() => { });
                await this.waitForLoaders();
                await this.waitForVisible(this.searchTextbox);
                await this.fill(this.searchTextbox, '');
                await this.fill(this.searchTextbox, quizName);
                await this.page.waitForTimeout(2000);
                await this.waitForLoaders();

                const count = await this.editIcon.count();
                if (count > 0 && await this.editIcon.first().isVisible().catch(() => false)) {
                    await this.click(this.editIcon.first());
                    await this.waitForLoaders();
                    return;
                }

                if (attempt < maxRetries) {
                    await this.page.reload();
                    await this.page.waitForLoadState('load').catch(() => { });
                    await this.waitForLoaders();
                }
            }

            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.click(this.editIcon);
            await this.waitForLoaders();
        });
    }


    /**
     * Edits the Quiz details: updates all fields, sets status to Deleted, selects a different
     * option from mutually exclusive sets, and switches all previously YES toggles to NO.
     * @param {Object} data - Quiz test data fixture containing updated values.
     * @returns {Promise<string>} The updated unique quiz name.
     **/
    async editQuizDetails(data = {}) {
        return await test.step('Edit quiz details', async () => {
            const prefix = data.updatedQuizName;
            this.updatedQuizName = `${prefix}_${Date.now()}`;
            this.updatedSize = data.updatedSize;
            this.updatedPassingMarks = data.updatedPassingMarks;
            this.updatedAssociateSessions = data.updatedAssociateWithClassSessions;
            this.updatedTimeToComplete = data.updatedTimeToComplete;
            this.updatedPassFeedback = data.updatedPassFeedback;
            this.updatedFailFeedback = data.updatedFailFeedback;
            this.updatedWelcomeText = data.updatedWelcomeText;

            await this.waitForLoaders();

            // 1. Update Quiz Name
            await this.waitForVisible(this.quizNameInput);
            await this.fill(this.quizNameInput, this.updatedQuizName);
            this.quizName = this.updatedQuizName;

            // 2. Change Status to Deleted (migrated from updateQuizStatusToDeleted)
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusOptionDeleted);
            await this.click(this.statusOptionDeleted);

            // 3. Update Size / Number of questions
            await this.waitForVisible(this.sizeInput);
            await this.fill(this.sizeInput, this.updatedSize);

            // 4. Update Passing Marks
            await this.waitForVisible(this.passingMarksInput);
            await this.fill(this.passingMarksInput, this.updatedPassingMarks);

            // 5. Update Associate with Class Sessions if visible
            if (await this.isVisible(this.associateWithClassSessionsInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.associateWithClassSessionsInput, this.updatedAssociateSessions);
            }

            // 6. Update Timer Input if visible
            if (await this.isVisible(this.timerInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.timerInput, this.updatedTimeToComplete);
            }

            // 7. Mutually Exclusive Set 1 (Attendance): Pick a different switch
            const remainingAttendance = this.attendanceSwitches.filter(s => s !== this.selectedAttendanceSwitch);
            const randomAttendanceIndex = Math.floor(Math.random() * remainingAttendance.length);
            this.updatedAttendanceSwitch = remainingAttendance[randomAttendanceIndex];
            await this.toggleSwitch(this.updatedAttendanceSwitch);

            // 8. Mutually Exclusive Set 2 (Question Order): Pick the other switch
            const remainingOrder = this.questionOrderSwitches.filter(s => s !== this.selectedQuestionOrderSwitch);
            this.updatedQuestionOrderSwitch = remainingOrder[0];
            await this.toggleSwitch(this.updatedQuestionOrderSwitch);

            // 9. Make every toggle switch NO that was YES in fill details
            const switchesToTurnOff = [
                'Display Quiz Name to Student',
                'Final Exam',
                'Display Progress Bar During Quiz',
                'Enable Quiz Timer',
                'Allow Students to View Completed Quizzes',
                'Allow  to View Completed Quizzes Answer Feedback',
                'LMS Link Expiration',
                'Do not allow submit if questions skipped',
                'Delay Next Attempts If Student Failed'
            ];

            for (const label of switchesToTurnOff) {
                const wrapper = this.switchWrapper(label);
                const className = await wrapper.getAttribute('class').catch(() => '');
                if (className && className.includes('switch-on')) {
                    await this.toggleSwitch(label);
                }
            }

            // 10. Multi-select product toggle if present
            if (await this.isVisible(this.productSelectable.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.productSelectable.first());
                this.isProductUpdated = true;
            } else {
                this.isProductUpdated = false;
            }
            if (await this.isVisible(this.crProductSelectable.first(), { timeout: 100 }).catch(() => false)) {
                await this.click(this.crProductSelectable.first());
                this.isCrProductUpdated = true;
            } else {
                this.isCrProductUpdated = false;
            }

            // 11. Update Rich Textareas
            await this.waitForVisible(this.passFeedbackTextarea);
            await this.fill(this.passFeedbackTextarea, this.updatedPassFeedback);

            await this.waitForVisible(this.failFeedbackTextarea);
            await this.fill(this.failFeedbackTextarea, this.updatedFailFeedback);

            await this.waitForVisible(this.welcomeTextarea);
            await this.fill(this.welcomeTextarea, this.updatedWelcomeText);

            return this.updatedQuizName;
        });
    }

    /**
     * Verifies that all quiz fields, inputs, dropdowns, and toggle switches match updated values.
     * Asserts that all standard switches are 'switch-off', and the newly selected mutually exclusive
     * switches are 'switch-on' while previously selected and remaining are 'switch-off'.
     * @param {Object} data - Expected updated quiz test data.
     **/
    async verifyUpdatedQuizDetails(data = {}) {
        await test.step('Verify updated Quiz fields, inputs, dropdowns and toggle switches', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.quizNameInput, { timeout: 5000 });

            // 1. Text Inputs & Dropdown
            await expect(this.quizNameInput).toHaveValue(this.updatedQuizName);
            await expect(this.statusDropdown).toContainText('Deleted');
            await expect(this.sizeInput).toHaveValue(data.updatedSize);
            await expect(this.passingMarksInput).toHaveValue(data.updatedPassingMarks);

            if (await this.isVisible(this.associateWithClassSessionsInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.associateWithClassSessionsInput).toHaveValue(data.updatedAssociateWithClassSessions);
            }

            // 2. Standard Toggle Switches - verify all are switch-off (NO)
            const standardSwitches = [
                'Display Quiz Name to Student',
                'Final Exam',
                'Display Progress Bar During Quiz',
                'Enable Quiz Timer',
                'Allow Students to View Completed Quizzes',
                'Allow  to View Completed Quizzes Answer Feedback',
                'LMS Link Expiration',
                'Do not allow submit if questions skipped',
                'Delay Next Attempts If Student Failed'
            ];

            for (const label of standardSwitches) {
                await expect(this.switchWrapper(label)).toHaveClass(/switch-off/);
            }

            // 3. Set 1: Verify Mutually Exclusive Attendance Switches
            for (const label of this.attendanceSwitches) {
                const wrapper = this.switchWrapper(label);
                if (label === this.updatedAttendanceSwitch) {
                    await expect(wrapper).toHaveClass(/switch-on/);
                } else {
                    await expect(wrapper).toHaveClass(/switch-off/);
                }
            }

            // 4. Set 2: Verify Mutually Exclusive Question Order Switches
            for (const label of this.questionOrderSwitches) {
                const wrapper = this.switchWrapper(label);
                if (label === this.updatedQuestionOrderSwitch) {
                    await expect(wrapper).toHaveClass(/switch-on/);
                } else {
                    await expect(wrapper).toHaveClass(/switch-off/);
                }
            }

            // 5. Rich Textareas
            await expect(this.passFeedbackTextarea).toContainText(data.updatedPassFeedback);
            await expect(this.failFeedbackTextarea).toContainText(data.updatedFailFeedback);
            await expect(this.welcomeTextarea).toContainText(data.updatedWelcomeText);

            const productCount = (this.isProductSelected ? 1 : 0) + (this.isProductUpdated ? 1 : 0);
            if (productCount > 0) {
                expect(await this.productSelected.count()).toBe(productCount);
            }

            const crProductCount = (this.isCrProductSelected ? 1 : 0) + (this.isCrProductUpdated ? 1 : 0);
            if (crProductCount > 0) {
                expect(await this.crProductSelected.count()).toBe(crProductCount);
            }
        });
    }

    /**
     * Verifies that the 'Quiz Updated successfully !' notification is displayed.
     **/
    async verifyQuizUpdatedSuccessfully() {
        await test.step('Verify "Quiz Updated successfully !" notification', async () => {
            const updatedMsg = this.page.getByText('Quiz Updated successfully !').or(this.page.getByText('Quiz Updated successfully'));
            await this.waitForVisible(updatedMsg);
            await this.verifyVisible(updatedMsg);
        });
    }
}
