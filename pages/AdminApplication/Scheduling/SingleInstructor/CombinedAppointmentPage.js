import { expect } from "@playwright/test";
import BasePage from "../../../../utils/BasePage";
import studentData from "../../../../test-data/studentData.json";

/**
 * Page Object representing the Combined Appointment Creation and Management Page in Single Instructor Scheduler.
 * Handles creating combined appointments for Driver and Observer students, filling student & service details,
 * verifying appointment values, cancelling, and marking appointments as No Show.
 **/
export default class CombinedAppointmentPage extends BasePage {
    static storedState = {
        uniqueId: null,
        expectedValues: {}
    };

    /**
     * Initializes locators and state for the Combined Appointment Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        this.uniqueId = Date.now();
        CombinedAppointmentPage.storedState.uniqueId = this.uniqueId;

        this.expectedValues = {};

        // Popup
        this.popupTitle = page.locator("#window1_wnd_title");
        this.closePopup = page.locator("xpath=//a[@aria-label='Close']").nth(0);

        // Buttons
        this.submitButton = page.getByRole("button", {
            name: "Submit",
        });

        this.confirmYesButton = page.locator(
            "xpath=//a[@data-apply='confirmation']"
        );

        this.submitButtonPopup = page.getByRole("button", {
            name: "Yes, Submit",
        });

        // Duration
        this.duration15Minutes = page.getByLabel("15 Minutes");

        // Student 1
        this.student1Textbox = page.getByRole("textbox", {
            name: "Student1: Enter at least two characters.",
        });

        this.student1Pickup = page.locator(
            "#FirstTypeAppointment_p_str_PickupLocation"
        );

        this.student1Notes = page.getByRole("textbox", {
            name: "Notes Student 1",
        });

        // Student 2
        this.student2Textbox = page.getByRole("textbox", {
            name: "Student2: Enter at least two characters.",
        });

        this.student2Pickup = page.locator(
            "#FirstTypeAppointment_p_str_PickupLocationStudent2"
        );

        this.student2Notes = page.getByRole("textbox", {
            name: "Notes Student 2",
        });

        // Misc
        this.deleteConfirmationButton = page.locator("#btnDeleteConfirmation");
        this.cancelAppointmentPopupButton = page.getByRole("button", {
            name: "YES, CANCEL LESSON",
        });

        this.cancelAppointmentTextbox = page.locator(
            "#txtArea_CancelLesson"
        ).nth(0);

        this.noShowAppointmentTextbox = page.locator(
            "#txtnoShowNotes"
        ).nth(0);

        this.noShowAppointmentPopupButton = page.getByRole("button", {
            name: "Yes, No Show Lesson",
        });

        this.noShowYesButton = page.locator("#btnDeleteMakeFullAppointment");
    }

    /**
     * Returns locator for a dropdown button element by matching data-id attribute substring.
     * @param {string} dataId - Substring contained in data-id attribute.
     * @returns {import('@playwright/test').Locator} Dropdown button locator.
     **/
    getDropdownTitle(dataId) {
        return this.page.locator(`button[data-id*="${dataId}"]`).first();
    }

    /**
     * Returns locator for a dropdown trigger button container by name.
     * @param {string} dropdownName - Dropdown data-id identifier.
     * @returns {import('@playwright/test').Locator} Dropdown trigger button locator.
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
     * Returns locator for the End Time option corresponding to the given Start Time.
     * @param {string} startTime - The selected start time string.
     * @returns {import('@playwright/test').Locator} End time option locator.
     **/
    getEndTimeDropdownValue(startTime) {
        return this.page.locator(
            `xpath=(//button[contains(@data-id,'EndTime')]//parent::div//span[text()='${startTime}']//ancestor::li[1]//following-sibling::li[2])[1]`
        );
    }

    /**
     * Returns locator for the Mid Time option corresponding to the given Start Time.
     * @param {string} startTime - The selected start time string.
     * @returns {import('@playwright/test').Locator} Mid time option locator.
     **/
    getMidTimeDropdownValue(startTime) {
        return this.page.locator(
            `xpath=(//button[contains(@data-id,'MidTime')]//parent::div//span[text()='${startTime}']//ancestor::li[1]//following-sibling::li[1])[1]`
        );
    }

    /**
     * Returns locator for the Cancel Appointment button for a specific student name.
     * @param {string} studentName - Student name.
     * @returns {import('@playwright/test').Locator} Cancel appointment link locator.
     **/
    cancelAppointmentButton(studentName) {
        return this.page.locator(
            `xpath=(//a[text()='Cancel Appointment' and @data-sname1='${studentName}' or @data-sname2='${studentName}'])[1]`
        );
    }

    /**
     * Returns locator for the No Show button for a specific student name.
     * @param {string} studentName - Student name.
     * @returns {import('@playwright/test').Locator} No show link locator.
     **/
    noShowAppointmentButton(studentName) {
        return this.page.locator(
            `xpath=(//a[text()='No Show' and @data-sname1='${studentName}' or @data-sname2='${studentName}'])[1]`
        );
    }

    /**
     * Returns text input locator for Student 1 or Student 2.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @returns {import('@playwright/test').Locator} Student name input locator.
     **/
    getStudentTextbox(studentNo) {
        return studentNo === 1
            ? this.student1Textbox
            : this.student2Textbox;
    }

    /**
     * Returns pickup location input locator for Student 1 or Student 2.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @returns {import('@playwright/test').Locator} Pickup input locator.
     **/
    getPickup(studentNo) {
        return studentNo === 1
            ? this.student1Pickup
            : this.student2Pickup;
    }

    /**
     * Returns notes input locator for Student 1 or Student 2.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @returns {import('@playwright/test').Locator} Notes input locator.
     **/
    getNotes(studentNo) {
        return studentNo === 1 ? this.student1Notes : this.student2Notes;
    }

    /**
     * Returns service dropdown button locator for Student 1 or Student 2.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @returns {import('@playwright/test').Locator} Service dropdown button locator.
     **/
    clickServiceDropdown(studentNo) {
        return studentNo === 1 ? this.getDropdownButton("Product_Id") : this.getDropdownButton("Product_Id_Student2");
    }

    /**
     * Returns the first service dropdown option locator for Student 1 or Student 2.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @returns {import('@playwright/test').Locator} Service option locator.
     **/
    selectServiceDropdownValue(studentNo) {
        return studentNo === 1 ? this.getFirstDropdownOption("Product_Id") : this.getFirstDropdownOption("Product_Id_Student2");
    }

    /**
     * Returns instruction 1 dropdown button locator for Student 1 or Student 2.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @returns {import('@playwright/test').Locator} Instruction 1 dropdown button locator.
     **/
    clickInstruction1Dropdown(studentNo) {
        return studentNo === 1 ? this.getDropdownButton("Instructions") : this.getDropdownButton("InstructionsStudent2");
    }

    /**
     * Returns instruction 1 dropdown first option locator for Student 1 or Student 2.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @returns {import('@playwright/test').Locator} Instruction 1 option locator.
     **/
    getInstruction1DropdownValue(studentNo) {
        return studentNo === 1 ? this.getFirstDropdownOption("Instructions") : this.getFirstDropdownOption("InstructionsStudent2");
    }

    /**
     * Returns instruction 2 dropdown button locator for Student 1 or Student 2.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @returns {import('@playwright/test').Locator} Instruction 2 dropdown button locator.
     **/
    clickInstruction2Dropdown(studentNo) {
        return studentNo === 1 ? this.getDropdownButton("Instructions1") : this.getDropdownButton("Instructions1Student2");
    }

    /**
     * Returns instruction 2 dropdown first option locator for Student 1 or Student 2.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @returns {import('@playwright/test').Locator} Instruction 2 option locator.
     **/
    getInstruction2DropdownValue(studentNo) {
        return studentNo === 1 ? this.getFirstDropdownOption("Instructions1") : this.getFirstDropdownOption("Instructions1Student2");
    }

    /**
     * Helper to verify an element attribute value against an expected string and log the result.
     * @param {import('@playwright/test').Locator} locator - Element locator.
     * @param {string} attribute - Attribute name.
     * @param {string} expected - Expected attribute value.
     * @param {string} label - Log label for reporting.
     **/
    async verifyAttribute(locator, attribute, expected, label) {
        const actual = await locator.getAttribute(attribute);

        console.log(`${label}`);
        console.log(`Expected : ${expected}`);
        console.log(`Actual   : ${actual}`);
        console.log("------------------------------------------------");

        await expect(locator).toHaveAttribute(attribute, expected);
    }

    /**
     * Helper to verify an element attribute against an expected regex pattern.
     * @param {import('@playwright/test').Locator} locator - Element locator.
     * @param {string} attribute - Attribute name.
     * @param {string} expected - Expected string to match via regex.
     * @param {string} label - Log label for reporting.
     **/
    async verifyRegexAttribute(locator, attribute, expected, label) {
        const actual = await locator.getAttribute(attribute);

        console.log(`${label}`);
        console.log(`Expected : ${expected}`);
        console.log(`Actual   : ${actual}`);
        console.log("------------------------------------------------");

        await expect(locator).toHaveAttribute(
            attribute,
            new RegExp(
                expected.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
            )
        );
    }

    /**
     * Helper to verify that an element text contains the expected substring and log the result.
     * @param {import('@playwright/test').Locator} locator - Element locator.
     * @param {string} expected - Expected text substring.
     * @param {string} label - Log label for reporting.
     **/
    async verifyText(locator, expected, label) {
        const actual = await locator.textContent();

        console.log(`${label}`);
        console.log(`Expected : ${expected}`);
        console.log(`Actual   : ${actual}`);
        console.log("------------------------------------------------");

        await expect(locator).toContainText(expected);
    }

    /**
     * Verifies that the Combined Appointment popup dialog title is displayed.
     **/
    async verifyPopup() {
        await expect(this.popupTitle).toContainText(
            "Create Combined Appointment (Driver and Observer)"
        );
    }

    /**
     * Selects the first option in the specified dropdown.
     * @param {string} dropdownName - Dropdown data-id identifier.
     **/
    async selectDropdown(dropdownName) {
        await this.click(this.getDropdownButton(dropdownName));
        await this.click(this.getFirstDropdownOption(dropdownName));
    }

    /**
     * Selects the Mid Time slot based on the currently selected Start Time.
     **/
    async selectMidTimeDropdown() {
        const startTime = (await this.getDropdownButton("StartTime").innerText()).trim();
        console.log("start time : " + startTime);
        await this.click(this.getDropdownButton("MidTime"));
        await this.click(this.getMidTimeDropdownValue(startTime));
    }

    /**
     * Selects the End Time slot based on the currently selected Start Time.
     **/
    async selectEndTimeDropdown() {
        const startTime = (await this.getDropdownButton("StartTime").innerText()).trim();
        console.log("start time : " + startTime);
        await this.click(this.getDropdownButton("EndTime"));
        await this.click(this.getEndTimeDropdownValue(startTime));
    }

    /**
     * Checks the 15 Minutes duration radio button.
     **/
    async selectDuration() {
        await this.check(this.duration15Minutes);
    }

    /**
     * Fills student details (name, service, instructions, pickup, notes) for Student 1 or Student 2.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @param {Object} student - Student test data object.
     **/
    /**
     * Fills student details (name, service, instructions, pickup, notes) for Student 1 or Student 2.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @param {Object} student - Student test data object.
     **/
    async fillStudentDetails(studentNo, student) {
        await this.getStudentTextbox(studentNo).pressSequentially(student.name, { delay: 200 });
        await this.page.waitForTimeout(2000);
        await this.click(this.page.getByRole("option", { name: student.option }).first());
        await this.click(this.clickServiceDropdown(studentNo));
        await this.click(this.selectServiceDropdownValue(studentNo));
        await this.click(this.clickInstruction1Dropdown(studentNo));
        await this.click(this.getInstruction1DropdownValue(studentNo));
        await this.click(this.clickInstruction2Dropdown(studentNo));
        await this.click(this.getInstruction2DropdownValue(studentNo));
        await this.fill(this.getPickup(studentNo), student.pickup);
        await this.fill(this.getNotes(studentNo), `${student.notes}_${this.uniqueId}`);
    }

    /**
     * Captures and stores current appointment field values (staff, location, vehicle, services, instructions) for later assertion.
     **/
    async storeAppointmentValues() {
        this.expectedValues.staff = await this.getDropdownTitle("InstID")
            .getAttribute("title");

        this.expectedValues.location = await this.getDropdownTitle("Location_ID")
            .getAttribute("title");

        this.expectedValues.vehicle = await this.getDropdownTitle("VehicleID")
            .getAttribute("title");

        let product1 =
            await this.getDropdownTitle("Product_Id")
                .getAttribute("title");

        this.expectedValues.student1 = {
            product: product1
                ? product1.split("&")[0].trim()
                : "",
            instruction1: await this.getDropdownTitle("Instructions")
                .getAttribute("title"),

            instruction2: await this.getDropdownTitle("Instructions1")
                .getAttribute("title"),
        };

        let product2 =
            await this.getDropdownTitle("Product_Id_Student2")
                .getAttribute("title");

        this.expectedValues.student2 = {
            product: product2
                ? product2.split("&")[0].trim()
                : "",

            instruction1: await this.getDropdownTitle("InstructionsStudent2")
                .getAttribute("title"),

            instruction2: await this.getDropdownTitle("Instructions1Student2")
                .getAttribute("title"),
        };

        CombinedAppointmentPage.storedState.expectedValues = this.expectedValues;
        CombinedAppointmentPage.storedState.uniqueId = this.uniqueId;

        console.log("Expected Values");
        console.log(this.expectedValues);
    }

    /**
     * Submits the combined appointment form, confirms confirmation prompts, and verifies the success toast message.
     * If an error toast appears, prints the error message in the console and fails the test.
     **/
    async submitAppointment() {
        await this.click(this.submitButton);
        await this.click(this.confirmYesButton);
        await this.page.waitForTimeout(2500);

        if (await this.isVisible(this.submitButtonPopup)) {
            await this.click(this.submitButtonPopup);
            await this.waitForLoaders();
        }
        await this.page.waitForTimeout(1000);
        const toastLocator = this.page.locator('#toast-container .toast-message').last();
        await this.waitForVisible(toastLocator);

        const errorToast = this.page.locator('#toast-container .toast-error').last();
        if (await this.isVisible(errorToast)) {
            const errorMessage = (await errorToast.locator('.toast-message').textContent())?.trim() || (await errorToast.textContent())?.trim();
            console.log(`Appointment creation failed with error: "${errorMessage}"`);
            throw new Error(`Appointment creation failed with error: "${errorMessage}"`);
        } else {
            const successToast = this.page.locator('#toast-container .toast-success .toast-message').last();
            await this.verifyVisible(successToast);
            await this.verifyText(successToast, 'Appointment created successfully.');
            console.log(`Appointment created with message: Appointment created successfully.`);
            await this.waitForHidden(successToast);
            await this.waitForLoaders();
        }

    }

    /**
     * Verifies that fields for a created student in the appointment match the expected stored values.
     * @param {number} studentNo - Student slot index (1 or 2).
     * @param {Object} student - Student test data object.
     **/
    async verifyStudent(studentNo, student) {

        const suffix = studentNo === 1 ? "" : "_Student2";

        const instruction1Id =
            studentNo === 1
                ? "Instructions"
                : "InstructionsStudent2";

        const instruction2Id =
            studentNo === 1
                ? "Instructions1"
                : "Instructions1Student2";

        const expectedState = (this.expectedValues && this.expectedValues.staff)
            ? this.expectedValues
            : CombinedAppointmentPage.storedState.expectedValues;

        const currentUniqueId = this.uniqueId || CombinedAppointmentPage.storedState.uniqueId;

        const expected =
            studentNo === 1
                ? expectedState.student1
                : expectedState.student2;

        const expectedStudentName = (student.firstName && student.lastName)
            ? `${student.lastName}, ${student.firstName}`
            : student.name.replace(" ", ", ");

        await this.verifyText(
            this.page.locator(
                `#FirstTypeAppointment_Student${studentNo}Name`
            ),
            expectedStudentName,
            `Student ${studentNo} Name`
        );

        await this.verifyRegexAttribute(
            this.getDropdownTitle(`Product_Id${suffix}`), "title", expected.product, `Student ${studentNo} Product`);

        await this.verifyAttribute(this.getDropdownTitle(instruction1Id), "title", expected.instruction1, `Student ${studentNo} Instruction 1`);
        await this.verifyAttribute(this.getDropdownTitle(instruction2Id), "title", expected.instruction2, `Student ${studentNo} Instruction 2`);
        await this.verifyAttribute(this.getPickup(studentNo), "oldval", student.pickup, `Student ${studentNo} Pickup`);
        await this.verifyAttribute(this.getNotes(studentNo), "oldval", `${student.notes}_${currentUniqueId}`, `Student ${studentNo} Notes`);

    }

    /**
     * Verifies all stored appointment values (staff, location, vehicle, students 1 & 2, duration) in the appointment popup.
     * @param {Object} [student1=studentData.student1] - Student 1 data object.
     * @param {Object} [student2=studentData.student2] - Student 2 data object.
     **/
    async verifyCombinedAppointmentCreatedValues(student1 = studentData.student1, student2 = studentData.student2) {

        const expectedState = (this.expectedValues && this.expectedValues.staff)
            ? this.expectedValues
            : CombinedAppointmentPage.storedState.expectedValues;

        await this.verifyAttribute(this.getDropdownTitle("InstID"), "title", expectedState.staff, "Staff");
        await this.verifyAttribute(this.getDropdownTitle("Location_ID"), "title", expectedState.location, "Location");
        await this.verifyAttribute(this.getDropdownTitle("VehicleID"), "title", expectedState.vehicle, "Vehicle");
        await this.verifyStudent(1, student1);
        await this.verifyStudent(2, student2);
        await this.verifyChecked(this.duration15Minutes);
        await this.click(this.closePopup);
    }

    /**
     * Cancels the appointment for the specified student (object or name string) and confirms the cancellation modal.
     * @param {Object|string} studentOrName - Student object or student's name string.
     **/
    async cancelAppointment(studentOrName) {
        const studentName = typeof studentOrName === 'object'
            ? ((studentOrName.firstName && studentOrName.lastName) ? `${studentOrName.lastName}, ${studentOrName.firstName}` : studentOrName.name.replace(" ", ", "))
            : studentOrName;

        await this.isVisible(this.cancelAppointmentButton(studentName));
        await this.click(this.cancelAppointmentButton(studentName));
        this.cancelledNotes = `Cancelling appointment for ${studentName} at ${this.uniqueId}`;
        await this.fill(this.cancelAppointmentTextbox, this.cancelledNotes);
        await this.click(this.cancelAppointmentPopupButton);
        await this.click(this.deleteConfirmationButton)
        await this.waitForLoaders();
        await this.waitForHidden(this.cancelAppointmentTextbox);

    }

    /**
     * Marks the appointment as No Show for the specified student (object or name string) and confirms the dialog.
     * @param {Object|string} studentOrName - Student object or student's name string.
     **/
    async markAppointmentAsNoShow(studentOrName) {
        const studentName = typeof studentOrName === 'object'
            ? ((studentOrName.firstName && studentOrName.lastName) ? `${studentOrName.lastName}, ${studentOrName.firstName}` : studentOrName.name.replace(" ", ", "))
            : studentOrName;

        // await this.isVisible(this.noShowAppointmentButton(studentName));
        await this.waitForVisible(this.noShowAppointmentButton(studentName));
        await this.click(this.noShowAppointmentButton(studentName));
        this.noShowNotes = `Marking No Show for ${studentName} at ${this.uniqueId}`;
        await this.fill(this.noShowAppointmentTextbox, this.noShowNotes);
        await this.click(this.noShowAppointmentPopupButton);
        await this.click(this.deleteConfirmationButton);
        await this.waitForLoaders();

        if (await this.isVisible(this.noShowYesButton)) {
            await this.click(this.noShowYesButton);
            await this.waitForLoaders();
        }

    }

    /**
     * Verifies that the appointment cancelled success toast message is displayed.
     **/
    async verifyAppointmentIsCancelledSuccessfully() {
        const toast = this.page.locator('#toast-container .toast-success .toast-message').first();
        await this.verifyVisible(toast);
        await this.verifyText(toast, 'Appointment cancelled successfully.');
    }

    /**
     * Verifies that the appointment marked No Show success toast message is displayed.
     **/
    async verifyAppointmentIsMarkedAsNoShowSuccessfully() {
        const toast = this.page.locator('#toast-container .toast-success .toast-message').first();
        await this.verifyVisible(toast);
        await this.verifyText(toast, 'Appointment marked No Show successfully.');
        await this.waitForHidden(toast);
        await this.waitForLoaders();
    }

    /**
     * Closes the appointment popup dialog.
     **/
    async closeTheDialogPopup() {
        await this.click(this.closePopup);

    }

}