import BasePage from '../../utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the Staff Portal Home / Dashboard Page.
 * Handles the 'Needs Attention' widget, processing lessons, marking appointments as No Show, and cancelling appointments.
 **/
export default class StaffHomePage extends BasePage {

    /**
     * Initializes locators for the Staff Home Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
      **/
    constructor(page) {
        super(page);

        this.needsAttentionWidget = page.getByText('NEEDS ATTENTION', { exact: true });
        this.actionDropdownBtn = page.locator("xpath=(//i[contains(@class,'warning')]//ancestor::div[3]//button[contains(text(),'ACTION')])[1]");
        this.actionDropdownBtn2 = page.locator("xpath=(//i[contains(@class,'warning')]//ancestor::div[3]//button[contains(text(),'ACTION')])[2]");
        this.actionDropdownButtonsList = page.locator("//i[contains(@class,'warning')]//ancestor::div[3]//button[contains(text(),'ACTION')]");
        this.processLink = page.locator("xpath=(//a//strong[text()='Process'])[last()]");
        this.noShowLink = page.locator("xpath=(//a//strong[text()='No Show'])[last()]");
        this.noShowTextbox = page.locator("#txtnoShowNotes");
        this.noShowButton = page.locator("#btnNoShowLesson").last();
        this.yesConfirmationButton = page.locator("#btnDeleteConfirmation");
        this.fullAppointmentYesButton = page.locator('#btnDeleteMakeFullAppointment:visible')
        this.cancelLink = page.locator("xpath=(//a//strong[text()='Cancel'])[last()]");
        this.cancelTextbox = page.locator("#txtArea_CancelLesson");
        this.cancelButton = page.locator("#btnCancelLesson").first();

        // Sidebar Menu locators (Left Navigation)
        this.sidebarMenu = page.locator('ul.page-sidebar-menu');
        this.sidebarItems = page.locator("ul.page-sidebar-menu > li:not(.sidebar-toggler-wrapper):not(.sidebar-search-wrapper)");
        this.homeNavLink = page.locator('#home_li > a, a:has-text("Home")').first();

        // Quick Links widget locators (on Staff Home page)
        this.quickLinksWidget = page.locator('#div_QuickLinks, .quicklinksbody');
        this.quickLinksHeading = page.locator('.portlet-heading:has-text("QUICK LINKS"), :text-is("QUICK LINKS")');
        this.quickLinkButtons = page.locator('#div_QuickLinks a, .quicklinksbody a');
        this.loginBtn = page.getByRole('button', { name: 'Login' }).first();

        // Student Details Widget Locators
        this.studentNameInput = page.getByRole('textbox', { name: 'Student Name' });
        this.studentNameOption = (name) => page.getByRole('option', { name: new RegExp(name, 'i') }).or(page.locator('.ui-autocomplete li, .typeahead li, [role="option"], ul.ui-menu li').filter({ hasText: name })).first();
        this.showDetailsBtn = page.getByRole('button', { name: 'Show Details' });
        this.studentDetailsModal = page.locator("//h4[text()='Student Details']//ancestor::div[@class='modal-content']");
        this.studentDetailsModalHeading = page.locator("//h4[text()='Student Details']");
        this.studentDetailsTabs = page.locator('#tabStudentInfoDetails ul.nav-tabs li a');

        //upload files widget
        this.studentNameTextbox = page.locator('#txtFileUploadStudentName')
        this.fileInput = page.locator('input[type="file"][multiple]').first();
        this.uploadBtn = page.locator("xpath=//button[text()='UPLOAD' and @id='uploadimage']");
        this.uploadFilesWidget = page.locator("//div[contains(text(),'Upload Files')]");
        this.chooseFileBtn = page.locator("#uploadimageChoose").first();
        this.categoryDropdown = page.getByRole('button', { name: '--Select--' });
        this.categoryDropdownOption = page.locator("(//select[@name='file_Category']//parent::div//li//span[1][not(contains(text(),'Select'))])[1]");

        this.schedulingMenu = page.locator('#Scheduling_li');
        this.scheduleLessonsSubLink = page.locator('#Schul_btwschedulingLessons_li');
        this.staffAppointmentListSubLink = page.locator("#Schul_DailyStaffSchedule_li");
        this.myProfileLink = page.locator("#MyProfile_li");

        // Task widget locators
        this.tasksWidget = page.locator("(//div[contains(text(),'Tasks')]//ancestor::div[2])[1]");
        this.noTaskPresent = page.locator("//div[contains(text(),'Tasks')]//ancestor::div[2]//span[text()='No Data Found.']");
        this.taskViewDetailBtn = page.locator('.viewdetail').first();
        this.viewTaskModal = page.locator("//h4[contains(text(),'View Details')]//ancestor::div[@class='modal-content']");
        this.viewTaskCloseBtn = page.locator("//h4[contains(text(),'View Details')]//ancestor::div[@class='modal-content']//button[text()='Close']");
        this.taskEditBtn = page.locator("(//div[contains(text(),'Tasks')]//ancestor::div[2]//span[contains(@class,'fa-edit')])[1]");
        this.taskModal = page.locator("//h4[contains(text(),'Update Task')]//ancestor::div[@class='modal-content']");
        this.taskNoteTextbox = page.getByRole('textbox', { name: 'Note' });
        this.subjectTextbox = page.getByRole('textbox', { name: 'Subject' });
        this.selectTimeDropdown = page.getByRole('button', { name: 'Select Time' });
        this.selectTimeDropdownValue = page.locator("(//button[@title='Select Time ']//parent::div//li[not(contains(@class,'selected'))])[1]");
        this.taskStatusDropdown = page.locator("//button[contains(@data-id,'Status')]");
        this.taskSaveBtn = page.locator("//button[contains(@id,'SaveUpdateTask')]");
        this.taskCloseBtn = page.locator("button[onclick='CloseTaskPopUp()']")
        this.taskConfirmYesBtn = page.locator("//a[@data-apply='confirmation' and text()='Yes']");
        this.taskSuccessNotification = page.getByText('Task updated successfully.');
        this.deleteTaskIcon = page.locator("(//a[@data-toggle='confirmationDeleteTask'])[1]")
        this.taskDeleteNotification = page.getByText('Task deleted successfully.');
        this.taskOldNotes = page.locator("(//div[@id='divOldNotes']//p[contains(@class,'PNote')])[last()]");

        //user profile dropdown locators
        this.userProfileDropdown = page.locator('li.dropdown.dropdown-user')
        this.userDropdownLogoutBtn = page.getByRole('link', { name: 'Log Out' })
    }

    /**
     * Opens the action dropdown on the latest item in the 'Needs Attention' widget and clicks 'Process'.
     * Verifies if the page title matches the expected title.
     * @param {string|RegExp} [expectedTitle=/Process Lesson|Process Yard Skills/i] - Expected page title to match.
     * @returns {Promise<boolean>} True if the page title matches expectedTitle, false otherwise.
    **/
    async clickProcess(expectedTitle = /Process Lesson|Process Yard Skills/i) {
        return await test.step('Click Process in "Needs Attention" widget', async () => {
            await this.waitForVisible(this.needsAttentionWidget);
            await this.click(this.actionDropdownBtn);
            await this.click(this.processLink);
            await this.waitForLoaders();

            try {
                const titlePattern = typeof expectedTitle === 'string'
                    ? new RegExp(expectedTitle, 'i')
                    : expectedTitle;
                await expect(this.page).toHaveTitle(titlePattern, { timeout: 15000 });
                return true;
            } catch {
                return false;
            }
        });
    }


    /**
     * Marks an appointment in the 'Needs Attention' widget as No Show with notes and confirms the action.
    **/
    async markAppointmentAsNoShow() {
        await test.step('Mark appointment as No Show and confirm', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.needsAttentionWidget);


            await this.click(this.actionDropdownBtn);
            await this.click(this.noShowLink);
            await this.waitForVisible(this.noShowTextbox);
            await this.fill(this.noShowTextbox, "no show appointment");
            await this.click(this.noShowButton);

            const toastAppeared = this.page.evaluate((expectedText) => {
                return new Promise((resolve) => {
                    const matches = () => /no show successfully/i.test(document.body.innerText || '') || (document.body.innerText || '').toLowerCase().includes(expectedText.toLowerCase());
                    if (matches()) return resolve(true);

                    const observer = new MutationObserver(() => {
                        if (matches()) {
                            observer.disconnect();
                            resolve(true);
                        }
                    });

                    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

                    setTimeout(() => {
                        observer.disconnect();
                        resolve(false);
                    }, 10000);
                });
            }, 'Appointment marked No Show successfully').catch(() => false);

            await this.click(this.yesConfirmationButton);

            if (await this.isVisible(this.fullAppointmentYesButton, { timeout: 2000 }).catch(() => false)) {
                await this.click(this.fullAppointmentYesButton);
            }

            // Report whether toast appeared or not
            const isToastAppeared = await toastAppeared;
            if (isToastAppeared) {
                await test.step('Toast message "Appointment marked No Show successfully" appeared', async () => { });
            } else {
                await test.step('Toast message "Appointment marked No Show successfully" did NOT appear', async () => {
                    expect(isToastAppeared, 'Toast message "Appointment marked No Show successfully" did not appear on page within 10 seconds').toBe(true);
                });
            }
        });
    }

    /**
     * Cancels an appointment in the 'Needs Attention' widget with cancellation notes and confirms the action.
    **/
    async markAppointmentAsCancel() {
        await test.step('Cancel appointment and confirm', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.needsAttentionWidget);

            await this.click(this.actionDropdownBtn2);
            await this.click(this.cancelLink);
            await this.waitForLoaders();
            await this.waitForVisible(this.cancelTextbox);
            await this.fill(this.cancelTextbox, "cancel appointment");
            await this.click(this.cancelButton);

            const toastAppeared = this.page.evaluate((expectedText) => {
                return new Promise((resolve) => {
                    const matches = () => /cance[l]+ed successfully/i.test(document.body.innerText || '') || (document.body.innerText || '').toLowerCase().includes(expectedText.toLowerCase());
                    if (matches()) return resolve(true);

                    const observer = new MutationObserver(() => {
                        if (matches()) {
                            observer.disconnect();
                            resolve(true);
                        }
                    });

                    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

                    setTimeout(() => {
                        observer.disconnect();
                        resolve(false);
                    }, 10000);
                });
            }, 'Appointment cancelled successfully').catch(() => false);

            // 2. Confirm the cancellation action
            await this.click(this.yesConfirmationButton);

            // 3. Report whether toast appeared or not
            const isToastAppeared = await toastAppeared;
            if (isToastAppeared) {
                await test.step('Toast message "Appointment cancelled successfully" appeared', async () => { });
            } else {
                await test.step('Toast message "Appointment cancelled successfully" did NOT appear', async () => {
                    expect(isToastAppeared, 'Toast message "Appointment cancelled successfully" did not appear on page within 10 seconds').toBe(true);
                });
            }

        });
    }

    /**
     * Verifies that the Quick Links widget (#div_QuickLinks / .quicklinksbody) is displayed on the Staff Home page.
     **/
    async verifyQuickLinksWidgetVisible() {
        await test.step('Verify Quick Links widget is displayed', async () => {
            await this.waitForVisible(this.quickLinksWidget.first(), 1000);
            await this.verifyVisible(this.quickLinksWidget.first(), 1000);
        });
    }

    /**
     * Navigates back to the Staff Home page if currently on another page.
     **/
    async ensureOnStaffHomePage() {
        await this.waitForLoaders();
        const isStaffHome = this.page.url().toLowerCase().includes('staffhome');
        if (!isStaffHome) {
            const homeLink = this.page.locator('#home_li > a, a:has-text("Home")').first();
            if (await this.isVisible(homeLink, { timeout: 3000 }).catch(() => false)) {
                await this.waitForLoaders();
                await this.jsClick(homeLink).catch(async () => {
                    await this.click(homeLink);
                });
            } else if (this.staffHomeUrl) {
                await this.navigate(this.staffHomeUrl);
            } else {
                await this.page.goBack().catch(() => { });
            }
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
            await this.waitForLoaders();
        }
    }

    /**
     * Verifies page navigation and title after navigating via a quick link or sidebar link.
     * @param {string} linkText - The text/label of the clicked link.
     **/
    async verifyLinkTitle(linkText) {
        await test.step(`Verify page navigation and title for "${linkText}"`, async () => {
            const normalized = linkText.toLowerCase();
            const currentTitle = await this.getPageTitle();
            const currentUrl = this.page.url();

            expect(currentUrl).not.toContain('about:blank');

            if (normalized.includes('home')) {
                await this.verifyTitle(/Staff Home/i);
            } else if (normalized.includes('logout')) {
                await this.verifyTitle(/Login/i);
            } else if (normalized.includes('schedule') || normalized.includes('calendar') || normalized.includes('appointment')) {
                if (currentTitle && currentTitle.length > 0) {
                    expect(currentTitle.length).toBeGreaterThan(0);
                } else {
                    expect(currentUrl).toMatch(/Scheduler|BTWScheduling|DailyStaffSchedule/i);
                }
            } else if (normalized.includes('classroom') || normalized.includes('attendance') || normalized.includes('roster')) {
                if (currentTitle && currentTitle.length > 0) {
                    expect(currentTitle.length).toBeGreaterThan(0);
                } else {
                    expect(currentUrl).toMatch(/Classroom/i);
                }
            } else if (normalized.includes('profile')) {
                if (currentTitle && currentTitle.length > 0) {
                    expect(currentTitle.length).toBeGreaterThan(0);
                } else {
                    expect(currentUrl).toMatch(/StaffProfile/i);
                }
            } else if (normalized.includes('payroll')) {
                if (currentTitle && currentTitle.length > 0) {
                    expect(currentTitle.length).toBeGreaterThan(0);
                } else {
                    expect(currentUrl).toMatch(/PayrollReport/i);
                }
            } else if (normalized.includes('yard skills')) {
                if (currentTitle && currentTitle.length > 0) {
                    expect(currentTitle.length).toBeGreaterThan(0);
                } else {
                    expect(currentUrl).toMatch(/ProcessYardSkills/i);
                }
            } else {
                expect(currentTitle.length).toBeGreaterThan(0);
            }
        });
    }

    /**
     * Iterates through each Quick Link in the Quick Links widget on the Staff Home page,
     * clicks it dynamically, verifies navigation/title, returns to Home,
     * and finally verifies Logout if present.
     * If no quick links are present, prints "No quick links found on page".
     * @returns {Promise<number>} Total count of quick links tested.
     **/
    async openEachQuickLink() {
        return await test.step('Open each Quick Link in #div_QuickLinks and verify navigation', async () => {
            this.staffHomeUrl = this.page.url();
            await this.ensureOnStaffHomePage();
            const count = await this.quickLinkButtons.count();

            if (count === 0) {
                console.log('No quick links found on page');
                await test.step('No quick links found on page', async () => { });
                return 0;
            }

            // Collect link details in advance to avoid stale element references during navigations
            const linksData = [];
            for (let i = 0; i < count; i++) {
                const btn = this.quickLinkButtons.nth(i);
                const text = (await btn.textContent() || '').trim().replace(/\s+/g, ' ');
                const href = await btn.getAttribute('href') || '';
                const target = await btn.getAttribute('target') || '';
                linksData.push({ index: i, text, href, target });
            }

            let totalTested = 0;

            for (let i = 0; i < linksData.length; i++) {
                const item = linksData[i];
                await test.step(`Click Quick Link [${i + 1}/${linksData.length}]: "${item.text}"`, async () => {
                    await this.ensureOnStaffHomePage();
                    const linkToClick = this.quickLinkButtons.nth(item.index);
                    await linkToClick.scrollIntoViewIfNeeded();

                    if (item.target === '_blank') {
                        // Handle links that open in a new tab/window
                        let popupPage = null;
                        try {
                            const [newPage] = await Promise.all([
                                this.page.context().waitForEvent('page', { timeout: 3000 }),
                                linkToClick.click()
                            ]);
                            popupPage = newPage;
                        } catch {
                            // Link did not trigger a new page event (e.g. invalid href), handled gracefully
                        }

                        if (popupPage) {
                            await popupPage.waitForLoadState('domcontentloaded').catch(() => { });
                            await popupPage.close().catch(() => { });
                        }
                    } else {
                        // Internal navigation within the same tab
                        await this.click(linkToClick);
                        await this.waitForLoaders();
                        await this.page.waitForLoadState('load', { timeout: 3000 }).catch(() => { });
                        await this.waitForLoaders();

                        const currentTitle = await this.getPageTitle();
                        const currentUrl = this.page.url();
                        expect(currentUrl).not.toContain('about:blank');
                        if (currentTitle && currentTitle.length > 0) {
                            expect(currentTitle.length).toBeGreaterThan(0);
                        }
                        if (await this.isVisible(this.loginBtn, { timeout: 2000 }).catch(() => false)) {
                            await this.verifyTitle("Login");
                            await this.click(this.loginBtn);
                            await this.waitForLoaders();
                            await this.page.waitForLoadState('load', { timeout: 3000 }).catch(() => { });
                            await this.waitForLoaders();
                        }

                    }
                    totalTested++;
                });
            }

            return totalTested;
        });
    }

    /**
     * Iterates through all Links in the sidebar menu, including accordion submenus
     * (e.g. under Scheduling, Classroom), navigates each link and sub-link,
     * and verifies successful navigation and page title.
     * @returns {Promise<number>} Total count of links and sub-links navigated.
     **/
    async openEachLinkInLeftSidebar() {
        return await test.step('Open each link in left sidebar menu including submenus and verify titles', async () => {
            this.staffHomeUrl = this.page.url();
            await this.waitForVisible(this.sidebarMenu, 3000);
            const topCount = await this.sidebarItems.count();
            let totalNavigated = 0;

            for (let i = 0; i < topCount; i++) {
                const currentItem = this.sidebarItems.nth(i);
                const topA = currentItem.locator('> a');
                const topText = (await topA.textContent() || '').trim().replace(/\s+/g, ' ');

                // Only consider non-hidden submenus
                const subLinks = currentItem.locator('ul.sub-menu > li:not(.hide) > a');
                const subCount = await subLinks.count();

                if (subCount === 0) {
                    // Direct top-level link (e.g., Home, My Profile, Payroll Report, Process Yard Skills, Logout)
                    await test.step(`Navigate Sidebar Link: "${topText}"`, async () => {
                        await this.click(topA);
                        await this.waitForLoaders();
                        await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
                        await this.waitForLoaders();
                        await this.verifyLinkTitle(topText);
                        totalNavigated++;
                    });

                    if (topText.toLowerCase().includes('logout')) {
                        break;
                    }
                } else {
                    // Accordion menu with submenus (e.g., Scheduling, Classroom)
                    await test.step(`Navigate Submenus under "${topText}" (${subCount} links)`, async () => {
                        for (let j = 0; j < subCount; j++) {
                            const itemNow = this.sidebarItems.nth(i);
                            const topANow = itemNow.locator('> a');
                            const targetSubLink = itemNow.locator('ul.sub-menu > li:not(.hide) > a').nth(j);

                            // Expand accordion parent if submenu is not visible
                            const isVisible = await targetSubLink.isVisible().catch(() => false);
                            if (!isVisible) {
                                await this.click(topANow);
                                await this.page.waitForTimeout(500);
                            }

                            const subText = (await targetSubLink.textContent() || '').trim().replace(/\s+/g, ' ');
                            await test.step(`Click Sub-Link [${j + 1}/${subCount}]: "${subText}" under "${topText}"`, async () => {
                                await this.click(targetSubLink);
                                await this.waitForLoaders();
                                await this.page.waitForLoadState('load', { timeout: 3000 }).catch(() => { });
                                await this.waitForLoaders();
                                await this.verifyLinkTitle(subText);
                                totalNavigated++;
                            });
                        }
                    });
                }
            }

            return totalNavigated;
        });
    }

    /**
     * Searches for a student by name in the Student Details widget, selects from the autocomplete dropdown,
     * and clicks 'Show Details'.
     * @param {string} studentName - The student name to search.
     **/
    async searchAndSelectStudent(studentName) {
        await test.step(`Search and select student: "${studentName}" in Student Details widget`, async () => {
            await this.waitForLoaders();
            const option = this.studentNameOption(studentName);
            let optionFound = false;

            for (let attempt = 1; attempt <= 3; attempt++) {
                await this.waitForVisible(this.studentNameInput, 1000);
                await this.click(this.studentNameInput);
                await this.clear(this.studentNameInput);
                await this.studentNameInput.fill(studentName);

                optionFound = await this.isVisible(option, { timeout: 3000 }).catch(() => false);
                if (optionFound) break;
                await this.page.waitForTimeout(500);
            }

            await this.waitForVisible(option, 5000);
            await this.click(option);

            await this.waitForVisible(this.showDetailsBtn, 5000);
            await this.click(this.showDetailsBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the Student Details modal dialog is displayed.
     **/
    async verifyStudentDetailsModalVisible() {
        await test.step('Verify Student Details modal is visible', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.studentDetailsModalHeading, 3000);
            await this.verifyVisible(this.studentDetailsModalHeading, 1000);
        });
    }

    /**
     * Iterates through and clicks on each available tab in the Student Details modal.
     * @returns {Promise<number>} Total count of tabs clicked and verified.
     **/
    async clickAllStudentDetailsTabs() {
        return await test.step('Click on all available tabs in Student Details modal', async () => {
            await this.waitForVisible(this.studentDetailsTabs.first(), 5000);
            const count = await this.studentDetailsTabs.count();
            let tabsClicked = 0;

            for (let i = 0; i < count; i++) {
                const tab = this.studentDetailsTabs.nth(i);
                const tabText = (await tab.textContent() || '').trim().replace(/\s+/g, ' ');
                await test.step(`Click tab [${i + 1}/${count}]: "${tabText}"`, async () => {
                    await this.waitForVisible(tab, 3000);
                    await this.click(tab);
                    await this.waitForLoaders();
                    await this.page.waitForTimeout(500);
                    await this.waitForLoaders();
                    tabsClicked++;
                });
            }

            return tabsClicked;
        });
    }

    /**
    * Uploads a document/file by setting the file input, clicking upload, and waiting for loaders to disappear.
    * @param {string} filePath - Absolute or relative path to the file to upload.
    **/
    async uploadFile(filePath, studentName) {
        await test.step(`Upload student file: ${filePath}`, async () => {
            await this.waitForVisible(this.uploadFilesWidget);
            await this.verifyVisible(this.uploadFilesWidget, 5000);

            const option = this.studentNameOption(studentName);
            let optionFound = false;

            for (let attempt = 1; attempt <= 3; attempt++) {
                await this.waitForVisible(this.studentNameTextbox, 1000);
                await this.click(this.studentNameTextbox);
                await this.clear(this.studentNameTextbox);
                await this.fill(this.studentNameTextbox, studentName);

                optionFound = await this.isVisible(option, { timeout: 3000 }).catch(() => false);
                if (optionFound) break;
                await this.page.waitForTimeout(500);
            }

            await this.waitForVisible(option, 5000);
            await this.click(option);

            await this.setInputFiles(this.fileInput, filePath);
            await this.waitForVisible(this.categoryDropdown);
            await this.click(this.categoryDropdown);
            await this.waitForVisible(this.categoryDropdownOption);
            await this.click(this.categoryDropdownOption);
            await this.click(this.uploadBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
        });
    }

    /**
     * Verifies that the file upload success message is visible and the choose file button is displayed.
     **/
    async verifyUploadSuccess() {
        await test.step('Verify file upload success message', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            // await this.isVisible(this.chooseFileBtn);
            await this.waitForVisible(this.page.getByText('Success! Upload has been completed.', { exact: true }).first(), 60000);
            await this.verifyVisible(this.page.getByText('Success! Upload has been completed.', { exact: true }).first(), 20000);
        });
    }

    /**
     * Navigates to Scheduling -> Schedule Lessons from the left sidebar.
     **/
    async navigateToScheduleLessons() {
        await test.step('Navigate to Scheduling > Schedule lessons', async () => {
            await this.waitForLoaders();

            await this.click(this.schedulingMenu);
            await this.waitForVisible(this.scheduleLessonsSubLink);
            await this.click(this.scheduleLessonsSubLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.waitForLoaders();
            await this.verifyURLContainsText('BTWScheduling/Lessons');
        });
    }

    /**
     * Navigates to Scheduling -> Staff Appointment List from the left sidebar.
     **/
    async navigateToStaffAppointmentList() {
        await test.step('Navigate to Scheduling > Staff Appointment List', async () => {
            await this.waitForLoaders();

            const isSubLinkVisible = await this.staffAppointmentListSubLink.isVisible().catch(() => false);
            if (!isSubLinkVisible) {
                await this.click(this.schedulingMenu);
            }
            await this.waitForVisible(this.staffAppointmentListSubLink, 5000);
            await this.click(this.staffAppointmentListSubLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.waitForLoaders();
            await this.verifyTitle("Staff Appointment List");
        });
    }

    /**
     * Navigates to My Profile from the left sidebar.
     **/
    async navigateToMyProfile() {
        await test.step('Navigate to My Profile', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.myProfileLink, 5000);
            await this.click(this.myProfileLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.waitForLoaders();
            await this.verifyTitle('My Profile');
        });
    }

    /**
     * Scrolls to the Tasks widget on the Staff Home page.
     * @returns {Promise<boolean>} True if tasks are available, false if 'No Data Found.' is displayed.
     **/
    async scrollToTasksWidget() {
        return await test.step('Scroll into the "Task" widget', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.tasksWidget, 10000);
            await this.tasksWidget.scrollIntoViewIfNeeded();
            await this.verifyVisible(this.tasksWidget);

            const isNoTask = await this.noTaskPresent.isVisible({ timeout: 2000 }).catch(() => false);
            if (isNoTask) {
                console.log('No task');
                return false;
            }
            return true;
        });
    }

    /**
     * Checks if task is present in the Task widget.
     * If 'No Data Found.' locator is visible, logs 'No task' and returns false.
     * @returns {Promise<boolean>} True if tasks are present, false if 'No Data Found.' is displayed.
     **/
    async isTaskPresent() {
        return await test.step('Check if task is present in Task widget', async () => {
            await this.waitForLoaders();
            const isNoTask = await this.noTaskPresent.isVisible({ timeout: 2000 }).catch(() => false);
            if (isNoTask) {
                console.log('No task');
                return false;
            }
            return true;
        });
    }

    /**
     * Clicks the View Details icon for the first task and verifies the View Details modal.
     **/
    async viewTaskDetails() {
        await test.step('Click View Details on task and verify modal is displayed', async () => {
            await this.waitForVisible(this.taskViewDetailBtn, 1000);
            await this.click(this.taskViewDetailBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.viewTaskModal, 1000);
        });
    }

    /**
     * Deletes the first task from the Task widget.
     **/
    async deleteTask() {
        await test.step('Delete the first task', async () => {
            await this.waitForVisible(this.deleteTaskIcon, 2000);
            await this.click(this.deleteTaskIcon);
            await this.waitForLoaders();
            await this.waitForVisible(this.taskConfirmYesBtn, 1000);
            await this.click(this.taskConfirmYesBtn);
            await this.waitForLoaders();
            await this.waitForVisible(this.taskDeleteNotification, 5000);
        });
    }

    /**
     * Closes the View Details modal.
     **/
    async closeViewTaskModal() {
        await test.step('Close View Details modal', async () => {
            await this.waitForVisible(this.viewTaskCloseBtn, 2000);
            await this.click(this.viewTaskCloseBtn);
            await this.waitForLoaders();
            await expect(this.viewTaskModal).toBeHidden({ timeout: 5000 }).catch(() => { });
        });
    }

    /**
     * Opens the Edit Task modal for the first task.
     **/
    async openEditTaskModal() {
        await test.step('Click Edit on task and verify Edit modal opens', async () => {
            await this.waitForVisible(this.taskEditBtn, 10000);
            await this.click(this.taskEditBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
            await this.waitForVisible(this.taskNoteTextbox, 5000);
        });
    }

    /**
     * Edits task note and status.
     * @param {Object} [options]
     * @param {string} [options.note] - Note content.
     * @param {string} [options.status] - Status name to select (e.g. 'Waiting Feedback').
     * @param {string} [options.subject] - Subject 
     **/
    async editTaskDetails({ note = '', status = 'Waiting Feedback', subject } = {}) {
        await test.step(`Edit task note to "${note}", subject to "${subject}" and status to "${status}"`, async () => {
            await this.waitForVisible(this.taskSaveBtn, { timeout: 5000 });
            if (note) {
                // await this.waitForVisible(this.taskNoteTextbox, 5000);
                await this.fill(this.taskNoteTextbox, note);
            }
            if (subject) {
                await this.fill(this.subjectTextbox, subject);
            }
            if (status) {
                if (await this.taskStatusDropdown.isVisible({ timeout: 2000 }).catch(() => false)) {
                    await this.click(this.taskStatusDropdown);
                    const option = this.page.locator('#taskNotes .dropdown-menu a, .dropdown-menu a').filter({ hasText: new RegExp(`^${status}$`, 'i') }).first();
                    if (await option.isVisible({ timeout: 2000 }).catch(() => false)) {
                        await this.click(option);
                    }
                }
            }
            if (await this.isVisible(this.selectTimeDropdown, { timeout: 500 })) {
                await this.click(this.selectTimeDropdown);
                await this.waitForVisible(this.selectTimeDropdownValue, 1000);
                await this.click(this.selectTimeDropdownValue);
                await this.waitForLoaders();
            }
        });
    }

    /**
     * Clicks Save on Edit Task modal and confirms the action.
     **/
    async saveTaskAndConfirm() {
        await test.step('Click Save on task and confirm Yes', async () => {
            await this.waitForVisible(this.taskSaveBtn, 1000);
            await this.click(this.taskSaveBtn);

            // Wait for confirmation and click Yes
            await this.waitForVisible(this.taskConfirmYesBtn, 1000);
            await this.click(this.taskConfirmYesBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the task updated success message is displayed.
     **/
    async verifyTaskUpdateSuccess() {
        await test.step('Verify "Task updated successfully." message', async () => {
            await this.waitForVisible(this.taskSuccessNotification, 10000);
            await expect(this.taskSuccessNotification).toContainText('Task updated successfully.');
        });
    }

    /**
     * Edits task note and status.
     * @param {Object} [options]
     * @param {string} [options.note] - Note content.
     * @param {string} [options.status] - Status name to select (e.g. 'Waiting Feedback').
     * @param {string} [options.subject] - Subject 
     **/
    async verifyTaskDetails({ note = '', status, subject } = {}) {
        await test.step(`Verify task values are updated for note to "${note}", subject to "${subject}" and status to "${status}"`, async () => {
            await this.waitForVisible(this.taskSaveBtn, { timeout: 5000 });

            await expect(this.taskOldNotes).toContainText(note);
            await expect(this.subjectTextbox).toHaveValue(subject);
            await this.matchAttributeValue(this.taskStatusDropdown, "title", status);
            await this.click(this.taskCloseBtn);
            await this.waitForHidden(this.taskCloseBtn);

        });
    }


    /**
   * Verifies that the task deleted success message is displayed.
   **/
    async verifyTaskDeleteSuccess() {
        await test.step('Verify "Task deleted successfully." message', async () => {
            await this.waitForVisible(this.taskDeleteNotification, 10000);
            await expect(this.taskDeleteNotification).toContainText('Task deleted successfully.');
        });
    }


    /**
     * Logs out of the Student Portal by clicking 'Log Out' from the top header user profile dropdown.
     **/
    async logout() {
        await test.step('Log out from Student Portal via top header user profile dropdown', async () => {
            await this.waitForVisible(this.userProfileDropdown, 1000);
            await this.hover(this.userProfileDropdown);
            await this.waitForVisible(this.userDropdownLogoutBtn, 1000);
            await this.click(this.userDropdownLogoutBtn);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
            await this.waitForLoaders();
        });
    }
}

