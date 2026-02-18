import type { Product } from './product';

export interface Review {
  productId: Product['id'];
  rating: number;
}
