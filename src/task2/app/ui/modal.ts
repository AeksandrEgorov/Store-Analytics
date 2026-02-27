// Minimal modal manager, for all modal forms, containers in project

export interface ModalOptions {
  title?: string;
  onClose?: () => void;
}

export interface ModalControls {
  open(content: Node, opts?: ModalOptions): void;
  close(): void;
  isOpen(): boolean;
}

export function createModal(mount: HTMLElement): ModalControls {
  let overlay: HTMLDivElement | null = null;
  let lastFocused: HTMLElement | null = null;
  let onCloseCb: (() => void) | undefined;

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') close();
  };

  const close = () => {
    if (!overlay) return;

    overlay.remove();
    overlay = null;

    window.removeEventListener('keydown', onKeyDown);
    document.body.classList.remove('overflow-hidden');

    onCloseCb?.();
    onCloseCb = undefined;

    lastFocused?.focus();
    lastFocused = null;

    mount.innerHTML = '';
  };

  const open: ModalControls['open'] = (content, opts) => {
    // close existing modal if any
    close();

    lastFocused = document.activeElement as HTMLElement | null;
    onCloseCb = opts?.onClose;

    overlay = document.createElement('div');
    // mobile-height responsive
    overlay.className =
      'position-fixed top-0 start-0 w-100 h-100 d-flex align-items-start justify-content-center p-3';
    overlay.style.background = 'rgba(0,0,0,0.5)';
    overlay.style.zIndex = '1050';

    const dialog = document.createElement('div');
    dialog.className = 'bg-white rounded-3 shadow w-100 d-flex flex-column';
    dialog.style.maxWidth = '720px';
    dialog.style.maxHeight = 'calc(100vh - 2rem)';
    dialog.setAttribute('role', 'dialog');
    dialog.setAttribute('aria-modal', 'true');

    const header = document.createElement('div');
    header.className =
      'd-flex align-items-center justify-content-between border-bottom p-3 flex-shrink-0';

    const title = document.createElement('h3');
    title.className = 'h5 mb-0';
    title.textContent = opts?.title ?? 'Modal';

    const btnClose = document.createElement('button');
    btnClose.className = 'btn btn-sm btn-outline-secondary';
    btnClose.type = 'button';
    btnClose.textContent = 'Close';

    header.append(title, btnClose);

    const body = document.createElement('div');
    // internal scrolling in form
    body.className = 'p-3 overflow-auto';
    body.append(content);

    dialog.append(header, body);
    overlay.append(dialog);

    // mount into ui.modalRoot
    mount.innerHTML = '';
    mount.append(overlay);

    // behavior
    document.body.classList.add('overflow-hidden');
    window.addEventListener('keydown', onKeyDown);

    btnClose.addEventListener('click', close);
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) close();
    });

    btnClose.focus();
  };

  return {
    open,
    close,
    isOpen: () => overlay !== null,
  };
}