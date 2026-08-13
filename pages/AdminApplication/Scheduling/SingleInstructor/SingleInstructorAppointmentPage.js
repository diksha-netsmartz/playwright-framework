import {expect} from "@playwright/test";
import BasePage from "../../../../utils/BasePage";

export default class AppointmentPage extends BasePage {

    constructor(page) {
        super(page);

        this.popupTitle = page.locator("#window1_wnd_title");

        this.studentTextbox = page.getByRole("textbox", {
            name: "Student1: Enter at least two"
        });

        this.serviceDropdown = page.getByRole("button", {
            name: "Select In-Car Service"
        });

        this.submitButton = page.getByRole("button", {
            name: "Submit"
        });

        this.confirmationYesButton = page.locator(
            "xpath=//a[@data-apply='confirmation']"
        );
    }

    getDropdownButton(dropdownName) {
        return this.page.locator(
            `xpath=(//button[contains(@data-id,'${dropdownName}')]//parent::div//span[contains(@class,'filter-option pull-left')])[1]`
        );
    }

    getFirstDropdownOption(dropdownName) {
        return this.page.locator(
            `xpath=(//button[contains(@data-id,'${dropdownName}')]//parent::div//li[@data-original-index='1'])[1]`
        );
    }

    getServiceOption(service) {
        return this.page.locator(
            `xpath=//li//a[contains(text(), '${service}')]`
        );
    }

    async verifyPopup() {
        await expect(this.popupTitle).toBeVisible();
    }

    async selectDropdown(dropdownName) {
        await this.click(this.getDropdownButton(dropdownName));
        await this.click(this.getFirstDropdownOption(dropdownName));
    }

    async selectStudent(student) {
        await this.fill(this.studentTextbox, student);

        await this.click(
            this.page.getByRole("option", {
                name: `${student}, ${student}`
            })
        );
    }

    async selectService(service) {
        await this.click(this.serviceDropdown);
        await this.click(this.getServiceOption(service));
    }

    async submitAppointment() {
        await this.click(this.submitButton);
        await this.click(this.confirmationYesButton);
    }
}