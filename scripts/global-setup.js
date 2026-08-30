const fs = require('fs');
const path = require('path');
const os = require('os');

/**
 * Copies the history folder from the most recent generated report
 * so that Allure can display historical trend graphs.
 */
function preserveHistory(rootDir, allureResultsDir) {
    const baseReportsDir = path.join(rootDir, 'allure-reports');
    if (!fs.existsSync(baseReportsDir)) return;

    try {
        const reportDirs = fs.readdirSync(baseReportsDir)
            .filter(dir => dir.startsWith('report_') && fs.statSync(path.join(baseReportsDir, dir)).isDirectory())
            .sort()
            .reverse();

        if (reportDirs.length > 0) {
            const latestHistoryDir = path.join(baseReportsDir, reportDirs[0], 'history');
            if (fs.existsSync(latestHistoryDir)) {
                const targetHistoryDir = path.join(allureResultsDir, 'history');
                fs.cpSync(latestHistoryDir, targetHistoryDir, {recursive: true});
                console.log(`[Reporting] Preserved history from latest report: ${reportDirs[0]}`);
            }
        }
    } catch (err) {
        console.warn('[Reporting] Failed to preserve history:', err.message);
    }
}

/**
 * Creates dynamic environment.properties in allure-results so that
 * the Environment widget is populated on the Allure Dashboard.
 */
function createEnvironmentProperties(rootDir, allureResultsDir) {
    try {
        const envName = process.env.ENV || 'coreServer2';
        const isHeadless = process.env.HEADLESS !== 'false';
        const platform = os.platform();
        const osType = os.type();
        const osRelease = os.release();

        let targetUrl = 'https://www.tdsm.app/CentralizeAdmin/';
        try {
            const loginData = require(path.join(rootDir, 'test-data/json/login.json'));
            if (loginData[envName] && loginData[envName].url) {
                targetUrl = loginData[envName].url;
            }
        } catch (_) {
        }

        const envProps = [
            `Application=TDSM Centralized Admin Portal`,
            `Environment=${envName}`,
            `Target URL=${targetUrl}`,
            `Execution Mode=${isHeadless ? 'Headless' : 'Headed'}`,
            `Operating System=${platform} (${osType} ${osRelease})`,
            `Architecture=${os.arch()}`,
            `Node Version=${process.version}`,
            `Test Framework=Playwright Test`,
            `Reporter=Allure Playwright`
        ].join('\n');

        fs.writeFileSync(path.join(allureResultsDir, 'environment.properties'), envProps, 'utf-8');
    } catch (err) {
        console.warn('[Reporting] Failed to create environment.properties:', err.message);
    }
}

/**
 * Creates categories.json in allure-results to automatically group
 * test failures under the Categories tab for rapid triage.
 */
function createCategories(allureResultsDir) {
    try {
        const categories = [
            {
                name: "Assertion / Product Defects",
                matchedStatuses: ["failed"],
                messageRegex: ".*(expect|toEqual|toContain|toBeVisible|toHaveCount|toHaveText|received).*"
            },
            {
                name: "Locator / UI Element Not Found",
                matchedStatuses: ["failed", "broken"],
                messageRegex: ".*(waiting for locator|element is not visible|strict mode violation|cannot find element).*"
            },
            {
                name: "Timeouts & Server Latency",
                matchedStatuses: ["broken"],
                messageRegex: ".*(Timeout|timeout|exceeded|waiting for response|timed out).*"
            },
            {
                name: "File System & Upload Errors",
                matchedStatuses: ["broken", "failed"],
                messageRegex: ".*(ENOENT|no such file or directory|filechooser).*"
            },
            {
                name: "JavaScript Runtime Errors",
                matchedStatuses: ["broken"],
                messageRegex: ".*(TypeError|ReferenceError|Cannot read properties|is not a function).*"
            }
        ];

        fs.writeFileSync(path.join(allureResultsDir, 'categories.json'), JSON.stringify(categories, null, 2), 'utf-8');
    } catch (err) {
        console.warn('[Reporting] Failed to create categories.json:', err.message);
    }
}

/**
 * Global Setup hook executed once before all Playwright tests run.
 * Cleans the previous raw results, preserves historical trends,
 * and sets up environment properties and defect categories.
 */
async function globalSetup() {
    const rootDir = path.resolve(__dirname, '..');
    const allureResultsDir = path.join(rootDir, 'allure-results');

    console.log('\n[Reporting] Preparing Allure results directory & metadata...');

    if (fs.existsSync(allureResultsDir)) {
        try {
            fs.rmSync(allureResultsDir, {recursive: true, force: true});
        } catch (error) {
            console.warn('[Reporting] Failed to clean allure-results directory:', error.message);
        }
    }

    fs.mkdirSync(allureResultsDir, {recursive: true});

    // Preserve history, write environment properties, and categories
    preserveHistory(rootDir, allureResultsDir);
    createEnvironmentProperties(rootDir, allureResultsDir);
    createCategories(allureResultsDir);
}

module.exports = globalSetup;
