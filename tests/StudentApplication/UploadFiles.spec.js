import {test} from '@playwright/test';
import StudentLoginPage from '../../pages/StudentApplication/StudentLoginPage';
import LoginPage from '../../pages/AdminApplication/AdminLoginPage';
import login from '../../test-data/login.json';
import StudentHomePage from '../../pages/StudentApplication/StudentPortalHomePage';
import AdminHomePage from '../../pages/AdminApplication/AdminPortalHomePage'


test('Upload file from student portal and verify in admin uploaded files widget', async ({page}) => {

    const studentLoginPage = new StudentLoginPage(page);
    const studentHomePage = new StudentHomePage(page);
    const loginPage = new LoginPage(page);
    const adminHomePage = new AdminHomePage(page);

    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(login.studentUser.username, login.studentUser.password);
    await studentHomePage.uploadFile('test-data/UploadFile.jpg');
    await studentHomePage.verifyUploadSuccess();
    await loginPage.navigateToLoginPage();
    await loginPage.login(login.validUser.username, login.validUser.password);
    await adminHomePage.clickShowFilesToConfirm();

});
