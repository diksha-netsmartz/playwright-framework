import BasePage from "../../../utils/BasePage";
import { expect } from "@playwright/test";

export default class SingleInstructorPage extends BasePage {

    constructor(page) {
        super(page);

        // Dropdown
        this.instructorDropdown = page.getByRole("button", {
            name: "-- Select --"
        });
        this.searchInstructor = page.getByRole("textbox");
        this.instructorValueFromDropdown = page.locator(
            "//ul[@class='dropdown-menu inner selectpicker']//li[@class='active']"
        );


        // Buttons
        this.getScheduleBtn = page.getByRole("button", {
            name: "Get Schedule"
        });

        // Schedule Grid
        this.timeSlot = page.locator("tr:nth-child(8) > td:nth-child(1)");
        this.deleteAppointmentButton=page.locator("xpath=//a[@href='cancelAppt']");
        this.deleteButtonInPopup=page.locator("#btnDeleteAppointment");

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
        return  this.page.getByRole("link", {
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
        await this.click(this. getDropdownButton("SingleInst"));
        await this.click(this.getLastDropdownOption("SingleInst"));

    }

    async getSchedule() {
        await this.click(this.getScheduleBtn);
    }


    async selectCreateAppointment(appointmentType) {
        await this.timeSlot.click({
            button: "right"
        });
        await this.page.waitForLoadState("domcontentloaded")
        await this.click(this.createAppointmentOnRightClick(appointmentType));
    }

}