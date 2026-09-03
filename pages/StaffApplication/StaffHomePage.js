import BasePage from '../../utils/BasePage';
import { expect, test } from '@playwright/test';

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
        this.actionDropdownBtn2 = page.locator("xpath=(//i[contains(@class,'warning')]//ancestor::div[3]//button[contains(text(),'ACTION')])[2]");
        this.actionDropdownButtonsList = page.locator("//i[contains(@class,'warning')]//ancestor::div[3]//button[contains(text(),'ACTION')]");
        this.processLink = page.locator("xpath=(//a//strong[text()='Process'])[last()]");
        this.noShowLink = page.locator("xpath=(//a//strong[text()='No Show'])[last()]");
        this.noShowTextbox = page.locator("#txtnoShowNotes");
        this.noShowButton = page.locator("#btnNoShowLesson").last();
        this.yesConfirmationButton = page.locator("#btnDeleteConfirmation");
        this.fullAppointmentYesButton = page.locator('#btnDeleteMakeFullAppointment:visible')
        this.cancelLink = page.locator("xpath=(//a//strong[text()='Cancel'])[last()]");
        this.cancelTextbox = page.locator("#txtArea_CancelLesson");
        this.cancelButton = page.locator("#btnCancelLesson").first();
    }

    /**
     * Opens the action dropdown on the latest item in the 'Needs Attention' widget and clicks 'Process'.
    **/
    async clickProcess() {
        await test.step('Click Process in "Needs Attention" widget', async () => {
            await this.waitForVisible(this.needsAttentionWidget);
            await this.click(this.actionDropdownBtn);
            await this.click(this.processLink);
            await this.waitForLoaders();
            await this.page.waitForTimeout(10000)
            await this.verifyTitle(/Process Lesson|Process Yard Skills/i);
        });
    }

    /**
     * Retrieves the count of action dropdown buttons currently visible in the 'Needs Attention' widget.
     * @returns {Promise<number>}
     */
    async getActionDropdownCount() {
        await this.waitForLoaders().catch(() => { });
        return await this.actionDropdownButtonsList.count();
    }

    /**
     * Verifies that either:
     * 1. The success message banner was detected (toastSeen === true), OR
     * 2. If the banner was not detected, the actionDropdownButtonsList count was decremented by 1.
     * If neither condition is met, fails the test.
     * @param {number} initialCount - Button count before triggering the action.
     * @param {boolean} toastSeen - Whether the message banner was detected.
     * @param {string} actionDescription - Label for logging and error reporting.
     */
    async verifySuccessOrCountDecremented(initialCount, toastSeen, actionDescription = 'Action') {
        if (toastSeen) {
            await test.step(`Verified: "${actionDescription}" message banner was displayed`, async () => { });
            return;
        }

        // Fallback: If banner was not received, verify that count is decremented by 1
        await this.waitForLoaders().catch(() => { });

        const expectedCount = Math.max(0, initialCount - 1);
        let finalCount = await this.actionDropdownButtonsList.count();

        // If count hasn't decremented immediately, poll for up to 10s for the DOM / table to update
        if (finalCount !== expectedCount) {
            try {
                await expect.poll(async () => {
                    await this.waitForLoaders().catch(() => { });
                    return await this.actionDropdownButtonsList.count();
                }, {
                    timeout: 10000,
                    intervals: [1000, 2000]
                }).toBe(expectedCount);
                finalCount = expectedCount;
            } catch {
                finalCount = await this.actionDropdownButtonsList.count();
            }
        }

        const isCountDecremented = finalCount === expectedCount;

        if (!isCountDecremented) {
            expect(finalCount).toBe(expectedCount);
        }

        await test.step(`Verified: ${actionDescription}`, async () => { });
    }

    /**
     * Marks an appointment in the 'Needs Attention' widget as No Show with notes and confirms the action.
    **/
    async markAppointmentAsNoShow() {
        await test.step('Mark appointment as No Show and confirm', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.needsAttentionWidget);

            const initialCount = await this.getActionDropdownCount();

            await this.click(this.actionDropdownBtn);
            await this.click(this.noShowLink);
            await this.waitForVisible(this.noShowTextbox);
            await this.fill(this.noShowTextbox, "no show appointment");
            await this.click(this.noShowButton);

            await this.click(this.yesConfirmationButton);

            await this.page.waitForTimeout(1000);
            if (await this.isVisible(this.fullAppointmentYesButton)) {
                await this.click(this.fullAppointmentYesButton);
            }

            // Catch the transient banner as soon as it appears in the DOM/page
            const toastSeen = await this.page.waitForFunction(() => {
                const text = document.body.innerText || '';
                return text.includes('No Show successfully') || (text.includes('no show') && text.includes('successfully'));
            }, { timeout: 15000 }).then(() => true).catch(() => false);

            await this.verifySuccessOrCountDecremented(
                initialCount,
                toastSeen,
                'Appointment marked No Show successfully.'
            );

            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Cancels an appointment in the 'Needs Attention' widget with cancellation notes and confirms the action.
    **/
    async markAppointmentAsCancel() {
        await test.step('Cancel appointment and confirm', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.needsAttentionWidget);

            const initialCount = await this.getActionDropdownCount();

            await this.click(this.actionDropdownBtn2);
            await this.click(this.cancelLink);
            await this.waitForLoaders();
            await this.waitForVisible(this.cancelTextbox);
            await this.fill(this.cancelTextbox, "cancel appointment");
            await this.click(this.cancelButton);

            await this.click(this.yesConfirmationButton);

            // Catch the transient banner as soon as it appears in the DOM/page before page reload removes it
            const toastSeen = await this.page.waitForFunction(() => {
                const text = document.body.innerText || '';
                return /cance[l]+ed successfully/i.test(text) || (text.includes('Appointment') && /cance[l]+ed/i.test(text));
            }, { timeout: 7000 }).then(() => true).catch(() => false);

            await this.verifySuccessOrCountDecremented(
                initialCount,
                toastSeen,
                'Appointment cancelled successfully.'
            );

            await this.waitForLoaders().catch(() => { });
        });
    }
}

