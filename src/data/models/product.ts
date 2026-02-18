import type { Category } from './category';

export type Specs = Record<string, string | number>;

export interface Product {
  id: string;
  name: string;
  category: Category;
  supplierId: string;
  price: number;
  specs?: Specs;
}
