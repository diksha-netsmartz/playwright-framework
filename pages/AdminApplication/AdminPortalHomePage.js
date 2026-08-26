import BasePage from "../../utils/BasePage";
import config from "../../config/config";
import { test } from "@playwright/test";

/**
 * Page Object representing the Admin Portal Dashboard / Home Page.
 * Handles side navigation menus (Scheduling, Report Center, Student Account, New Student Enrollment)
 * and the Uploaded Files confirmation widget workflow.
 **/
export default class AdminPortalHomePage extends BasePage {

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
        this.singleInstructorLink = page.locator("#scheduling_SingleInstructor_li").getByRole("link", {
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

        // Classroom
        this.classroomMenu = page.getByRole('link', { name: /Classroom/i });
        this.classListLink = page.locator('#Classroom_ClassList_li').getByRole('link', { name: 'Class List' });
        this.newClassLink = page.locator('#Classroom_NewClass_li').getByRole('link', { name: 'New Class', exact: true });
        this.attendanceLink = page.locator('.classroom_attendance').getByRole('link', { name: 'Attendance', exact: true })


        // Uploaded Files widget
        this.uploadedFilesWidget = page.getByText('Uploaded Files', { exact: true });
        this.showFilesToConfirmBtn = page.getByRole('button', { name: 'Show Files to Confirm' });
        this.filePreviewIcon = page.getByTitle('File Preview', { exact: true }).first();
        this.selectCategoryButton = page.getByRole('button', { name: 'Select Category' });
        this.selectCategoryDropdownCheckbox = page.locator("xpath=(//div[@class='selectCategorFromImagePreViewModal']//input[@type='checkbox' and contains(@class,'Document')]//following-sibling::ins)[1]");
        this.confirmButton = page.locator('#btnConfirmFile:visible');
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.sendButton = page.locator("xpath=//button[@onclick='SendFileConfirmedEmail()' and text()='SEND']");

        // Account Management
        this.accountManagementMenu = page.getByRole('link', { name: /Account Management/i });
        this.servicesSubMenu = page.locator("xpath=//li[@id='li_SetupSettings']//strong[text()='Services']");
        this.componentsProductsLink = page.locator('a').filter({ hasText: 'Components (Products)' });
        this.feesLink = page.locator("#studentaccount_Fees_li");
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
        await test.step(`Navigate to Report section: "${sectionName}"`, async () => {
            await this.click(this.reportCenter);
            const reportSection = this.getReportSection(sectionName);
            await this.verifyVisible(reportSection);
            await this.click(reportSection);
        });
    }

    /**
     * Navigates to the Single Instructor scheduling page via Scheduling menu.
    **/
    async navigateToSingleInstructor() {
        await test.step('Navigate to Scheduling -> Single Instructor', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schedulingMenu);
            await this.click(this.schedulingMenu);
            await this.click(this.singleInstructorLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
        });
    }

    /**
     * Navigates to the New Student Enrollment page.
    **/
    async navigateToNewStudentEnrollment() {
        await test.step('Navigate to New Student Enrollment page', async () => {
            await this.waitForLoaders();
            await this.page.waitForTimeout(5000);
            await this.waitForVisible(this.newStudentEnrollment);
            await this.click(this.newStudentEnrollment);
        });
    }

    /**
     * Opens the Student Account menu and navigates to the Student Profile page.
    **/
    async openStudentProfile() {
        await test.step('Navigate to Student Account -> Profile', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentAccount);
            await this.click(this.studentAccount);
            await this.click(this.profileLink);
        });
    }

    /**
     * Opens the Student Account menu and navigates to the Enrollment/Billing page.
    **/
    async openEnrollmentBilling() {
        await test.step('Navigate to Student Account -> Enrollment/Billing', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentAccount)
            await this.click(this.studentAccount);
            await this.click(this.enrollmentBilling);
        });
    }

    /**
     * Navigates to the Bulk Appointment scheduling page via Scheduling -> Manage Time Slots.
    **/
    async navigateToBulkAppointment() {
        await test.step('Navigate to Scheduling -> Manage Time Slots -> Bulk Appointment', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schedulingMenu);
            await this.click(this.schedulingMenu);
            await this.click(this.manageTimeSlotsLink);
            await this.click(this.bulkAppointmentLink);
        });
    }

    /**
     * Navigates to the Non Graphical scheduling page via Scheduling menu.
    **/
    async navigateToNonGraphical() {
        await test.step('Navigate to Scheduling -> Non Graphical', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schedulingMenu);
            await this.click(this.schedulingMenu);
            await this.click(this.nonGraphicalLink);
        });
    }

    /**
     * Navigates to the Class List page via Classroom menu in the side navigation.
    **/
    async navigateToClassList() {
        await test.step('Navigate to Classroom -> Class List', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.classroomMenu);
            await this.click(this.classroomMenu);
            await this.waitForVisible(this.classListLink);
            await this.click(this.classListLink);
            await this.waitForLoaders();
            await this.verifyTitle("Classroom");
        });
    }

    /**
     * Navigates to the New Class page via Classroom menu in the side navigation.
    **/
    async navigateToNewClass() {
        await test.step('Navigate to Classroom -> New Class', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.classroomMenu);
            await this.click(this.classroomMenu);
            await this.waitForVisible(this.newClassLink);
            await this.click(this.newClassLink);
            await this.waitForLoaders();
            await this.verifyTitle("Classroom");
        });
    }

    /**
     * Clicks the Attendance link via Classroom menu in the side navigation.
     **/
    async navigateToAttendance() {
        await test.step('Navigate to Classroom -> Attendance', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.classroomMenu);
            await this.click(this.classroomMenu);
            await this.waitForVisible(this.attendanceLink);
            await this.click(this.attendanceLink);
            await this.waitForLoaders();
            await this.verifyTitle("Classroom");
        });
    }

    /**
     * Confirms uploaded student documents in the Uploaded Files dashboard widget and sends a confirmation email.
    **/
    async clickShowFilesToConfirm() {
        await test.step('Confirm uploaded student documents and send email', async () => {
            await this.waitForLoaders();
            await this.verifyVisible(this.uploadedFilesWidget);
            await this.click(this.showFilesToConfirmBtn);
            await this.click(this.filePreviewIcon);
            await this.click(this.selectCategoryButton);
            await this.click(this.selectCategoryDropdownCheckbox);
            await this.click(this.confirmButton);
            await this.click(this.yesConfirmationButton);
            await this.verifyVisible(this.page.getByText(' File has been confirmed', { exact: true }));
            await this.click(this.sendButton);
            await this.waitForHidden(this.sendButton);
            await this.waitForLoaders();
            await this.waitForVisible(this.page.getByText('Email sent successfully.', { exact: true }));
        });
    }

    /**
     * Navigates to Account Management > Services > Components (Products) page.
     **/
    async navigateToComponents() {
        await test.step('Navigate to Account Management -> Services -> Components (Products)', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.accountManagementMenu);
            await this.click(this.accountManagementMenu);

            await this.waitForVisible(this.servicesSubMenu);
            await this.click(this.servicesSubMenu);

            await this.waitForVisible(this.componentsProductsLink);
            await this.click(this.componentsProductsLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });

            await this.verifyTitle("Service Management");
        });
    }

    /**
     * Navigates to Account Management > Services > Fees page.
     **/
    async navigateToFees() {
        await test.step('Navigate to Account Management -> Services -> Fees', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.accountManagementMenu);
            await this.click(this.accountManagementMenu);

            await this.waitForVisible(this.servicesSubMenu);
            await this.click(this.servicesSubMenu);

            await this.waitForVisible(this.feesLink);
            await this.click(this.feesLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });

            await this.verifyTitle("Service Management");
        });
    }
}