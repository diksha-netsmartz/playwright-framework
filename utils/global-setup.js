const fs = require('fs');
const path = require('path');

/**
 * Global Setup hook executed once before all Playwright tests run.
 * Automatically cleans the 'allure-results' folder so that only tests
 * executed in the current test run appear in the Allure report.
 */
async function globalSetup() {
    const rootDir = path.resolve(__dirname, '..');
    const allureResultsDir = path.join(rootDir, 'allure-results');

    if (fs.existsSync(allureResultsDir)) {
        console.log('\n[Reporting] Cleaning previous Allure results...');
        try {
            fs.rmSync(allureResultsDir, { recursive: true, force: true });
        } catch (error) {
            console.warn('[Reporting] Failed to clean allure-results directory:', error.message);
        }
    }
}

module.exports = globalSetup;

