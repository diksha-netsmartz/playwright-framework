// @ts-check

const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({

    testDir: './tests',

    timeout: 30 * 1000,

    expect: {
        timeout: 5000,
    },

    retries: 1,

    reporter: [
        ['html', { open: 'never' }]
    ],

    use: {

        browserName: 'chromium',

        headless: true,

        viewport: { width: 1920, height: 1080 },

        actionTimeout: 10000,

        navigationTimeout: 30000,

        screenshot: 'only-on-failure',

        trace: 'retain-on-failure',

        video: 'retain-on-failure',

        ignoreHTTPSErrors: true

    }

});