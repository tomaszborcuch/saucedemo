import { expect, test } from '../fixtures/test';
import { customer } from '../test-data/checkout';
import { products } from '../test-data/products';

const checkoutProducts = [
  products.bikeLight,
  products.fleeceJacket,
];

const cartUrl = /\/cart\.html$/;
const customerInformationUrl = /\/checkout-step-one\.html$/;
const overviewUrl = /\/checkout-step-two\.html$/;
const confirmationUrl = /\/checkout-complete\.html$/;

test.describe('End-to-end checkout', () => {
  test('completes an order from login to confirmation', async ({
    page,
    authenticatedInventoryPage: inventoryPage,
    cartPage,
    checkoutPage,
  }) => {
    for (const productName of checkoutProducts) {
      await inventoryPage.addProductToCart(productName);
    }

    await expect(inventoryPage.cartBadge).toHaveText(
      String(checkoutProducts.length),
    );

    await inventoryPage.openCart();
    await expect(page).toHaveURL(cartUrl);

    await cartPage.startCheckout();
    await expect(page).toHaveURL(customerInformationUrl);

    await checkoutPage.enterCustomerInformation(customer);
    await checkoutPage.continueToOverview();
    await expect(page).toHaveURL(overviewUrl);

    for (const productName of checkoutProducts) {
      await expect(checkoutPage.productCard(productName)).toBeVisible();
    }

    const productPrices = await Promise.all(
      checkoutProducts.map((productName) =>
        checkoutPage.getProductPrice(productName),
      ),
    );

    const subtotal = await checkoutPage.getSubtotal();
    const tax = await checkoutPage.getTax();
    const total = await checkoutPage.getTotal();
    const expectedSubtotal = productPrices.reduce(
      (sum, price) => sum + price,
      0,
    );

    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(total).toBeCloseTo(subtotal + tax, 2);

    await checkoutPage.finishOrder();

    await expect(page).toHaveURL(confirmationUrl);
    await expect(checkoutPage.completeContainer).toContainText(
      'Your order has been dispatched, and will arrive just as fast as the pony can get there!',
    );
  });
});