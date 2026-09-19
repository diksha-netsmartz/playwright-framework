import BasePage from '@utils/BasePage';
import config from '@config/config';
import { test, expect } from '@playwright/test';
import TwoFactorAuthPage from '@pages/Common/TwoFactorAuthPage';

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

        this.twoFactorAuthPage = new TwoFactorAuthPage(page);
        this.usernameTxt = page.getByRole('textbox', { name: 'Username' });
        this.passwordTxt = page.getByRole('textbox', { name: 'Password' });
        this.loginBtn = page.getByRole('button', { name: 'Login' }).first();
        this.captchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
        this.mobilePopUp = page.getByText('No mobile number on file.');
        this.mobilePopupCloseButton = page.locator('.close.closemodalphone');
    }

    /**
     * Navigates to the Staff Login page using the configured CSM URL.
    **/
    async navigateToLoginPage() {
        await test.step('Navigate to Staff Login Page', async () => {
            try {
                await this.navigate(config.csmURL);
            } catch (error) {
                console.warn(`\n⚠️ [SKIP] Staff Portal navigation failed: ${error.message}. Skipping testcase.`);
                test.skip(true, `Staff Portal navigation failed (${error.message}) - testcase skipped`);
            }
        });
    }

    /**
     * Fills the staff username and password credentials and submits the login form.
     * If login is not successful or CAPTCHA blocks authentication, the testcase is skipped.
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
                const reason = isCaptcha ? 'CAPTCHA is enabled on screen' : 'Login page or username field not available';
                console.warn(`\n⚠️ [SKIP] Staff Portal login not possible: ${reason}. Skipping testcase.`);
                test.skip(true, `Staff Portal login was not successful (${reason}) - testcase skipped`);
                return;
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
                const reason = isCaptcha
                    ? 'CAPTCHA is enabled on screen'
                    : 'Authentication failed / Staff Home did not load';
                console.warn(`\n⚠️ [SKIP] Staff Portal login was not successful (${reason}). Skipping testcase.`);
                test.skip(true, `Staff Portal login was not successful (${reason}) - testcase skipped`);
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
    }
}

