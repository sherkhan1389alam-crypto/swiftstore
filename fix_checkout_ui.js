import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Checkout.tsx', 'utf8');

code = code.replace(
  /const \{ items, total, clearCart \} = useCart\(\);/,
  `const { items, total: subtotal, shippingCost, finalTotal, clearCart } = useCart();`
);

code = code.replace(
  /total,/,
  `total: finalTotal,
        shippingCharge: shippingCost,`
);

code = code.replace(
  /<dd className="font-medium text-slate-900">₹\{total\}<\/dd>/,
  `<dd className="font-medium text-slate-900">₹{subtotal}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Shipping</dt>
                <dd className={shippingCost === 0 ? "text-emerald-600 font-medium" : "text-slate-900 font-medium"}>{shippingCost === 0 ? 'Free' : \`₹\${shippingCost}\`}</dd>`
);

code = code.replace(
  /<dd>₹\{total\}<\/dd>/,
  `<dd>₹{finalTotal}</dd>`
);

code = code.replace(
  /Pay ₹\$\{total\}/,
  `Pay ₹\${finalTotal}`
);

fs.writeFileSync('src/pages/store/Checkout.tsx', code);
