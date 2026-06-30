import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly menuButton: Locator;

  constructor(page: Page) {
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
  }
}