import { test as base, expect } from '@playwright/test';
import { InventoryPage } from '../pages/InventoryPage';
import { LoginPage } from '../pages/LoginPage';

type AppFixtures = {
  loginPage: LoginPage;
  inventoryPage: InventoryPage;
};

export const test = base.extend<AppFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  inventoryPage: async ({ page }, use) => {
    await use(new InventoryPage(page));
  },
});

export { expect };