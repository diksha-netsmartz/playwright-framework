const BasePage = require('../../utils/BasePage');
const { expect } = require('@playwright/test');

/**
 * Page Object representing the Student Profile Page in Admin Portal.
 * Handles selecting students, viewing their profiles, and sending username/password reset emails.
 **/
class StudentProfilePage extends BasePage {

    /**
     * Initializes locators for the Student Profile Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Student selection locators

        this.studentNotSelected = page.getByRole('link', { name: 'STUDENT NOT SELECTED. CLICK' });
        this.studentSearch = page.locator('#studentList');
        this.goButton = page.getByRole('button', { name: 'GO' });

        // Send Username/Password email popup locators
        this.sendUsernamePasswordEmailBtn = page.getByRole('button', {
            name: 'Send Username/Password (EMAIL)'
        });
        this.studentEmailCheckbox = page.getByRole('cell', { name: 'Student Email' }).getByRole('insertion');
        this.submitButton = page.getByRole('button', { name: 'Submit' });

        // Update email locators
        this.emailInput = page.locator('#Email');
        this.openEmailPopupBtn = page.locator("xpath=//input[@id='Email']//ancestor::div[@class='input-group']//a[@onclick='OpenPopupForSendingEmailFromField(event)']");
        this.popupStudentEmailInput = page.locator('#txt_StudentAccount_MessageTAB_StudentEmail');
        this.updateStudentEmailBtn = page.locator('#ancstudent');
        this.closePopup = page.locator('button.close:visible');
    }

    /**
     * Searches and selects a student by name in the Student Profile page.
     * @param {string} studentName - Student's name to search.
     **/
    async selectStudent(studentName) {
        await this.click(this.studentNotSelected);
        await this.waitForVisible(this.studentSearch);
        await this.pressSequentially(this.studentSearch, studentName);

        const studentOption = this.page.getByText(studentName).first();
        await this.waitForVisible(studentOption);
        await this.click(studentOption);

        await this.click(this.goButton);
        await this.page.waitForLoadState('networkidle');
        await this.waitForLoaders();

    }

    /**
     * Clicks 'Send Username/Password (EMAIL)', selects Student Email, and submits.
     * Verifies that the success message 'Email sent successfully.' appears.
     **/
    async sendUsernamePasswordEmail() {
        await this.verifyVisible(this.sendUsernamePasswordEmailBtn);
        await this.click(this.sendUsernamePasswordEmailBtn);

        // Select the student email checkbox (handles iCheck / standard ins)
        await this.click(this.studentEmailCheckbox);

        await this.click(this.submitButton);

        // Verify success message
        await this.verifyVisible(this.page.getByText('Email sent successfully.', { exact: true }));
    }

    /**
     * Checks if the student profile email matches the specified email.
     * If not matching, opens the popup, clears and inputs the specified email, and clicks UPDATE.
     * @param {string} specifiedEmail - The required email address to set.
     **/
    async updateEmailIfDifferent(specifiedEmail) {
        await this.verifyVisible(this.emailInput);
        const currentEmail = (await this.getInputValue(this.emailInput)).trim();

        if (currentEmail.toLowerCase() !== specifiedEmail.trim().toLowerCase()) {
            await this.click(this.openEmailPopupBtn);
            await this.waitForVisible(this.popupStudentEmailInput);
            await this.clear(this.popupStudentEmailInput);
            await this.fill(this.popupStudentEmailInput, specifiedEmail);
            await this.click(this.updateStudentEmailBtn);
            await this.verifyVisible(this.page.getByText('Updated successfully.', { exact: true }));
            await this.click(this.closePopup);
            await this.waitForHidden(this.popupStudentEmailInput);
            await this.reload();
            await this.waitForLoaders();
        }
    }

    /**
     * Alias for updateEmailIfDifferent.
     * @param {string} specifiedEmail - The required email address to set.
     **/
    async updateEmail(specifiedEmail) {
        await this.updateEmailIfDifferent(specifiedEmail);
    }
}

module.exports = StudentProfilePage;
