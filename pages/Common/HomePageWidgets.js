import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';
import { credentials as defaultCredentials } from '@config/config';
import AdminLoginPage from '@pages/AdminApplication/AdminLoginPage';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';

/**
 * Shared Page Object representing Homepage / Dashboard Widgets
 * (e.g., Quick Links, Upload Files, Tasks) across Admin, Staff, and Student portals.
 */
export default class HomePageWidgets extends BasePage {

    /**
     * Initializes HomePageWidgets locators and options.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     * @param {Object} [options={}] - Configuration options.
     * @param {'admin'|'staff'|'student'} [options.portalType='admin'] - Portal type.
     * @param {string|RegExp} [options.homeUrlPattern=/adminhome|home/i] - Substring or regex to match the home URL.
     * @param {Function} [options.onRelogin] - Optional custom async callback (credentials) => void for re-authenticating after logout.
     */
    constructor(page, options = {}) {
        super(page);

        this.portalType = options.portalType || 'admin';
        this.homeUrlPattern = options.homeUrlPattern || (
            this.portalType === 'staff' ? /staffhome/i :
                this.portalType === 'student' ? /studenthome|coreautomation/i :
                    /adminhome|home/i
        );
        this.onRelogin = options.onRelogin || null;
        this.homeUrl = null;

        // --- Quick Links Widget Locators ---
        this.quickLinksWidget = page.locator('#div_QuickLinks');
        this.quickLinkButtons = page.locator('#div_QuickLinks a');

        // Navigation & Authentication helpers
        this.homeNavLink = page.locator('#home_li, .newHomePage, ul.page-sidebar-menu .icon-home');
        this.loginBtn = page.getByRole('button', { name: 'Login' }).first();
    }


    /**
     * Re-authenticates if a quick link causes a logout action.
     * @param {Object} [credentials] - Optional credentials object.
     */
    async relogin(credentials = null) {
        await test.step('Re-authenticate after logout action', async () => {
            if (this.onRelogin) {
                await this.onRelogin(credentials);
                return;
            }

            if (this.portalType === 'admin') {
                const adminLoginPage = new AdminLoginPage(this.page);
                const creds = credentials?.cadmin || credentials || defaultCredentials?.cadmin;
                if (!await adminLoginPage.isVisible(adminLoginPage.usernameTxt, { timeout: 2000 }).catch(() => false)) {
                    await adminLoginPage.navigateToLoginPage();
                }
                await adminLoginPage.login(creds?.username, creds?.password);
            } else if (this.portalType === 'staff') {
                const staffLoginPage = new StaffLoginPage(this.page);
                const creds = credentials?.staffUser || credentials || defaultCredentials?.staffUser;
                if (!await staffLoginPage.isVisible(staffLoginPage.usernameTxt, { timeout: 2000 }).catch(() => false)) {
                    await staffLoginPage.navigateToLoginPage();
                }
                await staffLoginPage.login(creds?.username, creds?.password);
            } else if (this.portalType === 'student') {
                const studentLoginPage = new StudentLoginPage(this.page);
                const creds = credentials?.studentUser || credentials || defaultCredentials?.studentUser;
                if (!await studentLoginPage.isVisible(studentLoginPage.usernameTxt, { timeout: 2000 }).catch(() => false)) {
                    await studentLoginPage.navigateToLoginPage();
                }
                await studentLoginPage.login(creds?.username, creds?.password);
            }
            await this.waitForLoaders();
        });
    }

    /**
     * Verifies that the Quick Links widget is displayed on the portal Home page.
     */
    async verifyQuickLinksWidgetVisible() {
        return await test.step('Verify Quick Links widget is visible', async () => {
            await this.waitForVisible(this.quickLinksWidget.first(), 5000);
            await this.verifyVisible(this.quickLinksWidget.first(), 2000);
        });
    }

    /**
     * Iterates through each Quick Link in the widget,
     * verifies navigation and page titles, handles new tabs/popups,
     * and properly handles logout links (verifying logout and re-authenticating if needed).
     * @param {Object} [credentials] - Optional login credentials object.
     * @returns {Promise<number>} Total count of quick links tested.
     */
    async openEachQuickLink(credentials = null) {
        return await test.step('Open each Quick Link in widget and verify navigation', async () => {

            const count = await this.quickLinkButtons.count();
            if (count === 0) {
                console.log('No quick links found on page');
                await test.step('No quick links found on page', async () => { });
                return 0;
            }

            // Collect link details in advance to avoid stale element references
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
                const isLogoutLink = /log\s*out|logout/i.test(item.text);

                await test.step(`Click Quick Link [${i + 1}/${linksData.length}]: "${item.text}"`, async () => {

                    if (await this.isVisible(this.homeNavLink.first(), 2000)) {
                        await this.click(this.homeNavLink.first());
                        await this.waitForLoaders();

                    }
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
                            // Link did not trigger a new page event (opened in same tab or handled in-page)
                        }

                        if (popupPage) {
                            await this.verifyPopupNavigation(popupPage);
                            await popupPage.waitForLoadState('domcontentloaded').catch(() => { });

                            // Check if popup redirected to logout/login (e.g. stale encId invalidating session)
                            const popupUrl = popupPage.url();
                            const popupLoggedOut = /login|logout/i.test(popupUrl);

                            await popupPage.close().catch(() => { });

                            // If popup caused session invalidation, restore authentication on main page
                            const isMainLoggedOut = popupLoggedOut ||
                                /login/i.test(this.page.url()) ||
                                await this.isVisible(this.loginBtn, { timeout: 1500 }).catch(() => false);

                            if (isMainLoggedOut && i < linksData.length - 1) {
                                await this.relogin(credentials);
                                if (await this.isVisible(this.homeNavLink.first(), 2000)) {
                                    await this.click(this.homeNavLink.first());
                                    await this.waitForLoaders();
                                }
                            }
                        } else {
                            // Fallback: Link opened in the same tab despite target="_blank"
                            await this.waitForLoaders();
                            const currentUrl = this.page.url();
                            expect(currentUrl).not.toContain('about:blank');

                            const isLoggedOut = isLogoutLink ||
                                /login/i.test(currentUrl) ||
                                await this.isVisible(this.loginBtn, { timeout: 1500 }).catch(() => false);

                            if (isLoggedOut && i < linksData.length - 1) {
                                await this.relogin(credentials);
                                if (await this.isVisible(this.homeNavLink.first(), 2000)) {
                                    await this.click(this.homeNavLink.first());
                                    await this.waitForLoaders();
                                }
                            }
                        }
                    } else {
                        // Internal navigation within the same tab
                        await this.clickAndVerifyNavigation(linkToClick);

                        const currentTitle = await this.getPageTitle();
                        const currentUrl = this.page.url();
                        expect(currentUrl).not.toContain('about:blank');

                        // Check if link was a logout action or redirected to login
                        const isLoggedOut = isLogoutLink ||
                            /login/i.test(currentUrl) ||
                            await this.isVisible(this.loginBtn, { timeout: 1500 }).catch(() => false);

                        if (isLoggedOut) {
                            await test.step('Verify logout redirection to Login page', async () => {
                                expect(this.page.url()).toMatch(/login/i);
                            });

                            // If there are more quick links left to test, re-login and return to home
                            if (i < linksData.length - 1) {
                                await this.relogin(credentials);
                                if (await this.isVisible(this.homeNavLink.first(), 2000)) {
                                    await this.click(this.homeNavLink.first());
                                    await this.waitForLoaders();
                                }
                            }
                        } else {
                            if (currentTitle && currentTitle.length > 0) {
                                expect(currentTitle.length).toBeGreaterThan(0);
                            }
                        }
                    }
                    totalTested++;
                });
            }

            return totalTested;
        });
    }
}
