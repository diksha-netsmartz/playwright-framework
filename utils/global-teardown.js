const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Generates a timestamp string in format: YYYY-MM-DD_HH-mm-ss
 */
function getTimestamp() {
    const now = new Date();
    const pad = (num) => String(num).padStart(2, '0');
    const year = now.getFullYear();
    const month = pad(now.getMonth() + 1);
    const day = pad(now.getDate());
    const hours = pad(now.getHours());
    const minutes = pad(now.getMinutes());
    const seconds = pad(now.getSeconds());
    return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
}

/**
 * Global Teardown hook executed once after all Playwright tests finish.
 * Automatically generates a timestamped Allure HTML report in 'allure-reports/'
 * and launches it in the browser, while ensuring any previous Allure server instances
 * are cleanly closed first.
 */
async function globalTeardown() {
    const rootDir = path.resolve(__dirname, '..');
    const allureResultsDir = path.join(rootDir, 'allure-results');
    const baseReportsDir = path.join(rootDir, 'allure-reports');

    if (fs.existsSync(allureResultsDir)) {
        try {
            const timestamp = getTimestamp();
            const reportRelativeFolder = path.join('allure-reports', `report_${timestamp}`);
            const reportFullPath = path.join(rootDir, reportRelativeFolder);

            if (!fs.existsSync(baseReportsDir)) {
                fs.mkdirSync(baseReportsDir, { recursive: true });
            }

            console.log(`\n[Reporting] Generating Allure Report in '${reportRelativeFolder}'...`);
            const isWindows = process.platform === 'win32';
            const cmd = isWindows ? 'npx.cmd' : 'npx';

            execSync(`${cmd} allure generate allure-results --clean -o "${reportFullPath}"`, {
                cwd: rootDir,
                stdio: 'inherit',
                shell: true
            });

            // Close any existing Allure server instances before opening a new one
            try {
                if (isWindows) {
                    execSync('powershell -Command "Get-CimInstance Win32_Process -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -match \'allure.*open\' } | ForEach-Object { Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue }"', {
                        shell: true,
                        stdio: 'ignore'
                    });
                } else {
                    execSync('pkill -f "allure.*open" || true', {
                        shell: true,
                        stdio: 'ignore'
                    });
                }
            } catch (_) {
                // Ignore if no existing process was running or command is unsupported
            }

            console.log(`[Reporting] Opening latest Allure Report (${reportRelativeFolder}) in browser...`);
            const child = spawn(cmd, ['allure', 'open', reportFullPath], {
                cwd: rootDir,
                detached: !isWindows,
                stdio: 'ignore',
                shell: true
            });
            child.unref();
        } catch (error) {
            console.error('[Reporting] Could not automatically open Allure report:', error.message);
        }
    }
}

module.exports = globalTeardown;


