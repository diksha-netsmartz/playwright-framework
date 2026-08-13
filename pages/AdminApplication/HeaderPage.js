const BasePage = require('../../utils/BasePage');

class HeaderPage extends BasePage {

    constructor(page) {
        super(page);

        this.userMenu = page.locator(".dropdown-user");
        this.logoutBtn = page.getByRole('link', {name: 'Log Out'});
        this.loginHeading = page.getByRole('heading', {name: 'Admin Portal Login'});
        this.helpHeading = page.getByRole('heading', {name: 'Need help logging in?'});
    }

    async logout() {

        await this.userMenu.hover();
        await this.click(this.logoutBtn);
    }

    async verifyLogoutSuccessful() {
        await this.verifyVisible(this.loginHeading);
        await this.verifyVisible(this.helpHeading);
    }

}

module.exports = HeaderPage;