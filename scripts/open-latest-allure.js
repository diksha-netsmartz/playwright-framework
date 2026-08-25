const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const baseReportsDir = path.join(rootDir, 'allure-reports');
const fallbackReportDir = path.join(rootDir, 'allure-report');

let targetPath = null;

if (fs.existsSync(baseReportsDir)) {
    const folders = fs.readdirSync(baseReportsDir)
        .filter(f => fs.statSync(path.join(baseReportsDir, f)).isDirectory() && f.startsWith('report_'))
        .sort();

    if (folders.length > 0) {
        const latestFolder = folders[folders.length - 1];
        targetPath = path.join(baseReportsDir, latestFolder);
        console.log(`[Reporting] Found latest Allure report: allure-reports/${latestFolder}`);
    }
}

if (!targetPath && fs.existsSync(fallbackReportDir)) {
    targetPath = fallbackReportDir;
    console.log('[Reporting] Found Allure report: allure-report');
}

if (!targetPath) {
    console.log('[Reporting] No Allure reports found to open.');
    process.exit(0);
}

const isWindows = process.platform === 'win32';
const cmd = isWindows ? 'npx.cmd' : 'npx';

// Close any existing Allure server instances
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
} catch (_) {}

console.log('[Reporting] Opening Allure Report in browser...');
const child = spawn(cmd, ['allure', 'open', targetPath], {
    cwd: rootDir,
    detached: !isWindows,
    stdio: 'inherit',
    shell: true
});
