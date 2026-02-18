import type { Category } from './category';

export interface Discount {
  category: Category;
  percent: number;
  minRating?: number;
}