// dynamic user interface with bootstrap classes

export interface Task2UI {
  app: HTMLElement;

  headerTitle: HTMLHeadingElement;

  btnToggleList: HTMLButtonElement;
  btnOpenAdd: HTMLButtonElement;

  searchInput: HTMLInputElement;
  sortSelect: HTMLSelectElement;

  listSection: HTMLElement;
  listContainer: HTMLElement;

  modalRoot: HTMLElement; // mount point for modal.ts
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