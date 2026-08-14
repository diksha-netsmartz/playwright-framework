import BasePage from "../../../../utils/BasePage";
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

        this.timeSlot = page.locator("xpath=((//div[@id='scheduler']//tr[@role='row'])[10]//td[@role='gridcell' and not(contains(@class,'k-nonwork-hour'))])[1]");

        this.timeSlot2 = page.locator("xpath=((//div[@id='scheduler']//tr[@role='row'])[10]//td[@role='gridcell' and not(contains(@class,'k-nonwork-hour'))])[2]");

        this.allSlotsInRow = (rowIndex) => page.locator(
            `xpath=(//div[@id='scheduler']//tr[@role='row'])[${rowIndex}]//td[@role='gridcell' and not(contains(@class,'k-nonwork-hour'))]`
        );


        this.deleteButtonInPopup = page.locator("#btnDeleteAppointment");
        // this.deletionSuccessToast = page.getByText('Appointment deleted successfully.', { exact: true });

        this.calendarPrevBtn = page.getByRole('group').filter({hasText: 'Single Instructor View:'}).getByLabel('Previous').first();
        this.listMenuOfANoShowAppointment = page.locator("xpath=(//div[@data-types='Appointment' and @data-statuss1='No Show']//span[@data-types='Appointment']//img)[1]");
        this.listMenuOfCancelledAppointment = page.locator("xpath=(//div[@data-types='Appointment' and @data-statuss1='Open']//span[@data-types='Appointment']//img)[1]");

        this.deleteCancelledAppointmentButton = page.locator("xpath=(//div[@data-types='Appointment' and @data-statuss1='Open']//a[@href='cancelAppt'])[1]");


    }

    listMenuOfCreatedAppointment(notesValue) {
        return this.page.locator(`xpath=(//p[contains(text(),'${notesValue}')]//ancestor::div[@data-types='Appointment' and not (@data-statuss1='No Show') and not (@data-statuss2='No Show')]//span[@data-types='Appointment']//img)[last()]`);
    }

    listMenuInAppointment(notesValue) {
        return this.page.locator(`xpath=(//p[contains(text(),'${notesValue}')]//ancestor::div[@data-types='Appointment']//span[@data-types='Appointment']//img)`);
    }

    listMenuOfNoShowAppointment(notesValue) {
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

    async waitForLoaders() {
        await this.page.waitForFunction(() =>
            [...document.querySelectorAll('.load-area')].every(
                el => el.style.display === 'none'
            )
        );
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

    async isSlotOccupied(cell) {
        const handle = await cell.elementHandle();
        return this.page.evaluate((cellEl) => {
            const cellBox = cellEl.getBoundingClientRect();
            const appointments = document.querySelectorAll("div[data-types='Appointment']");
            for (const appt of appointments) {
                const apptBox = appt.getBoundingClientRect();
                const overlaps =
                    apptBox.left < cellBox.right &&
                    apptBox.right > cellBox.left &&
                    apptBox.top < cellBox.bottom &&
                    apptBox.bottom > cellBox.top;
                if (overlaps) return true;
            }
            return false;
        }, handle);
    }

    async findAvailableSlot(skipCount = 0) {
        const freeIndex = await this.page.evaluate((skip) => {
            const cells = Array.from(
                document.querySelectorAll("#scheduler td[role='gridcell']:not(.k-nonwork-hour)")
            );
            const appointments = Array.from(
                document.querySelectorAll("div.k-event, div[data-types='Appointment']")
            );
            const {innerHeight, innerWidth} = window;
            let skipped = 0;
            for (let i = 0; i < cells.length; i++) {
                const cellBox = cells[i].getBoundingClientRect();

                // Skip cells not fully visible in the current viewport to avoid scrolling
                if (cellBox.top < 0 || cellBox.bottom > innerHeight ||
                    cellBox.left < 0 || cellBox.right > innerWidth) {
                    continue;
                }

                const occupied = appointments.some(appt => {
                    const apptBox = appt.getBoundingClientRect();
                    return (
                        apptBox.left < cellBox.right &&
                        apptBox.right > cellBox.left &&
                        apptBox.top < cellBox.bottom &&
                        apptBox.bottom > cellBox.top
                    );
                });
                if (!occupied) {
                    if (skipped === skip) return i;
                    skipped++;
                }
            }
            return -1;
        }, skipCount);

        if (freeIndex === -1) throw new Error("No available slot found in the scheduler");
        console.log(`Found available slot at index ${freeIndex}`);
        return this.page.locator("#scheduler td[role='gridcell']:not(.k-nonwork-hour)").nth(freeIndex);
    }

    async selectCreateAppointment(appointmentType) {
        await this.selectDateInCalendar();
        await this.page.waitForLoadState("domcontentloaded");

        const slot = await this.findAvailableSlot(1);
        await slot.click({button: "right"});
        await this.page.waitForTimeout(2500);
        try {
            await this.createAppointmentOnRightClick(appointmentType).waitFor({state: "visible", timeout: 3000,});
        } catch {
            console.log("right click menu options not visible, right clicking again");
            await slot.click({button: "right"});
            await this.createAppointmentOnRightClick(appointmentType).waitFor({state: "visible", timeout: 3000,});
        }
        await this.click(this.createAppointmentOnRightClick(appointmentType));
    }

    async editAppointment(notesValue) {
        await this.listMenuOfCreatedAppointment(notesValue).isVisible();
        // await this.listMenuOfCreatedAppointment(notesValue).click();
        await this.listMenuOfCreatedAppointment(notesValue).click({force: true});

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
        await this.waitForLoaders();
        const toast = this.page.locator('#toast-container .toast-success .toast-message').first();
        await toast.waitFor();
        await expect(toast).toBeVisible();
        await expect(toast).toHaveText('Appointment deleted successfully.');
    }


    async copyAppointment(notesValue) {
        await this.appointmentConfirmed.waitFor({state: "visible"});
        await this.listMenuOfCreatedAppointment(notesValue).waitFor({state: "visible"});
        await this.page.waitForTimeout(2500);

        try {
            await this.copyAppointmentLink.waitFor({state: "visible", timeout: 3000,});
        } catch {
            console.log("Copy appointment link was not visible. Re-clicking the list menu...");
            await this.listMenuOfCreatedAppointment(notesValue).click();
            await this.copyAppointmentLink.waitFor({state: "visible", timeout: 3000});
        }
        await this.copyAppointmentLink.click();

        const maxRetries = 10;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            // Wait for any lingering toasts from previous steps to clear
            await this.page.waitForFunction(() => {
                const container = document.querySelector('#toast-container');
                return !container || Array.from(container.children).every(
                    c => !c.offsetParent || getComputedStyle(c).display === 'none'
                );
            }, {timeout: 8000}).catch(() => {
            });

            const slot = await this.findAvailableSlot(attempt);
            await slot.click({button: "right"});
            await this.click(this.createAppointmentOnRightClick("Paste Last Copied Appointment"));

            try {
                await this.submitButtonPopup.waitFor({state: "visible", timeout: 2000,});
                await this.submitButtonPopup.click();

            } catch {
                console.log("Submit confirmation popup did not appear.");
            }

            // Locate and wait for toast message to appear
            const toastLocator = this.page.locator('#toast-container .toast-message');

            let message = '';
            try {
                await toastLocator.waitFor({state: "visible", timeout: 5000});
                message = (await toastLocator.textContent())?.trim() || '';
            } catch {
                console.log(`Slot attempt ${attempt}: No toast message detected within timeout.`);
            }

            console.log(`Slot attempt ${attempt}: Toast message = "${message}"`);

            // Check if toast matches success message
            if (message.includes("Appointment created successfully.")) {
                console.log(`Success on attempt ${attempt}: ${message}`);
                return; // Skip/exit to next step
            } else {
                console.log(`Non-success toast received: "${message}"`);
                await this.page.locator('#toast-container .toast').waitFor({
                    state: 'hidden',
                    timeout: 5000
                }).catch(() => {
                });
            }
        }

        throw new Error("Could not paste appointment: student not available in any of the tried slots");
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
        await this.waitForLoaders();
        const toast = this.page.locator('#toast-container .toast-success .toast-message').first();
        await toast.waitFor();
        await expect(toast).toBeVisible();
        await expect(toast).toHaveText('Appointment deleted successfully.');
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

    async editNoShowAppointment(notesValue) {
        const listMenu = this.listMenuOfNoShowAppointment(notesValue);
        await listMenu.isVisible();
        await listMenu.click();

        try {
            await this.editAppointmentLink.waitFor({
                state: "visible",
                timeout: 3000,
            });
        } catch {
            console.log("edit appointment link was not visible. Re-clicking the list menu...");

            await listMenu.click();
            await this.editAppointmentLink.waitFor({state: "visible", timeout: 3000});
        }
        await this.editAppointmentLink.click();
    }


}