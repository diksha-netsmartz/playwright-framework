import BasePage from '../../utils/BasePage';
import { test } from '@playwright/test';

/**
 * Page Object representing the Lesson Evaluation Page in Staff Portal.
 * Handles completing lesson evaluations, answering evaluation rubrics (Q1-Q20),
 * selecting travel time, adding public/private notes, digital signatures, and lesson finalization.
 **/
export default class ProcessYardSkills extends BasePage {

    /**
     * Initializes locators for the Process Yard Skills
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        this.processBtn = page.locator('b:has-text("PROCESS")').first();
        this.selectEvaluationBtn = page.locator("xpath=//button[@title='Select Evaluation']");
        this.selectEvalutionDropdownValue = page.locator("xpath=(//button[@title='Select Evaluation']//parent::div//li)[last()]");
        this.publicNotesTxt = page.locator("//textarea[contains(@id,'txtPublicLessonNotes')]");
        this.privateNotesTxt = page.locator("//textarea[contains(@id,'txtAreaPrivateLesson')]");
        this.studentSignatureCanvas = page.locator("(//canvas[contains(@id,'canvasStudentSignature')])[1]");
        this.instructorSignatureCanvas = page.locator("(//canvas[contains(@id,'canvasInstructorSignature')])[1]");
        this.completeLessonBtn = page.getByRole('button', { name: 'Complete Lesson' })
        this.confirmYesBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.questionCheckboxes = page.locator("//div[contains(@id,'divEvalQuestionNumber')]//input[@type='checkbox']//following-sibling::ins");
        this.durationBtn = page.locator("xpath=(//button[@title='Duration'])[1]");
        this.durationOption = page.locator("xpath=((//button[@title='Duration'])[1]//parent::div//li//a//span[1][not(text()='Duration')])[1]");
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
                await this.waitForLoaders();
                await this.page.waitForLoadState('load', { timeout: 5000 });
                await this.waitForHidden(this.selectEvaluationBtn);
            });
        }

    }

    /**
     * Click checkboxes for all evaluation
     **/
    async answerAllEvaluationQuestions() {
        await test.step('Check all evaluation question checkboxes and select duration', async () => {
            await this.waitForVisible(this.questionCheckboxes.first())
            const count = await this.questionCheckboxes.count();
            for (let i = 0; i < count; i++) {
                await this.click(this.questionCheckboxes.nth(i));
                await this.waitForVisible(this.durationBtn);
                await this.click(this.durationBtn);
                await this.click(this.durationOption);
            }
        });

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
        if (await this.isVisible(this.studentSignatureCanvas, { timeout: 100 }).catch(() => false)) {
            await test.step('Sign student digital signature', async () => {
                await this.#drawSignature(this.studentSignatureCanvas);
            });
        }
    }

    /**
     * Draws the instructor signature on the instructor signature canvas.
     **/
    async signInstructorSignature() {
        if (await this.isVisible(this.instructorSignatureCanvas, { timeout: 100 }).catch(() => false)) {
            await test.step('Sign instructor digital signature', async () => {
                await this.#drawSignature(this.instructorSignatureCanvas);
            });
        }
    }

    /**
     * Clicks the 'Complete Lesson' button to finalize the lesson.
     **/
    async completeLesson() {
        await test.step('Click Complete Lesson button', async () => {
            await this.click(this.completeLessonBtn);

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
            const successMessage = this.page.getByText(/Student evaluation saved successfully and lesson marked as Completed/i).first();
            await this.waitForVisible(successMessage);
            await this.verifyVisible(successMessage);
        });
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

}

