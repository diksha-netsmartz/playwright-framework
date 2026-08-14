import {expect} from "@playwright/test";
import BasePage from "../../../../utils/BasePage";
import studentData from "../../../../test-data/studentData.json";

export default class CombinedAppointmentPage extends BasePage {
    constructor(page) {
        super(page);

        this.uniqueId = Date.now();

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
    }


    getDropdownTitle(dataId) {
        return this.page.locator(`button[data-id*="${dataId}"]`).first();
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

    cancelAppointmentButton(studentName) {
        return this.page.locator(
            `xpath=(//a[@data-sname1='${studentName}' or @data-sname2='${studentName}'  and contains(@id,'CancelAppointment')])[1]`
        );
    }

    noShowAppointmentButton(studentName) {
        return this.page.locator(
            `xpath=(//a[@data-sname1='${studentName}' or @data-sname2='${studentName}' and contains(@id,'NoShowAppointment')])[1]`
        );
    }


    getStudentTextbox(studentNo) {
        return studentNo === 1
            ? this.student1Textbox
            : this.student2Textbox;
    }

    getPickup(studentNo) {
        return studentNo === 1
            ? this.student1Pickup
            : this.student2Pickup;
    }

    getNotes(studentNo) {
        return studentNo === 1
            ? this.student1Notes
            : this.student2Notes;
    }

    clickServiceDropdown(studentNo) {
        return studentNo === 1
            ? this.getDropdownButton("Product_Id")
            : this.getDropdownButton("Product_Id_Student2");
    }

    selectServiceDropdownValue(studentNo) {
        return studentNo === 1
            ? this.getFirstDropdownOption("Product_Id")
            : this.getFirstDropdownOption("Product_Id_Student2");
    }

    clickInstruction1Dropdown(studentNo) {
        return studentNo === 1
            ? this.getDropdownButton("Instructions")
            : this.getDropdownButton("InstructionsStudent2");
    }

    getInstruction1DropdownValue(studentNo) {
        return studentNo === 1
            ? this.getFirstDropdownOption("Instructions")
            : this.getFirstDropdownOption("InstructionsStudent2");
    }

    clickInstruction2Dropdown(studentNo) {
        return studentNo === 1
            ? this.getDropdownButton("Instructions1")
            : this.getDropdownButton("Instructions1Student2");
    }

    getInstruction2DropdownValue(studentNo) {
        return studentNo === 1
            ? this.getFirstDropdownOption("Instructions1")
            : this.getFirstDropdownOption("Instructions1Student2");
    }


    async verifyAttribute(locator, attribute, expected, label) {
        const actual = await locator.getAttribute(attribute);

        console.log(`${label}`);
        console.log(`Expected : ${expected}`);
        console.log(`Actual   : ${actual}`);
        console.log("------------------------------------------------");

        await expect(locator).toHaveAttribute(attribute, expected);
    }

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

    async verifyText(locator, expected, label) {
        const actual = await locator.textContent();

        console.log(`${label}`);
        console.log(`Expected : ${expected}`);
        console.log(`Actual   : ${actual}`);
        console.log("------------------------------------------------");

        await expect(locator).toContainText(expected);
    }

    async verifyPopup() {
        await expect(this.popupTitle).toContainText(
            "Create Combined Appointment (Driver and Observer)"
        );
    }

    async selectDropdown(dropdownName) {
        await this.click(this.getDropdownButton(dropdownName));
        await this.click(this.getFirstDropdownOption(dropdownName));
    }

    async selectDuration() {
        await this.duration15Minutes.check({force: true});
    }

    async fillStudentDetails(studentNo, student) {
        await this.getStudentTextbox(studentNo).fill(student.name);

        await this.page
            .getByRole("option", {
                name: student.option,
            })
            .click();

        await this.clickServiceDropdown(studentNo).click();
        await this.selectServiceDropdownValue(studentNo).click();

        await this.clickInstruction1Dropdown(studentNo).click();
        await this.getInstruction1DropdownValue(studentNo).click();

        await this.clickInstruction2Dropdown(studentNo).click();
        await this.getInstruction2DropdownValue(studentNo).click();

        await this.getPickup(studentNo).fill(student.pickup);

        await this.getNotes(studentNo).fill(
            `${student.notes}_${this.uniqueId}`
        );
    }

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

        console.log("Expected Values");
        console.log(this.expectedValues);
    }

    async submitAppointment() {

        await this.click(this.submitButton);

        await this.click(this.confirmYesButton);

        try {

            await this.submitButtonPopup.waitFor({
                state: "visible",
                timeout: 10000,
            });

            await this.submitButtonPopup.click();

        } catch {

            console.log("Submit confirmation popup did not appear.");

        }

        const toast = this.page.locator('#toast-container .toast-success .toast-message').last();
        await toast.waitFor();
        await expect(toast).toBeVisible();
        await expect(toast).toHaveText('Appointment created successfully.');

    }

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

        const expected =
            studentNo === 1
                ? this.expectedValues.student1
                : this.expectedValues.student2;

        await this.verifyText(
            this.page.locator(
                `#FirstTypeAppointment_Student${studentNo}Name`
            ),
            student.name.replace(" ", ", "),
            `Student ${studentNo} Name`
        );

        await this.verifyRegexAttribute(
            this.getDropdownTitle(`Product_Id${suffix}`),
            "title",
            expected.product,
            `Student ${studentNo} Product`
        );

        await this.verifyAttribute(this.getDropdownTitle(instruction1Id), "title", expected.instruction1, `Student ${studentNo} Instruction 1`);

        await this.verifyAttribute(this.getDropdownTitle(instruction2Id), "title", expected.instruction2, `Student ${studentNo} Instruction 2`);

        await this.verifyAttribute(this.getPickup(studentNo), "oldval", student.pickup, `Student ${studentNo} Pickup`);

        await this.verifyAttribute(this.getNotes(studentNo), "oldval", `${student.notes}_${this.uniqueId}`, `Student ${studentNo} Notes`);

    }

    async verifyCombinedAppointmentCreatedValues() {

        await this.verifyAttribute(this.getDropdownTitle("InstID"), "title", this.expectedValues.staff, "Staff");

        await this.verifyAttribute(this.getDropdownTitle("Location_ID"), "title", this.expectedValues.location, "Location");

        await this.verifyAttribute(this.getDropdownTitle("VehicleID"), "title", this.expectedValues.vehicle, "Vehicle");

        await this.verifyStudent(1, studentData.student1);

        await this.verifyStudent(2, studentData.student2);
        await expect(this.duration15Minutes).toBeChecked();
        await this.click(this.closePopup);
    }


    async cancelAppointment(studentName) {
        await this.cancelAppointmentButton(studentName).isVisible();
        await this.click(this.cancelAppointmentButton(studentName));
        await this.cancelAppointmentTextbox.fill("Cancelling appointment for " + studentName);
        await this.click(this.cancelAppointmentPopupButton);
        await this.click(this.deleteConfirmationButton)
        const toast = this.page.locator('#toast-container .toast-success .toast-message').first();
        await toast.waitFor();
        await expect(toast).toBeVisible();
        await expect(toast).toHaveText('Appointment cancelled successfully.');
    }

    async markAppointmentAsNoShow(studentName) {
        await this.noShowAppointmentButton(studentName).isVisible();
        await this.click(this.noShowAppointmentButton(studentName));
        await this.noShowAppointmentTextbox.fill("Marking No Show appointment for " + studentName);
        await this.click(this.noShowAppointmentPopupButton);
        await this.click(this.deleteConfirmationButton)
    }

    async verifyAppointmentIsCancelledSuccessfully(studentName) {
        expect(await this.noShowAppointmentButton(studentName).isVisible()).toBeFalsy();
    }

    async closeTheDialogPopup() {
        await this.click(this.closePopup);

    }


}