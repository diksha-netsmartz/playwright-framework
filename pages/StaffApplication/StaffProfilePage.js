import BasePage from '@utils/BasePage';
import { test, expect } from '@playwright/test';

/**
 * Page Object representing the Staff Profile Page in the Staff Portal (CSM).
 * Handles updating staff profile details and verifying updated values.
 **/
export default class StaffProfilePage extends BasePage {

    /**
     * Initializes locators for the Staff Profile Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);
        this.staffProfileHeading = page.locator("//h3[contains(text(),'Staff Profile')]");

        // Profile input fields
        this.homePhoneTxt = page.getByRole('textbox', { name: 'Home Phone' });
        this.emergencyContactNameTxt = page.getByRole('textbox', { name: 'Emergency Contact Name' });
        this.emergencyContactPhoneTxt = page.getByRole('textbox', { name: 'Emergency Contact Phone' });
        this.licenseNumberTxt = page.getByRole('textbox', { name: 'Instructor/Staff License#' });

        // Action buttons
        this.updateBtn = page.getByRole('button', { name: 'Update' });
        this.yesConfirmationBtn = page.locator("//a[@data-apply='confirmation' and text()='Yes']");

        // Notification / Alert message
        this.successAlert = page.getByText('Details updated successfully.');

        // Profile Tab navigation locators
        this.employeeHoursTab = page.getByRole('tab', { name: 'Employee Hours' })
        // Employee Hours tab locators
        this.teachingEmpHours = page.locator('#teachingEmpHours');
        this.teachingSubTab = page.locator("//a[@href='#teachingEmpHours']")
        this.otherSubTab = page.locator("//a[@href='#otherEmpHours']")
        this.otherTabTable = page.locator('#otherEmpHours');
        this.addNewOtherBtn = page.getByRole('link', { name: 'Add New Other' })
        this.filterButton = page.getByRole('link', { name: 'FILTER' });
        this.selectDateRangeTextbox = page.getByRole('textbox', { name: 'Select date range' });
        this.searchTextbox = page.locator("//div[@id='tbTeachingList_filter']//input[@placeholder='Search']");
    }

    /**
     * Updates staff profile fields with dynamic runtime details.
     * @param {Object} details - Profile fields to update.
     * @param {string} [details.homePhone] - Home phone number.
     * @param {string} [details.emergencyContactName] - Emergency contact name.
     * @param {string} [details.emergencyContactPhone] - Emergency contact phone.
     * @param {string} [details.licenseNumber] - Instructor/Staff license number.
     **/
    async updateProfileDetails(details = {}) {
        await test.step('Fill updated staff profile details', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.verifyVisible(this.staffProfileHeading);

            if (details.homePhone !== undefined) {
                await this.waitForVisible(this.homePhoneTxt, 1000);
                await this.clear(this.homePhoneTxt);
                await this.fill(this.homePhoneTxt, details.homePhone);
            }

            if (details.emergencyContactName !== undefined) {
                await this.waitForVisible(this.emergencyContactNameTxt, 1000);
                await this.clear(this.emergencyContactNameTxt);
                await this.fill(this.emergencyContactNameTxt, details.emergencyContactName);
            }

            if (details.emergencyContactPhone !== undefined) {
                await this.waitForVisible(this.emergencyContactPhoneTxt, 1000);
                await this.clear(this.emergencyContactPhoneTxt);
                await this.fill(this.emergencyContactPhoneTxt, details.emergencyContactPhone);
            }

            if (details.licenseNumber !== undefined) {
                await this.waitForVisible(this.licenseNumberTxt, 1000);
                await this.clear(this.licenseNumberTxt);
                await this.fill(this.licenseNumberTxt, details.licenseNumber);
            }
        });
    }

    /**
     * Clicks on the Update button and confirms the Yes confirmation dialog.
     **/
    async clickUpdate() {
        await test.step('Click Update and confirm changes', async () => {
            await this.waitForVisible(this.updateBtn, 1000);
            await this.click(this.updateBtn);

            // Wait and click Yes on the dynamic confirmation popup
            await this.waitForVisible(this.yesConfirmationBtn, 1000);
            await this.click(this.yesConfirmationBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the 'Details updated successfully.' message is displayed.
     **/
    async verifyProfileUpdateSuccess() {
        await test.step('Verify "Details updated successfully." message', async () => {
            await this.waitForVisible(this.successAlert, 10000);
            await this.verifyVisible(this.successAlert);
        });
    }

    /**
     * Verifies profile field values after saving by validating value attribute / property.
     * @param {Object} expectedDetails - Expected profile field values.
     * @param {string} [expectedDetails.homePhone] - Expected home phone.
     * @param {string} [expectedDetails.emergencyContactName] - Expected emergency contact name.
     * @param {string} [expectedDetails.emergencyContactPhone] - Expected emergency contact phone.
     * @param {string} [expectedDetails.licenseNumber] - Expected instructor/staff license number.
     **/
    async verifyProfileDetails(expectedDetails = {}) {
        await test.step('Verify profile details after save by validating value attribute', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });

            if (expectedDetails.homePhone !== undefined) {
                await this.waitForVisible(this.homePhoneTxt, 1000);
                await expect(this.homePhoneTxt).toHaveValue(expectedDetails.homePhone);
            }

            if (expectedDetails.emergencyContactName !== undefined) {
                await this.waitForVisible(this.emergencyContactNameTxt, 1000);
                await expect(this.emergencyContactNameTxt).toHaveValue(expectedDetails.emergencyContactName);
            }

            if (expectedDetails.emergencyContactPhone !== undefined) {
                await this.waitForVisible(this.emergencyContactPhoneTxt, 1000);
                await expect(this.emergencyContactPhoneTxt).toHaveValue(expectedDetails.emergencyContactPhone);
            }

            if (expectedDetails.licenseNumber !== undefined) {
                await this.waitForVisible(this.licenseNumberTxt, 1000);
                await expect(this.licenseNumberTxt).toHaveValue(expectedDetails.licenseNumber);
            }
        });
    }

    /**
     * Clicks on the Employee Hours tab.
     **/
    async clickEmployeeHoursTab() {
        await test.step('Click on "Employee Hours" tab', async () => {
            await this.waitForVisible(this.employeeHoursTab, 5000);
            await this.click(this.employeeHoursTab);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
            await this.verifyVisible(this.addNewOtherBtn);
            await this.verifyVisible(this.filterButton);
            await this.verifyVisible(this.selectDateRangeTextbox);
            await this.verifyVisible(this.searchTextbox);
        });
    }

    /**
     * Verifies that the Teaching Employee Hours container and table columns are visible.
     **/
    async verifyTeachingEmpHoursVisible() {
        await test.step('Verify Teaching Employee Hours section and columns are visible', async () => {
            await this.waitForVisible(this.teachingEmpHours, 5000);
            await this.verifyVisible(this.teachingEmpHours);

            const expectedHeaders = ['Type', 'Date', 'Start Time', 'Duration', 'Student Name', 'Enrollments'];
            for (const header of expectedHeaders) {
                await expect(this.teachingEmpHours).toContainText(header);
            }
        });
    }

    /**
     * Clicks on the OTHER sub-tab under Employee Hours and verify details.
     **/
    async clickOtherSubTab() {
        await test.step('Click on "OTHER" sub-tab under Employee Hours', async () => {
            await this.waitForVisible(this.otherSubTab, 5000);
            await this.click(this.otherSubTab);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
            await this.waitForVisible(this.otherTabTable, 5000);
            await this.verifyVisible(this.otherTabTable);
            const expectedHeaders = ['Type', 'Activity Date', 'Duration', 'Note', 'Actions'];
            for (const header of expectedHeaders) {
                await expect(this.otherTabTable).toContainText(header);
            }
        });
    }

    /**
     * Clicks on the TEACHING sub-tab under Employee Hours.
     **/
    async clickTeachingSubTab() {
        await test.step('Click on "TEACHING" sub-tab under Employee Hours', async () => {
            await this.waitForVisible(this.teachingSubTab, 5000);
            await this.click(this.teachingSubTab);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
        });
    }

}
