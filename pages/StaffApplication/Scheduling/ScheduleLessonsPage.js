import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Schedule Lessons Page in Staff Portal (CSM).
 * Handles searching and selecting a student, picking an open time slot,
 * scheduling the lesson, and verifying the scheduled lesson.
 **/
export default class ScheduleLessonsPage extends BasePage {

    /**
     * Initializes locators for the Schedule Lessons Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        this.studentNameInput = page.locator('#txt_studentLessons_StudentName');
        this.studentNameOption = (name) => page.getByRole('option', { name: new RegExp(name, 'i') });
        this.selectStudentBtn = page.locator("#btn_btwScheduling_SelectStudent")

        // Open slots: buttons with date/time or green buttons
        this.openSlotButtons = page.locator('#btnSelectAppt');
        this.pickupLocation = page.locator('#txtPickuplocation');
        this.pickupLocationRadioButton = page.locator("//ul[@id='divPickupLocation']//input//following-sibling::ins").first();
        this.dropoffLocationRadioButton = page.locator("//ul[@id='divDropOffLocation']//input//following-sibling::ins").first();
        this.dropoffLocation = page.locator('#txtdropOfflocation');
        this.openSlotsCurrentPage = page.locator('.table-pager a.currentPage').first();
        this.scheduleLessonBtn = page.getByRole('button', { name: 'Schedule Lesson' });

        // Confirmation popup
        this.successCheckIcon = page.locator('.icon-check, .alert-success, i.fa-check').first();
        this.modal = page.locator('div.modal-body:visible')
        this.successMessage = page.locator('#SuccessMessage');
        this.errorMessage = page.locator('#errorMessage')
        this.closeModalBtn = page.locator("//div[@id='divScheduleMessage']//button[text()='Close']");


        //scheduled lesson
        this.clickHereToViewScheduledLesson = page.getByRole('link', { name: 'Click Here to View Scheduled Lessons' })
        this.scheduledLessonsTable = page.locator('#TableAlreadyScheduled');
        this.scheduledLessonsTableLastRow = page.locator("(//table[@id='TableAlreadyScheduled']//tr)[last()]");


    }


    /**
     * Searches for a student by name in Schedule Lessons page and selects from the dropdown.
     * @param {string} studentName - Student name to search.
     **/
    async searchAndSelectStudent(studentName) {
        await test.step(`Search and select student: "${studentName}"`, async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentNameInput, 1000);
            await this.click(this.studentNameInput);
            await this.clear(this.studentNameInput);
            await this.studentNameInput.fill(studentName);

            const option = this.studentNameOption(studentName);
            await this.waitForVisible(option, 10000);
            await this.click(option);
            await this.waitForLoaders();

            await this.click(this.selectStudentBtn).catch(() => {
            });

            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
            await this.waitForLoaders();
        });
    }

    /**
     * Selects any available open slot from last button to first.
     * If the selected slot displays an error message modal, closes the modal and tries the previous slot button.
     * @returns {Promise<string>} The selected slot text.
     **/
    async selectAnyOpenSlot() {
        return await test.step('Select an open appointment slot', async () => {
            let pageNum = 1;

            while (true) {
                await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
                });
                await this.waitForLoaders();
                await this.waitForVisible(this.openSlotButtons.first(), 10000);
                const slotCount = await this.openSlotButtons.count();

                if (slotCount === 0) {
                    throw new Error('No open appointment slots found on the page.');
                }

                for (let i = slotCount - 1; i >= 0; i--) {
                    const slotToSelect = this.openSlotButtons.nth(i);
                    const slotText = (await slotToSelect.textContent() || '').trim().replace(/\s+/g, ' ');

                    await this.click(slotToSelect);
                    await this.waitForLoaders();
                    await this.waitForVisible(this.modal, 20000);

                    // If error message modal is displayed, close modal and try the next slot button
                    const hasError = await this.isVisible(this.errorMessage, { timeout: 1500 }).catch(() => false);
                    if (hasError) {
                        await this.click(this.closeModalBtn);
                        await this.waitForLoaders();
                        await this.waitForHidden(this.closeModalBtn, 3000).catch(() => {
                        });
                        await this.waitForLoaders();
                        continue;
                    }

                    return slotText;
                }

                const navigatedToNextPage = await this.goToNextOpenSlotsPage(pageNum);
                if (!navigatedToNextPage) {
                    break;
                }

                pageNum++;
            }

            throw new Error('No open slot could be selected without an error across all pages.');
        });
    }

    /**
    * Navigates to the next available open-slots page in the table pager.
    * @param {number} currentPageNum - Current pager page number.
    * @returns {Promise<boolean>} True when navigation succeeded, otherwise false.
    **/
    async goToNextOpenSlotsPage(currentPageNum) {
        const nextPageLink = this.page.locator(`.table-pager a[href*="page=${currentPageNum + 1}"]`).first();
        const isNextAvailable = await this.isVisible(nextPageLink, { timeout: 1500 }).catch(() => false);

        if (!isNextAvailable) {
            return false;
        }

        const currentActiveText = await this.openSlotsCurrentPage.textContent().catch(() => String(currentPageNum));

        try {
            await this.click(nextPageLink);
        } catch {
            await this.jsClick(nextPageLink);
        }

        await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
        });
        await this.waitForLoaders();

        if (currentActiveText) {
            await expect(this.openSlotsCurrentPage).not.toHaveText(currentActiveText.trim(), { timeout: 7000 }).catch(() => {
            });
        }

        await this.waitForLoaders();
        return true;
    }


    /**
     * Clicks the 'Schedule Lesson' button to schedule the selected slot.
     **/
    async clickScheduleLesson() {
        await test.step('Click on "Schedule Lesson" button', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.scheduleLessonBtn, 500);
            if (await this.isVisible(this.pickupLocation)) {
                await this.fill(this.pickupLocation, "Pick Up location")
            } else if (await this.isVisible(this.pickupLocationRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.pickupLocationRadioButton);
            }

            if (await this.isVisible(this.dropoffLocation)) {
                await this.fill(this.dropoffLocation, "Drop Off location")
            } else if (await this.isVisible(this.dropoffLocationRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.dropoffLocationRadioButton);
            }
            await this.click(this.scheduleLessonBtn);
            await this.waitForLoaders();
            await this.waitForHidden(this.scheduleLessonBtn);
            await this.waitForVisible(this.successMessage, 10000);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the lesson scheduled confirmation popup appears.
     **/
    async verifyLessonScheduledSuccess() {
        await test.step('Verify lesson scheduled confirmation popup appears', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.successMessage, 5000);
            await this.verifyVisible(this.successMessage, 500);
            await this.click(this.closeModalBtn);
            await this.waitForLoaders();
            await this.waitForHidden(this.closeModalBtn, 3000).catch(() => {
            });
            await this.waitForLoaders();
        });
    }


    /**
     * Verifies that the lesson is scheduled.
     **/
    async verifyLessonIsScheduled(slotText) {
        await test.step('Verify lesson is scheduled successfully', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.clickHereToViewScheduledLesson, 5000);
            await this.click(this.clickHereToViewScheduledLesson);
            await this.waitForVisible(this.scheduledLessonsTable);
            const expectedHeaders = ['Date/Time', 'Starts in', 'Location', 'Cancel', 'Reschedule'];
            for (const header of expectedHeaders) {
                await expect(this.scheduledLessonsTable).toContainText(header);
            }
            await expect(this.scheduledLessonsTable).toContainText(slotText);
        });
    }

}
