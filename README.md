# Playwright Automation Framework

End-to-end test automation framework built using [Playwright](https://playwright.dev/) and JavaScript, structured around
the Page Object Model (POM) pattern.

---

## 📁 Project Structure

```text
ClientPlaywrightFramework/
├── config/                  # Global setup & environment configuration
├── pages/                   # Page Object Models
│   ├── AdminApplication/       # Admin portal pages (Scheduling, Billing, etc.)
│   ├── OnlineEnrollmentApplication/ # Public enrollment flows (Adult, Teen, etc.)
│   ├── StaffApplication/       # Staff portal pages (Attendance, Evaluations)
│   └── StudentApplication/     # Student portal pages (Login, Dashboard)
├── test-data/               # JSON data fixtures & test assets
├── tests/                   # Test specifications grouped by application module
├── screenshots/             # Captured failure/debug screenshots
├── playwright-report/       # Generated HTML test reports
└── test-results/            # Test execution artifacts (traces, videos)


⚙️ Prerequisites
Node.js: v18.x or higher
npm: v9.x or higher

🚀 Setup & Installation
1. Clone the repository:
git clone <repository-url>
cd ClientPlaywrightFramework

2. Install project dependencies:
npm install

3. Install required Playwright browser binaries:
npx playwright install


🧪 Running Tests

1. Run all tests
npx playwright test

2. Run a specific test file:
npx playwright test tests/AdminApplication/AddEditorOrDeletePackage.spec.js

3. Run tests in debug mode (Playwright Inspector):
npx playwright test --debug

4. Run tests using Playwright UI Mode:
npx playwright test --ui

⚙️ Configuration & Execution Settings

To change the default browser, headless mode, or timeouts, update your `playwright.config.js` file:

1. Headless vs Headed Mode:
  Inside `use: { ... }`, set `headless`:
  ```javascript
  use: {
    headless: true, // Set to false to see the browser UI while running tests
  }
  
2. Default Browser Selection:
Under projects: [ ... ], uncomment or prioritize your target browser:

projects: [
  {
    name: 'chromium', // Options: 'chromium', 'firefox', 'webkit'
    use: { ...devices['Desktop Chrome'] },
  },
]

📊 Viewing Test Reports

1. CLI Command : 
npx playwright show-report

2. Manual Navigation : 
Navigate to the playwright-report/ folder in your project directory.
Right-click index.html and select Open with Live Server (or open it directly in any web browser).

3. To view traces for debugging failed tests:
If a test fails, trace files and screenshots are saved in the test-results/ folder
npx playwright show-trace test-results/<path-to-trace.zip>