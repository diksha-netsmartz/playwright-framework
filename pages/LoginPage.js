const BasePage = require('../utils/BasePage');
const config = require('../config/config');

class LoginPage extends BasePage {

    constructor(page) {

        super(page);

        this.usernameTxt = page.locator('#userEmail');
        this.passwordTxt = page.locator('#userPassword');
        this.loginBtn = page.locator('#login');


    }

    async navigateToLoginPage() {
        await this.navigate(config.baseURL);
    }

    async login(username, password) {

        await this.fill(this.usernameTxt, username);

        await this.fill(this.passwordTxt, password);

        await this.click(this.loginBtn);

    }

    async verifyLoginSuccessful() {
        // console.log(await this.getPageTitle())
       await  this.verifyTitle("Let's Shop");

    }

}

module.exports = LoginPage;