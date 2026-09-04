import { test, expect } from "@playwright/test";
import BasePage from "../../../../utils/BasePage";
import DateHelper from "../../../../utils/DateHelper";
import login from "../../../../test-data/json/login.json";

/**
 * Page Object representing the Open Time Slots Page in Admin Portal (Scheduling > Manage Time Slots > Open Time Slots).
 * Handles creating open time slots with appointment type, staff, dates, location, vehicle, duration, and start time.
 **/
export default class OpenTimeSlotsPage extends BasePage {

    /**
     * Initializes locators for the Open Time Slots page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header / Tab Actions
        this.addNewBtn = page.getByRole('link', { name: 'Add New' });
        this.filterBtn = page.getByRole('button', { name: /filter/i }).or(page.locator("//a[normalize-space()='Filter' or normalize-space()='FILTER']")).first();
        this.selectDateRangeInput = page.locator('#txtOTSRange');
        this.dateRangeInfoIcon = page.locator("a[data-content='Filter appointments by date range.']")
        this.filterInstructorDropdown = page.locator("//select[@id='multiDrpOTS_Filter_SelectInstructor']//ancestor::div[@class='input-group']//button");
        this.filterAppointmentTypeDropdown = page.locator("//select[@id='multiDrpOTS_Filter_SelectAppointmentType']//ancestor::div[@class='input-group']//button");

        // Add Open Time Slots Form Locators
        this.formContainer = page.locator('#frmAddOpenTimeSlots');

        // Dropdowns & Inputs
        this.appointmentTypeDropdown = page.locator("//select[@id='drpOSTSlotType']//parent::div//button");
        this.staffDropdown = page.locator("//select[@id='drp_AOTSInstructor']//parent::div//button");
        this.staffDropdownOption = page.locator("xpath=(//select[@id='drp_AOTSInstructor']//parent::div//div//li//span[1][not(contains(text(),'Please Select'))])[1]");
        this.dateInput = page.locator('#OTSMultiDateSelection');
        this.availableDateCells = page.locator("xpath=(//td[@class='day'])");

        this.locationDropdown = page.locator("//select[@id='drpAOTSLocation']//parent::div//button");
        this.locationDropdownOption = page.locator("xpath=(//select[@id='drpAOTSLocation']//parent::div//div//li//span[1][not(contains(text(),'Please Select'))])[1]");
        this.locationDropdownOptionLast = page.locator("xpath=(//select[@id='drpAOTSLocation']//parent::div//div//li//span[1][not(contains(text(),'Please Select'))])[last()]");
        this.showAllVehiclesCheckbox = page.locator("//input[contains(@id,'chkShowAllVehicles')]//following-sibling::span");
        this.vehicleDropdown = page.locator("//select[@id='drpAOTSVehicle']//parent::div//button");
        this.vehicleDropdownOption = page.locator("xpath=(//select[@id='drpAOTSVehicle']//parent::div//div//li//span[1][not(contains(text(),'Please Select'))])[1]")
        this.vehicleDropdownOptionLast = page.locator("xpath=(//select[@id='drpAOTSVehicle']//parent::div//div//li//span[1][not(contains(text(),'Please Select'))])[last()]");
        this.puLocationInput = page.getByRole('textbox', { name: 'PU Location' });

        this.instruction1Dropdown = page.locator("//select[@id='Instructions1']//parent::div//button");
        this.instruction1DropdownOption = page.locator("xpath=(//select[@id='Instructions1']//parent::div//div//li//span[1][not(contains(text(),'Please Select'))])[1]");

        this.instruction2Dropdown = page.locator("//select[@id='Instructions2']//parent::div//button");
        this.instruction2DropdownOption = page.locator("xpath=(//select[@id='Instructions2']//parent::div//div//li//span[1][not(contains(text(),'Please Select'))])[1]");

        // Optional Service / Instruction radio & dropdowns
        this.specificDatesRadioBtn = page.locator("xpath=//input[@id='rdbtnSpecificDates']//following-sibling::span");
        this.dateInputbox = page.locator('#OTSMultiDateSelection');
        this.calendarDate = page.locator("xpath=(//td[contains(@class,'day') and text()='1'])[1]");
        this.showInStudentCenterYesRadioButton = page.locator("xpath=//label[contains(text(),'Show In Student Center')]//parent::div//input[@value='1']//following-sibling::span");
        this.showInStudentCenterNoRadioButton = page.locator("xpath=//label[contains(text(),'Show In Student Center')]//parent::div//input[@value='0']//following-sibling::span");



        // Duration Tab & Controls
        this.commonDurationTab = page.getByRole('link', { name: 'Common Duration' });
        this.slotsPerDayDropdown = page.locator("button[data-id='drpOTSFixedDuration_NoOfSlotsPerDay']")
        this.slotPerDayDropdownOption = page.locator("xpath=//select[@id='drpOTSFixedDuration_NoOfSlotsPerDay']//parent::div//div//li//span[text()='2']")
        this.durationMinutesDropdown = page.locator("button[data-id='drpOTSSlotsDuration']")
        this.durationMinutesOption = page.locator("xpath=(//select[@id='drpOTSSlotsDuration']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]")
        this.startTimeDropdown = page.locator("button[data-id='OTSFixedStartTime1']");
        this.startTimeDropdownOption = page.locator("xpath=//select[@id='OTSFixedStartTime1']//parent::div//div//li//span[text()='6:00 AM']");
        this.startTimeDropdown2 = page.locator("button[data-id='OTSFixedStartTime2']");
        this.startTimeDropdownOption2 = page.locator("xpath=//select[@id='OTSFixedStartTime2']//parent::div//div//li//span[text()='6:15 AM']");


        // Action Buttons
        this.createEmptyTimeSlotsBtn = page.locator('#createOpenSlot').getByText('Create Empty Time Slots');
        this.updateAppointmentButton = page.locator("//a[normalize-space()='Update Appointment']");
        this.yesConfirmationBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");


        // Confirmation Modals
        this.successModalHeading = page.getByRole('heading', { name: 'Appointment created' });
        this.updateSuccessModalHeading = page.getByRole('heading', { name: 'Appointment updated' });
        this.closeSuccessModalBtn = page.getByRole('button', { name: 'Close' });
        this.editLink = page.getByTitle('Edit').first();
        this.openTimeSlotsTable = page.locator('#tblOTSAppointmentList');
        this.searchTextbox = page.locator("input[type='search']").first();
        this.deleteIcon = page.locator("xpath=(//a[contains(@data-toggle,'DeleteOpenTimeslot')])[1]");
        this.allDeleteIcons = page.locator("xpath=//a[contains(@data-toggle,'DeleteOpenTimeslot')]");
        this.appointmentDeletedMsg = page.getByText('Appointment deleted successfully', { exact: false });
        this.pageLengthSelect = page.locator("select[name='tblOTSAppointmentList_length']");
    }

    /**
     * Clicks the 'Add New' button under the Open Time Slots tab.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button under Open Time Slots', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Helper to select an option in a Bootstrap Multiselect dropdown.
     * Does NOT click or toggle if the option is already selected.
     * @param {import('@playwright/test').Locator} dropdownBtn
     * @param {string} selectId - ID of underlying select element (e.g. 'multiDrpOTS_Filter_SelectInstructor')
     * @param {string} optionText - Title or text of the option to select
     **/
    async selectMultiselectOption(dropdownBtn, selectId, optionText) {
        if (!optionText) return;
        await test.step(`Select multiselect option "${optionText}" in #${selectId}`, async () => {
            await this.waitForVisible(dropdownBtn);

            // 1. Fast check: If the button already displays the option text or title, it's already selected
            const btnText = (await dropdownBtn.innerText().catch(() => '')).trim();
            const btnTitle = (await dropdownBtn.getAttribute('title').catch(() => '')).trim();
            const cleanOption = optionText.trim().toLowerCase();

            if (btnText.toLowerCase().includes(cleanOption) || btnTitle.toLowerCase().includes(cleanOption)) {
                console.log(`[OpenTimeSlotsPage] Option "${optionText}" is already selected on button #${selectId} ("${btnText || btnTitle}"). Skipping.`);
                return;
            }

            // 2. Open the dropdown
            await this.click(dropdownBtn);
            await this.page.waitForTimeout(300);

            // 3. Locate the target li item inside the multiselect container
            const targetLi = this.page.locator(
                `xpath=//select[@id='${selectId}']//ancestor::div[contains(@class,'input-group')]//li[.//label[contains(@title,'${optionText}') or contains(.,'${optionText}')]]`
            ).first();

            const isLiVisible = await targetLi.isVisible({ timeout: 3000 }).catch(() => false);
            if (isLiVisible) {
                // Check if already active or checkbox is checked
                const isActive = await targetLi.evaluate(el => el.classList.contains('active')).catch(() => false);
                const checkbox = targetLi.locator('input[type="checkbox"]').first();
                const isChecked = await checkbox.isChecked().catch(() => false);

                if (isActive || isChecked) {
                    console.log(`[OpenTimeSlotsPage] Multiselect option "${optionText}" under #${selectId} is already active/checked. Skipping click.`);
                } else {
                    const label = targetLi.locator('label').first();
                    await this.click(label);
                    console.log(`[OpenTimeSlotsPage] Selected multiselect option: "${optionText}" under #${selectId}`);
                    await this.page.waitForTimeout(200);
                }
            } else {
                console.warn(`[OpenTimeSlotsPage] Multiselect option "${optionText}" under #${selectId} not found in dropdown list.`);
            }

            // 4. Close dropdown
            await this.click(dropdownBtn);
            await this.page.waitForTimeout(200);
        });
    }

    /**
     * Applies filter with Current Month date range (#txtOTSRange), Instructor, and Appointment Type.
     * @param {Object} [options={}]
     * @param {string} [options.instructorName] - Instructor name or username.
     * @param {string} [options.appointmentType] - Appointment type name.
     * @returns {Promise<{ formattedRange: string, instructor: string, appointmentType: string }>}
     **/
    async applyFilterWithCurrentMonth(options = {}) {
        return await test.step('Apply filter with Current Month, Instructor, and Appointment Type', async () => {
            const currentMonthRange = DateHelper.getCurrentMonthFormattedRange();

            await this.waitForLoaders();
            await this.page.waitForLoadState('load');

            // 1. Enter current month range into #txtOTSRange
            await this.waitForVisible(this.selectDateRangeInput);
            await this.clear(this.selectDateRangeInput);
            await this.pressSequentially(this.selectDateRangeInput, currentMonthRange);
            if (await this.isVisible(this.dateRangeInfoIcon, { timeout: 2000 }).catch(() => false)) {
                await this.click(this.dateRangeInfoIcon);
            }
            await this.page.waitForTimeout(300);

            // 2. Select Instructor from login credentials
            const targetInstructor = options.instructorName || 'instructor6';
            await this.selectMultiselectOption(this.filterInstructorDropdown, 'multiDrpOTS_Filter_SelectInstructor', targetInstructor);

            // 3. Select Appointment Type
            const targetApptType = options.appointmentType || 'Combined Appointment (Driver and Observer)';
            await this.selectMultiselectOption(this.filterAppointmentTypeDropdown, 'multiDrpOTS_Filter_SelectAppointmentType', targetApptType);

            // 4. Click FILTER button
            await this.clickFilter();

            // 5. Select 100 rows per page to view all records across the month
            await this.selectPageLength('100');

            // 6. Capture occupied days from table
            this.occupiedDays = await this.getOccupiedDaysFromTable();

            return { formattedRange: currentMonthRange, instructor: targetInstructor, appointmentType: targetApptType };
        });
    }

    /**
     * Selects the number of rows to display in the Open Time Slots table (e.g. 100).
     * @param {string|number} [length='100'] - Number of rows to display.
     **/
    async selectPageLength(length = '100') {
        await test.step(`Select table row display length as ${length}`, async () => {
            const selectLocator = this.pageLengthSelect.or(this.page.locator("select[name='tblOTSAppointmentList_length']")).first();
            try {
                await selectLocator.waitFor({ state: 'attached', timeout: 5000 }).catch(() => null);
                if (await selectLocator.count() > 0) {
                    await selectLocator.selectOption(String(length), { force: true }).catch(() => null);
                }

                // Also trigger jQuery / DataTables API to ensure the table re-renders with 100 rows
                await this.page.evaluate((len) => {
                    const sel = /** @type {HTMLSelectElement|null} */ (document.querySelector("select[name='tblOTSAppointmentList_length']"));
                    if (sel) {
                        sel.value = String(len);
                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    const $ = /** @type {any} */ (window)['$'];
                    if ($) {
                        const $sel = $('select[name="tblOTSAppointmentList_length"]');
                        if ($sel && $sel.length) {
                            $sel.val(String(len)).trigger('change');
                        }
                        if ($.fn && $.fn.dataTable && $.fn.dataTable.isDataTable('#tblOTSAppointmentList')) {
                            $('#tblOTSAppointmentList').DataTable().page.len(Number(len)).draw();
                        }
                    }
                }, length).catch(() => null);

                await this.waitForLoaders();
                await this.page.waitForLoadState('load');
                await this.page.waitForTimeout(1000);
                console.log(`[OpenTimeSlotsPage] Selected table row count: ${length}`);
            } catch (err) {
                console.warn(`[OpenTimeSlotsPage] Warning setting row length to ${length}:`, err.message);
            }
        });
    }

    /**
     * Filters the Open Time Slots table by Current Month in #txtOTSRange and by Instructor from login credentials.
     * @param {string} [instructorName] - Optional instructor name/username to filter by.
     * @param {string} [appointmentType] - Optional appointment type.
     * @returns {Promise<{ formattedRange: string, instructor: string, appointmentType: string }>}
     */
    async filterByCurrentMonthAndInstructor(instructorName, appointmentType) {
        return await this.applyFilterWithCurrentMonth({ instructorName, appointmentType });
    }

    /**
     * Scans the Open Time Slots table (#tblOTSAppointmentList) and extracts occupied day numbers for the current month.
     * @param {Date} [baseDate=new Date()]
     * @returns {Promise<Set<number>>}
     */
    async getOccupiedDaysFromTable(baseDate = new Date()) {
        const occupiedDays = new Set();
        const occupiedEntries = [];
        try {
            const table = this.openTimeSlotsTable;
            if (!await this.isVisible(table, { timeout: 2000 }).catch(() => false)) {
                return occupiedDays;
            }

            const targetYear = baseDate.getFullYear();
            const targetMonth = baseDate.getMonth();

            const rows = table.locator('tbody tr');
            const rowCount = await rows.count();

            for (let i = 0; i < rowCount; i++) {
                const firstCell = rows.nth(i).locator('td').first();
                if (!await firstCell.isVisible({ timeout: 2000 }).catch(() => false)) continue;

                const text = (await firstCell.innerText()).trim();
                // Match dates like "9/1/2026 6:00 AM-6:30 AM" or "09/01/2026"
                const dateMatch = text.match(/^(\d{1,2}\/\d{1,2}\/\d{4})/);
                if (dateMatch) {
                    const parsedDate = new Date(dateMatch[1]);
                    if (!isNaN(parsedDate.getTime())) {
                        if (parsedDate.getFullYear() === targetYear && parsedDate.getMonth() === targetMonth) {
                            occupiedDays.add(parsedDate.getDate());
                            occupiedEntries.push({ dateStr: dateMatch[1], raw: text, day: parsedDate.getDate() });
                        }
                    }
                }
            }

            const monthName = baseDate.toLocaleString('default', { month: 'short' });
            if (occupiedDays.size > 0) {
                console.log(`[OpenTimeSlotsPage] Found ${occupiedEntries.length} occupied slot(s) across ${occupiedDays.size} day(s) in ${monthName} ${targetYear}:`);
                occupiedEntries.forEach((entry, idx) => {
                    console.log(`  [${idx + 1}] Day ${entry.day}: ${entry.raw}`);
                });
                console.log(`[OpenTimeSlotsPage] Occupied day(s) in ${monthName} ${targetYear}: [${Array.from(occupiedDays).sort((a, b) => a - b).join(', ')}]`);
            } else {
                console.log(`[OpenTimeSlotsPage] No occupied days found in ${monthName} ${targetYear} from table.`);
            }
        } catch (e) {
            console.warn('[OpenTimeSlotsPage] Warning while reading occupied days from table:', e.message);
        }
        return occupiedDays;
    }

    /**
     * Selects 2 consecutive unoccupied dates in the Add Open Time Slots calendar picker.
     * Ensures neither date is occupied in the table.
     * @param {Set<number>} [occupiedDays]
     * @returns {Promise<{ startDay: number, endDay: number, formattedRange: string }>}
     */
    async selectUnoccupiedConsecutiveDates(occupiedDays) {
        return await test.step('Select 2 consecutive unoccupied dates in calendar picker', async () => {
            const activeDate = new Date();
            const occupied = occupiedDays || this.occupiedDays || await this.getOccupiedDaysFromTable(activeDate);

            // Find 2 consecutive available dates in the current month
            const dates = DateHelper.getStandardAvailableDateRange(occupied, activeDate);

            let startDay;
            let endDay;

            if (dates) {
                startDay = dates.startDay;
                endDay = dates.endDay;
                console.log(`[OpenTimeSlotsPage] Selected 2 consecutive unoccupied dates: ${dates.formattedRange} (days ${startDay} & ${endDay})`);
            } else {
                console.warn('[OpenTimeSlotsPage] No consecutive dates available in current month. Falling back to days 15 & 16.');
                startDay = 15;
                endDay = 16;
            }

            await this.waitForVisible(this.specificDatesRadioBtn);
            await this.click(this.specificDatesRadioBtn);

            await this.waitForVisible(this.dateInputbox);
            await this.click(this.dateInputbox);
            await this.page.waitForTimeout(500);

            // Select 1st day in calendar
            const startCell = this.page.locator(`xpath=(//td[contains(@class,'day') and not(contains(@class,'off')) and not(contains(@class,'old')) and normalize-space()='${startDay}'])[1]`);
            if (await this.isVisible(startCell, { timeout: 500 }).catch(() => false)) {
                await this.click(startCell);
            } else {
                await this.click(this.availableDateCells.first());
            }

            // Select 2nd consecutive day in calendar
            const endCell = this.page.locator(`xpath=(//td[contains(@class,'day') and not(contains(@class,'off')) and not(contains(@class,'old')) and normalize-space()='${endDay}'])[1]`);
            if (!await this.isVisible(endCell, { timeout: 2000 }).catch(() => false)) {
                await this.click(this.dateInputbox);
            }
            if (await this.isVisible(endCell, { timeout: 2000 }).catch(() => false)) {
                await this.click(endCell);
            }

            await this.waitForLoaders();
            this.selectedDates = { startDay, endDay, formattedRange: dates ? dates.formattedRange : '' };
            return this.selectedDates;
        });
    }

    /**
     * Fills all required fields in the Add Open Time Slots popup.
     * Selects instructor from login credentials and 2 consecutive unoccupied dates.
     * @param {Object} data - Test data object containing open time slot details.
     * @param {Object|string} [options={}] - Options object or instructor name string.
     * @returns {Promise<string>} The generated PU Location value.
     **/
    async fillOpenTimeSlotDetails(data, options = {}) {
        return await test.step('Fill required fields in Add Open Time Slots popup', async () => {
            this.puLocation = `${data.puLocation} ${Date.now()}`;
            await this.waitForLoaders();

            // 1. Select Appointment Type
            await this.waitForVisible(this.appointmentTypeDropdown);
            await this.click(this.appointmentTypeDropdown);
            const apptTypeOption = this.page.locator(`//select[@id='drpOSTSlotType']//parent::div//ul//li//span[normalize-space()="${data.appointmentType}"]`).first();
            await this.waitForVisible(apptTypeOption);
            await this.click(apptTypeOption);
            await this.waitForLoaders();

            // 2. Select Staff / Instructor from login creds
            await this.waitForVisible(this.staffDropdown);
            await this.click(this.staffDropdown);

            const targetInstructor = (typeof options === 'string' ? options : options.instructorName)
                || login[process.env.ENV || 'coreServer2']?.staffUser?.username
                || data.staff;

            const staffOption = this.page.locator("//select[@id='drp_AOTSInstructor']//parent::div//ul//li//span")
                .filter({ hasText: new RegExp(targetInstructor, 'i') }).first();

            if (await this.isVisible(staffOption, { timeout: 2000 }).catch(() => false)) {
                await this.click(staffOption);
                console.log(`[OpenTimeSlotsPage] Selected staff in popup: "${targetInstructor}"`);
            } else {
                await this.click(this.staffDropdownOption);
            }
            await this.waitForLoaders();

            // 4. Select 2 consecutive unoccupied dates in DatePicker
            const occupied = (typeof options === 'object' && options.occupiedDays) ? options.occupiedDays : this.occupiedDays;
            await this.selectUnoccupiedConsecutiveDates(occupied);

            await this.setCommonDuration();

            // 5. Select Location
            await this.waitForVisible(this.locationDropdown);
            await this.click(this.locationDropdown);
            await this.waitForVisible(this.locationDropdownOption);
            await this.click(this.locationDropdownOption);
            await this.waitForLoaders();

            // 6. Select Vehicle
            await this.waitForVisible(this.showAllVehiclesCheckbox);
            await this.click(this.showAllVehiclesCheckbox);
            await this.waitForVisible(this.vehicleDropdown);
            await this.click(this.vehicleDropdown);
            await this.waitForVisible(this.vehicleDropdownOption);
            await this.click(this.vehicleDropdownOption);
            await this.waitForLoaders();

            // 7. Fill PU Location
            await this.fill(this.puLocationInput, this.puLocation);

            await this.waitForVisible(this.instruction1Dropdown);
            await this.click(this.instruction1Dropdown);
            await this.waitForVisible(this.instruction1DropdownOption);
            await this.click(this.instruction1DropdownOption);
            await this.waitForLoaders();

            await this.waitForVisible(this.instruction2Dropdown);
            await this.click(this.instruction2Dropdown);
            await this.waitForVisible(this.instruction2DropdownOption);
            await this.click(this.instruction2DropdownOption);
            await this.waitForLoaders();

            await this.click(this.showInStudentCenterYesRadioButton);
            return this.puLocation;
        });
    }

    /**
     * Sets the duration of the slot under Common Duration.
     **/
    async setCommonDuration() {
        await test.step('Set duration of slot under COMMON DURATION', async () => {
            await this.waitForVisible(this.commonDurationTab);
            await this.click(this.commonDurationTab);
            await this.waitForLoaders();

            // Select Duration Hours (e.g. 1)
            await this.waitForVisible(this.slotsPerDayDropdown);
            await this.click(this.slotsPerDayDropdown);
            await this.waitForVisible(this.slotPerDayDropdownOption);
            await this.click(this.slotPerDayDropdownOption);
            await this.waitForLoaders();

            await this.waitForVisible(this.durationMinutesDropdown);
            await this.click(this.durationMinutesDropdown);
            await this.waitForVisible(this.durationMinutesOption);
            await this.click(this.durationMinutesOption);
            await this.waitForLoaders();

            await this.waitForVisible(this.startTimeDropdown);
            await this.click(this.startTimeDropdown);
            await this.waitForVisible(this.startTimeDropdownOption);
            await this.click(this.startTimeDropdownOption);
            await this.waitForLoaders();

            await this.waitForVisible(this.startTimeDropdown2);
            await this.click(this.startTimeDropdown2);
            await this.waitForVisible(this.startTimeDropdownOption2);
            await this.click(this.startTimeDropdownOption2);
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks on the 'CREATE EMPTY TIME SLOTS' button and confirms the action.
     **/
    async clickCreateEmptyTimeSlots() {
        await test.step('Click on CREATE EMPTY TIME SLOTS button and confirm', async () => {
            await this.waitForVisible(this.createEmptyTimeSlotsBtn);
            await this.click(this.createEmptyTimeSlotsBtn);

            // Click Yes on confirmation modal
            await this.waitForVisible(this.yesConfirmationBtn);
            await this.click(this.yesConfirmationBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load')
        });
    }

    /**
     * Verifies that the open time slots appointments are created successfully.
     **/
    async verifyOpenTimeSlotsCreatedSuccessfully() {
        await test.step('Verify Open Time slots appointments created successfully', async () => {
            await this.waitForVisible(this.successModalHeading);
            await expect(this.successModalHeading).toBeVisible();
            await expect(this.successModalHeading).toContainText('Appointment created');
        });
    }

    /**
     * Inputs date range for the current month (e.g. 09/01/2026 - 09/30/2026) in Select Date field (#txtOTSRange).
     **/
    async selectDateRangeCurrentMonth() {
        await test.step('Select date range: Current month in #txtOTSRange', async () => {
            const formattedRange = DateHelper.getCurrentMonthFormattedRange();
            await this.waitForLoaders();
            await this.waitForVisible(this.selectDateRangeInput);
            await this.clear(this.selectDateRangeInput);
            await this.pressSequentially(this.selectDateRangeInput, formattedRange);
            if (await this.isVisible(this.dateRangeInfoIcon, { timeout: 2000 }).catch(() => false)) {
                await this.click(this.dateRangeInfoIcon);
            }
            await this.page.waitForTimeout(500);
            await this.waitForLoaders();
        });
    }

    /**
     * Inputs date range from 1st of previous month to the last date of current month in Select Date field.
     **/
    async selectDateRangePrevMonthFirstToThisMonthLast() {
        await test.step('Select date range: Previous month 1st to Current month last date', async () => {
            const dateRange = DateHelper.getPrevMonthToCurrentMonthRange().formattedRange;
            await this.waitForLoaders();
            await this.waitForVisible(this.selectDateRangeInput);
            await this.clear(this.selectDateRangeInput)
            await this.pressSequentially(this.selectDateRangeInput, dateRange);
            await this.click(this.dateRangeInfoIcon);
            await this.page.waitForTimeout(500);
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks on the 'FILTER' button under Open Time Slots tab.
     **/
    async clickFilter() {
        await test.step('Click on FILTER button under Open Time Slots tab', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.filterBtn);
            await this.click(this.filterBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
            await this.page.waitForTimeout(1500);
        });
    }

    /**
     * Clicks on the Edit icon under Action column for an Open Time Slot.
     **/
    async editOpenSlot() {
        await test.step('Click on Edit icon under Action column', async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);
            await this.waitForVisible(this.editLink);
            await this.verifyVisible(this.openTimeSlotsTable);
            await this.click(this.editLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load')
        });
    }

    /**
 * Searches for the created Lead Source in the data table and clicks Edit.
 **/
    async searchOpenSlot(puLocation) {
        await test.step(`Search open slot with PU Location: "${puLocation}"`, async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();
            await this.page.locator('.modal.in, .modal-backdrop').waitFor({ state: 'hidden', timeout: 5000 }).catch(() => null);
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, puLocation);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);
            await this.verifyContainsText(this.openTimeSlotsTable, puLocation);
        });
    }

    /**
     * Updates the PU Location field with dynamic timestamp value in Edit Open Time Slot popup.
     * @param {Object} [data={}] - Test data object containing open time slot details.
     * @returns {Promise<string>} The updated PU Location value.
     **/
    async editOpenTimeSlotDetails(data = {}) {
        return await test.step('Update fields in Update Open Time Slot popup', async () => {
            await this.waitForLoaders();

            this.updatedPuLocation = `${(data && data.puLocation) || 'PU Location'} ${Date.now()}`;
            // if (await this.puLocationInput.isVisible({ timeout: 5000 }).catch(() => false)) {
            //     await this.fill(this.puLocationInput, this.updatedPuLocation);
            // }

            await this.waitForVisible(this.locationDropdown);
            await this.click(this.locationDropdown);
            await this.waitForVisible(this.locationDropdownOptionLast);
            await this.click(this.locationDropdownOptionLast);
            await this.waitForLoaders();

            await this.waitForVisible(this.vehicleDropdown);
            await this.click(this.vehicleDropdown);
            await this.waitForVisible(this.vehicleDropdownOptionLast);
            await this.click(this.vehicleDropdownOptionLast);

            if (await this.showInStudentCenterNoRadioButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await this.click(this.showInStudentCenterNoRadioButton);
            }
            await this.waitForLoaders();
            return this.updatedPuLocation;
        });
    }

    /**
     * Clicks on the 'UPDATE APPOINTMENT' button and confirms the action.
     **/
    async clickUpdateAppointment() {
        await test.step('Click on UPDATE APPOINTMENT button and confirm', async () => {
            await this.waitForVisible(this.updateAppointmentButton);
            await this.click(this.updateAppointmentButton);

            // Click Yes on confirmation modal
            await this.waitForVisible(this.yesConfirmationBtn);
            await this.click(this.yesConfirmationBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load')
        });
    }

    /**
     * Verifies that the open time slots appointments are updated successfully.
     **/
    async verifyOpenTimeSlotsUpdatedSuccessfully() {
        await test.step('Verify Open Time slots appointments updated successfully', async () => {
            await this.waitForVisible(this.updateSuccessModalHeading);
            await expect(this.updateSuccessModalHeading).toBeVisible();
            await expect(this.updateSuccessModalHeading).toContainText('Appointment updated');
        });
    }

    /**
     * Closes the success confirmation modal if displayed.
     **/
    async closeSuccessModal() {
        await test.step('Close success modal', async () => {
            if (await this.closeSuccessModalBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
                await this.click(this.closeSuccessModalBtn);
                await this.waitForHidden(this.closeSuccessModalBtn);
                await this.waitForLoaders();
                await this.page.waitForLoadState('load');
                await this.page.waitForTimeout(3000);
                // await this.page.reload();

            }
        });
    }

    /**
     * Deletes all matching open time slots from the table.
     * Re-searches the table after each deletion because the table/search box refreshes upon delete.
     * @param {string} [puLocation] - Optional PU Location string to search and delete.
     **/
    async deleteOpenSlot(puLocation) {
        await test.step('Delete all open time slots matching PU Location from the table', async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();

            const targetPuLocation = puLocation;
            let deletedCount = 0;
            const maxDeletions = 150;

            while (deletedCount < maxDeletions) {
                // Re-apply search on each iteration because deleting an appointment refreshes the table search
                if (targetPuLocation) {
                    await this.waitForVisible(this.searchTextbox);
                    await this.clear(this.searchTextbox);
                    await this.fill(this.searchTextbox, targetPuLocation);
                    await this.waitForLoaders();
                    await this.page.waitForTimeout(1000);
                }

                // Check if any delete icon exists in the filtered table
                const isDeleteVisible = await this.allDeleteIcons.first().isVisible({ timeout: 3000 }).catch(() => false);
                if (!isDeleteVisible) {
                    break;
                }

                deletedCount++;
                console.log(`[OpenTimeSlotsPage] Deleting open time slot entry #${deletedCount} for "${targetPuLocation}"...`);

                await this.click(this.allDeleteIcons.first());
                await this.waitForVisible(this.yesConfirmationBtn);
                await this.click(this.yesConfirmationBtn);
                await this.waitForLoaders();
                await this.page.waitForLoadState('load');
                await this.page.waitForTimeout(1500);
            }

            console.log(`[OpenTimeSlotsPage] Successfully deleted ${deletedCount} open time slot entries for "${targetPuLocation}".`);
        });
    }

    /**
     * Verifies that all matching open time slot appointments are deleted successfully.
     * @param {string} [puLocation]
     **/
    async verifyOpenTimeSlotsDeletedSuccessfully(puLocation) {
        await test.step('Verify open time slots deleted successfully', async () => {
            const targetPuLocation = puLocation || this.updatedPuLocation || this.puLocation;
            if (targetPuLocation) {
                await this.waitForVisible(this.searchTextbox);
                await this.clear(this.searchTextbox);
                await this.fill(this.searchTextbox, targetPuLocation);
                await this.waitForLoaders();
                await this.page.waitForTimeout(1000);

                const noRecordsMsg = this.page.getByText('No matching records found', { exact: false })
                    .or(this.page.getByText('No data available in table', { exact: false }));
                const hasNoRecords = await noRecordsMsg.isVisible({ timeout: 3000 }).catch(() => false);
                const count = await this.allDeleteIcons.count();

                expect(count === 0 || hasNoRecords).toBeTruthy();
                console.log(`[OpenTimeSlotsPage] Verified: 0 matching records found for "${targetPuLocation}".`);
            } else {
                const isBannerVisible = await this.appointmentDeletedMsg.isVisible({ timeout: 3000 }).catch(() => false);
                if (isBannerVisible) {
                    await expect(this.appointmentDeletedMsg).toBeVisible();
                } else {
                    const remaining = await this.allDeleteIcons.count();
                    expect(remaining).toBe(0);
                }
            }
        });
    }

}
