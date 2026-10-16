import BasePage from "@utils/BasePage";
import { expect, test } from "@playwright/test";
import DateHelper from "@utils/DateHelper";

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
        this.uploadedFilesWidget = page.getByText('UPLOADED FILES', { exact: true }).first();
        this.showFilesToConfirmBtn = page.getByRole('button', { name: 'Show Files to Confirm' });
        this.studentSearchBox = page.locator("(//input[@aria-controls='StudentPortalEmaildataTable'])[1]")
        this.confirmButton = page.locator('#btnConfirmFile:visible');
        this.uploadedFilesRows = page.locator('#StudentPortalEmaildataTable tbody tr');
        this.previewModal = page.locator('h4.modal-title:visible').filter({ hasText: 'File Preview' });
        this.closePreviewButton = page.locator("#previewImage button").filter({ hasText: 'Close' }).first();
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.sendButton = page.locator("xpath=//button[@onclick='SendFileConfirmedEmail()' and text()='SEND']");

        // Tasks widget
        this.tasksWidgetTab = page.locator("//a[@href='#tasks']");
        this.showAllTasksBtn = page.getByRole('button', { name: 'Show All Tasks' });
        this.addNewTaskBtn = page.locator("//a[@data-target='#addTask']");
        this.taskSubjectInput = page.getByRole('textbox', { name: 'Subject' });
        this.taskStatusDropdown = page.locator("button[data-id='ProfileTAB_drpStatus']");
        this.taskDateInput = page.getByRole('textbox', { name: 'MM/DD/YYYY' });
        this.taskTimeDropdownBtn = page.getByRole('button', { name: 'Select Time' });
        this.taskAssignTypeDropdownBtn = page.locator("button[data-id='ProfileTAB_drpAssignTo']");
        this.taskSelectStaffDropdownBtn = page.locator("button[data-id='ProfileTAB_drpStaff']");
        this.taskNotesInput = page.getByRole('textbox', { name: 'Notes' });
        this.taskSaveBtn = page.locator('#btn_ProfileTAB_SaveUpdateTask');
        this.taskSearchInput = page.locator('#searchabletasks');
        this.editTaskIcon = page.locator('i.far.fa-edit:visible').first();
        this.deleteTaskIcon = page.locator('i.far.fa-trash-alt:visible').first();
        this.taskViewDetailsCloseBtn = page.getByRole('button', { name: 'Close' });
        this.taskAddedNotification = page.getByText('Task added successfully.');
        this.taskUpdatedNotification = page.getByText('Task updated successfully.');
        this.taskDeletedNotification = page.getByText('Task deleted successfully.');
        this.taskAddedNotes = page.locator(".customTaskNotePNote").last();
        this.closeTaskButton = page.locator('.modal').getByRole('button', { name: 'Close' }).filter({ visible: true });

        // Website Enrollments widget
        this.websiteEnrollmentsTab = page.getByRole('link', { name: 'Website Enrollments' });
        this.showWebsiteEnrollmentsBtn = page.getByRole('button', { name: 'Show Website Enrollments' });
        this.websiteEnrollmentList = page.locator('#divWebsiteEnrollmentList');
        this.websiteEnrollmentTable = page.locator('#enrollmenttabtable');
        this.websiteEnrollmentRows = page.locator('#enrollmenttabtable tbody tr');
        this.websiteEnrollmentSearchInput = page.locator("div[id='enrollmenttabtable_filter'] input[placeholder='Search']");
        this.websiteEnrollmentFilterBtn = page.locator('#ddlFilter').getByRole('link', { name: 'Filter', exact: true });
        this.websiteEnrollmentClearFilterBtn = page.getByRole('link', { name: 'Clear Filter', exact: true });
        this.showActiveStudentsCheckbox = page.locator('#showActiveStudents');
        this.showAdminEnrolledCheckbox = page.locator('#showAdminEnrolledStudents');
        this.activateStudentBtn = page.getByRole('button', { name: 'Activate' });
        this.activateYesConfirmBtn = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");
        this.studentActivationNotification = page.getByText('Credentials are sent over SMS').or(page.getByText('Student Activated Successfully.'));
        this.noRecordExistsCell = page.getByRole('gridcell', { name: 'No record exists.' }).first();
        this.noMatchingRecordsCell = page.getByRole('gridcell', { name: 'No matching records found' }).first();
        this.websiteEnrollmentSidePanel = page.locator('div.enroll_sidepaneltoggl');
        this.websiteEnrollmentSidePanelHeading = page.locator('div.enroll_sidepaneltoggl').locator('h3');
        this.customDateRange = page.locator('#dateRange');
        this.customFilterButton = page.getByRole('button', { name: 'Filter' });

        // Process BTW widget
        this.processBtwTab = page.locator("//span[normalize-space()='Process BTW']");
        this.showWebBtwBtn = page.getByRole('button', { name: 'Show Web BTW' });

        // Active Students widget
        this.homeMenuLink = page.locator('li.newHomePage');
        this.activeStudentSearchInput = page.locator('input[name="studentList"]');
        this.activeStudentActionDropdownBtn = page.locator("//button[normalize-space()='Please Select']");
        this.activeStudentGoBtn = page.locator("//a[normalize-space()='Go']");

        // Students widget - Classes Tab
        this.classesTabInStudentsWidget = page.getByRole('link', { name: 'Classes' });
        this.classStatusDropdownBtn = page.getByRole('button', { name: /Please Select Status/i })
        this.classSelectDropdownBtn = page.getByRole('button', { name: /Please Select Class/i })
        this.classCRSessionDropdownBtn = page.getByRole('button', { name: /Please Select CR Session/i })
        this.classActionDropdownBtn = page.getByRole('button', { name: 'Please Select One' })
        this.classGoBtn = page.getByRole('button', { name: 'Go', exact: true }).filter({ visible: true });

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


        this.attachmentPreviewModal = page.getByRole('heading', { name: 'Preview' });
        this.staffMsgAttachment = (/** @type {string | RegExp} */ messageName) => page.locator(`//div[contains(text(),'${messageName}')]//parent::div//a[contains(@class,'preview')]`).first();

        // Page Settings
        this.settingsGearIcon = page.locator('i.fa.fa-gear:visible').first();
        this.pageSettingsLink = page.getByRole('link', { name: /Page Settings/i });
    }



    /* =========================================================================
     * Navigation Methods - Scheduling
     * ========================================================================= */

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

    /* =========================================================================
     * Navigation Methods - Student Account
     * ========================================================================= */

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

    /* =========================================================================
     * Navigation Methods - Scheduling (Manage Time Slots)
     * ========================================================================= */

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

    /* =========================================================================
     * Navigation Methods - Classroom
     * ========================================================================= */

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

    /* =========================================================================
     * Dashboard Widget - Uploaded Files Methods
     * ========================================================================= */

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

                // await this.waitForVisible(this.confirmButton);
                // await this.confirmButton.click({ force: true }).catch(async () => {
                //     await this.jsClick(this.confirmButton);
                // });

                await this.click(this.confirmButton);
                await this.click(this.yesConfirmationButton);
                // await this.yesConfirmationButton.click().catch(async () => {
                //     await this.jsClick(this.yesConfirmationButton);
                // });
                await this.waitForLoaders();
                await this.waitForVisible(this.sendButton);
                await this.waitForVisible(this.page.getByText(' File has been confirmed', { exact: true }), { timeout: 30000 })
                await this.verifyVisible(this.page.getByText(' File has been confirmed', { exact: true }));
                await this.sendButton.click().catch(async () => {
                    await this.jsClick(this.sendButton);
                });
                await this.waitForHidden(this.sendButton);
                await this.waitForLoaders();
                await this.waitForVisible(this.page.getByText('Email sent successfully.', { exact: true }), { timeout: 30000 });
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

    /* =========================================================================
     * Navigation Methods - Account Management
     * ========================================================================= */

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
            await this.page.waitForLoadState('load', { timeout: 30000 });
            await this.verifyTitle("School Setup");
        });
    }

    /* =========================================================================
     * Navigation Methods - Student Leads & Search
     * ========================================================================= */

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

    /* =========================================================================
     * Navigation Methods - Report Center
     * ========================================================================= */

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

    /* =========================================================================
     * Navigation Methods - Configuration & Settings
     * ========================================================================= */

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

    /* =========================================================================
     * Navigation Methods - Communication Center
     * ========================================================================= */

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

    /* =========================================================================
     * Dashboard Widget - Tasks Methods
     * ========================================================================= */

    /**
     * Opens the Tasks widget on the Home Page and clicks 'Show All Tasks'.
     **/
    async openTasksWidget() {
        await test.step('Open Tasks widget on Home Page', async () => {
            await this.waitForVisible(this.tasksWidgetTab, 10000);
            await this.click(this.tasksWidgetTab);
            await this.waitForLoaders().catch(() => { });
            await this.waitForVisible(this.showAllTasksBtn, 10000);
            await this.click(this.showAllTasksBtn);
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForLoadState('load', { timeout: 15000 }).catch(() => { });
        });
    }

    /**
     * Creates a new task from the Tasks widget on Home Page.
     * @param {Object} details
     * @param {string} details.subject - Task subject.
     * @param {string} [details.status='New'] - Task status.
     * @param {string} [details.time='8:00 AM'] - Due time.
     * @param {string} details.staffIdentifier - Instructor name/username from credentials.
     * @param {string} [details.priority='Low'] - Task priority ('Low', 'Medium', 'High').
     * @param {string} details.notes - Task note.
     **/
    async createTask({ subject, status = 'New', time = '8:00 AM', staffIdentifier, priority = 'Low', notes }) {
        await test.step(`Create Task with subject: "${subject}" assigned to: "${staffIdentifier}"`, async () => {
            await this.waitForVisible(this.addNewTaskBtn, 5000);
            await this.click(this.addNewTaskBtn);
            await this.waitForVisible(this.taskSubjectInput, 5000);

            // Fill Subject
            await this.fill(this.taskSubjectInput, subject);

            // Select Status if visible
            await this.click(this.taskStatusDropdown);
            const statusOption = this.page.locator('.dropdown-menu a, .dropdown-menu li a').filter({ hasText: new RegExp(`^${status}$`, 'i') }).first();
            if (await statusOption.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(statusOption);
            }

            // Select Date (pick a valid date from datepicker if empty)
            const dateVal = await this.taskDateInput.inputValue().catch(() => '');
            if (!dateVal) {
                await this.click(this.taskDateInput);
                const dayCell = this.page.locator('.datepicker-days td.day:not(.old):not(.disabled)').first();
                if (await dayCell.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await this.click(dayCell);
                }
            }

            // Select Time
            await this.click(this.taskTimeDropdownBtn);
            const timeOption = this.page.locator('.dropdown-menu a, .dropdown-menu li a').filter({ hasText: time }).first();
            if (await timeOption.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(timeOption);
            }

            // Select Assign To Staff
            await this.click(this.taskAssignTypeDropdownBtn);
            const assignOption = this.page.locator('.dropdown-menu a, .dropdown-menu li a').filter({ hasText: /Assign To Staff/i }).first();
            if (await assignOption.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(assignOption);
            }


            // Select Staff from Login credentials
            await this.waitForVisible(this.taskSelectStaffDropdownBtn, 5000);
            await this.click(this.taskSelectStaffDropdownBtn);
            const staffOption = this.page.locator('.dropdown-menu a, .dropdown-menu li a').filter({ hasText: new RegExp(staffIdentifier, 'i') }).first();
            await this.waitForVisible(staffOption, 5000);
            await this.click(staffOption);

            // Select Priority
            const priorityOption = this.page.locator('div.priority').getByLabel(priority);
            await this.jsClick(priorityOption);


            // Fill Notes
            if (notes) {
                await this.fill(this.taskNotesInput, notes);
            }

            // Save and Confirm
            await this.click(this.taskSaveBtn);
            await this.waitForVisible(this.yesConfirmationButton, 5000);
            await this.click(this.yesConfirmationButton);
            await this.waitForLoaders().catch(() => { });
            await this.verifyVisible(this.taskAddedNotification, 10000);
            await this.page.waitForLoadState('load', { timeout: 15000 }).catch(() => { });
        });
    }

    /**
     * Searches for a task by subject keyword in the Tasks widget.
     * @param {string} keyword - Search term.
     **/
    async searchTask(keyword) {
        await test.step(`Search for task: "${keyword}"`, async () => {
            await this.verifyVisible(this.taskSearchInput, 5000);
            await this.click(this.taskSearchInput);
            await this.pressSequentially(this.taskSearchInput, keyword);
            await this.page.waitForTimeout(1000);
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Searches for a task by subject keyword in the Tasks widget.
     **/
    async editTask() {
        await test.step(`Edit task: `, async () => {
            await this.waitForVisible(this.editTaskIcon, 5000);
            await this.click(this.editTaskIcon);
            await this.page.waitForTimeout(1000);
            await this.waitForLoaders().catch(() => { });
            await this.waitForVisible(this.taskSubjectInput);
        });
    }

    /**
     * Verifies details inside the Edit Task modal.
     * @param {string} subject - Expected task subject.
     * @param {string} [priority] - Expected priority (e.g. 'Low', 'Medium').
     * @param {string} [status] - Expected status (e.g. 'New').
     * @param {string} [notes] - Expected notes.
     * @param {Object} [options] - Optional fields to verify.
     * @param {string} [options.staffIdentifier] - Expected assigned staff name/username.
     **/
    async verifyTaskDetails(subject, priority, status, notes, { staffIdentifier } = {}) {
        await test.step(`Verify task details in Edit Task modal for subject: "${subject}"`, async () => {
            await this.waitForVisible(this.taskSubjectInput, 5000);
            await expect(this.taskSubjectInput).toHaveValue(subject);

            if (status) {
                await expect(this.taskStatusDropdown).toHaveAttribute('title', new RegExp(status, 'i'));
            }

            if (staffIdentifier) {
                await expect(this.taskSelectStaffDropdownBtn).toHaveAttribute('title', new RegExp(staffIdentifier, 'i'));
            }

            if (priority) {
                const priorityOption = this.page.locator('div.priority label').filter({ hasText: priority });
                await expect(priorityOption).toHaveClass(/active/);
            }
            if (notes) {
                await expect(this.taskAddedNotes).toContainText(notes);
            }
        });
    }

    /**
     * Closes the Task modal if open.
     **/
    async closeTaskModal() {
        await test.step('Close Task modal', async () => {
            await this.click(this.closeTaskButton);
            await this.waitForHidden(this.closeTaskButton);
        });
    }

    async deleteTask() {
        await test.step(`Delete task: `, async () => {
            await this.closeTaskModal().catch(() => { });
            await this.waitForVisible(this.deleteTaskIcon, 5000);
            await this.click(this.deleteTaskIcon);
            await this.waitForVisible(this.yesConfirmationButton);
            await this.click(this.yesConfirmationButton);
            await this.waitForLoaders().catch(() => { });
            await this.verifyVisible(this.taskDeletedNotification, 10000);

        });
    }



    /**
     * Updates fields on the Edit Task modal, saves, and confirms.
     * @param {Object} updates
     * @param {string} [updates.priority] - New priority ('Medium', etc.).
     * @param {string} [updates.subject] - Updated subject.
     * @param {string} [updates.notes] - Additional note.
     * @param {string} [updates.status] - Updated status (e.g. 'Waiting Feedback').
     **/
    async updateTaskAndConfirm({ priority, subject, notes, status } = {}) {
        await test.step('Update task details and confirm Yes', async () => {
            if (priority) {
                const priorityOption = this.page.locator('div.priority').getByLabel(priority);
                await this.jsClick(priorityOption);
            }
            if (subject) {
                await this.fill(this.taskSubjectInput, subject);
            }
            if (notes) {
                await this.fill(this.taskNotesInput, notes);
            }

            await this.click(this.taskStatusDropdown);
            const statusOption = this.page.locator('.dropdown-menu a, .dropdown-menu li a').filter({ hasText: new RegExp(`^${status}$`, 'i') }).first();
            if (await statusOption.isVisible({ timeout: 2000 }).catch(() => false)) {
                await this.click(statusOption);
            }

            await this.click(this.taskSaveBtn);
            await this.waitForVisible(this.yesConfirmationButton, 5000);
            await this.click(this.yesConfirmationButton);
            await this.verifyVisible(this.taskUpdatedNotification, 10000);
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Verifies that the task does not appear in search results.
     * @param {string} subject - Task subject.
     **/
    async verifyNoSearchResult(subject) {
        await test.step(`Verify task "${subject}" is not displayed in search results`, async () => {
            await this.searchTask(subject);
            await this.verifyNotVisible(this.editTaskIcon);
            await this.verifyNotVisible(this.deleteTaskIcon);
        });
    }

    /* =========================================================================
     * Dashboard Widget - Website Enrollments Methods
     * ========================================================================= */
    /**
     * Opens the Website Enrollments widget tab and clicks 'Show Website Enrollments'.
     **/
    async openWebsiteEnrollmentsWidget() {
        await test.step('Open Website Enrollments widget on Home Page', async () => {
            await this.waitForVisible(this.websiteEnrollmentsTab);
            await this.click(this.websiteEnrollmentsTab);
            await this.click(this.showWebsiteEnrollmentsBtn);
            await this.waitForVisible(this.websiteEnrollmentList);
        });
    }

    /**
     * Applies filter options on the Website Enrollments widget (date ranges, checkboxes).
     * @param {Object} [options]
     * @param {string} [options.dateRange] - e.g. 'Today', 'Yesterday', 'Last 5 Days', 'Last 7 Days', 'Last 30 Days', 'Custom'
     * @param {boolean} [options.showActiveStudents] - Check/uncheck 'Show Active Students Also'
     * @param {boolean} [options.showAdminEnrolled] - Check/uncheck 'Show Admin-Enrolled Students'
     **/
    async filterWebsiteEnrollments({ dateRange, showActiveStudents, showAdminEnrolled } = {}) {
        await test.step(`Filter Website Enrollments: ${dateRange || ''} ${showActiveStudents ? 'ActiveStudents' : ''} ${showAdminEnrolled ? 'AdminEnrolled' : ''}`.trim(), async () => {
            await this.click(this.websiteEnrollmentFilterBtn);
            if (showActiveStudents !== undefined) {
                if (showActiveStudents) {
                    await this.check(this.showActiveStudentsCheckbox);
                } else {
                    await this.uncheck(this.showActiveStudentsCheckbox);
                }
            }

            if (showAdminEnrolled !== undefined) {
                if (showAdminEnrolled) {
                    await this.check(this.showAdminEnrolledCheckbox);
                } else {
                    await this.uncheck(this.showAdminEnrolledCheckbox);
                }
            }

            if (dateRange) {
                const dateLink = this.page.getByRole('link', { name: dateRange, exact: true });
                await this.click(dateLink);
                if (dateRange === 'Custom') {
                    await this.enterCustomDateRange();
                }
            }
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Enters custom date range into custom date range input and clicks Filter.
     * Defaults to current year (MM/DD/YYYY - MM/DD/YYYY) via DateHelper.
     * @param {string} [dateRange=DateHelper.getCurrentYearFormattedRange()] - Formatted as MM/DD/YYYY - MM/DD/YYYY.
     **/
    async enterCustomDateRange(dateRange = DateHelper.getCurrentYearFormattedRange()) {
        await test.step(`Enter custom date range "${dateRange}" in Website Enrollments widget`, async () => {
            await this.waitForVisible(this.customDateRange);
            await this.click(this.customDateRange);
            await this.clear(this.customDateRange);
            await this.pressSequentially(this.customDateRange, dateRange);
            await this.customDateRange.press('Tab');
            await this.click(this.customFilterButton);
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Verifies that the applied filter reloaded the table and either records are present or 'No record exists.' is shown.
     * Uses Playwright's locator.or() to wait for either condition cleanly without race conditions.
     **/
    async verifyWebsiteEnrollmentsFilterApplied() {
        await test.step('Verify filter is applied (records or "No record exists" displayed)', async () => {
            await this.waitForLoaders().catch(() => { });
            await this.waitForVisible(this.websiteEnrollmentTable);

            const hasNoRecords = await this.noRecordExistsCell.isVisible().catch(() => false);
            if (hasNoRecords) {
                await this.verifyVisible(this.noRecordExistsCell);
            } else {
                await this.verifyVisible(this.websiteEnrollmentRows.first());
                const rowCount = await this.websiteEnrollmentRows.count();
                expect(rowCount).toBeGreaterThan(0);
            }
        });
    }


    /**
     * Clears filters on Website Enrollments widget.
     **/
    async clearWebsiteEnrollmentsFilter() {
        await test.step('Clear filter in Website Enrollments widget', async () => {
            await this.click(this.websiteEnrollmentFilterBtn);
            await this.click(this.websiteEnrollmentClearFilterBtn);
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Retrieves the student name by clicking the first row and reading the name from the opened side panel.
     * @returns {Promise<string>} Clean student name from side panel heading.
     **/
    async getFirstStudentNameFromWebsiteEnrollments() {
        return await test.step('Get student name from first row of Website Enrollments table', async () => {
            await this.waitForVisible(this.websiteEnrollmentTable);
            const firstRow = this.websiteEnrollmentRows.first();
            await this.waitForVisible(firstRow);

            const text = (await firstRow.textContent()) || '';
            let studentName = text.includes('StudentName:')
                ? text.split('StudentName:')[1].split('|')[0].trim()
                : text.split('|')[0].trim();

            // Optional fallback: if text was somehow empty, click row and read side panel h3
            if (!studentName) {
                await this.click(firstRow);
                await this.waitForVisible(this.websiteEnrollmentSidePanelHeading);
                studentName = (await this.websiteEnrollmentSidePanelHeading.innerText()).split('\n')[0].trim();
            }

            console.log(`Retrieved first student name from Website Enrollments: "${studentName}"`);
            return studentName;
        });
    }


    /**
     * Searches for a student or term in the Website Enrollments search box.
     * @param {string} searchText - Text to search.
     **/
    async searchWebsiteEnrollments(searchText) {
        await test.step(`Search Website Enrollments for: "${searchText}"`, async () => {
            await this.click(this.websiteEnrollmentSearchInput);
            await this.clear(this.websiteEnrollmentSearchInput);
            await this.pressSequentially(this.websiteEnrollmentSearchInput, searchText);
            await this.page.waitForTimeout(500);
        });
    }

    /**
     * Verifies that the specified student is visible in the Website Enrollments table.
     * @param {string} studentName - Student name or part.
     * @param {boolean} isVisible - True if student should be visible, false otherwise.
     **/
    async verifyWebsiteEnrollmentSearchResult(studentName, isVisible) {
        await test.step(`Verify student "${studentName}" is visible in Website Enrollments table`, async () => {
            if (isVisible) {
                const rowOrCell = this.page.getByRole('gridcell').filter({ hasText: studentName }).first();
                await this.verifyVisible(rowOrCell)
            }
            else {
                await this.verifyVisible(this.noMatchingRecordsCell);
            }
        });
    }

    /**
     * Clicks Activate in the side panel (opening it if needed), confirms Yes, and verifies credentials sent notification.
     **/
    async activateFirstWebsiteEnrollment() {
        await test.step('Activate student from Website Enrollments and verify SMS credentials notification', async () => {
            if (!await this.isVisible(this.activateStudentBtn, { timeout: 2000 }).catch(() => false)) {
                const firstRow = this.websiteEnrollmentRows.first();
                await this.click(firstRow);
            }
            await this.waitForVisible(this.activateStudentBtn);
            await this.click(this.activateStudentBtn);

            await this.waitForVisible(this.activateYesConfirmBtn);
            await this.click(this.activateYesConfirmBtn);

            await this.waitForVisible(this.studentActivationNotification.first());
            await this.verifyVisible(this.studentActivationNotification.first());
        });
    }

    /* =========================================================================
     * Dashboard Widget - Process BTW Methods
     * ========================================================================= */

    /**
     * Opens the Process BTW widget tab on Home Page.
     **/
    async openProcessBtwWidget() {
        await test.step('Open Process BTW widget on Home Page', async () => {
            await this.waitForVisible(this.processBtwTab);
            await this.click(this.processBtwTab);
            await this.waitForVisible(this.showWebBtwBtn);
        });
    }

    /**
     * Clicks 'Show Web BTW' button in Process BTW widget to navigate to Manage Time Slots.
     **/
    async clickShowWebBtw() {
        await test.step('Click "Show Web BTW" button in Process BTW widget', async () => {
            await this.waitForVisible(this.showWebBtwBtn);
            await this.click(this.showWebBtwBtn);
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => { });
        });
    }

    /**
     * Verifies navigation to the Manage Time Slots page title.
     * @param {string|RegExp} [expectedTitle='Manage Time Slots']
     **/
    async verifyManageTimeSlotsPageTitle(expectedTitle = 'Manage Time Slots') {
        await test.step(`Verify page title is "${expectedTitle}"`, async () => {
            await this.verifyTitle(expectedTitle);
        });
    }

    /* =========================================================================
     * Dashboard Widget - Active Students Methods
     * ========================================================================= */

    /**
     * Navigates back to the Dashboard/Home page via the left side menu Home link.
     **/
    async navigateToHomePage() {
        await test.step('Navigate to Home Page via side menu', async () => {
            await this.click(this.homeMenuLink);
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => { });
        });
    }

    /**
     * Searches for a student in the Active Students widget, selects destination tab from dropdown, and clicks Go.
     * @param {string} studentName - Student's name to search (e.g. credentials.studentUser.name).
     * @param {'PROFILE'|'ENROLLMENT/BILLING'|'APPOINTMENTS'|'FILES'|'MESSAGES'|'QUIZ/TESTS'|'ACTIVITY LOG'|string} tabName - Target tab.
     **/
    async navigateToStudentTabViaActiveStudentsWidget(studentName, tabName) {
        await test.step(`Search student "${studentName}", select "${tabName}" and navigate via Active Students widget`, async () => {
            await this.waitForVisible(this.activeStudentSearchInput);
            await this.click(this.activeStudentSearchInput);
            await this.clear(this.activeStudentSearchInput);
            await this.pressSequentially(this.activeStudentSearchInput, studentName);

            const studentOption = this.page.getByRole('option', { name: new RegExp(studentName, 'i') }).first();
            await this.waitForVisible(studentOption, 10000);
            await this.click(studentOption);

            await this.click(this.activeStudentActionDropdownBtn);
            const targetLink = this.page.getByRole('link', { name: tabName, exact: true });
            await this.waitForVisible(targetLink);
            await this.click(targetLink);

            await this.click(this.activeStudentGoBtn);
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForLoadState('load', { timeout: 60000 }).catch(() => { });
        });
    }


    /* =========================================================================
   * Dashboard Widget - Messages
   * ========================================================================= */

    /**
     * Verifies that staff message is visible or not visible on homepage, and validates attachment preview.
     * @param {string} message - Message name/text.
     * @param {boolean} isVisible - Expected visibility state.
     **/
    async verifyStaffMessageVisibilityOnAdminHomepage(message, isVisible) {
        await test.step(`Verify Admin message visibility: "${message}" is ${isVisible ? 'visible' : 'not visible'}`, async () => {
            if (isVisible) {
                await this.verifyVisible(this.page.getByText(message, { exact: false }).first());

                await this.click(this.staffMsgAttachment(message));
                await this.verifyVisible(this.attachmentPreviewModal);

            } else {
                await this.verifyNotVisible(this.page.getByText(message, { exact: false }).first());
            }
        });
    }

    /* =========================================================================
     * Dashboard Widget - Students Widget (Classes Tab) Methods
     * ========================================================================= */

    /**
     * Opens the Classes tab in the Students widget on the Home page.
     **/
    async openClassesTabInStudentsWidget() {
        await test.step('Open Classes tab in Students widget on Home page', async () => {
            await this.waitForVisible(this.classesTabInStudentsWidget);
            await this.click(this.classesTabInStudentsWidget);
            await this.waitForLoaders().catch(() => { });
            await this.waitForVisible(this.classStatusDropdownBtn);
        });
    }

    /**
     * Selects status in Classes tab (e.g. 'In Session').
     * @param {string} [status='In Session'] - Status to select.
     **/
    async selectClassStatus(status = 'In Session') {
        await test.step(`Select Status "${status}" in Classes tab`, async () => {
            await this.waitForVisible(this.classStatusDropdownBtn);
            const currentStatus = (await this.classStatusDropdownBtn.innerText().catch(() => '')).trim();
            if (new RegExp(status, 'i').test(currentStatus)) {
                console.log(`[Classes Tab] Status "${status}" is already selected.`);
                return;
            }
            await this.click(this.classStatusDropdownBtn);
            const statusOption = this.page.locator('ul.dropdown-menu.inner.selectpicker')
                .locator('li')
                .filter({ visible: true })
                .filter({ hasText: new RegExp(status, 'i') })
                .first();
            await this.waitForVisible(statusOption, 10000);
            await statusOption.locator('a').or(statusOption).first().click();
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Selects the 1st valid Class option from the dropdown (excluding options with "select").
     * @returns {Promise<string>} The text of the selected class.
     **/
    async selectFirstValidClass() {
        return await test.step('Select the 1st valid Class option from dropdown', async () => {
            await this.waitForVisible(this.classSelectDropdownBtn);
            await this.click(this.classSelectDropdownBtn);
            const validOptions = this.page.locator('ul.dropdown-menu.inner.selectpicker')
                .locator('li')
                .filter({ visible: true })
                .filter({ hasNotText: /select/i });
            await this.waitForVisible(validOptions.first(), 10000);
            const selectedText = (await validOptions.first().innerText()).trim();
            console.log(`[Classes Tab] Selected 1st valid Class: "${selectedText}"`);
            await validOptions.first().locator('a').or(validOptions.first()).first().click();
            await this.waitForLoaders().catch(() => { });
            await this.page.waitForTimeout(500);
            await this.waitForLoaders().catch(() => { });
            return selectedText;
        });
    }

    /**
     * Selects the 1st valid CR Session option from the dropdown (excluding options with "select").
     * @returns {Promise<string>} The text of the selected session.
     **/
    async selectFirstValidCRSession() {
        return await test.step('Select the 1st valid CR Session option from dropdown', async () => {
            await this.waitForVisible(this.classCRSessionDropdownBtn);
            await this.click(this.classCRSessionDropdownBtn);
            const validOptions = this.page.locator('ul.dropdown-menu.inner.selectpicker')
                .locator('li')
                .filter({ visible: true })
                .filter({ hasNotText: /select/i });
            await this.waitForVisible(validOptions.first(), 10000);
            const selectedText = (await validOptions.first().innerText()).trim();
            console.log(`[Classes Tab] Selected 1st valid CR Session: "${selectedText}"`);
            await validOptions.first().locator('a').or(validOptions.first()).first().click();
            await this.waitForLoaders().catch(() => { });
            return selectedText;
        });
    }

    /**
     * Completes selection of Status, 1st valid Class, and 1st valid CR Session in Classes tab.
     * @param {string} [status='In Session'] - Class status.
     **/
    async selectClassAndSession(status = 'In Session') {
        await this.selectClassStatus(status);
        await this.selectFirstValidClass();
        await this.selectFirstValidCRSession();
    }

    /**
     * Selects an action from the action dropdown in Classes tab.
     * @param {'Attendance'|'Enroll Students'|'Edit Info'|'Print Roster'|string} actionName
     **/
    async selectClassAction(actionName) {
        await test.step(`Select Action "${actionName}" from dropdown`, async () => {
            await this.waitForVisible(this.classActionDropdownBtn);
            await this.click(this.classActionDropdownBtn);
            const actionOption = this.page.locator('ul.dropdown-menu.inner.selectpicker')
                .locator('li')
                .filter({ visible: true })
                .filter({ hasText: new RegExp(`^\\s*${actionName}\\s*$`, 'i') })
                .first();
            await this.waitForVisible(actionOption, 10000);
            await actionOption.locator('a').or(actionOption).first().click();
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Clicks the Go button in the Classes tab.
     **/
    async clickClassGoButton() {
        await test.step('Click Go button in Classes tab', async () => {
            await this.waitForVisible(this.classGoBtn);
            await this.click(this.classGoBtn);
            await this.waitForLoaders().catch(() => { });
        });
    }

    /**
     * Clicks Go for Print Roster, waits for new tab to open, verifies its title contains "Attendance Report", and closes it.
     **/
    async clickGoAndVerifyPrintRosterTab() {
        return await test.step('Click Go and verify Print Roster opens in a new tab with title "Attendance Report"', async () => {
            const popupPromise = this.page.waitForEvent('popup');
            await this.click(this.classGoBtn);
            const popupPage = await popupPromise;
            await popupPage.waitForLoadState('domcontentloaded');
            await expect(popupPage).toHaveTitle(/Attendance Report/i);
            await popupPage.close();
        });
    }

    /**
     * Clicks the settings gear icon, selects 'Page Settings', and waits for the Page Settings popup tab.
     * @returns {Promise<import('@playwright/test').Page>} The Page Settings popup page instance.
     **/
    async openPageSettings() {
        return await test.step('Open Page Settings in a new tab via gear icon', async () => {
            await this.waitForLoaders().catch(() => { });
            await this.waitForVisible(this.settingsGearIcon, 15000);
            await this.click(this.settingsGearIcon);
            await this.waitForVisible(this.pageSettingsLink, 5000);

            const popupPromise = this.page.waitForEvent('popup');
            await this.click(this.pageSettingsLink);
            const settingsPage = await popupPromise;
            await settingsPage.waitForLoadState('load', { timeout: 30000 });

            return settingsPage;
        });
    }

}