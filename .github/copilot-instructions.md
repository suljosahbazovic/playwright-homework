# Copilot Instructions for Playwright Homework

Write automated tests in Playwright following these guidelines:

- Follow Playwright's best practices for test structure and assertions.
- Do not add comment to each line of code
- Write only the Playwright test steps for the scenario
- Read and analyze the provided DOM contect from the browser
- Create one test at a time unless specifically asked for multiple tests
- Prioritize 'getByRole' 'getByTitle''getByText' selectors over 'locator' when possible for better readability and maintainability
- Keep test code clean and focused on the test scenario
- Don't add assortions unless asked
- For the random test data, keep it short and compact. Don't write long text.

## Build, Test, and Lint Commands

### Project Setup
```bash
npm install           # Install dependencies (required before running tests)
```

### Running Tests
```bash
npx playwright test                          # Run all tests
npx playwright test tests/homework.spec.ts   # Run a single test file
npx playwright test -g "Welcome message"     # Run tests matching a pattern
npx playwright test tests/homework.spec.ts:7 # Run specific test (line 7)
```

### Viewing Test Reports
```bash
npx playwright show-report   # Open HTML report of last test run
```

### Debug and Development
```bash
npx playwright test --debug           # Run in debug mode (opens inspector)
npx playwright test --headed          # Run with visible browser (not headless)
npx playwright test --headed -g "test name"  # Run specific test with visible browser
```

## Architecture Overview

### Authentication Flow
- **Global Setup**: `.auth/auth-setup.ts` runs once before all tests via `globalSetup` in playwright.config.ts
- **Process**: 
  1. Reads or creates `.auth/user.json` (stores session/cookies)
  2. Launches headless browser and navigates to base URL
  3. If not logged in, enters credentials from `.env` file (EMAIL, PASSWORD)
  4. Captures the Bearer token from the `/token` API response
  5. Stores token in `process.env.ACCESS_TOKEN` for subsequent requests
  6. Saves session state to `.auth/user.json` for cookie persistence

### Test Execution
- Tests use Playwright Test framework with TypeScript
- Each test has `beforeEach` hook that navigates to root URL (`/`)
- Base URL is `https://petclinic.bondaracademy.com` (set in playwright.config.ts)
- Tests run sequentially (fullyParallel: false, workers: 1)
- HTML reports generated in `playwright-report/` directory
- Trace recordings created on first retry in `test-results/` directory

### Test Configuration (playwright.config.ts)
- **Single browser**: Chromium only
- **Viewport**: 1920x1080
- **Timeouts**: 90s per test, 10s for actions
- **Headers**: Bearer token automatically added to requests via Authorization header
- **Storage**: Session state persisted in `.auth/user.json`

## Key Conventions

### Environment Configuration
- Create `.env` file (not version controlled) with:
  ```
  EMAIL='your-email@example.com'
  PASSWORD='your-password'
  ```
- Use `.env-SAMPLE` as template
- Credentials are only available locally, never committed to repo

### Writing Tests
1. Import from `@playwright/test`: `import { test, expect } from '@playwright/test'`
2. Tests automatically inherit authenticated session and baseURL
3. Use `page.goto('/')` to navigate (relative URL using baseURL)
4. Use Playwright locators: `page.getByRole()`, `page.getByTitle()`, `page.locator()`
5. Use built-in assertions: `expect(element).toHaveText()`, `toBeVisible()`, `toHaveValue()`
6. For slower tests, mark with `test.slow()`

### API Response Handling
- Use `page.waitForResponse(url)` to intercept API calls and verify behavior
- API tokens automatically included via Authorization header (set in global config)
- Responses can be parsed: `await response.json()`

### Test Structure Pattern
```typescript
import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('/')
})

test('descriptive test name', async ({ page }) => {
  // Test steps with numbered comments
  // Use page.getByRole() and page.locator() for selection
  // Use expect() for assertions
});
```

### Debugging
- Uncomment `await page.pause()` in test to pause execution and use Playwright Inspector
- Run with `--debug` flag to automatically open inspector
- Use `--headed` flag to watch browser during execution
- Traces automatically recorded on retry for failed tests

## Playwright Version
- Using `@playwright/test@^1.59.1`
- TypeScript target: ES2022