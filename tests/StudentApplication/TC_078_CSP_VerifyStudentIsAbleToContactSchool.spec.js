import { test, expect } from '@playwright/test';
import StudentLoginPage from '@pages/StudentApplication/StudentLoginPage';
import StudentHomePage from '@pages/StudentApplication/StudentPortalHomePage';
import StudentContactPage from '@pages/StudentApplication/StudentContactPage';
import EmailHelper from '@utils/EmailHelper';
import { credentials } from '@config/config';

/**
 * TC_078: CSP >> Contact
 * Test Case Title: To Verify student is able to contact school
 * Expected Result: Student is able to navigate to Contact page, open the Email Us form, submit the message, verify mail is sent successfully, and verify email is received in inbox
 **/
test('TC_078: CSP - To Verify student is able to contact school', { tag: '@CSPContact' }, async ({ page }) => {

  const studentLoginPage = new StudentLoginPage(page);
  const studentHomePage = new StudentHomePage(page);
  const studentContactPage = new StudentContactPage(page);
  const timestamp = Date.now();

  const contactData = {
    subject: 'Inquiry regarding driving lessons',
    name: credentials.studentUser.name || 'Automation Student',
    email: 'testingdata3011@gmail.com',
    message: `Hello, this is a test message sent at ${timestamp} to verify the contact school functionality.`
  };

  await test.step('Precondition: Mark existing unread emails with subject "Email from student portal" as read', async () => {
    await EmailHelper.markAllUnreadAsRead({
      subject: 'Email from student portal'
    });
  });

  await test.step('Step 1: Login to student portal (CSP) with valid credentials', async () => {
    await studentLoginPage.navigateToLoginPage();
    await studentLoginPage.login(credentials.studentUser.username, credentials.studentUser.password);
  });

  await test.step('Step 2: Navigate to Contact Us page', async () => {
    await studentHomePage.navigateToContactUs();
  });

  await test.step('Step 3: Contact school via Email Us form and verify confirmation message', async () => {
    await studentContactPage.contactSchool(contactData);
  });

  await test.step('Step 4: Check email is received in inbox and verify contact details', async () => {
    const receivedEmail = await EmailHelper.waitForEmail({
      subject: 'Email from student portal',
      timeoutMs: 60000
    });
    expect(receivedEmail.subject.toLowerCase()).toContain('email from student portal');

    // Normalize email content (handling non-breaking spaces) and verify submitted contact fields
    const emailContent = `${receivedEmail.text || ''}\n${receivedEmail.html || ''}`.replace(/\u00a0/g, ' ');

    const missingDetails = [];

    if (!emailContent.includes(contactData.subject)) {
      missingDetails.push(`Subject: "${contactData.subject}"`);
    }
    if (!emailContent.includes(contactData.name)) {
      missingDetails.push(`Student Name: "${contactData.name}"`);
    }
    if (!emailContent.includes(contactData.email)) {
      missingDetails.push(`Student Email: "${contactData.email}"`);
    }
    if (!emailContent.includes(contactData.message)) {
      missingDetails.push(`Message Content: "${contactData.message}"`);
    }

    if (missingDetails.length > 0) {
      const failureMsg = `Missing detail(s) in received email:\n${missingDetails.map(item => `  - ${item}`).join('\n')}`;
      console.error(`\n❌ [VERIFICATION FAILED] ${failureMsg}\n`);
      expect(missingDetails, failureMsg).toEqual([]);
    }
  });
});

