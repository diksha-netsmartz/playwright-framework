import BasePage from "@utils/BasePage";
import { expect, test } from "@playwright/test";

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
        this.businessReportsLink = page.locator('#rc_businessReports').getByRole('link', { name: 'Business Reports' });
        this.schedulingMenu = page.locator("#li_scheduingmenu");
        this.newStudentEnrollment = page.locator('strong:has-text("New Student Enrollment")')

        // Scheduling
        this.singleInstructorLink = page.locator("#scheduling_SingleInstructor_li").getByRole("link", { name: "Single Instructor" });
        this.multiInstructorLink = page.locator("#scheduling_MultiInstructor_li").getByRole("link", { name: "Multi Instructor" });
        this.singleLocationLink = page.locator("#scheduling_SingleLocation_li").getByRole("link", { name: "Single Location" });
        this.multiVehicleLink = page.locator("#scheduling_MultiVehicle_li").getByRole("link", { name: "Multi Vehicle" });
        this.manageTimeSlotsLink = page.locator('b').filter({ hasText: 'Manage Time Slots' })
        this.bulkAppointmentLink = page.locator("#li_scheduling_managetimeslots_bulkappointments");
        this.bulkProcessLink = page.locator("#li_scheduling_managetimeslots_bulkprocess");
        this.openTimeSlotsLink = page.getByRole('link', { name: 'Open Time Slots' });
        this.nonGraphicalLink = page.locator("#scheduling_NonGraphicalScheduler_li");
        this.corporateTimeOffLink = page.locator("#scheduling_corporatetimeoff_li");
        this.staffAppointmentListLink = page.locator("#li_Staff_appointment_daily_List");

        //student account
        this.studentAccount = page.getByRole('link', { name: /Student Account/i });
        this.profileLink = page.locator('#li_StudentAccount_Profile');
        this.enrollmentBilling = page.locator("#li_StudentAccount_EnrollmentBilling")
        this.filesLink = page.locator("#li_StudentAccount_Files");


        // Classroom
        this.classroomMenu = page.getByRole('link', { name: /Classroom/i });
        this.classListLink = page.locator('#Classroom_ClassList_li').getByRole('link', { name: 'Class List' });
        this.newClassLink = page.locator('#Classroom_NewClass_li').getByRole('link', { name: 'New Class', exact: true });
        this.attendanceLink = page.locator('.classroom_attendance').getByRole('link', { name: 'Attendance', exact: true })


        // Uploaded Files widget
        this.uploadedFilesWidget = page.getByText('Uploaded Files', { exact: true });
        this.showFilesToConfirmBtn = page.getByRole('button', { name: 'Show Files to Confirm' });
        this.studentSearchBox = page.locator("(//input[@aria-controls='StudentPortalEmaildataTable'])[1]")
        this.confirmButton = page.locator('#btnConfirmFile:visible');
        this.uploadedFilesRows = page.locator('#StudentPortalEmaildataTable tbody tr');
        this.previewModal = page.locator('h4.modal-title:visible').filter({ hasText: 'File Preview' });
        this.closePreviewButton = page.locator("#previewImage button").filter({ hasText: 'Close' }).first();
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.sendButton = page.locator("xpath=//button[@onclick='SendFileConfirmedEmail()' and text()='SEND']");

        // Account Management
        this.accountManagementMenu = page.getByRole('link', { name: /Account Management/i });
        this.servicesSubMenu = page.locator("xpath=//li[@id='li_SetupSettings']//strong[text()='Services']");
        this.componentsProductsLink = page.locator('a').filter({ hasText: 'Components (Products)' });
        this.feesLink = page.locator("#studentaccount_Fees_li");
        this.discountsLink = page.locator("#studentaccount_Discounts_li");
        this.miscellaneousLink = page.locator("#studentaccount_Miscellaneous_li");
        this.onlineQuizTestsLink = page.locator("#studentaccount_quiz_li");
        this.servicesPackagesLink = page.getByRole('link', { name: 'Services (Packages)' });
        this.staffLink = page.locator("xpath=//li[@id='setup_staff_li']");
        this.locationsLink = page.getByRole('link', { name: 'Locations' });
        this.highSchoolsLink = page.getByRole('link', { name: /High School/i });
        this.howDidYouHearLink = page.getByRole('link', { name: /How did you hear/i });
        this.vehiclesSubMenu = page.locator("xpath=//li[@id='setup_vehicle_li']//strong[text()='Vehicles']");
        this.vehicleListLink = page.getByRole('link', { name: 'Vehicle List' });
        this.fileManagementLink = page.locator('#li_SetupSideMenu').getByRole('link', { name: 'File Management' });

        // Student Leads
        this.studentLeadsMenu = page.locator("#new_studentLead")

        // Advanced Search
        this.advancedSearchLink = page.getByRole('link', { name: 'Advanced Search' });

        // Configuration
        this.configurationMenu = page.locator('#ConfigurationSideMenu');
        this.companyInfoLink = page.locator('#configuration_CompanyInfo');
        this.integratePaymentLink = page.locator('#configurationPaymentProcessing')
        this.marketplaceLink = page.locator("#configurationMarketPlace")
        this.zipCodeLink = page.getByRole('link', { name: 'Zip Code' });
        this.userRightsLink = page.locator('#masterSettings_GetUserRights_li');
        this.securityPoliciesLink = page.locator("#configurationSecurityPolicies");
        this.schedulerSettingsLink = page.locator("#masterSettings_SchedulerSettings_li");

        // Communication
        this.communicationMenu = page.getByText('Communication', { exact: true });
        this.communicationCenterLink = page.locator("#settings_StudentCenter");
        this.emailTemplatesLink = page.locator("#settings_EmailTemplates");
        this.studentResourcesLink = page.getByRole('link', { name: 'Student Resources' });
        this.websiteContentSubMenu = page.locator("#website_Content_li");
        this.widgetLink = page.locator("//li[@id='chkWebsiteContent']");
        this.websiteFAQLink = page.getByRole('link', { name: 'Website FAQ' });

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
            await this.verifyTitle("Single Instructor Scheduler");
        });
    }

    /**
     * Navigates to the Multi-Instructor scheduling page via Scheduling menu.
     **/
    async navigateToMultiInstructor() {
        await test.step('Navigate to Scheduling -> Multi Instructor', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schedulingMenu);
            await this.click(this.schedulingMenu);
            await this.click(this.multiInstructorLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
            await this.verifyTitle("Multi Instructor Scheduler");
        });
    }

    /**
     * Navigates to the Single Location page via Scheduling menu.
     **/
    async navigateToSingleLocation() {
        await test.step('Navigate to Scheduling -> Single Location', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schedulingMenu);
            await this.click(this.schedulingMenu);
            await this.click(this.singleLocationLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
            await this.verifyTitle("Single Location Scheduler");
        });
    }

    /**
     * Navigates to the Multi-Vehicle scheduling page via Scheduling menu.
     **/
    async navigateToMultiVehicle() {
        await test.step('Navigate to Scheduling -> Multi Vehicle', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schedulingMenu);
            await this.click(this.schedulingMenu);
            await this.click(this.multiVehicleLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
            await this.verifyTitle("Multi Vehicle Scheduler");
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
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
            await this.verifyTitle("New Student Enrollment");

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
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
            await this.verifyTitle("Student Account");
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
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
            await this.verifyTitle("Student Account");
        });
    }

    /**
     * Opens the Student Account menu and navigates to the Files page.
     **/
    async openStudentFiles() {
        await test.step('Navigate to Student Account -> Files', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentAccount);
            await this.click(this.studentAccount);
            await this.click(this.filesLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
            await this.verifyTitle("Student Account");
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
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
            await this.verifyTitle("Manage Time Slots");
        });
    }

    /**
     * Navigates to the Bulk Process scheduling page via Scheduling -> Manage Time Slots -> Bulk Process.
     **/
    async navigateToBulkProcess() {
        await test.step('Navigate to Scheduling -> Manage Time Slots -> Bulk Process', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schedulingMenu);
            await this.click(this.schedulingMenu);
            await this.waitForVisible(this.manageTimeSlotsLink);
            await this.click(this.manageTimeSlotsLink);
            await this.waitForVisible(this.bulkProcessLink);
            await this.click(this.bulkProcessLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyTitle("Manage Time Slots");

        });
    }

    /**
     * Navigates to the Open Time Slots scheduling page via Scheduling -> Manage Time Slots -> Open Time Slots.
     **/
    async navigateToOpenTimeSlots() {
        await test.step('Navigate to Scheduling -> Manage Time Slots -> Open Time Slots', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schedulingMenu);
            await this.click(this.schedulingMenu);
            await this.waitForVisible(this.manageTimeSlotsLink);
            await this.click(this.manageTimeSlotsLink);
            await this.waitForVisible(this.openTimeSlotsLink);
            await this.click(this.openTimeSlotsLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
            await this.verifyTitle("Manage Time Slots");
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
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
            await this.verifyTitle("Non Graphical Scheduler");
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
            await this.verifyURLContainsText("Classroom")
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
     * @param {string} studentName
     * @param {any[]} uploadedOnValues
     */
    async clickShowFilesToConfirm(studentName, uploadedOnValues) {
        await test.step('Confirm uploaded student documents and send email', async () => {
            await this.waitForLoaders();
            await this.verifyVisible(this.uploadedFilesWidget);
            await this.click(this.showFilesToConfirmBtn);
            await this.waitForVisible(this.studentSearchBox);
            await this.clear(this.studentSearchBox);
            await this.fill(this.studentSearchBox, studentName);
            await this.page.waitForTimeout(1000);

            const timestampCounts = uploadedOnValues.reduce((counts, uploadedOn) => {
                counts.set(uploadedOn, (counts.get(uploadedOn) || 0) + 1);
                return counts;
            }, new Map());

            for (const [uploadedOn, expectedCount] of timestampCounts.entries()) {
                await expect(this.getUploadedFileRows(studentName, uploadedOn)).toHaveCount(expectedCount);
            }

            for (const uploadedOn of uploadedOnValues) {
                const matchingRows = this.getUploadedFileRows(studentName, uploadedOn);
                const rowCountBeforeConfirmation = await matchingRows.count();
                expect(rowCountBeforeConfirmation, `Expected at least one uploaded file row for ${studentName} at ${uploadedOn}.`).toBeGreaterThan(0);

                const targetRow = matchingRows.first();
                const previewIcon = targetRow.getByTitle('File Preview', { exact: true });


                await this.waitForVisible(previewIcon);
                await this.click(previewIcon);
                await this.waitForVisible(this.previewModal);
                await this.verifyVisible(this.previewModal);
                // await this.waitForVisible(this.closePreviewButton);
                // await this.click(this.closePreviewButton);
                // await this.waitForHidden(this.closePreviewButton);

                await this.waitForVisible(this.confirmButton);
                await this.click(this.confirmButton);
                await this.click(this.yesConfirmationButton);
                await this.waitForLoaders();
                await this.waitForVisible(this.sendButton);
                await this.waitForVisible(this.page.getByText(' File has been confirmed', { exact: true }))
                await this.verifyVisible(this.page.getByText(' File has been confirmed', { exact: true }));
                await this.jsClick(this.sendButton);
                await this.waitForHidden(this.sendButton);
                await this.waitForLoaders();
                await this.waitForVisible(this.page.getByText('Email sent successfully.', { exact: true }));
                await this.verifyVisible(this.page.getByText('Email sent successfully.', { exact: true }));
                await expect(matchingRows).toHaveCount(rowCountBeforeConfirmation - 1);
            }
        });
    }

    /**
     * Returns uploaded-file table rows matching the given student name and uploaded-on value.
     * @param {string} studentName - Student name shown in the table.
     * @param {string} uploadedOn - Uploaded-on text shown in the admin portal.
     * @returns {import('@playwright/test').Locator}
     **/
    getUploadedFileRows(studentName, uploadedOn) {
        return this.uploadedFilesRows.filter({ hasText: studentName }).filter({ hasText: uploadedOn });
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

    /**
     * Navigates to Account Management > Services > Discounts page.
     **/
    async navigateToDiscounts() {
        await test.step('Navigate to Account Management -> Services -> Discounts', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.accountManagementMenu);
            await this.click(this.accountManagementMenu);

            await this.waitForVisible(this.servicesSubMenu);
            await this.click(this.servicesSubMenu);

            await this.waitForVisible(this.discountsLink);
            await this.click(this.discountsLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });

            await this.verifyTitle("Service Management");
        });
    }

    /**
     * Navigates to Account Management > Services > Miscellaneous page.
     **/
    async navigateToMiscellaneous() {
        await test.step('Navigate to Account Management -> Services -> Miscellaneous', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.accountManagementMenu);
            await this.click(this.accountManagementMenu);

            await this.waitForVisible(this.servicesSubMenu);
            await this.click(this.servicesSubMenu);

            await this.waitForVisible(this.miscellaneousLink);
            await this.click(this.miscellaneousLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });

            await this.verifyTitle("Service Management");
        });
    }

    /**
     * Navigates to Account Management > Services > Online Quiz / Tests page.
     **/
    async navigateToOnlineQuizTests() {
        await test.step('Navigate to Account Management -> Services -> Online Quiz / Tests', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.accountManagementMenu);
            await this.click(this.accountManagementMenu);

            await this.waitForVisible(this.servicesSubMenu);
            await this.click(this.servicesSubMenu);

            await this.waitForVisible(this.onlineQuizTestsLink);
            await this.click(this.onlineQuizTestsLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.verifyTitle("Service Management");
        });
    }

    /**
     * Navigates to Account Management > Services > Services (Packages) page.
     **/
    async navigateToServicesPackages() {
        await test.step('Navigate to Account Management -> Services -> Services (Packages)', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.accountManagementMenu);
            await this.click(this.accountManagementMenu);

            await this.waitForVisible(this.servicesSubMenu);
            await this.click(this.servicesSubMenu);

            await this.waitForVisible(this.servicesPackagesLink);
            await this.click(this.servicesPackagesLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.verifyTitle("Service Management");
        });
    }

    /**
     * Navigates to Account Management > Staff page.
     **/
    async navigateToStaff() {
        await test.step('Navigate to Account Management -> Staff', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.accountManagementMenu);
            await this.click(this.accountManagementMenu);

            await this.waitForVisible(this.staffLink);
            await this.click(this.staffLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.verifyTitle("Staff List");
        });
    }

    /**
     * Navigates to Account Management > Locations page.
     **/
    async navigateToLocations() {
        await test.step('Navigate to Account Management -> Locations', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.accountManagementMenu);
            await this.click(this.accountManagementMenu);

            await this.waitForVisible(this.locationsLink);
            await this.click(this.locationsLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.verifyTitle("School Setup");
        });
    }

    /**
     * Navigates to Account Management > High Schools page.
     **/
    async navigateToHighSchools() {
        await test.step('Navigate to Account Management -> High Schools', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.accountManagementMenu);
            await this.click(this.accountManagementMenu);

            await this.waitForVisible(this.highSchoolsLink);
            await this.click(this.highSchoolsLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.verifyTitle("School Setup");
        });
    }

    /**
     * Navigates to Account Management > How did you hear page.
     **/
    async navigateToHowDidYouHear() {
        await test.step('Navigate to Account Management -> How did you hear', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.accountManagementMenu);
            await this.click(this.accountManagementMenu);

            await this.waitForVisible(this.howDidYouHearLink);
            await this.click(this.howDidYouHearLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.verifyTitle("School Setup");
        });
    }

    /**
     * Navigates to Account Management > Vehicles > Vehicle List page.
     **/
    async navigateToVehicleList() {
        await test.step('Navigate to Account Management -> Vehicles -> Vehicle List', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.accountManagementMenu);
            await this.click(this.accountManagementMenu);

            await this.waitForVisible(this.vehiclesSubMenu);
            await this.click(this.vehiclesSubMenu);

            await this.waitForVisible(this.vehicleListLink);
            await this.click(this.vehicleListLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.verifyTitle("School Setup");
        });
    }

    /**
     * Navigates to Student Leads
     **/
    async navigateToStudentLead() {
        await test.step('Navigate to Student Leads -> Add Lead', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentLeadsMenu);
            await this.click(this.studentLeadsMenu);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.verifyTitle("Student Leads");
        });
    }

    /**
     * Navigates to Advanced Search from the side menu.
     **/
    async navigateToAdvancedSearch() {
        await test.step('Navigate to Advanced Search', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.advancedSearchLink);
            await this.click(this.advancedSearchLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.verifyTitle("Advanced Search");
        });
    }

    /**
     * Navigates to Scheduling > Corporate Time Off from the side menu.
     **/
    async navigateToCorporateTimeOff() {
        await test.step('Navigate to Scheduling -> Corporate Time Off', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schedulingMenu);
            await this.click(this.schedulingMenu);
            await this.waitForVisible(this.corporateTimeOffLink);
            await this.click(this.corporateTimeOffLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.verifyTitle("Corporate Time Off");
        });
    }

    /**
     * Navigates to the Staff Appointment List page via Scheduling menu.
     **/
    async navigateToStaffAppointmentList() {
        await test.step('Navigate to Scheduling -> Staff Appointment List', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.schedulingMenu);
            await this.click(this.schedulingMenu);
            await this.waitForVisible(this.staffAppointmentListLink);
            await this.click(this.staffAppointmentListLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 });
            await this.verifyTitle("Staff Appointment List");
        });
    }

    /**
     * Navigates to Report Center > Business Reports page via side menu.
     **/
    async navigateToBusinessReports() {
        await test.step('Navigate to Report Center -> Business Reports', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.reportCenter);
            await this.click(this.reportCenter);
            await this.waitForVisible(this.businessReportsLink);
            await this.click(this.businessReportsLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 });
            await this.verifyTitle("BusinessReports")
        });
    }

    /**
     * Navigates to Configuration > Company Info via side menu.
     **/
    async navigateToCompanyInfo() {
        await test.step('Click on Company Info', async () => {
            if (!await this.isVisible(this.companyInfoLink)) {
                await this.waitForVisible(this.configurationMenu);
                await this.click(this.configurationMenu);
            }
            await this.waitForVisible(this.companyInfoLink);
            await this.click(this.companyInfoLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyTitle(/Company Info/i);
        });
    }

    /**
     * Clicks on Integrate Payment under Configuration and verifies Company Info title.
     **/
    async navigateToIntegratePayment() {
        await test.step('Click on Integrate Payment', async () => {
            await this.waitForVisible(this.configurationMenu);
            await this.click(this.configurationMenu);
            await this.waitForVisible(this.integratePaymentLink);
            await this.click(this.integratePaymentLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyTitle(/Company Info/i);
        });
    }

    /**
     * Clicks on Marketplace under Configuration and verifies Company Info title.
     **/
    async navigateToMarketplace() {
        await test.step('Click on Marketplace', async () => {
            await this.waitForVisible(this.configurationMenu);
            await this.click(this.configurationMenu);
            await this.waitForVisible(this.marketplaceLink);
            await this.click(this.marketplaceLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyTitle(/Company Info/i);
        });
    }

    /**
     * Navigates to Configuration > Zip Code via side menu.
     **/
    async navigateToZipCode() {
        await test.step('Click on Zip Code', async () => {
            await this.waitForVisible(this.configurationMenu);
            await this.click(this.configurationMenu);
            await this.waitForVisible(this.zipCodeLink);
            await this.click(this.zipCodeLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
        });
    }

    /**
     * Navigates to Configuration > User Rights via side menu.
     **/
    async navigateToUserRights() {
        await test.step('Click on User Rights', async () => {
            await this.waitForVisible(this.configurationMenu);
            await this.click(this.configurationMenu);
            await this.waitForVisible(this.userRightsLink);
            await this.click(this.userRightsLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyTitle("Settings");
        });
    }

    /**
     * Navigates to Configuration > Security Policies via side menu.
     **/
    async navigateToSecurityPolicies() {
        await test.step('Navigate to Configuration -> Security Policies', async () => {
            await this.waitForLoaders();
            if (!await this.isVisible(this.securityPoliciesLink)) {
                await this.waitForVisible(this.configurationMenu);
                await this.click(this.configurationMenu);
            }
            await this.waitForVisible(this.securityPoliciesLink);
            await this.click(this.securityPoliciesLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyTitle(/ManagePasswordPolicies/i);
        });
    }

    /**
     * Navigates to Configuration > Scheduler Settings via side menu.
     **/
    async navigateToSchedulerSettings() {
        await test.step('Navigate to Configuration -> Scheduler Settings', async () => {
            await this.waitForLoaders();
            if (!await this.isVisible(this.schedulerSettingsLink)) {
                await this.waitForVisible(this.configurationMenu);
                await this.click(this.configurationMenu);
            }
            await this.waitForVisible(this.schedulerSettingsLink);
            await this.click(this.schedulerSettingsLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyTitle("Settings");
        });
    }

    /**
     * Navigates to Communication > Communication Center via side menu.
     **/
    async navigateToCommunicationCenter() {
        await test.step('Navigate to Communication -> Communication Center', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.communicationMenu);
            await this.click(this.communicationMenu);
            await this.waitForVisible(this.communicationCenterLink);
            await this.click(this.communicationCenterLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyTitle("Communication Center");
        });
    }

    /**
     * Navigates to Communication > Email Templates via side menu.
     **/
    async navigateToEmailTemplates() {
        await test.step('Navigate to Communication -> Email Templates', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.communicationMenu);
            await this.click(this.communicationMenu);
            await this.waitForVisible(this.emailTemplatesLink);
            await this.click(this.emailTemplatesLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyTitle("Email Templates");
        });
    }

    /**
     * Navigates to Communication > Student Resources via side menu.
     **/
    async navigateToStudentResources() {
        await test.step('Navigate to Communication -> Student Resources', async () => {
            await this.waitForLoaders();
            if (!await this.isVisible(this.studentResourcesLink)) {
                await this.waitForVisible(this.communicationMenu);
                await this.click(this.communicationMenu);
            }
            await this.waitForVisible(this.studentResourcesLink);
            await this.click(this.studentResourcesLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyURLContainsText('Resources');
        });
    }

    /**
     * Navigates to Communication > Website Content > Widget via side menu.
     **/
    async navigateToWebsiteContentWidget() {
        await test.step('Navigate to Communication -> Website Content -> Widget', async () => {
            await this.waitForLoaders();
            if (!await this.isVisible(this.widgetLink)) {
                if (!await this.isVisible(this.websiteContentSubMenu)) {
                    await this.waitForVisible(this.communicationMenu);
                    await this.click(this.communicationMenu);
                }
                await this.waitForVisible(this.websiteContentSubMenu);
                await this.click(this.websiteContentSubMenu);
            }
            await this.waitForVisible(this.widgetLink);
            await this.click(this.widgetLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyURLContainsText('WebsiteContent');
        });
    }

    /**
     * Navigates to Communication > Website Content > Website FAQ via side menu.
     **/
    async navigateToWebsiteFAQ() {
        await test.step('Navigate to Communication -> Website Content -> Website FAQ', async () => {
            await this.waitForLoaders();
            if (!await this.isVisible(this.websiteFAQLink)) {
                if (!await this.isVisible(this.websiteContentSubMenu)) {
                    await this.waitForVisible(this.communicationMenu);
                    await this.click(this.communicationMenu);
                }
                await this.waitForVisible(this.websiteContentSubMenu);
                await this.click(this.websiteContentSubMenu);
            }
            await this.waitForVisible(this.websiteFAQLink);
            await this.click(this.websiteFAQLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyTitle('Website FAQ');
        });
    }

    /**
     * Navigates to Account Management -> File Management via side menu.
     **/
    async navigateToFileManagement() {
        await test.step('Navigate to Account Management -> File Management', async () => {
            await this.waitForLoaders();
            if (!await this.isVisible(this.fileManagementLink)) {
                await this.waitForVisible(this.accountManagementMenu);
                await this.click(this.accountManagementMenu);
            }
            await this.waitForVisible(this.fileManagementLink);
            await this.click(this.fileManagementLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => {
            });
            await this.verifyTitle('File Management');
        });
    }

}     