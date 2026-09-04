import BasePage from '../../utils/BasePage';
import { test } from '@playwright/test';

/**
 * Page Object representing the Lesson Evaluation Page in Staff Portal.
 * Handles completing lesson evaluations, answering evaluation rubrics (Q1-Q20),
 * selecting travel time, adding public/private notes, digital signatures, and lesson finalization.
 **/
export default class LessonEvaluationPage extends BasePage {

    /**
     * Initializes locators for the Lesson Evaluation Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        this.processBtn = page.locator('b:has-text("PROCESS")').first();
        this.selectEvaluationBtn = page.locator("xpath=//button[@title='Select Evaluation']");
        this.selectEvalutionDropdownValue = page.locator("xpath=(//button[@title='Select Evaluation']//parent::div//li)[last()]");
        this.travelTime = page.locator("xpath=//input[@name='travel' and @value='15']//following-sibling::ins");
        this.publicNotesTxt = page.locator('#txtAreaLessonNotes');
        this.privateNotesTxt = page.locator('#txtAreaPrivateLesson');
        this.studentSignatureCanvas = page.locator('#canvasStudentSignature');
        this.instructorSignatureCanvas = page.locator('#canvasInstructorSignature');
        this.completeLessonSendEmailBtn = page.getByRole('button', { name: 'Complete Lesson (Send Email)' });
        this.completeLessonBtn = page.getByRole('button', { name: 'Complete Lesson' })
        this.confirmYesBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.questionsDropdowns = page.locator("(//div[contains(@id,'divEvalQuestionNumber')])[1]");
        this.successMessageDiv = page.locator('#GlobalErrorSuccessDiv');
    }

    /**
     * Clicks the Process button to open the lesson evaluation view.
     **/
    async clickProcess() {
        await test.step('Click PROCESS button', async () => {
            await this.waitForLoaders();
            // await this.page.waitForTimeout(10000)
            if (await this.isVisible(this.processBtn, { timeout: 10000 }).catch(() => false)) {
                await this.click(this.processBtn);
                await this.waitForHidden(this.processBtn);
                await this.waitForLoaders();
                await this.page.waitForLoadState('load', { timeout: 5000 })
            }
        });
    }

    /**
     * Opens the evaluation dropdown and selects the last evaluation type.
     **/
    async selectEvaluation() {
        if (await this.isVisible(this.selectEvaluationBtn, { timeout: 5000 }).catch(() => false)) {
            await test.step('Select evaluation template from dropdown', async () => {
                await this.click(this.selectEvaluationBtn);
                await this.click(this.selectEvalutionDropdownValue);
            });
        }

    }

    /**
     * Selects a rating option for a specific evaluation question number.
     * @param {number} questionNumber - 1-based question number index.
     * @param {string} optionText - Option label text to select (e.g. '0-Safety Risk', '4-Competent').
     **/
    async selectQuestionByText(questionNumber, optionText) {
        const dropdownBtn = this.page.locator(`//div[@id='divEvalQuestionNumber${questionNumber}']//span[@class='filter-option pull-left']`);
        const dropdownValue = this.page.locator(`//div[@id='divEvalQuestionNumber${questionNumber}']//span[text()='${optionText}']`);
        if (await this.isVisible(dropdownBtn, { timeout: 5000 }).catch(() => false)) {
            await this.click(dropdownBtn);
            await this.click(dropdownValue);
        }
    }

    /**
     * Fills out answers for all evaluation questions (Q1 through Q20) with predefined rubric ratings.
     **/
    async answerAllEvaluationQuestions() {
        await test.step('Answer all evaluation questions (Q1 - Q20)', async () => {
            await this.selectQuestionByText(1, '0-Safety Risk');         // Q1
            await this.selectQuestionByText(2, '1-Improvement Needed');  // Q2
            await this.selectQuestionByText(3, '0-Safety Risk');         // Q3
            await this.selectQuestionByText(4, '1-Improvement Needed');  // Q4
            await this.selectQuestionByText(5, '1-Improvement Needed');  // Q5
            await this.selectQuestionByText(6, '2-Beginning');           // Q6
            await this.selectQuestionByText(7, '4-Competent');           // Q7
            await this.selectQuestionByText(8, '5-Exemplary');           // Q8
            await this.selectQuestionByText(9, '5-Exemplary');           // Q9
            await this.selectQuestionByText(10, '4-Competent');          // Q10
            await this.selectQuestionByText(11, '2-Beginning');          // Q11
            await this.selectQuestionByText(12, '3-Progressing');        // Q12
            await this.selectQuestionByText(13, '2-Beginning');          // Q13
            await this.selectQuestionByText(14, '3-Progressing');
            await this.selectQuestionByText(15, '3-Progressing');        // Q14
            await this.selectQuestionByText(16, '0-Safety Risk');        // Q16
            await this.selectQuestionByText(17, '3-Progressing');        // Q17
            await this.selectQuestionByText(18, '2-Beginning');          // Q18
            await this.selectQuestionByText(19, '4-Competent');          // Q19
            await this.selectQuestionByText(20, '1-Improvement Needed'); // Q20

        });
    }

    /**
     * Selects the 15-minute travel time option.
     **/
    async selectTravelTime() {
        if (await this.isVisible(this.travelTime, { timeout: 5000 }).catch(() => false)) {
            await test.step('Select 15 min travel time option', async () => {
                await this.check(this.travelTime);
            });
        }

    }

    /**
     * Enters public notes visible to student and parents in the evaluation form.
     **/
    async enterPublicNotes() {
        await test.step('Enter public notes', async () => {
            await this.fill(this.publicNotesTxt, 'public notes');
        });
    }

    /**
     * Enters private staff-only notes in the evaluation form.
     **/
    async enterPrivateNotes() {
        await test.step('Enter private notes', async () => {
            await this.fill(this.privateNotesTxt, 'private notes');
        });
    }

    /**
     * Private helper to simulate drawing a signature stroke on an HTML5 canvas element using mouse coordinates.
     * @param {import('@playwright/test').Locator} canvas - Locator for the signature canvas element.
     **/
    async #drawSignature(canvas) {
        await canvas.scrollIntoViewIfNeeded();
        const box = await canvas.boundingBox();
        const startX = box.x + box.width * 0.2;
        const startY = box.y + box.height * 0.5;
        const endX = box.x + box.width * 0.8;
        const endY = box.y + box.height * 0.5;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(endX, endY, { steps: 10 });
        await this.page.mouse.up();
    }

    /**
     * Draws the student signature on the student signature canvas.
     **/
    async signStudentSignature() {
        await test.step('Sign student digital signature', async () => {
            await this.#drawSignature(this.studentSignatureCanvas);
        });
    }

    /**
     * Draws the instructor signature on the instructor signature canvas.
     **/
    async signInstructorSignature() {
        await test.step('Sign instructor digital signature', async () => {
            await this.#drawSignature(this.instructorSignatureCanvas);
        });
    }

    /**
     * Clicks the 'Complete Lesson (Send Email)' button to finalize the lesson.
     **/
    async completeLesson() {
        await test.step('Click Complete Lesson button', async () => {
            if (await this.isVisible(this.completeLessonSendEmailBtn, { timeout: 3000 }).catch(() => false)) {
                await this.click(this.completeLessonSendEmailBtn);
            } else if (await this.isVisible(this.completeLessonBtn, { timeout: 3000 }).catch(() => false)) {
                await this.click(this.completeLessonBtn);
            }
        });
    }

    /**
     * Confirms the lesson completion popup by clicking 'Yes'.
     **/
    async confirmLessonCompletion() {
        await test.step('Confirm lesson completion popup', async () => {
            await this.click(this.confirmYesBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the success alert 'Success! Lesson completed and evaluation saved.' is visible.
     **/
    async verifyLessonCompletedSuccessfully() {
        await test.step('Verify "Success! Lesson completed and evaluation saved." message', async () => {
            await this.waitForVisible(this.page.getByText('Success! Lesson completed and evaluation saved.', { exact: true }));
            await this.verifyVisible(this.page.getByText('Success! Lesson completed and evaluation saved.', { exact: true }));
        });
    }
}

