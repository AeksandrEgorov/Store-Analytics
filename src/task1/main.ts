import { products, stock, reviews, suppliers, discount } from '../data/productsData.js';

type StockStatus = 'OUT' | 'LOW' | 'IN_STOCK';

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
function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

function getAverageRating(productId: string): number | null {
  const rs = reviews.filter(r => r.productId === productId);
  if (rs.length === 0) return null;

  const avg = rs.reduce((sum, r) => sum + r.rating, 0) / rs.length;
  return round2(avg);
}

function formatRating(avg: number | null): string {
  return avg === null ? 'no reviews' : avg.toFixed(2);
}

console.log('Products:\n');

for (const p of products) {
  const available = getAvailable(p.id);
  const status = getStockStatus(available);
  const avg = getAverageRating(p.id);

  console.log(
    `- ${p.name} [${p.id}] | available: ${available} (${status}) | rating: ${formatRating(avg)}`
  );
}