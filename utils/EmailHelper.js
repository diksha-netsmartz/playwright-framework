import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import gmailAccount from '../test-data/json/gmailAccount.json';

export default class EmailHelper {
    /**
     * Polls the inbox for the latest email received after a specified timestamp and extracts the Reset Password link.
     * @param {string|object} options - Recipient email string OR options object { recipientEmail, subject, timeoutMs, sentAfter }
     * @param {number} [timeoutMs=45000] - Max wait time in milliseconds
     * @returns {Promise<string>} The reset password URL
     */
    static async getResetPasswordLink(options = {}, timeoutMs = 45000) {
        let recipientEmail = null;
        let searchSubject = null;
        let maxWaitTime = timeoutMs;
        let sentAfter = null;

        if (typeof options === 'string') {
            recipientEmail = options;
        } else if (typeof options === 'object' && options !== null) {
            recipientEmail = options.recipientEmail || null;
            searchSubject = options.subject || null;
            if (options.timeoutMs) maxWaitTime = options.timeoutMs;
            if (options.sentAfter) {
                sentAfter = options.sentAfter instanceof Date ? options.sentAfter : new Date(options.sentAfter);
            }
        }

        // Default to checking emails received within the last 60 seconds if sentAfter was not provided
        if (!sentAfter) {
            sentAfter = new Date(Date.now() - 60 * 1000);
        }

        const client = new ImapFlow({
            host: 'imap.gmail.com',
            port: 993,
            secure: true,
            auth: {
                user: gmailAccount.user,
                pass: gmailAccount.pass
            },
            logger: false
        });

        try {
            await client.connect();
            const startTime = Date.now();

            while (Date.now() - startTime < maxWaitTime) {
                const lock = await client.getMailboxLock('INBOX');
                try {
                    // Search unread messages
                    const searchCriteria = { seen: false };
                    if (recipientEmail) {
                        searchCriteria.to = recipientEmail;
                    }
                    if (searchSubject) {
                        searchCriteria.subject = searchSubject;
                    }

                    let messages = await client.search(searchCriteria);

                    // Fallback to checking any unread messages if specific query returned empty
                    if ((!messages || messages.length === 0) && (recipientEmail || searchSubject)) {
                        messages = await client.search({ seen: false });
                    }

                    if (messages && messages.length > 0) {
                        // Sort descending so the most recently received messages (highest sequence number) are checked first
                        const sortedMessages = [...messages].sort((a, b) => Number(b) - Number(a));
                        console.log(`[EmailHelper] Found ${sortedMessages.length} unread message(s). Checking from newest to oldest...`);

                        for (const messageId of sortedMessages) {
                            const fetched = await client.fetchOne(messageId, { source: true, internalDate: true, uid: true });
                            if (!fetched || !fetched.source) {
                                continue;
                            }
                            const parsed = await simpleParser(fetched.source);
                            const emailDate = parsed.date || fetched.internalDate || new Date(0);
                            const subject = parsed.subject || '';

                            // Ignore emails received before the sentAfter timestamp
                            if (emailDate.getTime() < sentAfter.getTime()) {
                                console.log(`[EmailHelper] Skipping older email (received: ${emailDate.toISOString()}, expected after: ${sentAfter.toISOString()})`);
                                continue;
                            }

                            // Filter by subject if specified
                            if (searchSubject && !subject.toLowerCase().includes(searchSubject.toLowerCase())) {
                                continue;
                            }

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
                                console.log(`[EmailHelper] Successfully extracted Reset Password link from newest email (Date: ${emailDate.toISOString()}, Subject: "${subject}")`);

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

            throw new Error(`[EmailHelper] Reset Password email (sent after ${sentAfter.toISOString()}) was not received within ${maxWaitTime / 1000} seconds.`);
        } finally {
            await client.logout();
        }
    }

    /**
     * Marks all unread emails matching optional recipient and subject as seen.
     * @param {object} [options={}]
     */
    static async markAllUnreadAsRead(options = {}) {
        const client = new ImapFlow({
            host: 'imap.gmail.com',
            port: 993,
            secure: true,
            auth: {
                user: gmailAccount.user,
                pass: gmailAccount.pass
            },
            logger: false
        });

        try {
            await client.connect();
            const lock = await client.getMailboxLock('INBOX');
            try {
                const searchCriteria = { seen: false };
                if (options.recipientEmail) searchCriteria.to = options.recipientEmail;
                if (options.subject) searchCriteria.subject = options.subject;

                const messages = await client.search(searchCriteria);
                if (messages && messages.length > 0) {
                    for (const msg of messages) {
                        await client.messageFlagsAdd(msg, ['\\Seen']);
                    }
                    console.log(`[EmailHelper] Marked ${messages.length} previous unread message(s) as seen.`);
                }
            } finally {
                lock.release();
            }
        } catch (err) {
            console.warn('[EmailHelper] Error while marking previous emails as read:', err.message);
        } finally {
            await client.logout();
        }
    }
}
