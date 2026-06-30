import { type Locator, type Page } from '@playwright/test';

export class InventoryPage {
  readonly menuButton: Locator;
  readonly sortDropdown: Locator;
  readonly productCards: Locator;
  readonly productNames: Locator;
  readonly productPrices: Locator;
  readonly cartLink: Locator;
  readonly cartBadge: Locator;

  constructor(private readonly page: Page) {
    this.menuButton = page.getByRole('button', { name: 'Open Menu' });
    this.sortDropdown = page.getByTestId('product-sort-container');
    this.productCards = page.getByTestId('inventory-item');
    this.productNames = page.getByTestId('inventory-item-name');
    this.productPrices = page.getByTestId('inventory-item-price');
    this.cartLink = page.getByTestId('shopping-cart-link');
    this.cartBadge = page.getByTestId('shopping-cart-badge');
  }

  async sortBy(option: string): Promise<void> {
    await this.sortDropdown.selectOption({ label: option });
  }

  async getProductNames(): Promise<string[]> {
    return this.productNames.allInnerTexts();
  }

  async getProductPrices(): Promise<number[]> {
    const prices = await this.productPrices.allInnerTexts();

    return prices.map((price) => Number(price.replace('$', '')));
  }

  async addProductToCart(productName: string): Promise<void> {
    const productCard = this.getProductCard(productName);

    await productCard.getByRole('button', { name: 'Add to cart' }).click();
  }

  async getProductPrice(productName: string): Promise<string> {
    return this.getProductCard(productName)
      .getByTestId('inventory-item-price')
      .innerText();
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }

  private getProductCard(productName: string): Locator {
    return this.productCards.filter({
      has: this.page
        .getByTestId('inventory-item-name')
        .filter({ hasText: productName }),
    });
  }
}