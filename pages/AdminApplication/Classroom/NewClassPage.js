import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the New Classroom / Add Class Page in Admin Portal.
 * Handles selecting session type, services, status, location, dates, session times,
 * instructors, availability checks, notes, and saving new multi-session classrooms.
 **/
export default class NewClassPage extends BasePage {

    /**
     * Initializes locators for the New Class Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header
        this.classroomHeading = page.locator('h3').filter({ hasText: 'Classroom' }).first();

        // Session Type & Service
        this.sessionTypeBtn = page.getByRole('button', { name: 'Select Class Session Type' });
        this.serviceDropdownBtn = page.locator('#panel_ClassroomService').getByRole('button', { name: 'Select' });
        this.serviceOption = page.locator("xpath=(//button[@data-id='drp_Product']//parent::div//following-sibling::div//li)[2]");
        this.statusDropdownBtn = page.locator('#panel_Status').getByRole('button', { name: 'Select' });

        // Class Details
        this.classroomIdInput = page.getByRole('textbox', { name: 'Classroom ID Number' });
        this.enrollmentInput = page.getByRole('textbox', { name: 'Enrollment' });
        this.makeupInput = page.getByRole('textbox', { name: 'Makeup' })
        this.locationDropdownBtn = page.locator('#panel_Location').getByRole('button', { name: 'Select' });
        this.locationOption = page.locator("xpath=(//button[@data-id='drp_Location']//parent::div//following-sibling::div//li)[last()]");

        // Date & Sessions
        this.startDateInput = page.getByRole('textbox', { name: 'M/D/YYYY' });
        this.lastDateInCalendar = page.locator("xpath=(//div[@class='datepicker-days']//tbody//td)[last()]");
        this.totalSessionsInput = page.getByRole('textbox', { name: 'Total Sessions' });

        // Weekdays
        this.weekdaysDropdownBtn = page.locator('#weekdays').getByRole('button', { name: 'Select' });

        // Session Times Modal
        this.setSessionTimesLink = page.getByRole('link', { name: 'Set Session Times' });
        this.startTimeSelect = page.locator('#drp_starttime1');
        this.durationSelect = page.locator('#drp_duration1');
        this.saveSessionTimesBtn = page.getByRole('button', { name: 'SAVE' });

        // Instructor & Availability
        this.instructorDropdownBtn = page.locator('#panel_Teacher').getByRole('button', { name: 'Select' });
        this.instructorOption = page.locator("xpath=(//button[@data-id='drp_Teacher']//parent::div//following-sibling::div//li)[2]");
        this.checkAvailabilityBtn = page.getByRole('button', { name: 'Click Here to Check' });
        this.addButton = page.locator("xpath=(//a[text()='Add'])[1]");
        this.weekdayDropdown = page.locator("xpath=//button[@data-id='drp_WorkTiming_WeekDay']");
        this.weekdayOption = page.locator("xpath=(//span[normalize-space()='Monday'])[1]");
        this.startTimeDropdown = page.locator("xpath=//button[@title='Start Time']");
        this.startTimeOption = page.locator("xpath=//button[@title='Start Time']//parent::div//span[normalize-space()='6:00 AM']");
        this.endTimeDropdown = page.locator("xpath=//button[@title='End Time']");
        this.endTimeOption = page.locator("xpath=//button[@title='End Time']//parent::div//span[normalize-space()='6:15 AM']");
        this.saveButton = page.locator("xpath=//div[@class='modal-footer']//button[text()='Save']");
        this.closeButton = page.locator("xpath=(//div[@class='modal-footer']//button[text()='Close' and @onclick])[1]")
        this.closeTeacherModal = page.locator("xpath=//h4[contains(@id,'Teacher')]//ancestor::div[@class='modal-content']//button[text()='Close']")

        // Reassign / Edit Instructor Availability Locators
        this.editButton = page.locator("xpath=//button[text()='Edit']");
        this.selectBTWInstructorDropdown = page.locator("xpath=//button[@data-id='drpSelectBTWAppointmentInstructor']");
        this.selectBTWInstructorOption = page.locator("xpath=(//button[@data-id='drpSelectBTWAppointmentInstructor']//parent::div//li)[2]");
        this.saveBTWInstructorBtn = page.locator("xpath=//button[contains(@data-toggle,'Update') and text()='Save']");
        this.confirmYesBtn = page.locator("xpath=//a[text()='Yes' and @data-apply='confirmation']");
        this.instructorUpdatedMessage = page.getByText('Instructor updated in the appointment.', { exact: true });
        this.closeChangeInstructorModal = page.locator("xpath=//strong[text()='Change Instructor']//ancestor::div[@class='modal-content']//button[text()='Close']");
        this.teacherAvailableMessage = page.getByText('Teacher is available.', { exact: true });
        this.closeTeacherAvailableModal = page.locator("xpath=//b[text()='Teacher is available.']//ancestor::div[@class='modal-content']//button[text()='Close']");
        this.removeButton = page.locator("xpath=//button[contains(text(),'Remove')]");
        this.teacherRemovedMessage = page.getByText('Teacher removed successfully from conflicting session.', { exact: true });

        // Notes
        this.webSignupNotesInput = page.locator("xpath=//div[@id='summerNote_WebSignup']//parent::div//div[@class='note-editable']");
        this.crNotesInput = page.locator("xpath=//div[@id='summerNote_ClassInformation']//parent::div//div[@class='note-editable']");
        this.internalCrNotesInput = page.locator("xpath=//div[@id='summerNote_ClassInformation_InternalNotes']//parent::div//div[@class='note-editable']");

        // Actions & Feedback
        this.createBtn = page.getByRole('button', { name: 'Create' });
        this.successMessageDiv = page.locator('#GlobalErrorSuccessDiv');
        this.classCreatedRightSide = page.locator("#classGrid");
    }

    /**
     * Verifies that the Classroom page heading is visible.
     **/
    async verifyNewClassroomPageIsDisplayed() {
        await test.step('Verify New Classroom page is displayed', async () => {
            await this.waitForLoaders();
            await this.verifyVisible(this.classroomHeading);
        });
    }

    /**
     * Selects the class session type from the dropdown (e.g. 'Multi Session Class').
     * @param {string} sessionType - Name of the session type.
     **/
    async selectClassSessionType(sessionType) {
        await test.step(`Select Class Session Type: "${sessionType}"`, async () => {
            await this.click(this.sessionTypeBtn);
            await this.click(this.page.getByRole('link', { name: sessionType }));
        });
    }

    /**
     * Selects the classroom service. If no serviceName is provided, selects the first available option in the list.
     **/
    async selectClassroomService() {
        await test.step('Select Classroom Service', async () => {
            await this.waitForVisible(this.serviceDropdownBtn);
            await this.click(this.serviceDropdownBtn);
            await this.click(this.serviceOption);
        });
    }

    /**
     * Selects classroom status (e.g. 'Open').
     * @param {string} status - Status value to select.
     **/
    async selectStatus(status = 'Open') {
        await test.step(`Select Classroom Status: "${status}"`, async () => {
            await this.click(this.statusDropdownBtn);
            const statusOption = this.page.locator('#panel_Status a').filter({ hasText: status }).first();
            await this.click(statusOption);
        });
    }

    /**
     * Enters the Classroom ID Number. If no ID is provided, generates a random numeric ID.
     * @returns {Promise<string>} The classroom ID that was entered.
     **/
    async enterClassroomId(classroomId) {
        const idToEnter = String(Math.floor(1000 + Math.random() * 90000));
        console.log(`Classroom ID entered: ${idToEnter}`);
        return await test.step(`Enter Classroom ID: "${idToEnter}"`, async () => {
            await this.fill(this.classroomIdInput, idToEnter);
            return idToEnter;
        });
    }

    /**
     * Enters maximum student enrollment capacity.
     * @param {string} enrollment - Enrollment count.
     **/
    async enterClassroomSize(enrollment, makeup) {
        await test.step(`Enter classroom size: Enrollment "${enrollment}", Makeup "${makeup}"`, async () => {
            await this.fill(this.enrollmentInput, enrollment);
            await this.fill(this.makeupInput, makeup);
        });
    }

    /**
     * Selects classroom location from the location dropdown. If no locationName is provided, selects the first available option in the list.
     **/
    async selectLocation() {

        if (await this.isVisible(this.locationDropdownBtn)) {
            await test.step('Select Classroom Location', async () => {
                await this.click(this.locationDropdownBtn);
                await this.waitForVisible(this.locationOption);
                await this.click(this.locationOption);
            });
        }

    }

    /**
     * Selects the start date using the calendar picker.
     **/
    async selectStartDate() {
        await test.step('Select Start Date from calendar', async () => {
            await this.click(this.startDateInput);
            await this.click(this.lastDateInCalendar);
        });
    }

    /**
     * Enters total sessions for the class.
     * @param {string} totalSessions - Number of sessions.
     **/
    async enterTotalSessions(totalSessions) {
        await test.step(`Enter Total Sessions: "${totalSessions}"`, async () => {
            await this.click(this.totalSessionsInput);
            await this.fill(this.totalSessionsInput, totalSessions);
        });
    }

    /**
     * Selects multiple weekdays for the class sessions.
     * @param {string[]} [weekdays=['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']] - Array of weekday abbreviations.
     **/
    async selectWeekdays(weekdays = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']) {
        await test.step(`Select weekdays: ${weekdays.join(', ')}`, async () => {
            await this.click(this.weekdaysDropdownBtn);
            for (const day of weekdays) {
                const dayOption = this.page.locator('#weekdays a').filter({ hasText: day }).first();
                await this.click(dayOption);
            }
            await this.click(this.weekdaysDropdownBtn);
        });
    }

    /**
     * Opens Set Session Times popup, sets start time and duration, and saves.
     * @param {string} [startTime='0800'] - Start time option value.
     * @param {string} [duration='3'] - Duration option value.
     **/
    async setSessionTimes(startTime = '0800', duration = '3') {
        await test.step(`Set session times (Start Time: ${startTime}, Duration: ${duration})`, async () => {
            await this.click(this.setSessionTimesLink);
            await this.selectOption(this.startTimeSelect, startTime);
            await this.selectOption(this.durationSelect, duration);
            await this.click(this.saveSessionTimesBtn);
            await this.waitForHidden(this.saveSessionTimesBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Selects instructor from the instructor dropdown. If no instructorName is provided, selects the first available option in the list.
     **/
    async selectInstructor() {
        await test.step('Select Classroom Instructor', async () => {
            await this.click(this.instructorDropdownBtn);
            await this.waitForVisible(this.instructorOption);
            await this.click(this.instructorOption);
        });
    }

    /**
     * Clicks the 'Click Here to Check' schedule availability button.
     * Handles 'Add' availability, 'Edit' (Change Instructor), and 'Remove' (Conflicting Session) workflows.
     **/
    async checkScheduleAvailability() {
        await test.step('Check instructor schedule availability', async () => {
            await this.click(this.checkAvailabilityBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.closeTeacherModal);

            if (await this.addButton.isVisible({ timeout: 5000 }).catch(() => false)) {
                await this.click(this.addButton);
                await this.waitForVisible(this.weekdayDropdown);
                await this.click(this.weekdayDropdown);
                await this.click(this.weekdayOption);
                await this.click(this.startTimeDropdown);
                await this.click(this.startTimeOption);
                await this.click(this.endTimeDropdown);
                await this.click(this.endTimeOption);
                await this.click(this.saveButton);
                await this.verifyVisible(this.page.getByText('Saved successfully.', { exact: true }));
                await this.click(this.closeButton);
                await this.waitForHidden(this.saveButton);
                await this.waitForLoaders();
                await this.waitForVisible(this.closeTeacherModal);
                await this.click(this.closeTeacherModal);
                await this.waitForHidden(this.closeTeacherModal);
                await this.waitForLoaders();
            } else if (await this.editButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await this.click(this.editButton);
                await this.waitForLoaders();
                await this.waitForVisible(this.selectBTWInstructorDropdown);
                await this.click(this.selectBTWInstructorDropdown);
                await this.waitForVisible(this.selectBTWInstructorOption);
                await this.click(this.selectBTWInstructorOption);
                await this.click(this.saveBTWInstructorBtn);

                const isConfirmVisible = await this.confirmYesBtn.isVisible({ timeout: 3000 }).catch(() => false);
                if (isConfirmVisible) {
                    await this.click(this.confirmYesBtn);
                    await this.waitForLoaders();
                }

                await this.verifyVisible(this.instructorUpdatedMessage);
                await this.click(this.closeChangeInstructorModal);
                await this.waitForLoaders();
                await this.verifyVisible(this.teacherAvailableMessage);
                await this.click(this.closeTeacherAvailableModal);
                await this.waitForLoaders();
            } else if (await this.removeButton.isVisible({ timeout: 3000 }).catch(() => false)) {
                await this.click(this.removeButton);
                await this.waitForLoaders();
                await this.waitForVisible(this.confirmYesBtn);
                await this.click(this.confirmYesBtn);
                await this.waitForLoaders();
                await this.waitForVisible(this.teacherRemovedMessage);
                await this.verifyVisible(this.teacherAvailableMessage);
                await this.click(this.closeTeacherAvailableModal);
                await this.waitForLoaders();
            }
        });
    }

    /**
     * Fills out the web signup notes, CR notes (rich text editor), and internal CR notes.
     * @param {string} webSignupNotes - Notes displayed on public signup.
     * @param {string} crNotes - Classroom notes.
     * @param {string} internalCrNotes - Internal staff notes.
     **/
    async enterClassroomNotes(webSignupNotes, crNotes, internalCrNotes) {
        await test.step('Enter Classroom Notes', async () => {
            await this.fill(this.webSignupNotesInput, webSignupNotes);
            await this.fill(this.crNotesInput, crNotes);
            await this.fill(this.internalCrNotesInput, internalCrNotes);
        });
    }

    /**
     * Clicks the Create button to submit the new classroom form.
     **/
    async clickCreateClassroom() {
        await test.step('Click Create Classroom button', async () => {
            await this.click(this.createBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the success alert 'Class saved successfully.' is displayed.
     **/
    async verifyClassSavedSuccessfully() {
        await test.step('Verify "Class saved successfully." message and grid display', async () => {
            await this.verifyVisible(this.successMessageDiv);
            await this.verifyContainsText(this.successMessageDiv, 'Class saved successfully.');
            await this.waitForLoaders();
            await this.waitForVisible(this.classCreatedRightSide);
            await this.verifyVisible(this.classCreatedRightSide);
        });
    }

    /**
     * High-level method to fill all fields and create a new Multi-Session Classroom.
     * Classroom ID is randomly generated automatically if not provided.
     * @param {Object} [classData={}] - Classroom configuration object.
     **/
    async createMultiSessionClassroom(classData = {}) {
        await this.verifyNewClassroomPageIsDisplayed();
        await this.selectClassSessionType('Multi Session Class');
        await this.selectClassroomService();
        await this.selectStatus(classData.status);
        await this.enterClassroomId();
        await this.enterClassroomSize(classData.enrollment, classData.makeup);
        await this.selectLocation();
        await this.selectStartDate();
        await this.enterTotalSessions(classData.totalSessions);
        await this.selectWeekdays(classData.weekdays);
        await this.setSessionTimes(classData.startTime, classData.duration);
        await this.selectInstructor();
        await this.checkScheduleAvailability();
        await this.enterClassroomNotes(classData.webSignupNotes, classData.crNotes, classData.internalCrNotes);
        await this.clickCreateClassroom();
        await this.verifyClassSavedSuccessfully();
    }

    /**
     * High-level method to fill all fields and create a new Single-Session Classroom.
     * Classroom ID is randomly generated automatically if not provided.
     * @param {Object} [classData={}] - Classroom configuration object.
     **/
    async createSingleSessionClassroom(classData = {}) {
        await this.verifyNewClassroomPageIsDisplayed();
        await this.selectClassSessionType('Single Session Class');
        await this.selectClassroomService();
        await this.selectStatus(classData.status);
        await this.enterClassroomId();
        await this.enterClassroomSize(classData.enrollment, classData.makeup);
        await this.selectLocation();
        await this.selectStartDate();
        await this.setSessionTimes(classData.startTime, classData.duration);
        await this.selectInstructor();
        await this.checkScheduleAvailability();
        await this.enterClassroomNotes(classData.webSignupNotes, classData.crNotes, classData.internalCrNotes);
        await this.clickCreateClassroom();
        await this.verifyClassSavedSuccessfully();
    }
}

