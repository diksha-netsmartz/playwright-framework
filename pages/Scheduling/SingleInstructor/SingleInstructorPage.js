import BasePage from "../../../utils/BasePage";
import {expect} from "@playwright/test";

export default class SingleInstructorPage extends BasePage {

    constructor(page) {
        super(page);


        this.instructorValueFromDropdown = page.locator(
            "//ul[@class='dropdown-menu inner selectpicker']//li[@class='active']"
        );
        this.submitButtonPopup = page.getByRole("button", {
            name: "Yes, Submit",
        });
        this.listMenuOfCreatedAppointment = page.locator("xpath=//span[@data-types='Appointment']//img");
        this.editAppointmentLink = page.getByRole('link', {name: 'Edit Appointment'});
        this.copyAppointmentLink = page.getByRole('link', {name: 'Copy Appointment'});

        // Buttons
        this.getScheduleBtn = page.getByRole("button", {
            name: "Get Schedule"
        });

        this.appointmentConfirmed = page.locator("xpath=//div[@data-statuss1='Confirmed' and @data-types='Appointment']");

        // Schedule Grid
        this.timeSlot = page.locator("tr:nth-child(10) > td:nth-child(1)");
        this.timeSlot2 = page.locator("tr:nth-child(11) > td:nth-child(2)");

        this.deleteAppointmentButton = page.locator("xpath=//a[@href='cancelAppt']");
        this.deleteButtonInPopup = page.locator("#btnDeleteAppointment");

        // Context Menu
        // this.createAppointmentOption = page.getByRole("link", {
        //     name: "Create Single Appointment (Driver Only)"
        // });
        
        // Page Header
        this.pageTitle = page.getByText(
            "Single Instructor View: August"
        );


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
        await this.page.waitForLoadState("networkidle")

    }


    async selectCreateAppointment(appointmentType) {
        await this.timeSlot.click({
            button: "right"
        });
        await this.page.waitForLoadState("domcontentloaded")
        await this.click(this.createAppointmentOnRightClick(appointmentType));
    }

    async editAppointment() {
        expect(this.appointmentConfirmed.isVisible()).toBeTruthy();
        await this.listMenuOfCreatedAppointment.click();
        await this.editAppointmentLink.click();
    }

    async deleteAppointment() {
        await this.listMenuOfCreatedAppointment.hover();
        expect(this.deleteAppointmentButton.isVisible()).toBeTruthy();
        await this.deleteAppointmentButton.click();
        await this.deleteButtonInPopup.click();
        await this.deleteButtonInPopup.isHidden();
        await this.page.waitForLoadState("networkidle");
    }

    async copyAppointment() {
        expect(this.appointmentConfirmed.isVisible()).toBeTruthy();
        await this.listMenuOfCreatedAppointment.click();
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


}