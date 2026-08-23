import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import gmailAccount from '../test-data/gmailAccount.json';

export default class EmailHelper {
    /**
     * Polls the inbox for the latest email and extracts the Reset Password link.
     * @param {string|object} options - Recipient email string OR options object { recipientEmail, subject, timeoutMs }
     * @param {number} [timeoutMs=45000] - Max wait time in milliseconds
     * @returns {Promise<string>} The reset password URL
     */
    static async getResetPasswordLink(options = {}, timeoutMs = 45000) {
        let recipientEmail = null;
        let searchSubject = null;
        let maxWaitTime = timeoutMs;

        if (typeof options === 'string') {
            recipientEmail = options;
        } else if (typeof options === 'object' && options !== null) {
            recipientEmail = options.recipientEmail || null;
            searchSubject = options.subject || null;
            if (options.timeoutMs) maxWaitTime = options.timeoutMs;
        }

        const client = new ImapFlow({
            host: gmailAccount.imap.host,
            port: gmailAccount.imap.port,
            secure: gmailAccount.imap.secure,
            auth: {
                user: gmailAccount.imap.auth.user,
                pass: gmailAccount.imap.auth.pass
            },
            logger: false
        });

        try {
            await client.connect();
            const startTime = Date.now();

            while (Date.now() - startTime < maxWaitTime) {
                const lock = await client.getMailboxLock('INBOX');
                try {
                    // Search criteria: filter by recipient and optional subject
                    const searchCriteria = { seen: false };
                    if (recipientEmail) {
                        searchCriteria.to = recipientEmail;
                    }
                    if (searchSubject) {
                        searchCriteria.subject = searchSubject;
                    }

                    // Search unread messages
                    let messages = await client.search(searchCriteria);

                    // Fallback to checking any unread messages if specific query returned empty
                    if ((!messages || messages.length === 0) && (recipientEmail || searchSubject)) {
                        messages = await client.search({ seen: false });
                    }

                    if (messages && messages.length > 0) {
                        console.log(`[EmailHelper] Found ${messages.length} unread message(s). Checking latest...`);

                        // Check messages starting from the most recent
                        for (let i = messages.length - 1; i >= 0; i--) {
                            const messageId = messages[i];
                            const fetched = await client.fetchOne(messageId, { source: true });
                            const parsed = await simpleParser(fetched.source);

                            const subject = parsed.subject || '';
                            const htmlContent = parsed.html || parsed.textAsHtml || '';
                            const textContent = parsed.text || '';
                            const allContent = `${htmlContent}\n${textContent}`;

                            // Check for Reset Password URL patterns
                            const match =
                                htmlContent.match(/href=["'](https?:\/\/[^"'>]*ResetPassword[^"'>]*)["']/i) ||
                                htmlContent.match(/href=["']([^"'>]+)["'][^>]*>\s*Reset Password\s*<\/a>/i) ||
                                allContent.match(/(https?:\/\/[^\s<>"']*ResetPassword[^\s<>"']*)/i) ||
                                allContent.match(/https?:\/\/[^\s<>"']+\/Login\/ResetPassword\/[^\s<>"']+/i);

                            if (match && (match[1] || match[0])) {
                                const resetUrl = (match[1] || match[0]).replace(/&amp;/g, '&').trim();
                                console.log(`[EmailHelper] Successfully extracted Reset Password link from email (Subject: "${subject}")`);

                                // Mark message as read
                                await client.messageFlagsAdd(messageId, ['\\Seen']);
                                return resetUrl;
                            }
                        }
                    }
                } finally {
                    lock.release();
                }

                console.log(`[EmailHelper] Waiting for email to arrive... (${Math.round((Date.now() - startTime) / 1000)}s elapsed)`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

            throw new Error(`[EmailHelper] Reset Password email was not received within ${maxWaitTime / 1000} seconds.`);
        } finally {
            await client.logout();
        }
    }
}
