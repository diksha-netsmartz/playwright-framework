import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Appointments / Classroom Makeup section in Student Portal (CSP).
 * Handles filtering appointments by type, opening the Book Makeup modal,
 * selecting available makeup slots, and verifying enrollment status.
 **/
export default class StudentAppointmentsPage extends BasePage {

    /**
     * Initializes locators for the Student Appointments Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Filter locators
        this.selectAppointmentTypeDropdown = page.getByRole('button', { name: 'Select Appointment Type' });
        this.classCheckbox = page.locator("//label[normalize-space()='Class']//div");
        this.filterButton = page.getByRole('button', { name: 'Filter' }).first();

        // Appointment table & action links
        this.bookMakeupLink = page.getByRole('link', { name: 'BOOK MAKEUP' }).first();
        this.makeupModalHeading = page.getByRole('heading', { name: 'MAKEUP' });

        // Makeup selection modal / table
        this.firstAvailableMakeupSlotButton = page.locator('#partialMakeupTable').getByRole('button', { name: 'SELECT' }).first();

        // Confirmation / alert message
        this.makeupSuccessModalMessage = page.getByText('Enrolled sucessfully.');
    }

    /**
     * Filters appointments by appointment type (e.g. 'Class').
     **/
    async filterByAppointmentType() {
        await test.step(`Filter appointments by type: Class"`, async () => {
            await this.waitForVisible(this.selectAppointmentTypeDropdown, 5000);
            await this.click(this.selectAppointmentTypeDropdown);
            await this.waitForVisible(this.classCheckbox);
            await this.click(this.classCheckbox);
            await this.click(this.filterButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.waitForLoaders();
        });
    }

    /**
     * Clicks on the 'BOOK MAKEUP' link for an appointment row.
     **/
    async clickBookMakeup() {
        await test.step('Click on BOOK MAKEUP', async () => {
            await this.waitForVisible(this.bookMakeupLink, 5000);
            await this.click(this.bookMakeupLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.waitForLoaders();
            await this.waitForVisible(this.makeupModalHeading, { timeout: 5000 });
            await this.verifyVisible(this.makeupModalHeading);

        });
    }

    /**
     * Selects the first available makeup slot in the modal/table.
     **/
    async selectMakeupSlot() {
        await test.step('Select available makeup slot and confirm', async () => {
            await this.waitForVisible(this.firstAvailableMakeupSlotButton, 5000);
            await this.click(this.firstAvailableMakeupSlotButton);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the makeup class enrollment was successful.
     **/
    async verifyEnrollmentSuccess() {
        await test.step('Verify makeup class enrollment success', async () => {
            await this.waitForVisible(this.makeupSuccessModalMessage, { timeout: 10000 });
            await this.verifyVisible(this.makeupSuccessModalMessage);
        });
    }
}
