import type { Product } from '../../../data/models/product';
import type { Supplier } from '../../../data/models/supplier';
import type { StockStatus } from '../services/productService.js';

// render products everytime something changes (search/sort/add)
export function renderProducts(opts: {
  container: HTMLElement;
  products: Product[];
  suppliers: Supplier[];
  getTotalAvailable: (productId: string) => number;
  getStockStatus: (productId: string) => StockStatus;
}): void {
  const { container, products, suppliers, getTotalAvailable, getStockStatus } = opts;

  container.innerHTML = '';

  if (products.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'col-12';
    empty.innerHTML = `
      <div class="alert alert-light border mb-0">
        <strong>Nothing found.</strong> Try another search or reset sorting.
      </div>
    `;
    container.append(empty);
    return;
  }

  const supplierNameById = new Map(suppliers.map((s) => [s.id, s.name]));

  // cards for each product
  for (const p of products) {
    const col = document.createElement('div');
    col.className = 'col-12 col-md-6 col-lg-4';

    const status = getStockStatus(p.id);
    const available = getTotalAvailable(p.id);

    const badgeClass =
      status === 'IN_STOCK' ? 'text-bg-success' : status === 'LOW_STOCK' ? 'text-bg-warning' : 'text-bg-danger';

    const supplierName = supplierNameById.get(p.supplierId) ?? p.supplierId;

    const card = document.createElement('div');
    card.className = 'card h-100 shadow-sm';

    const body = document.createElement('div');
    body.className = 'card-body';

    const titleRow = document.createElement('div');
    titleRow.className = 'd-flex align-items-start justify-content-between gap-2';

    const title = document.createElement('h5');
    title.className = 'card-title mb-1';
    title.textContent = p.name;

    const badge = document.createElement('span');
    badge.className = `badge ${badgeClass} flex-shrink-0`;
    badge.textContent = status.replaceAll('_', ' ');

    titleRow.append(title, badge);

    const meta = document.createElement('div');
    meta.className = 'text-muted small';
    meta.textContent = `ID: ${p.id} • Category: ${p.category}`;

    const price = document.createElement('div');
    price.className = 'mt-2';
    price.innerHTML = `<strong>€${p.price.toFixed(2)}</strong>`;

    const sub = document.createElement('div');
    sub.className = 'mt-2 small';
    sub.textContent = `Supplier: ${supplierName}`;

    const stockLine = document.createElement('div');
    stockLine.className = 'mt-2 small';
    stockLine.textContent = `Available: ${available}`;

    body.append(titleRow, meta, price, sub, stockLine);

    card.append(body);
    col.append(card);
    container.append(col);
  }
}