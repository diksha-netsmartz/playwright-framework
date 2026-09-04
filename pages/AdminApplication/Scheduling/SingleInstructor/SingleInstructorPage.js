import BasePage from "../../../../utils/BasePage";
import { expect, test } from "@playwright/test";
import CombinedAppointmentPage from "./CombinedAppointmentPage";
import DateHelper from "../../../../utils/DateHelper";

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

        this.submitButtonPopup = page.getByRole("button", { name: "Yes, Submit", });

        this.editAppointmentLink = page.getByRole('link', { name: 'Edit Appointment' });
        this.copyAppointmentLink = page.getByRole('link', { name: 'Copy Appointment' });

        // Buttons
        this.getScheduleBtn = page.getByRole("button", { name: "Get Schedule" });
        this.singleInstructorTextbox = page.locator("xpath=//button[contains(@data-id,'SingleInst')]//parent::div//input[@type='text']");

        this.appointmentConfirmed = page.locator("xpath=//div[@data-statuss1='Confirmed' and @data-types='Appointment']");

        this.timeSlot = page.locator("xpath=((//div[@id='scheduler']//tr[@role='row'])[10]//td[@role='gridcell' and not(contains(@class,'k-nonwork-hour'))])[1]");
        this.timeSlot2 = page.locator("xpath=((//div[@id='scheduler']//tr[@role='row'])[10]//td[@role='gridcell' and not(contains(@class,'k-nonwork-hour'))])[2]");

        this.allSlotsInRow = (rowIndex) => page.locator(
            `xpath=(//div[@id='scheduler']//tr[@role='row'])[${rowIndex}]//td[@role='gridcell' and not(contains(@class,'k-nonwork-hour'))]`
        );

        this.deleteButtonInPopup = page.locator("#btnDeleteAppointment");
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
     * Returns locator for the action menu 3-dots icon on an active/confirmed appointment matching student name.
     * @param {Object|string} studentName - Student object or name string.
     * @returns {import('@playwright/test').Locator} 3-dots icon locator.
     **/
    listMenuOfCreatedAppointment(studentName) {
        const text = this.getStudentSearchText(studentName);
        // return this.page.locator(`xpath=(//p[contains(text(),'${text}')]//ancestor::div[@data-types='Appointment' and not (@data-statuss1='No Show') and not (@data-statuss2='No Show')]//span[@data-types='Appointment']//img)[last()]`);
        return this.page.locator(`xpath=(//div[@data-formattedstudentname='${text}' or @data-formattedstudentname2='${text}']//img[contains(@src,'list')])[last()]`);
    }

    /**
     * Returns locator for all action menu 3-dots icons on active/confirmed appointments matching student name.
     * @param {Object|string} studentName - Student object or name string.
     * @returns {import('@playwright/test').Locator} All matching action menu icons locator.
     **/
    allListMenusOfCreatedAppointments(studentName) {
        const text = this.getStudentSearchText(studentName);
        // return this.page.locator(`xpath=//p[contains(text(),'${text}')]//ancestor::div[@data-types='Appointment']//span[@data-types='Appointment']//img`);
        return this.page.locator(`xpath=//div[@data-formattedstudentname='${text}' or @data-formattedstudentname2='${text}']//img[contains(@src,'list')]`);

    }

    /**
     * Returns locator for all action menu icons matching an appointment with specified student name.
     * @param {Object|string} studentName - Student object or name string.
     * @returns {import('@playwright/test').Locator} Action menu locator.
     **/
    listMenuInAppointment(studentName) {
        const text = this.getStudentSearchText(studentName);
        // return this.page.locator(`xpath=(//p[contains(text(),'${text}')]//ancestor::div[@data-types='Appointment']//span[@data-types='Appointment']//img)`);
        return this.page.locator(`xpath=//div[@data-formattedstudentname='${text}' or @data-formattedstudentname2='${text}']//img[contains(@src,'list')]`);

    }

    /**
     * Returns locator for the action menu icon on an appointment matching student name.
     * @param {Object|string} studentOrName - Student object or student name string.
     * @returns {import('@playwright/test').Locator} Action menu icon locator.
     **/
    listMenuOfNoShowAppointment(studentOrName) {
        const text = this.getStudentSearchText(studentOrName);
        // return this.page.locator(`xpath=(//p[contains(text(),'${text}')]//ancestor::div[@data-types='Appointment']//span[@data-types='Appointment']//img)`);
        return this.page.locator(`xpath=//div[@data-formattedstudentname='${text}' or @data-formattedstudentname2='${text}']//img[contains(@src,'list')]`);

    }

    /**
     * Returns locator for the delete appointment action link for an appointment matching student name.
     * @param {Object|string} studentName - Student object or name string.
     * @returns {import('@playwright/test').Locator} Delete appointment link locator.
     **/
    deleteAppointmentButton(studentName) {
        const text = this.getStudentSearchText(studentName);
        // return this.page.locator(`xpath=(//p[contains(text(),'${text}')]//ancestor::div[@data-types='Appointment']//a[@href='cancelAppt'])[last()]`);
        return this.page.locator(`xpath=(//div[@data-formattedstudentname='${text}' or @data-formattedstudentname2='${text}']//a[@href='cancelAppt'])[last()]`);
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
     * Returns locator for a dropdown option item matching text/name in the specified dropdown.
     * @param {string} dropdownName - Dropdown data-id identifier.
     * @param {string} optionText - Option text or name to match.
     * @returns {import('@playwright/test').Locator} Matching dropdown list item locator.
     **/
    getDropdownOptionByName(dropdownName, optionText) {
        return this.page.locator(
            `xpath=//button[contains(@data-id,'${dropdownName}')]//parent::div//li[.//span[contains(normalize-space(),'${optionText}')] or .//a[contains(normalize-space(),'${optionText}')]]`
        ).first();
    }

    /**
     * Verifies page title and selects the specified instructor by name/username from the dropdown,
     * falling back to the last option if no specific instructor is found or passed.
     * @param {string} [instructorName] - Optional instructor name or username.
     **/
    async selectInstructor(instructorName) {
        await test.step(`Select Single Instructor from dropdown: "${instructorName}"`, async () => {
            await this.verifyTitle("Single Instructor Scheduler");
            await this.click(this.getDropdownButton("SingleInst"));
            await this.waitForVisible(this.singleInstructorTextbox);
            const option = this.getDropdownOptionByName("SingleInst", instructorName);
            await this.fill(this.singleInstructorTextbox, instructorName);

            if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(option);
                return;
            }

            await this.waitForLoaders();
        });
    }

    /**
     * Clicks the 'Get Schedule' button to load the selected instructor's timetable grid.
     **/
    async getSchedule() {
        await test.step('Click Get Schedule to load timetable', async () => {
            await this.click(this.getScheduleBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Calculates target calendar date (7 days prior, non-Sunday), navigates previous months if needed, and clicks the date.
     **/
    async selectDateInCalendar() {
        await test.step('Select target date in scheduler calendar', async () => {
            const targetDate = DateHelper.getWeekdayDaysAgo(7);
            const dataValue = DateHelper.toSchedulerDataValue(targetDate);

            const today = new Date();
            const monthDiff = (today.getFullYear() - targetDate.getFullYear()) * 12 + (today.getMonth() - targetDate.getMonth());

            for (let i = 0; i < monthDiff; i++) {
                await this.click(this.calendarPrevBtn);
                await this.page.waitForTimeout(300);
            }

            await this.click(this.page.locator(`xpath=//a[@data-value="${dataValue}"]`).first());
        });
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
                // document.querySelectorAll("#scheduler td[role='gridcell']:not(.k-nonwork-hour)")
                document.querySelectorAll("#scheduler td[role='gridcell']")

            );
            const appointments = Array.from(
                document.querySelectorAll("div.k-event, div[data-types='Appointment']")
            );
            let skipped = 0;

            for (let i = 0; i < cells.length; i++) {
                const cell = cells[i];
                const cellBox = cell.getBoundingClientRect();

                // Only skip unrendered/hidden cells
                if (cellBox.width === 0 || cellBox.height === 0) {
                    continue;
                }

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

                if (!hasApptOverlap) {
                    if (skipped === skip) return i;
                    skipped++;
                }
            }
            return -1;
        }, skipCount);

        if (freeIndex === -1) throw new Error("No available slot found in the scheduler");
        console.log(`Found available slot at index ${freeIndex}`);
        // const slot = this.page.locator("#scheduler td[role='gridcell']:not(.k-nonwork-hour)").nth(freeIndex);
        const slot = this.page.locator("#scheduler td[role='gridcell']").nth(freeIndex);
        await slot.scrollIntoViewIfNeeded();
        return slot;
    }


    /**
     * Selects date in calendar, right clicks an unoccupied slot, and selects the given appointment creation option.
     * @param {string} appointmentType - Context menu label for appointment type.
     **/
    async selectCreateAppointment(appointmentType) {
        await test.step(`Right-click free slot and select: "${appointmentType}"`, async () => {
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
        });
    }

    /**
     * Opens the action menu on an appointment matching student name and clicks 'Edit Appointment'.
     * @param {Object|string} studentName - Student object or student name string.
     **/
    async editAppointment(studentName) {
        await test.step(`Open action menu and click Edit Appointment for: "${this.getStudentSearchText(studentName)}"`, async () => {
            await this.isVisible(this.listMenuOfCreatedAppointment(studentName), { timeout: 5000 }).catch(() => false);
            await this.listMenuOfCreatedAppointment(studentName).click({ force: true });

            try {
                await this.waitForVisible(this.editAppointmentLink);
            } catch {
                console.log("edit appointment link was not visible. Re-clicking the list menu...");
                await this.click(this.listMenuOfCreatedAppointment(studentName));
                await this.waitForVisible(this.editAppointmentLink);
            }
            await this.click(this.editAppointmentLink);
        });
    }

    /**
     * Iterates through all visible created appointments matching student details, opens each one by one via 'Edit Appointment', and verifies the appointment values.
     * @param {Object|string} student1 - Student 1 data object or identifier.
     * @param {Object} [student2] - Student 2 data object.
     **/
    async editAndVerifyDetailsForAllAppointments(student1, student2) {
        await test.step(`Edit and verify details for all appointments matching: "${this.getStudentSearchText(student1)}"`, async () => {
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
        });
    }

    /**
     * Deletes an appointment via its action menu, confirms deletion in modal, and verifies success toast.
     * If the success toast is not found, verifies that the appointment count is decremented by 1.
     * @param {Object|string} studentName - Student object or student name string.
     **/
    async deleteAppointment(studentName) {
        await test.step(`Delete appointment for: "${this.getStudentSearchText(studentName)}"`, async () => {
            await this.page.waitForTimeout(10000);
            await this.waitForLoaders();

            const allAppointments = this.allListMenusOfCreatedAppointments(studentName);
            const countBefore = await allAppointments.count();
            console.log(`Appointments count before deletion: ${countBefore}`);

            await this.hover(this.listMenuOfCreatedAppointment(studentName));
            await this.isVisible(this.deleteAppointmentButton(studentName), { timeout: 5000 }).catch(() => false);
            await this.click(this.deleteAppointmentButton(studentName));
            await this.click(this.deleteButtonInPopup);
            await this.waitForHidden(this.deleteButtonInPopup);
            await this.waitForLoaders();

            const toast = this.page.locator('#toast-container .toast-success .toast-message').first();
            await this.waitForVisible(toast, { timeout: 4000 }).catch(() => { });

            if (await this.isVisible(toast, { timeout: 500 }).catch(() => false)) {
                await this.verifyVisible(toast);
                await this.verifyText(toast, 'Appointment deleted successfully.');
                console.log(`Appointment deleted with message: Appointment deleted successfully.`);
                await this.waitForHidden(toast).catch(() => { });
                await test.step(`Appointment deleted successfully.`, async () => { });

                // const countAfter = await allAppointments.count();
                // console.log(`Appointments count after deletion: ${countAfter}`);
            } else {
                await this.waitForLoaders();
                const expectedCount = Math.max(0, countBefore - 1);
                await expect(allAppointments).toHaveCount(expectedCount);
                console.log(`Appointments count after deletion: ${expectedCount}`);
                console.log(`Toast not found. Appointment deletion verified on scheduler: count decremented from ${countBefore} to ${expectedCount}`);
                await test.step(`Appointment deleted successfully.`, async () => { });

            }
        });
    }

    /**
     * Copies an existing appointment, finds available slots, pastes it via context menu, confirms modal, and verifies success toast.
     * @param {Object|string} studentName - Student object or student name string.
     **/
    async copyAppointment(studentName) {
        await test.step(`Copy and paste appointment for: "${this.getStudentSearchText(studentName)}"`, async () => {
            await this.waitForVisible(this.listMenuOfCreatedAppointment(studentName));
            await this.click(this.listMenuOfCreatedAppointment(studentName));
            await this.page.waitForTimeout(2500);

            try {
                await this.waitForVisible(this.copyAppointmentLink);
            } catch {
                console.log("Copy appointment link was not visible. Re-clicking the list menu...");
                await this.click(this.listMenuOfCreatedAppointment(studentName));
                await this.waitForVisible(this.copyAppointmentLink);
            }
            await this.click(this.copyAppointmentLink);

            const maxRetries = 20;

            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForFunction(() => {
                    const container = document.querySelector('#toast-container');
                    return !container || Array.from(container.children).every(c => {
                        const el = /** @type {HTMLElement} */ (c);
                        return !el.offsetParent || getComputedStyle(el).display === 'none';
                    });
                }, { timeout: 8000 }).catch(() => { });

                const slot = await this.findAvailableSlot(attempt);
                await slot.click({ button: "right" });
                await this.click(this.createAppointmentOnRightClick("Paste Last Copied Appointment"));

                try {
                    await this.submitButtonPopup.waitFor({ state: 'visible', timeout: 1500 });
                    await this.click(this.submitButtonPopup);
                } catch {
                    console.log("Submit confirmation popup did not appear.");
                }

                const toastLocator = this.page.locator('#toast-container .toast-message').last();

                let message = '';
                try {
                    await toastLocator.waitFor({ state: 'visible', timeout: 4000 });
                    message = (await toastLocator.textContent())?.trim() || '';
                } catch {
                    console.log(`Slot attempt ${attempt}: No toast message detected within timeout.`);
                    const appointmentCount = await this.allListMenusOfCreatedAppointments(studentName).count();
                    if (appointmentCount >= 2) {
                        console.log(`Appointment is duplicated in scheduler (count: ${appointmentCount}). Exiting loop as copied appointment is confirmed.`);
                        return;
                    }
                }

                console.log(`Slot attempt ${attempt}: Toast message = "${message}"`);

                if (message.includes("Appointment created successfully.")) {
                    console.log(`Success on attempt ${attempt}: ${message}`);
                    return;
                } else {
                    const appointmentCount = await this.allListMenusOfCreatedAppointments(studentName).count();
                    if (appointmentCount >= 2) {
                        console.log(`Appointment is duplicated in scheduler (count: ${appointmentCount}). Exiting loop as copied appointment is confirmed.`);
                        return;
                    }

                    console.log(`Non-success toast received: "${message}"`);
                    await this.page.locator('#toast-container .toast').waitFor({
                        state: 'hidden',
                        timeout: 5000
                    }).catch(() => { });
                }
            }

            throw new Error("Could not paste appointment: student not available in any of the tried slots");
        });
    }

    /**
     * Verifies that the appointment was duplicated into 2 distinct instances in the scheduler matching student name.
     * @param {Object|string} studentName - Student object or student name string.
     **/
    async verifyAppointmentIsCopied(studentName) {
        await test.step(`Verify appointment is duplicated in scheduler for: "${this.getStudentSearchText(studentName)}"`, async () => {
            let formattedName = '';
            if (studentName && typeof studentName === 'object') {
                formattedName = (studentName.firstName && studentName.lastName)
                    ? `${studentName.lastName}, ${studentName.firstName}`
                    : (studentName.name || String(studentName));
            } else {
                formattedName = String(studentName);
            }

            // const locator = this.page.locator(`xpath=//p[contains(text(),'${formattedName}')]//ancestor::div[@data-types='Appointment']//span[@data-types='Appointment']//img`);
            const locator = this.page.locator(`xpath=//div[@data-formattedstudentname='${formattedName}' or @data-formattedstudentname2='${formattedName}']//img[contains(@src,'list')]`);

            await expect(locator).toHaveCount(2);
            await this.waitForLoaders();
        });
    }

    /**
     * Deletes an open/cancelled appointment slot and verifies success toast.
     **/
    async deleteCancelledAppointment() {
        await test.step('Delete cancelled appointment slot', async () => {
            await this.isVisible(this.listMenuOfCancelledAppointment, { timeout: 2000 }).catch(() => false);
            await this.hover(this.listMenuOfCancelledAppointment);
            await this.isVisible(this.deleteCancelledAppointmentButton, { timeout: 2000 }).catch(() => false);
            await this.click(this.deleteCancelledAppointmentButton);
            await this.click(this.deleteButtonInPopup);
            await this.waitForHidden(this.deleteButtonInPopup);
            await this.waitForLoaders();
            const toast = this.page.locator('#toast-container .toast-success .toast-message').first();
            await this.verifyVisible(toast);
            await this.verifyText(toast, 'Appointment deleted successfully.');
        });
    }

    /**
     * Opens the edit modal for a cancelled appointment from its action menu.
     **/
    async editCancelledAppointment() {
        await test.step('Open Edit modal for cancelled appointment', async () => {
            await this.isVisible(this.listMenuOfCancelledAppointment, { timeout: 2000 }).catch(() => false);
            await this.click(this.listMenuOfCancelledAppointment);

            try {
                await this.waitForVisible(this.editAppointmentLink);
            } catch {
                console.log("edit appointment link was not visible. Re-clicking the list menu...");
                await this.click(this.listMenuOfCancelledAppointment);
                await this.waitForVisible(this.editAppointmentLink);
            }
            await this.click(this.editAppointmentLink);
        });
    }

    /**
     * Opens the edit modal for an appointment matching student name from its action menu.
     * @param {Object|string} studentOrName - Student object or student name string.
     **/
    async editNoShowAppointment(studentOrName) {
        const studentName = typeof studentOrName === 'object'
            ? ((studentOrName.firstName && studentOrName.lastName) ? `${studentOrName.lastName}, ${studentOrName.firstName}` : studentOrName.name.replace(" ", ", "))
            : studentOrName;

        await test.step(`Open Edit modal for No Show appointment: "${studentName}"`, async () => {
            const listMenu = this.listMenuOfNoShowAppointment(studentName);
            await this.isVisible(listMenu, { timeout: 2000 }).catch(() => false);
            await this.click(listMenu);

            try {
                await this.waitForVisible(this.editAppointmentLink);
            } catch {
                console.log("edit appointment link was not visible. Re-clicking the list menu...");
                await this.click(listMenu);
                await this.waitForVisible(this.editAppointmentLink);
            }
            await this.click(this.editAppointmentLink);
        });
    }
}