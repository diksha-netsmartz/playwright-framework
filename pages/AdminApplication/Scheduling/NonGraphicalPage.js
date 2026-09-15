import BasePage from "../../../utils/BasePage";
import { expect, test } from "@playwright/test";

/**
 * Page Object representing the Non Graphical Scheduler Page in Admin Portal.
 * Handles searching students, selecting available dates/slots, choosing appointment & status types,
 * scheduling appointments into slots, and verifying confirmation toast messages.
 **/
export default class NonGraphicalPage extends BasePage {

    /**
     * Initializes locators for the Non Graphical Scheduler Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        // Student search
        this.studentSearchInput = page.getByRole('textbox', { name: 'Enter Student Name' });
        this.selectStudentButton = page.getByRole('button', { name: 'Select Student' });

        // Slot selection
        this.firstSlotCheckbox = page.locator("xpath=(//input[contains(@id,'BookSlot')]//following-sibling::span)[1]");
        this.noRecordsFound = page.locator("xpath=//td[text()='No records found.']");
        this.appointmentTypeDropdown = page.locator('#drp_OpenSlotBookAppointment_product_0');
        this.statusTypeDropdown = page.locator('#drp_OpenSlotBookAppointment_AppointmentStatus_0');

        // Schedule action
        this.scheduleIntoSlotButton = page.getByText('Schedule Student Into Slot(s)');
        this.confirmYesButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
    }

    /**
     * Returns locator for a student dropdown option matching the provided text.
     * @param {string} optionText - Visible option text for student option.
     * @returns {import('@playwright/test').Locator} Locator for the student option.
      **/
    studentDropdownOption(optionText) {
        return this.page.getByRole('option', { name: optionText });
    }

    /**
     * Searches for a student by sequentially typing the student name into the search input.
     * @param {string} studentName - Name of student to search.
    **/
    async searchStudent(studentName) {
        await test.step(`Search student in Non-Graphical scheduler: "${studentName}"`, async () => {
            await this.waitForVisible(this.studentSearchInput);
            await expect(this.studentSearchInput).toBeEnabled();
            await this.click(this.studentSearchInput);
            await expect(this.studentSearchInput).toBeFocused();
            await this.pressSequentially(this.studentSearchInput, studentName);
        });
    }

    /**
     * Waits for and clicks the specified student dropdown option.
     * @param {string} optionText - Option text to select.
    **/
    async selectStudentOption(optionText) {
        await test.step(`Select student option: "${optionText}"`, async () => {
            const option = this.studentDropdownOption(optionText);
            await this.waitForVisible(option);
            await this.click(option);
        });
    }

    /**
     * Clicks the Select Student button to confirm the selected student.
    **/
    async clickSelectStudent() {
        await test.step('Click Select Student button', async () => {
            await this.click(this.selectStudentButton);
        });
    }

    /**
     * Iterates through available/highlighted dates in the date picker calendar until a date with open time slots is found.
     * If 'No records found.' is displayed, it clicks the next available highlighted date.
    **/
    async selectFirstAvailableDate() {
        await test.step('Find and select first calendar date with available slots', async () => {
            const availableDates = this.page.locator('td.ui-highlight:not(.ui-datepicker-current-day) a');
            const count = await availableDates.count();

            if (count === 0) {
                throw new Error('No highlighted dates found in the calendar.');
            }

            for (let i = 0; i < count; i++) {
                const dateToClick = availableDates.nth(i);
                await this.click(dateToClick);
                await this.waitForLoaders();
                await this.page.waitForLoadState('load', { timeout: 5000 })

                // Wait for the slots table to refresh after selecting the date
                // await this.page.waitForTimeout(5000);

                const hasNoRecords = await this.isVisible(this.noRecordsFound, { timeout: 5000 }).catch(() => false);
                const hasSlot = await this.isVisible(this.firstSlotCheckbox, { timeout: 5000 }).catch(() => false);

                if (hasSlot) {
                    console.log(`Found available slots on highlighted date #${i + 1}`);
                    return;
                }

                console.log(`'No records found.' on date #${i + 1}. Trying next available date...`);
            }

            throw new Error('No open slots found for any of the highlighted dates in the calendar.');
        });
    }

    /**
     * Iterates through available slots, selects a slot, chooses a valid appointment type and status,
     * attempts to schedule, and if an error occurs (e.g. 'Student is not available'), deselects that slot
     * and tries the next slot until scheduling succeeds with a confirmation toast.
     **/
    async scheduleIntoSlot() {
        await test.step('Schedule student into slot with retry on next available slot', async () => {
            const slotSpans = this.page.locator("//input[contains(@id,'BookSlot')]//following-sibling::span");
            const slotInputs = this.page.locator("//input[contains(@id,'BookSlot')]");

            await this.waitForVisible(slotSpans.first(), 10000);
            const totalSlots = await slotSpans.count();

            if (totalSlots === 0) {
                throw new Error('No slots available to schedule on the selected date.');
            }

            console.log(`Found ${totalSlots} available slot(s) to attempt scheduling.`);

            for (let index = 0; index < totalSlots; index++) {
                console.log(`--- Attempting slot row ${index + 1} of ${totalSlots} ---`);

                // 1. Clear any old toast notifications from previous attempts
                await this.page.evaluate(() => {
                    const toasts = document.querySelectorAll('#toast-container .toast, .toast');
                    toasts.forEach(t => t.remove());
                }).catch(() => { });

                // 2. Select the slot checkbox for row index (using Playwright's 0-indexed .nth())
                const currentInput = slotInputs.nth(index);
                const currentSpan = slotSpans.nth(index);

                await this.waitForVisible(currentSpan);
                if (!await currentInput.isChecked().catch(() => false)) {
                    await this.click(currentSpan);
                    await this.waitForLoaders().catch(() => { });
                }

                // 3. Select available appointment product type from dropdown for row index
                const appointmentTypeDropdown = this.page.locator(`#drp_OpenSlotBookAppointment_product_${index}`);
                await this.waitForVisible(appointmentTypeDropdown);

                await this.page.waitForFunction((idx) => {
                    const select = /** @type {HTMLSelectElement|null} */ (document.querySelector(`#drp_OpenSlotBookAppointment_product_${idx}`));
                    if (!select || !select.options) return false;
                    return Array.from(select.options).some(opt => {
                        const text = (opt.text || '').trim().toLowerCase();
                        const value = (opt.value || '').trim().toLowerCase();
                        return (
                            value !== '' &&
                            value !== '0' &&
                            !value.includes('please select') &&
                            !text.includes('please select') &&
                            text !== 'select'
                        );
                    });
                }, index, { timeout: 10000 });

                const validOptionValue = await appointmentTypeDropdown.evaluate((/** @type {HTMLSelectElement} */ select) => {
                    const validOptions = Array.from(select.options).filter(opt => {
                        const text = (opt.text || '').trim().toLowerCase();
                        const value = (opt.value || '').trim().toLowerCase();
                        return (
                            value !== '' &&
                            value !== '0' &&
                            !value.includes('please select') &&
                            !text.includes('please select') &&
                            text !== 'select'
                        );
                    });
                    return validOptions.length > 0 ? validOptions.at(-1).value : null;
                });

                if (!validOptionValue) {
                    console.log(`No valid appointment product type found for slot row ${index + 1}. Trying next slot...`);
                    if (await currentInput.isChecked().catch(() => false)) {
                        await this.click(currentSpan);
                        await this.waitForLoaders().catch(() => { });
                    }
                    continue;
                }

                console.log(`Selected appointment type option value for slot row ${index + 1}:`, validOptionValue);
                await this.selectOption(appointmentTypeDropdown, validOptionValue);

                // 4. Select appointment status for row index
                const statusTypeDropdown = this.page.locator(`#drp_OpenSlotBookAppointment_AppointmentStatus_${index}`);
                await this.waitForVisible(statusTypeDropdown);
                await this.selectOption(statusTypeDropdown, { label: 'Confirmed' });

                // 5. Setup toast observer before confirming scheduling
                const scheduleResultPromise = this.page.evaluate(() => {
                    return new Promise((resolve) => {
                        const checkToasts = () => {
                            const successToast = document.querySelector('#toast-container .toast-success, .toast-success');
                            const isSuccess = /scheduled successfully/i.test(document.body.innerText || '') ||
                                (successToast && /scheduled successfully/i.test(successToast.textContent || ''));
                            if (isSuccess) {
                                const msgEl = document.querySelector('#toast-container .toast-message, .toast-message');
                                return { success: true, message: (msgEl ? msgEl.textContent : '') || 'Appointment(s) scheduled successfully.' };
                            }

                            const errorToast = document.querySelector('#toast-container .toast-error, .toast-error');
                            if (errorToast) {
                                const msgEl = errorToast.querySelector('.toast-message') || errorToast;
                                return { success: false, message: (msgEl ? msgEl.textContent : '') || 'Scheduling error' };
                            }

                            return null;
                        };

                        const initial = checkToasts();
                        if (initial) return resolve(initial);

                        const observer = new MutationObserver(() => {
                            const res = checkToasts();
                            if (res) {
                                observer.disconnect();
                                resolve(res);
                            }
                        });

                        observer.observe(document.body, { childList: true, subtree: true, characterData: true });

                        setTimeout(() => {
                            observer.disconnect();
                            resolve({ success: false, message: 'timeout' });
                        }, 10000);
                    });
                }).catch(() => ({ success: false, message: 'evaluation error' }));

                // 6. Click Schedule button and confirm
                await this.click(this.scheduleIntoSlotButton);
                await this.waitForVisible(this.confirmYesButton);
                await this.click(this.confirmYesButton);

                // 7. Await scheduling outcome
                const result = await scheduleResultPromise;
                console.log(`Slot row ${index + 1} scheduling outcome:`, result);

                if (result.success) {
                    console.log(`Appointment(s) scheduled successfully on slot row ${index + 1}.`);
                    await test.step('Toast message "Appointment(s) scheduled successfully." appeared', async () => { });
                    return;
                }

                // 8. If error occurred (e.g. "student is not available"):
                console.log(`Slot row ${index + 1} failed with error: "${result.message}".`);

                const warningIcon = this.page.locator(`#iErrorOpenSlotGrid_${index}`);
                if (await warningIcon.count() > 0) {
                    const tooltipError = (await warningIcon.getAttribute('data-original-title').catch(() => '')) ||
                        (await warningIcon.getAttribute('title').catch(() => ''));
                    if (tooltipError) {
                        console.log(`Tooltip error detail: "${tooltipError}"`);
                    }
                }

                // Dismiss error toast to clear screen
                const errorToast = this.page.locator('#toast-container .toast-error').last();
                if (await errorToast.isVisible().catch(() => false)) {
                    await errorToast.click().catch(() => { });
                }

                // Deselect the failed slot checkbox immediately so next slot can be cleanly selected
                console.log(`Deselecting failed slot row ${index + 1}...`);
                if (await currentInput.isChecked().catch(() => true)) {
                    await this.click(currentSpan);
                    await this.waitForLoaders().catch(() => { });
                    await this.page.waitForTimeout(300);
                }

                // If this is the last available slot, fail test with error
                if (index === totalSlots - 1) {
                    throw new Error(`All ${totalSlots} slot(s) failed to schedule. Last error: "${result.message}"`);
                }

                console.log(`Proceeding to next available slot (row ${index + 2})...`);
            }
        });
    }

}

