import BasePage from '@utils/BasePage';
import config from '@config/config';
import { test, expect } from '@playwright/test';
import TwoFactorAuthPage from '@pages/Common/TwoFactorAuthPage';
import StaffHomePage from './StaffHomePage';

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

        this.staffHomePage = new StaffHomePage(page);
        this.twoFactorAuthPage = new TwoFactorAuthPage(page);
        this.usernameTxt = page.getByRole('textbox', { name: 'Username' });
        this.passwordTxt = page.getByRole('textbox', { name: 'Password' });
        this.loginBtn = page.getByRole('button', { name: 'Login' }).first();
        this.captchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
        this.mobilePopUp = page.getByText('No mobile number on file.');
        this.mobilePopupCloseButton = page.locator('.close.closemodalphone');
    }

    /**
     * Navigates to the Staff Login Page using the configured CSM URL.
    **/
    async navigateToLoginPage() {
        await test.step('Navigate to Staff Login Page', async () => {
            await this.navigate(config.csmURL);
        });
    }

    /**
     * Fills the staff username and password credentials and submits the login form.
     * If CAPTCHA blocks authentication, the testcase is skipped. If navigation or login fails, an error is thrown.
     * @param {string} username - Staff username.
     * @param {string} password - Staff password.
    **/
    async login(username, password) {
        await test.step(`Login to Staff Portal with user: ${username}`, async () => {
            await this.closeMobilePopup();

            const isUserVisible = await this.isVisible(this.usernameTxt, { timeout: 10000 }).catch(() => false);
            const captcha = this.captchaFrame.locator('#recaptcha-anchor');
            if (!isUserVisible) {
                const isCaptcha = await this.isVisible(captcha, { timeout: 1000 }).catch(() => false);
                if (isCaptcha) {
                    console.warn('\n⚠️ [SKIP] CAPTCHA is enabled on screen. Skipping testcase.');
                    test.skip(true, 'Staff Portal login skipped: CAPTCHA is enabled on screen.');
                    return;
                }
                throw new Error('Staff Portal navigation failed: Login page or username field not available.');
            }

            await this.fill(this.usernameTxt, username);
            await this.fill(this.passwordTxt, password);

            if (await this.isVisible(captcha, { timeout: 1000 }).catch(() => false)) {
                await this.click(captcha).catch(() => { });
                const isChecked = await this.verifyAttribute(captcha, "aria-checked", "true", { timeout: 3000 })
                    .then(() => true)
                    .catch(() => false);
                if (!isChecked) {
                    console.warn('\n⚠️ [SKIP] CAPTCHA detected on Staff Portal and unresolved. Skipping testcase.');
                    test.skip(true, 'Staff Portal login skipped: CAPTCHA is enabled on screen.');
                    return;
                }
            }

            await this.click(this.loginBtn);

            // Handle 2FA Email Authentication if prompted
            await this.handleEmailAuthentication();
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForLoadState('load', { timeout: 75000 }).catch(() => { });

            // Check if login was successful
            const isLoginSuccessful = await expect(this.page).toHaveTitle(/Staff Home/i, { timeout: 15000 })
                .then(() => true)
                .catch(() => false);

            if (!isLoginSuccessful) {
                const isCaptcha = await this.isVisible(captcha, { timeout: 1000 }).catch(() => false);
                if (isCaptcha) {
                    console.warn('\n⚠️ [SKIP] Staff Portal login blocked by CAPTCHA. Skipping testcase.');
                    test.skip(true, 'Staff Portal login skipped: CAPTCHA is enabled on screen.');
                    return;
                }
                throw new Error('Staff Portal login failed: Authentication failed / Staff Home did not load.');
            }
        });
    }

    /**
     * Registers a locator handler to automatically dismiss the 'No mobile number on file' modal popup whenever it appears.
    **/
    async closeMobilePopup() {
        await this.page.addLocatorHandler(
            this.mobilePopUp,
            async () => {
                await this.jsClick(this.mobilePopupCloseButton).catch(() => { });
                await this.mobilePopUp.waitFor({ state: 'hidden', timeout: 5000 }).catch(() => { });
            }
        );
    }

    /**
     * Handles 2FA Email Authentication if prompted on Staff Portal login.
     * Delegates to centralized TwoFactorAuthPage.
     */
    async handleEmailAuthentication() {
        await this.twoFactorAuthPage.handleEmailAuthentication();
    }

    /**
* Verifies that the users has successfully logged out and is redirected to the Login page.
**/
    async verifyLogoutSuccessful() {
        await test.step('Verify logout redirected to Login Page', async () => {
            await this.verifyTitle("Login");
            await this.verifyVisible(this.loginBtn, 1000);
        });
        await test.step('Use browser Back button and verify protected CSP pages cannot be accessed without logging in again', async () => {
            await this.page.goBack();
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.verifyTitle("Login");
            await this.verifyVisible(this.loginBtn, 5000);
        });
    }
}

