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
        this.slotSpans = page.locator("//input[contains(@id,'BookSlot')]//following-sibling::span");
        this.slotInputs = page.locator("//input[contains(@id,'BookSlot')]");
        this.noRecordsFound = page.locator("xpath=//td[text()='No records found.']");
        this.appointmentTypeDropdown = page.locator('#drp_OpenSlotBookAppointment_product_0');
        this.statusTypeDropdown = page.locator('#drp_OpenSlotBookAppointment_AppointmentStatus_0');
        this.highlightedDates = page.locator('td.ui-highlight a');
        this.currentDateIndex = null;

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
     * Clears any active toast notifications from previous attempts.
     **/
    async clearToasts() {
        await this.page.evaluate(() => {
            const toasts = document.querySelectorAll('#toast-container .toast, .toast');
            toasts.forEach(t => t.remove());
        }).catch(() => { });
    }

    /**
     * Iterates through available/highlighted dates in the date picker calendar until a date with open time slots is found.
     * If 'No records found.' is displayed, it clicks the next available highlighted date.
     * @param {number} [startIndex=0] - The index of the highlighted date to start checking from.
     * @returns {Promise<{found: boolean, dateIndex: number, totalDates: number}>} Object containing status and selected date index.
    **/
    async selectFirstAvailableDate(startIndex = 0) {
        return await test.step(`Find and select calendar date with available slots (starting from date #${startIndex + 1})`, async () => {
            const count = await this.highlightedDates.count();

            if (count === 0) {
                throw new Error('No highlighted dates found in the calendar.');
            }

            for (let i = startIndex; i < count; i++) {
                const dateToClick = this.highlightedDates.nth(i);
                await this.click(dateToClick);
                await this.waitForLoaders();
                await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });

                const hasSlot = await this.isVisible(this.firstSlotCheckbox, { timeout: 5000 }).catch(() => false);

                if (hasSlot) {
                    console.log(`Found available slots on highlighted date #${i + 1}`);
                    this.currentDateIndex = i;
                    return { found: true, dateIndex: i, totalDates: count };
                }

                console.log(`'No records found.' on date #${i + 1}. Trying next available date...`);
            }

            console.log(`No open slots found for any highlighted dates starting from index ${startIndex}.`);
            if (startIndex === 0) {
                throw new Error('No open slots found for any of the highlighted dates in the calendar.');
            }
            return { found: false, dateIndex: -1, totalDates: count };
        });
    }

    /**
     * Selects the slot checkbox for the specified row index if not already checked.
     * @param {number} [index=0] - 0-based index of the slot row.
     **/
    async selectSlot(index = 0) {
        await test.step(`Select slot row #${index + 1}`, async () => {
            const currentInput = this.slotInputs.nth(index);
            const currentSpan = this.slotSpans.nth(index);

            await this.waitForVisible(currentSpan);
            if (!await currentInput.isChecked().catch(() => false)) {
                await this.click(currentSpan);
                await this.waitForLoaders().catch(() => { });
            }
        });
    }

    /**
     * Deselects the slot checkbox for the specified row index if currently checked.
     * @param {number} [index=0] - 0-based index of the slot row.
     **/
    async deselectSlot(index = 0) {
        const currentInput = this.slotInputs.nth(index);
        const currentSpan = this.slotSpans.nth(index);

        if (await currentInput.isChecked().catch(() => true)) {
            await this.click(currentSpan);
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForTimeout(300);
        }
    }

    /**
     * Selects a valid appointment product type from dropdown for the specified slot row index.
     * @param {number} [index=0] - 0-based index of the slot row.
     * @returns {Promise<string|null>} The selected option value, or null if no valid option exists.
     **/
    async selectAppointmentType(index = 0) {
        return await test.step(`Select appointment product type for slot row #${index + 1}`, async () => {
            const appointmentTypeDropdown = this.page.locator(`#drp_OpenSlotBookAppointment_product_${index}`);
            await this.waitForVisible(appointmentTypeDropdown);

            const hasValidOptions = await this.page.waitForFunction((idx) => {
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
            }, index, { timeout: 10000 }).catch(() => false);

            if (!hasValidOptions) {
                console.log(`No valid appointment product type found for slot row ${index + 1}.`);
                return null;
            }

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
                console.log(`No valid appointment product type option value found for slot row ${index + 1}.`);
                return null;
            }

            console.log(`Selected appointment type option value for slot row ${index + 1}: ${validOptionValue}`);
            await this.selectOption(appointmentTypeDropdown, validOptionValue);
            return validOptionValue;
        });
    }

    /**
     * Selects the appointment status from dropdown for the specified slot row index.
     * @param {number} [index=0] - 0-based index of the slot row.
     * @param {string} [status='Confirmed'] - Status label to select.
     **/
    async selectStatusType(index = 0, status = 'Confirmed') {
        await test.step(`Select appointment status "${status}" for slot row #${index + 1}`, async () => {
            const statusTypeDropdown = this.page.locator(`#drp_OpenSlotBookAppointment_AppointmentStatus_${index}`);
            await this.waitForVisible(statusTypeDropdown);
            await this.selectOption(statusTypeDropdown, { label: status });
        });
    }

    /**
     * Clicks Schedule button, confirms with Yes modal button, and observes toast outcome.
     * @returns {Promise<{success: boolean, message: string}>} Result of the scheduling attempt.
     **/
    async confirmSchedule() {
        return await test.step('Confirm scheduling into slot and await outcome', async () => {
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

            await this.click(this.scheduleIntoSlotButton);
            await this.waitForVisible(this.confirmYesButton);
            await this.click(this.confirmYesButton);

            return await scheduleResultPromise;
        });
    }

    /**
     * Handles slot scheduling failure: logs error and tooltip info, dismisses toast, and deselects the slot.
     * @param {number} index - 0-based index of the slot row.
     * @param {string} errorMessage - Error message from toast notification.
     **/
    async handleSlotError(index, errorMessage) {
        console.log(`Slot row ${index + 1} failed with error: "${errorMessage}".`);

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
        await this.deselectSlot(index);
    }

    /**
     * Schedules the student into an available slot.
     * Iterates through available dates and slots on each date.
     * Selects slot, appointment type, status, and confirms scheduling.
     * If an error occurs (e.g. 'Student is not available'), deselects that slot and tries next slot.
     * If all slots on a date fail, automatically calls selectFirstAvailableDate() to iterate to the
     * next available date with slots until scheduling succeeds.
     **/
    async scheduleIntoSlot() {
        await test.step('Schedule student into slot with retry across slots and dates', async () => {
            const hasSlotsInitially = await this.isVisible(this.firstSlotCheckbox, { timeout: 3000 }).catch(() => false);

            if (!hasSlotsInitially) {
                const dateResult = await this.selectFirstAvailableDate(0);
                if (!dateResult || !dateResult.found) {
                    throw new Error('No open slots found for any of the highlighted dates in the calendar.');
                }
            }

            const totalDates = await this.highlightedDates.count();

            if (this.currentDateIndex === undefined || this.currentDateIndex === null) {
                const activeHighlight = this.page.locator('td.ui-highlight.ui-datepicker-current-day a');
                if (await activeHighlight.count() > 0) {
                    const activeText = (await activeHighlight.first().textContent() || '').trim();
                    for (let d = 0; d < totalDates; d++) {
                        const text = (await this.highlightedDates.nth(d).textContent() || '').trim();
                        if (text === activeText) {
                            this.currentDateIndex = d;
                            break;
                        }
                    }
                }
                if (this.currentDateIndex === undefined || this.currentDateIndex === null) {
                    this.currentDateIndex = 0;
                }
            }

            while (this.currentDateIndex < totalDates) {
                console.log(`=== Processing date #${this.currentDateIndex + 1} of ${totalDates} ===`);

                await this.waitForVisible(this.slotSpans.first(), 10000).catch(() => { });
                const totalSlots = await this.slotSpans.count();

                if (totalSlots === 0) {
                    console.log(`No slots available on date #${this.currentDateIndex + 1}. Trying next available date...`);
                    const nextDateResult = await this.selectFirstAvailableDate(this.currentDateIndex + 1);
                    if (!nextDateResult || !nextDateResult.found) {
                        break;
                    }
                    continue;
                }

                console.log(`Found ${totalSlots} available slot(s) on date #${this.currentDateIndex + 1} to attempt scheduling.`);

                for (let slotIndex = 0; slotIndex < totalSlots; slotIndex++) {
                    console.log(`--- Attempting slot row ${slotIndex + 1} of ${totalSlots} (Date #${this.currentDateIndex + 1}) ---`);

                    // 1. Clear old toast notifications
                    await this.clearToasts();

                    // 2. Select slot checkbox
                    await this.selectSlot(slotIndex);

                    // 3. Select available appointment product type
                    const selectedType = await this.selectAppointmentType(slotIndex);
                    if (!selectedType) {
                        console.log(`No valid appointment product type found for slot row ${slotIndex + 1}. Trying next slot...`);
                        await this.deselectSlot(slotIndex);
                        continue;
                    }

                    // 4. Select appointment status
                    await this.selectStatusType(slotIndex, 'Confirmed');

                    // 5. Confirm scheduling and observe outcome
                    const result = await this.confirmSchedule();
                    console.log(`Slot row ${slotIndex + 1} scheduling outcome:`, result);

                    if (result.success) {
                        console.log(`Appointment(s) scheduled successfully on date #${this.currentDateIndex + 1}, slot row ${slotIndex + 1}.`);
                        await test.step('Toast message "Appointment(s) scheduled successfully." appeared', async () => { });
                        return;
                    }

                    // 6. Handle failure and deselect slot
                    await this.handleSlotError(slotIndex, result.message);
                }

                // If all slots on this date failed, move to next available date with slots
                console.log(`All ${totalSlots} slot(s) on date #${this.currentDateIndex + 1} failed. Trying next available date...`);
                const nextDateResult = await this.selectFirstAvailableDate(this.currentDateIndex + 1);
                if (!nextDateResult || !nextDateResult.found) {
                    console.log('No more dates with available slots remaining in the calendar.');
                    break;
                }
            }

            throw new Error('Unable to schedule appointment on any available date. All slots failed.');
        });
    }

}

