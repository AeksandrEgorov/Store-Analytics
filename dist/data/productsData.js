export const suppliers = [
    { id: 'SUP-NORDIC', name: 'Nordic Devices' },
    { id: 'SUP-EURO', name: 'Euro Accessories' },
    { id: 'SUP-BALTIC', name: 'Baltic Books' },
];
export const products = [
    {
        id: 'LAP-DEL-XPS15',
        name: 'Dell XPS 15',
        category: 'Electronics',
        supplierId: 'SUP-NORDIC',
        price: 1299.99,
        specs: { cpu: 'Intel i7', ram: 16, storage: 512, weight: 1.8 },
    },
    {
        id: 'ACC-LOG-MX3',
        name: 'Logitech MX Master 3S',
        category: 'Accessories',
        supplierId: 'SUP-EURO',
        price: 99.5,
    },
    {
        id: 'BOOK-TS-BASICS',
        name: 'TypeScript for Beginners',
        category: 'Books',
        supplierId: 'SUP-BALTIC',
        price: 39.9,
        specs: { pages: 320, language: 'EN' },
    },
    {
        id: 'ACC-USB-C-HUB',
        name: 'USB-C Hub 8-in-1',
        category: 'Accessories',
        supplierId: 'SUP-EURO',
        price: 59.0,
        specs: { ports: 8, usbVersion: 'USB 3.2' },
    },
];
export const stock = [
    { productId: 'LAP-DEL-XPS15', warehouse: 'Tallinn', quantity: 2 },
    { productId: 'LAP-DEL-XPS15', warehouse: 'Tartu', quantity: 1 },
    { productId: 'ACC-LOG-MX3', warehouse: 'Tallinn', quantity: 6 },
    { productId: 'ACC-LOG-MX3', warehouse: 'Tartu', quantity: 3 },
    { productId: 'BOOK-TS-BASICS', warehouse: 'Tallinn', quantity: 1 },
    { productId: 'ACC-USB-C-HUB', warehouse: 'Tallinn', quantity: 0 },
    { productId: 'ACC-USB-C-HUB', warehouse: 'Tartu', quantity: 0 },
];
export const reviews = [
    { productId: 'LAP-DEL-XPS15', rating: 5 },
    { productId: 'LAP-DEL-XPS15', rating: 4 },
    { productId: 'ACC-LOG-MX3', rating: 5 },
    { productId: 'ACC-LOG-MX3', rating: 4.5 },
    { productId: 'ACC-LOG-MX3', rating: 4.5 },
    { productId: 'BOOK-TS-BASICS', rating: 3 },
];
export const discount = [
    { category: 'Electronics', percent: 0.1, minRating: 4.5 },
    { category: 'Accessories', percent: 0.15 },
    { category: 'Books', percent: 0.05 },
];
