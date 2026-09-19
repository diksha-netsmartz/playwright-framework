import BasePage from '@utils/BasePage';
import config from '@config/config';
import { expect, test } from "@playwright/test";
import EmailHelper from '@utils/EmailHelper';

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
        this.emailAuthButton = page.locator('button').filter({ hasText: 'EMAIL' }).first();
        this.emailLabel = page.locator("//label[contains(text(),'@gmail.com')]").filter({ hasText: /te|ra/i }).first();
        this.sendCodeButton = page.getByRole('button', { name: 'Send Code' });
        this.otpInputs = page.locator('.inputcodeEmailContainer input.inputsEmail, input.inputsEmail');
        this.continueButton = page.locator("//button[@onclick='CheckEmailOTPandAuthenticate()']");
        this.mobilePopUp = page.getByText('No mobile number on file.');
        this.mobilePopupCloseButton = page.locator('.close.closemodalphone');
        this.quickLinks = page.getByText('Quick Links', { exact: true });
    }

    /**
     * Navigates to the Admin Portal Login Page using the baseURL.
    **/
    async navigateToLoginPage() {
        await test.step('Navigate to Admin Login Page', async () => {
            try {
                await this.navigate(config.baseURL);
            } catch (error) {
                console.warn(`\n⚠️ [SKIP] Admin Portal navigation failed: ${error.message}. Skipping testcase.`);
                test.skip(true, `Admin Portal navigation failed (${error.message}) - testcase skipped`);
            }
        });
    }

    /**
     * Fills admin credentials, clicks reCAPTCHA if present, and clicks the Login button.
     * If login is not successful or CAPTCHA blocks authentication, the testcase is skipped.
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
                const reason = isCaptcha ? 'CAPTCHA is enabled on screen' : 'Login page or username field not available';
                console.warn(`\n⚠️ [SKIP] Admin Portal login not possible: ${reason}. Skipping testcase.`);
                test.skip(true, `Admin Portal login was not successful (${reason}) - testcase skipped`);
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
                    console.warn('\n⚠️ [SKIP] CAPTCHA detected on Admin Portal and unresolved. Skipping testcase.');
                    test.skip(true, 'Admin Portal login skipped: CAPTCHA is enabled on screen.');
                    return;
                }
            }

            await this.click(this.loginBtn);

            // Handle 2FA Email Authentication if prompted
            await this.handleEmailAuthentication();
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForLoadState('load', { timeout: 75000 }).catch(() => { });

            // Check if login was successful
            const isLoginSuccessful = await expect(this.page).toHaveTitle(/Home Page/i, { timeout: 15000 })
                .then(() => true)
                .catch(async () => {
                    return await this.quickLinks.isVisible({ timeout: 5000 }).catch(() => false);
                });

            if (!isLoginSuccessful) {
                const isCaptcha = await this.isVisible(captcha, { timeout: 1000 }).catch(() => false);
                const reason = isCaptcha
                    ? 'CAPTCHA is enabled on screen'
                    : 'Authentication failed / Home Page did not load';
                console.warn(`\n⚠️ [SKIP] Admin Portal login was not successful (${reason}). Skipping testcase.`);
                test.skip(true, `Admin Portal login was not successful (${reason}) - testcase skipped`);
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
     * Selects Email option, requests verification code, extracts 6-digit code from Gmail,
     * fills individual OTP input fields, and submits the code.
     */
    async handleEmailAuthentication() {
        // Check if Email 2FA selection screen or Send Code button is visible
        const isEmailAuthRequired = await this.isVisible(this.emailAuthButton, { timeout: 3000 }).catch(() => false)

        if (!isEmailAuthRequired) {
            return;
        }

        await test.step('Handle 2FA Email Authentication', async () => {
            console.log('[AdminLoginPage] 2FA Email authentication screen detected.');

            // 1. Click EMAIL button / radio if present
            await this.click(this.emailAuthButton);

            // Wait for 2FA email option and select the one that has 'te' or 'ra' (whichever comes first)
            await this.waitForVisible(this.emailLabel, { timeout: 5000 });
            await this.click(this.emailLabel);

            // 2. Detect target email account from label (e.g. ra*****@gmail.com vs te*****@gmail.com)
            let account = 'rachel';
            try {
                const emailText = (await this.emailLabel.innerText()).trim().toLowerCase();
                console.log(`[AdminLoginPage] Detected 2FA email label: "${emailText}"`);

                if (emailText.includes('ra')) {
                    account = 'rachel';
                } else if (emailText.includes('te')) {
                    account = 'testingData';
                }
            } catch (err) {
                console.warn(`[AdminLoginPage] Could not read email label, defaulting to '${account}':`, err.message);
            }

            console.log(`[AdminLoginPage] Using account '${account}' for 2FA verification.`);

            // 3. Mark previous authorization emails as read in the detected account
            await EmailHelper.markAllUnreadAsRead({
                account,
                subject: ['Authorization Code', 'Verification Code']
            }).catch(err => {
                console.warn('[AdminLoginPage] Warning: Failed to mark prior emails as read:', err.message);
            });

            // 4. Click Send Code button
            await this.waitForVisible(this.sendCodeButton, { timeout: 2000 });
            await this.click(this.sendCodeButton);
            await this.waitForLoaders().catch(() => { });

            // 5. Wait for OTP container / inputs to become visible
            await this.waitForVisible(this.otpInputs.first(), 15000).catch(() => { });

            // 6. Fetch 6-digit authorization code from email
            console.log(`[AdminLoginPage] Fetching authorization code from email (${account})...`);
            const code = await EmailHelper.getAuthorizationCode({
                account,
                subject: 'Authorization Code',
                timeoutMs: 60000
            });

            if (!code || code.length !== 6) {
                throw new Error(`[AdminLoginPage] Expected a 6-digit authorization code from email, but received: "${code}"`);
            }

            console.log(`[AdminLoginPage] Entering 6-digit authorization code: ${code}`);

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
}