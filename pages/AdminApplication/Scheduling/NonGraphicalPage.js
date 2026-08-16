import BasePage from "../../../utils/BasePage";
import { expect } from "@playwright/test";

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
        await this.studentSearchInput.waitFor({ state: 'visible' });
        await expect(this.studentSearchInput).toBeEnabled();
        await this.studentSearchInput.click();
        await expect(this.studentSearchInput).toBeFocused();
        await this.studentSearchInput.pressSequentially(studentName, { delay: 100 });
    }

    /**
     * Waits for and clicks the specified student dropdown option.
     * @param {string} optionText - Option text to select.
    **/
    async selectStudentOption(optionText) {
        await this.studentDropdownOption(optionText).waitFor({ state: 'visible' });
        await this.click(this.studentDropdownOption(optionText));
    }

    /**
     * Clicks the Select Student button to confirm the selected student.
    **/
    async clickSelectStudent() {
        await this.click(this.selectStudentButton);
    }

    /**
     * Selects the first available/highlighted date in the date picker calendar.
    **/
    async selectFirstAvailableDate() {
        const firstGreenDate = this.page.locator('td.ui-highlight:not(.ui-datepicker-current-day) a').first();
        await this.click(firstGreenDate);
    }

    /**
     * Checks the first available slot checkbox.
    **/
    async selectSlot() {
        await this.firstSlotCheckbox.waitFor({ state: 'visible' });
        await this.firstSlotCheckbox.click();
    }

    /**
     * Selects the last available appointment product type from the appointment type dropdown.
    **/
    async selectAppointmentType() {
        await this.appointmentTypeDropdown.waitFor({ state: 'visible' });

        await this.page.waitForFunction(() => {
            const select = document.querySelector('#drp_OpenSlotBookAppointment_product_0');
            return select && Array.from(select.options).filter(o => o.value !== '').length > 0;
        });

        const lastOptionValue = await this.appointmentTypeDropdown.evaluate(select =>
            Array.from(select.options).filter(o => o.value !== '').at(-1).value
        );

        console.log("Last appointment type option value:", lastOptionValue);
        await this.appointmentTypeDropdown.selectOption(lastOptionValue);
    }

    /**
     * Selects 'Confirmed' status from the appointment status type dropdown.
    **/
    async selectStatusType() {
        await this.statusTypeDropdown.waitFor({ state: 'visible' });
        await this.statusTypeDropdown.selectOption({ label: 'Confirmed' });
    }

    /**
     * Clicks the 'Schedule Student Into Slot(s)' button and confirms the action.
    **/
    async scheduleIntoSlot() {
        await this.click(this.scheduleIntoSlotButton);
        await this.click(this.confirmYesButton);
    }

    /**
     * Verifies that the toast success message 'Appointment(s) scheduled successfully.' is visible.
    **/
    async verifyToastMessageSuccessful() {
        const toast = this.page.locator('#toast-container .toast-success .toast-message');

        await expect(toast).toBeVisible();
        await expect(toast).toHaveText('Appointment(s) scheduled successfully.');
    }
}
