import BasePage from '../../../utils/BasePage';
import { expect, test } from '@playwright/test';
import ExcelHelper from '../../../utils/ExcelHelper';

/**
 * Page Object representing the OE Leads tab within Student Leads in the Admin Portal.
 * Handles navigating to the OE Leads tab, selecting status filter options,
 * and verifying the OE Leads records grid is displayed.
 **/
export default class OELeadPage extends BasePage {

    /**
     * Initializes locators for the OE Leads page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);
        // OE Leads tab link in Student Leads navigation
        this.oeLeadsTab = page.locator("xpath=//strong[contains(text(),'OE Leads')]");

        // Status filter dropdown for OE Leads
        this.oeLeadStatusDropdown = page.locator("xpath=//select[@id='OELeadstatus']");

        // OE Leads table grid
        this.oeLeadsGrid = page.locator('#ServiceOELeads');

        // Export To Excel button
        this.exportToExcelBtn = page.getByRole('link', { name: 'Export To Excel' });

        // Checkboxes for Delete and Archive
        this.deleteLeadCheckbox = page.locator('.DeleteOELead');
        this.archiveLeadCheckbox = page.locator('.ArchiveOELead');

        // Delete Selected and Archive Selected buttons
        this.deleteSelectedBtn = page.getByRole('button', { name: 'Delete Selected' });
        this.archiveSelectedBtn = page.getByRole('button', { name: 'Archive Selected' });

        // Confirmation Yes button
        this.yesConfirmationBtn = page.locator("//a[@data-apply='confirmation' and text()='Yes']");

        // Success notification messages
        this.leadDeletedSuccessMsg = page.getByText('OE Lead Deleted successfully', { exact: true });
        this.leadArchivedSuccessMsg = page.getByText('OE Lead Archived successfully', { exact: true });
    }

    /**
     * Clicks on the OE Leads tab within Student Leads section.
     **/
    async clickOELeadsTab() {
        await test.step('Click on OE Leads tab', async () => {
            await this.waitForVisible(this.oeLeadsTab);
            await this.click(this.oeLeadsTab);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 })
        });
    }

    /**
     * Selects a status option from the OE Lead status dropdown by visible label text.
     * @param {string} label - Visible text of the option (e.g. 'Active', 'Show All').
     **/
    async selectOELeadStatus(label) {
        await test.step(`Select '${label}'
                         from OE Lead status dropdown`, async () => {
            await this.waitForVisible(this.oeLeadStatusDropdown);
            await this.selectOption(this.oeLeadStatusDropdown, { label });
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 });
        });
    }

    /**
     * Verifies that the OE Leads records grid is visible.
     **/
    async verifyOELeadsGridVisible() {
        await test.step('Verify OE Leads records grid is visible', async () => {
            await this.waitForVisible(this.oeLeadsGrid);
            await this.verifyVisible(this.oeLeadsGrid);
        });
    }

    /**
     * Clicks the Export To Excel button and waits for the file download.
     * @returns {Promise<import('@playwright/test').Download>} The Playwright Download instance.
     **/
    async clickExportToExcel() {
        return await test.step('Click "Export To Excel" and wait for file download', async () => {
            const downloadPromise = this.page.waitForEvent('download');
            await this.waitForVisible(this.exportToExcelBtn);
            await this.click(this.exportToExcelBtn);
            return await downloadPromise;
        });
    }

    /**
     * Verifies that the Excel file was downloaded successfully.
     * Checks the download instance is truthy, filename has .xls/.xlsx extension,
     * and attaches the file to the Playwright and Allure reports.
     * @param {import('@playwright/test').Download} download - The Playwright Download instance.
     **/
    async verifyExcelDownloaded(download) {
        await test.step('Verify Excel file downloaded successfully', async () => {
            expect(download).toBeTruthy();
            const fileName = download.suggestedFilename();
            console.log(`Downloaded file name: ${fileName}`);
            expect(fileName).toMatch(/\.xlsx?$/i);

            const content = await ExcelHelper.readContent(download);
            expect(content.length).toBeGreaterThan(0);
            console.log(`Excel file "${fileName}" downloaded and verified successfully.`);

            try {
                const filePath = await download.path();
                if (filePath) {
                    test.info().attach('OELeads.xls', {
                        path: filePath,
                        contentType: 'application/vnd.ms-excel'
                    });
                }
            } catch (e) {
                console.log('Error attaching Excel file:', e.message);
            }
        });
    }

    /**
     * Checks the checkbox under the DELETE column (.DeleteOELead).
     **/
    async checkDeleteLeadCheckbox() {
        await test.step('Check the checkbox under DELETE column', async () => {
            await this.waitForLoaders().catch(() => { });
            const checkbox = this.deleteLeadCheckbox.nth(0);
            await this.waitForVisible(checkbox);
            await checkbox.check();
        });
    }

    /**
     * Clicks the 'Delete Selected' button, confirms deletion by clicking 'Yes', and verifies the success toast.
     **/
    async clickDeleteSelected() {
        await test.step('Click on DELETE SELECTED button, confirm with Yes, and verify success message', async () => {
            await this.waitForVisible(this.deleteSelectedBtn);
            await this.click(this.deleteSelectedBtn);
            await this.waitForVisible(this.yesConfirmationBtn);

            // 1. Setup MutationObserver before confirming deletion
            const toastAppeared = this.page.evaluate((expectedText) => {
                return new Promise((resolve) => {
                    const getToast = () => {
                        const matches = /oe lead deleted successfully/i.test(document.body.innerText || '') || (document.body.innerText || '').toLowerCase().includes(expectedText.toLowerCase());
                        if (!matches) return null;
                        const el = document.querySelector('#toast-container .toast-message, .toast-message');
                        return el && el.textContent ? el.textContent.trim() : expectedText;
                    };
                    const initial = getToast();
                    if (initial) return resolve(initial);

                    const observer = new MutationObserver(() => {
                        const text = getToast();
                        if (text) {
                            observer.disconnect();
                            resolve(text);
                        }
                    });

                    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

                    setTimeout(() => {
                        observer.disconnect();
                        resolve('');
                    }, 10000);
                });
            }, 'OE Lead Deleted successfully').catch(() => '');

            await this.click(this.yesConfirmationBtn);

            // 2. Verify deletion toast
            const toastMessage = await toastAppeared;
            console.log(`Captured toast message: "${toastMessage}"`);
            if (toastMessage) {
                console.log('OE Lead Deleted successfully notification appeared');
                await test.step('Toast message "OE Lead Deleted successfully." appeared', async () => { });
            } else {
                await test.step('Toast message "OE Lead Deleted successfully." did NOT appear', async () => {
                    expect(toastMessage, 'Notification "OE Lead Deleted successfully" did not appear on page within 10 seconds').toBeTruthy();
                });
            }
        });
    }


    /**
     * Checks the checkbox under the ARCHIVE column (.ArchiveOELead).
     **/
    async checkArchiveLeadCheckbox() {
        await test.step('Check the checkbox under ARCHIVE column', async () => {
            await this.waitForLoaders().catch(() => { });
            const checkbox = this.archiveLeadCheckbox.nth(0);
            await this.waitForVisible(checkbox);
            await checkbox.check();
        });
    }

    /**
     * Clicks the 'Archive Selected' button, confirms archiving by clicking 'Yes', and verifies the success toast.
     **/
    async clickArchiveSelected() {
        await test.step('Click on ARCHIVE SELECTED button, confirm with Yes, and verify success message', async () => {
            await this.waitForVisible(this.archiveSelectedBtn);
            await this.click(this.archiveSelectedBtn);
            await this.waitForVisible(this.yesConfirmationBtn);

            // 1. Setup MutationObserver before confirming archiving
            const toastAppeared = this.page.evaluate((expectedText) => {
                return new Promise((resolve) => {
                    const getToast = () => {
                        const matches = /oe lead archived successfully/i.test(document.body.innerText || '') || (document.body.innerText || '').toLowerCase().includes(expectedText.toLowerCase());
                        if (!matches) return null;
                        const el = document.querySelector('#toast-container .toast-message, .toast-message');
                        return el && el.textContent ? el.textContent.trim() : expectedText;
                    };
                    const initial = getToast();
                    if (initial) return resolve(initial);

                    const observer = new MutationObserver(() => {
                        const text = getToast();
                        if (text) {
                            observer.disconnect();
                            resolve(text);
                        }
                    });

                    observer.observe(document.body, { childList: true, subtree: true, characterData: true });

                    setTimeout(() => {
                        observer.disconnect();
                        resolve('');
                    }, 10000);
                });
            }, 'OE Lead Archived successfully').catch(() => '');

            await this.click(this.yesConfirmationBtn);

            // 2. Verify archiving toast
            const toastMessage = await toastAppeared;
            console.log(`Captured toast message: "${toastMessage}"`);
            if (toastMessage) {
                console.log('OE Lead Archived successfully notification appeared');
                await test.step('Toast message "OE Lead Archived successfully." appeared', async () => { });
            } else {
                await test.step('Toast message "OE Lead Archived successfully." did NOT appear', async () => {
                    expect(toastMessage, 'Notification "OE Lead Archived successfully" did not appear on page within 10 seconds').toBeTruthy();
                });
            }
        });
    }

    /**
     * Gets the name of the first lead that is available to archive using the specified XPath:
     * //input[@class='ArchiveOELead']//ancestor::tr//td[@class='name ']
     * @returns {Promise<string>} The extracted lead name.
     **/
    async getFirstArchiveLeadName() {
        return await test.step('Get the name of the lead to archive', async () => {
            await this.waitForLoaders().catch(() => { });
            const nameEl = this.page.locator("xpath=(//input[contains(@class,'ArchiveOELead')]//ancestor::tr//td[contains(@class,'name')])[1]");
            await this.waitForVisible(nameEl);
            const leadName = (await nameEl.innerText()).trim();
            console.log(`[OELeadPage] Lead to archive: "${leadName}"`);
            return leadName;
        });
    }

    /**
     * Verifies that a lead with the given name exists in the table grid.
     * @param {string} leadName - The name of the lead to verify.
     **/
    async verifyLeadExistsInGrid(leadName) {
        await test.step(`Verify lead "${leadName}" exists in the list`, async () => {
            await this.waitForLoaders().catch(() => { });
            const leadLocator = this.page.locator('#ServiceOELeads').getByText(leadName, { exact: true }).first();
            await this.waitForVisible(leadLocator);
            await this.verifyVisible(leadLocator);
        });
    }
}
