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
     * Marks an appointment in the 'Needs Attention' widget as No Show with notes and confirms the action.
    **/
    async markAppointmentAsNoShow() {
        await test.step('Mark appointment as No Show and confirm', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.needsAttentionWidget);


            await this.click(this.actionDropdownBtn);
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
                await test.step('Toast message "Appointment marked No Show successfully" appeared', async () => { });
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

            await this.click(this.actionDropdownBtn2);
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
                await test.step('Toast message "Appointment cancelled successfully" appeared', async () => { });
            } else {
                await test.step('Toast message "Appointment cancelled successfully" did NOT appear', async () => {
                    expect(isToastAppeared, 'Toast message "Appointment cancelled successfully" did not appear on page within 10 seconds').toBe(true);
                });
            }

        });
    }
}

