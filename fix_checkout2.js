import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Checkout.tsx', 'utf8');
code = code.replace(
  /paymentStatus: paymentMethod === 'ONLINE' \? 'PAID' : 'COD_PENDING',/,
  ""
);
fs.writeFileSync('src/pages/store/Checkout.tsx', code);
