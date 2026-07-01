import { type Locator, type Page } from '@playwright/test';

export class CartPage {
  readonly contents: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly cartBadge: Locator;
  readonly checkoutButton: Locator;

  constructor(private readonly page: Page) {
    this.contents = page.getByTestId('cart-contents-container');
    this.productCards = page.getByTestId('inventory-item');
    this.productNames = page.getByTestId('inventory-item-name');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
    this.checkoutButton = page.getByTestId('checkout');
  }

  async getProductNames(): Promise<string[]> {
    return this.productNames.allInnerTexts();
  }

  async getProductPrice(productName: string): Promise<string> {
    return this.productCard(productName)
      .getByTestId('inventory-item-price')
      .innerText();
  }

  async removeProduct(productName: string): Promise<void> {
    await this.productCard(productName)
      .getByRole('button', { name: 'Remove' })
      .click();
  }

  productCard(productName: string): Locator {
    return this.productCards.filter({
      has: this.page
        .getByTestId('inventory-item-name')
        .filter({ hasText: productName }),
    });
  }

  async startCheckout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
