import BasePage from '../../utils/BasePage';
import { expect } from '@playwright/test';

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
        this.actionDropdownBtn = page.locator("xpath=(//div[@id='divNeedAttentionHtml']//button[contains(text(),'ACTION')])[last()]");
        this.processLink = page.locator("xpath=(//a//strong[text()='Process'])[last()]");
        this.noShowLink = page.locator("xpath=(//a//strong[text()='No Show'])[last()]");
        this.noShowTextbox = page.locator("#txtnoShowNotes");
        this.noShowButton = page.locator("#btnNoShowLesson").last();
        this.yesConfirmationButton = page.locator("#btnDeleteConfirmation");
        this.cancelLink = page.locator("xpath=(//a//strong[text()='Cancel'])[last()]");
        this.cancelTextbox = page.locator("#txtArea_CancelLesson");
        this.cancelButton = page.locator("#btnCancelLesson").first();


    }

    /**
     * Opens the action dropdown on the latest item in the 'Needs Attention' widget and clicks 'Process'.
    **/
    async clickProcess() {
        await this.waitForVisible(this.needsAttentionWidget);
        await this.click(this.actionDropdownBtn);
        await this.click(this.processLink);
    }

    /**
     * Marks an appointment in the 'Needs Attention' widget as No Show with notes and confirms the action.
    **/
    async markAppointmentAsNoShow() {
        await this.waitForVisible(this.needsAttentionWidget);
        await this.click(this.actionDropdownBtn);
        await this.click(this.noShowLink);
        await this.waitForVisible(this.noShowTextbox);
        await this.fill(this.noShowTextbox, "no show appointment");
        await this.click(this.noShowButton);
        await this.click(this.yesConfirmationButton);
        await this.waitForHidden(this.yesConfirmationButton);
        await this.waitForLoaders();
        await this.verifyVisible(this.page.getByText('Appointment marked No Show successfully.', { exact: true }));
    }

    /**
     * Cancels an appointment in the 'Needs Attention' widget with cancellation notes and confirms the action.
    **/
    async markAppointmentAsCancel() {
        await this.waitForVisible(this.needsAttentionWidget);
        await this.click(this.actionDropdownBtn);
        await this.click(this.cancelLink);
        await this.waitForLoaders();
        await this.waitForVisible(this.cancelTextbox)
        await this.fill(this.cancelTextbox, "cancel appointment");
        await this.click(this.cancelButton);
        await this.click(this.yesConfirmationButton);
        await this.waitForHidden(this.yesConfirmationButton);
        await this.waitForLoaders();
        await this.verifyVisible(this.page.getByText('Appointment cancelled successfully.', { exact: true }));


    }

}
