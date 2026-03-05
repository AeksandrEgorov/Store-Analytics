import type { Category } from '../../../data/models/category';
import type { Supplier } from '../../../data/models/supplier';
import type { Product, Specs } from '../../../data/models/product';

// dynamic user interface with bootstrap classes

import {
  validateAddProduct,
  type AddProductInput,
  type AddProductValidated,
} from '../utils/validators.js';

export interface Task2UI {
  app: HTMLElement;

  headerTitle: HTMLHeadingElement;

  btnToggleList: HTMLButtonElement;
  btnOpenAdd: HTMLButtonElement;

  searchInput: HTMLInputElement;
  sortSelect: HTMLSelectElement;

  listSection: HTMLElement;
  listContainer: HTMLElement;

  modalRoot: HTMLElement;
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  opts?: {
    className?: string;
    text?: string;
    attrs?: Record<string, string>;
  }
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  if (opts?.className) node.className = opts.className;
  if (opts?.text !== undefined) node.textContent = opts.text;
  if (opts?.attrs) {
    for (const [k, v] of Object.entries(opts.attrs)) node.setAttribute(k, v);
  }
  return node;
}

export function initUI(root: HTMLElement): Task2UI {
  // root reset
  root.innerHTML = '';
  root.classList.add('container', 'py-4');

  // header
  const header = el('header', { className: 'mb-4' });
  const headerTitle = el('h1', { className: 'h3 mb-1', text: 'Store Analytics' });
  header.append(headerTitle);

  const toolbar = el('section', { className: 'mb-3' });
  const toolbarRow = el('div', {
    className: 'd-flex flex-column flex-md-row gap-2 align-items-stretch',
  });

  // buttons
  const btnGroup = el('div', { className: 'd-flex gap-2 flex-wrap' });

  const btnToggleList = el('button', {
    className: 'btn btn-outline-primary',
    text: 'Show / Hide list',
    attrs: { type: 'button', 'aria-pressed': 'true' },
  }) as HTMLButtonElement;

  const btnOpenAdd = el('button', {
    className: 'btn btn-primary',
    text: 'Add product',
    attrs: { type: 'button' },
  }) as HTMLButtonElement;

  btnGroup.append(btnToggleList, btnOpenAdd);

  // search + sort
  const controls = el('div', {
    className: 'd-flex gap-2 flex-column flex-sm-row ms-md-auto w-100 w-md-auto',
  });

  const searchInput = el('input', {
    className: 'form-control h-50',
    attrs: {
      type: 'search',
      placeholder: 'Search by name / id',
      'aria-label': 'Search products',
    },
  }) as HTMLInputElement;

  const sortSelect = el('select', {
    className: 'form-select h-50',
    attrs: { 'aria-label': 'Sort products' },
  }) as HTMLSelectElement;

  // sort options
  sortSelect.append(
    el('option', { text: 'Sort: default', attrs: { value: 'default' } }),
    el('option', { text: 'Name (A→Z)', attrs: { value: 'name_asc' } }),
    el('option', { text: 'Name (Z→A)', attrs: { value: 'name_desc' } }),
    el('option', { text: 'Price (low→high)', attrs: { value: 'price_asc' } }),
    el('option', { text: 'Price (high→low)', attrs: { value: 'price_desc' } }),
    el('option', { text: 'Available (low→high)', attrs: { value: 'avail_asc' } }),
    el('option', { text: 'Available (high→low)', attrs: { value: 'avail_desc' } })
  );

  controls.append(searchInput, sortSelect);

  toolbarRow.append(btnGroup, controls);
  toolbar.append(toolbarRow);

  // product list
  const listSection = el('section', { className: 'mt-3' });

  const listHeader = el('div', {
    className: 'd-flex align-items-center justify-content-between mb-2',
  });
  const listTitle = el('h2', { className: 'h3 mb-0', text: 'Products' });
  const listHint = el('span', {
    className: 'text-muted small',
    text: 'Loaded from LocalStorage or default data',
  });
  listHeader.append(listTitle, listHint);

  // product cards container
  const listContainer = el('div', { className: 'row g-3' });

  listSection.append(listHeader, listContainer);

  // modal mount point
  const modalRoot = el('div', {
    className: '',
    attrs: { id: 'modal-root' },
  });

  root.append(header, toolbar, listSection, modalRoot);

  return {
    app: root,
    headerTitle,
    btnToggleList,
    btnOpenAdd,
    searchInput,
    sortSelect,
    listSection,
    listContainer,
    modalRoot,
  };
}

export function buildAddProductForm(opts: {
  categories: Category[];
  suppliers: Supplier[];
  warehouses: string[];

  getExistingProducts: () => Product[];

  onSubmit: (payload: AddProductValidated) => void;
  onCancel: () => void;
}): HTMLFormElement {
  const form = document.createElement('form');
  form.className = 'd-grid gap-3';

  const errorBox = document.createElement('div');
  errorBox.className = 'alert alert-danger py-2 mb-0 d-none';
  form.append(errorBox);

  const showError = (msg: string) => {
    errorBox.textContent = msg;
    errorBox.classList.remove('d-none');
  };
  const hideError = () => {
    errorBox.textContent = '';
    errorBox.classList.add('d-none');
  };

  const field = (labelText: string, input: HTMLElement) => {
    const wrap = document.createElement('div');
    const label = document.createElement('label');
    label.className = 'form-label';
    label.textContent = labelText;
    wrap.append(label, input);
    return wrap;
  };

  // ID
  const idInput = document.createElement('input');
  idInput.className = 'form-control';
  idInput.type = 'text';
  idInput.placeholder = 'e.g. ACC-USB-C-HUB';
  idInput.autocomplete = 'off';

  // Name
  const nameInput = document.createElement('input');
  nameInput.className = 'form-control';
  nameInput.type = 'text';
  nameInput.placeholder = 'Product name';

  // Category
  const categorySelect = document.createElement('select');
  categorySelect.className = 'form-select';
  categorySelect.append(new Option('Select category…', ''));
  for (const c of opts.categories) categorySelect.append(new Option(c, c));

  // Supplier
  const supplierSelect = document.createElement('select');
  supplierSelect.className = 'form-select';
  supplierSelect.append(new Option('Select supplier…', ''));
  for (const s of opts.suppliers) supplierSelect.append(new Option(`${s.name} (${s.id})`, s.id));

  // Price
  const priceInput = document.createElement('input');
  priceInput.className = 'form-control';
  priceInput.type = 'number';
  priceInput.step = '0.01';
  priceInput.min = '0';
  priceInput.placeholder = '0.00';

  // Specs (JSON)
  const specsInput = document.createElement('textarea');
  specsInput.className = 'form-control';
  specsInput.rows = 4;
  specsInput.placeholder = `Optional JSON (string/number values)\n{"ram":16,"cpu":"Intel i7"}`;

  // Initial stock (optional)
  const stockRow = document.createElement('div');
  stockRow.className = 'row g-2';

  const whCol = document.createElement('div');
  whCol.className = 'col-12 col-sm-7';

  const qtyCol = document.createElement('div');
  qtyCol.className = 'col-12 col-sm-5';

  const warehouseSelect = document.createElement('select');
  warehouseSelect.className = 'form-select';
  warehouseSelect.append(new Option('Warehouse (optional)…', ''));
  for (const w of opts.warehouses) warehouseSelect.append(new Option(w, w));

  const qtyInput = document.createElement('input');
  qtyInput.className = 'form-control';
  qtyInput.type = 'number';
  qtyInput.step = '1';
  qtyInput.min = '0';
  qtyInput.placeholder = 'Qty';

  whCol.append(field('Initial warehouse', warehouseSelect));
  qtyCol.append(field('Initial quantity', qtyInput));
  stockRow.append(whCol, qtyCol);

  // Buttons
  const btnRow = document.createElement('div');
  btnRow.className = 'd-flex gap-2 justify-content-end pt-2 border-top';

  const btnCancel = document.createElement('button');
  btnCancel.type = 'button';
  btnCancel.className = 'btn btn-outline-secondary';
  btnCancel.textContent = 'Cancel';

  const btnSubmit = document.createElement('button');
  btnSubmit.type = 'submit';
  btnSubmit.className = 'btn btn-primary';
  btnSubmit.textContent = 'Add product';

  btnRow.append(btnCancel, btnSubmit);

  form.append(
    field('Product ID *', idInput),
    field('Name *', nameInput),
    field('Category *', categorySelect),
    field('Supplier *', supplierSelect),
    field('Price *', priceInput),
    field('Specs (optional)', specsInput),
    stockRow,
    btnRow
  );

  btnCancel.addEventListener('click', opts.onCancel);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    const raw: AddProductInput = {
      id: idInput.value,
      name: nameInput.value,
      category: categorySelect.value as any,
      supplierId: supplierSelect.value,
      price: priceInput.value,
      specsRaw: specsInput.value,
      initialWarehouse: warehouseSelect.value,
      initialQuantity: qtyInput.value,
    };

    const res = validateAddProduct(raw, {
      existingProducts: opts.getExistingProducts(),
      suppliers: opts.suppliers,
      categories: opts.categories,
    });

    if (!res.ok) {
      showError(res.message);
      // optional: focus field
      if (res.field === 'id') idInput.focus();
      else if (res.field === 'name') nameInput.focus();
      else if (res.field === 'category') categorySelect.focus();
      else if (res.field === 'supplierId') supplierSelect.focus();
      else if (res.field === 'price') priceInput.focus();
      else if (res.field === 'specs') specsInput.focus();
      else if (res.field === 'initialQuantity') qtyInput.focus();
      return;
    }

    opts.onSubmit(res.value);
  });

  queueMicrotask(() => idInput.focus());
  return form;
}