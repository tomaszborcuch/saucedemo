import { test as base, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';
import { users } from '../test-data/users';

type AppFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
  authenticatedInventoryPage: InventoryPage;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },

  authenticatedInventoryPage: async (
    { loginPage, inventoryPage },
    use,
  ) => {
    await loginPage.goto();
    await loginPage.login(users.standard);
    await inventoryPage.menuButton.waitFor({ state: 'visible' });

    await use(inventoryPage);
  },
});

export { expect };