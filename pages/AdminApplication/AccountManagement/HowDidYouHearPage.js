import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';

/**
 * Page Object representing the How Did You Hear Page in Admin Portal (Account Management > How did you hear).
 * Handles adding new lead sources with dynamic unique values,
 * editing existing lead sources, searching the data table, and verifying notifications.
 **/
export default class HowDidYouHearPage extends BasePage {

    /**
     * Initializes locators for the How Did You Hear Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);

        // Header Actions
        this.addNewBtn = page.locator("#addNewReferal");

        // Add / Edit Form Locators
        this.leadNameInput = page.getByRole('textbox', { name: 'Lead Name' })
        this.statusDropdown = page.locator("xpath=//select[@name='LeadStatus']//parent::div//button");
        this.statusDropdownOptionActive = page.locator("xpath=//select[@name='LeadStatus']//parent::div//div//span[text()='Active']");
        this.statusDropdownOptionDeleted = page.locator("xpath=//select[@name='LeadStatus']//parent::div//div//span[text()='Deleted']");

        this.leadCodeInput = page.getByRole('textbox', { name: 'Lead Code' });
        this.expirationDateInput = page.getByRole('textbox', { name: 'MM/DD/YYYY' });
        this.notesInput = page.locator('#LeadNote');
        this.addressInput = page.locator('#LeadAddress');
        this.phoneInput = page.locator('#LeadPhone');
        this.visibleDuringOnlineEnrollment = page.locator("//div[contains(@class,'VisibleDuringOnlineEnrollment')]")

        // Form Action Buttons & Notifications
        this.saveBtn = page.locator("xpath=(//b[contains(text(),'How did you hear') or contains(text(),'HOW DID YOU HEAR')]//ancestor::div[contains(@class,'modal-content')]//a[contains(text(),'Save')])[1]");
        this.yesConfirmationButton = page.locator("xpath=//a[@data-apply='confirmation' and text()='Yes']");

        this.statusFilterDropdown = page.locator("xpath=//div[@id='referals']//a[contains(.,'Status')]");
        this.selectAllStatusCheckbox = page.locator("xpath=//div[@id='referals']//div[contains(@class,'dropdown')]//input//following-sibling::ins").first().or(page.locator("//div[@id='referals']").getByText('Show All'));

        // Data Table Locators
        this.searchTextbox = page.locator("input[type='search']").first()
        this.leadsTable = page.locator('#Leadslisttable');
        this.editIcon = page.getByTitle('Edit');

        // Form State
        this.uniqueId = '';
        this.leadName = '';
        this.leadCode = '';
        this.expirationDate = '';
        this.notes = '';
        this.selectedStatus = '';
    }

    /**
     * Clicks the 'Add New' button to open the Add Lead Source form.
     **/
    async clickAddNew() {
        await test.step('Click on "Add New" button for How did you hear', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.addNewBtn);
            await this.click(this.addNewBtn);
            await this.waitForLoaders();
        });
    }

    /**
     * Fills the How Did You Hear creation form with dynamic unique values.
     * @param {Object} data - How Did You Hear test data fixture.
     * @returns {Promise<Object>} Created lead details.
     **/
    async fillHowDidYouHearDetails(data = {}) {
        return await test.step('Fill How did you hear details', async () => {
            this.uniqueId = `${Date.now()}`;
            this.leadName = `${data.leadNamePrefix}_${this.uniqueId}`;
            this.leadCode = `${data.leadCodePrefix}_${Math.floor(1000 + Math.random() * 9000)}`;
            this.expirationDate = data.expirationDate;
            this.notes = data.notes;
            this.address = data.address;
            this.phone = data.phone;

            await this.waitForLoaders();
            await this.waitForVisible(this.leadNameInput);
            await this.fill(this.leadNameInput, this.leadName);

            // Select Status as Active
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionActive);
            this.selectedStatus = (await this.statusDropdownOptionActive.innerText()).trim();
            await this.click(this.statusDropdownOptionActive);

            await this.fill(this.leadCodeInput, this.leadCode);
            await this.fill(this.expirationDateInput, this.expirationDate);
            await this.fill(this.notesInput, this.notes);

            if (await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.addressInput, this.address);
            }
            if (await this.isVisible(this.phoneInput, { timeout: 100 }).catch(() => false)) {
                await this.fill(this.phoneInput, this.phone);
            }
            if (await this.isVisible(this.visibleDuringOnlineEnrollment, { timeout: 100 }).catch(() => false)) {
                await this.click(this.visibleDuringOnlineEnrollment);
            }

            return {
                leadName: this.leadName,
                leadCode: this.leadCode
            };
        });
    }

    /**
     * Verifies that the How Did You Hear details in the form match the filled / expected values.
     * @param {Object} [expectedDetails={}] - Optional expected lead details.
     **/
    async verifyHowDidYouHearDetails(expectedDetails = {}) {
        await test.step('Verify How did you hear details in form', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.leadNameInput);

            const expectedLeadName = expectedDetails.leadName || this.leadName;
            const expectedLeadCode = expectedDetails.leadCode || expectedDetails.leadCodePrefix || this.leadCode;
            const expectedExpirationDate = expectedDetails.expirationDate || this.expirationDate;
            const expectedNotes = expectedDetails.notes || this.notes;
            const expectedAddress = expectedDetails.address || this.address;
            const expectedPhone = expectedDetails.phone || this.phone;

            await expect(this.leadNameInput).toHaveValue(expectedLeadName);

            const actualStatus = (await this.statusDropdown.innerText()).trim().toLowerCase();
            const expectedStatus = (expectedDetails.status || this.selectedStatus || 'Active').trim().toLowerCase();
            expect(actualStatus).toContain(expectedStatus);

            const actualLeadCode = (await this.leadCodeInput.inputValue()).trim();
            expect(actualLeadCode).toContain(expectedLeadCode);

            if (await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.addressInput).toHaveValue(expectedAddress);
            }
            if (await this.isVisible(this.phoneInput, { timeout: 100 }).catch(() => false)) {
                const digits = ('' + expectedPhone).replace(/\D/g, '');
                const phonePattern = digits.length === 10
                    ? new RegExp(`^\\(${digits.slice(0, 3)}\\)\\s*${digits.slice(3, 6)}-${digits.slice(6)}$`)
                    : new RegExp(expectedPhone);
                await expect(this.phoneInput).toHaveValue(phonePattern);
            }

            await expect(this.expirationDateInput).toHaveValue(expectedExpirationDate);
            await expect(this.notesInput).toHaveValue(expectedNotes);
            if (await this.isVisible(this.visibleDuringOnlineEnrollment, { timeout: 100 }).catch(() => false)) {
                const isChecked = await this.visibleDuringOnlineEnrollment.getAttribute('class');
                expect(isChecked.includes('switch-on')).toBe(true);
            }

        });
    }

    /**
     * Clicks the Save button and handles optional confirmation dialog.
     **/
    async clickSave() {
        await test.step('Click Save button', async () => {
            await this.waitForVisible(this.saveBtn);
            await this.click(this.saveBtn);

            // Handle optional confirmation dialog if present
            if (await this.yesConfirmationButton.isVisible({ timeout: 1500 }).catch(() => false)) {
                await this.click(this.yesConfirmationButton);
            }

            await this.waitForLoaders();
            await this.page.waitForLoadState('load');
        });
    }

    /**
     * Verifies that the 'How did you hear information added successfully.' notification is displayed.
     **/
    async verifyHowDidYouHearCreatedSuccessfully() {
        await test.step('Verify "How did you hear information added successfully." notification', async () => {
            const successMessage = this.page.getByText('How did you hear information added successfully.');
            await this.waitForVisible(successMessage);
            await this.verifyVisible(successMessage)
        });
    }

    /**
     * Searches for the created Lead Source in the data table and clicks Edit.
     * @param {string} [leadName=this.leadName] - Lead source name to search.
     **/
    async searchAndEditHowDidYouHear(leadName = this.leadName, maxRetries = 5) {
        await test.step(`Search and edit How did you hear: "${leadName}"`, async () => {
            for (let attempt = 1; attempt <= maxRetries; attempt++) {
                await this.page.waitForLoadState('load').catch(() => { });
                await this.waitForLoaders();
                await this.waitForVisible(this.searchTextbox);
                await this.fill(this.searchTextbox, leadName);
                await this.page.waitForTimeout(2000);
                await this.waitForLoaders();

                const count = await this.editIcon.count();
                if (count > 0 && await this.editIcon.first().isVisible().catch(() => false)) {
                    await this.click(this.editIcon.first());
                    await this.waitForLoaders();
                    return;
                }

                if (attempt < maxRetries) {
                    await this.page.reload();
                    await this.page.waitForLoadState('load').catch(() => { });
                    await this.waitForLoaders();
                    await this.filterByAllStatus();
                }
            }

            await this.waitForVisible(this.editIcon);
            await expect(this.editIcon).toHaveCount(1);
            await this.click(this.editIcon);
            await this.waitForLoaders();
        });
    }

    /**
     * Modifies all Lead Source fields (Name, Code, Expiration Date, Notes, Address, Phone, Status) on the Edit form.
     * @param {Object} data - Update data from fixture.
     **/
    async editHowDidYouHearDetails(data = {}) {
        await test.step('Update How did you hear fields (Name, Code, Expiration Date, Notes, Address, Phone, Status)', async () => {
            await this.waitForLoaders();

            // Update Lead Name
            if (await this.leadNameInput.isEditable().catch(() => false)) {
                this.leadName = `${data.updatedLeadNamePrefix}_${this.uniqueId}`;
                await this.fill(this.leadNameInput, this.leadName);
            }

            // Update Lead Code
            if (await this.leadCodeInput.isEditable().catch(() => false)) {
                this.leadCode = `${data.updatedLeadCodePrefix}_${Math.floor(1000 + Math.random() * 9000)}`;
                await this.fill(this.leadCodeInput, this.leadCode);
            }

            // Update Expiration Date
            if (await this.isVisible(this.expirationDateInput, { timeout: 500 }).catch(() => false)) {
                this.expirationDate = data.updatedExpirationDate;
                await this.fill(this.expirationDateInput, this.expirationDate);
            }

            // Update Notes
            if (await this.isVisible(this.notesInput, { timeout: 500 }).catch(() => false)) {
                this.notes = data.updatedNotes;
                await this.fill(this.notesInput, this.notes);
            }

            // Update Address
            if (await this.isVisible(this.addressInput, { timeout: 500 }).catch(() => false)) {
                this.address = data.updatedAddress;
                await this.fill(this.addressInput, this.address);
            }

            // Update Phone
            if (await this.isVisible(this.phoneInput, { timeout: 500 }).catch(() => false)) {
                this.phone = data.updatedPhone;
                await this.fill(this.phoneInput, this.phone);
            }

            // Update Status to Deleted
            await this.waitForVisible(this.statusDropdown);
            await this.click(this.statusDropdown);
            await this.waitForVisible(this.statusDropdownOptionDeleted);
            this.selectedStatus = 'Deleted';
            await this.click(this.statusDropdownOptionDeleted);

            if (await this.isVisible(this.visibleDuringOnlineEnrollment, { timeout: 100 }).catch(() => false)) {
                await this.click(this.visibleDuringOnlineEnrollment);
            }

        });
    }

    /**
     * Opens the Status filter dropdown, selects All status, and closes the dropdown.
     **/
    async filterByAllStatus() {
        await test.step('Filter How did you hear by All status', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.statusFilterDropdown);
            await this.click(this.statusFilterDropdown);

            await this.waitForVisible(this.selectAllStatusCheckbox.first());
            await this.click(this.selectAllStatusCheckbox.first(), { force: true });

            // Close the dropdown after selection by clicking on dropdown xpath again
            await this.click(this.statusFilterDropdown);
            await this.waitForLoaders();
            await this.page.waitForTimeout(1000);
        });
    }

    /**
     * Verifies that the How Did You Hear details in the form match the updated values.
     * @param {Object} [expectedDetails={}] - Expected update details.
     **/
    async verifyUpdatedHowDidYouHearDetails(expectedDetails = {}) {
        await test.step('Verify updated How did you hear details in form', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.leadNameInput);

            await expect(this.leadNameInput).toHaveValue(this.leadName);

            const actualStatus = (await this.statusDropdown.innerText()).trim().toLowerCase();
            expect(actualStatus).toContain('deleted');

            const actualLeadCode = (await this.leadCodeInput.inputValue()).trim();
            expect(actualLeadCode).toContain(this.leadCode);

            if (await this.isVisible(this.addressInput, { timeout: 100 }).catch(() => false)) {
                await expect(this.addressInput).toHaveValue(this.address);
            }
            if (await this.isVisible(this.phoneInput, { timeout: 100 }).catch(() => false)) {
                const digits = ('' + this.phone).replace(/\D/g, '');
                const phonePattern = digits.length === 10
                    ? new RegExp(`^\\(${digits.slice(0, 3)}\\)\\s*${digits.slice(3, 6)}-${digits.slice(6)}$`)
                    : new RegExp(this.phone);
                await expect(this.phoneInput).toHaveValue(phonePattern);
            }

            await expect(this.expirationDateInput).toHaveValue(this.expirationDate);
            await expect(this.notesInput).toHaveValue(this.notes);

            if (await this.isVisible(this.visibleDuringOnlineEnrollment, { timeout: 100 }).catch(() => false)) {
                const isNotChecked = await this.visibleDuringOnlineEnrollment.getAttribute('class');
                expect(isNotChecked.includes('switch-off')).toBe(true);
            }
        });
    }

    /**
     * Verifies that the 'How did you hear information updated successfully.' notification is displayed.
     **/
    async verifyHowDidYouHearUpdatedSuccessfully() {
        await test.step('Verify "How did you hear information updated successfully." notification', async () => {
            const successMessage = this.page.getByText('How did you hear information updated successfully.');
            await this.waitForVisible(successMessage);
            await this.verifyVisible(successMessage)
        });
    }
}
