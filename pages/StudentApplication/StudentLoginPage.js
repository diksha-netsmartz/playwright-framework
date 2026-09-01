import BasePage from '../../utils/BasePage';
import config from '../../config/config';
import { test } from '@playwright/test';

/**
 * Page Object representing the Student Portal Login Page.
 * Handles navigation to student login page and credential submission.
 **/
export default class StudentLoginPage extends BasePage {

    /**
     * Initializes locators for the Student Login Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.usernameTxt = page.getByRole('textbox', { name: 'Username' });
        this.passwordTxt = page.getByRole('textbox', { name: 'Password' });
        this.loginBtn = page.getByRole('button', { name: 'Login' });
        this.profileDropdownOnHomepage = page.locator("#userprofileSettings");
        this.mobilePopUp = page.getByText('No mobile number on file.');
        this.mobilePopupCloseButton = page.locator('.close.closemodalphone');
    }

    /**
     * Navigates to the Student Login Page using the configured CSP URL.
    **/
    async navigateToLoginPage() {
        await test.step('Navigate to Student Login Page (CSP)', async () => {
            await this.navigate(config.cspURL);
        });
    }

    /**
     * Fills the username and password fields and submits the login form.
     * @param {string} username - Student account username.
     * @param {string} password - Student account password.
    **/
    async login(username, password) {
        await test.step(`Login to Student Portal with user: ${username}`, async () => {
            await this.verifyVisible(this.usernameTxt);
            await this.fill(this.usernameTxt, username);
            await this.fill(this.passwordTxt, password);
            await this.click(this.loginBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 75000 });
            await this.verifyVisible(this.profileDropdownOnHomepage);
            await this.verifyTitle("Student Home");
            await this.closeMobilePopup();
        });
    }

    /**
     * Closes the 'No mobile number on file' modal popup if it appears after login.
    **/
    async closeMobilePopup() {
        await this.page.waitForTimeout(5000);
        if (await this.mobilePopUp.isVisible().catch(() => false)) {
            await test.step('Close mobile number popup', async () => {
                await this.verifyVisible(this.mobilePopUp);
                await this.verifyVisible(this.mobilePopupCloseButton);
                await this.click(this.mobilePopupCloseButton);
                await this.waitForHidden(this.mobilePopupCloseButton);
            });
        }

    }
}

