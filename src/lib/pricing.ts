import { Product } from '../types';

export const BULK_THRESHOLD = 10;
export const BULK_DISCOUNT_PERCENT = 15; // 15% off for wholesale/bulk orders

/**
 * Calculates the unit price of a product based on the selected quantity.
 * If quantity reaches the BULK_THRESHOLD (10+), a BULK_DISCOUNT_PERCENT (15%) discount is applied.
 */
export const getItemUnitPrice = (product: Product, quantity: number): number => {
  if (quantity >= BULK_THRESHOLD) {
    return Math.round(product.price * (1 - BULK_DISCOUNT_PERCENT / 100));
  }
  return product.price;
};

/**
 * Calculates the total price of an item given its product and quantity.
 */
export const getItemTotalPrice = (product: Product, quantity: number): number => {
  return getItemUnitPrice(product, quantity) * quantity;
};
