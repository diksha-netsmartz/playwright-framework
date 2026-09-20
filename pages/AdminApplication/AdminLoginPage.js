import BasePage from '@utils/BasePage';
import config from '@config/config';
import { expect, test } from "@playwright/test";
import TwoFactorAuthPage from '@pages/Common/TwoFactorAuthPage';

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

        this.twoFactorAuthPage = new TwoFactorAuthPage(page);
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
     * If CAPTCHA blocks authentication, the testcase is skipped. If navigation or login fails, an error is thrown.
     * @param {string} username - Admin username.
     * @param {string} password - Admin password.
    **/
    async login(username, password) {
        await test.step(`Login to Admin Portal with user: ${username}`, async () => {
            await this.closeMobilePopup();

            const isUserVisible = await this.isVisible(this.usernameTxt, { timeout: 10000 }).catch(() => false);
            const captcha = this.captchaFrame.locator('#recaptcha-anchor');
            if (!isUserVisible) {
                const isCaptcha = await this.isVisible(captcha, { timeout: 1000 }).catch(() => false);
                if (isCaptcha) {
                    console.warn('\n⚠️ [SKIP] CAPTCHA is enabled on screen. Skipping testcase.');
                    test.skip(true, 'Admin Portal login skipped: CAPTCHA is enabled on screen.');
                    return;
                }
                throw new Error('Admin Portal navigation failed: Login page or username field not available.');
            }

            await this.fill(this.usernameTxt, username);
            await this.fill(this.passwordTxt, password);

            if (await this.isVisible(captcha, { timeout: 1000 }).catch(() => false)) {
                await this.click(captcha).catch(() => { });
                const isChecked = await this.verifyAttribute(captcha, "aria-checked", "true", { timeout: 3000 })
                    .then(() => true)
                    .catch(() => false);
                if (!isChecked) {
                    console.warn('\n⚠️ [SKIP] CAPTCHA detected on Admin Portal and unresolved. Skipping testcase.');
                    test.skip(true, 'Admin Portal login skipped: CAPTCHA is enabled on screen.');
                    return;
                }
            }

            await this.click(this.loginBtn);

            // Handle 2FA Email Authentication if prompted
            await this.handleEmailAuthentication();
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForLoadState('load', { timeout: 90000 }).catch(() => { });

            // Check if login was successful
            const isLoginSuccessful = await expect(this.page).toHaveTitle(/Home Page/i, { timeout: 15000 })
                .then(() => true)
                .catch(async () => {
                    return await this.quickLinks.isVisible({ timeout: 5000 }).catch(() => false);
                });

            if (!isLoginSuccessful) {
                const isCaptcha = await this.isVisible(captcha, { timeout: 1000 }).catch(() => false);
                if (isCaptcha) {
                    console.warn('\n⚠️ [SKIP] Admin Portal login blocked by CAPTCHA. Skipping testcase.');
                    test.skip(true, 'Admin Portal login skipped: CAPTCHA is enabled on screen.');
                    return;
                }
                throw new Error('Admin Portal login failed: Authentication failed / Home Page did not load.');
            }
        });
    }

    /**
     * Closes the 'No mobile number on file' modal popup if it appears after login.
    **/
    async closeMobilePopup() {
        await this.page.addLocatorHandler(
            this.mobilePopUp,
            async () => {
                await this.mobilePopupCloseButton.click();
            }
        );

    }

    /**
     * Handles 2FA Email Authentication if prompted on Admin Portal login.
     * Delegates to centralized TwoFactorAuthPage.
     */
    async handleEmailAuthentication() {
        await this.twoFactorAuthPage.handleEmailAuthentication('rachel');
    }
}