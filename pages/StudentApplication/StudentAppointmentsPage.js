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
        this.bookMakeupLink = page.getByRole('link', { name: 'BOOK MAKEUP' });
        this.makeupModalHeading = page.getByRole('heading', { name: 'MAKEUP' });

        // Makeup selection modal / table
        this.makeupSlotButton = page.locator('#partialMakeupTable').getByRole('button', { name: 'SELECT' });

        // Confirmation / alert message
        this.makeupSuccessModalMessage = page.getByText('Enrolled sucessfully.');
        this.modal = page.locator('div.modal-content:visible')
        this.closeModalButton = page.getByRole('button', { name: 'Close' }).filter({ visible: true });
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
     * @param {number} [index=0] - The index of the BOOK MAKEUP link to click.
     **/
    async clickBookMakeup(index = 0) {
        await test.step(`Click on BOOK MAKEUP (row ${index + 1})`, async () => {
            const link = this.bookMakeupLink.nth(index);
            await this.waitForVisible(link, 5000);
            await this.click(link);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.waitForLoaders();
            await this.waitForVisible(this.makeupModalHeading, { timeout: 5000 });
            await this.verifyVisible(this.makeupModalHeading);

        });
    }

    /**
     * Iterates through available 'BOOK MAKEUP' appointments and their available makeup slots
     * to select and enroll in one successfully.
     **/
    async selectAndEnrollAvailableMakeupSlot() {
        await test.step('Select available makeup slot and confirm', async () => {
            await this.filterByAppointmentType();
            const bookMakeupCount = await this.bookMakeupLink.count();

            for (let j = 0; j < bookMakeupCount; j++) {
                if (j > 0) {
                    await this.filterByAppointmentType();
                }
                await this.clickBookMakeup(j);
                await this.waitForVisible(this.makeupSlotButton.first(), 5000);
                const slotCount = await this.makeupSlotButton.count();

                for (let i = 0; i < slotCount; i++) {
                    if (i > 0) {
                        await this.filterByAppointmentType();
                        await this.clickBookMakeup(j);
                    }

                    await this.click(this.makeupSlotButton.nth(i));
                    await this.waitForLoaders();
                    await this.waitForVisible(this.modal, { timeout: 10000 });

                    if (await this.isVisible(this.makeupSuccessModalMessage, { timeout: 1500 }).catch(() => false)) {
                        await this.verifyEnrollmentSuccess();
                        return;
                    }

                    await this.click(this.closeModalButton);
                    await this.waitForLoaders();
                }
            }

            throw new Error('No available makeup slot could be enrolled successfully across all appointments.');
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
