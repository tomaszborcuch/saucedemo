import { test, expect } from '../fixtures/test';
import { users } from '../test-data/users';

const inventoryUrl = /\/inventory\.html$/;

test.describe('Authentication', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('standard user can log in', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(users.standard);

    await expect(page).toHaveURL(inventoryUrl);
    await expect(inventoryPage.menuButton).toBeVisible();
  });

  test('locked user sees an error', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut);

    await expect(loginPage.errorMessage).toHaveText(
      'Epic sadface: Sorry, this user has been locked out.',
    );
    await expect(loginPage.loginButton).toBeVisible();
  });

  test('session remains active after reload', async ({
    page,
    loginPage,
    inventoryPage,
  }) => {
    await loginPage.login(users.standard);
    await expect(page).toHaveURL(inventoryUrl);

    await page.reload();

    await expect(page).toHaveURL(inventoryUrl);
    await expect(inventoryPage.menuButton).toBeVisible();
  });
});