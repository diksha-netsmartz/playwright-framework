import BasePage from '../../../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Online Quiz / Tests Page in Admin Portal (Account Management > Services > Online Quiz / Tests).
 * Handles adding new quizzes with prefix and Date.now() naming, configuring quiz settings,
 * verifying creation messages, navigating back, and searching the data grid.
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

        // Form Locators
        this.quizNameInput = page.locator('#QuizName');
        this.statusDropdown = page.locator("xpath=//select[@name='Status']//parent::div//button");
        this.statusOptionActive = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Active']");
        this.statusOptionDeleted = page.locator("xpath=//select[@name='Status']//parent::div//div//span[text()='Deleted']");

        this.sizeInput = page.locator('#Size');
        this.passingMarksInput = page.locator('#PassingMarks');
        this.associateWithClassSessionsInput = page.locator('#AssociatewithClassSessions');
        this.timerInput = page.locator('#TimetoComplete');

        this.productSelectable = page.locator("xpath=(//div[contains(@id,'AssociatedProduct')]//li)[1]");
        this.crProductSelectable = page.locator("xpath=(//div[contains(@id,'AssociatedCRProduct')]//li)[1]");

        this.passFeedbackTextarea = page.locator("xpath=//div[@id='AddQuizpassfeed']//parent::div//div[@class='note-editable']");
        this.failFeedbackTextarea = page.locator("xpath=//div[@id='AddQuizfailfeed']//parent::div//div[@class='note-editable']");
        this.welcomeTextarea = page.locator("xpath=//div[@id='AddQuizWelcomeText']//parent::div//div[@class='note-editable']");


        this.saveBtn = page.locator("xpath=(//div[contains(@id,'Quiz')]//button[contains(text(),'Save')])[1]")
        this.backBtn = page.getByRole('link', { name: 'Back' });

        // Grid Locators
        this.searchTextbox = page.locator("input[type='search']").first();
        this.quizzesTable = page.locator('#onlineQuizzes');
        this.editIcon = page.getByRole('link', { name: 'Edit' }).first();
    }

    /**
     * Toggles a toggle switch next to a specific label text.
     * @param {string} labelText - The text of the label preceding the switch.
     **/
    async toggleSwitch(labelText) {
        await test.step(`Toggle switch: "${labelText}"`, async () => {
            const switchLocator = this.page.locator(`xpath=//label[contains(text(),'${labelText}')]//parent::div//label[contains(@class,'switch')]`);
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
     * Fills the Quiz creation form with prefix and Date.now() name and required settings.
     * @param {Object} data - Quiz test data fixture.
     * @returns {Promise<string>} The generated unique quiz name.
     **/
    async fillQuizDetails(data = {}) {
        return await test.step('Fill quiz details', async () => {
            const prefix = data.quizName || 'Quiz';
            this.quizName = `${prefix}_${Date.now()}`;

            const size = data.size || '10';
            const passingMarks = data.passingMarks || '75';
            const associateSessions = data.associateWithClassSessions || '1';
            const timeToComplete = data.timeToComplete || '30';

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
            await this.fill(this.sizeInput, size);

            // Passing Marks
            await this.waitForVisible(this.passingMarksInput);
            await this.fill(this.passingMarksInput, passingMarks);

            // Final Exam Switch
            await this.toggleSwitch('Final Exam');

            // Associate with Class Sessions if visible
            if (await this.isVisible(this.associateWithClassSessionsInput, { timeout: 2000 }).catch(() => false)) {
                await this.fill(this.associateWithClassSessionsInput, associateSessions);
            }

            // Toggle Attendance, Display & Order switches
            await this.toggleSwitch('Attendance Required for Associated Session only');
            await this.toggleSwitch('Attendance Required for Preceding and Associated CR Session');
            await this.toggleSwitch('Attendance Required for All Preceding CR Sessions Only');
            await this.toggleSwitch('Display Progress Bar During Quiz');
            await this.toggleSwitch('Randomize Questions Order');
            await this.toggleSwitch('Customize Questions Order');

            // Enable Quiz Timer
            await this.toggleSwitch('Enable Quiz Timer');
            await this.fill(this.timerInput, timeToComplete);


            // Toggle Feedback, Expiration & Submission switches
            await this.toggleSwitch('Allow Students to View Completed Quizzes');
            await this.toggleSwitch('Allow  to View Completed Quizzes Answer Feedback');
            await this.toggleSwitch('LMS Link Expiration');
            await this.toggleSwitch('Do not allow submit if questions skipped');
            await this.toggleSwitch('Delay Next Attempts If Student Failed');

            // Select Product if selectable items are present
            if (await this.isVisible(this.productSelectable, { timeout: 5000 }).catch(() => false)) {
                await this.click(this.productSelectable);
            }

            // Select CR Product if selectable items are present
            if (await this.isVisible(this.crProductSelectable, { timeout: 5000 }).catch(() => false)) {
                await this.click(this.crProductSelectable);
            }


            await this.waitForVisible(this.passFeedbackTextarea);
            await this.fill(this.passFeedbackTextarea, data.passFeedback);

            await this.waitForVisible(this.failFeedbackTextarea);
            await this.fill(this.failFeedbackTextarea, data.failFeedback);

            await this.waitForVisible(this.welcomeTextarea);
            await this.fill(this.welcomeTextarea, data.welcomeText);

            return this.quizName;
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
     * Searches for the added quiz by name and verifies it is visible in the grid.
     * @param {string} [quizName=this.quizName] - Name of the quiz to search and verify.
     **/
    async verifyQuizVisibleInGrid(quizName = this.quizName) {
        await test.step(`Verify quiz "${quizName}" is visible in grid`, async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, quizName);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);

            await this.waitForVisible(this.quizzesTable);
            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.verifyContainsText(this.quizzesTable, quizName);
        });
    }

    /**
     * Searches for the quiz in the grid and clicks its Edit button.
₹     **/
    async editQuiz() {
        await test.step(`Edit quiz`, async () => {

            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.click(this.editIcon);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Updates the status of the quiz to Deleted.
     **/
    async updateQuizStatusToDeleted() {
        await test.step('Update Quiz Status to Deleted', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusOptionDeleted);
            await this.click(this.statusOptionDeleted);
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
