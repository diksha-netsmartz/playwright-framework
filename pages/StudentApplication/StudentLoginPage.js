import BasePage from '../../utils/BasePage';
import config from '../../config/config';

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
        this.profileDropdownOnHomepage = page.locator("#userprofileSettings");
    }

    /**
     * Navigates to the Student Login Page using the configured CSP URL.
    **/
    async navigateToLoginPage() {
        await this.navigate(config.cspURL);
    }

    /**
     * Fills the username and password fields and submits the login form.
     * @param {string} username - Student account username.
     * @param {string} password - Student account password.
    **/
    async login(username, password) {
        await this.verifyVisible(this.usernameTxt);
        await this.fill(this.usernameTxt, username);
        await this.fill(this.passwordTxt, password);
        await this.click(this.loginBtn);
        await this.verifyTitle("Student Home");
        await this.waitForLoaders();
        await this.verifyVisible(this.profileDropdownOnHomepage);
        await this.page.waitForLoadState('load', { timeout: 75000 })
    }

}
