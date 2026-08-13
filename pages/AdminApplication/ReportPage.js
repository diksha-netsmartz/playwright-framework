const BasePage = require('../../utils/BasePage');

class ReportCenterPage extends BasePage {

    constructor(page) {
        super(page);

        this.selectReportHeading = page.locator('.sorting_disabled');
        this.studentLastName = page.getByRole('textbox', {name: 'Enter Student Last Name'});
        this.filterStudents = page.getByRole('link', {name: 'Filter Students'});
        this.selectStudentBtn = page.getByRole('button', {name: 'Select Student'});
        this.downloadReportBtn = page.locator('a').filter({hasText: 'Download Report'});
    }


    async selectReport(reportName) {

        await this.verifyVisible(this.selectReportHeading);
        const report = this.page.getByRole('link', {name: reportName});
        await this.verifyVisible(report);
        await this.click(report);

    }

    async filterStudent(lastName) {
        await this.verifyVisible(this.studentLastName);
        await this.fill(this.studentLastName, lastName);
        await this.click(this.filterStudents);

    }

    async selectStudent(studentName) {
        await this.click(this.selectStudentBtn);
        const student = this.page.locator('a').filter({hasText: studentName});
        await this.click(student);
    }

    async downloadReport() {

        const downloadPromise = this.page.waitForEvent('download');
        await this.click(this.downloadReportBtn);
        return await downloadPromise;
    }

}

module.exports = ReportCenterPage;