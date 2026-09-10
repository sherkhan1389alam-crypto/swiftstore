import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Checkout.tsx', 'utf8');

code = code.replace(
  /status: 'NEW',/,
  `status: 'NEW',\n        statusHistory: [{ status: 'NEW', date: Date.now(), note: 'Order placed by customer' }],`
);

fs.writeFileSync('src/pages/store/Checkout.tsx', code);
