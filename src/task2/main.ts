// load all main controllers/view helpers/models/data
import { initUI } from './app/ui/dom.js';
import { bindEvents } from './app/ui/events.js';
import { renderProducts } from './app/ui/render.js';

import { productService } from './app/services/productService.js';
import { storage } from './app/services/storage.js';

import { products, stock, suppliers } from '../data/productsData.js';
import type { Category } from '../data/models/category';

const root = document.getElementById('app');
if (!root) throw new Error('Root #app not found');

const ui = initUI(root);

// restore or seed data
const restored = storage.load();
if (restored) {
  productService.init(restored.products, restored.stock);
} else {
  productService.init(products, stock);
  storage.save({ products: productService.getAllProducts(), stock: productService.getAllStock() });
}

const categories: Category[] = ['Electronics', 'Accessories', 'Books'];
const warehouses = Array.from(new Set(productService.getAllStock().map((s) => s.warehouse)));

// render function to update products list 
const rerender = () => {
  renderProducts({
    container: ui.listContainer,
    products: productService.getVisibleProducts(),
    suppliers,
    getTotalAvailable: (id) => productService.getTotalAvailable(id),
    getStockStatus: (id) => productService.getStockStatus(id),
  });
};

rerender();

bindEvents(
  ui,
  {
    getExistingProducts: () => productService.getAllProducts(),

    onAddProduct: ({ product, initialStock }) => {
      try {
        productService.addProduct(product, initialStock);
        storage.save({ products: productService.getAllProducts(), stock: productService.getAllStock() });
        rerender();
      } catch (e) {
        console.error(e);
        alert(e instanceof Error ? e.message : 'Failed to add product');
      }
    },

    onSearchChange: (q) => {
      productService.setSearch(q);
      rerender();
    },

    onSortChange: (s) => {
      productService.setSort(s);
      rerender();
    },
  },
  { categories, suppliers, warehouses }
);