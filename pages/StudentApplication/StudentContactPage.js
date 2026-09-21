import BasePage from '@utils/BasePage';
import { expect, test } from '@playwright/test';
/**
 * Page Object representing the Contact section in the Student Portal (CSP).
 * Handles contacting the school via the 'Email us' modal and verifying success confirmation.
 **/
export default class StudentContactPage extends BasePage {
    /**
     * Initializes locators for the Student Contact Page.
     * @param {import('@playwright/test').Page} page - Playwright Page instance.
     **/
    constructor(page) {
        super(page);
        // Contact Page Locators
        this.contactHeader = page.locator("//h3[contains(text(),'Contact')]");
        this.emailUsButton = page.getByRole('button', { name: /email us/i });
        // Send Email Modal Locators
        this.sendEmailModal = page.locator('#sendEmail');
        this.modalTitle = page.locator('#sendEmail .modal-title');
        this.subjectInput = page.locator('#subject');
        this.nameInput = page.locator('#username');
        this.emailInput = page.locator('#email');
        this.messageTextarea = page.locator('#feedback');
        this.sendButton = page.locator('#btnSendEmail');
        this.closeModalButton = page.locator('button:has-text("CLOSE")');
        this.successAlert = page.locator('#successModal1');
        this.successMessage = page.locator('#successModalMessage1');
    }
    /**
     * Opens the 'Email us' modal dialog and verifies it is visible.
     **/
    async openEmailUsModal() {
        await test.step('Click "Email us" button to open contact modal', async () => {
            await this.waitForVisible(this.emailUsButton);
            await this.click(this.emailUsButton);
            await this.waitForVisible(this.sendEmailModal);
            await this.verifyVisible(this.modalTitle);
        });
    }

    /**
     * Fills the contact school email form.
     * Uses default data if no parameters or partial parameters are provided.
     * @param {Object} [contactDetails={}] - Contact form data { subject, name, email, message }.
     **/
    async fillContactForm(contactDetails = {}) {
        const defaultData = {
            subject: 'Inquiry regarding driving lessons',
            name: 'Automation Student',
            email: 'testautomation@example.com',
            message: 'Hello, this is a test message to verify the contact school functionality.'
        };
        const data = { ...defaultData, ...contactDetails };

        await test.step('Fill contact email form fields', async () => {
            await this.waitForVisible(this.subjectInput);
            await this.fill(this.subjectInput, data.subject);
            await this.fill(this.nameInput, data.name);
            await this.fill(this.emailInput, data.email);
            await this.fill(this.messageTextarea, data.message);
        });
    }

    /**
     * Submits the contact email form by clicking Send.
     **/
    async submitContactForm() {
        await test.step('Click Send button to submit contact message', async () => {
            await this.waitForVisible(this.sendButton);
            await this.click(this.sendButton);
            await this.waitForLoaders();
            await this.page.waitForLoadState('load', { timeout: 5000 })
        });
    }

    /**
     * Verifies that the message was sent successfully.
     **/
    async verifyMessageSentSuccess() {
        await test.step('Verify success message after sending email', async () => {
            await this.waitForLoaders();
            await this.waitForVisible(this.page.getByText('Mail sent successfully.'), 15000);
            await this.verifyVisible(this.page.getByText('Mail sent successfully.'));
        });
    }

    /**
     * Complete end-to-end workflow to contact the school via email.
     * @param {Object} [contactDetails={}] - Contact form data { subject, name, email, message }.
     **/
    async contactSchool(contactDetails = {}) {
        await this.openEmailUsModal();
        await this.fillContactForm(contactDetails);
        await this.submitContactForm();
        await this.verifyMessageSentSuccess();
    }
}