import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Schedule My Lessons Page in Student Portal (CSP)
 * (Scheduling >> Schedule My Lessons).
 * Handles picking an open time slot, scheduling the lesson, verifying the scheduled lesson,
 * and cancelling the appointment.
 **/
export default class StudentScheduleLessonsPage extends BasePage {

    /**
     * Initializes locators for Student Schedule Lessons Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Open slots: buttons or links with appointment date and time
        this.openSlotButtons = page.locator('#btnSelectAppt');
        this.openSlotsCurrentPage = page.locator('.table-pager a.currentPage').first();
        this.pickupLocation = page.locator('#txtPickuplocation , #txtPickuplocationResch');
        this.pickupLocationRadioButton = page.locator("//ul[@id='divPickupLocation' or @id='divPickupLocationResch']//input//following-sibling::ins").first()
        this.dropoffLocation = page.locator('#txtdropOfflocation, #txtdropOfflocationResch');
        this.dropoffLocationRadioButton = page.locator("//ul[@id='divDropOffLocation' or @id='divDropOffLocationResch']//input//following-sibling::ins").first();
        this.scheduleLessonBtn = page.getByRole('button', { name: 'Schedule Lesson' }).last();

        // Confirmation popup
        this.successCheckIcon = page.locator('.icon-check, .alert-success, i.fa-check').first();
        this.modal = page.locator('div.modal-body:visible')
        this.successMessage = page.locator('#SuccessMessage');
        this.errorMessage = page.locator('#errorMessage').or(page.getByText('Student is scheduled for class at this time.'));
        this.closeModalBtn = page.locator("//div[@id='divScheduleMessage']//button[text()='Close']");

        // Scheduled lessons view
        this.clickHereToViewScheduledLesson = page.getByRole('link', { name: 'Click Here to View Scheduled Lessons' })
        this.scheduledLessonsTable = page.locator('#TableAlreadyScheduled');

        // Cancel appointment locators
        this.cancelButton = page.locator("//table[@id='TableAlreadyScheduled']//a[contains(text(),'Cancel')]");
        this.cancelledSlotText = page.locator("//table[@id='TableAlreadyScheduled']//a[contains(text(),'Cancel')]//ancestor::tr//td[1]");
        this.confirmCancelLessonBtn = page.getByRole('button', { name: 'Yes, Cancel Lesson' })

        this.rescheduleButton = page.locator("//table[@id='TableAlreadyScheduled']//a[contains(text(),'Reschedule')]");
        this.rescheduledSlotText = page.locator("//table[@id='TableAlreadyScheduled']//a[contains(text(),'Reschedule')]//ancestor::tr//td[1]");
        this.rescheduleOpenSlotButton = page.locator('#btnSelectApptRescheudle')

        this.changeDropdown = page.getByRole('button', { name: 'Change' }).last();
        this.rescheduleOptionInDropdown = page.locator('.fa-calendar:visible');
        this.cancelOptionInDropdown = page.locator('.fa-ban:visible');

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
     * Fills pickup and dropoff locations (if present) and clicks 'Schedule Lesson' button.
     * @param {string} [pickup] - Pickup location text.
     * @param {string} [dropoff] - Dropoff location text.
     **/
    async clickScheduleLesson(pickup, dropoff) {
        await test.step('Click on "Schedule Lesson" button', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.scheduleLessonBtn, 5000);

            if (await this.isVisible(this.pickupLocation, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.pickupLocation, pickup);
            } else if (await this.isVisible(this.pickupLocationRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.pickupLocationRadioButton);
            }

            if (await this.isVisible(this.dropoffLocation, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.dropoffLocation, dropoff);
            } else if (await this.isVisible(this.dropoffLocationRadioButton, { timeout: 100 }).catch(() => false)) {
                await this.click(this.dropoffLocationRadioButton);
            }

            await this.click(this.scheduleLessonBtn);
            await this.waitForLoaders();
            await this.waitForHidden(this.scheduleLessonBtn, 10000).catch(() => {
            });
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the lesson scheduled confirmation popup appears.
     **/
    async verifyLessonScheduledSuccess() {
        await test.step('Verify lesson scheduled confirmation popup appears', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.waitForVisible(this.successMessage, 10000);
            await this.verifyVisible(this.successMessage, 500);
            await this.verifyContainsText(this.successMessage, "scheduled");
            await this.click(this.closeModalBtn);
            await this.waitForLoaders();
            await this.waitForHidden(this.closeModalBtn, 3000).catch(() => {
            });
            await this.waitForLoaders();
        });
    }

    /**
     * Navigates to "Click Here to View Scheduled Lessons" and verifies that the lesson is scheduled.
     * @param {string} slotText - The text of the scheduled slot.
     **/
    async verifyLessonIsScheduled(slotText) {
        await test.step('Verify lesson is scheduled successfully', async () => {
            if (!await this.isVisible(this.scheduledLessonsTable, { timeout: 2000 }).catch(() => false)) {
                await this.waitForVisible(this.clickHereToViewScheduledLesson, 1000);
                await this.click(this.clickHereToViewScheduledLesson);
                await this.waitForLoaders();
            }

            await this.waitForVisible(this.scheduledLessonsTable, 2000);

            const expectedHeaders = ['Date/Time', 'Cancel', 'Reschedule', 'Location'];
            for (const header of expectedHeaders) {
                await expect(this.scheduledLessonsTable).toContainText(header);
            }

            await expect(this.scheduledLessonsTable).toContainText(slotText);
        });
    }

    /**
     * Locates scheduled appointments and cancels one by iterating through available cancel buttons from last to first.
     * If the selected appointment displays an error message modal, closes the modal and tries the previous appointment.
     **/
    async cancelScheduledLesson() {
        return await test.step('Cancel scheduled lesson', async () => {
            await this.waitForLoaders();

            // Ensure scheduled lessons table is visible
            if (!await this.isVisible(this.scheduledLessonsTable, { timeout: 2000 }).catch(() => false)) {
                await this.waitForVisible(this.clickHereToViewScheduledLesson, 1000);
                await this.click(this.clickHereToViewScheduledLesson);
                await this.waitForLoaders();
            }

            await this.waitForVisible(this.scheduledLessonsTable, 1000);
            await this.waitForVisible(this.cancelButton.first(), 1000);
            const cancelCount = await this.cancelButton.count();

            if (cancelCount === 0) {
                throw new Error('No scheduled lessons found to cancel.');
            }

            let cancelledSlot = '';
            let slotFound = false;

            for (let i = cancelCount - 1; i >= 0; i--) {
                const slotToCancel = this.cancelButton.nth(i);
                cancelledSlot = (await this.getText(this.cancelledSlotText.nth(i)) || '').trim().replace(/\s+/g, ' ');

                await this.click(slotToCancel);
                await this.waitForLoaders();
                await this.waitForVisible(this.modal, 10000);

                // If error message modal is displayed, close modal and try the previous slot button
                const hasError = await this.isVisible(this.errorMessage, { timeout: 1500 }).catch(() => false);
                if (hasError) {
                    await this.click(this.closeModalBtn);
                    await this.waitForLoaders();
                    await this.waitForHidden(this.closeModalBtn, 3000).catch(() => {
                    });
                    await this.waitForLoaders();
                    continue;
                }

                slotFound = true;
                break;
            }

            if (!slotFound) {
                throw new Error('No scheduled lesson could be cancelled without an error.');
            }

            // Confirmation popup
            await this.waitForVisible(this.confirmCancelLessonBtn, 1000);
            await this.click(this.confirmCancelLessonBtn);
            await this.waitForLoaders();
            return cancelledSlot;
        });
    }

    /**
     * Verifies that the appointment cancelled confirmation popup appears and closes it.
     **/
    async verifyCancellationSuccess() {
        await test.step('Verify appointment cancelled confirmation popup appears', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.successMessage, 5000);
            await expect(this.successMessage).toContainText(/cancelled successfully/i);
            await this.click(this.closeModalBtn);
            await this.waitForLoaders();
            await this.waitForHidden(this.closeModalBtn, 3000).catch(() => {
            });
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the cancelled lesson is no longer listed as active in scheduled appointments.
     * @param {string} slotText - The slot text of the cancelled appointment.
     **/
    async verifyLessonIsCancelledOrRescheduled(slotText) {
        await test.step(`Verify lesson for slot "${slotText}" is no longer active in scheduled appointments.`, async () => {
            await this.waitForLoaders();
            if (!await this.isVisible(this.scheduledLessonsTable, { timeout: 2000 }).catch(() => false)) {
                if (await this.isVisible(this.clickHereToViewScheduledLesson, { timeout: 2000 }).catch(() => false)) {
                    await this.click(this.clickHereToViewScheduledLesson);
                    await this.waitForLoaders();
                }
            }

            await expect(this.scheduledLessonsTable).not.toContainText(slotText);
        });
    }


    /**
     * Locates scheduled appointments and reschedules one by iterating through available reschedule buttons from last to first.
     * If the selected appointment displays an error message modal, closes the modal and tries the previous appointment.
     * @returns {Promise<string>} The rescheduled slot text.
     **/
    async rescheduleScheduledLesson() {
        return await test.step('Reschedule scheduled lesson', async () => {
            await this.waitForLoaders();

            // Ensure scheduled lessons table is visible
            if (!await this.isVisible(this.scheduledLessonsTable, { timeout: 1000 }).catch(() => false)) {
                await this.waitForVisible(this.clickHereToViewScheduledLesson, 1000);
                await this.click(this.clickHereToViewScheduledLesson);
                await this.waitForLoaders();
            }

            await this.waitForVisible(this.scheduledLessonsTable, 2000);
            await this.waitForVisible(this.rescheduleButton.first(), 5000);
            const rescheduleCount = await this.rescheduleButton.count();

            if (rescheduleCount === 0) {
                throw new Error('No scheduled lessons found to reschedule.');
            }

            let rescheduledSlotText = '';
            let slotFound = false;

            for (let i = rescheduleCount - 1; i >= 0; i--) {
                const slotToReschedule = this.rescheduleButton.nth(i);
                rescheduledSlotText = (await this.getText(this.rescheduledSlotText.nth(i)) || '').trim().replace(/\s+/g, ' ');

                await this.click(slotToReschedule);
                await this.waitForLoaders();

                // If error message modal is displayed, close modal and try the previous slot button
                const hasError = await this.isVisible(this.errorMessage, { timeout: 1500 }).catch(() => false);
                if (hasError) {
                    await this.click(this.closeModalBtn);
                    await this.waitForLoaders();
                    await this.waitForHidden(this.closeModalBtn, 3000).catch(() => {
                    });
                    await this.waitForLoaders();
                    continue;
                }

                slotFound = true;
                break;
            }

            if (!slotFound) {
                throw new Error('No scheduled lesson could be rescheduled without an error.');
            }

            await this.waitForVisible(this.rescheduleOpenSlotButton.first(), 15000);
            return rescheduledSlotText;
        });
    }

    /**
     * Selects any available open slot from last button to first.
     * If the selected slot displays an error message modal, closes the modal and tries the previous slot button.
     * @returns {Promise<string>} The selected slot text.
     **/
    async selectAnyOpenSlotForReschedule() {
        return await test.step('Select an open appointment slot', async () => {
            let pageNum = 1;

            while (true) {
                await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
                });
                await this.waitForLoaders();
                await this.waitForVisible(this.rescheduleOpenSlotButton.first(), 2000);
                const slotCount = await this.rescheduleOpenSlotButton.count();

                if (slotCount === 0) {
                    throw new Error('No open appointment slots found on the page.');
                }

                for (let i = slotCount - 1; i >= 0; i--) {
                    const slotToSelect = this.rescheduleOpenSlotButton.nth(i);
                    const slotText = (await slotToSelect.textContent() || '').trim().replace(/\s+/g, ' ');

                    await this.click(slotToSelect);
                    await this.waitForLoaders();
                    await this.waitForVisible(this.modal, 10000);

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
     * Selects reschedule option from dropdown.
     **/
    async selectRescheduleOptionFromDropdown() {
        await test.step('Select reschedule option from dropdown', async () => {
            await this.waitForVisible(this.changeDropdown, { timeout: 3000 });
            await this.click(this.changeDropdown);
            await this.waitForVisible(this.rescheduleOptionInDropdown, { timeout: 3000 });
            await this.click(this.rescheduleOptionInDropdown);

        });
    }

    /**
     * Selects cancel lesson option from dropdown.
     **/
    async selectCancelOptionFromDropdown() {
        await test.step('Select cancel lesson option from dropdown', async () => {
            await this.waitForVisible(this.changeDropdown, { timeout: 3000 });
            await this.click(this.changeDropdown);
            await this.waitForVisible(this.cancelOptionInDropdown, { timeout: 3000 });
            await this.click(this.cancelOptionInDropdown);

        });
    }
}
