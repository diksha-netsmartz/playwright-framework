import { expect } from "@playwright/test";
import BasePage from "../../../utils/BasePage";

export default class CombinedAppointmentPage extends BasePage {
    constructor(page) {
        super(page);
        this.uniqueId = Date.now();

        this.popupTitle = page.locator("#window1_wnd_title");
        this.maximisepopup=page.locator("xpath=(//a[@aria-label='window-Maximize'])[1]")

        this.submitButton = page.getByRole("button", {
            name: "Submit"
        });

        this.confirmYesButton = page.locator(
            "xpath=//a[@data-apply='confirmation']"
        );

        this.duration15Minutes = page.getByLabel('30 Minutes');


        this.student1Textbox = page.getByRole("textbox", {
            name: "Student1: Enter at least two characters."
        });

        this.student1Pickup = page.locator("#FirstTypeAppointment_p_str_PickupLocation");

        this.student1Notes = page.getByRole("textbox", {
            name: "Notes Student 1"
        });

        this.student2Textbox = page.getByRole("textbox", {
            name: "Student2: Enter at least two characters."
        });

        this.student2Pickup = page.locator("#FirstTypeAppointment_p_str_PickupLocationStudent2");

        this.student2Notes = page.getByRole("textbox", {
            name: "Notes Student 2"
        });

        this.alertPopup=page.locator("xpath=//h4[text()='ALERT']");
        this.submitButtonPopup = page.getByRole('button', { name: 'Yes, Submit' })


        this.appointmentCreatedToastMsg = page.locator("xpath=//div[@class='toast-message']");
        this.showAllVehiclesCheckbox=page.locator("#chkShowAllVehiclesG");
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

    getInstructionDropdownValue(dropdownName) {
        return this.page.locator(
            `xpath=(//button[contains(@data-id,'${dropdownName}')]//parent::div//li[@data-original-index='0'])[1]`
        );
    }

    getStudentTextbox(studentNo) {
        return studentNo === 1 ? this.student1Textbox : this.student2Textbox;
    }

    clickServiceDropdown(studentNo) {
        return studentNo === 1 ? this.getDropdownButton("Product_Id") : this.getDropdownButton("Product_Id_Student2");
    }

    selectServiceDropdownValue(studentNo) {
        return studentNo === 1 ? this.getFirstDropdownOption("Product_Id") : this.getFirstDropdownOption("Product_Id_Student2");
    }

    getPickup(studentNo) {
        return studentNo === 1 ? this.student1Pickup : this.student2Pickup;
    }


    clickInstruction1Dropdown(studentNo) {
        return studentNo === 1 ? this.getDropdownButton("Instructions") :  this.getDropdownButton("InstructionsStudent2");
    }
    getInstruction1DropdownValue(studentNo) {
        return studentNo === 1 ? this.getFirstDropdownOption("Instructions") :  this.getFirstDropdownOption("InstructionsStudent2");
    }

    clickInstruction2Dropdown(studentNo) {
        return studentNo === 1 ? this.getDropdownButton("Instructions1") :  this.getDropdownButton("Instructions1Student2");
    }
    getInstruction2DropdownValue(studentNo) {
        return studentNo === 1 ? this.getFirstDropdownOption("Instructions1") :  this.getFirstDropdownOption("Instructions1Student2");
    }

    getNotes(studentNo) {
        return studentNo === 1 ? this.student1Notes : this.student2Notes;
    }
    async verifyPopup() {
        await expect(this.popupTitle).toContainText(
            "Create Combined Appointment (Driver and Observer)"
        );
        // await this.click(this.maximisepopup);

    }

    async selectDropdown(dropdownName) {
        // if(dropdownName === "Vehicle"){
        //     await this.click(this.showAllVehiclesCheckbox);
        // }
        await this.click(this.getDropdownButton(dropdownName));
        await this.click(this.getFirstDropdownOption(dropdownName));
    }
    async selectDuration() {
        await this.duration15Minutes.check({ force: true });
    }
    async fillStudentDetails(studentNo, student) {
        await this.getStudentTextbox(studentNo).fill(student.name);

        await this.page.getByRole("option", {
            name: student.option
        }).click();

        await this.clickServiceDropdown(studentNo).click();
        await this.selectServiceDropdownValue(studentNo).click();

        await this.clickInstruction1Dropdown(studentNo).click();
        await this.getInstruction1DropdownValue(studentNo).click();

        await this.clickInstruction2Dropdown(studentNo).click();
        await this.getInstruction2DropdownValue(studentNo).click();

        await this.getPickup(studentNo).fill(student.pickup);

        await this.getNotes(studentNo).fill(`${student.notes}_${(this.uniqueId)}`);
    }
    async submitAppointment() {
        await this.click(this.submitButton);
        await this.click(this.confirmYesButton);
        this.page.pause();
            if (await this.submitButtonPopup.isVisible({ timeout: 10000 })) {
                await this.submitButtonPopup.click();}

        // await this.appointmentCreatedToastMsg.isVisible({ timeout: 10000 });
        // await expect(this.appointmentCreatedToastMsg).toContainText("Appointment updated successfully.");

        // await this.page.pause();

    }
}