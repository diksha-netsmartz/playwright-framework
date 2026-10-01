import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';
import { credentials as defaultCredentials } from '@config/config';

/**
 * Shared Left Sidebar Navigation Component representing the main left navigation menu
 * (`ul.page-sidebar-menu`) across Admin, Staff, and Student portals.
 */
export default class SidebarNavigationComponent extends BasePage {

    /**
     * Initializes Left Sidebar Navigation locators and options.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     * @param {Object} [options={}] - Configuration options.
     * @param {'admin'|'staff'|'student'} [options.portalType='admin'] - Portal type for credential & login routing.
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

        // Left Sidebar Menu Locators
        this.sidebarMenu = page.locator('ul.page-sidebar-menu');
        this.sidebarItems = page.locator('ul.page-sidebar-menu > li:not(.sidebar-toggler-wrapper):not(.sidebar-search-wrapper)');
        this.homeNavLink = page.locator('#home_li , .newHomePage').first();
        this.loginBtn = page.getByRole('button', { name: 'Login' }).first();
        this.pageTitle = page.locator('#pageTitle');
    }

    /**
     * Navigates back to the portal Home page if currently on another page.
     */
    async ensureOnHomePage() {
        await this.waitForLoaders();
        const currentUrl = this.page.url().toLowerCase();

        const isOnHome = typeof this.homeUrlPattern === 'string'
            ? currentUrl.includes(this.homeUrlPattern.toLowerCase())
            : this.homeUrlPattern.test(currentUrl);

        if (!isOnHome) {
            if (await this.isVisible(this.homeNavLink, { timeout: 3000 }).catch(() => false)) {
                await this.waitForLoaders();
                await this.jsClick(this.homeNavLink).catch(async () => {
                    await this.click(this.homeNavLink);
                });
            } else if (this.homeUrl) {
                await this.navigate(this.homeUrl);
            } else {
                await this.page.goBack().catch(() => { });
            }
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });
            await this.waitForLoaders();
        }
    }

    /**
     * Re-authenticates if a sidebar link (e.g. Logout) causes a logout action.
     * @param {Object} [credentials] - Optional credentials object.
     */
    async relogin(credentials = null) {
        await test.step('Re-authenticate after logout action', async () => {
            if (this.onRelogin) {
                await this.onRelogin(credentials);
                return;
            }

            if (this.portalType === 'admin') {
                const { default: AdminLoginPage } = await import('@pages/AdminApplication/AdminLoginPage');
                const adminLoginPage = new AdminLoginPage(this.page);
                const creds = credentials?.cadmin || credentials || defaultCredentials?.cadmin;
                await adminLoginPage.login(creds?.username, creds?.password);
            } else if (this.portalType === 'staff') {
                const { default: StaffLoginPage } = await import('@pages/StaffApplication/StaffLoginPage');
                const staffLoginPage = new StaffLoginPage(this.page);
                const creds = credentials?.staffUser || credentials || defaultCredentials?.staffUser;
                await staffLoginPage.login(creds?.username, creds?.password);
            } else if (this.portalType === 'student') {
                const { default: StudentLoginPage } = await import('@pages/StudentApplication/StudentLoginPage');
                const studentLoginPage = new StudentLoginPage(this.page);
                const creds = credentials?.studentUser || credentials || defaultCredentials?.studentUser;
                await studentLoginPage.login(creds?.username, creds?.password);
            }
            await this.waitForLoaders();
        });
    }

    /**
     * Iterates through all links in the left sidebar menu, including accordion submenus,
     * verifies successful navigation and page titles, and properly handles logout links.
     * @param {Object} [credentials] - Optional login credentials object.
     * @returns {Promise<number>} Total count of links and sub-links navigated.
     */
    async openEachLinkInLeftSidebar(credentials = null) {
        return await test.step('Open each link in left sidebar menu including submenus and verify titles', async () => {
            this.homeUrl = this.page.url();
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
                    // Direct top-level link (e.g., Home, My Profile, Logout, etc.)
                    const isLogoutLink = /log\s*out|logout/i.test(topText);

                    await test.step(`Navigate Sidebar Link: "${topText}"`, async () => {
                        await this.clickAndVerifyNavigation(topA, { loadTimeout: 5000 });

                        if (isLogoutLink) {
                            await test.step('Verify logout redirected to Login page', async () => {
                                expect(this.page.url()).toMatch(/login/i);
                            });

                            // If there are more sidebar items remaining, re-login to test the rest
                            if (i < topCount - 1) {
                                await this.relogin(credentials);
                                await this.ensureOnHomePage();
                            }
                        } else {
                            await this.verifyLinkTitle(topText);
                        }

                        totalNavigated++;
                    });
                } else {
                    // Accordion menu with submenus (e.g., Scheduling, Classroom, Report Center)
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
                            const isSubLogoutLink = /log\s*out|logout/i.test(subText);

                            await test.step(`Click Sub-Link [${j + 1}/${subCount}]: "${subText}" under "${topText}"`, async () => {
                                await this.clickAndVerifyNavigation(targetSubLink);

                                if (isSubLogoutLink) {
                                    await test.step('Verify sub-link logout redirected to Login page', async () => {
                                        expect(this.page.url()).toMatch(/login/i);
                                    });

                                    if (j < subCount - 1 || i < topCount - 1) {
                                        await this.relogin(credentials);
                                        await this.ensureOnHomePage();
                                    }
                                } else {
                                    await this.verifyLinkTitle(subText);
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
     * Verifies page navigation and title after navigating via a sidebar link.
     * @param {string} linkText - The text/label of the clicked link.
     */
    async verifyLinkTitle(linkText) {
        await test.step(`Verify page navigation and title for "${linkText}"`, async () => {
            const normalized = linkText.toLowerCase();
            const currentTitle = await this.getPageTitle();
            const currentUrl = this.page.url();

            expect(currentUrl).not.toContain('about:blank');

            if (normalized.includes('home')) {
                expect(currentTitle).toMatch(/Home/i);
            } else if (normalized.includes('logout') || normalized.includes('log out')) {
                expect(currentUrl).toMatch(/Login/i);
            } else {
                if (currentTitle && currentTitle.length > 0) {
                    expect(currentTitle.length).toBeGreaterThan(0);
                } else if (await this.isVisible(this.pageTitle, { timeout: 2000 }).catch(() => false)) {
                    const headingText = (await this.pageTitle.textContent()) || '';
                    expect(headingText.length).toBeGreaterThan(0);
                }
            }
        });
    }
}
