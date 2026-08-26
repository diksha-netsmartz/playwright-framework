# Playwright Automation Framework

End-to-end test automation framework built using [Playwright](https://playwright.dev/) and JavaScript, structured around the **Page Object Model (POM)** pattern.

---

## 🚀 Complete Setup Guide (From Scratch)

Follow these steps if you are setting up this project on a brand-new computer:

### Step 1: Install Git
- **macOS:** Open Terminal and run:
  ```bash
  xcode-select --install
  ```
- **Windows:** Download and install Git from [git-scm.com](https://git-scm.com/download/win).
- **Linux (Ubuntu/Debian):**
  ```bash
  sudo apt update && sudo apt install git -y
  ```

### Step 2: Install Node.js
- Download and install **Node.js (LTS v18 or v20+)** from [nodejs.org](https://nodejs.org/).
- **Important (Windows):** Close and reopen your terminal / VS Code after installing Node.js and Git to reload the system `PATH`.
- Verify installation:
  ```bash
  node -v
  npm -v
  ```

### Step 3 (Optional for Allure Reports): Install Java (JDK 8+)
- *Allure HTML reporting requires Java runtime (JDK/JRE).*
- **Windows:** Download and install OpenJDK (e.g. from [adoptium.net](https://adoptium.net/) or [oracle.com](https://www.oracle.com/java/technologies/downloads/)).
- Verify Java installation:
  ```bash
  java -version
  ```
- *(If Java is not installed, standard Playwright HTML reports `npx playwright show-report` will still work perfectly).*

### Step 4: Clone the Repository
```bash
git clone https://github.com/diksha-netsmartz/playwright-framework.git
cd playwright-framework
```

### Step 5: Install Project Dependencies
```bash
npm install
```

> **Note for Windows PowerShell users:** If you encounter `running scripts is disabled on this system`, run this once in PowerShell:
> ```powershell
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```
> Or simply use **Git Bash** or **Command Prompt (CMD)**.

### Step 6: Install Playwright Browsers
```bash
npx playwright install
```
*(On Windows / Linux, you can also run `npx playwright install --with-deps`)*

### Step 7: Verify Installation
Run a quick test to verify your setup:
```bash
npx cross-env HEADLESS=false npx playwright test tests/AdminApplication/TC_022_VerifyClassroomList.spec.js
```

---

## 🔄 Syncing & Managing Dependencies

Since `node_modules` is not stored in Git, follow these rules whenever updating the project:

### 1. Whenever you pull updates from Git:
Always run `npm install` after pulling so any newly added packages (e.g. `imapflow`, `mailparser`, `pdf-to-img`) are installed automatically:
```bash
git pull && npm install
```

### 2. Clean Install (Exact `package-lock.json` match):
If you get errors like `Cannot find module '<package>'` or dependency version conflicts:
```bash
npm ci
```
*`npm ci` wipes `node_modules` and performs a clean, rapid installation strictly matching `package-lock.json`.*

### 3. Adding a new library to the framework:
Always save the package to `package.json`:
```bash
# Runtime dependency:
npm install <package-name>

# Development dependency:
npm install -D <package-name>
```
*Always commit and push both `package.json` and `package-lock.json` to GitHub so other team members get the update.*

---

## 🧪 Universal Test Execution Commands

These commands use `npx cross-env` to work universally across **macOS, Linux, Windows Command Prompt (CMD), and PowerShell**.

- **Environment Selection (`ENV`):** Defaults to **`coreServer2`** (Server 2) automatically if no `ENV` variable is passed in CLI.
- **Headless Mode (`HEADLESS`):** Runs in the background with a fixed **1920x1080 desktop viewport**.
- **UI / Headed Mode (`HEADLESS`):** Opens a visible browser in **true full-screen (maximized)** mode.

---

### 🌐 Environment Variable (`ENV`) Options

| Environment | Key | CLI Command Example |
|---|---|---|
| **Core Server 2 (Default)** | `coreServer2` | `npx cross-env HEADLESS=false npx playwright test` *(or `ENV=coreServer2`)* |
| **Staging** | `staging` | `npx cross-env ENV=staging HEADLESS=false npx playwright test` |
| **UAT** | `uat` | `npx cross-env ENV=uat HEADLESS=false npx playwright test` |
| **Core Server 1** | `coreServer1` | `npx cross-env ENV=coreServer1 HEADLESS=false npx playwright test` |

---

### 1. Whole Batch (Run All Tests)

| Mode | Universal Command (Default: Server 2) | With Specific Environment (e.g. Staging) | NPM Shortcut |
|---|---|---|---|
| **Headless (1920x1080)** | `npx cross-env HEADLESS=true npx playwright test` | `npx cross-env ENV=staging HEADLESS=true npx playwright test` | `npm run test:headless` |
| **UI / Headed (Full Screen)** | `npx cross-env HEADLESS=false npx playwright test` | `npx cross-env ENV=staging HEADLESS=false npx playwright test` | `npm run test:headed` |

---

### 2. Last Failed (Re-run Only Failed Tests)

| Mode | Universal Command (Default: Server 2) | With Specific Environment | NPM Shortcut |
|---|---|---|---|
| **Headless (1920x1080)** | `npx cross-env HEADLESS=true npx playwright test --last-failed` | `npx cross-env ENV=uat HEADLESS=true npx playwright test --last-failed` | `npm run test:failed:headless` |
| **UI / Headed (Full Screen)** | `npx cross-env HEADLESS=false npx playwright test --last-failed` | `npx cross-env ENV=uat HEADLESS=false npx playwright test --last-failed` | `npm run test:failed:headed` |

---

### 3. Specific Test Case (Single File)

| Mode | Universal Command (Default: Server 2) | With Specific Environment (e.g. Core Server 1) |
|---|---|---|
| **Headless (1920x1080)** | `npx cross-env HEADLESS=true npx playwright test tests/AdminApplication/TC_022_VerifyClassroomList.spec.js` | `npx cross-env ENV=coreServer1 HEADLESS=true npx playwright test tests/AdminApplication/TC_022_VerifyClassroomList.spec.js` |
| **UI / Headed (Full Screen)** | `npx cross-env HEADLESS=false npx playwright test tests/AdminApplication/TC_022_VerifyClassroomList.spec.js` | `npx cross-env ENV=coreServer1 HEADLESS=false npx playwright test tests/AdminApplication/TC_022_VerifyClassroomList.spec.js` |

---

### 4. By Folder / Module (e.g., `AdminApplication`, `StaffApplication`, `StudentApplication`)

| Mode | Universal Command (Default: Server 2) | With Specific Environment |
|---|---|---|
| **Headless (1920x1080)** | `npx cross-env HEADLESS=true npx playwright test tests/AdminApplication/` | `npx cross-env ENV=staging HEADLESS=true npx playwright test tests/AdminApplication/` |
| **UI / Headed (Full Screen)** | `npx cross-env HEADLESS=false npx playwright test tests/AdminApplication/` | `npx cross-env ENV=staging HEADLESS=false npx playwright test tests/AdminApplication/` |

---

### 5. Smoke Test Suite (`@smoke`)

Run only smoke-tagged tests across modules without needing separate folders:

| Mode | Universal Command (Default: Server 2) | With Specific Environment | NPM Shortcut |
|---|---|---|---|
| **Headless (1920x1080)** | `npx cross-env HEADLESS=true npx playwright test --grep @smoke` | `npx cross-env ENV=staging HEADLESS=true npx playwright test --grep @smoke` | `npm run test:smoke:headless` |
| **UI / Headed (Full Screen)** | `npx cross-env HEADLESS=false npx playwright test --grep @smoke` | `npx cross-env ENV=staging HEADLESS=false npx playwright test --grep @smoke` | `npm run test:smoke` |

---

### 6. Interactive UI Dashboard & Debugger

- **Interactive UI Runner:**
  Playwright's interactive runner with live DOM inspection, time travel, and watch mode:
  ```bash
  npm run test:ui
  # or
  npx playwright test --ui
  ```

- **Playwright Debug Mode (Step-by-Step Inspector):**
  Pauses execution at breakpoints and opens the Playwright Inspector:
  ```bash
  npm run test:debug
  # or
  npx playwright test --debug
  ```

---

## 📊 Viewing Test Reports & Traces

### 1. View Playwright HTML Report
The Playwright HTML report can be opened manually:
```bash
npx playwright show-report
```

### 2. View Allure Reports
Allure results are automatically generated in `allure-results/` and timestamped HTML reports are saved in `allure-reports/` upon test execution completion.

- **Open the Latest Allure Report (Recommended):**
  Opens the most recent timestamped report in `allure-reports/` (or `allure-report/`):
  ```bash
  npm run allure:open
  ```

- **Generate and Serve Live Report directly from `allure-results`:**
  ```bash
  npm run allure:serve
  # or
  npx allure serve allure-results
  ```

- **Generate Static Allure Report:**
  ```bash
  npm run allure:generate
  # or
  npx allure generate allure-results --clean -o allure-report
  ```

- **Open a Specific Static Report Manually:**
  ```bash
  npx allure open allure-report
  # or for a specific timestamped report:
  npx allure open allure-reports/<report_folder_name>
  ```

### 3. Inspect Failure Traces
Inspect step-by-step DOM snapshots and network logs for a failed test:
```bash
npx playwright show-trace test-results/<path-to-trace.zip>
```

---

## ⚡ Quick NPM Scripts Reference

| NPM Script | Command | Purpose |
|---|---|---|
| `npm run test:headless` | `cross-env HEADLESS=true npx playwright test` | Run all tests in headless mode (1920x1080) |
| `npm run test:headed` | `cross-env HEADLESS=false npx playwright test` | Run all tests in maximized UI/headed mode |
| `npm run test:failed:headless` | `cross-env HEADLESS=true npx playwright test --last-failed` | Re-run failed tests headlessly |
| `npm run test:failed:headed` | `cross-env HEADLESS=false npx playwright test --last-failed` | Re-run failed tests in headed mode |
| `npm run test:smoke` | `cross-env HEADLESS=false npx playwright test --grep @smoke` | Run all `@smoke` test cases in maximized UI/headed mode |
| `npm run test:smoke:headless` | `cross-env HEADLESS=true npx playwright test --grep @smoke` | Run all `@smoke` test cases in headless mode |
| `npm run test:ui` | `npx playwright test --ui` | Launch Playwright Interactive UI dashboard |
| `npm run test:debug` | `npx playwright test --debug` | Run tests with Playwright Inspector |
| `npm run allure:open` | `node scripts/open-latest-allure.js` | Open the latest generated Allure report in browser |
| `npm run allure:serve` | `allure serve allure-results` | Serve live Allure report from raw results |
| `npm run allure:generate` | `allure generate allure-results --clean -o allure-report` | Compile results to static Allure HTML report |

---

## 🛠️ Framework Utilities & Helpers (`utils/`)

The framework includes built-in helper modules located in `utils/` for handling complex automation tasks:

- **`BasePage.js`**: Core page object wrapper providing robust click, fill, dropdown selection, wait utilities, and table interaction methods.
- **`EmailHelper.js`**: Built on `imapflow` and `mailparser` to programmatically connect to IMAP mailboxes, search emails, and extract OTPs / password reset links.
- **`PdfHelper.js`**: Utilizes `pdf-to-img` to convert and verify PDF reports and roster downloads.
- **`ExcelHelper.js`**: Reads and parses data from downloaded or fixture Excel sheets.
- **`TestDataGenerator.js`**: Generates unique dynamic test data (names, emails, phone numbers, timestamps, addresses) for isolated test runs.
- **`global-setup.js`**: Runs before tests begin to cleanly clear previous Allure raw results.
- **`global-teardown.js`**: Runs after all tests finish to compile a timestamped Allure HTML report in `allure-reports/` and launch it in the default browser.

---

## 📁 Project Structure

```text
ClientPlaywrightFramework/
├── config/                      # Global environment configurations & base URLs (config.js)
├── pages/                       # Page Object Models (POM)
│   ├── AdminApplication/           # Admin portal pages (Scheduling, Billing, Classroom, etc.)
│   ├── OnlineEnrollmentApplication/ # Public enrollment flows (Adult, Teen, RT, WT)
│   ├── StaffApplication/           # Staff portal pages (Attendance, Evaluations, Home)
│   └── StudentApplication/         # Student portal pages (Login, Profile, Password Reset)
├── scripts/                     # Helper automation scripts
│   └── open-latest-allure.js       # Finds and launches the most recent Allure report
├── test-data/                   # JSON fixtures and test assets (logins, student data, images)
├── tests/                       # Test specifications grouped by application module
│   ├── AdminApplication/           # Admin portal test specs
│   ├── OnlineEnrollmentApplication/ # Online enrollment test specs
│   ├── StaffApplication/           # Staff portal test specs
│   └── StudentApplication/         # Student portal test specs
├── utils/                       # Framework helpers & global hooks
│   ├── BasePage.js                 # Reusable Playwright interaction methods
│   ├── EmailHelper.js              # IMAP email extraction & OTP verification
│   ├── ExcelHelper.js              # Excel parsing utility
│   ├── PdfHelper.js                # PDF verification & conversion utility
│   ├── TestDataGenerator.js        # Dynamic test data generator
│   ├── global-setup.js             # Pre-test run setup & report cleanup
│   └── global-teardown.js          # Post-test report generation & auto-open
├── allure-reports/              # Timestamped Allure HTML reports (report_YYYY-MM-DD_HH-mm-ss)
├── allure-results/              # Raw Allure execution result files
├── screenshots/                 # Captured test screenshots
├── playwright-report/           # Generated Playwright HTML test reports
├── test-results/                # Execution artifacts (traces, error logs)
├── playwright.config.js         # Global Playwright configuration
└── package.json                 # NPM package scripts and dependencies
```