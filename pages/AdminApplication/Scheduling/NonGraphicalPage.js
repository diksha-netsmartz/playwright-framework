import BasePage from "../../../utils/BasePage";
import {expect} from "@playwright/test";

export default class NonGraphicalPage extends BasePage {

    constructor(page) {
        super(page);

        // Student search
        this.studentSearchInput = page.getByRole('textbox', {name: 'Enter Student Name'});
        this.selectStudentButton = page.getByRole('button', {name: 'Select Student'});

        // Slot selection
        this.firstSlotCheckbox = page.locator("xpath=(//input[contains(@id,'BookSlot')]//following-sibling::span)[1]");
        this.appointmentTypeDropdown = page.locator('#drp_OpenSlotBookAppointment_product_0');
        this.statusTypeDropdown = page.locator('#drp_OpenSlotBookAppointment_AppointmentStatus_0');

        // Schedule action
        this.scheduleIntoSlotButton = page.getByText('Schedule Student Into Slot(s)');
        this.confirmYesButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
    }

    studentDropdownOption(optionText) {
        return this.page.getByRole('option', {name: optionText});
    }

    async searchStudent(studentName) {
        await this.studentSearchInput.waitFor({state: 'visible'});
        await expect(this.studentSearchInput).toBeEnabled();
        await this.studentSearchInput.click();
        await expect(this.studentSearchInput).toBeFocused();
        await this.studentSearchInput.pressSequentially(studentName, {delay: 100});
    }

    async selectStudentOption(optionText) {
        await this.studentDropdownOption(optionText).waitFor({state: 'visible'});
        await this.click(this.studentDropdownOption(optionText));
    }

    async clickSelectStudent() {
        await this.click(this.selectStudentButton);
    }

    async selectFirstAvailableDate() {
        const firstGreenDate = this.page.locator('td.ui-highlight:not(.ui-datepicker-current-day) a').first();
        await this.click(firstGreenDate);
    }

    async selectSlot() {
        await this.firstSlotCheckbox.waitFor({state: 'visible'});
        await this.firstSlotCheckbox.click();
    }

    async selectAppointmentType() {
        await this.appointmentTypeDropdown.waitFor({state: 'visible'});

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

    async selectStatusType() {
        await this.statusTypeDropdown.waitFor({state: 'visible'});
        await this.statusTypeDropdown.selectOption({label: 'Confirmed'});
    }

    // Step 11: Click schedule button and confirm
    async scheduleIntoSlot() {
        await this.click(this.scheduleIntoSlotButton);
        await this.click(this.confirmYesButton);
    }

    async verifyToastMessageSuccessful() {
        const toast = this.page.locator('#toast-container .toast-success .toast-message');

        await expect(toast).toBeVisible();
        await expect(toast).toHaveText('Appointment(s) scheduled successfully.');
    }
}
