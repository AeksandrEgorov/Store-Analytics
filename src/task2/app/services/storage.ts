// load/save data to LocalStorage upon changes/refresh

import type { Product } from '../../../data/models/product';
import type { Stock } from '../../../data/models/stock';

const KEY = 'task2_store_state_v1';

export interface PersistedState {
  products: Product[];
  stock: Stock[];
}

export const storage = {
  save(state: PersistedState) {
    localStorage.setItem(KEY, JSON.stringify(state));
  },

  load(): PersistedState | null {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;

    try {
      const parsed = JSON.parse(raw) as PersistedState;
      if (!Array.isArray(parsed.products) || !Array.isArray(parsed.stock)) return null;
      return parsed;
    } catch {
      return null;
    }
  },

  clear() {
    localStorage.removeItem(KEY);
  },
};