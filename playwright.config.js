// @ts-check

const { defineConfig } = require('@playwright/test');

/**
 * Determine execution mode from HEADLESS environment variable:
 * - 'true'  => Headless mode with fixed 1920x1080 desktop viewport dimension.
 * - 'false' / default => UI / Headed mode with null viewport and '--start-maximized' for true full-screen mode.
 */
const isHeadless = process.env.HEADLESS === 'true';

module.exports = defineConfig({

    /**
     * testDir: Specifies the root directory where Playwright searches for test files (*.spec.js).
     * Current Value: './tests'
     * Possible Values: Any valid directory path string (e.g. './tests', './e2e', './src/specs').
     * Why: Keeps all test specifications organized inside the ./tests directory.
     */
    testDir: './tests',

    /**
     * timeout: Maximum time (in milliseconds) allowed for a single test case to complete.
     * Current Value: 320 * 1000 (320,000 ms / 5 minutes 20 seconds).
     * Possible Values:
     *   - Any positive integer in milliseconds (e.g. 30000 = 30s, 60000 = 1min, 300000 = 5min).
     *   - 0 (disables test timeout completely).
     * Why: Accommodates long end-to-end workflows (multi-student enrollment, scheduling, evaluations).
     */
    timeout: 320 * 1000,

    /**
     * workers: Number of concurrent worker processes used to execute tests in parallel.
     * Possible Values:
     *   - 1 (runs tests sequentially one by one).
     *   - 2, 4, etc. (number of CPU cores to allocate).
     *   - '50%', '100%' (percentage of available CPU cores).
     *   - undefined (Playwright defaults to half of CPU cores).
     */
    // workers: 1,

    /**
     * expect.timeout: Maximum time (in milliseconds) Playwright waits for assertion matchers to pass (e.g. toBeVisible()).
     * Current Value: 5000 (5 seconds).
     * Possible Values: Any positive integer in milliseconds (e.g. 3000, 5000, 10000, 15000).
     * Why: Gives dynamic DOM elements and UI animations reasonable time to render before failing.
     */
    expect: {
        timeout: 5000,
    },

    /**
     * retries: Number of times to automatically re-run a failed test.
     * Current Value: 1
     * Possible Values:
     *   - 0 (no retries; fail immediately).
     *   - 1, 2, 3 (number of retry attempts).
     * Why: Helps eliminate false negatives caused by intermittent network glitches or slow server responses.
     */
    retries: 1,

    /**
     * reporter: Defines test execution reporting format and behavior.
     * Current Value: [['html', { open: 'always' }]]
     * Possible Values:
     *   - Single reporter string: 'html' | 'list' | 'line' | 'dot' | 'json' | 'junit' | 'github'
     *   - Tuple with options: ['html', { open: 'always' | 'never' | 'on-failure', outputFolder: 'playwright-report' }]
     *   - Multiple reporters: [['list'], ['html', { open: 'on-failure' }], ['json', { outputFile: 'results.json' }]]
     * Why: Automatically opens an interactive HTML test report in the browser with screenshots, video, and logs after execution.
     */
    reporter: [
        ['html', { open: 'always' }]
    ],

    /**
     * use: Shared browser and execution settings applied to all tests.
     */
    use: {
        /**
         * actionTimeout: Maximum time (in ms) for individual actions like click(), fill(), selectOption().
         * Current Value: 15000 (15 seconds).
         * Possible Values:
         *   - Any positive integer in ms (e.g. 5000, 10000, 15000, 30000).
         *   - 0 (no timeout / wait indefinitely).
         * Why: Prevents tests from hanging indefinitely if an interactive element is temporarily unclickable.
         */
        actionTimeout: 15000,

        /**
         * navigationTimeout: Maximum time (in ms) for page navigation operations (page.goto(), redirects).
         * Current Value: 30000 (30 seconds).
         * Possible Values:
         *   - Any positive integer in ms (e.g. 15000, 30000, 60000).
         *   - 0 (no timeout / wait indefinitely).
         * Why: Accommodates slow server-side page loads and redirection chains.
         */
        navigationTimeout: 30000,

        /**
         * slowMo: Adds an artificial delay (in ms) before each action.
         * Current Value: 500 (500 ms).
         * Possible Values:
         *   - 0 (no delay; fastest execution speed).
         *   - Any integer in ms (e.g. 100, 250, 500, 1000).
         * Why: Slows down execution so actions can be observed visually in headed mode and lets UI animations settle.
         */
        slowMo: 500,

        /**
         * browserName: Browser engine used to execute tests.
         * Current Value: 'chromium'
         * Possible Values:
         *   - 'chromium' (Google Chrome, Microsoft Edge, Brave, Opera)
         *   - 'firefox'  (Mozilla Firefox)
         *   - 'webkit'   (Apple Safari)
         * Why: Runs tests against Google Chrome / Chromium engine.
         */
        browserName: 'chromium',

        /**
         * channel: Distribution channel for branded browser binaries.
         * Possible Values: 'chrome' | 'msedge' | 'chrome-beta' | 'msedge-dev' | undefined (bundled Chromium).
         */
        // channel: 'chrome',

        /**
         * headless: Runs browser in headless (no GUI) or headed (visible GUI) mode.
         * Current Value: isHeadless (boolean based on process.env.HEADLESS).
         * Possible Values:
         *   - true  (background execution without UI; ideal for CI/CD pipelines).
         *   - false (visible browser window; ideal for local debugging).
         * Why: Enables fast CI execution in headless mode and visual debugging in headed mode.
         */
        headless: isHeadless,

        /**
         * viewport: Screen dimension for the browser page.
         * Current Value: { width: 1920, height: 1080 } in headless, null in headed/UI mode.
         * Possible Values:
         *   - null (disables fixed viewport; browser expands to full screen window size).
         *   - { width: 1920, height: 1080 } (Full HD Desktop).
         *   - { width: 1366, height: 768 }  (Standard Laptop).
         *   - { width: 375, height: 667 }   (Mobile Viewport, e.g. iPhone SE).
         * Why: Guarantees consistent rendering in headless mode while providing true full-screen in UI mode.
         */
        viewport: isHeadless
            ? {
                width: process.env.VIEWPORT_WIDTH ? Number(process.env.VIEWPORT_WIDTH) : 1920,
                height: process.env.VIEWPORT_HEIGHT ? Number(process.env.VIEWPORT_HEIGHT) : 1080
            }
            : null,

        /**
         * launchOptions: Options passed to the browser engine during startup.
         * Current Value: { args: ['--start-maximized'] when headed }
         * Possible Values for args:
         *   - ['--start-maximized'] (opens browser window maximized to full monitor screen in headed mode).
         *   - ['--incognito'] (launches in private browsing mode).
         *   - ['--disable-notifications'] (disables web push notifications).
         *   - ['--window-size=1920,1080'] (custom window dimensions).
         *   - devtools: true | false (automatically opens Chrome DevTools panel on launch).
         * Why: Maximizes the browser window to full screen when running in UI/headed mode.
         */
        launchOptions: {
            args: isHeadless ? [] : ['--start-maximized'],
        },

        /**
         * screenshot: Captures screenshots during test execution.
         * Current Value: 'on'
         * Possible Values:
         *   - 'off'             (never capture screenshots).
         *   - 'on'              (capture screenshots for every test).
         *   - 'only-on-failure' (capture screenshot only when a test fails).
         * Why: Provides visual proof of test execution and assists debugging.
         */
        screenshot: 'on',

        /**
         * trace: Records detailed execution traces (DOM snapshots, network activity, console logs).
         * Current Value: 'on'
         * Possible Values:
         *   - 'off'                (never record traces).
         *   - 'on'                 (record trace for every test).
         *   - 'retain-on-failure'  (record trace, but discard if test passes; keep only on failure).
         *   - 'on-first-retry'     (record trace only when retrying a failed test).
         * Why: Enables deep post-run debugging and time-travel inspection with `npx playwright show-trace`.
         */
        trace: 'on',

        /**
         * video: Records video files of test execution.
         * Possible Values:
         *   - 'off'                (do not record video).
         *   - 'on'                 (record video for all tests).
         *   - 'retain-on-failure'  (save video only for failed tests).
         *   - 'on-first-retry'     (record video only on retry).
         */
        // video: 'retain-on-failure',

        /**
         * ignoreHTTPSErrors: Ignores SSL/TLS certificate errors.
         * Current Value: true
         * Possible Values:
         *   - true  (ignores SSL certificate warnings/mismatches).
         *   - false (aborts navigation on SSL certificate warnings).
         * Why: Prevents test blockage on test or staging servers with self-signed or invalid SSL certificates.
         */
        ignoreHTTPSErrors: true
    },

});