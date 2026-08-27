import BasePage from '../../../utils/BasePage';
import { test } from '@playwright/test';

/**
 * Page Object representing the Report Center Page in Admin Portal.
 * Handles selecting reports, searching/filtering students by last name, and downloading student report files.
 **/
export default class ReportCenterPage extends BasePage {

    /**
     * Initializes locators for the Report Center Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.selectReportHeading = page.locator('.sorting_disabled');
        this.studentLastName = page.getByRole('textbox', { name: 'Enter Student Last Name' });
        this.filterStudents = page.getByRole('link', { name: 'Filter Students' });
        this.selectStudentBtn = page.getByRole('button', { name: 'Select Student' });
        this.downloadReportBtn = page.locator('a').filter({ hasText: 'Download Report' });
    }

    /**
     * Selects a specific report by clicking its name link in the reports table.
     * @param {string} reportName - The name/title of the report to open.
    **/
    async selectReport(reportName) {
        await test.step(`Select report: "${reportName}"`, async () => {
            await this.verifyVisible(this.selectReportHeading);
            const report = this.page.getByRole('link', { name: reportName });
            await this.verifyVisible(report);
            await this.click(report);
        });
    }

    /**
     * Filters the student list by entering the student's last name and clicking Filter Students.
     * @param {string} lastName - Student's last name.
     **/
    async filterStudent(lastName) {
        await test.step(`Filter students by last name: "${lastName}"`, async () => {
            await this.verifyVisible(this.studentLastName);
            await this.fill(this.studentLastName, lastName);
            await this.click(this.filterStudents);
        });
    }

    /**
     * Selects a student from the filtered student dropdown list.
     * @param {string} studentName - Student's full name to select.
    **/
    async selectStudent(studentName) {
        await test.step(`Select student: "${studentName}"`, async () => {
            await this.click(this.selectStudentBtn);
            const student = this.page.locator('a').filter({ hasText: studentName });
            await this.click(student);
        });
    }

    /**
     * Clicks the Download Report button and waits for the browser download event to complete.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
      **/
    async downloadReport() {
        return await test.step('Click Download Report and wait for file', async () => {
            const downloadPromise = this.page.waitForEvent('download');
            await this.click(this.downloadReportBtn);
            return await downloadPromise;
        });
    }
}