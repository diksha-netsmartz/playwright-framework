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
- Download and install **Node.js (LTS v18 or higher)** from [nodejs.org](https://nodejs.org/).
- Verify installation by opening a terminal and checking versions:
  ```bash
  node -v
  npm -v
  ```

### Step 3: Clone the Repository
```bash
git clone https://github.com/diksha-netsmartz/playwright-framework.git
cd playwright-framework
```

### Step 4: Install Project Dependencies
```bash
npm install
```

### Step 5: Install Playwright Browsers & OS Dependencies
```bash
npx playwright install --with-deps
```

### Step 6: Verify Installation
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

### 5. Interactive UI Dashboard

Playwright's interactive runner with live DOM inspection, time travel, and watch mode:
```bash
npx playwright test --ui
```

---

## 📊 Viewing Test Reports & Traces

### 1. View Playwright HTML Report
The HTML report opens automatically after execution, but can also be opened manually:
```bash
npx playwright show-report
```

### 2. View Allure Reports
Allure results are automatically generated in `allure-results/` during every test execution.

- **Generate and open Allure HTML Report in one step (Live Server):**
  ```bash
  npm run allure:serve
  # or
  npx allure serve allure-results
  ```

- **Generate static Allure Report folder:**
  ```bash
  npm run allure:generate
  # or
  npx allure generate allure-results --clean -o allure-report
  ```

- **Open previously generated static Allure Report:**
  ```bash
  npm run allure:open
  # or
  npx allure open allure-report
  ```

### 3. Inspect Failure Traces
Inspect step-by-step DOM snapshots and network logs for a failed test:
```bash
npx playwright show-trace test-results/<path-to-trace.zip>
```

---

## 📁 Project Structure

```text
ClientPlaywrightFramework/
├── config/                  # Global environment variables and base URLs
├── pages/                   # Page Object Models
│   ├── AdminApplication/       # Admin portal pages (Scheduling, Billing, Classroom, etc.)
│   ├── OnlineEnrollmentApplication/ # Public enrollment flows (Adult, Teen, etc.)
│   ├── StaffApplication/       # Staff portal pages (Attendance, Evaluations, Home)
│   └── StudentApplication/     # Student portal pages (Login, Profile, Password Reset)
├── test-data/               # JSON fixtures and test assets
├── tests/                   # Test specifications grouped by module
├── screenshots/             # Captured screenshots
├── playwright-report/       # Generated HTML test reports
├── test-results/            # Execution artifacts (traces, error logs)
├── playwright.config.js     # Global Playwright configuration
└── package.json             # NPM package scripts and dependencies
```