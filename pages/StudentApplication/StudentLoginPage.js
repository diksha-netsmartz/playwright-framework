import BasePage from '../../utils/BasePage';
import config from '../../config/config';
import { test } from '@playwright/test';

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
        this.mobilePopUp = page.getByText('No mobile number on file.');
        this.mobilePopupCloseButton = page.locator('.close.closemodalphone');
        this.signtuaresPopupCloseButton = page.locator('#btnHideStudentSignPopUpForCRSessions');
    }

    /**
     * Navigates to the Student Login Page using the configured CSP URL.
    **/
    async navigateToLoginPage() {
        await test.step('Navigate to Student Login Page (CSP)', async () => {
            await this.navigate(config.cspURL);
        });
    }

    /**
     * Fills the username and password fields and submits the login form.
     * @param {string} username - Student account username.
     * @param {string} password - Student account password.
    **/
    async login(username, password) {
        await test.step(`Login to Student Portal with user: ${username}`, async () => {
            await this.closeMobilePopup();
            await this.closeSignaturesPopup();
            await this.verifyVisible(this.usernameTxt);
            await this.fill(this.usernameTxt, username);
            await this.fill(this.passwordTxt, password);
            await this.click(this.loginBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 75000 });
            await this.verifyVisible(this.profileDropdownOnHomepage);
            await this.verifyTitle("Student Home");
        });
    }

    /**
     * Registers a locator handler to automatically dismiss the 'No mobile number on file' modal popup whenever it appears.
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
}


