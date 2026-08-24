import BasePage from "../../../../utils/BasePage";
import { expect } from "@playwright/test";
import CombinedAppointmentPage from "./CombinedAppointmentPage";

/**
 * Page Object representing the Single Instructor Scheduler View in Admin Portal.
 * Handles selecting instructors, finding unoccupied calendar slots, creating, editing, copying/pasting,
 * deleting active appointments, and managing cancelled/no-show appointment records.
 **/
export default class SingleInstructorPage extends BasePage {

    /**
     * Initializes locators for the Single Instructor Scheduler Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        this.combinedAppointmentPage = new CombinedAppointmentPage(page);


        this.submitButtonPopup = page.getByRole("button", {
            name: "Yes, Submit",
        });

        this.editAppointmentLink = page.getByRole('link', { name: 'Edit Appointment' });
        this.copyAppointmentLink = page.getByRole('link', { name: 'Copy Appointment' });

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

        this.calendarPrevBtn = page.getByRole('group').filter({ hasText: 'Single Instructor View:' }).getByLabel('Previous').first();
        this.listMenuOfANoShowAppointment = page.locator("xpath=(//div[@data-types='Appointment' and @data-statuss1='No Show']//span[@data-types='Appointment']//img)[1]");
        this.listMenuOfCancelledAppointment = page.locator("xpath=(//div[@data-types='Appointment' and @data-statuss1='Open']//span[@data-types='Appointment']//img)[1]");

        this.deleteCancelledAppointmentButton = page.locator("xpath=(//div[@data-types='Appointment' and @data-statuss1='Open']//a[@href='cancelAppt'])[1]");


    }

    /**
     * Helper to normalize a student object, name string, or identifier into a string for xpath matching.
     * @param {Object|string} studentOrIdentifier - Student data object or string identifier.
     * @returns {string}
     */
    getStudentSearchText(studentOrIdentifier) {
        if (!studentOrIdentifier) return '';
        if (typeof studentOrIdentifier === 'object') {
            if (studentOrIdentifier.firstName && studentOrIdentifier.lastName) {
                return `${studentOrIdentifier.lastName}, ${studentOrIdentifier.firstName}`;
            }
            return studentOrIdentifier.name || String(studentOrIdentifier);
        }
        return String(studentOrIdentifier);
    }

    /**
     * Returns locator for the action menu 3-dots icon on an active/confirmed appointment matching student name or notes.
     * @param {Object|string} studentOrNotes - Student object, name, or note string.
     * @returns {import('@playwright/test').Locator} 3-dots icon locator.
     **/
    listMenuOfCreatedAppointment(studentOrNotes) {
        const text = this.getStudentSearchText(studentOrNotes);
        return this.page.locator(`xpath=(//p[contains(text(),'${text}')]//ancestor::div[@data-types='Appointment' and not (@data-statuss1='No Show') and not (@data-statuss2='No Show')]//span[@data-types='Appointment']//img)[last()]`);
    }

    /**
     * Returns locator for all action menu 3-dots icons on active/confirmed appointments matching student name or notes.
     * @param {Object|string} studentOrNotes - Student object, name, or note string.
     * @returns {import('@playwright/test').Locator} All matching action menu icons locator.
     **/
    allListMenusOfCreatedAppointments(studentOrNotes) {
        const text = this.getStudentSearchText(studentOrNotes);
        return this.page.locator(`xpath=//p[contains(text(),'${text}')]//ancestor::div[@data-types='Appointment']//span[@data-types='Appointment']//img`);
    }

    /**
     * Returns locator for all action menu icons matching an appointment with specified student name or notes.
     * @param {Object|string} studentOrNotes - Student object, name, or note string.
     * @returns {import('@playwright/test').Locator} Action menu locator.
     **/
    listMenuInAppointment(studentOrNotes) {
        const text = this.getStudentSearchText(studentOrNotes);
        return this.page.locator(`xpath=(//p[contains(text(),'${text}')]//ancestor::div[@data-types='Appointment']//span[@data-types='Appointment']//img)`);
    }

    /**
     * Returns locator for the action menu icon on an appointment matching student name.
     * @param {Object|string} studentOrName - Student object or student name string.
     * @returns {import('@playwright/test').Locator} Action menu icon locator.
     **/
    listMenuOfNoShowAppointment(studentOrName) {
        const text = this.getStudentSearchText(studentOrName);
        return this.page.locator(`xpath=(//p[contains(text(),'${text}')]//ancestor::div[@data-types='Appointment']//span[@data-types='Appointment']//img)`);
    }

    /**
     * Returns locator for the delete appointment action link for an appointment matching student name or notes.
     * @param {Object|string} studentOrNotes - Student object, name, or note string.
     * @returns {import('@playwright/test').Locator} Delete appointment link locator.
     **/
    deleteAppointmentButton(studentOrNotes) {
        const text = this.getStudentSearchText(studentOrNotes);
        return this.page.locator(`xpath=(//p[contains(text(),'${text}')]//ancestor::div[@data-types='Appointment']//a[@href='cancelAppt'])[last()]`);
    }

    /**
     * Returns locator for a dropdown button container by name.
     * @param {string} dropdownName - Dropdown data-id identifier.
     * @returns {import('@playwright/test').Locator} Dropdown button locator.
     **/
    getDropdownButton(dropdownName) {
        return this.page.locator(
            `xpath=(//button[contains(@data-id,'${dropdownName}')]//parent::div//span[contains(@class,'filter-option pull-left')])[1]`
        );
    }

    /**
     * Returns locator for the context menu option that appears on right clicking a scheduler slot.
     * @param {string} appointmentType - Appointment menu option label.
     * @returns {import('@playwright/test').Locator} Context menu item link locator.
     **/
    createAppointmentOnRightClick(appointmentType) {
        return this.page.getByRole("link", {
            name: appointmentType
        });
    }

    /**
     * Returns locator for the last option item in the specified dropdown.
     * @param {string} dropdownName - Dropdown data-id identifier.
     * @returns {import('@playwright/test').Locator} Last dropdown list item locator.
     **/
    getLastDropdownOption(dropdownName) {
        return this.page.locator(
            `xpath=(//button[contains(@data-id,'${dropdownName}')]//parent::div//li)[last()]`
        );
    }


    /**
     * Verifies page title and selects the last instructor from the Single Instructor dropdown.
     **/
    async selectInstructor() {
        await this.verifyTitle("Single Instructor Scheduler");
        await this.click(this.getDropdownButton("SingleInst"));
        await this.click(this.getLastDropdownOption("SingleInst"));

    }

    /**
     * Clicks the 'Get Schedule' button to load the selected instructor's timetable grid.
     **/
    async getSchedule() {
        await this.click(this.getScheduleBtn);
        await this.waitForLoaders();
        // await this.page.waitForLoadState("networkidle")

    }

    /**
     * Calculates target calendar date (7 days prior, non-Sunday), navigates previous months if needed, and clicks the date.
     **/
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
            await this.click(this.calendarPrevBtn);
            await this.page.waitForTimeout(300);
        }

        await this.click(this.page.locator(`xpath=//a[@data-value="${dataValue}"]`).first());
    }

    /**
     * Evaluates in-browser whether a scheduler grid cell is currently overlapped by an existing appointment block.
     * @param {import('@playwright/test').Locator} cell - Scheduler gridcell locator.
     * @returns {Promise<boolean>} True if the slot is occupied, false otherwise.
     **/
    async isSlotOccupied(cell) {
        const handle = await cell.elementHandle();
        return this.page.evaluate((cellEl) => {
            const cellBox = cellEl.getBoundingClientRect();
            if (cellBox.width === 0 || cellBox.height === 0) return true;

            const centerX = cellBox.left + cellBox.width / 2;
            const centerY = cellBox.top + cellBox.height / 2;
            const elAtCenter = document.elementFromPoint(centerX, centerY);
            if (elAtCenter && !cellEl.contains(elAtCenter) && elAtCenter !== cellEl) {
                return true;
            }

            const appointments = Array.from(
                document.querySelectorAll("div.k-event, div[data-types='Appointment']")
            );
            for (const appt of appointments) {
                const apptBox = appt.getBoundingClientRect();
                if (apptBox.width === 0 || apptBox.height === 0) continue;
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

    /**
     * Evaluates the scheduler DOM to find an unoccupied, visible grid slot in the viewport.
     * @param {number} [skipCount=0] - Number of free slots to skip before returning.
     * @returns {Promise<import('@playwright/test').Locator>} Locator for the available gridcell.
     **/
    async findAvailableSlot(skipCount = 0) {
        const freeIndex = await this.page.evaluate((skip) => {
            const cells = Array.from(
                document.querySelectorAll("#scheduler td[role='gridcell']:not(.k-nonwork-hour)")
            );
            const appointments = Array.from(
                document.querySelectorAll("div.k-event, div[data-types='Appointment']")
            );
            const { innerHeight, innerWidth } = window;
            let skipped = 0;

            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                const cellBox = cell.getBoundingClientRect();

                // Skip cells not fully visible in the current viewport or without dimensions
                if (cellBox.width === 0 || cellBox.height === 0 ||
                    cellBox.top < 0 || cellBox.bottom > innerHeight ||
                    cellBox.left < 0 || cellBox.right > innerWidth) {
                    continue;
                }

                // Check if the center point of the cell is intercepted by an appointment/overlay element
                const centerX = cellBox.left + cellBox.width / 2;
                const centerY = cellBox.top + cellBox.height / 2;
                const elAtCenter = document.elementFromPoint(centerX, centerY);
                const isPointBlocked = elAtCenter && !cell.contains(elAtCenter) && elAtCenter !== cell;

                // Check bounding box overlap with all existing appointments
                const hasApptOverlap = appointments.some(appt => {
                    const apptBox = appt.getBoundingClientRect();
                    if (apptBox.width === 0 || apptBox.height === 0) return false;
                    return (
                        apptBox.left < cellBox.right &&
                        apptBox.right > cellBox.left &&
                        apptBox.top < cellBox.bottom &&
                        apptBox.bottom > cellBox.top
                    );
                });

                if (!hasApptOverlap && !isPointBlocked) {
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

    /**
     * Selects date in calendar, right clicks an unoccupied slot, and selects the given appointment creation option.
     * @param {string} appointmentType - Context menu label for appointment type.
     **/
    async selectCreateAppointment(appointmentType) {
        await this.selectDateInCalendar();
        await this.waitForLoaders().catch(() => { });
        await this.page.waitForTimeout(1000);

        const slot = await this.findAvailableSlot(0);
        await slot.click({ button: "right" });
        await this.page.waitForTimeout(2500);
        try {
            await this.waitForVisible(this.createAppointmentOnRightClick(appointmentType));
        } catch {
            console.log("right click menu options not visible, right clicking again");
            await slot.click({ button: "right" });
            await this.waitForVisible(this.createAppointmentOnRightClick(appointmentType));
        }
        await this.click(this.createAppointmentOnRightClick(appointmentType));
    }

    /**
     * Opens the action menu on an appointment matching student name or notes and clicks 'Edit Appointment'.
     * @param {Object|string} studentOrNotes - Student object, student name string, or unique notes value.
     **/
    async editAppointment(studentOrNotes) {
        await this.isVisible(this.listMenuOfCreatedAppointment(studentOrNotes));
        await this.listMenuOfCreatedAppointment(studentOrNotes).click({ force: true });

        try {
            await this.waitForVisible(this.editAppointmentLink);
        } catch {
            console.log("edit appointment link was not visible. Re-clicking the list menu...");

            await this.click(this.listMenuOfCreatedAppointment(studentOrNotes));
            await this.waitForVisible(this.editAppointmentLink);
        }
        await this.click(this.editAppointmentLink);
    }

    /**
     * Iterates through all visible created appointments matching student details, opens each one by one via 'Edit Appointment', and verifies the appointment values.
     * @param {Object|string} student1 - Student 1 data object or identifier.
     * @param {Object} [student2] - Student 2 data object.
     **/
    async editAndVerifyDetailsForAllAppointments(student1, student2) {
        const menus = this.allListMenusOfCreatedAppointments(student1);
        await this.waitForVisible(menus.first());
        const count = await menus.count();
        console.log(`Found ${count} appointment(s) matching: "${this.getStudentSearchText(student1)}"`);

        for (let i = 0; i < count; i++) {
            console.log(`Opening and verifying appointment ${i + 1} of ${count}...`);
            const menu = menus.nth(i);
            await this.waitForVisible(menu);
            await menu.scrollIntoViewIfNeeded();
            await menu.click({ button: "middle" });
            await this.page.waitForTimeout(1000);

            try {
                await this.waitForVisible(this.editAppointmentLink);
            } catch {
                console.log(`Edit appointment link was not visible for appointment ${i + 1}. Re-clicking the list menu...`);
                await menu.click({ button: "middle" });
                await this.waitForVisible(this.editAppointmentLink);
            }

            await this.click(this.editAppointmentLink);
            await this.combinedAppointmentPage.verifyCombinedAppointmentCreatedValues(student1, student2);
            await this.page.waitForTimeout(1000);
        }
    }

    /**
     * Deletes an appointment via its action menu, confirms deletion in modal, and verifies success toast.
     * @param {Object|string} studentOrNotes - Student object, student name string, or unique notes value.
     **/
    async deleteAppointment(studentOrNotes) {
        await this.hover(this.listMenuOfCreatedAppointment(studentOrNotes));
        await this.isVisible(this.deleteAppointmentButton(studentOrNotes));
        await this.click(this.deleteAppointmentButton(studentOrNotes));
        await this.click(this.deleteButtonInPopup);
        await this.waitForHidden(this.deleteButtonInPopup);
        await this.waitForLoaders();
        const toast = this.page.locator('#toast-container .toast-success .toast-message').first();
        await this.verifyVisible(toast);
        await this.verifyText(toast, 'Appointment deleted successfully.');
    }

    /**
     * Copies an existing appointment, finds available slots, pastes it via context menu, confirms modal, and verifies success toast.
     * @param {Object|string} studentOrNotes - Student object, student name string, or unique notes value.
     **/
    async copyAppointment(studentOrNotes) {
        // await this.waitForVisible(this.appointmentConfirmed);
        await this.waitForVisible(this.listMenuOfCreatedAppointment(studentOrNotes));
        await this.click(this.listMenuOfCreatedAppointment(studentOrNotes));
        await this.page.waitForTimeout(2500);

        try {
            await this.waitForVisible(this.copyAppointmentLink);
        } catch {
            console.log("Copy appointment link was not visible. Re-clicking the list menu...");
            await this.click(this.listMenuOfCreatedAppointment(studentOrNotes));
            await this.waitForVisible(this.copyAppointmentLink);
        }
        await this.click(this.copyAppointmentLink);

        const maxRetries = 20;

        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            // Wait for any lingering toasts from previous steps to clear
            await this.page.waitForFunction(() => {
                const container = document.querySelector('#toast-container');
                return !container || Array.from(container.children).every(
                    c => !c.offsetParent || getComputedStyle(c).display === 'none'
                );
            }, { timeout: 8000 }).catch(() => {
            });

            const slot = await this.findAvailableSlot(attempt);
            await slot.click({ button: "right" });
            await this.click(this.createAppointmentOnRightClick("Paste Last Copied Appointment"));

            try {
                await this.waitForVisible(this.submitButtonPopup);
                await this.click(this.submitButtonPopup);

            } catch {
                console.log("Submit confirmation popup did not appear.");
            }

            // Locate and wait for toast message to appear
            const toastLocator = this.page.locator('#toast-container .toast-message');

            let message = '';
            try {
                await this.waitForVisible(toastLocator);
                message = (await this.getText(toastLocator))?.trim() || '';
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

    /**
     * Verifies that the appointment was duplicated into 2 distinct instances in the scheduler matching student name or notes.
     * @param {Object|string} studentOrNotes - Student object, student name string, or unique notes value.
     **/
    async verifyAppointmentIsCopied(studentOrNotes) {
        let studentName = '';
        if (studentOrNotes && typeof studentOrNotes === 'object') {
            studentName = (studentOrNotes.firstName && studentOrNotes.lastName)
                ? `${studentOrNotes.lastName}, ${studentOrNotes.firstName}`
                : (studentOrNotes.name || String(studentOrNotes));
        } else {
            studentName = String(studentOrNotes);
        }

        const locator = this.page.locator(`xpath=//p[contains(text(),'${studentName}')]//ancestor::div[@data-types='Appointment']//span[@data-types='Appointment']//img`);
        await expect(locator).toHaveCount(2);
        await this.waitForLoaders();
    }

    /**
     * Deletes an open/cancelled appointment slot and verifies success toast.
     **/
    async deleteCancelledAppointment() {
        await this.isVisible(this.listMenuOfCancelledAppointment);
        await this.hover(this.listMenuOfCancelledAppointment);
        await this.isVisible(this.deleteCancelledAppointmentButton);
        await this.click(this.deleteCancelledAppointmentButton);
        await this.click(this.deleteButtonInPopup);
        await this.waitForHidden(this.deleteButtonInPopup);
        await this.waitForLoaders();
        const toast = this.page.locator('#toast-container .toast-success .toast-message').first();
        await this.verifyVisible(toast);
        await this.verifyText(toast, 'Appointment deleted successfully.');
    }

    /**
     * Opens the edit modal for a cancelled appointment from its action menu.
     **/
    async editCancelledAppointment() {
        await this.isVisible(this.listMenuOfCancelledAppointment);
        await this.click(this.listMenuOfCancelledAppointment);

        try {
            await this.waitForVisible(this.editAppointmentLink);
        } catch {
            console.log("edit appointment link was not visible. Re-clicking the list menu...");

            await this.click(this.listMenuOfCancelledAppointment);
            await this.waitForVisible(this.editAppointmentLink);
        }
        await this.click(this.editAppointmentLink);
    }

    /**
     * Opens the edit modal for an appointment matching student name from its action menu.
     * @param {Object|string} studentOrName - Student object or student name string.
     **/
    async editNoShowAppointment(studentOrName) {
        const studentName = typeof studentOrName === 'object'
            ? ((studentOrName.firstName && studentOrName.lastName) ? `${studentOrName.lastName}, ${studentOrName.firstName}` : studentOrName.name.replace(" ", ", "))
            : studentOrName;
        const listMenu = this.listMenuOfNoShowAppointment(studentName);
        await this.isVisible(listMenu);
        await this.click(listMenu);

        try {
            await this.waitForVisible(this.editAppointmentLink);
        } catch {
            console.log("edit appointment link was not visible. Re-clicking the list menu...");

            await this.click(listMenu);
            await this.waitForVisible(this.editAppointmentLink);
        }
        await this.click(this.editAppointmentLink);
    }


}