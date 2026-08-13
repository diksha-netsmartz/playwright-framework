const BasePage = require('../../utils/BasePage');
const config = require('../../config/config');
const {expect} = require("@playwright/test");

class AdminLoginPage extends BasePage {

    constructor(page) {
        super(page);

        this.usernameTxt = page.getByRole('textbox', {name: 'Username'});
        this.passwordTxt = page.getByRole('textbox', {name: 'Password'});
        this.loginBtn = page.getByRole('button', {name: 'Login'});
        this.captchaFrame = page.frameLocator('iframe[title="reCAPTCHA"]').first();
        this.mobilePopUp = page.getByText('No mobile number on file.');
        this.mobilePopupCloseButton = page.locator('.close.closemodalphone');
        this.quickLinks = page.getByText('Quick Links', {exact: true});


    }

    async navigateToLoginPage() {
        await this.navigate(config.baseURL);

    }

    async login(username, password) {
        await this.verifyVisible(this.usernameTxt);
        await this.fill(this.usernameTxt, username);
        await this.fill(this.passwordTxt, password);
        const captcha = this.captchaFrame.locator('#recaptcha-anchor');

        try {
            if (await captcha.isVisible({timeout: 3000})) {
                await captcha.click();
                await expect(captcha).toHaveAttribute("aria-checked", "true");
            }
        } catch (e) {
            console.log('Captcha not present. Continuing login...');
        }

        await this.click(this.loginBtn);
    }

    async closeMobilePopup() {
        await this.verifyVisible(this.mobilePopUp);
        await this.verifyVisible(this.mobilePopupCloseButton);
        await this.click(this.mobilePopupCloseButton);
    }

    async verifyLoginSuccessful() {
        await this.verifyVisible(this.quickLinks);
    }

}

module.exports = AdminLoginPage;