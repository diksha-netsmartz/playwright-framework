import BasePage from '@utils/BasePage';
import { test } from '@playwright/test';
import EmailHelper from '@utils/EmailHelper';

/**
 * Page Object for automating Two-Factor Authentication (2FA) via Email OTP.
 * Shared across Admin, Staff, and Student portals.
 * Extends BasePage to utilize framework wait, visibility, and click helpers.
 */
export default class TwoFactorAuthPage extends BasePage {

    /**
     * Initializes locators for Two-Factor Authentication.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     */
    constructor(page) {
        super(page);

        this.emailAuthButton = page.locator('button').filter({ hasText: 'EMAIL' }).first();
        this.emailLabel = page.locator("//label[contains(text(),'@gmail.com')]").filter({ hasText: /te|ra/i }).first();
        this.sendCodeButton = page.getByRole('button', { name: /Send.*Code/i }).first();
        this.otpInputs = page.locator('.inputcodeEmailContainer input.inputsEmail, input.inputsEmail');
        this.continueButton = page.locator("//button[@onclick='CheckEmailOTPandAuthenticate()']");
        this.wrongOtpError = page.getByText(/Authentication code entered is not correct/i).filter({ visible: true })
    }

    /**
     * Handles 2FA Email Authentication if prompted on Portal login.
     * Selects Email option, requests verification code, extracts 6-digit code from Gmail,
     * fills individual OTP input fields, and submits the code.
     * Retries up to 3 times if wrong OTP error appears.
     * 
     * @param {string} [defaultAccount='testingData'] - Fallback email account ('rachel' or 'testingData').
     */
    async handleEmailAuthentication(defaultAccount = 'testingData') {
        const isEmailAuthRequired = await this.isVisible(this.emailAuthButton, { timeout: 3000 }).catch(() => false);

        if (!isEmailAuthRequired) {
            return;
        }

        await test.step('Handle 2FA Email Authentication', async () => {
            console.log('[TwoFactorAuthPage] 2FA Email authentication screen detected.');

            // 1. Click EMAIL button / radio if present
            await this.click(this.emailAuthButton);

            // Wait for 2FA email option and select the one that has 'te' or 'ra'
            await this.waitForVisible(this.emailLabel, { timeout: 5000 });
            await this.click(this.emailLabel);

            // 2. Detect target email account from label
            let account = defaultAccount;
            try {
                const emailText = (await this.emailLabel.innerText()).trim().toLowerCase();
                console.log(`[TwoFactorAuthPage] Detected 2FA email label: "${emailText}"`);

                if (emailText.includes('ra')) {
                    account = 'rachel';
                } else if (emailText.includes('te')) {
                    account = 'testingData';
                }
            } catch (err) {
                console.warn(`[TwoFactorAuthPage] Could not read email label, defaulting to '${account}':`, err.message);
            }

            console.log(`[TwoFactorAuthPage] Using account '${account}' for 2FA verification.`);

            // Retry up to 3 times if wrong OTP error appears
            for (let attempt = 1; attempt <= 3; attempt++) {
                // Mark previous authorization emails as read
                await EmailHelper.markAllUnreadAsRead({
                    account,
                    subject: ['Authorization Code', 'Verification Code']
                }).catch(() => { });

                // Wait for send code button to not contain 'disabled' in class (60s timeout so cooldown won't fail it)
                await this.waitForVisible(this.sendCodeButton, { timeout: 10000 });
                await this.sendCodeButton.and(this.page.locator(':not(.disabled)')).waitFor({ state: 'visible', timeout: 60000 }).catch(() => { });

                // Click Send Code button
                await this.click(this.sendCodeButton);
                await this.waitForLoaders().catch(() => { });

                // Wait for OTP container / inputs to become visible
                await this.waitForVisible(this.otpInputs.first(), 15000).catch(() => { });

                // Fetch 6-digit authorization code from email
                console.log(`[TwoFactorAuthPage] Fetching authorization code from email (${account}) [Attempt ${attempt}/3]...`);
                const code = await EmailHelper.getAuthorizationCode({
                    account,
                    subject: 'Authorization Code',
                    timeoutMs: 60000
                });

                if (!code || code.length !== 6) {
                    throw new Error(`[TwoFactorAuthPage] Expected a 6-digit authorization code from email, but received: "${code}"`);
                }

                console.log(`[TwoFactorAuthPage] Entering 6-digit authorization code: ${code}`);

                // Fill each digit into the respective input box
                const inputCount = await this.otpInputs.count();
                for (let i = 0; i < code.length && i < inputCount; i++) {
                    await this.otpInputs.nth(i).clear().catch(() => { });
                    await this.otpInputs.nth(i).fill(code[i]);
                }

                // Click Continue / Authenticate button
                await this.waitForVisible(this.continueButton, { timeout: 5000 });
                await this.click(this.continueButton);
                await this.waitForLoaders().catch(() => { });

                // Check if "Authentication code entered is not correct." appeared
                const isWrongOtp = await this.wrongOtpError.waitFor({ state: 'visible', timeout: 5000 })
                    .then(() => true)
                    .catch(() => false);

                if (!isWrongOtp) {
                    console.log(`[TwoFactorAuthPage] 2FA verification succeeded on attempt ${attempt}.`);
                    break;
                }

                console.warn(`[TwoFactorAuthPage] Attempt ${attempt} failed: Authentication code entered is not correct. Retrying...`);
                if (attempt === 3) {
                    throw new Error('[TwoFactorAuthPage] Authentication code entered is not correct after 3 attempts.');
                }
            }

            await this.page.waitForLoadState('load', { timeout: 30000 }).catch(() => { });
            await this.waitForLoaders().catch(() => { });
        });
    }
}
