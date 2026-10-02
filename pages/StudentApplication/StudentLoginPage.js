import BasePage from '@utils/BasePage';
import config from '@config/config';
import { test, expect } from '@playwright/test';
import TwoFactorAuthPage from '@pages/Common/TwoFactorAuthPage';
import StudentPortalHomePage from './StudentPortalHomePage';

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

        this.twoFactorAuthPage = new TwoFactorAuthPage(page);
        this.studentHomePage = new StudentPortalHomePage(page);
        this.usernameTxt = page.getByRole('textbox', { name: 'Username' });
        this.passwordTxt = page.getByRole('textbox', { name: 'Password' });
        this.loginBtn = page.getByRole('button', { name: 'Login' });
        this.captchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
        this.profileDropdownOnHomepage = page.locator("#userprofileSettings");
        this.mobilePopUp = page.getByText('No mobile number on file.');
        this.mobilePopupCloseButton = page.locator('.close.closemodalphone');
        this.signtuaresPopupCloseButton = page.locator('#btnHideStudentSignPopUpForCRSessions');
    }

    /**
     * Navigates to the Student Login Page using the configured CSP URL.
    **/
    async navigateToLoginPage() {
        await test.step('Navigate to Student Login Page (CSP)', async () => {
            const response = await this.navigate(config.cspURL);
            await this.skipIfServerError(response, 'Student Portal');
        });
    }

    /**
     * Fills the username and password fields and submits the login form.
     * If CAPTCHA blocks authentication, the testcase is skipped. If navigation or login fails, an error is thrown.
     * @param {string} username - Student account username.
     * @param {string} password - Student account password.
    **/
    async login(username, password) {
        await test.step(`Login to Student Portal with user: ${username}`, async () => {
            await this.skipIfServerError(null, 'Student Portal');
            await this.closeMobilePopup();
            await this.closeSignaturesPopup();

            const isUserVisible = await this.isVisible(this.usernameTxt, { timeout: 10000 }).catch(() => false);
            const captcha = this.captchaFrame.locator('#recaptcha-anchor');
            if (!isUserVisible) {
                await this.skipIfServerError(null, 'Student Portal');
                const isCaptcha = await this.isVisible(captcha, { timeout: 1000 }).catch(() => false);
                if (isCaptcha) {
                    console.warn('\n⚠️ [SKIP] CAPTCHA is enabled on screen. Skipping testcase.');
                    await this.skipWithScreenshot('Student Portal login skipped: CAPTCHA is enabled on screen.');
                    return;
                }
                throw new Error('Student Portal navigation failed: Login page or username field not available.');
            }

            await this.fill(this.usernameTxt, username);
            await this.fill(this.passwordTxt, password);

            if (await this.isVisible(captcha, { timeout: 1000 }).catch(() => false)) {
                await this.click(captcha).catch(() => { });
                const isChecked = await this.verifyAttribute(captcha, "aria-checked", "true", { timeout: 3000 })
                    .then(() => true)
                    .catch(() => false);
                if (!isChecked) {
                    console.warn('\n⚠️ [SKIP] CAPTCHA detected on Student Portal and unresolved. Skipping testcase.');
                    await this.skipWithScreenshot('Student Portal login skipped: CAPTCHA is enabled on screen.');
                    return;
                }
            }

            await this.click(this.loginBtn);

            // Handle 2FA Email Authentication if prompted
            await this.handleEmailAuthentication();
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForLoadState('load', { timeout: 75000 }).catch(() => { });

            // Check if login was successful
            const isLoginSuccessful = await expect(this.page).toHaveTitle(/Student Home/i, { timeout: 15000 })
                .then(() => true)
                .catch(async () => {
                    return await this.profileDropdownOnHomepage.isVisible({ timeout: 5000 }).catch(() => false);
                });

            if (!isLoginSuccessful) {
                const isCaptcha = await this.isVisible(captcha, { timeout: 1000 }).catch(() => false);
                if (isCaptcha) {
                    console.warn('\n⚠️ [SKIP] Student Portal login blocked by CAPTCHA. Skipping testcase.');
                    await this.skipWithScreenshot('Student Portal login skipped: CAPTCHA is enabled on screen.');
                    return;
                }
                throw new Error('Student Portal login failed: Authentication failed / Student Home did not load.');
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
                await this.click(this.mobilePopupCloseButton);
                await this.waitForLoaders();
                await this.waitForHidden(this.mobilePopupCloseButton);
            }
        );
    }

    /**
     * Registers a locator handler to automatically dismiss the 'Signatures' modal popup whenever it appears.
    **/
    async closeSignaturesPopup() {
        await this.page.addLocatorHandler(
            this.signtuaresPopupCloseButton,
            async () => {
                await this.signtuaresPopupCloseButton.click();
            }
        );
    }

    /**
     * Handles 2FA Email Authentication if prompted on Student Portal login.
     * Delegates to centralized TwoFactorAuthPage.
     */
    async handleEmailAuthentication() {
        await this.twoFactorAuthPage.handleEmailAuthentication();
    }
}


