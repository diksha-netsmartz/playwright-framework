import { ImapFlow } from 'imapflow';
import { simpleParser } from 'mailparser';
import gmailAccount from '../test-data/json/gmailAccount.json';

export default class EmailHelper {
    /**
     * Polls the inbox for the latest email received after a specified timestamp and extracts the Reset Password link.
     * @param {string|{recipientEmail?: string, subject?: string|string[], timeoutMs?: number, sentAfter?: number}|any} [options={}] - Recipient email string OR options object
     * @param {number} [timeoutMs=45000] - Max wait time in milliseconds
     * @returns {Promise<string>} The reset password URL
     */
    static async getResetPasswordLink(options = {}, timeoutMs) {
        let recipientEmail = null;
        let searchSubject = 'Student UserName/Password';
        let maxWaitTime = timeoutMs || 60000; // Default 1 minute (60 seconds)

        if (typeof options === 'string') {
            recipientEmail = options;
        } else if (typeof options === 'object' && options !== null) {
            recipientEmail = options.recipientEmail || null;
            if (options.subject) searchSubject = options.subject;
            if (options.timeoutMs) maxWaitTime = options.timeoutMs;
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
                    // Send NOOP to refresh/reload mailbox state and fetch latest emails from server
                    try {
                        await client.noop();
                    } catch {
                        // Ignore transient NOOP errors
                    }

                    // Search for unread reset password emails
                    const searchCriteria = { seen: false };
                    if (recipientEmail) {
                        searchCriteria.to = recipientEmail;
                    }
                    if (searchSubject) {
                        searchCriteria.subject = searchSubject;
                    }

                    let messages = await client.search(searchCriteria);

                    // Fallback to searching by subject alone if recipient header format differs
                    if ((!messages || messages.length === 0) && recipientEmail && searchSubject) {
                        messages = await client.search({ seen: false, subject: searchSubject });
                    }

                    if (messages && messages.length > 0) {
                        // Sort descending so the most recent message (highest sequence number) is checked first
                        const sortedMessages = [...messages].sort((a, b) => Number(b) - Number(a));

                        for (const messageId of sortedMessages) {
                            const fetched = await client.fetchOne(messageId, { source: true, internalDate: true, uid: true });
                            if (!fetched || !fetched.source) {
                                continue;
                            }
                            const parsed = await simpleParser(fetched.source);
                            const subject = parsed.subject || '';

                            // Ensure subject matches
                            if (searchSubject && !subject.toLowerCase().includes(searchSubject.toLowerCase())) {
                                continue;
                            }

                            const htmlContent = parsed.html || parsed.textAsHtml || '';
                            const textContent = parsed.text || '';
                            const allContent = `${htmlContent}\n${textContent}`;

                            // Check for Reset Password URL patterns (handles unquoted SendGrid tracking links and direct URLs)
                            const match =
                                htmlContent.match(/<a\s+[^>]*href=["']?([^"'\s>]+)["']?[^>]*>\s*Reset\s*Password\s*<\/a>/i) ||
                                htmlContent.match(/href=["']?(https?:\/\/[^"'>\s]*ResetPassword[^"'>\s]*)["']?/i) ||
                                allContent.match(/(https?:\/\/[^\s<>"']*ResetPassword[^\s<>"']*)/i) ||
                                allContent.match(/https?:\/\/[^\s<>"']+\/Login\/ResetPassword\/[^\s<>"']+/i);

                            if (match && (match[1] || match[0])) {
                                const resetUrl = (match[1] || match[0]).replace(/&amp;/g, '&').trim();
                                console.log(`[EmailHelper] Successfully extracted Reset Password link (Subject: "${subject}")`);

                                // Mark all matching unread messages as seen
                                for (const msgId of sortedMessages) {
                                    try {
                                        await client.messageFlagsAdd(msgId, ['\\Seen']);
                                    } catch {
                                        // Ignore
                                    }
                                }

                                return resetUrl;
                            }
                        }
                    }
                } finally {
                    lock.release();
                }

                const elapsedSec = Math.round((Date.now() - startTime) / 1000);
                const totalSec = Math.round(maxWaitTime / 1000);
                console.log(`[EmailHelper] Reloading inbox, waiting for new email... (${elapsedSec}s / ${totalSec}s elapsed)`);
                await new Promise(resolve => setTimeout(resolve, 3000));
            }

            throw new Error(`[EmailHelper] Reset Password email was not received within ${maxWaitTime / 1000} seconds.`);
        } finally {
            await client.logout();
        }
    }

    /**
     * Marks all unread emails matching optional recipient and subject(s) as seen.
     * Supports passing a single subject string or an array of subjects.
     * @param {{recipientEmail?: string, subject?: string|string[]}|any} [options={}] - Options { recipientEmail, subject }
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
                // Normalize subjects to search
                let subjectsToSearch = [];
                if (options.subject) {
                    if (Array.isArray(options.subject)) {
                        subjectsToSearch = options.subject;
                    } else if (typeof options.subject === 'string') {
                        if (/reset\s*pwd/i.test(options.subject)) {
                            subjectsToSearch = [options.subject, 'Student UserName/Password', 'Reset Password'];
                        } else {
                            subjectsToSearch = [options.subject];
                        }
                    }
                } else {
                    subjectsToSearch = [null];
                }

                const markedSeqNumbers = new Set();

                for (const subj of subjectsToSearch) {
                    const searchCriteria = { seen: false };
                    if (options.recipientEmail) searchCriteria.to = options.recipientEmail;
                    if (subj) searchCriteria.subject = subj;

                    let messages = await client.search(searchCriteria);

                    // Fallback search by subject alone if recipient filter yielded 0
                    if ((!messages || messages.length === 0) && options.recipientEmail && subj) {
                        messages = await client.search({ seen: false, subject: subj });
                    }

                    if (messages && messages.length > 0) {
                        for (const msg of messages) {
                            if (!markedSeqNumbers.has(msg)) {
                                markedSeqNumbers.add(msg);
                                try {
                                    await client.messageFlagsAdd(msg, ['\\Seen']);
                                } catch {
                                    // Ignore individual flag error
                                }
                            }
                        }
                    }
                }

                if (markedSeqNumbers.size > 0) {
                    console.log(`[EmailHelper] Marked ${markedSeqNumbers.size} unread reset password message(s) as seen.`);
                } else {
                    console.log(`[EmailHelper] No matching unread reset password messages found to mark as seen.`);
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

