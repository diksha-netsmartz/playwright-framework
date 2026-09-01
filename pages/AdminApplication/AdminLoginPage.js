import BasePage from '../../utils/BasePage';
import config from '../../config/config';
import { expect, test } from "@playwright/test";

/**
 * Page Object representing the Admin Portal Login Page.
 * Handles navigation to admin portal, credential entry, captcha resolution, mobile popups, and login verification.
 **/
export default class AdminLoginPage extends BasePage {

    /**
     * Initializes locators for the Admin Login Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.usernameTxt = page.getByRole('textbox', { name: 'Username' });
        this.passwordTxt = page.getByRole('textbox', { name: 'Password' });
        this.loginBtn = page.getByRole('button', { name: 'Login' });
        this.captchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
        this.mobilePopUp = page.getByText('No mobile number on file.');
        this.mobilePopupCloseButton = page.locator('.close.closemodalphone');
        this.quickLinks = page.getByText('Quick Links', { exact: true });
    }

    /**
     * Navigates to the Admin Portal Login Page using the baseURL.
    **/
    async navigateToLoginPage() {
        await test.step('Navigate to Admin Login Page', async () => {
            await this.navigate(config.baseURL);
        });
    }

    /**
     * Fills admin credentials, clicks reCAPTCHA if present, and clicks the Login button.
     * @param {string} username - Admin username.
     * @param {string} password - Admin password.
    **/
    async login(username, password) {
        await test.step(`Login to Admin Portal with user: ${username}`, async () => {
            await this.verifyVisible(this.usernameTxt);
            await this.fill(this.usernameTxt, username);
            await this.fill(this.passwordTxt, password);
            const captcha = this.captchaFrame.locator('#recaptcha-anchor');
            if (await this.isVisible(captcha)) {
                await this.click(captcha);
                await this.verifyAttribute(captcha, "aria-checked", "true");
            }

            await this.click(this.loginBtn);
            await this.page.waitForLoadState('load', { timeout: 75000 }).catch(() => {});
            await this.waitForLoaders().catch(() => {});
            await this.verifyTitle("Home Page");

            await this.closeMobilePopup();
        });
    }

    /**
     * Closes the 'No mobile number on file' modal popup if it appears after login.
    **/
    async closeMobilePopup() {
        if (await this.mobilePopUp.isVisible().catch(() => false)) {
            await test.step('Close mobile number popup', async () => {

                await this.verifyVisible(this.mobilePopUp);
                await this.verifyVisible(this.mobilePopupCloseButton);
                await this.click(this.mobilePopupCloseButton);
                await this.waitForHidden(this.mobilePopupCloseButton);
            });
        }

    }

    /**
     * Verifies that login was successful by checking the visibility of Quick Links widget on dashboard.
    **/
    async verifyLoginSuccessful() {
        await test.step('Verify Quick Links dashboard widget is displayed', async () => {
            await this.verifyVisible(this.quickLinks);
        });
    }
}