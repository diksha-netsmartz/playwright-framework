const { test } = require('@playwright/test');

const LoginPage = require('../pages/LoginPage');

const loginData = require('../test-data/login.json');

test('Verify valid user login', async ({ page }) => {

    const loginPage = new LoginPage(page);

    await loginPage.navigateToLoginPage();

    await loginPage.login(
        loginData.validUser.username,
        loginData.validUser.password
    );

    await loginPage.verifyLoginSuccessful();

});