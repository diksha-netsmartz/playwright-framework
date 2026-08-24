const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Global Teardown hook executed once after all Playwright tests finish.
 * Automatically generates the Allure HTML report and launches it in the browser
 * alongside Playwright's default HTML report across Windows, macOS, and Linux.
 */
async function globalTeardown() {
    const rootDir = path.resolve(__dirname, '..');
    const allureResultsDir = path.join(rootDir, 'allure-results');

    if (fs.existsSync(allureResultsDir)) {
        try {
            console.log('\n[Reporting] Generating Allure Report...');
            const isWindows = process.platform === 'win32';
            const cmd = isWindows ? 'npx.cmd' : 'npx';

            execSync(`${cmd} allure generate allure-results --clean -o allure-report`, {
                cwd: rootDir,
                stdio: 'inherit',
                shell: true
            });

            console.log('[Reporting] Opening Allure Report in browser...');
            const child = spawn(cmd, ['allure', 'open', 'allure-report'], {
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
