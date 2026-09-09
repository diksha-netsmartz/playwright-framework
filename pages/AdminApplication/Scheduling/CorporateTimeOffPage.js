import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';
import DateHelper from '../../../utils/DateHelper';

/**
 * Page Object representing the Corporate Time Off page in Admin Portal (Scheduling > Corporate Time Off).
 * Handles adding new corporate time off records with dynamic naming, editing existing records,
 * searching the data table, and verifying success notifications.
 *
 * Common patterns aligned with FeesPage / HighSchoolsPage:
 *  - bootstrap-select dropdowns via parent div > button
 *  - yesConfirmationButton: //a[@data-apply='confirmation' and text()='Yes']
 **/
export default class CorporateTimeOffPage extends BasePage {

    /**
     * Initializes locators for the Corporate Time Off page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.getByRole('link', { name: 'Add New' }).first();

        // Add / Edit Form Locators
        this.nameInput = page.getByRole('textbox', { name: 'Name' });
        this.codeInput = page.getByRole('textbox', { name: 'Code' });
        this.noteInput = page.getByRole('textbox', { name: 'Note' });
        this.affectedDatesInput = page.getByRole('textbox', { name: 'Affected Date(s)' });

        // Daterangepicker calendar day cells (Bootstrap daterangepicker pattern)
        this.calendarDate = page.locator("xpath=(//td[contains(@class,'day') and text()='1'])[1]");

        // Status bootstrap-select (button text = 'Select Status' on open)
        this.statusDropdownBtn = page.locator("//button[@data-id='corpTimeoffstatus']");
        this.statusActiveOption = page.locator('a').filter({ hasText: 'Active' });
        this.statusDeletedOption = page.locator('a').filter({ hasText: 'Deleted' });

        // Time Off Type bootstrap-select (button text = 'Select Status' — second dropdown)
        this.timeOffTypeDropdownBtn = page.locator("//button[@data-id='corpTimeoffType']");
        this.timeOffTypeFederalHolidayOption = page.locator('a').filter({ hasText: 'Federal Holiday' });
        this.timeOffTypeReligiousHolidayOption = page.locator('a').filter({ hasText: 'Religious Holiday' });

        // Apply To All Teaching Staff — radio button (2nd option: All)
        this.applyToAllRadio = page.locator("//label[normalize-space()='Yes']//input[@name='applyToAllTeachingStaff']//following-sibling::span");
        this.applyToAllNoRadio = page.locator("//label[normalize-space()='No']//input[@name='applyToAllTeachingStaff']//following-sibling::span")
        this.allDayRadio = page.locator("//label[normalize-space()='Yes']//input[@name='clsAllDay']//following-sibling::span");
        this.selectedStaffOption = page.locator("(//div[@class='ms-selection']//li[contains(@class,'selected')]//span)[1]");
        this.selectionStaffOption = page.locator("(//div[@class='ms-selectable']//li[contains(@class,'selectable')]//span)[1]");

        // Modal Save / Close buttons
        this.saveBtn = page.locator("#btnSave");
        this.closeBtn = page.locator("#btnClose");


        // DataTable search & edit
        this.searchTextbox = page.locator("xpath=//div[@id='corporateTimeoffListtable_filter']//input[@type='search']");
        this.editLink = page.getByTitle('Edit');
        this.corporateTimeOffTable = page.locator('#corporateTimeoffListtable, table.table');
        this.pageLengthSelect = page.locator("#corporateTimeoffListtable_length select, select[name='corporateTimeoffListtable_length']");

        this.occupiedDays = new Set();
        this.selectedDates = null;
    }

    /**
     * Selects the number of rows to display in the Corporate Time Off table (e.g. 100).
     * @param {string|number} [length='100'] - Number of rows to display.
     **/
    async selectPageLength(length = '100') {
        await test.step(`Select table row display length as ${length}`, async () => {
            const selectLocator = this.pageLengthSelect.or(this.page.locator("select[name='corporateTimeoffListtable_length']")).first();
            try {
                await selectLocator.waitFor({ state: 'attached', timeout: 5000 }).catch(() => null);
                if (await selectLocator.count() > 0) {
                    await selectLocator.selectOption(String(length), { force: true }).catch(() => null);
                }

                // Also trigger jQuery / DataTables API to ensure the table re-renders with 100 rows
                await this.page.evaluate((len) => {
                    const win = /** @type {any} */ (window);
                    /** @type {HTMLSelectElement|null} */
                    const sel = document.querySelector("select[name='corporateTimeoffListtable_length']");
                    if (sel) {
                        sel.value = String(len);
                        sel.dispatchEvent(new Event('change', { bubbles: true }));
                    }
                    if (win.$) {
                        const $sel = win.$('select[name="corporateTimeoffListtable_length"]');
                        if ($sel.length) {
                            $sel.val(String(len)).trigger('change');
                        }
                        if (win.$.fn.dataTable && win.$.fn.dataTable.isDataTable('#corporateTimeoffListtable')) {
                            win.$('#corporateTimeoffListtable').DataTable().page.len(Number(len)).draw();
                        }
                    }
                }, length).catch(() => null);

                await this.waitForLoaders();
                await this.page.waitForLoadState('load');
                await this.page.waitForTimeout(1000);
                console.log(`[CorporateTimeOffPage] Selected table row count: ${length}`);
            } catch (err) {
                const message = err instanceof Error ? err.message : String(err);
                console.warn(`[CorporateTimeOffPage] Warning setting row length to ${length}:`, message);
            }
        });
    }

    /**
     * Scans the Corporate Time Off table (#corporateTimeoffListtable) and extracts occupied day numbers for the target month.
     * @param {Date} [baseDate=new Date()]
     * @returns {Promise<Set<number>>}
     */
    async getOccupiedDaysFromTable(baseDate = new Date()) {
        const occupiedDays = new Set();
        const occupiedEntries = [];
        try {
            await this.waitForLoaders();
            const table = this.corporateTimeOffTable.first();
            if (!await this.isVisible(table, { timeout: 5000 }).catch(() => false)) {
                return occupiedDays;
            }

            const targetYear = baseDate.getFullYear();
            const targetMonth = baseDate.getMonth();

            // Determine column indexes dynamically from the thead if available
            const headers = await table.locator('thead th').allInnerTexts().catch(() => []);
            let startDateColIndex = headers.findIndex(h => h.trim().toLowerCase().includes('start date'));
            let endDateColIndex = headers.findIndex(h => h.trim().toLowerCase().includes('end date'));
            let statusColIndex = headers.findIndex(h => h.trim().toLowerCase().includes('status'));

            if (startDateColIndex === -1) startDateColIndex = 3;
            if (endDateColIndex === -1) endDateColIndex = 4;

            const rows = table.locator('tbody tr');
            const rowCount = await rows.count();

            for (let i = 0; i < rowCount; i++) {
                const row = rows.nth(i);
                const cells = row.locator('td');
                const cellCount = await cells.count();
                if (cellCount <= Math.max(startDateColIndex, endDateColIndex)) continue;

                // Skip Deleted rows
                if (statusColIndex !== -1 && statusColIndex < cellCount) {
                    const statusText = (await cells.nth(statusColIndex).innerText()).trim().toUpperCase();
                    if (statusText.includes('DELETED')) {
                        continue;
                    }
                }

                const nameText = (await cells.nth(1).innerText()).trim();
                const startDateText = (await cells.nth(startDateColIndex).innerText()).trim();
                const endDateText = (await cells.nth(endDateColIndex).innerText()).trim();

                const startDate = new Date(startDateText);
                const endDate = endDateText ? new Date(endDateText) : startDate;

                if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
                    const rowDays = [];
                    const cur = new Date(startDate);
                    while (cur <= endDate) {
                        if (cur.getFullYear() === targetYear && cur.getMonth() === targetMonth) {
                            const dayNum = cur.getDate();
                            occupiedDays.add(dayNum);
                            rowDays.push(dayNum);
                        }
                        cur.setDate(cur.getDate() + 1);
                    }
                    if (rowDays.length > 0) {
                        occupiedEntries.push({ name: nameText, range: `${startDateText} - ${endDateText}`, days: rowDays });
                        console.log(`[CorporateTimeOffPage] Record "${nameText}" (${startDateText} to ${endDateText}) occupies ${rowDays.length} day(s): [${rowDays.join(', ')}]`);
                    }
                }
            }

            const monthName = baseDate.toLocaleString('default', { month: 'short' });
            if (occupiedDays.size > 0) {
                console.log(`[CorporateTimeOffPage] Total occupied day(s) in ${monthName} ${targetYear} across all records: [${Array.from(occupiedDays).sort((a, b) => a - b).join(', ')}]`);
            } else {
                console.log(`[CorporateTimeOffPage] No occupied days found in ${monthName} ${targetYear} from Corporate Time Off table.`);
            }
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            console.warn('[CorporateTimeOffPage] Warning while reading occupied days from table:', message);
        }
        this.occupiedDays = occupiedDays;
        return occupiedDays;
    }

    /**
     * Selects 2 consecutive unoccupied dates in the Affected Date(s) calendar picker.
     * Ensures neither date is occupied in the Corporate Time Off table.
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
                console.log(`[CorporateTimeOffPage] Selected 2 consecutive unoccupied dates: ${dates.formattedRange} (days ${startDay} & ${endDay})`);
            } else {
                console.warn('[CorporateTimeOffPage] No consecutive dates available in current month. Falling back to days 15 & 16.');
                startDay = 15;
                endDay = 16;
            }

            await this.waitForVisible(this.affectedDatesInput);
            await this.click(this.affectedDatesInput);
            await this.page.waitForTimeout(500);

            // Select 1st day in calendar
            const startCell = this.page.locator(`xpath=(//td[contains(@class,'day') and not(contains(@class,'off')) and not(contains(@class,'old')) and normalize-space()='${startDay}'])[1]`);
            if (await this.isVisible(startCell, { timeout: 500 }).catch(() => false)) {
                await this.click(startCell);
            } else {
                const fallbackStart = this.page.locator(`xpath=(//td[contains(@class,'day') and not(contains(@class,'off')) and normalize-space()='${startDay}'])[last()]`);
                if (await this.isVisible(fallbackStart, { timeout: 5000 }).catch(() => false)) {
                    await this.click(fallbackStart);
                }
            }

            // Select 2nd consecutive day in calendar
            const endCell = this.page.locator(`xpath=(//td[contains(@class,'day') and not(contains(@class,'off')) and not(contains(@class,'old')) and normalize-space()='${endDay}'])[1]`);
            if (!await this.isVisible(endCell, { timeout: 5000 }).catch(() => false)) {
                await this.click(this.affectedDatesInput);
            }
            if (await this.isVisible(endCell, { timeout: 5000 }).catch(() => false)) {
                await this.click(endCell);
            } else {
                const fallbackEnd = this.page.locator(`xpath=(//td[contains(@class,'day') and not(contains(@class,'off')) and normalize-space()='${endDay}'])[last()]`);
                if (await this.isVisible(fallbackEnd, { timeout: 5000 }).catch(() => false)) {
                    await this.click(fallbackEnd);
                }
            }

            // Click Apply button if present in daterangepicker
            const applyBtn = this.page.locator(".daterangepicker:visible .applyBtn, .daterangepicker .applyBtn, button:has-text('Apply')").first();
            if (await this.isVisible(applyBtn, { timeout: 1000 }).catch(() => false)) {
                await this.click(applyBtn);
            }

            await this.waitForLoaders();
            this.selectedDates = { startDay, endDay, formattedRange: dates ? dates.formattedRange : '' };
            return this.selectedDates;
        });
    }

    /**
     * Clicks the 'Add New' button to open the Add Corporate Time Off form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button for Corporate Time Off', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Fills the Corporate Time Off form with dynamic unique values from the test data fixture.
     * Selects 2 consecutive unoccupied dates in the Affected Date(s) calendar.
     * @param {Object} data - Corporate Time Off test data fixture.
     * @returns {Promise<string>} The generated unique time off name.
     **/
    async fillCorporateTimeOffDetails(data = {}) {
        return await test.step('Fill Corporate Time Off form details', async () => {
            this.uniqueId = `${Date.now()}`;
            this.name = `${data.namePrefix}_${this.uniqueId}`;
            const code = this.uniqueId;
            const note = data.note || `Automated note ${this.uniqueId}`;

            await this.waitForLoaders();

            await this.waitForVisible(this.nameInput);
            await this.fill(this.nameInput, this.name);

            // Status dropdown — select Active
            await this.waitForVisible(this.statusDropdownBtn);
            await this.click(this.statusDropdownBtn);
            await this.waitForVisible(this.statusActiveOption);
            await this.click(this.statusActiveOption);

            await this.waitForVisible(this.codeInput);
            await this.fill(this.codeInput, code);

            // Time Off Type dropdown — select Federal Holiday
            await this.waitForVisible(this.timeOffTypeDropdownBtn);
            await this.click(this.timeOffTypeDropdownBtn);
            await this.waitForVisible(this.timeOffTypeFederalHolidayOption);
            await this.click(this.timeOffTypeFederalHolidayOption);

            await this.waitForVisible(this.allDayRadio);
            await this.click(this.allDayRadio);

            // Apply to All Teaching Staff
            await this.waitForVisible(this.applyToAllRadio);
            await this.click(this.applyToAllRadio);

            await this.waitForVisible(this.noteInput);
            await this.fill(this.noteInput, note);

            // Affected Dates — select 2 consecutive unoccupied dates in calendar picker
            await this.selectUnoccupiedConsecutiveDates(this.occupiedDays);

            return this.name;
        });
    }

    /**
     * Clicks the Save button and waits for loaders.
     **/
    async clickSave() {
        await test.step('Click Save button', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Clicks the Close button on the modal.
     **/
    async clickClose() {
        await test.step('Click Close button', async () => {
            await this.waitForVisible(this.closeBtn);
            await this.click(this.closeBtn);
            await this.waitForHidden(this.closeBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the 'New Corporate Time Off added successfully.' notification is displayed.
     **/
    async verifyCorporateTimeOffAddedSuccessfully() {
        await test.step('Verify "New Corporate Time Off added successfully." notification', async () => {
            const successMsg = this.page.getByText('New Corporate Time Off added successfully.', { exact: true });
            await this.waitForVisible(successMsg);
            await this.verifyVisible(successMsg);
        });
    }

    /**
     * Searches for the created Corporate Time Off by name and clicks its Edit link.
     * @param {string} [name=this.name] - Name to search and edit.
     **/
    async searchAndEdit(name = this.name) {
        await test.step(`Search and edit Corporate Time Off: "${name}"`, async () => {
            await this.page.waitForLoadState('load');
            await this.waitForLoaders();
            await this.waitForVisible(this.searchTextbox);
            await this.fill(this.searchTextbox, name);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1500);
            await this.waitForVisible(this.editLink);
            await this.verifyContainsText(this.corporateTimeOffTable, name);
            await this.click(this.editLink);
            await this.waitForLoaders();
        });
    }

    /**
     * Updates the Corporate Time Off status and note on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async editCorporateTimeOffDetails(data = {}) {
        await test.step('Update Corporate Time Off fields', async () => {
            await this.waitForLoaders();
            const updatedNote = data.updatedNote || `Updated note ${Date.now()}`;

            // Update Status to Deleted
            await this.waitForVisible(this.statusDropdownBtn);
            await this.click(this.statusDropdownBtn);
            await this.waitForVisible(this.statusDeletedOption);
            await this.click(this.statusDeletedOption);

            // Update Note
            await this.waitForVisible(this.noteInput);
            await this.fill(this.noteInput, updatedNote);

            await this.click(this.applyToAllNoRadio);
            if (await this.isVisible(this.selectedStaffOption, { timeout: 5000 }).catch(() => false)) {
                await this.click(this.selectedStaffOption);
            }
            else if (await this.isVisible(this.selectionStaffOption, { timeout: 5000 }).catch(() => false)) {
                await this.click(this.selectionStaffOption);
            }

        });
    }

    /**
     * Verifies that the 'Corporate Time Off updated successfully.' notification is displayed.
     **/
    async verifyCorporateTimeOffUpdatedSuccessfully() {
        await test.step('Verify "Corporate Time Off updated successfully." notification', async () => {
            const updatedMsg = this.page.getByText('Corporate Time Off updated successfully.', { exact: true });
            await this.waitForVisible(updatedMsg);
            await this.verifyVisible(updatedMsg);
        });
    }
}

