import {expect} from "@playwright/test";
import LoginPage from "../../pages/AdminApplication/AdminLoginPage";
import ReportCenterPage from "../../pages/AdminApplication/ReportPage";
import HeaderPage from "../../pages/AdminApplication/HeaderPage";
import HomePage from "../../pages/AdminApplication/AdminPortalHomePage";
// import reportData from "../pages/ReportPage";
import login from "../../test-data/login.json";
import reportData from "../../test-data/reportData.json"

const {test} = require('@playwright/test');

test('Download OH Classroom Training Report', async ({page}, testInfo) => {

    const loginPage = new LoginPage(page);
    const homePage = new HomePage(page);
    const reportPage = new ReportCenterPage(page);
    const header = new HeaderPage(page);
    // const login = require('../test-data/login.json');

    await loginPage.navigateToLoginPage();

    await loginPage.login(
        login.validUser.username,
        login.validUser.password
    );

    await loginPage.closeMobilePopup();

    await homePage.navigateToReportSection("Business Reports");

    await reportPage.selectReport("911 OH Classroom Training Report");

    await reportPage.filterStudent(reportData.studentLastName);

    await reportPage.selectStudent(reportData.studentName);

    const download = await reportPage.downloadReport();

    const fileName = download.suggestedFilename();
    const savePath = `test-results/${fileName}`;

    await download.saveAs(savePath);
    console.log(savePath);
    expect(await download.failure()).toBeNull();

    await testInfo.attach(fileName, {
        path: savePath,
        contentType: 'application/pdf'
    });
    await header.logout();

    await header.verifyLogoutSuccessful();

});