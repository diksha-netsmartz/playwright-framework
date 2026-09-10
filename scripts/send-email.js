const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const nodemailer = require('nodemailer');

/**
 * Parses test results from 'allure-results' folder to produce summary stats.
 */
function getTestSummary(allureResultsDir) {
    let passed = 0;
    let failed = 0;
    let broken = 0;
    let skipped = 0;
    let total = 0;

    if (fs.existsSync(allureResultsDir)) {
        const files = fs.readdirSync(allureResultsDir);
        for (const file of files) {
            if (file.endsWith('-result.json')) {
                try {
                    const data = JSON.parse(fs.readFileSync(path.join(allureResultsDir, file), 'utf8'));
                    total++;
                    if (data.status === 'passed') passed++;
                    else if (data.status === 'failed') failed++;
                    else if (data.status === 'broken') broken++;
                    else if (data.status === 'skipped') skipped++;
                    else passed++;
                } catch (_) {
                    // Ignore malformed individual JSON
                }
            }
        }
    }
    return { total, passed, failed, broken, skipped };
}

async function sendEmail() {
    const rootDir = path.resolve(__dirname, '..');
    const allureResultsDir = path.join(rootDir, 'allure-results');
    const singleReportDir = path.join(rootDir, 'allure-single-report');
    const zipPath = path.join(rootDir, 'Allure-Report.zip');

    const jobStatus = (process.env.JOB_STATUS || 'success').toLowerCase();
    const isSuccess = jobStatus === 'success';
    const envName = process.env.ENV || 'coreServer2';
    const repo = process.env.GITHUB_REPOSITORY || '';
    const runId = process.env.GITHUB_RUN_ID || '';
    const runUrl = repo && runId ? `https://github.com/${repo}/actions/runs/${runId}` : '';

    const summary = getTestSummary(allureResultsDir);

    console.log('[Email] Generating Allure single-file report...');
    let zipExists = false;
    try {
        if (fs.existsSync(allureResultsDir)) {
            // Generate self-contained single-file HTML report (no standalone .js files, avoids Gmail 552 security block)
            execSync(`npx allure generate --single-file "${allureResultsDir}" --clean -o "${singleReportDir}"`, {
                cwd: rootDir,
                stdio: 'inherit'
            });

            const indexHtml = path.join(singleReportDir, 'index.html');
            if (fs.existsSync(indexHtml)) {
                // Compress single index.html into zip
                if (process.platform === 'win32') {
                    execSync(`powershell -Command "Compress-Archive -Path '${indexHtml}' -DestinationPath '${zipPath}' -Force"`, {
                        cwd: rootDir,
                        stdio: 'inherit'
                    });
                } else {
                    execSync(`cd "${singleReportDir}" && zip -r "${zipPath}" index.html`, {
                        cwd: rootDir,
                        stdio: 'inherit'
                    });
                }
                zipExists = fs.existsSync(zipPath);
                console.log(`[Email] Allure-Report.zip created (${(fs.statSync(zipPath).size / 1024 / 1024).toFixed(2)} MB).`);
            }
        }
    } catch (err) {
        console.warn('[Email] Warning: Could not generate Allure single-file report zip:', err.message);
    }

    const emailUser = process.env.EMAIL_USERNAME || 'testingdata3011@gmail.com';
    const emailPass = process.env.EMAIL_PASSWORD || 'uazx hbyz rwjf arwj';
    const rawRecipients = (process.env.EMAIL_TO || '').trim();
    const emailTo = rawRecipients.length > 0 ? rawRecipients : 'diksha.gupta@netsmartz.com';


    const transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: emailUser,
            pass: emailPass
        }
    });

    const statusBadgeColor = isSuccess ? '#28a745' : '#dc3545';
    const statusText = isSuccess ? 'PASSED' : 'FAILED';

    const htmlBody = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #24292e; margin: 0; padding: 20px; background-color: #f6f8fa; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; border: 1px solid #e1e4e8; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.05); }
        .header { background: #1f2937; padding: 20px; text-align: center; color: #ffffff; }
        .header h1 { margin: 0; font-size: 20px; font-weight: 600; }
        .content { padding: 24px; }
        .badge { display: inline-block; padding: 6px 16px; font-size: 14px; font-weight: 700; color: #ffffff; border-radius: 20px; background-color: ${statusBadgeColor}; }
        .stats-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .stats-table th, .stats-table td { padding: 12px; text-align: center; border-bottom: 1px solid #e1e4e8; }
        .stats-table th { background: #f9fafb; font-size: 12px; color: #6b7280; text-transform: uppercase; }
        .stat-number { font-size: 18px; font-weight: 700; }
        .info-list { list-style: none; padding: 0; margin: 16px 0; font-size: 14px; }
        .info-list li { margin-bottom: 8px; color: #4b5563; }
        .info-list li strong { color: #1f2937; }
        .btn { display: inline-block; margin-top: 10px; padding: 10px 20px; background: #2563eb; color: #ffffff !important; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 14px; }
        .footer { background: #f9fafb; padding: 16px; font-size: 12px; text-align: center; color: #6b7280; border-top: 1px solid #e1e4e8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Playwright Automation Execution</h1>
        </div>
        <div class="content">
          <div style="text-align: center; margin-bottom: 16px;">
            <span class="badge">${statusText}</span>
          </div>

          <table class="stats-table">
            <thead>
              <tr>
                <th>Total</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Skipped</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td class="stat-number" style="color: #1f2937;">${summary.total}</td>
                <td class="stat-number" style="color: #28a745;">${summary.passed}</td>
                <td class="stat-number" style="color: #dc3545;">${summary.failed + summary.broken}</td>
                <td class="stat-number" style="color: #d97706;">${summary.skipped}</td>
              </tr>
            </tbody>
          </table>

          <ul class="info-list">
            <li><strong>Environment:</strong> ${envName}</li>
            <li><strong>Target Branch:</strong> main</li>
            <li><strong>Report Attachment:</strong> ${zipExists ? 'Allure-Report.zip attached (self-contained HTML report)' : 'Available in GitHub Actions artifacts'}</li>
          </ul>

          ${runUrl ? `<div style="text-align: center; margin: 24px 0;"><a href="${runUrl}" class="btn" target="_blank">View GitHub Actions Run</a></div>` : ''}

          <p style="font-size: 13px; color: #6b7280; line-height: 1.5; margin-top: 20px;">
            <em>Note: To view the full report, extract <strong>Allure-Report.zip</strong> and open <strong>index.html</strong> in any web browser.</em>
          </p>
        </div>
        <div class="footer">
          Automated Notification &bull; Playwright Test Framework
        </div>
      </div>
    </body>
    </html>
    `;

    const attachments = [];
    if (zipExists) {
        attachments.push({
            filename: 'Allure-Report.zip',
            path: zipPath
        });
    }

    console.log(`[Email] Sending execution notification to: ${emailTo}`);
    const mailOptions = {
        from: `"Playwright Automation" <${emailUser}>`,
        to: emailTo,
        subject: `Playwright Test Run [${statusText}]: ${envName}`,
        html: htmlBody,
        attachments: attachments
    };

    try {
        const info = await transporter.sendMail(mailOptions);
        console.log(`[Email] Notification successfully sent! Message ID: ${info.messageId}`);
    } catch (error) {
        console.error('[Email] Error sending email via SMTP:', error);
        throw error;
    }
}

if (require.main === module) {
    sendEmail().catch((err) => {
        console.error('[Email] Script failed:', err);
        process.exit(1);
    });
}

module.exports = sendEmail;
