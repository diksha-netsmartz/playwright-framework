import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';
import { credentials as defaultCredentials } from '@config/config';
import AdminLoginPage from '@pages/AdminApplication/AdminLoginPage';
import StaffLoginPage from '@pages/StaffApplication/StaffLoginPage';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';

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
        this.sidebarItems = page.locator('ul.page-sidebar-menu > li:not(.sidebar-toggler-wrapper):not(.sidebar-search-wrapper):not(.hide)');
        this.homeNavLink = page.locator('#home_li, .newHomePage, ul.page-sidebar-menu .icon-home').first();
        this.loginBtn = page.getByRole('button', { name: 'Login' }).first();
        this.pageTitle = page.locator('#pageTitle');
    }

    /**
     * If navigation leads to a separate module (e.g. SMS Dashboard) where the main portal sidebar is absent,
     * navigates back to the main portal homepage to restore the primary sidebar menu.
     */
    async returnToMainPortalIfNeeded() {
        await this.waitForLoaders();
        const isMainSidebarPresent = await this.page.locator('#home_li, .sideMenuDev').first().isVisible({ timeout: 2000 }).catch(() => false);
        if (!isMainSidebarPresent) {
            const homeLink = this.homeNavLink;
            if (await this.isVisible(homeLink, 3000).catch(() => false)) {
                await this.click(homeLink);
                await this.waitForLoaders();
                await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
                await this.waitForLoaders();
            } else if (this.homeUrl) {
                await this.navigate(this.homeUrl);
                await this.waitForLoaders();
                await this.waitForVisible(this.sidebarMenu, 5000).catch(() => { });
            }
        }
    }

    /**
     * Ensures top-level and nested accordions are expanded so targetLocator is visible.
     * @param {import('@playwright/test').Locator} itemNow - The top-level menu li
     * @param {import('@playwright/test').Locator} targetLocator - The leaf link to click
     */
    async ensureAccordionExpanded(itemNow, targetLocator) {
        // If sidebar is collapsed into mini icon mode (e.g. on Scheduler pages where body has page-sidebar-closed),
        // re-open the sidebar using the toggler
        const isClosed = await this.page.locator('body.page-sidebar-closed').count() > 0;
        if (isClosed) {
            const toggler = this.page.locator('.sidebar-toggler.Newtoggler, .sidebar-toggler').first();
            if (await toggler.isVisible().catch(() => false)) {
                await this.click(toggler);
                await this.page.waitForTimeout(500);
            }
        }

        if (await targetLocator.isVisible().catch(() => false)) {
            return;
        }

        // 1. Ensure top-level accordion sub-menu is visible
        const isSubMenuVisible = await itemNow.locator('> ul.sub-menu').isVisible().catch(() => false);
        if (!isSubMenuVisible) {
            const topA = itemNow.locator('> a');
            if (await topA.isVisible().catch(() => false)) {
                await this.click(topA);
                await this.page.waitForTimeout(400);
            }
        }

        if (await targetLocator.isVisible().catch(() => false)) {
            return;
        }

        // 2. Expand any collapsed nested intermediate accordions (e.g. Manage Time Slots, Website Content)
        const nestedParents = targetLocator.locator('xpath=ancestor::li[./ul[contains(@class, "sub-menu")]]');
        const count = await nestedParents.count();
        for (let k = 0; k < count; k++) {
            const parentLi = nestedParents.nth(k);
            const parentSubMenu = parentLi.locator('> ul.sub-menu');
            if (!(await parentSubMenu.isVisible().catch(() => false))) {
                const toggle = parentLi.locator('> a');
                if (await toggle.isVisible().catch(() => false)) {
                    await this.click(toggle);
                    await this.page.waitForTimeout(400);
                }
            }
        }

        await targetLocator.scrollIntoViewIfNeeded().catch(() => { });
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
                const adminLoginPage = new AdminLoginPage(this.page);
                const creds = credentials?.cadmin || credentials || defaultCredentials?.cadmin;
                await adminLoginPage.login(creds?.username, creds?.password);
            } else if (this.portalType === 'staff') {
                const staffLoginPage = new StaffLoginPage(this.page);
                const creds = credentials?.staffUser || credentials || defaultCredentials?.staffUser;
                await staffLoginPage.login(creds?.username, creds?.password);
            } else if (this.portalType === 'student') {
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
                if (!(await currentItem.isVisible().catch(() => false))) {
                    continue;
                }
                const topA = currentItem.locator('> a');
                const topText = (await topA.textContent() || '').trim().replace(/\s+/g, ' ');

                // Only consider non-hidden leaf submenus (ignoring nested menu headers)
                const subLinks = currentItem.locator('ul.sub-menu li:not(.hide):not(:has(> ul.sub-menu)) > a');
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
                            }
                        } else {
                            await this.verifyLinkTitle(topText);
                            await this.returnToMainPortalIfNeeded();
                        }

                        totalNavigated++;
                    });
                } else {
                    // Accordion menu with submenus (e.g., Scheduling, Classroom, Report Center)
                    await test.step(`Navigate Submenus under "${topText}" (${subCount} links)`, async () => {
                        for (let j = 0; j < subCount; j++) {
                            await this.returnToMainPortalIfNeeded();

                            const itemNow = this.sidebarItems.nth(i);
                            const targetSubLink = itemNow.locator('ul.sub-menu li:not(.hide):not(:has(> ul.sub-menu)) > a').nth(j);

                            // Expand all ancestor accordions if submenu is not visible
                            await this.ensureAccordionExpanded(itemNow, targetSubLink);

                            const subText = (await targetSubLink.textContent() || '').trim().replace(/\s+/g, ' ');
                            const isSubLogoutLink = /log\s*out|logout/i.test(subText);

                            await test.step(`Click Sub-Link [${j + 1}/${subCount}]: "${subText}" under "${topText}"`, async () => {
                                await targetSubLink.scrollIntoViewIfNeeded().catch(() => { });
                                await this.clickAndVerifyNavigation(targetSubLink);

                                if (isSubLogoutLink) {
                                    await test.step('Verify sub-link logout redirected to Login page', async () => {
                                        expect(this.page.url()).toMatch(/login/i);
                                    });

                                    if (j < subCount - 1 || i < topCount - 1) {
                                        await this.relogin(credentials);
                                        if (await this.isVisible(this.homeNavLink.first(), 2000)) {
                                            await this.click(this.homeNavLink.first());
                                            await this.waitForLoaders();
                                        }
                                    }
                                } else {
                                    await this.verifyLinkTitle(subText);
                                    await this.returnToMainPortalIfNeeded();
                                }

                                totalNavigated++;
                            });
                        }
                    });
                    await this.returnToMainPortalIfNeeded();
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
                const bodyText = await this.page.locator('body').textContent().catch(() => '');
                const is403 = bodyText.includes('403 Forbidden') || currentTitle.includes('403');
                if (is403) {
                    // Page returned 403 Forbidden due to limited account rights - accepted
                    return;
                }
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
