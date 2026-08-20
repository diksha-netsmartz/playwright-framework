const BasePage = require('../../utils/BasePage');
const { expect } = require('@playwright/test');

/**
 * Page Object representing the Student Reset Password Page.
 * Handles entering new credentials, submitting the reset request, and verifying confirmation.
 **/
class StudentResetPasswordPage extends BasePage {

    /**
     * Initializes locators for the Student Reset Password Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        this.newPasswordTxt = page.getByRole('textbox', { name: 'New Password' });
        this.confirmPasswordTxt = page.getByRole('textbox', { name: 'Confirm Password' });
        this.resetBtn = page.getByRole('button', { name: 'RESET' });
        this.resetPasswordSuccessMsg = page.locator('#resetPasswordSuccess');
        this.resetPasswordSuccessIcon = page.locator('#resetPasswordSuccess i');
    }

    /**
     * Navigates directly to the Reset Password link extracted from email.
     * @param {string} resetPasswordUrl - The reset password URL from the email.
     **/
    async navigateToResetPasswordUrl(resetPasswordUrl) {
        await this.navigate(resetPasswordUrl);
    }

    /**
     * Fills the new and confirm password fields and clicks the RESET button.
     * @param {string} newPassword - The new password to set.
     **/
    async resetPassword(newPassword) {
        await this.verifyVisible(this.newPasswordTxt);
        await this.fill(this.newPasswordTxt, newPassword);
        await this.fill(this.confirmPasswordTxt, newPassword);
        await this.click(this.resetBtn);
    }

    /**
     * Verifies that the password was reset successfully.
     **/
    async verifyResetPasswordSuccess() {
        await this.verifyVisible(this.page.getByText('Your password has been updated.', { exact: true }));
        await this.verifyVisible(this.resetPasswordSuccessIcon);
    }
}

module.exports = StudentResetPasswordPage;
