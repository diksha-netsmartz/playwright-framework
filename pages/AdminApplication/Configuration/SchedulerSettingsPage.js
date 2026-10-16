import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Scheduler Settings page in C-Admin (Configuration > Scheduler Settings).
 * Handles updating and verifying:
 * - General Scheduler Settings (locations, checkboxes, charges, max lessons, appointment duration dropdowns)
 * - Graphical Scheduler Settings (slot color checkboxes, row height)
 **/
export default class SchedulerSettingsPage extends BasePage {

    // Realistic real-time location values to toggle between
    static PICKUP_LOCATIONS = ['Main Campus - Front Gate', 'High School - East Parking'];
    static DROPOFF_LOCATIONS = ['Student Residence', 'Main Campus - Building A'];

    /**
     * Initializes locators for Scheduler Settings page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Tab Navigation Locators
        this.schedulerSettingsTab = page.locator("//a[normalize-space()='General Settings']");
        this.graphicalSchedulerSettingsTab = page.locator("//a[normalize-space()='Graphical Scheduler Settings']");

        // Tab 1: General Scheduler Settings Locators
        this.defaultPickupLocationText = page.getByRole('textbox', { name: 'Default Pickup Location Text' });
        this.defaultDropOffLocationText = page.getByRole('textbox', { name: 'Default Drop Off Location Text' });
        this.enableZipCodesCheckbox = page.locator("//input[@id='bit_EnableZipCodes']//following-sibling::ins");
        this.enableZipCodesCheckboxWrapper = page.locator("//input[@id='bit_EnableZipCodes']//parent::div");
        this.enableLocationCoverageCheckbox = page.locator("//input[@id='bit_EnableLocationCoverage']//following-sibling::ins");
        this.enableLocationCoverageCheckboxWrapper = page.locator("//input[@id='bit_EnableLocationCoverage']//parent::div");
        this.lateCancelChargesFixedAmount = page.locator('#txtLateCancelChargesFixedAmount');
        this.lateCancelChargesHourlyAmount = page.locator('#txtLateCancelChargesHourlyAmount');
        this.noShowChargesAmountFixed = page.locator('#txtNoShowChargesAmountFixed');
        this.noShowChargesHourlyAmount = page.locator('#txtNoShowChargesHourlyAmount')
        this.maxScheduledLessonsTeen = page.locator('#txtMaxScheduledLessonsTeen');
        this.maxScheduledLessonsAdult = page.locator('#txtMaxScheduledLessonsAdult');
        this.maxScheduledLessonsRT = page.locator('#txtMaxScheduledLessonsRT');
        this.combinedAppointmentDefaultDuration = page.locator("//button[@data-id='drpGSSCombinedAppointment']");
        this.singleApptDriverAndObserverDefaultDuration = page.locator("//button[@data-id='drpGSSSingleAppointmentDriverandObserver']");
        this.singleApptDriverOnlyDefaultDuration = page.locator("//button[@data-id='drpGSSSingleAppointmentDriverOnly']");
        this.roadTestDefaultDuration = page.locator("//button[@data-id='drpGSSRoadTest']");
        this.singleStudentApptDriverDefaultDuration = page.locator("//button[@data-id='drpGSSSingleStudentAppointmentDODriver']");
        this.singleStudentApptObserverDefaultDuration = page.locator("//button[@data-id='drpGSSSingleStudentAppointmentDOObserver']");
        this.singleStudentApptObserverOnlyDefaultDuration = page.locator("//button[@data-id='drpGSSSingleStudentAppointmentObserverOnly']");
        this.saveGeneralSchedulerSettingsButton = page.locator("//button[contains(@data-toggle,'UpdateGeneralSettings')]");

        // Tab 2: Graphical Scheduler Settings Locators
        this.showPendingSlotColorCheckbox = page.locator("//input[@data-column='bit_ShowPendingAppointmentColor']//following-sibling::ins");
        this.showPendingSlotColorCheckboxWrapper = page.locator("//input[@data-column='bit_ShowPendingAppointmentColor']//parent::div");
        this.showCompletedSlotColorCheckbox = page.locator("//input[@data-column='bit_ShowCompleteAppointmentColor']//following-sibling::ins");
        this.showCompletedSlotColorCheckboxWrapper = page.locator("//input[@data-column='bit_ShowCompleteAppointmentColor']//parent::div");
        this.schedulerRowHeightTextbox = page.locator("//input[@data-column='SchedulerRowHeight']");
        this.saveGraphicalSchedulerSettingsButton = page.locator("//button[contains(@data-toggle,'UpdateGraphicalSettings')]");

        // Common Action & Notification Locators
        this.yesConfirmationBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.successMsg = page.getByText('Settings saved successfully.', { exact: true }).last();
    }

    /**
     * Clicks on the General Scheduler Settings tab.
     **/
    async navigateToSchedulerSettingsTab() {
        await test.step('Click on General Settings tab', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schedulerSettingsTab);
            await this.click(this.schedulerSettingsTab);
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks on the Graphical Scheduler Settings tab.
     **/
    async navigateToGraphicalSchedulerSettingsTab() {
        await test.step('Click on Graphical Scheduler Settings tab', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.graphicalSchedulerSettingsTab);
            await this.click(this.graphicalSchedulerSettingsTab);
            await this.waitForLoaders();
        });
    }

    /**
     * Selects an option from a Bootstrap select dropdown.
     * The option elements are located under: //button[@data-id='...']//following-sibling::div//ul//li
     * @param {import('@playwright/test').Locator} dropdownBtn - The dropdown button locator.
     * @param {string} optionValue - The option text/value to select.
     **/
    async selectDropdownOption(dropdownBtn, optionValue) {
        await this.click(dropdownBtn);
        const optionLi = dropdownBtn.locator("xpath=following-sibling::div//ul//li").filter({ hasText: optionValue }).first();
        await this.waitForVisible(optionLi);
        const optionItem = optionLi.locator('a, span').first();
        if (await this.isVisible(optionItem, { timeout: 1000 }).catch(() => false)) {
            await this.click(optionItem);
        } else {
            await this.click(optionLi);
        }
    }


    /**
     * Updates General Scheduler Settings:
     * - Checkboxes: checks if unchecked, unchecks if checked based on wrapper class containing 'checked'
     * - Pickup & Drop-Off: toggles between 2 realistic values
     * - Charges: toggles between 25 and 50
     * - Max scheduled lessons: toggles between 98 and 99
     * - Appointment duration dropdowns:
     *     combined: 90 or 120
     *     single appointment: 60 or 45
     *     road test: 15 or 30
     *     single student appointment: 60 or 45
     * - Saves and confirms
     * @returns {Promise<Object>} The newly updated values for verification.
     **/
    async updateSchedulerSettings() {
        return await test.step('Update General Scheduler Settings fields', async () => {
            await this.waitForVisible(this.defaultPickupLocationText);

            // 1. Checkboxes: checked if wrapper class contains 'checked', toggle by clicking ins
            const zipCodesClass = (await this.enableZipCodesCheckboxWrapper.getAttribute('class')) || '';
            const zipCodesWasChecked = zipCodesClass.includes('checked');
            await this.click(this.enableZipCodesCheckbox);
            const newZipCodesState = !zipCodesWasChecked;

            const locationCoverageClass = (await this.enableLocationCoverageCheckboxWrapper.getAttribute('class')) || '';
            const locationCoverageWasChecked = locationCoverageClass.includes('checked');
            await this.click(this.enableLocationCoverageCheckbox);
            const newLocationCoverageState = !locationCoverageWasChecked;

            // 2. Default Pickup Location Text: toggle between 2 real-time values
            const currentPickup = (await this.defaultPickupLocationText.inputValue()).trim();
            const newPickup = currentPickup === SchedulerSettingsPage.PICKUP_LOCATIONS[0]
                ? SchedulerSettingsPage.PICKUP_LOCATIONS[1]
                : SchedulerSettingsPage.PICKUP_LOCATIONS[0];
            await this.clear(this.defaultPickupLocationText);
            await this.fill(this.defaultPickupLocationText, newPickup);

            // 3. Default Drop Off Location Text: toggle between 2 real-time values
            const currentDropOff = (await this.defaultDropOffLocationText.inputValue()).trim();
            const newDropOff = currentDropOff === SchedulerSettingsPage.DROPOFF_LOCATIONS[0]
                ? SchedulerSettingsPage.DROPOFF_LOCATIONS[1]
                : SchedulerSettingsPage.DROPOFF_LOCATIONS[0];
            await this.clear(this.defaultDropOffLocationText);
            await this.fill(this.defaultDropOffLocationText, newDropOff);

            // 4. Charges: toggle between 25 and 50 (fill the one that is visible)
            let lateCancelInput = null;
            if (await this.isVisible(this.lateCancelChargesFixedAmount, { timeout: 1000 }).catch(() => false)) {
                lateCancelInput = this.lateCancelChargesFixedAmount;
            } else if (await this.isVisible(this.lateCancelChargesHourlyAmount, { timeout: 1000 }).catch(() => false)) {
                lateCancelInput = this.lateCancelChargesHourlyAmount;
            }

            let newLateCancel = '';
            if (lateCancelInput) {
                const currentLateCancel = (await lateCancelInput.inputValue()).trim();
                newLateCancel = currentLateCancel.includes('25') ? '50' : '25';
                await this.clear(lateCancelInput);
                await this.fill(lateCancelInput, newLateCancel);
            }

            let noShowInput = null;
            if (await this.isVisible(this.noShowChargesAmountFixed, { timeout: 1000 }).catch(() => false)) {
                noShowInput = this.noShowChargesAmountFixed;
            } else if (await this.isVisible(this.noShowChargesHourlyAmount, { timeout: 1000 }).catch(() => false)) {
                noShowInput = this.noShowChargesHourlyAmount;
            }

            let newNoShow = '';
            if (noShowInput) {
                const currentNoShow = (await noShowInput.inputValue()).trim();
                newNoShow = currentNoShow.includes('25') ? '50' : '25';
                await this.clear(noShowInput);
                await this.fill(noShowInput, newNoShow);
            }

            // 5. Max Lessons Textboxes: toggle between 98 and 99
            const currentTeen = (await this.maxScheduledLessonsTeen.inputValue()).trim();
            const newTeen = currentTeen === '98' ? '99' : '98';
            await this.clear(this.maxScheduledLessonsTeen);
            await this.fill(this.maxScheduledLessonsTeen, newTeen);

            const currentAdult = (await this.maxScheduledLessonsAdult.inputValue()).trim();
            const newAdult = currentAdult === '98' ? '99' : '98';
            await this.clear(this.maxScheduledLessonsAdult);
            await this.fill(this.maxScheduledLessonsAdult, newAdult);

            const currentRT = (await this.maxScheduledLessonsRT.inputValue()).trim();
            const newRT = currentRT === '98' ? '99' : '98';
            await this.clear(this.maxScheduledLessonsRT);
            await this.fill(this.maxScheduledLessonsRT, newRT);

            // 6. Appointment Duration Dropdowns (values are present in 'title' attribute)
            // Combined: 90 or 120
            const currentCombined = ((await this.combinedAppointmentDefaultDuration.getAttribute('title')) || '').trim();
            const newCombinedDuration = currentCombined.includes('90') ? '120' : '90';
            await this.selectDropdownOption(this.combinedAppointmentDefaultDuration, newCombinedDuration);

            // Single Appointment: 60 or 45
            const currentSingleDO = ((await this.singleApptDriverAndObserverDefaultDuration.getAttribute('title')) || '').trim();
            const newSingleApptDO = currentSingleDO.includes('60') ? '45' : '60';
            await this.selectDropdownOption(this.singleApptDriverAndObserverDefaultDuration, newSingleApptDO);

            const currentSingleDriverOnly = ((await this.singleApptDriverOnlyDefaultDuration.getAttribute('title')) || '').trim();
            const newSingleApptDriverOnly = currentSingleDriverOnly.includes('60') ? '45' : '60';
            await this.selectDropdownOption(this.singleApptDriverOnlyDefaultDuration, newSingleApptDriverOnly);

            // Road Test: 15 or 30
            const currentRoadTest = ((await this.roadTestDefaultDuration.getAttribute('title')) || '').trim();
            const newRoadTestDuration = currentRoadTest.includes('15') ? '30' : '15';
            await this.selectDropdownOption(this.roadTestDefaultDuration, newRoadTestDuration);

            // Single Student Appointment: 60 or 45
            const currentSingleStudentDriver = ((await this.singleStudentApptDriverDefaultDuration.getAttribute('title')) || '').trim();
            const newSingleStudentDriver = currentSingleStudentDriver.includes('60') ? '45' : '60';
            await this.selectDropdownOption(this.singleStudentApptDriverDefaultDuration, newSingleStudentDriver);

            const currentSingleStudentObserver = ((await this.singleStudentApptObserverDefaultDuration.getAttribute('title')) || '').trim();
            const newSingleStudentObserver = currentSingleStudentObserver.includes('60') ? '45' : '60';
            await this.selectDropdownOption(this.singleStudentApptObserverDefaultDuration, newSingleStudentObserver);

            const currentSingleStudentObserverOnly = ((await this.singleStudentApptObserverOnlyDefaultDuration.getAttribute('title')) || '').trim();
            const newSingleStudentObserverOnly = currentSingleStudentObserverOnly.includes('60') ? '45' : '60';
            await this.selectDropdownOption(this.singleStudentApptObserverOnlyDefaultDuration, newSingleStudentObserverOnly);

            // 7. Click Save and confirm
            await this.waitForVisible(this.saveGeneralSchedulerSettingsButton);
            await this.click(this.saveGeneralSchedulerSettingsButton);
            await this.waitForVisible(this.yesConfirmationBtn);
            await this.click(this.yesConfirmationBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.successMsg);
            await this.verifyVisible(this.successMsg);

            return {
                enableZipCodes: newZipCodesState,
                enableLocationCoverage: newLocationCoverageState,
                pickupLocation: newPickup,
                dropOffLocation: newDropOff,
                lateCancelCharges: newLateCancel,
                noShowCharges: newNoShow,
                maxLessonsTeen: newTeen,
                maxLessonsAdult: newAdult,
                maxLessonsRT: newRT,
                combinedDuration: newCombinedDuration,
                singleApptDriverAndObserverDuration: newSingleApptDO,
                singleApptDriverOnlyDuration: newSingleApptDriverOnly,
                roadTestDuration: newRoadTestDuration,
                singleStudentApptDriverDuration: newSingleStudentDriver,
                singleStudentApptObserverDuration: newSingleStudentObserver,
                singleStudentApptObserverOnlyDuration: newSingleStudentObserverOnly
            };
        });
    }

    /**
     * Updates Graphical Scheduler Settings:
     * - Checkboxes: checks if unchecked, unchecks if checked based on wrapper class containing 'checked'
     * - Row height: toggles between 25 and 30
     * - Saves and confirms
     * @returns {Promise<Object>} The newly updated values for verification.
     **/
    async updateGraphicalSchedulerSettings() {
        return await test.step('Update Graphical Scheduler Settings fields', async () => {
            await this.waitForVisible(this.schedulerRowHeightTextbox);

            // 1. Checkboxes: checked if wrapper class contains 'checked', toggle by clicking ins
            const pendingClass = (await this.showPendingSlotColorCheckboxWrapper.getAttribute('class')) || '';
            const pendingWasChecked = pendingClass.includes('checked');
            await this.click(this.showPendingSlotColorCheckbox);
            const newPendingState = !pendingWasChecked;

            const completedClass = (await this.showCompletedSlotColorCheckboxWrapper.getAttribute('class')) || '';
            const completedWasChecked = completedClass.includes('checked');
            await this.click(this.showCompletedSlotColorCheckbox);
            const newCompletedState = !completedWasChecked;

            // 2. Scheduler Row Height: toggle between 25 and 30
            const currentRowHeight = (await this.schedulerRowHeightTextbox.inputValue()).trim();
            const newRowHeight = currentRowHeight === '25' ? '30' : '25';
            await this.clear(this.schedulerRowHeightTextbox);
            await this.fill(this.schedulerRowHeightTextbox, newRowHeight);

            // 3. Click Save and confirm
            await this.waitForVisible(this.saveGraphicalSchedulerSettingsButton);
            await this.click(this.saveGraphicalSchedulerSettingsButton);
            await this.waitForVisible(this.yesConfirmationBtn);
            await this.click(this.yesConfirmationBtn);
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => { });
            await this.waitForLoaders();
            await this.waitForVisible(this.successMsg);
            await expect(this.successMsg).toBeVisible();

            return {
                showPendingColor: newPendingState,
                showCompletedColor: newCompletedState,
                rowHeight: newRowHeight
            };
        });
    }

    /**
     * Verifies that the General Scheduler Settings fields display the expected persisted values.
     * @param {Object} expectedValues
     **/
    async verifySchedulerSettings(expectedValues) {
        await test.step('Verify General Scheduler Settings persisted values after navigation', async () => {
            await this.waitForVisible(this.defaultPickupLocationText);

            // Verify Checkboxes via wrapper class containing 'checked'
            if (expectedValues.enableZipCodes) {
                await expect(this.enableZipCodesCheckboxWrapper).toHaveClass(/checked/);
            } else {
                await expect(this.enableZipCodesCheckboxWrapper).not.toHaveClass(/checked/);
            }

            if (expectedValues.enableLocationCoverage) {
                await expect(this.enableLocationCoverageCheckboxWrapper).toHaveClass(/checked/);
            } else {
                await expect(this.enableLocationCoverageCheckboxWrapper).not.toHaveClass(/checked/);
            }

            // Verify Locations
            await expect(this.defaultPickupLocationText).toHaveValue(expectedValues.pickupLocation);
            await expect(this.defaultDropOffLocationText).toHaveValue(expectedValues.dropOffLocation);

            // Verify Charges (verify whichever input is visible)
            if (expectedValues.lateCancelCharges) {
                if (await this.isVisible(this.lateCancelChargesFixedAmount, { timeout: 1000 }).catch(() => false)) {
                    await expect(this.lateCancelChargesFixedAmount).toHaveValue(new RegExp(`^${expectedValues.lateCancelCharges}`));
                } else if (await this.isVisible(this.lateCancelChargesHourlyAmount, { timeout: 1000 }).catch(() => false)) {
                    await expect(this.lateCancelChargesHourlyAmount).toHaveValue(new RegExp(`^${expectedValues.lateCancelCharges}`));
                }
            }

            if (expectedValues.noShowCharges) {
                if (await this.isVisible(this.noShowChargesAmountFixed, { timeout: 1000 }).catch(() => false)) {
                    await expect(this.noShowChargesAmountFixed).toHaveValue(new RegExp(`^${expectedValues.noShowCharges}`));
                } else if (await this.isVisible(this.noShowChargesHourlyAmount, { timeout: 1000 }).catch(() => false)) {
                    await expect(this.noShowChargesHourlyAmount).toHaveValue(new RegExp(`^${expectedValues.noShowCharges}`));
                }
            }

            // Verify Max Lessons
            await expect(this.maxScheduledLessonsTeen).toHaveValue(expectedValues.maxLessonsTeen);
            await expect(this.maxScheduledLessonsAdult).toHaveValue(expectedValues.maxLessonsAdult);
            await expect(this.maxScheduledLessonsRT).toHaveValue(expectedValues.maxLessonsRT);

            // Verify Appointment Duration Dropdowns via 'title' attribute
            await expect(this.combinedAppointmentDefaultDuration).toHaveAttribute('title', new RegExp(expectedValues.combinedDuration));
            await expect(this.singleApptDriverAndObserverDefaultDuration).toHaveAttribute('title', new RegExp(expectedValues.singleApptDriverAndObserverDuration));
            await expect(this.singleApptDriverOnlyDefaultDuration).toHaveAttribute('title', new RegExp(expectedValues.singleApptDriverOnlyDuration));
            await expect(this.roadTestDefaultDuration).toHaveAttribute('title', new RegExp(expectedValues.roadTestDuration));
            await expect(this.singleStudentApptDriverDefaultDuration).toHaveAttribute('title', new RegExp(expectedValues.singleStudentApptDriverDuration));
            await expect(this.singleStudentApptObserverDefaultDuration).toHaveAttribute('title', new RegExp(expectedValues.singleStudentApptObserverDuration));
            await expect(this.singleStudentApptObserverOnlyDefaultDuration).toHaveAttribute('title', new RegExp(expectedValues.singleStudentApptObserverOnlyDuration));
        });
    }

    /**
     * Verifies that the Graphical Scheduler Settings fields display the expected persisted values.
     * @param {Object} expectedValues
     **/
    async verifyGraphicalSchedulerSettings(expectedValues) {
        await test.step('Verify Graphical Scheduler Settings persisted values after navigation', async () => {
            await this.waitForVisible(this.schedulerRowHeightTextbox);

            // Verify Checkboxes via wrapper class containing 'checked'
            if (expectedValues.showPendingColor) {
                await expect(this.showPendingSlotColorCheckboxWrapper).toHaveClass(/checked/);
            } else {
                await expect(this.showPendingSlotColorCheckboxWrapper).not.toHaveClass(/checked/);
            }

            if (expectedValues.showCompletedColor) {
                await expect(this.showCompletedSlotColorCheckboxWrapper).toHaveClass(/checked/);
            } else {
                await expect(this.showCompletedSlotColorCheckboxWrapper).not.toHaveClass(/checked/);
            }

            // Verify Row Height
            await expect(this.schedulerRowHeightTextbox).toHaveValue(expectedValues.rowHeight);
        });
    }
}
