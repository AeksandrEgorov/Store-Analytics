# Store Analytics — Task 1

## Description
Console application written in TypeScript that prints a Store Analytics report.

The report includes:
- products
- suppliers
- stock per warehouse
- reviews
- discounts

The output is formatted according to lecturers example in task 1.

---

## Project Structure

index.html
src/
  data/
    models/
      category.ts
      discount.ts
      products.ts
      review.ts
      stock.ts
      supplier.ts
    productsData.ts
  task1/
    main.ts
dist/

---

## Requirements
- Node.js (LTS recommended)
- npm
- TypeScript

---

## How to run (Task 1)

1) Install dependencies  
npm install --global typescript

2) Compile TypeScript  
npx tsc

3) Run the console app  
node dist/task1/main.js in visual studio code
or
open index.html -> inspect element -> console

---

## Example Output

Products:

 - Dell XPS 15 [LAP-DEL-XPS15] | Electronics | supplier: Nordic Devices | available: 3 (IN_STOCK) | rating: 4.50 | specs: cpu=Intel i7, ram=16, storage=512, weight=1.8 | price: 1299.99 -> 1169.99
 - Logitech MX Master 3S [ACC-LOG-MX3] | Accessories | supplier: Euro Accessories | available: 9 (IN_STOCK) | rating: 4.67 | price: 99.50 -> 84.58
 - TypeScript for Beginners [BOOK-TS-BASICS] | Books | supplier: Baltic Books | available: 1 (LOW) | rating: 3.00 | specs: pages=320, language=EN | price: 39.90
 - USB-C Hub 8-in-1 [ACC-USB-C-HUB] | Accessories | supplier: Euro Accessories | available: 0 (OUT) | rating: no reviews | specs: ports=8, usbVersion=USB 3.2 | price: 59.00 -> 50.15

---

## Implemented Rules

Stock status:
0 -> OUT  
1..2 -> LOW  
3+ -> IN_STOCK  

Average rating:
no reviews -> "no reviews"  
with reviews -> average rating with 2 decimals  

Discount:
- applied by category
- optional minRating
- format: price: X -> Y

Specifications:
- printed as: specs: key=value, key=value
- not printed if missing

---

## Notes
- All data is stored in src/data/productsData.ts
- Interfaces and types are defined in src/data/models/
- Task 1 entry point is src/task1/main.ts
