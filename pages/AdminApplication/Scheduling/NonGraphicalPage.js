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
                await this.page.waitForTimeout(5000);

                const hasNoRecords = await this.isVisible(this.noRecordsFound);
                const hasSlot = await this.isVisible(this.firstSlotCheckbox);

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
     * Checks the first available slot checkbox.
    **/
    async selectSlot() {
        await test.step('Select first available time slot', async () => {
            await this.waitForVisible(this.firstSlotCheckbox);
            await this.click(this.firstSlotCheckbox);
        });
    }

    /**
     * Selects an available appointment product type from the appointment type dropdown (excluding 'Please select').
    **/
    async selectAppointmentType() {
        await test.step('Select available appointment type from dropdown', async () => {
            await this.waitForVisible(this.appointmentTypeDropdown);

            await this.page.waitForFunction(() => {
                const select = /** @type {HTMLSelectElement|null} */ (document.querySelector('#drp_OpenSlotBookAppointment_product_0'));
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
            }, { timeout: 10000 });

            const validOptionValue = await this.appointmentTypeDropdown.evaluate((/** @type {HTMLSelectElement} */ select) => {
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
                throw new Error("No valid appointment product type found in dropdown (only 'Please select' present).");
            }

            console.log("Selected appointment type option value:", validOptionValue);
            await this.selectOption(this.appointmentTypeDropdown, validOptionValue);
        });
    }

    /**
     * Selects 'Confirmed' status from the appointment status type dropdown.
    **/
    async selectStatusType() {
        await test.step('Select appointment status: "Confirmed"', async () => {
            await this.waitForVisible(this.statusTypeDropdown);
            await this.selectOption(this.statusTypeDropdown, { label: 'Confirmed' });
        });
    }

    /**
     * Clicks the 'Schedule Student Into Slot(s)' button and confirms the action.
    **/
    async scheduleIntoSlot() {
        await test.step('Schedule student into slot and confirm', async () => {
            await this.click(this.scheduleIntoSlotButton);
            await this.click(this.confirmYesButton);
        });
    }

    /**
     * Verifies that the toast success message 'Appointment(s) scheduled successfully.' is visible.
     * If an error toast appears, extracts the error message and slot warning tooltip (data-original-title) and fails the test immediately.
    **/
    async verifyToastMessageSuccessful() {
        await test.step('Verify "Appointment(s) scheduled successfully." message', async () => {
            const toastLocator = this.page.locator('#toast-container .toast-message').last();
            await this.waitForVisible(toastLocator);

            const errorToast = this.page.locator('#toast-container .toast-error').last();
            if (await this.isVisible(errorToast)) {
                const errorMessage = (await errorToast.locator('.toast-message').textContent())?.trim() || (await errorToast.textContent())?.trim();

                const warningIcon = this.page.locator("xpath=(//i[@data-toggle='tooltip' and contains(@id,'ErrorOpenSlot')])[1]");
                let tooltipError = '';
                if (await warningIcon.count() > 0) {
                    tooltipError = await warningIcon.getAttribute('data-original-title');
                }

                const detailedError = tooltipError ? `${errorMessage} (Reason: ${tooltipError})` : errorMessage;
                console.log(`Scheduling failed with error toast: "${errorMessage}"`);
                if (tooltipError) {
                    console.log(`Error detail from data-original-title: "${tooltipError}"`);
                }
                throw new Error(`Scheduling failed with error: "${detailedError}"`);
            } else {
                const successToast = this.page.locator('#toast-container .toast-success .toast-message').last();
                await this.verifyVisible(successToast);
                await this.verifyText(successToast, 'Appointment(s) scheduled successfully.');
                console.log('Appointment(s) scheduled successfully.');
            }
        });
    }
}

