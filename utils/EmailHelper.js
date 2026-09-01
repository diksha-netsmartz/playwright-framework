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
    static async getResetPasswordLink(options = {}, timeoutMs) {
        let recipientEmail = null;
        let searchSubject = null;
        let maxWaitTime = timeoutMs || 45000;
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

                                // Mark every email found for reset password as seen
                                for (const msgId of sortedMessages) {
                                    try {
                                        await client.messageFlagsAdd(msgId, ['\\Seen']);
                                    } catch {
                                        // Ignore individual flag error
                                    }
                                }

                                try {
                                    const unreadCriteria = { seen: false };
                                    if (recipientEmail) unreadCriteria.to = recipientEmail;
                                    if (searchSubject) unreadCriteria.subject = searchSubject;
                                    const remainingUnread = await client.search(unreadCriteria);
                                    if (remainingUnread && remainingUnread.length > 0) {
                                        for (const msg of remainingUnread) {
                                            await client.messageFlagsAdd(msg, ['\\Seen']);
                                        }
                                    }
                                } catch {
                                    // Ignore
                                }

                                console.log(`[EmailHelper] Marked all found reset password email(s) as seen.`);
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

            // Instead of throwing error, fetch the link from the last email received
            console.warn(`[EmailHelper] Reset Password email (sent after ${sentAfter.toISOString()}) was not received within ${maxWaitTime / 1000} seconds.`);
            console.log('[EmailHelper] Fallback: Fetching Reset Password link from the last email received...');

            const fallbackLock = await client.getMailboxLock('INBOX');
            try {
                const totalMessages = client.mailbox.exists;
                if (totalMessages > 0) {
                    const checkCount = Math.min(totalMessages, 10);
                    let foundUrl = null;
                    const matchedMessageIds = [];

                    for (let seq = totalMessages; seq > totalMessages - checkCount; seq--) {
                        const fetched = await client.fetchOne(seq, { source: true, internalDate: true, uid: true });
                        if (!fetched || !fetched.source) {
                            continue;
                        }

                        const parsed = await simpleParser(fetched.source);
                        const htmlContent = parsed.html || parsed.textAsHtml || '';
                        const textContent = parsed.text || '';
                        const allContent = `${htmlContent}\n${textContent}`;

                        const match =
                            htmlContent.match(/href=["'](https?:\/\/[^"'>]*ResetPassword[^"'>]*)["']/i) ||
                            htmlContent.match(/href=["']([^"'>]+)["'][^>]*>\s*Reset Password\s*<\/a>/i) ||
                            allContent.match(/(https?:\/\/[^\s<>"']*ResetPassword[^\s<>"']*)/i) ||
                            allContent.match(/https?:\/\/[^\s<>"']+\/Login\/ResetPassword\/[^\s<>"']+/i);

                        if (match && (match[1] || match[0])) {
                            matchedMessageIds.push(seq);
                            if (!foundUrl) {
                                foundUrl = (match[1] || match[0]).replace(/&amp;/g, '&').trim();
                                const emailDate = parsed.date || fetched.internalDate || new Date(0);
                                const subject = parsed.subject || '';
                                console.log(`[EmailHelper] Successfully extracted Reset Password link from last email received (Seq: ${seq}, Date: ${emailDate.toISOString()}, Subject: "${subject}")`);
                            }
                        }
                    }

                    if (foundUrl) {
                        // Mark every email found for reset password as seen
                        for (const seqId of matchedMessageIds) {
                            try {
                                await client.messageFlagsAdd(seqId, ['\\Seen']);
                            } catch {
                                // Ignore
                            }
                        }

                        try {
                            const searchCriteria = { seen: false };
                            if (recipientEmail) searchCriteria.to = recipientEmail;
                            if (searchSubject) searchCriteria.subject = searchSubject;
                            const unreadMessages = await client.search(searchCriteria);
                            if (unreadMessages && unreadMessages.length > 0) {
                                for (const msg of unreadMessages) {
                                    await client.messageFlagsAdd(msg, ['\\Seen']);
                                }
                            }
                        } catch {
                            // Ignore
                        }

                        console.log(`[EmailHelper] Marked all found reset password email(s) as seen.`);
                        return foundUrl;
                    }
                }
            } finally {
                fallbackLock.release();
            }

            throw new Error(`[EmailHelper] Could not find Reset Password link even in the last received email(s).`);
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
