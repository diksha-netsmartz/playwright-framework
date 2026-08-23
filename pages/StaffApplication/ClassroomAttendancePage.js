import BasePage from '../../utils/BasePage';
import { expect } from '@playwright/test';

/**
 * Page Object representing the Classroom Attendance Page in Staff Portal.
 * Handles viewing schedule, filtering classes by date range, marking student attendance,
 * drawing instructor digital signatures on canvas, and saving attendance records.
 **/
export default class ClassroomAttendancePage extends BasePage {

    /**
     * Initializes locators for the Classroom Attendance Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.viewLink = page.locator("xpath=//a[text()=' View ']");
        this.viewAllLink = page.locator("xpath=//strong[text()='View All']");

        // Type filter (first filter dropdown)
        this.typeFilterBtn = page.locator("#ddlTypeSelectVal");
        this.selectAllOption = page.locator("xpath=//input[contains(@class,'selAllTypeDDL')]//following-sibling::ins");

        this.classFilterCheckbox = page.locator("xpath=(//input[contains(@class,'checkType')]//following-sibling::ins)[1]");

        // Date range filter
        this.todayFilterBtn = page.locator("#btnSelectDateRangeFilter");
        this.last26WeeksLink = page.getByRole('link', { name: 'Last 26 Weeks' });
        this.filterBtn = page.getByRole('button', { name: 'Filter' }).last();

        // Attendance table
        this.takeAttendanceLink = page.locator("xpath=(//strong[text()='Take Attendance']//parent::a)[1]");
        this.studentChehckbox = page.locator("xpath=(//div[@class='icheckbox_square-grey']//input[not(contains(@class,'chkAll')) and contains(@class,'studentAttendanceClass')]//following-sibling::ins)[1]");
        this.instructorSignatureCanvas = page.locator('#canvasInstructorSignature');
        this.clearInstructorSignatureBtn = page.locator("xpath=//button[@data-toggle='confirmationClearInstructorSignature']");
        this.saveBtn = page.locator("xpath=(//button[@data-toggle='confirmationSaveAttendance'])[1]")
        this.confirmYesBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

    }

    /**
     * Clicks the 'View' link under the upcoming schedule section.
    **/
    async clickViewInUpcomingSchedule() {
        await this.click(this.viewLink);
    }

    /**
     * Clicks the 'View All' link to view all scheduled classes.
    **/
    async clickViewAll() {
        await this.click(this.viewAllLink);
    }

    /**
     * Filters the schedule list by selecting the Class filter checkbox in the type dropdown.
    **/
    async selectClassFilter() {
        await this.click(this.typeFilterBtn);
        await this.click(this.selectAllOption);
        await this.click(this.classFilterCheckbox);
    }

    /**
     * Applies the 'Last 26 Weeks' date range filter and clicks the Filter button.
    **/
    async selectLast26WeeksAndFilter() {
        await this.click(this.todayFilterBtn);
        await this.click(this.last26WeeksLink);
        await this.click(this.filterBtn);
    }

    /**
     * Clicks the 'Take Attendance' link for the first available classroom session.
    **/
    async clickTakeAttendance() {
        await this.click(this.takeAttendanceLink);
    }

    /**
     * Toggles the attendance checkbox to mark the student present.
    **/
    async markStudentPresent() {
        await this.click(this.studentChehckbox);
    }

    /**
     * Private helper to simulate drawing a stroke on an HTML5 canvas element using mouse coordinates.
     * @param {import('@playwright/test').Locator} canvas - Locator for the signature canvas element.
    **/
    async #drawSignature(canvas) {
        await canvas.scrollIntoViewIfNeeded();
        const box = await canvas.boundingBox();
        const startX = box.x + box.width * 0.2;
        const startY = box.y + box.height * 0.5;
        const endX = box.x + box.width * 0.8;
        const endY = box.y + box.height * 0.5;

        await this.page.mouse.move(startX, startY);
        await this.page.mouse.down();
        await this.page.mouse.move(endX, endY, { steps: 10 });
        await this.page.mouse.up();
    }

    /**
     * Draws the instructor's signature on the signature canvas if it hasn't been signed already.
    **/
    async signInstructorSignature() {
        const isSigned = await this.isVisible(this.clearInstructorSignatureBtn);
        if (!isSigned) {
            await this.#drawSignature(this.instructorSignatureCanvas);
        }
    }

    /**
     * Clicks the Save attendance button and confirms the confirmation dialog.
    **/
    async saveAttendance() {
        await this.click(this.saveBtn);
        await this.click(this.confirmYesBtn);
        await this.waitForLoaders();
    }

    /**
     * Verifies that the success message 'Classroom attendance marked successfully.' is displayed.
    **/
    async verifyAttendanceMarkedSuccessfully() {
        await this.verifyVisible(this.page.getByText('Classroom attendance marked successfully.', { exact: true }));
    }

}
