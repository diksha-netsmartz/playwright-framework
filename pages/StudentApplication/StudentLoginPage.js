const BasePage = require('../../utils/BasePage');
const config = require('../../config/config');

class StudentLoginPage extends BasePage {

    constructor(page) {
        super(page);

        this.usernameTxt = page.getByRole('textbox', {name: 'Username'});
        this.passwordTxt = page.getByRole('textbox', {name: 'Password'});
        this.loginBtn = page.getByRole('button', {name: 'Login'});
    }

    async navigateToLoginPage() {
        await this.navigate(config.cspURL);
    }

    async login(username, password) {
        await this.verifyVisible(this.usernameTxt);
        await this.fill(this.usernameTxt, username);
        await this.fill(this.passwordTxt, password);
        await this.click(this.loginBtn);
    }

}

module.exports = StudentLoginPage;
