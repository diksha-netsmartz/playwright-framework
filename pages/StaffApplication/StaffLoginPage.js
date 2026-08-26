import BasePage from '../../utils/BasePage';
import config from '../../config/config';
import { test } from '@playwright/test';

/**
 * Page Object representing the Staff Portal Login Page.
 * Handles navigation to staff login URL and user authentication.
 **/
export default class StaffLoginPage extends BasePage {

    /**
     * Initializes locators for the Staff Login Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.usernameTxt = page.getByRole('textbox', { name: 'Username' });
        this.passwordTxt = page.getByRole('textbox', { name: 'Password' });
        this.loginBtn = page.getByRole('button', { name: 'Login' });
        this.mobilePopUp = page.getByText('No mobile number on file.');
        this.mobilePopupCloseButton = page.locator('.close.closemodalphone');
    }

    /**
     * Navigates to the Staff Login page using the configured CSM URL.
    **/
    async navigateToLoginPage() {
        await test.step('Navigate to Staff Login Page', async () => {
            await this.navigate(config.csmURL);
        });
    }

    /**
     * Fills the staff username and password credentials and submits the login form.
     * @param {string} username - Staff username.
     * @param {string} password - Staff password.
    **/
    async login(username, password) {
        await test.step(`Login to Staff Portal with user: ${username}`, async () => {
            await this.verifyVisible(this.usernameTxt);
            await this.fill(this.usernameTxt, username);
            await this.fill(this.passwordTxt, password);
            await this.click(this.loginBtn);
            await this.verifyTitle("Staff Home");
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 75000 });

            await this.closeMobilePopup();
        });
    }

    /**
     * Closes the 'No mobile number on file' modal popup if it appears after login.
    **/
    async closeMobilePopup() {
        await test.step('Close mobile number popup if present', async () => {
            if (await this.mobilePopUp.isVisible().catch(() => false)) {
                await this.verifyVisible(this.mobilePopUp);
                await this.verifyVisible(this.mobilePopupCloseButton);
                await this.click(this.mobilePopupCloseButton);
                await this.waitForHidden(this.mobilePopupCloseButton);
            }
        });
    }
}

