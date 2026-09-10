import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Checkout.tsx', 'utf8');

code = code.replace(
  /const \{ items, total: subtotal: finalTotal,[^=]+ = useCart\(\);/,
  `const { items, total: subtotal, shippingCost, finalTotal, clearCart } = useCart();`
);

// also fix orderData total
code = code.replace(
  /otherCost: i\.otherCost\n        \}\)\),\n        total,\n        status: 'NEW',/,
  `otherCost: i.otherCost\n        })),\n        total: finalTotal,\n        shippingCharge: shippingCost,\n        status: 'NEW',`
);

fs.writeFileSync('src/pages/store/Checkout.tsx', code);
