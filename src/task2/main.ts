import { initUI } from './app/ui/dom.js';

const root = document.getElementById('app');
if (!root) throw new Error('Root #app not found');

initUI(root);