const BasePage = require('../../utils/BasePage');
const config = require('../../config/config');

/**
 * Page Object representing the Staff Portal Login Page.
 * Handles navigation to staff login URL and user authentication.
  **/
class StaffLoginPage extends BasePage {

    /**
     * Initializes locators for the Staff Login Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.usernameTxt = page.getByRole('textbox', { name: 'Username' });
        this.passwordTxt = page.getByRole('textbox', { name: 'Password' });
        this.loginBtn = page.getByRole('button', { name: 'Login' });
    }

    /**
     * Navigates to the Staff Login page using the configured CSM URL.
    **/
    async navigateToLoginPage() {
        await this.navigate(config.csmURL);
    }

    /**
     * Fills the staff username and password credentials and submits the login form.
     * @param {string} username - Staff username.
     * @param {string} password - Staff password.
    **/
    async login(username, password) {
        await this.verifyVisible(this.usernameTxt);
        await this.fill(this.usernameTxt, username);
        await this.fill(this.passwordTxt, password);
        await this.click(this.loginBtn);
        await this.verifyTitle("Staff Home");
        await this.waitForLoaders();
    }

}

module.exports = StaffLoginPage;
