// @ts-check

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({

    testDir: './tests',

    timeout: 320 * 1000,
    // workers: 1,

    expect: {
        timeout: 5000,
    },

    // retries: 1,

    reporter: [
        ['html', { open: 'never' }]
    ],

    use: {
        slowMo: 500,
        // browserName: 'webkit',
        browserName: 'chromium',
        // channel: 'msedge',
        // headless: true,
        // viewport: { width: 1920, height: 1080 },
        headless: false,
        viewport: null,
        launchOptions: {
            args: ['--start-maximized'],
        },
        screenshot: 'on',
        trace: 'on',
        ignoreHTTPSErrors: true

    }

});