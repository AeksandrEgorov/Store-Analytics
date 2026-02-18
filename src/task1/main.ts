import { Discount } from '../data/models/discount.js';
import { Product } from '../data/models/product.js';
import { products, stock, reviews, suppliers, discounts } from '../data/productsData.js';

type StockStatus = 'OUT' | 'LOW' | 'IN_STOCK';

const round2 = (num: number): number => Math.round((num+Number.EPSILON) * 100) / 100;
const f2 = (num: number): string => round2(num).toFixed(2);

function getAvailable(productId: string): number {
  return stock
    .filter(s => s.productId === productId)
    .reduce((sum, s) => sum + s.quantity, 0);
}

//stock status
function getStockStatus(available: number): StockStatus {
  if (available === 0) return 'OUT';
  if (available <= 2) return 'LOW';
  return 'IN_STOCK';
}

//average rating
function getAverageRating(productId: string): number | null {
  const rs = reviews.filter(r => r.productId === productId);
  if (rs.length === 0) return null;

  const avg = rs.reduce((sum, r) => sum + r.rating, 0) / rs.length;
  return round2(avg);
}

function formatRating(avg: number | null): string {
  return avg === null ? 'no reviews' : avg.toFixed(2);
}

//supplier
function getSupplierName(supplierId: string): string {
  return suppliers.find(s => s.id === supplierId)?.name ?? 'Unknown supplier';
}

//discount
function getDiscount(category: Product['category']): Discount | undefined {
  return discounts.find(d => d.category === category);
}

function applyDiscount(discount : Discount | undefined, avg: number | null): boolean {
  if(!discount) return false;
  if (discount.minRating === undefined) return true;
  if (avg === null) return false;
  return avg >= discount.minRating;
}

function formatPrice(product: Product, avg: number | null): string {
  const discount = getDiscount(product.category);
  const original = f2(product.price);
  if (!applyDiscount(discount, avg)) {
    return `price: ${original}`;
  }

  const discounted = f2(product.price * (1 - discount!.percent));
  return `price: ${original} -> discount: ${discounted}`;
}

//specs
function formatSpecs(product: Product): string {
  if (!product.specs) return '';
  const pairs = Object.entries(product.specs).map(([k, v]) => `${k}=${v}`);
  return ` specs: ${pairs.join(', ') } | `;
}

//output
console.log('Products:\n');

for (const product of products) {
  const supplierName = getSupplierName(product.supplierId);
  const available = getAvailable(product.id);
  const status = getStockStatus(available);
  const avg = getAverageRating(product.id);
  const ratingText = formatRating(avg);
  const priceText = formatPrice(product, avg);
  const specsPart = product.specs ? ` specs: ${Object.entries(product.specs).map(([k, v]) => `${k}=${v}`).join(', ')} |` : '';

  console.log(
    ` - ${product.name} [${product.id}] | ${product.category} | supplier: ${supplierName} | ` + 
    `available: ${available} (${status}) | rating: ${ratingText} |` +
    specsPart + ` ${priceText}`
  );
}