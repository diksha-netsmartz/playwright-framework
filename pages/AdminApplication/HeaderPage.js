const BasePage = require('../../utils/BasePage');

/**
 * Page Object representing the Admin Portal Global Header.
 * Handles top navigation bar actions such as logging out and verifying logout redirection.
  **/
class HeaderPage extends BasePage {

    /**
     * Initializes locators for the Admin Header Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.userMenu = page.locator(".dropdown-user");
        this.logoutBtn = page.getByRole('link', { name: 'Log Out' });
        this.loginHeading = page.getByRole('heading', { name: 'Admin Portal Login' });
        this.helpHeading = page.getByRole('heading', { name: 'Need help logging in?' });
    }

    /**
     * Logs out of the Admin Portal by hovering over the user menu and clicking the Log Out link.
    **/
    async logout() {

        await this.userMenu.hover();
        await this.click(this.logoutBtn);
    }

    /**
     * Verifies that the user has successfully logged out by asserting the login screen headings are visible.
    **/
    async verifyLogoutSuccessful() {
        await this.verifyVisible(this.loginHeading);
        await this.verifyVisible(this.helpHeading);
    }

}

module.exports = HeaderPage;