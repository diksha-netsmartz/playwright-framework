// @ts-check

const {defineConfig} = require('@playwright/test');

module.exports = defineConfig({

    testDir: './tests',

    timeout: 60 * 1000,

    expect: {
        timeout: 5000,
    },

    // retries: 1,

    reporter: [
        ['html', {open: 'never'}]
    ],

    use: {

        // browserName: 'webkit',

        browserName: 'chromium',

        // channel: 'msedge',

        headless: false,

        // viewport: { width: 1920, height: 1080 },
        launchOptions: {
            args: ['--start-maximized'],
        },

        // actionTimeout: 60000,

        // navigationTimeout: 60000,

        screenshot: 'on',

        trace: 'retain-on-failure',

        video: 'retain-on-failure',

        ignoreHTTPSErrors: true

    }

});