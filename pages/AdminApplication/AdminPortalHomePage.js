const BasePage = require("../../utils/BasePage");
const { expect } = require("@playwright/test");

/**
 * Page Object representing the Admin Portal Dashboard / Home Page.
 * Handles side navigation menus (Scheduling, Report Center, Student Account, New Student Enrollment)
 * and the Uploaded Files confirmation widget workflow.
  **/
class AdminPortalHomePage extends BasePage {

    /**
     * Initializes locators for the Admin Portal Home Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
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

        this.studentAccount = page.getByRole('link', { name: /Student Account/i });
        this.profileLink = page.locator('#li_StudentAccount_Profile')
        this.enrollmentBilling = page.getByRole('link', { name: 'Enrollment/Billing' });

        // Manage Time Slots
        this.manageTimeSlotsLink = page.locator('b').filter({ hasText: 'Manage Time Slots' })
        this.bulkAppointmentLink = page.getByRole('link', { name: 'Bulk Appointment' });

        // Non Graphical
        this.nonGraphicalLink = page.getByRole('link', { name: 'Non Graphical' });

        // Uploaded Files widget
        this.uploadedFilesWidget = page.getByText('Uploaded Files', { exact: true });
        this.showFilesToConfirmBtn = page.getByRole('button', { name: 'Show Files to Confirm' });
        this.filePreviewIcon = page.getByTitle('File Preview', { exact: true }).first();
        this.selectCategoryButton = page.getByRole('button', { name: 'Select Category' });
        this.selectCategoryDropdownCheckbox = page.locator("xpath=//input[@type='checkbox' and contains(@class,'Document')]//following-sibling::ins[1]");
        this.confirmButton = page.locator('#btnConfirmFile:visible');
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.sendButton = page.locator("xpath=//button[@onclick='SendFileConfirmedEmail()' and text()='SEND']");

    }

    /**
     * Returns a dynamic locator for a specific report category link in the Report Center.
     * @param {string} sectionName - The report category name.
     * @returns {import('@playwright/test').Locator} Locator for the report category element.
      **/
    getReportSection(sectionName) {
        return this.page.locator(
            `.ReportCenter_${sectionName.replaceAll(" ", "")}`
        );
    }

    /**
     * Navigates to a specific section within the Report Center.
     * @param {string} sectionName - The name of the report section to navigate to.
    **/
    async navigateToReportSection(sectionName) {
        await this.click(this.reportCenter);

        const reportSection = this.getReportSection(sectionName);

        await this.verifyVisible(reportSection);
        await this.click(reportSection);
    }

    /**
     * Navigates to the Single Instructor scheduling page via Scheduling menu.
    **/
    async navigateToSingleInstructor() {
        await this.click(this.schedulingMenu);
        await this.click(this.singleInstructorLink);
    }

    /**
     * Navigates to the New Student Enrollment page.
    **/
    async navigateToNewStudentEnrollment() {
        await this.click(this.newStudentEnrollment);
    }

    /**
     * Opens the Student Account menu and navigates to the Student Profile page.
    **/
    async openStudentProfile() {
        await this.click(this.studentAccount);
        await this.click(this.profileLink);
    }

    /**
     * Opens the Student Account menu and navigates to the Enrollment/Billing page.
    **/
    async openEnrollmentBilling() {
        await this.click(this.studentAccount);
        await this.click(this.enrollmentBilling);
    }

    /**
     * Navigates to the Bulk Appointment scheduling page via Scheduling -> Manage Time Slots.
    **/
    async navigateToBulkAppointment() {
        await this.click(this.schedulingMenu);
        await this.click(this.manageTimeSlotsLink);
        await this.click(this.bulkAppointmentLink);
    }

    /**
     * Navigates to the Non Graphical scheduling page via Scheduling menu.
    **/
    async navigateToNonGraphical() {
        await this.click(this.schedulingMenu);
        await this.click(this.nonGraphicalLink);
    }

    /**
     * Confirms uploaded student documents in the Uploaded Files dashboard widget and sends a confirmation email.
    **/
    async clickShowFilesToConfirm() {
        await this.verifyVisible(this.uploadedFilesWidget);
        await this.click(this.showFilesToConfirmBtn);
        await this.click(this.filePreviewIcon);
        await this.click(this.selectCategoryButton);
        await this.click(this.selectCategoryDropdownCheckbox);
        await this.click(this.confirmButton);
        await this.click(this.yesConfirmationButton);
        await this.verifyVisible(this.page.getByText(' File has been confirmed', { exact: true }));
        await this.click(this.sendButton);
        await this.verifyVisible(this.page.getByText('Email sent successfully.', { exact: true }));
    }


}

module.exports = AdminPortalHomePage;