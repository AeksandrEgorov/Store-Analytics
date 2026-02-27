// load all main controllers/view helpers/models/data

import { initUI } from './app/ui/dom.js';
import { bindEvents } from './app/ui/events.js';

import { suppliers, stock } from '../data/productsData.js';
import type { Category } from '../data/models/category';

const root = document.getElementById('app');
if (!root) throw new Error('Root #app not found');

const ui = initUI(root);

const categories: Category[] = ['Electronics', 'Accessories', 'Books'];

const warehouses = Array.from(new Set(stock.map((s) => s.warehouse)));

bindEvents(
  ui,
  {
    onAddProduct: (payload) => {
      console.log('Add product:', payload);
      // localstorage with productData.ts data will be added
    },
    onSearchChange: (q) => console.log('Search:', q),
    onSortChange: (s) => console.log('Sort:', s),
    onListVisibilityChange: (visible) => console.log('List visible:', visible),
  },
  { categories, suppliers, warehouses }
);