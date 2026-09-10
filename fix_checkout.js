import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Checkout.tsx', 'utf8');
code = code.replace(
  /status: paymentMethod === 'ONLINE' \? 'PAID' : 'PROCESSING',/,
  "status: 'NEW',\n        paymentStatus: paymentMethod === 'ONLINE' ? 'PAID' : 'PENDING',"
);
fs.writeFileSync('src/pages/store/Checkout.tsx', code);
