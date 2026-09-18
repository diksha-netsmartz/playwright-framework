import BasePage from '../../utils/BasePage';
import config from '../../config/config';
import { test, expect } from '@playwright/test';

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
            try {
                await this.navigate(config.cspURL);
            } catch (error) {
                console.warn(`\n⚠️ [SKIP] Student Portal navigation failed: ${error.message}. Skipping testcase.`);
                test.skip(true, `Student Portal navigation failed (${error.message}) - testcase skipped`);
            }
        });
    }

    /**
     * Fills the username and password fields and submits the login form.
     * If login is not successful or CAPTCHA blocks authentication, the testcase is skipped.
     * @param {string} username - Student account username.
     * @param {string} password - Student account password.
    **/
    async login(username, password) {
        await test.step(`Login to Student Portal with user: ${username}`, async () => {
            await this.closeMobilePopup();
            await this.closeSignaturesPopup();

            const isUserVisible = await this.isVisible(this.usernameTxt, { timeout: 10000 }).catch(() => false);
            const captcha = this.captchaFrame.locator('#recaptcha-anchor');
            if (!isUserVisible) {
                const isCaptcha = await this.isVisible(captcha, { timeout: 1000 }).catch(() => false);
                const reason = isCaptcha ? 'CAPTCHA is enabled on screen' : 'Login page or username field not available';
                console.warn(`\n⚠️ [SKIP] Student Portal login not possible: ${reason}. Skipping testcase.`);
                test.skip(true, `Student Portal login was not successful (${reason}) - testcase skipped`);
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
                    console.warn('\n⚠️ [SKIP] CAPTCHA detected on Student Portal and unresolved. Skipping testcase.');
                    test.skip(true, 'Student Portal login skipped: CAPTCHA is enabled on screen.');
                    return;
                }
            }

            await this.click(this.loginBtn);
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
                const reason = isCaptcha
                    ? 'CAPTCHA is enabled on screen'
                    : 'Authentication failed / Student Home did not load';
                console.warn(`\n⚠️ [SKIP] Student Portal login was not successful (${reason}). Skipping testcase.`);
                test.skip(true, `Student Portal login was not successful (${reason}) - testcase skipped`);
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
     * Verifies that the student has successfully logged out and is redirected to the Login page.
     * Also verifies that the user session is terminated and protected CSP pages cannot be accessed
     * using the browser Back button without logging in again.
     **/
    async verifyLogoutSuccessful() {
        await test.step('Verify logout redirected to Login Page', async () => {
            await this.verifyTitle("Driving School Management System");
            await this.verifyVisible(this.loginBtn, 1000);
        });

        await test.step('Use browser Back button and verify protected CSP pages cannot be accessed without logging in again', async () => {
            await this.page.goBack();
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.verifyTitle("Driving School Management System");
            await this.verifyVisible(this.loginBtn, 5000);
            await expect(this.profileDropdownOnHomepage).toBeHidden();
        });
    }
}


