import { expect, test } from '../fixtures/test';

const nameSortingCases = [
  { option: 'Name (A to Z)', descending: false },
  { option: 'Name (Z to A)', descending: true },
];

const priceSortingCases = [
  { option: 'Price (low to high)', descending: false },
  { option: 'Price (high to low)', descending: true },
];

test.describe('Product sorting', () => {
  for (const { option, descending } of nameSortingCases) {
    test(`sorts products by ${option}`, async ({
      authenticatedInventoryPage: inventoryPage,
    }) => {
      await inventoryPage.sortBy(option);

      const actualNames = await inventoryPage.getProductNames();
      const expectedNames = [...actualNames].sort((first, second) =>
        first.localeCompare(second),
      );

      if (descending) {
        expectedNames.reverse();
      }

      expect(actualNames).toEqual(expectedNames);
    });
  }

  for (const { option, descending } of priceSortingCases) {
    test(`sorts products by ${option}`, async ({
      authenticatedInventoryPage: inventoryPage,
    }) => {
      await inventoryPage.sortBy(option);

      const actualPrices = await inventoryPage.getProductPrices();
      const expectedPrices = [...actualPrices].sort(
        (first, second) => first - second,
      );

      if (descending) {
        expectedPrices.reverse();
      }

      expect(actualPrices).toEqual(expectedPrices);
    });
  }
});