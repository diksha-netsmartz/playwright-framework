import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Security Policies / Password Policies Page in C-Admin.
 * Handles updating and verifying Staff Password Policies and Student Password Policies.
 **/
export default class SecurityPoliciesPage extends BasePage {

    /**
     * Initializes locators for Security Policies page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Staff Password Policies Locators
        this.staffPasswordPoliciesTab = page.locator("//a[@href='#staffpasspolicy']")
        this.staffResetPasswordLinkAge = page.locator('#txtStaffResetPasswordLinkAge');
        this.staffPasswordHistory = page.locator('#txtStaffPasswordHistory');
        this.staffPasswordAgeDropdown = page.locator('button[data-id="ddlStaffPasswordAge"]');
        this.staffPasswordLength = page.locator('#txtStaffPasswordLength');
        this.staffUpdateBtn = page.locator("//button[@onclick='saveStaffPasswordPolicies();']");

        // Student Password Policies Locators
        this.studentPasswordPoliciesTab = page.locator("//a[@href='#studentpasspolicy']")
        this.studentResetPasswordLinkAge = page.locator('#txtStudentResetPasswordLinkAge');
        this.studentPasswordHistory = page.locator('#txtStudentPasswordHistory');
        this.studentPasswordAgeDropdown = page.locator('button[data-id="ddlStudentPasswordAge"]');
        this.studentPasswordLength = page.locator('#txtStudentPasswordLength');
        this.studentUpdateBtn = page.locator("//button[@onclick='saveStudentPasswordPolicies();']")

        this.successMsg = page.getByText('Password policies updated successfully.').last();
    }

    /**
     * Clicks on Staff Password Policies tab.
     **/
    async navigateToStaffPoliciesTab() {
        await test.step('Click on Staff Password Policies tab', async () => {
            await this.waitForVisible(this.staffPasswordPoliciesTab);
            await this.click(this.staffPasswordPoliciesTab);
            await this.waitForVisible(this.staffResetPasswordLinkAge);
        });
    }

    /**
     * Clicks on Student Password Policies tab.
     **/
    async navigateToStudentPoliciesTab() {
        await test.step('Click on Student Password Policies tab', async () => {
            await this.waitForVisible(this.studentPasswordPoliciesTab);
            await this.click(this.studentPasswordPoliciesTab);
            await this.waitForVisible(this.studentResetPasswordLinkAge);
        });
    }

    /**
     * Updates Staff Password Policies fields by toggling between two alternate values for each field.
     * @returns {Promise<{linkAge: string, history: string, age: string, length: string}>} The newly updated values.
     **/
    async updateStaffPasswordPolicies() {
        return await test.step('Update Staff Password Policies', async () => {
            await this.waitForVisible(this.staffResetPasswordLinkAge);

            // 1. Reset Password Link Age: toggle between '2' and '3'
            const currentLinkAge = (await this.staffResetPasswordLinkAge.inputValue()).trim();
            const newLinkAge = currentLinkAge === '2' ? '3' : '2';
            await this.click(this.staffResetPasswordLinkAge);
            await this.clear(this.staffResetPasswordLinkAge);
            await this.fill(this.staffResetPasswordLinkAge, newLinkAge);

            // 2. Password History: toggle between '1' and '2'
            const currentHistory = (await this.staffPasswordHistory.inputValue()).trim();
            const newHistory = currentHistory === '1' ? '2' : '1';
            await this.click(this.staffPasswordHistory);
            await this.clear(this.staffPasswordHistory);
            await this.fill(this.staffPasswordHistory, newHistory);

            // 3. Max Password Age: toggle between '2 Month' and '3 Month'
            const currentAgeText = ((await this.staffPasswordAgeDropdown.getAttribute('title')) || '').trim();
            const newAgeOption = currentAgeText.includes('2 Month') ? '3 Month' : '2 Month';
            await this.click(this.staffPasswordAgeDropdown);
            const staffOption = this.page.locator('#staffpasspolicy a').filter({ hasText: new RegExp(`^\\s*${newAgeOption}\\s*$`) });
            await this.waitForVisible(staffOption);
            await this.click(staffOption);

            // 4. Password Length: toggle between '7' and '8'
            const currentLength = (await this.staffPasswordLength.inputValue()).trim();
            const newLength = currentLength === '7' ? '8' : '7';
            await this.click(this.staffPasswordLength);
            await this.fill(this.staffPasswordLength, newLength);

            // Click Update and verify success notification
            await this.click(this.staffUpdateBtn);
            await this.waitForVisible(this.successMsg);
            await this.verifyVisible(this.successMsg);

            return {
                linkAge: newLinkAge,
                history: newHistory,
                age: newAgeOption,
                length: newLength
            };
        });
    }

    /**
     * Updates Student Password Policies fields by toggling between two alternate values for each field.
     * @returns {Promise<{linkAge: string, history: string, age: string, length: string}>} The newly updated values.
     **/
    async updateStudentPasswordPolicies() {
        return await test.step('Update Student Password Policies by toggling between two values', async () => {
            await this.waitForVisible(this.studentResetPasswordLinkAge);

            // 1. Reset Password Link Age: toggle between '2' and '3'
            const currentLinkAge = (await this.studentResetPasswordLinkAge.inputValue()).trim();
            const newLinkAge = currentLinkAge === '2' ? '3' : '2';
            await this.click(this.studentResetPasswordLinkAge);
            await this.fill(this.studentResetPasswordLinkAge, newLinkAge);

            // 2. Password History: toggle between '1' and '2'
            const currentHistory = (await this.studentPasswordHistory.inputValue()).trim();
            const newHistory = currentHistory === '1' ? '2' : '1';
            await this.click(this.studentPasswordHistory);
            await this.fill(this.studentPasswordHistory, newHistory);

            // 3. Max Password Age: toggle between '2 Month' and '3 Month'
            const currentAgeText = ((await this.studentPasswordAgeDropdown.getAttribute('title')) || '').trim();
            const newAgeOption = currentAgeText.includes('2 Month') ? '3 Month' : '2 Month';
            await this.click(this.studentPasswordAgeDropdown);
            const studentOption = this.page.locator('#studentpasspolicy a').filter({ hasText: new RegExp(`^\\s*${newAgeOption}\\s*$`) });
            await this.waitForVisible(studentOption);
            await this.click(studentOption);

            // 4. Password Length: toggle between '8' and '9'
            const currentLength = (await this.studentPasswordLength.inputValue()).trim();
            const newLength = currentLength === '8' ? '9' : '8';
            await this.click(this.studentPasswordLength);
            await this.fill(this.studentPasswordLength, newLength);

            // Click Update and verify success notification
            await this.click(this.studentUpdateBtn);
            await this.waitForVisible(this.successMsg);
            await this.verifyVisible(this.successMsg);

            return {
                linkAge: newLinkAge,
                history: newHistory,
                age: newAgeOption,
                length: newLength
            };
        });
    }

    /**
     * Verifies that the Staff Password Policies fields display the expected persisted values.
     * @param {{linkAge: string, history: string, age: string, length: string}} expectedValues
     **/
    async verifyStaffPasswordPolicies(expectedValues) {
        await test.step('Verify Staff Password Policies persisted values after navigation', async () => {
            await this.waitForVisible(this.staffResetPasswordLinkAge);
            await expect(this.staffResetPasswordLinkAge).toHaveValue(expectedValues.linkAge);
            await expect(this.staffPasswordHistory).toHaveValue(expectedValues.history);
            await expect(this.staffPasswordAgeDropdown).toHaveAttribute('title', new RegExp(expectedValues.age, 'i'));
            await expect(this.staffPasswordLength).toHaveValue(expectedValues.length);
        });
    }

    /**
     * Verifies that the Student Password Policies fields display the expected persisted values.
     * @param {{linkAge: string, history: string, age: string, length: string}} expectedValues
     **/
    async verifyStudentPasswordPolicies(expectedValues) {
        await test.step('Verify Student Password Policies persisted values after navigation', async () => {
            await this.waitForVisible(this.studentResetPasswordLinkAge);
            await expect(this.studentResetPasswordLinkAge).toHaveValue(expectedValues.linkAge);
            await expect(this.studentPasswordHistory).toHaveValue(expectedValues.history);
            await expect(this.studentPasswordAgeDropdown).toHaveAttribute('title', new RegExp(expectedValues.age, 'i'));
            await expect(this.studentPasswordLength).toHaveValue(expectedValues.length);
        });
    }
}
