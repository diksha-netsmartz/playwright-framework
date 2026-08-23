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


## 🧪 Running Tests

### 1. Using NPM Scripts (Cross-Platform: Mac, Linux & Windows)

```bash
# Run all tests (Headless with 1920x1080 resolution)
npm run test:headless

# Run in Headed (Browser visible) mode
npm run test:headed

# Run ONLY the failed tests from the previous test run
npm run test:failed            # Headless mode
npm run test:failed:headed     # Headed (browser visible) mode

# Interactive UI Mode & Debugger
npm run test:ui        # Playwright Interactive UI Mode
npm run test:debug     # Step-by-step Playwright Debugger
```

---

### 2. Using Direct CLI Commands

#### **A. Headless Mode with Viewport Dimensions**

- **Universal (Mac / Linux / Windows via `cross-env`):**
  ```bash
  npx cross-env HEADLESS=true VIEWPORT_WIDTH=1920 VIEWPORT_HEIGHT=1080 npx playwright test
  ```

- **Mac / Linux / Git Bash:**
  ```bash
  HEADLESS=true VIEWPORT_WIDTH=1920 VIEWPORT_HEIGHT=1080 npx playwright test
  ```

- **Windows PowerShell:**
  ```powershell
  $env:HEADLESS="true"; $env:VIEWPORT_WIDTH="1920"; $env:VIEWPORT_HEIGHT="1080"; npx playwright test
  ```

- **Windows Command Prompt (CMD):**
  ```cmd
  set HEADLESS=true && set VIEWPORT_WIDTH=1920 && set VIEWPORT_HEIGHT=1080 && npx playwright test
  ```

---

#### **B. Re-running ONLY Failed Tests (`--last-failed`)**

- **Universal (via `cross-env`):**
  ```bash
  npx cross-env HEADLESS=true VIEWPORT_WIDTH=1920 VIEWPORT_HEIGHT=1080 npx playwright test --last-failed
  ```

- **Mac / Linux / Git Bash:**
  ```bash
  HEADLESS=true VIEWPORT_WIDTH=1920 VIEWPORT_HEIGHT=1080 npx playwright test --last-failed
  ```

- **Windows PowerShell:**
  ```powershell
  $env:HEADLESS="true"; $env:VIEWPORT_WIDTH="1920"; $env:VIEWPORT_HEIGHT="1080"; npx playwright test --last-failed
  ```

- **Windows Command Prompt (CMD):**
  ```cmd
  set HEADLESS=true && set VIEWPORT_WIDTH=1920 && set VIEWPORT_HEIGHT=1080 && npx playwright test --last-failed
  ```

- **Run Failed Tests in Headed Mode:**
  ```bash
  npx cross-env HEADLESS=false npx playwright test --last-failed
  ```

- **Run Failed Tests in UI Mode:**
  ```bash
  npx playwright test --last-failed --ui
  ```

---

#### **C. Headed & UI Modes**

- **Playwright Interactive UI Mode (Full GUI Runner with time travel, watch mode, and locators):**
  ```bash
  npx playwright test --ui
  ```

- **Run in Headed mode (Browser window opens):**
  ```bash
  npx playwright test --headed
  ```

- **Run in Debug mode (Step-by-step debugger with Playwright Inspector):**
  ```bash
  npx playwright test --debug
  ```

---

#### **D. Running Specific Tests**

- **Run a specific test file:**
  ```bash
  npx playwright test tests/AdminApplication/TC_001_to_005_CombinedAppointmentsInSingleInstructor.spec.js
  ```

- **Run a specific directory:**
  ```bash
  npx playwright test tests/AdminApplication/
  ```

- **Run tests matching a title/keyword:**
  ```bash
  npx playwright test -g "TC_001"
  ```

- **Run sequentially with a single worker:**
  ```bash
  npx playwright test --workers=1
  ```

---

## ⚙️ Configuration & Execution Settings

Configuration settings are managed in [`playwright.config.js`](./playwright.config.js):

- **Headless & Viewport:** Automatically reads `HEADLESS`, `VIEWPORT_WIDTH`, and `VIEWPORT_HEIGHT` environment variables or defaults to headed mode with maximized window.
- **Browser:** Configured to use `chromium` by default.
- **SlowMo:** `slowMo: 500` is enabled for smoother visual execution and stability during UI interaction.

---

## 📊 Viewing Test Reports

1. **Open HTML Test Report:**
   ```bash
   npx playwright show-report
   ```

2. **Manual Report Viewing:**
   Open `playwright-report/index.html` directly in any web browser.

3. **View Traces for Failed Tests:**
   ```bash
   npx playwright show-trace test-results/<path-to-trace.zip>
   ```