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
        headless: process.env.HEADLESS !== undefined ? process.env.HEADLESS === 'true' : false,
        viewport: process.env.VIEWPORT_WIDTH && process.env.VIEWPORT_HEIGHT
            ? { width: Number(process.env.VIEWPORT_WIDTH), height: Number(process.env.VIEWPORT_HEIGHT) }
            : null,
        launchOptions: {
            args: ['--start-maximized'],
        },
        screenshot: 'on',
        trace: 'on',
        ignoreHTTPSErrors: true

    }

});