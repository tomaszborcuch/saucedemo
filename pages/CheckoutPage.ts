import { type Locator, type Page } from '@playwright/test';

type CustomerInformation = {
  readonly firstName: string;
  readonly lastName: string;
  readonly postalCode: string;
};

export class CheckoutPage {
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly finishButton: Locator;
  readonly completeContainer: Locator;
  readonly productCards: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;

  constructor(private readonly page: Page) {
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.finishButton = page.getByTestId('finish');
    this.completeContainer = page.getByTestId(
      'checkout-complete-container',
    );
    this.productCards = page.getByTestId('inventory-item');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
  }

  async enterCustomerInformation(
    customerInformation: CustomerInformation,
  ): Promise<void> {
    await this.firstNameInput.fill(customerInformation.firstName);
    await this.lastNameInput.fill(customerInformation.lastName);
    await this.postalCodeInput.fill(customerInformation.postalCode);
  }

  async continueToOverview(): Promise<void> {
    await this.continueButton.click();
  }

  productCard(productName: string): Locator {
    return this.productCards.filter({
      has: this.page
        .getByTestId('inventory-item-name')
        .filter({ hasText: productName }),
    });
  }

  async getProductPrice(productName: string): Promise<number> {
    const price = this.productCard(productName).getByTestId(
      'inventory-item-price',
    );

    return this.getCurrencyValue(price);
  }

  async getSubtotal(): Promise<number> {
    return this.getCurrencyValue(this.subtotalLabel);
  }

  async getTax(): Promise<number> {
    return this.getCurrencyValue(this.taxLabel);
  }

  async getTotal(): Promise<number> {
    return this.getCurrencyValue(this.totalLabel);
  }

  async finishOrder(): Promise<void> {
    await this.finishButton.click();
  }

  private async getCurrencyValue(locator: Locator): Promise<number> {
    const text = await locator.innerText();
    const value = text.match(/\$([0-9.]+)/)?.[1];

    if (value === undefined) {
      throw new Error(`Cannot read currency value from: ${text}`);
    }

    return Number(value);
  }
}
