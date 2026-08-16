import { expect } from "@playwright/test";
import BasePage from "../../../../utils/BasePage";

/**
 * Page Object representing the Single Instructor Appointment Creation Modal in Admin Portal.
 * Handles selecting students, choosing in-car services, selecting dropdowns, and submitting single instructor appointments.
  **/
export default class AppointmentPage extends BasePage {

    /**
     * Initializes locators for the Single Instructor Appointment Modal.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
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

    /**
     * Returns locator for a dropdown button element by name.
     * @param {string} dropdownName - Dropdown data-id identifier.
     * @returns {import('@playwright/test').Locator} Dropdown button locator.
      **/
    getDropdownButton(dropdownName) {
        return this.page.locator(
            `xpath=(//button[contains(@data-id,'${dropdownName}')]//parent::div//span[contains(@class,'filter-option pull-left')])[1]`
        );
    }

    /**
     * Returns locator for the first option item in the specified dropdown.
     * @param {string} dropdownName - Dropdown data-id identifier.
     * @returns {import('@playwright/test').Locator} First dropdown list item locator.
      **/
    getFirstDropdownOption(dropdownName) {
        return this.page.locator(
            `xpath=(//button[contains(@data-id,'${dropdownName}')]//parent::div//li[@data-original-index='1'])[1]`
        );
    }

    /**
     * Returns locator for an in-car service option containing the specified service text.
     * @param {string} service - Service name substring.
     * @returns {import('@playwright/test').Locator} Service option link locator.
      **/
    getServiceOption(service) {
        return this.page.locator(
            `xpath=//li//a[contains(text(), '${service}')]`
        );
    }

    /**
     * Verifies that the appointment modal popup title is visible.
    **/
    async verifyPopup() {
        await expect(this.popupTitle).toBeVisible();
    }

    /**
     * Selects the first available option in the specified dropdown.
     * @param {string} dropdownName - Dropdown data-id identifier.
    **/
    async selectDropdown(dropdownName) {
        await this.click(this.getDropdownButton(dropdownName));
        await this.click(this.getFirstDropdownOption(dropdownName));
    }

    /**
     * Fills student name in the search input and selects the student from the autocomplete option.
     * @param {string} student - Student name string.
    **/
    async selectStudent(student) {
        await this.fill(this.studentTextbox, student);

        await this.click(
            this.page.getByRole("option", {
                name: `${student}, ${student}`
            })
        );
    }

    /**
     * Selects the specified in-car service from the service dropdown.
     * @param {string} service - Service name to select.
    **/
    async selectService(service) {
        await this.click(this.serviceDropdown);
        await this.click(this.getServiceOption(service));
    }

    /**
     * Submits the single instructor appointment form and confirms the action.
    **/
    async submitAppointment() {
        await this.click(this.submitButton);
        await this.click(this.confirmationYesButton);
    }
}