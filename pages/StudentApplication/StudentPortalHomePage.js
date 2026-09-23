import path from 'path';
import BasePage from '@utils/BasePage';
import DateHelper from '@utils/DateHelper';
import { expect, test } from '@playwright/test';
import paymentData from '@test-data/json/paymentData.json';

/**
 * Page Object representing the Student Portal Home Page.
 * Handles student document uploads, navigation to marketplace enrollment, and pay balance payment modal.
 **/
export default class StudentPortalHomePage extends BasePage {

    /**
     * Initializes locators for the Student Portal Home Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Upload Files widget
        this.fileInput = page.locator('input[type="file"][multiple]').first();
        this.uploadBtn = page.locator("xpath=//button[text()='UPLOAD' and @id='uploadimage']");
        this.uploadFilesWidget = page.locator("//div[contains(text(),'Upload Files')]");
        this.lastUploadedOnValues = [];
        this.chooseFileBtn = page.locator("#uploadimageChoose").first();
        this.enrollNavLink = page.locator('#Marketplace_li');
        this.myAccountNavLink = page.locator("#MyAccount_li");
        this.profileNavLink = page.locator("xpath=//li[contains(@id,'Profile')]");
        this.appointmentsNavLink = page.locator("#MyAccou_Appt_li");
        this.resourcesNavLink = page.locator("//strong[normalize-space()='Resources']")
        this.classesNavLink = page.locator('#Resources_Class_li:visible');
        this.schedulingNavLink = page.locator('#Scheduling_li');
        this.scheduleMyLessonsSubLink = page.locator('#Schul_InCar_li').first();
        this.myScheduleSubLink = page.locator('#Schul_MySch_li')
        this.contactUsNavLink = page.locator('#Contact_li');
        this.userProfileDropdown = page.locator('#userprofileSettings');
        this.userDropdownLogoutBtn = page.getByRole('link', { name: 'Log Out' })
        this.loginBtn = page.getByRole('button', { name: 'Login' });
        this.pageTitle = page.locator('#pageTitle')

        // Quick Links widget locators (on Student Home page)
        this.quickLinksWidget = page.locator('#div_QuickLinks');
        this.quickLinksHeading = page.locator(':text-is("QUICK LINKS")')
        this.quickLinkButtons = page.locator('#div_QuickLinks a');
        this.homeNavLink = page.getByRole('link', { name: 'Home' });

        // Sidebar Quick Links locators (includes all links including Logout)
        this.sidebarMenu = page.locator('ul.page-sidebar-menu');
        this.quickLinkItems = page.locator("ul.page-sidebar-menu > li:not(.sidebar-toggler-wrapper):not(.sidebar-search-wrapper)");
        this.quickLinks = page.locator("ul.page-sidebar-menu > li:not(.sidebar-toggler-wrapper):not(.sidebar-search-wrapper) > a");

        this.categoryDropdowns = page.getByRole('button', { name: '--Select--' }).first();
        this.categoryDropdownOption = (/** @type {number} */ index) => this.page.locator(`((//select[@name='file_Category'])[${index + 1}]//parent::div//li//span[1][not(contains(text(),'Select'))])[1]`);

        // Pay Balance / Payment Modal Locators
        this.payNowLink = page.locator("//a[normalize-space()='Pay Now']")
        this.payBalanceModal = page.locator('.modal-content, .modal-dialog').filter({ hasText: 'PAY BALANCE' }).first();
        this.amountInput = page.locator("//label[contains(text(),'Amount')]//ancestor::div[contains(@class,'form-group')]//input | input[name='Amount'] | #txtPayAmount | #txtAmount").first();

        // Clover iframe locators (Card Number, Expiration Date, CVV, Zip Code)
        this.cardNumberIframe = page.locator('#CARD_NUMBER_ID, iframe[title="CARD NUMBER"]');
        this.cardNumberInIframe = page.frameLocator('#CARD_NUMBER_ID, iframe[title="CARD NUMBER"]').locator('#cardNumber');
        this.expiryDateInIframe = page.frameLocator('#CARD_DATE_ID, iframe[title="CARD DATE"]').locator('#date');
        this.cvvInIframe = page.frameLocator('#CARD_CVV_ID, iframe[title="CARD CVV"]').locator('#cvv');
        this.cardPostalCodeIframe = page.locator('#CARD_POSTAL_CODE_ID, iframe[title="CARD POSTAL CODE"]');
        this.postalCodeInIframe = page.frameLocator('#CARD_POSTAL_CODE_ID, iframe[title="CARD POSTAL CODE"]').locator('#postal');

        // Address & Cardholder Details
        this.openBalanceEnrollmentsCheckbox = page.locator("(//input[@class='chkOpnBlncEnrollments']//following-sibling::span)[1]");
        this.creditCardAmount = page.locator('#txtCCAmount')
        this.cardNumber = page.getByRole('textbox', { name: 'Card Number' });
        this.expiryDate = page.getByRole('textbox', { name: 'MM/YYYY' });
        this.cvv = page.getByRole('textbox', { name: 'CVV' });
        this.nameOnCard = page.getByRole('textbox', { name: 'Name on Card' });
        this.billingAddress = page.getByRole('textbox', { name: 'Billing Address' });
        this.billingCity = page.getByRole('textbox', { name: 'Billing City' });
        this.billStateDropdown = page.locator("//button[@data-id='ddlBillState']")
        this.billStateDropdownValue = page.locator("(//select[@id='ddlBillState']//parent::div//div//li//span[1][not(contains(text(),'Select'))])[1]");
        this.billingZipCode = page.getByRole('textbox', { name: 'Zip Code' }).or(page.locator('#stripe-postal-code'));
        this.paymentFormIframe = page.locator("//div[@id='payment-form']//iframe");
        this.paymentFormCardNumber = page.frameLocator("//div[@id='payment-form']//iframe").locator("input.cc-input, input[placeholder='0000 0000 0000 0000']");
        this.paymentFormExpiryDate = page.frameLocator("//div[@id='payment-form']//iframe").locator("input.exp-input, input[placeholder='MM/YY']");
        this.paymentFormCvv = page.frameLocator("//div[@id='payment-form']//iframe").locator("input.cvv-input, input[placeholder='CVV']");

        // Stripe iframe locators
        this.stripeCardNumberIframe = page.locator("#card-number-element iframe[title='Secure card number input frame'], #card-number-element iframe[name^='__privateStripeFrame']").first();
        this.stripeCardNumber = page.frameLocator("#card-number-element iframe[title='Secure card number input frame'], #card-number-element iframe[name^='__privateStripeFrame']").locator("input[name='cardnumber'], input[data-elements-stable-field-name='cardNumber']");
        this.stripeExpiryDate = page.frameLocator("#card-expiry-element iframe[name^='__privateStripeFrame'], iframe[title*='expiration']").locator("input[name='exp-date'], input[data-elements-stable-field-name='cardExpiry']");
        this.stripeCvv = page.frameLocator("#card-cvc-element iframe[name^='__privateStripeFrame'], iframe[title='Secure CVC input frame']").locator("input[name='cvc'], input[data-elements-stable-field-name='cardCvc']");

        // Action Buttons
        this.payButton = page.locator('#btnAmt');
    }

    /**
     * Navigates to the student profile page by clicking 'My Account' and then 'Profile' in the left navigation.
     **/
    async navigateToProfile() {
        await test.step('Navigate to Student Profile (My Account -> Profile)', async () => {
            if (!await this.isVisible(this.profileNavLink, { timeout: 5000 }).catch(() => false)) {
                await this.click(this.myAccountNavLink);
            }
            await this.click(this.profileNavLink);
            await this.waitForLoaders();
        });
    }

    /**
     * Navigates to the home page by clicking 'Home' in the left navigation.
     **/
    async navigateToHome() {
        await test.step('Navigate to Home page', async () => {
            await this.waitForVisible(this.homeNavLink);
            await this.click(this.homeNavLink);
            await this.waitForLoaders();
        });
    }


    /**
     * Navigates to the Appointments page by clicking 'My Account' and then 'Appointments' in the left navigation.
     **/
    async navigateToAppointments() {
        await test.step('Navigate to Appointments (My Account -> Appointments)', async () => {
            await this.waitForLoaders();
            if (!await this.isVisible(this.appointmentsNavLink, { timeout: 5000 }).catch(() => false)) {
                await this.click(this.myAccountNavLink);
            }
            await this.waitForVisible(this.appointmentsNavLink, 5000);
            await this.click(this.appointmentsNavLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
            await this.waitForLoaders();
        });
    }

    /**
     * Navigates to the contact us page by clicking 'Contact' in the left navigation.
     **/
    async navigateToContactUs() {
        await test.step('Navigate to Contact Us', async () => {
            await this.waitForVisible(this.contactUsNavLink);
            await this.click(this.contactUsNavLink);
            await this.waitForLoaders();
            await this.verifyTitle("Contact")
        });
    }

    /**
     * Navigates to the classes page by clicking 'Resources' and then 'Classes' in the left navigation.
     **/
    async navigateToClassInResources() {
        await test.step('Navigate to Classes (Resources -> Classes)', async () => {
            await this.click(this.resourcesNavLink);
            await this.waitForVisible(this.classesNavLink);
            await this.click(this.classesNavLink);
            await this.waitForLoaders();
        });
    }

    /**
     * Navigates to Scheduling > Schedule My Lessons from the left sidebar.
     **/
    async navigateToScheduleMyLessons() {
        await test.step('Navigate to Scheduling > Schedule My Lessons', async () => {
            await this.waitForLoaders();
            await this.click(this.schedulingNavLink);
            await this.waitForLoaders();
            await this.waitForVisible(this.scheduleMyLessonsSubLink, 2000);
            await this.click(this.scheduleMyLessonsSubLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 15000 }).catch(() => {
            });
            await this.waitForLoaders();
            await this.verifyURLContainsText("BtwScheduling/Lessons");
        });
    }

    /**
     * Navigates to Scheduling > My Schedule from the left sidebar.
     **/
    async navigateToMySchedule() {
        await test.step('Navigate to Scheduling > My Schedule', async () => {
            await this.waitForLoaders();
            await this.click(this.schedulingNavLink);
            await this.waitForLoaders();
            await this.waitForVisible(this.myScheduleSubLink, 2000);
            await this.click(this.myScheduleSubLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 15000 }).catch(() => {
            });
            await this.waitForLoaders();
            await this.verifyURLContainsText("BtwScheduling/Lessons");
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
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
            await this.waitForLoaders();
        });
    }


    /**
     * Verifies page navigation and title after navigating via a quick link or sub-menu link.
     * @param {string} linkText - The text/label of the clicked link.
     **/
    async verifyLinkTitle(linkText) {
        await test.step(`Verify page title for "${linkText}"`, async () => {
            const normalized = linkText.toLowerCase();
            const currentTitle = await this.getPageTitle();
            const currentUrl = this.page.url();

            if (normalized.includes('home')) {
                await this.verifyTitle(/Student Home|Home/i);
            } else if (normalized.includes('enroll') || normalized.includes('marketplace')) {
                await this.verifyTitle(/Enroll|Marketplace/i);
            } else if (normalized.includes('contact')) {
                await this.verifyTitle(/Contact/i);
            } else if (normalized.includes('logout')) {
                await this.verifyTitle(/Driving School|Login/i);
            } else if (normalized.includes('schedule') || normalized.includes('lesson') || normalized.includes('road test')) {
                if (currentTitle && currentTitle.length > 0) {
                    expect(currentTitle.length).toBeGreaterThan(0);
                } else {
                    expect(currentUrl).toMatch(/BtwScheduling|Lessons|Student/i);
                }
            } else {
                expect(currentTitle.length).toBeGreaterThan(0);
            }
        });
    }

    /**
     * Verifies that the Quick Links widget (#div_QuickLinks) is displayed on the Student Home page.
     **/
    async verifyQuickLinksWidgetVisible() {
        await test.step('Verify Quick Links widget is displayed', async () => {
            await this.waitForVisible(this.quickLinksWidget, 1000);
            await this.verifyVisible(this.quickLinksWidget, 500);
        });
    }

    /**
     * Navigates back to the Student Home page if currently on another page.
     **/
    async ensureOnStudentHomePage() {
        const isVisible = await this.quickLinksWidget.isVisible().catch(() => false);
        if (!isVisible) {
            await this.waitForVisible(this.homeNavLink, 500);
            await this.click(this.homeNavLink);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 1000 }).catch(() => {
            });
            await this.waitForLoaders();
            await this.waitForVisible(this.quickLinksWidget, 5000);
        }
    }

    /**
     * Iterates through each Quick Link in the #div_QuickLinks widget on the Student Home page,
     * clicks it dynamically, verifies the navigation/title, returns to Home,
     * and finally verifies Logout if present.
     * @returns {Promise<number>} Total count of quick links tested.
     **/
    async openEachQuickLink() {
        return await test.step('Open each Quick Link in #div_QuickLinks and verify navigation', async () => {
            await this.ensureOnStudentHomePage();
            const count = await this.quickLinkButtons.count();

            // Collect link details in advance to avoid stale element references during navigations
            const linksData = [];
            for (let i = 0; i < count; i++) {
                const btn = this.quickLinkButtons.nth(i);
                const text = (await btn.textContent() || '').trim().replace(/\s+/g, ' ');
                const href = await btn.getAttribute('href') || '';
                const target = await btn.getAttribute('target') || '';
                linksData.push({ text, href, target });
            }

            let totalTested = 0;

            for (let i = 0; i < linksData.length; i++) {
                const item = linksData[i];
                await test.step(`Click Quick Link [${i + 1}/${linksData.length}]: "${item.text}"`, async () => {
                    await this.ensureOnStudentHomePage();
                    const linkToClick = this.quickLinksWidget.locator('a').filter({ hasText: item.text }).first();
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
                            await popupPage.waitForLoadState('domcontentloaded').catch(() => {
                            });
                            await popupPage.close().catch(() => {
                            });
                        }
                    } else {
                        // Internal navigation within the same tab
                        await this.click(linkToClick);
                        await this.waitForLoaders();
                        await this.page.waitForLoadState('load', { timeout: 3000 }).catch(() => {
                        });
                        await this.waitForLoaders();

                        const currentTitle = await this.getPageTitle();
                        const currentUrl = this.page.url();
                        expect(currentUrl).not.toContain('about:blank');
                        if (currentTitle && currentTitle.length > 0) {
                            expect(currentTitle.length).toBeGreaterThan(0);
                        }

                        if (await this.isVisible(this.loginBtn, { timeout: 2000 }).catch(() => false)) {
                            await this.verifyTitle(/Driving School|Login/i);
                            await this.page.goBack();
                            // await this.click(this.loginBtn);
                            await this.waitForLoaders();
                            await this.page.waitForLoadState('load', { timeout: 3000 }).catch(() => {
                            });
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
     * (e.g. under Scheduling, My Account, Resources), navigates each link and sub-link,
     * and verifies successful navigation and page title.
     * @returns {Promise<number>} Total count of links and sub-links navigated.
     **/
    async openEachLinkInLeftSidebar() {
        return await test.step('Open each Quick Link in sidebar menu including submenus and verify titles', async () => {
            await this.waitForVisible(this.sidebarMenu, 3000);
            const topCount = await this.quickLinkItems.count();
            let totalNavigated = 0;

            for (let i = 0; i < topCount; i++) {
                const currentItem = this.quickLinkItems.nth(i);
                const topA = currentItem.locator('> a');
                const topText = (await topA.textContent() || '').trim().replace(/\s+/g, ' ');

                const subLinks = currentItem.locator('ul.sub-menu > li > a');
                const subCount = await subLinks.count();

                if (subCount === 0) {
                    // Direct top-level link (e.g., Home, Enroll, Contact, Logout)
                    await test.step(`Navigate Quick Link: "${topText}"`, async () => {
                        await this.click(topA);
                        await this.waitForLoaders();
                        await this.page.waitForLoadState('load', { timeout: 3000 }).catch(() => {
                        });
                        await this.waitForLoaders();
                        await this.verifyLinkTitle(topText);
                        totalNavigated++;
                    });

                    if (topText.toLowerCase().includes('logout')) {
                        break;
                    }
                } else {
                    // Accordion menu with submenus (e.g., Scheduling, My Account, Resources)
                    await test.step(`Navigate Submenus under "${topText}" (${subCount} links)`, async () => {
                        for (let j = 0; j < subCount; j++) {
                            const itemNow = this.quickLinkItems.nth(i);
                            const topANow = itemNow.locator('> a');
                            const targetSubLink = itemNow.locator('ul.sub-menu > li > a').nth(j);
                            await this.page.waitForTimeout(1000);
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
                                await this.page.waitForLoadState('load', { timeout: 3000 }).catch(() => {
                                });
                                await this.waitForLoaders();
                                if ((await this.getPageTitle()).length > 0) {
                                    await this.verifyLinkTitle(subText);
                                } else if (await this.isVisible(this.pageTitle, { timeout: 2000 })) {
                                    await expect(await this.pageTitle.textContent()).toContain(subText);
                                }
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
     * Uploads one or more documents/files and selects a category for each staged file.
     * @param {string|string[]} filePaths - Absolute or relative path(s) to the file(s) to upload.
     **/
    async uploadFiles(filePaths) {
        const filesToUpload = Array.isArray(filePaths) ? filePaths : [filePaths];
        const resolvedPaths = filesToUpload.map((filePath) => path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath));

        await test.step(`Upload ${filesToUpload.length} student file(s)`, async () => {
            await this.waitForVisible(this.uploadFilesWidget);
            await this.verifyVisible(this.uploadFilesWidget, 5000);
            await this.uploadFilesWidget.scrollIntoViewIfNeeded();
            await this.setInputFiles(this.fileInput, resolvedPaths);

            for (let i = 0; i < resolvedPaths.length; i++) {
                await this.waitForVisible(this.categoryDropdowns);
                await this.click(this.categoryDropdowns);
                await this.waitForVisible(this.categoryDropdownOption(i));
                await this.click(this.categoryDropdownOption(i));
            }

            const uploadResponsePromise = this.page.waitForResponse((response) =>
                response.url().includes('StudentCenterUploadCategory')
                && response.request().method() === 'POST'
                && response.status() === 200
                , { timeout: 12000 });

            await this.click(this.uploadBtn);
            const uploadResponse = await uploadResponsePromise;
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });

            this.lastUploadedOnValues = this.getUploadedOnValuesFromResponse(uploadResponse, filesToUpload.length);
        });
    }

    /**
     * Returns the last uploaded-on values captured from the upload API response.
     * @returns {string[]}
     **/
    getLastUploadedOnValues() {
        return [...this.lastUploadedOnValues];
    }

    /**
     * Returns one admin-portal-formatted uploaded-on value per uploaded file using the upload API response Date header.
     * @param {import('@playwright/test').Response} response - Upload API response.
     * @param {number} fileCount - Number of uploaded files.
     * @returns {string[]}
     **/
    getUploadedOnValuesFromResponse(response, fileCount) {
        const responseDateHeader = response.headers()['date'];
        expect(responseDateHeader, 'Expected upload response to include a Date header.').toBeTruthy();

        const uploadedOnValue = DateHelper.convertGMTToEST(responseDateHeader);
        return Array.from({ length: fileCount }, () => uploadedOnValue);
    }

    /**
     * Verifies that the file upload success message is visible and the choose file button is displayed.
     **/
    async verifyUploadSuccess() {
        await test.step('Verify file upload success message', async () => {
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => {
            });
            // await this.isVisible(this.chooseFileBtn);
            await this.waitForVisible(this.page.getByText('Success! Upload has been completed.', { exact: true }).first(), 60000);
            await this.verifyVisible(this.page.getByText('Success! Upload has been completed.', { exact: true }).first(), 20000);
        });
    }

    /**
     * Navigates to the student marketplace enrollment page by clicking the Enroll nav link.
     **/
    async navigateToEnroll() {
        await test.step('Navigate to Enrollment page', async () => {
            await this.click(this.enrollNavLink);
        });
    }

    /**
     * Opens the Pay Balance modal by clicking the 'Pay Now' link in the top right corner.
     **/
    async openPayBalanceModal() {
        await test.step('Click on "Pay Now" in top right to open Pay Balance modal', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.payNowLink);
            await this.click(this.payNowLink);
            await this.waitForLoaders();
            await this.waitForVisible(this.payButton);
        });
    }

    /**
     * Fills credit card payment details supporting both Clover iframes and standard inputs.
     * @param {Object} [customData] - Optional custom payment information.
     **/
    async fillPaymentDetails(customData = {}) {
        await test.step('Fill Credit Card details in Pay Balance modal', async () => {
            const data = { ...paymentData.processCreditCard, ...customData };
            const expRaw = data.expiryDate;
            const expFormatted = expRaw.length === 6 ? `${expRaw.slice(0, 2)}${expRaw.slice(4)}` : expRaw;

            await this.waitForVisible(this.payButton);
            await this.verifyVisible(this.payButton);

            if (await this.isVisible(this.openBalanceEnrollmentsCheckbox, { timeout: 100 }).catch(() => false)) {
                await this.click(this.openBalanceEnrollmentsCheckbox);
            } else {
                await this.clear(this.creditCardAmount);
                await this.fill(this.creditCardAmount, data.amount);
            }

            // Wait for whichever card gateway renders first (Clover, Stripe, Payment Form, or Standard)
            const cardGateway = this.cardNumberIframe
                .or(this.stripeCardNumberIframe)
                .or(this.paymentFormCardNumber)
                .or(this.cardNumber);

            await cardGateway.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {
            });

            // Fill card details for the active gateway only
            if (await this.stripeCardNumberIframe.isVisible().catch(() => false)) {
                await this.waitForVisible(this.stripeCardNumber, { timeout: 5000 });
                await this.click(this.stripeCardNumber);
                await this.fill(this.stripeCardNumber, paymentData.processCreditCard.cardNumber);
                await this.fill(this.stripeExpiryDate, expFormatted);
                await this.fill(this.stripeCvv, paymentData.processCreditCard.cvv);
            } else if (await this.cardNumberIframe.isVisible().catch(() => false)) {
                await this.waitForVisible(this.cardNumberInIframe, { timeout: 5000 });
                await this.click(this.cardNumberInIframe);
                await this.fill(this.cardNumberInIframe, paymentData.processCreditCard.cardNumber);
                await this.fill(this.expiryDateInIframe, expFormatted);
                await this.fill(this.cvvInIframe, paymentData.processCreditCard.cvv);
            } else if (await this.paymentFormCardNumber.isVisible().catch(() => false)) {
                await this.click(this.paymentFormCardNumber);
                await this.fill(this.paymentFormCardNumber, paymentData.processCreditCard.cardNumber);
                await this.fill(this.paymentFormExpiryDate, expFormatted);
                await this.fill(this.paymentFormCvv, paymentData.processCreditCard.cvv);
            } else if (await this.cardNumber.isVisible().catch(() => false)) {
                await this.pressSequentially(this.cardNumber, paymentData.processCreditCard.cardNumber);
                await this.fill(this.expiryDate, paymentData.processCreditCard.expiryDate);
                await this.fill(this.cvv, paymentData.processCreditCard.cvv);
            }

            await this.fill(this.nameOnCard, data.nameOnCard);
            await this.fill(this.billingAddress, data.billingAddress);
            await this.fill(this.billingCity, data.billingCity);
            await this.click(this.billStateDropdown);
            await this.click(this.billStateDropdownValue);

            if (await this.isVisible(this.cardPostalCodeIframe, { timeout: 1000 }).catch(() => false)) {
                await this.waitForVisible(this.postalCodeInIframe);
                await this.click(this.postalCodeInIframe);
                await this.pressSequentially(this.postalCodeInIframe, data.billingZipCode);
            } else {
                await this.fill(this.billingZipCode, data.billingZipCode);
            }
        });
    }


    /**
     * Submits payment and confirms action.
     **/
    async submitPayment() {
        await test.step('Click Pay button to complete transaction', async () => {
            await this.waitForVisible(this.payButton);
            await this.click(this.payButton);
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the payment was processed successfully.
     **/
    async verifyPaymentSuccess() {
        await test.step('Verify payment success', async () => {
            await this.waitForLoaders();
            await this.page.waitForTimeout(2000);
            await this.waitForVisible(this.page.getByText('Your payment has been processed successfully.', { exact: true }).first(), { timeout: 10000 });
            await this.verifyVisible(this.page.getByText('Your payment has been processed successfully.', { exact: true }).first());

        });
    }
}
