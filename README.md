# Playwright Automation Framework

End-to-end test automation framework built using [Playwright](https://playwright.dev/) and JavaScript, structured around the **Page Object Model (POM)** pattern.

---

## 🚀 Complete Setup Guide (From Scratch)

Follow these steps if you are setting up this project on a brand-new computer:

### Step 1: Install Git
- **Check if already installed:**
  ```bash
  git --version
  ```
- **If not installed, install via:**
  - **macOS:** Open Terminal and run:
    ```bash
    xcode-select --install
    ```
  - **Windows:** Download and install Git from [git-scm.com](https://git-scm.com/download/win).
  - **Linux (Ubuntu/Debian):**
    ```bash
    sudo apt update && sudo apt install git -y
    ```

### Step 2: Install Node.js & NPM
- **Check if already installed:**
  ```bash
  node -v
  npm -v
  ```
- **If not installed, install via:**
  - Download and install **Node.js (LTS v18 or v20+)** from [nodejs.org](https://nodejs.org/).
  - **Important (Windows):** Close and reopen your terminal / VS Code after installing Node.js and Git to reload the system `PATH`.

### Step 3 (Optional for Allure Reports): Install Java (JDK 8+)
- *Allure HTML reporting requires Java runtime (JDK/JRE).*
- **Check if already installed:**
  ```bash
  java -version
  ```
- **If not installed, install via:**
  - **Windows:** Download and install OpenJDK from [oracle.com](https://www.oracle.com/java/technologies/downloads/).
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

### 1. Whole Batch (Parallel Execution)

Runs all test cases in parallel using available CPU workers:

| Mode | Universal Command (Default: Server 2) | With Specific Environment (e.g. Staging) | NPM Shortcut |
|---|---|---|---|
| **Headless (1920x1080)** | `npx cross-env HEADLESS=true npx playwright test` | `npx cross-env ENV=staging HEADLESS=true npx playwright test` | `npm run test:headless` |
| **UI / Headed (Full Screen)** | `npx cross-env HEADLESS=false npx playwright test` | `npx cross-env ENV=staging HEADLESS=false npx playwright test` | `npm run test:headed` |

---

### 2. Whole Batch (One-by-One / Sequential Execution)

Runs all test cases **sequentially one by one** using a single worker (`--workers=1`):

| Mode | Universal Command (Default: Server 2) | With Specific Environment (e.g. Staging) | NPM Shortcut |
|---|---|---|---|
| **Headless (1920x1080)** | `npx cross-env HEADLESS=true npx playwright test --workers=1` | `npx cross-env ENV=staging HEADLESS=true npx playwright test --workers=1` | `npm run test:batch:headless` |
| **UI / Headed (Full Screen)** | `npx cross-env HEADLESS=false npx playwright test --workers=1` | `npx cross-env ENV=staging HEADLESS=false npx playwright test --workers=1` | `npm run test:batch:headed` |

---

### 3. Last Failed (Re-run Only Failed Tests)

| Mode | Universal Command (Default: Server 2) | With Specific Environment | NPM Shortcut |
|---|---|---|---|
| **Headless (1920x1080)** | `npx cross-env HEADLESS=true npx playwright test --last-failed` | `npx cross-env ENV=uat HEADLESS=true npx playwright test --last-failed` | `npm run test:failed:headless` |
| **UI / Headed (Full Screen)** | `npx cross-env HEADLESS=false npx playwright test --last-failed` | `npx cross-env ENV=uat HEADLESS=false npx playwright test --last-failed` | `npm run test:failed:headed` |

---

### 4. Specific Test Case (Single File)

| Mode | Universal Command (Default: Server 2) | With Specific Environment (e.g. Core Server 1) |
|---|---|---|
| **Headless (1920x1080)** | `npx cross-env HEADLESS=true npx playwright test tests/AdminApplication/TC_022_VerifyClassroomList.spec.js` | `npx cross-env ENV=coreServer1 HEADLESS=true npx playwright test tests/AdminApplication/TC_022_VerifyClassroomList.spec.js` |
| **UI / Headed (Full Screen)** | `npx cross-env HEADLESS=false npx playwright test tests/AdminApplication/TC_022_VerifyClassroomList.spec.js` | `npx cross-env ENV=coreServer1 HEADLESS=false npx playwright test tests/AdminApplication/TC_022_VerifyClassroomList.spec.js` |

---

### 5. By Folder / Module (e.g., `AdminApplication`, `StaffApplication`, `StudentApplication`)

| Mode | Universal Command (Default: Server 2) | With Specific Environment |
|---|---|---|
| **Headless (1920x1080)** | `npx cross-env HEADLESS=true npx playwright test tests/AdminApplication/` | `npx cross-env ENV=staging HEADLESS=true npx playwright test tests/AdminApplication/` |
| **UI / Headed (Full Screen)** | `npx cross-env HEADLESS=false npx playwright test tests/AdminApplication/` | `npx cross-env ENV=staging HEADLESS=false npx playwright test tests/AdminApplication/` |
| **One-by-One (Headed)** | `npx cross-env HEADLESS=false npx playwright test tests/AdminApplication/ --workers=1` | `npx cross-env ENV=staging HEADLESS=false npx playwright test tests/AdminApplication/ --workers=1` |

---

### 6. Smoke Test Suite (`@smoke`)

Run only smoke-tagged tests across modules without needing separate folders:

| Mode | Universal Command (Default: Server 2) | With Specific Environment | NPM Shortcut |
|---|---|---|---|
| **Headless (1920x1080)** | `npx cross-env HEADLESS=true npx playwright test --grep @smoke` | `npx cross-env ENV=staging HEADLESS=true npx playwright test --grep @smoke` | `npm run test:smoke:headless` |
| **UI / Headed (Full Screen)** | `npx cross-env HEADLESS=false npx playwright test --grep @smoke` | `npx cross-env ENV=staging HEADLESS=false npx playwright test --grep @smoke` | `npm run test:smoke` |
| **One-by-One (Headed)** | `npx cross-env HEADLESS=false npx playwright test --grep @smoke --workers=1` | `npx cross-env ENV=staging HEADLESS=false npx playwright test --grep @smoke --workers=1` | — |

---

### 7. Interactive UI Dashboard & Debugger

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

## ☁️ Running Tests via GitHub Actions (CI/CD)

The framework includes an on-demand workflow ([`.github/workflows/playwright.yml`](.github/workflows/playwright.yml)) that runs tests in headless **1920x1080 desktop resolution** on GitHub's cloud runners and sends an automated Allure execution report via email.

### How to Trigger a Run on GitHub:
1. Open the repository on GitHub in your browser.
2. Click the **Actions** tab in the top navigation bar.
3. In the left sidebar under *Workflows*, select **`Playwright Tests (Main)`**.
4. Click the **"Run workflow"** button on the right.
5. Configure your execution options:
   - **Branch:** Select `main`.
   - **Environment:** Select the target environment (`coreServer2` [default], `coreServer1`, `uat`, or `staging`).
   - **Tag or pattern to filter tests (`grep`):** 
     - Leave blank to run all tests.
     - Or enter a tag/title to filter (e.g. `@smoke`, `@reportCenter`, or `TC_022`).
   - **Recipient email(s) (`recipients`):**
     - Defaults to team members: `diksha.gupta@netsmartz.com`, `abhishek.gautam@netsmartz.net`, `manpreet.lamba@netsmartz.com`, `jitesh.bhardwaj@netsmartz.com`, `manjit.kumar@netsmartz.com`.
     - Or modify/add custom comma-separated emails.
6. Click the green **"Run workflow"** button to start execution.

### What Happens After Execution:
- The entire run executes in the cloud without using your local machine resources.
- Playwright HTML and Allure results are uploaded as build artifacts.
- An email notification is sent to the specified recipients containing:
  - Status summary badge (**PASSED** / **FAILED**).
  - Test count breakdown table (**Total**, **Passed**, **Failed**, **Skipped**).
  - Direct link to the GitHub Actions Run and Artifacts.
  - Attached **`Allure-Report.zip`** (extract and double-click `index.html` to view the interactive Allure report).

### 🌅 Daily Scheduled Regression:
A dedicated scheduled workflow ([`.github/workflows/daily-servers.yml`](.github/workflows/daily-servers.yml)) runs automatically every day:
1. Executes all tests on **`coreServer2`** on a dedicated runner $\rightarrow$ generates fresh Allure report $\rightarrow$ emails report.
2. Once finished, executes all tests on **`coreServer1`** on a dedicated runner $\rightarrow$ generates fresh Allure report $\rightarrow$ emails report.
3. Once finished, executes all tests on **`uat`** on a dedicated runner $\rightarrow$ generates fresh Allure report $\rightarrow$ emails report.
4. Once finished, executes all tests on **`staging`** on a dedicated runner $\rightarrow$ generates fresh Allure report $\rightarrow$ emails report.
5. Can also be triggered manually on demand via **Actions** $\rightarrow$ **`Daily Regression (Server 2, 1, UAT & Staging)`** $\rightarrow$ **"Run workflow"**.

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
| `npm run test:headless` | `cross-env HEADLESS=true npx playwright test` | Run all tests in parallel (headless 1920x1080) |
| `npm run test:headed` | `cross-env HEADLESS=false npx playwright test` | Run all tests in parallel (maximized UI/headed) |
| `npm run test:batch:headless` | `cross-env HEADLESS=true npx playwright test --workers=1` | Run all tests **one-by-one sequentially** (headless) |
| `npm run test:batch:headed` | `cross-env HEADLESS=false npx playwright test --workers=1` | Run all tests **one-by-one sequentially** (maximized UI) |
| `npm run test:failed:headless` | `cross-env HEADLESS=true npx playwright test --last-failed` | Re-run failed tests headlessly |
| `npm run test:failed:headed` | `cross-env HEADLESS=false npx playwright test --last-failed` | Re-run failed tests in headed mode |
| `npm run test:smoke` | `cross-env HEADLESS=false npx playwright test --grep @smoke` | Run all `@smoke` test cases in maximized UI/headed mode |
| `npm run test:smoke:headless` | `cross-env HEADLESS=true npx playwright test --grep @smoke` | Run all `@smoke` test cases in headless mode |
| `npm run test:ui` | `npx playwright test --ui` | Launch Playwright Interactive UI dashboard |
| `npm run test:debug` | `npx playwright test --debug` | Run tests with Playwright Inspector |
| `npm run check` | `tsc -p jsconfig.json --noEmit` | Validate TypeScript types & syntax without emitting JS |
| `npm run lint` | `eslint tests/` | Run ESLint validation across all test specs |
| `npm run check:tags` | `node scripts/validate-spec-tags.js` | Validate module tags on all test specification files |
| `npm run allure:open` | `node scripts/open-latest-allure.js` | Open the latest generated Allure report in browser |
| `npm run allure:serve` | `allure serve allure-results` | Serve live Allure report from raw results |
| `npm run allure:generate` | `allure generate allure-results --clean -o allure-report` | Compile results to static Allure HTML report |

---

## 🛠️ Framework Utilities & Helpers (`utils/`)

The framework includes built-in helper modules located in `utils/` for handling complex automation tasks:

- **`BasePage.js`**: Core page object wrapper providing robust click, fill, dropdown selection, wait utilities, and table interaction methods.
- **`DateHelper.js`**: Date formatting, manipulation, date picker automation, and time calculation utilities.
- **`EmailHelper.js`**: Built on `imapflow` and `mailparser` to programmatically connect to IMAP mailboxes, search emails, and extract OTPs / password reset links.
- **`ExcelHelper.js`**: Reads, parses, and validates data from downloaded or fixture Excel sheets.
- **`PdfHelper.js`**: Utilizes `pdf-to-img` to convert, extract, and verify PDF reports and roster downloads.
- **`TestDataGenerator.js`**: Generates unique dynamic test data (names, emails, phone numbers, timestamps, addresses) for isolated test runs.

---

## 📜 Framework Scripts (`scripts/`)

Automation lifecycle and CI/CD utility scripts located in `scripts/`:

- **`global-setup.js`**: Runs before test execution to automatically clean stale Allure results.
- **`global-teardown.js`**: Runs after test execution finishes to generate timestamped Allure HTML reports and open them in the browser.
- **`open-latest-allure.js`**: Locates and launches the most recently generated Allure report.
- **`send-email.js`**: Compiles self-contained Allure report ZIPs, computes test metrics, and sends automated execution summary emails via Gmail SMTP.
- **`validate-spec-tags.js`**: Verifies that every spec file includes required module and suite tags for test discovery.

---

## 📁 Project Structure

```text
ClientPlaywrightFramework/
├── .github/                     # GitHub Actions CI/CD workflows
│   └── workflows/
│       ├── playwright.yml          # On-demand cloud test execution & email reporting
│       └── syntax.yml              # Automated syntax, lint, & tag validation on PR/push
├── config/                      # Global environment configurations & base URLs (config.js)
├── pages/                       # Page Object Models (POM)
│   ├── AdminApplication/           # Admin portal pages (Scheduling, Billing, Classroom, etc.)
│   ├── OnlineEnrollmentApplication/ # Public enrollment flows (Adult, Teen, RT, WT)
│   ├── StaffApplication/           # Staff portal pages (Attendance, Evaluations, Home)
│   └── StudentApplication/         # Student portal pages (Login, Profile, Password Reset)
├── scripts/                     # Framework automation & lifecycle scripts
│   ├── global-setup.js             # Pre-test run setup & report cleanup
│   ├── global-teardown.js          # Post-test report generation & auto-open
│   ├── open-latest-allure.js       # Finds and launches the most recent Allure report
│   ├── send-email.js               # Allure single-file zip builder & SMTP email sender
│   └── validate-spec-tags.js       # Validates test module tags across all spec files
├── test-data/                   # Test data directory
│   ├── json/                       # JSON fixtures (logins, student data, services, fees, etc.)
│   └── uploads/                    # Upload assets (sample images, documents, PDFs)
├── tests/                       # Test specifications grouped by application module
│   ├── AdminApplication/           # Admin portal test specs
│   ├── OnlineEnrollmentApplication/ # Online enrollment test specs
│   ├── StaffApplication/           # Staff portal test specs
│   └── StudentApplication/         # Student portal test specs
├── utils/                       # Framework helper utilities
│   ├── BasePage.js                 # Reusable Playwright interaction methods
│   ├── DateHelper.js               # Date formatting, picker, & calculation utilities
│   ├── EmailHelper.js              # IMAP email extraction & OTP verification
│   ├── ExcelHelper.js              # Excel parsing utility
│   ├── PdfHelper.js                # PDF verification & conversion utility
│   └── TestDataGenerator.js        # Dynamic test data generator
├── allure-reports/              # Timestamped Allure HTML reports (report_YYYY-MM-DD_HH-mm-ss)
├── allure-results/              # Raw Allure execution result files
├── screenshots/                 # Captured test screenshots
├── playwright-report/           # Generated Playwright HTML test reports
├── test-results/                # Execution artifacts (traces, error logs)
├── playwright.config.js         # Global Playwright configuration
└── package.json                 # NPM package scripts and dependencies
```