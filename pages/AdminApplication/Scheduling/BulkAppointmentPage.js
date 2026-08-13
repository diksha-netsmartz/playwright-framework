import BasePage from "../../../utils/BasePage";

export default class BulkAppointmentPage extends BasePage {

    constructor(page) {
        super(page);

        // Confirmation
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        // Filter toolbar
        this.filterButton = page.getByRole('button', {name: 'Filter'}).first();
        this.selectStatusDropdown = page.locator('a:has-text("SELECT STATUS")').first();
        this.selectAppointmentCheckbox = page.locator("xpath=(//div[@class='icheckbox_square-grey']//input[contains(@class,'chkBulkApptsSelection')]//following-sibling::ins)[1]");
        // this.selectAppointmentTypeDropdown = page.getByRole('link', {name: 'Select Appointment Type'});

        // Row action links (appear after row is selected)
        this.editAppointmentsLink = page.getByRole('link', {name: 'Edit Appointments'});
        this.deleteAppointmentsLink = page.getByRole('link', {name: 'Delete Appointments'});
        this.cancelAppointmentsLink = page.getByRole('link', {name: 'Cancel Appointments'});
        this.shiftAppointmentsLink = page.getByRole('link', {name: 'Shift Appointments'});

        // Edit modal
        this.notesTextbox = page.locator('#txtApptNotes');
        // this.statusDropdownInEditModal = page.getByRole('button', {name: 'Please Select'}).nth(4);
        // this.confirmedOptionInEditModal = page.locator('#apptbulkedit a').filter({hasText: 'Confirmed'});
        this.updateButton = page.locator("#btnUpdateBulkAppointment");
        // Appears after setting status to Confirmed — separate Yes button
        // this.yesButton = page.getByRole('button', {name: 'Yes'});

        // Delete confirmation (uses a button, not an anchor)
        this.deleteYesButton = page.getByRole('button', {name: 'YES'});

        // Shift modal
        this.byDateRadio = page.getByRole('radio', {name: 'By Date'});
        this.shiftDateInput = page.getByRole('textbox', {name: 'MM-DD-YYYY'});
        this.selectDateInCalendar = page.locator("xpath=(//td[@class='day'])[last()]");
        this.staffAvailabilityToggle = page.locator("xpath=//input[@id='chkShiftBulkStaffAvailability']//preceding-sibling::span[1]")
        this.vehicleAvailabilityToggle = page.locator("xpath=//input[@id='chkShiftBulkVehicleAvailability']//preceding-sibling::span[1]")
        this.continueRegardlessButton = page.getByRole('button', {name: 'Continue regardless of'});
        this.shiftBulkUpdateButton = page.locator("#btnShiftBulkAppointments");

        //calendar
        this.selectDate = page.locator('#txtBulkRange');
        this.currentMonthFirstDay = page.locator("xpath=(//td[contains(@class,'available') and text()='1'])[1]");
        this.nextMonthDay = page.locator("xpath=(//td[contains(@class,'available') and text()='25'])[2]");

        this.cancelYesButton = page.locator("xpath=//button[contains(@onclick,'cancelBulkAppointments') and text()='YES']");
    }

    statusMenuOption(statusType) {
        return this.page.locator('label').filter({hasText: `${statusType}`}).first();
    }

    async waitForLoaders() {
        await this.page.waitForFunction(() =>
            [...document.querySelectorAll('.load-area')].every(
                el => el.style.display === 'none'
            )
        );
    }

    async applyFilter() {
        await this.selectDate.click();
        await this.currentMonthFirstDay.click();
        await this.nextMonthDay.click();
        await this.filterButton.click();
        await this.waitForLoaders();
    }

    // Filter grid by a specific status (e.g. "Confirmed")
    async filterByStatus(statusName) {
        await this.selectStatusDropdown.click();
        await this.statusMenuOption(statusName).click();
        await this.filterButton.click();
        await this.waitForLoaders();
    }

    async selectAppointment() {

        await this.selectAppointmentCheckbox.click();
    }

    async editAppointment() {
        await this.selectAppointment();
        await this.editAppointmentsLink.click();
        await this.notesTextbox.fill("updating appointment");
        await this.updateButton.click();
        await this.yesConfirmationButton.click();
        await this.waitForLoaders();
    }

    // Delete selected appointment
    async deleteAppointment() {
        await this.selectAppointment();
        await this.deleteAppointmentsLink.click();
        await this.deleteYesButton.click();
        await this.waitForLoaders();
    }

    // Cancel a Confirmed appointment
    async cancelAppointment() {
        await this.selectAppointment();
        await this.cancelAppointmentsLink.click();
        await this.cancelYesButton.click();
        await this.waitForLoaders();
    }

    // Shift appointment by date: picks the given day from the calendar picker
    async shiftAppointment() {
        await this.selectAppointment();
        await this.shiftAppointmentsLink.click();
        await this.byDateRadio.check();
        await this.shiftDateInput.click();
        await this.selectDateInCalendar.click();
        await this.staffAvailabilityToggle.click();
        await this.vehicleAvailabilityToggle.click();
        await this.shiftBulkUpdateButton.click();
        await this.yesConfirmationButton.click();
        try {
            await this.continueRegardlessButton.waitFor({state: 'visible', timeout: 5000});
            await this.continueRegardlessButton.click();
            await this.yesConfirmationButton.click();
        } catch {
            // Button not present, continue
        }

        await this.waitForLoaders();
    }

}
