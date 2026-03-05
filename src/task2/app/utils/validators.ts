// validate/controll all form inputs for add/edit product

import type { Product, Specs } from '../../../data/models/product';
import type { Category } from '../../../data/models/category';
import type { Supplier } from '../../../data/models/supplier';

export type ValidationResult<T> =
  | { ok: true; value: T }
  | { ok: false; message: string; field?: string };

export interface AddProductInput {
  id: string;
  name: string;
  category: Category | '';
  supplierId: string;
  price: string | number; 
  specsRaw?: string;
  initialWarehouse?: string;
  initialQuantity?: string | number;
}

export interface AddProductValidated {
  product: Product;
  initialStock?: { warehouse: string; quantity: number };
}

// all checks for input values
export function isNonEmptyString(v: unknown): v is string {
  return typeof v === 'string' && v.trim().length > 0;
}

export function parseNumber(v: string | number): number | null {
  const n = typeof v === 'number' ? v : Number(String(v).trim());
  return Number.isFinite(n) ? n : null;
}

export function parseIntSafe(v: string | number): number | null {
  const n = parseNumber(v);
  if (n === null) return null;
  if (!Number.isInteger(n)) return null;
  return n;
}

export function normalizeId(id: string): string {
  return id.trim();
}

export function isDuplicateProductId(existing: Product[], id: string): boolean {
  const norm = normalizeId(id).toLowerCase();
  return existing.some((p) => p.id.trim().toLowerCase() === norm);
}

// specs json
export function parseSpecs(specsRaw?: string): ValidationResult<Specs | undefined> {
  const raw = (specsRaw ?? '').trim();
  if (!raw) return { ok: true, value: undefined };

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    return { ok: false, message: 'Specs JSON is invalid. Example: {"ram":16,"cpu":"Intel i7"}', field: 'specs' };
  }

  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    return { ok: false, message: 'Specs must be a JSON object, e.g. {"ram":16}.', field: 'specs' };
  }

  const obj = parsed as Record<string, unknown>;
  const out: Record<string, string | number> = {};

  for (const [k, v] of Object.entries(obj)) {
    if (!k.trim()) {
      return { ok: false, message: 'Specs keys must be non-empty strings.', field: 'specs' };
    }
    if (typeof v === 'string') out[k] = v;
    else if (typeof v === 'number' && Number.isFinite(v)) out[k] = v;
    else {
      return {
        ok: false,
        message: `Specs value for "${k}" must be a string or number.`,
        field: 'specs',
      };
    }
  }

  return { ok: true, value: out };
}

// validate add product form inputs
export function validateAddProduct(
  input: AddProductInput,
  ctx: {
    existingProducts: Product[];
    suppliers: Supplier[];
    categories?: Category[];
  }
): ValidationResult<AddProductValidated> {
  const id = normalizeId(input.id);
  if (!isNonEmptyString(id)) return { ok: false, message: 'Product ID is required.', field: 'id' };

  if (isDuplicateProductId(ctx.existingProducts, id)) {
    return { ok: false, message: `Product with ID "${id}" already exists.`, field: 'id' };
  }

  const name = (input.name ?? '').trim();
  if (!isNonEmptyString(name)) return { ok: false, message: 'Name is required.', field: 'name' };

  const category = input.category as Category | '';
  if (!isNonEmptyString(category)) return { ok: false, message: 'Category is required.', field: 'category' };
  if (ctx.categories && !ctx.categories.includes(category as Category)) {
    return { ok: false, message: 'Category is not valid.', field: 'category' };
  }

  const supplierId = (input.supplierId ?? '').trim();
  if (!isNonEmptyString(supplierId)) return { ok: false, message: 'Supplier is required.', field: 'supplierId' };
  if (!ctx.suppliers.some((s) => s.id === supplierId)) {
    return { ok: false, message: 'Supplier does not exist.', field: 'supplierId' };
  }

  const priceNum = parseNumber(input.price);
  if (priceNum === null || priceNum < 0) {
    return { ok: false, message: 'Price must be a number ≥ 0.', field: 'price' };
  }

  const specsRes = parseSpecs(input.specsRaw);
  if (!specsRes.ok) return specsRes;

  // optional initial stock
  const wh = (input.initialWarehouse ?? '').trim();
  const qtyRaw = input.initialQuantity;

  let initialStock: { warehouse: string; quantity: number } | undefined;

  const qtyProvided = qtyRaw !== undefined && String(qtyRaw).trim() !== '';
  const whProvided = wh.length > 0;

  if (whProvided !== qtyProvided) {
    return {
      ok: false,
      message: 'If warehouse is set, quantity is required (and vice versa).',
      field: 'initialStock',
    };
  }

  if (whProvided && qtyProvided) {
    const qty = parseIntSafe(qtyRaw as any);
    if (qty === null || qty < 0) {
      return { ok: false, message: 'Quantity must be an integer ≥ 0.', field: 'initialQuantity' };
    }
    initialStock = { warehouse: wh, quantity: qty };
  }

  const product: Product = {
    id,
    name,
    category: category as Category,
    supplierId,
    price: priceNum,
    ...(specsRes.value ? { specs: specsRes.value } : {}),
  };

  return { ok: true, value: { product, ...(initialStock ? { initialStock } : {}) } };
}

// edit product ID validation for future
export function validateEditProductId(
  existingProducts: Product[],
  nextId: string,
  currentId: string
): ValidationResult<string> {
  const id = normalizeId(nextId);
  if (!isNonEmptyString(id)) return { ok: false, message: 'Product ID is required.', field: 'id' };

  const normNext = id.toLowerCase();
  const normCurrent = normalizeId(currentId).toLowerCase();

  const dup = existingProducts.some((p) => p.id.trim().toLowerCase() === normNext && p.id.trim().toLowerCase() !== normCurrent);
  if (dup) return { ok: false, message: `Product with ID "${id}" already exists.`, field: 'id' };

  return { ok: true, value: id };
}