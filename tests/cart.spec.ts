import { expect, test } from '../fixtures/test';
import { products } from '../test-data/products';

const selectedProducts = [
  products.bikeLight,
  products.fleeceJacket,
];

test.describe('Products and cart', () => {
  test('adds one product and updates the cart badge', async ({
    authenticatedInventoryPage: inventoryPage,
  }) => {
    await inventoryPage.addProductToCart(products.bikeLight);

    await expect(inventoryPage.cartBadge).toHaveText('1');
  });

  test('preserves product data after adding multiple products', async ({
    authenticatedInventoryPage: inventoryPage,
    cartPage,
  }) => {
    const expectedProducts: { name: string; price: string }[] = [];

    for (const productName of selectedProducts) {
      expectedProducts.push({
        name: productName,
        price: await inventoryPage.getProductPrice(productName),
      });

      await inventoryPage.addProductToCart(productName);
    }

    await expect(inventoryPage.cartBadge).toHaveText('2');
    await inventoryPage.openCart();
    await expect(cartPage.contents).toBeVisible();

    const actualNames = await cartPage.getProductNames();

    expect(actualNames).toHaveLength(expectedProducts.length);
    expect(actualNames).toEqual(
      expect.arrayContaining(selectedProducts),
    );

    for (const { name, price } of expectedProducts) {
      await expect(cartPage.productCard(name)).toBeVisible();
      expect(await cartPage.getProductPrice(name)).toBe(price);
    }
  });

  test('removes a product from the cart', async ({
    authenticatedInventoryPage: inventoryPage,
    cartPage,
  }) => {
    await inventoryPage.addProductToCart(products.bikeLight);
    await inventoryPage.openCart();

    await cartPage.removeProduct(products.bikeLight);

    await expect(cartPage.productCard(products.bikeLight)).toHaveCount(0);
    await expect(cartPage.cartBadge).toHaveCount(0);
  });
});
