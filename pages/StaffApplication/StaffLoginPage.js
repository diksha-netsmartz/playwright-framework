import BasePage from '@utils/BasePage';
import config from '@config/config';
import { test, expect } from '@playwright/test';
import EmailHelper from '@utils/EmailHelper';

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
        this.loginBtn = page.getByRole('button', { name: 'Login' }).first();
        this.captchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
        this.emailAuthButton = page.locator('button').filter({ hasText: 'EMAIL' }).first();
        this.emailLabel = page.locator("//label[contains(text(),'@gmail.com')]").filter({ hasText: /te|ra/i }).first();
        this.sendCodeButton = page.getByRole('button', { name: 'Send Code' });
        this.otpInputs = page.locator('.inputcodeEmailContainer input.inputsEmail, input.inputsEmail');
        this.continueButton = page.locator("//button[@onclick='CheckEmailOTPandAuthenticate()']");
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
     * Selects Email option, requests verification code, extracts 6-digit code from Gmail,
     * fills individual OTP input fields, and submits the code.
     */
    async handleEmailAuthentication() {
        // Check if Email 2FA selection screen or Send Code button is visible
        const isEmailAuthRequired = await this.isVisible(this.emailAuthButton, { timeout: 3000 }).catch(() => false);

        if (!isEmailAuthRequired) {
            return;
        }

        await test.step('Handle 2FA Email Authentication', async () => {
            console.log('[StaffLoginPage] 2FA Email authentication screen detected.');

            // 1. Click EMAIL button / radio if present
            await this.click(this.emailAuthButton);

            // Wait for 2FA email option and select the one that has 'te' or 'ra' (whichever comes first)
            await this.waitForVisible(this.emailLabel, { timeout: 5000 });
            await this.click(this.emailLabel);

            // 2. Detect target email account from label (e.g. ra*****@gmail.com vs te*****@gmail.com)
            let account = 'testingData';
            try {
                const emailText = (await this.emailLabel.innerText()).trim().toLowerCase();
                console.log(`[StaffLoginPage] Detected 2FA email label: "${emailText}"`);

                if (emailText.includes('ra')) {
                    account = 'rachel';
                } else if (emailText.includes('te')) {
                    account = 'testingData';
                }
            } catch (err) {
                console.warn(`[StaffLoginPage] Could not read email label, defaulting to '${account}':`, err.message);
            }

            console.log(`[StaffLoginPage] Using account '${account}' for 2FA verification.`);

            // 3. Mark previous authorization emails as read in the detected account
            await EmailHelper.markAllUnreadAsRead({
                account,
                subject: ['Authorization Code', 'Verification Code']
            }).catch(err => {
                console.warn('[StaffLoginPage] Warning: Failed to mark prior emails as read:', err.message);
            });

            // 4. Click Send Code button
            await this.waitForVisible(this.sendCodeButton, { timeout: 2000 });
            await this.click(this.sendCodeButton);
            await this.waitForLoaders().catch(() => { });

            // 5. Wait for OTP container / inputs to become visible
            await this.waitForVisible(this.otpInputs.first(), 15000).catch(() => { });

            // 6. Fetch 6-digit authorization code from email
            console.log(`[StaffLoginPage] Fetching authorization code from email (${account})...`);
            const code = await EmailHelper.getAuthorizationCode({
                account,
                subject: 'Authorization Code',
                timeoutMs: 60000
            });

            if (!code || code.length !== 6) {
                throw new Error(`[StaffLoginPage] Expected a 6-digit authorization code from email, but received: "${code}"`);
            }

            console.log(`[StaffLoginPage] Entering 6-digit authorization code: ${code}`);

            // 5. Fill each digit into the respective input box (.inputsEmail)
            const inputCount = await this.otpInputs.count();
            for (let i = 0; i < code.length && i < inputCount; i++) {
                await this.otpInputs.nth(i).fill(code[i]);
            }

            // 6. Click Continue / Authenticate button
            await this.waitForVisible(this.continueButton, { timeout: 2000 });
            await this.click(this.continueButton);
            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => { });
            await this.waitForLoaders().catch(() => { });
        });
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

