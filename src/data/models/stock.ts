import type { Product } from './product';

export interface Stock {
  productId: Product['id'];
  warehouse: string;
  quantity: number;
}
