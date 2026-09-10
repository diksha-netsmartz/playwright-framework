import BasePage from '../../utils/BasePage';
import { test } from '@playwright/test';

/**
 * Page Object representing the Lesson Evaluation Page in Staff Portal.
 * Handles completing lesson evaluations, answering evaluation rubrics (Q1-Q20),
 * selecting travel time, adding public/private notes, digital signatures, and lesson finalization.
 **/
export default class ProcessLesson extends BasePage {

    /**
     * Initializes locators for the Process Lesson page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        this.processBtn = page.locator('b:has-text("PROCESS")').first();
        this.selectEvaluationBtn = page.locator("xpath=//button[@title='Select Evaluation']");
        this.selectEvalutionDropdownValue = page.locator("xpath=(//button[@title='Select Evaluation']//parent::div//li)[last()]");
        this.travelTime = page.locator("xpath=//input[@name='travel' and @value='15']//following-sibling::ins");
        this.publicNotesTxt = page.locator('#txtAreaLessonNotes')
        this.privateNotesTxt = page.locator('#txtAreaPrivateLesson')
        this.studentSignatureCanvas = page.locator('#canvasStudentSignature , #canvasObserverSignature')
        this.instructorSignatureCanvas = page.locator('#canvasInstructorSignature')
        this.completeLessonSendEmailBtn = page.getByRole('button', { name: 'Complete Lesson (Send Email)' });
        this.confirmYesBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.questionsDropdowns = page.locator("//div[contains(@id,'divEvalQuestionNumber')]//button[@title='Select']");
        this.questionsOptionSelect = page.locator("(//div[contains(@id,'divEvalQuestionNumber')]//button[@title='Select']//following-sibling::div//ul//li[not(@class='selected')])[1]");
        this.actualStartTimeDropdown = page.locator("button[data-id='txt_odometer_starttime']");
        this.actualStartTimeValue = page.locator("(//button[@data-id='txt_odometer_starttime']//parent::div//ul//li[not (contains (@class,'selected'))])[1]");
        this.actualEndTimeDropdown = page.locator("button[data-id='txt_odometer_endtime']");
        this.actualEndTimeValue = page.locator("(//button[@data-id='txt_odometer_endtime']//parent::div//ul//li[not (contains (@class,'selected'))])[1]");
        this.odometerStartValue = page.locator('#txt_odometer_startNumber')
        this.odometerEndValue = page.locator('#txt_odometer_endNumber')

    }

    /**
     * Clicks the Process button to open the lesson evaluation view.
     **/
    async clickProcess() {
        await test.step('Click PROCESS button', async () => {
            await this.waitForLoaders();
            await this.page.waitForTimeout(5000);
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
        if (await this.isVisible(this.selectEvaluationBtn, { timeout: 2000 }).catch(() => false)) {
            await test.step('Select evaluation template from dropdown', async () => {
                await this.click(this.selectEvaluationBtn);
                await this.click(this.selectEvalutionDropdownValue);
            });
        }

    }

    /**
   * Select actual start and end time dropdown values
   **/
    async SelectActualStartAndEndTime() {
        if (await this.isVisible(this.actualStartTimeDropdown, { timeout: 2000 }).catch(() => false)) {
            await test.step('Select Actual start time from dropdown', async () => {
                await this.click(this.actualStartTimeDropdown);
                await this.click(this.actualStartTimeValue);
            });
        }

        if (await this.isVisible(this.actualEndTimeDropdown, { timeout: 2000 }).catch(() => false)) {
            await test.step('Select Actual end time from dropdown', async () => {
                await this.click(this.actualEndTimeDropdown);
                await this.click(this.actualEndTimeValue);
            });
        }

    }

    /**
* Fill odometer start and end value
**/
    async FillOdometerStartAndEndValue() {
        if (await this.isVisible(this.odometerStartValue, { timeout: 2000 }).catch(() => false)) {
            await test.step('Fill odometer start value', async () => {
                await this.fill(this.odometerStartValue, '1000');
            });
        }

        if (await this.isVisible(this.odometerEndValue, { timeout: 2000 }).catch(() => false)) {
            await test.step('Fill odometer end value', async () => {
                await this.fill(this.odometerEndValue, '1000');
            });
        }

    }



    /**
     * Fills out answers for all evaluation questions dynamically by finding all dropdowns
     * with title 'Select' and selecting a valid option (other than 'Select' / 'Please Select').
     * @param {'last' | 'first'} [preference='last'] - Select the last or first valid option in the dropdown.
     **/
    async answerAllEvaluationQuestions(preference = 'last') {
        await test.step('Answer all evaluation questions', async () => {
            await this.waitForLoaders();
            const totalCount = await this.questionsDropdowns.count();

            for (let i = 0; i < totalCount; i++) {
                const remainingCount = await this.questionsDropdowns.count();
                if (remainingCount === 0) break;

                const dropdown = this.questionsDropdowns.first();
                // await dropdown.scrollIntoViewIfNeeded();
                await this.click(dropdown);
                await this.waitForVisible(this.questionsOptionSelect, 3000)
                await this.click(this.questionsOptionSelect);
                await this.waitForLoaders();
                await this.page.waitForTimeout(300);
            }
        });
    }



    /**
     * Selects the 15-minute travel time option.
     **/
    async selectTravelTime() {
        if (await this.isVisible(this.travelTime, { timeout: 2000 }).catch(() => false)) {
            await test.step('Select 15 min travel time option', async () => {
                await this.check(this.travelTime);
            });
        }

    }

    /**
     * Enters public notes visible to student and parents in the evaluation form.
     **/
    async enterPublicNotes() {
        // if (await this.isVisible(this.publicNotesTxt, { timeout: 2000 }).catch(() => false)) {
        await test.step('Enter public notes', async () => {
            await this.fill(this.publicNotesTxt, 'public notes');
        });
        // }
    }

    /**
     * Enters private staff-only notes in the evaluation form.
     **/
    async enterPrivateNotes() {
        // if (await this.isVisible(this.privateNotesTxt, { timeout: 2000 }).catch(() => false)) {
        await test.step('Enter private notes', async () => {
            await this.fill(this.privateNotesTxt, 'private notes');
        });
        // }
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
            await this.click(this.completeLessonSendEmailBtn);

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
     * Verifies that the success alert message is visible (either template).
     **/
    async verifyLessonCompletedSuccessfully() {
        await test.step('Verify lesson completed success message', async () => {
            const successMessage = this.page.getByText(/Success! Lesson completed and evaluation saved/i).first();
            await this.waitForVisible(successMessage, { timeout: 30000 });
            await this.verifyVisible(successMessage);
        });
    }
}

