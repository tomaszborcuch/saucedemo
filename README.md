# SauceDemo tests

A small Playwright project covering the main user flows in SauceDemo.

## Setup

```bash
npm install
npx playwright install chromium firefox
```

## Running tests

Run all tests:

```bash
npm test
```

Run tests in one browser:

```bash
npm run test:chromium
npm run test:firefox
```

Open the HTML report:

```bash
npm run test:report
```

To run the tests against another environment, set `BASE_URL`:

```powershell
$env:BASE_URL = "https://www.saucedemo.com"
npm test
```

## Covered scenarios

- successful and unsuccessful login,
- session after page reload,
- product sorting,
- adding and removing products from the cart,
- full checkout flow.

## Project approach

The project uses Page Object Model to keep selectors and page actions outside the tests. Custom Playwright fixtures handle shared setup, including login, without repeating it in every test.

Tests run in parallel in Chromium and Firefox. Test data is kept separately from test logic.