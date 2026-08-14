const BasePage = require("../../utils/BasePage");
const {expect} = require("@playwright/test");

class AdminPortalHomePage extends BasePage {

    constructor(page) {
        super(page);

        // Main Menu
        this.reportCenter = page.locator("#ReportCenterSideMenu");
        this.schedulingMenu = page.locator("#li_scheduingmenu");
        this.newStudentEnrollment = page.locator('strong:has-text("New Student Enrollment")')

        // Scheduling
        this.singleInstructorLink = page
            .locator("#scheduling_SingleInstructor_li")
            .getByRole("link", {
                name: "Single Instructor"
            });

        this.studentAccount = page.getByRole('link', {
            name: 'Student Account '
        });

        this.enrollmentBilling = page.getByRole('link', {
            name: 'Enrollment/Billing'
        });

        // Manage Time Slots
        this.manageTimeSlotsLink = page.locator('b').filter({hasText: 'Manage Time Slots'})
        this.bulkAppointmentLink = page.getByRole('link', {name: 'Bulk Appointment'});

        // Non Graphical
        this.nonGraphicalLink = page.getByRole('link', {name: 'Non Graphical'});

        // Uploaded Files widget
        this.uploadedFilesWidget = page.getByText('Uploaded Files', {exact: true});
        this.showFilesToConfirmBtn = page.getByRole('button', {name: 'Show Files to Confirm'});
        this.filePreviewIcon = page.getByTitle('File Preview', {exact: true}).first();
        this.selectCategoryButton = page.getByRole('button', {name: 'Select Category'});
        this.selectCategoryDropdownCheckbox = page.locator("xpath=//input[@type='checkbox' and contains(@class,'Document')]//following-sibling::ins[1]");
        this.confirmButton = page.locator('#btnConfirmFile:visible');
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.sendButton = page.locator("xpath=//button[@onclick='SendFileConfirmedEmail()' and text()='SEND']");

    }

    // Dynamic Locator
    getReportSection(sectionName) {
        return this.page.locator(
            `.ReportCenter_${sectionName.replaceAll(" ", "")}`
        );
    }

    async navigateToReportSection(sectionName) {
        await this.click(this.reportCenter);

        const reportSection = this.getReportSection(sectionName);

        await this.verifyVisible(reportSection);
        await this.click(reportSection);
    }

    async navigateToSingleInstructor() {
        await this.click(this.schedulingMenu);
        await this.click(this.singleInstructorLink);
    }

    async navigateToNewStudentEnrollment() {
        await this.click(this.newStudentEnrollment);
    }

    async openEnrollmentBilling() {
        await this.studentAccount.click();
        await this.enrollmentBilling.click();
    }

    async navigateToBulkAppointment() {
        await this.click(this.schedulingMenu);
        await this.click(this.manageTimeSlotsLink);
        await this.click(this.bulkAppointmentLink);
    }

    async navigateToNonGraphical() {
        await this.click(this.schedulingMenu);
        await this.click(this.nonGraphicalLink);
    }


    async clickShowFilesToConfirm() {
        await this.verifyVisible(this.uploadedFilesWidget);
        await this.click(this.showFilesToConfirmBtn);
        await this.click(this.filePreviewIcon);
        await this.click(this.selectCategoryButton);
        await this.click(this.selectCategoryDropdownCheckbox);
        await this.click(this.confirmButton);
        await this.click(this.yesConfirmationButton);
        await this.page.getByText(' File has been confirmed', {exact: true})
        await expect(this.page.getByText(' File has been confirmed', {exact: true})).toBeVisible();
        await this.click(this.sendButton);

        await this.page.getByText('Email sent successfully.', {exact: true})
        await expect(this.page.getByText('Email sent successfully.', {exact: true})).toBeVisible();
    }


}

module.exports = AdminPortalHomePage;