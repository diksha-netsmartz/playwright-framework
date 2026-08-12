import BasePage from "../../../utils/BasePage";
import {expect} from "@playwright/test";

export default class SingleInstructorPage extends BasePage {

    constructor(page) {
        super(page);

        this.submitButtonPopup = page.getByRole("button", {
            name: "Yes, Submit",
        });

        this.editAppointmentLink = page.getByRole('link', {name: 'Edit Appointment'});
        this.copyAppointmentLink = page.getByRole('link', {name: 'Copy Appointment'});

        // Buttons
        this.getScheduleBtn = page.getByRole("button", {
            name: "Get Schedule"
        });

        this.appointmentConfirmed = page.locator("xpath=//div[@data-statuss1='Confirmed' and @data-types='Appointment']");

        this.timeSlot = page.locator("xpath=((//div[@id='scheduler']//tr[@role='row'])[5]//td[@role='gridcell' and not(contains(@class,'k-nonwork-hour'))])[1]");

        this.timeSlot2 = page.locator("xpath=((//div[@id='scheduler']//tr[@role='row'])[5]//td[@role='gridcell' and not(contains(@class,'k-nonwork-hour'))])[2]");


        this.deleteButtonInPopup = page.locator("#btnDeleteAppointment");

        this.calendarPrevBtn = page.getByRole('group').filter({hasText: 'Single Instructor View:'}).getByLabel('Previous').first();
        this.listMenuOfANoShowAppointment = page.locator("xpath=(//div[@data-types='Appointment' and @data-statuss1='No Show']//span[@data-types='Appointment']//img)[1]");
        this.listMenuOfCancelledAppointment = page.locator("xpath=(//div[@data-types='Appointment' and @data-statuss1='Open']//span[@data-types='Appointment']//img)[1]");

        this.deleteCancelledAppointmentButton = page.locator("xpath=(//div[@data-types='Appointment' and @data-statuss1='Open']//a[@href='cancelAppt'])[1]");


    }

    listMenuOfCreatedAppointment(notesValue) {
        return this.page.locator(`xpath=(//p[contains(text(),'${notesValue}')]//ancestor::div[@data-types='Appointment']//span[@data-types='Appointment']//img)[last()]`);
    }

    listMenuInAppointment(notesValue) {
        return this.page.locator(`xpath=(//p[contains(text(),'${notesValue}')]//ancestor::div[@data-types='Appointment']//span[@data-types='Appointment']//img)`);
    }

    deleteAppointmentButton(notesValue) {
        return this.page.locator(`xpath=(//p[contains(text(),'${notesValue}')]//ancestor::div[@data-types='Appointment']//a[@href='cancelAppt'])[last()]`);
    }


    getDropdownButton(dropdownName) {
        return this.page.locator(
            `xpath=(//button[contains(@data-id,'${dropdownName}')]//parent::div//span[contains(@class,'filter-option pull-left')])[1]`
        );
    }

    createAppointmentOnRightClick(appointmentType) {
        return this.page.getByRole("link", {
            name: appointmentType
        });
    }

    getLastDropdownOption(dropdownName) {
        return this.page.locator(
            `xpath=(//button[contains(@data-id,'${dropdownName}')]//parent::div//li)[last()]`
        );
    }

    async selectInstructor() {
        await this.verifyTitle("Single Instructor Scheduler");
        await this.click(this.getDropdownButton("SingleInst"));
        await this.click(this.getLastDropdownOption("SingleInst"));

    }

    async getSchedule() {
        await this.click(this.getScheduleBtn);
        // await this.page.waitForLoadState("networkidle")

    }


    async selectDateInCalendar() {
        const today = new Date();
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() - 7);

        // If Sunday (0), go one more day back to Saturday
        if (targetDate.getDay() === 0) {
            targetDate.setDate(targetDate.getDate() - 1);
        }

        const year = targetDate.getFullYear();
        const month = targetDate.getMonth(); // Kendo uses 0-indexed months in data-value (e.g. July = 6)
        const day = targetDate.getDate();
        const dataValue = `${year}/${month}/${day}`;

        // Navigate to previous month in calendar if target date is in a prior month
        const todayYear = today.getFullYear();
        const todayMonth = today.getMonth();
        const monthDiff = (todayYear - year) * 12 + (todayMonth - month);

        for (let i = 0; i < monthDiff; i++) {
            await this.calendarPrevBtn.click();
            await this.page.waitForTimeout(300);
        }

        await this.page.locator(`xpath=//a[@data-value="${dataValue}"]`).first().click();
    }

    async selectCreateAppointment(appointmentType) {
        await this.selectDateInCalendar();
        await this.page.waitForLoadState("domcontentloaded");
        await this.timeSlot.click({
            button: "right"
        });
        await this.page.waitForLoadState("domcontentloaded");
        await this.click(this.createAppointmentOnRightClick(appointmentType));
    }

    async editAppointment(notesValue) {
        await this.listMenuOfCreatedAppointment(notesValue).isVisible();
        await this.listMenuOfCreatedAppointment(notesValue).click();

        try {
            await this.editAppointmentLink.waitFor({
                state: "visible",
                timeout: 3000,
            });
        } catch {
            console.log("edit appointment link was not visible. Re-clicking the list menu...");

            await this.listMenuOfCreatedAppointment(notesValue).click();
            await this.editAppointmentLink.waitFor({state: "visible", timeout: 3000});
        }
        await this.editAppointmentLink.click();
    }

    async deleteAppointment(notesValue) {
        await this.listMenuOfCreatedAppointment(notesValue).hover();
        await this.deleteAppointmentButton(notesValue).isVisible();
        await this.deleteAppointmentButton(notesValue).click();
        await this.deleteButtonInPopup.click();
        await this.deleteButtonInPopup.isHidden();
        await this.page.waitForLoadState("networkidle");
    }

    async copyAppointment(notesValue) {
        await this.appointmentConfirmed.isVisible();
        await this.listMenuOfCreatedAppointment(notesValue).isVisible();
        try {
            await this.copyAppointmentLink.waitFor({
                state: "visible",
                timeout: 3000,
            });
        } catch {
            console.log("Copy appointment link was not visible. Re-clicking the list menu...");

            await this.listMenuOfCreatedAppointment(notesValue).click();
            await this.copyAppointmentLink.waitFor({state: "visible", timeout: 3000});
        }
        await this.copyAppointmentLink.click();
        await this.timeSlot2.click({
            button: "right"
        });
        await this.page.waitForLoadState("domcontentloaded")
        await this.click(this.createAppointmentOnRightClick("Paste Last Copied Appointment"));
        try {

            await this.submitButtonPopup.waitFor({
                state: "visible",
                timeout: 10000,
            });

            await this.submitButtonPopup.click();

        } catch {

            console.log("Submit confirmation popup did not appear.");

        }
    }

    async verifyAppointmentIsCopied(notesValue) {
        await expect(await this.listMenuInAppointment(notesValue)).toHaveCount(2);
        await this.page.waitForLoadState("networkidle");
    }

    async deleteCancelledAppointment() {
        await this.listMenuOfCancelledAppointment.isVisible();
        await this.listMenuOfCancelledAppointment.hover();
        await this.deleteCancelledAppointmentButton.isVisible();
        await this.deleteCancelledAppointmentButton.click();
        await this.deleteButtonInPopup.click();
        await this.deleteButtonInPopup.isHidden();
    }

    async editCancelledAppointment() {
        await this.listMenuOfCancelledAppointment.isVisible();
        await this.listMenuOfCancelledAppointment.click();

        try {
            await this.editAppointmentLink.waitFor({
                state: "visible",
                timeout: 3000,
            });
        } catch {
            console.log("edit appointment link was not visible. Re-clicking the list menu...");

            await this.listMenuOfCancelledAppointment.click();
            await this.editAppointmentLink.waitFor({state: "visible", timeout: 3000});
        }
        await this.editAppointmentLink.click();
    }


}