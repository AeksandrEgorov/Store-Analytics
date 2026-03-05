import type { Product } from '../../../data/models/product';
import type { Stock } from '../../../data/models/stock';

export type SortValue =
  | 'default'
  | 'name_asc'
  | 'name_desc'
  | 'price_asc'
  | 'price_desc'
  | 'avail_asc'
  | 'avail_desc';

export type StockStatus = 'IN_STOCK' | 'LOW_STOCK' | 'OUT_OF_STOCK';

interface State {
  products: Product[];
  stock: Stock[];
  search: string;
  sort: SortValue;
}

const LOW_STOCK_THRESHOLD = 5;

const state: State = {
  products: [],
  stock: [],
  search: '',
  sort: 'default',
};

// all logic related to products/stock/search/sort
export const productService = {
  init(products: Product[], stock: Stock[]) {
    state.products = structuredClone(products);
    state.stock = structuredClone(stock);
    state.search = '';
    state.sort = 'default';
  },

  setSearch(query: string) {
    state.search = query.trim().toLowerCase();
  },

  setSort(sort: SortValue) {
    state.sort = sort;
  },

  hasProductId(id: string): boolean {
    const norm = id.trim().toLowerCase();
    return state.products.some(p => p.id.trim().toLowerCase() === norm);
  },

  addProduct(product: Product, initialStock?: { warehouse: string; quantity: number }) {
    if (this.hasProductId(product.id)) {
      throw new Error(`Duplicate product id: ${product.id}`);
    }
    state.products.push(product);
    if (initialStock) {
      state.stock.push({
        productId: product.id,
        warehouse: initialStock.warehouse,
        quantity: initialStock.quantity,
      });
    }
  },

  getAllProducts(): Product[] {
    return structuredClone(state.products);
  },

  getAllStock(): Stock[] {
    return structuredClone(state.stock);
  },

  getTotalAvailable(productId: string): number {
    return state.stock
      .filter((s) => s.productId === productId)
      .reduce((sum, s) => sum + s.quantity, 0);
  },

  getStockStatus(productId: string): StockStatus {
    const total = this.getTotalAvailable(productId);
    if (total <= 0) return 'OUT_OF_STOCK';
    if (total <= LOW_STOCK_THRESHOLD) return 'LOW_STOCK';
    return 'IN_STOCK';
  },

  getVisibleProducts(): Product[] {
    let list = [...state.products];

    if (state.search) {
      const q = state.search;
      list = list.filter(
        (p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
      );
    }

    switch (state.sort) {
      case 'name_asc':
        list.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name_desc':
        list.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'price_asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'avail_asc':
        list.sort((a, b) => this.getTotalAvailable(a.id) - this.getTotalAvailable(b.id));
        break;
      case 'avail_desc':
        list.sort((a, b) => this.getTotalAvailable(b.id) - this.getTotalAvailable(a.id));
        break;
      default:
        break;
    }

    return list;
  },
};