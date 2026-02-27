// events.ts connects every component with dom
import type { Task2UI } from './dom.js';
import { buildAddProductForm } from './dom.js';
import { createModal } from './modal.js';

import type { Category } from '../../../data/models/category.js';
import type { Supplier } from '../../../data/models/supplier.js';
import type { Product } from '../../../data/models/product.js';

export type SortValue =
  | 'default'
  | 'name_asc'
  | 'name_desc'
  | 'price_asc'
  | 'price_desc'
  | 'avail_asc'
  | 'avail_desc';

export interface EventsHandlers {
  onAddProduct?: (payload: {
    product: Product;
    initialStock?: { warehouse: string; quantity: number };
  }) => void;

  onSearchChange?: (query: string) => void;
  onSortChange?: (sort: SortValue) => void;
  onListVisibilityChange?: (isVisible: boolean) => void;
}

export interface EventsDeps {
  categories: Category[];
  suppliers: Supplier[];
  warehouses: string[];
}

// show/hide list
function setListVisible(ui: Task2UI, visible: boolean): void {
  ui.listSection.classList.toggle('d-none', !visible);
  ui.btnToggleList.textContent = visible ? 'Hide list' : 'Show list';
  ui.btnToggleList.setAttribute('aria-pressed', String(visible));
}

export function bindEvents(ui: Task2UI, handlers: EventsHandlers = {}, deps: EventsDeps): void {
  let isListVisible = true;
  setListVisible(ui, isListVisible);

  const modal = createModal(ui.modalRoot);

  ui.btnToggleList.addEventListener('click', () => {
    isListVisible = !isListVisible;
    setListVisible(ui, isListVisible);
    handlers.onListVisibilityChange?.(isListVisible);
  });

  // add product, build form
  ui.btnOpenAdd.addEventListener('click', () => {
    const form = buildAddProductForm({
      categories: deps.categories,
      suppliers: deps.suppliers,
      warehouses: deps.warehouses,
      onCancel: () => modal.close(),
      onSubmit: (payload) => {
        handlers.onAddProduct?.(payload);
        modal.close();
      },
    });

    modal.open(form, {
      title: 'Add product',
      onClose: () => ui.btnOpenAdd.focus(),
    });
  });

  // search 
  let searchTimer: number | undefined;
  ui.searchInput.addEventListener('input', () => {
    if (searchTimer) window.clearTimeout(searchTimer);
    searchTimer = window.setTimeout(() => {
      handlers.onSearchChange?.(ui.searchInput.value.trim());
    }, 150);
  });

  // sort
  ui.sortSelect.addEventListener('change', () => {
    handlers.onSortChange?.(ui.sortSelect.value as SortValue);
  });
}