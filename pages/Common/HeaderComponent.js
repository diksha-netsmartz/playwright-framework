import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Shared Header Component representing the Top Navbar and User Profile Dropdown
 * (e.g., Admin Home, My Profile, Change Password, Log Out) across portals.
 */
export default class HeaderComponent extends BasePage {

    /**
     * Initializes Header Component locators.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     * @param {Object} [options={}] - Configuration options.
     * @param {'admin'|'staff'|'student'} [options.portalType='admin'] - Portal type.
     */
    constructor(page, options = {}) {
        super(page);

        this.portalType = options.portalType || 'admin';

        // User Profile Dropdown in Header
        this.userProfileDropdown = page.locator('li.dropdown.dropdown-user, li.dropdown-user, #userprofileSettings').first();
        this.userDropdownAdminHomeBtn = page.getByRole('link', { name: /Admin Home|Staff Home|Home/i }).first();
        this.userDropdownMyProfileBtn = page.getByRole('link', { name: 'My Profile' }).first();
        this.userDropdownChangePasswordBtn = page.getByRole('link', { name: 'Change Password' }).first();
        this.userDropdownLogoutBtn = page.getByRole('link', { name: 'Log Out' }).or(page.locator('a:has-text("Log Out")')).first();
        this.loginBtn = page.getByRole('button', { name: 'Login' }).first();
    }

    /**
     * Opens the User Profile Dropdown in the header.
     */
    async openUserProfileDropdown() {
        await test.step('Open User Profile Dropdown', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.userProfileDropdown, 5000);
            await this.hover(this.userProfileDropdown);
        });
    }

    /**
     * Navigates to My Profile from the User Profile Dropdown.
     */
    async openMyProfile() {
        await test.step('Navigate to My Profile from User Dropdown', async () => {
            await this.openUserProfileDropdown();
            await this.waitForVisible(this.userDropdownMyProfileBtn, 3000);
            await this.clickAndVerifyNavigation(this.userDropdownMyProfileBtn);
        });
    }

    /**
     * Navigates to Change Password from the User Profile Dropdown.
     */
    async openChangePassword() {
        await test.step('Navigate to Change Password from User Dropdown', async () => {
            await this.openUserProfileDropdown();
            await this.waitForVisible(this.userDropdownChangePasswordBtn, 3000);
            await this.clickAndVerifyNavigation(this.userDropdownChangePasswordBtn);
        });
    }

    /**
     * Logs out of the portal via the User Profile Dropdown
     * and verifies redirection to the Login page.
     */
    async logout() {
        return await test.step(`Logout from ${this.portalType.toUpperCase()} Portal via User Profile Dropdown`, async () => {
            await this.openUserProfileDropdown();
            await this.waitForVisible(this.userDropdownLogoutBtn, 3000);
            await this.click(this.userDropdownLogoutBtn);

            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 }).catch(() => { });

            // Verify logout redirection to Login page
            await test.step('Verify navigation to Login Page after logout', async () => {
                expect(this.page.url()).toMatch(/login/i);
                await this.waitForVisible(this.loginBtn, 5000);
                await this.verifyVisible(this.loginBtn);
            });
        });
    }
}
