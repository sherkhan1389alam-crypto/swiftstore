import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Cart.tsx', 'utf8');

code = code.replace(
  /const \{ items: cart, removeFromCart, updateQuantity, total: totalAmount \} = useCart\(\);/,
  `const { items: cart, removeFromCart, updateQuantity, total: subtotal, shippingCost, finalTotal } = useCart();`
);

code = code.replace(
  /<span className="text-slate-900 font-bold">₹\{totalAmount\}<\/span>/,
  `<span className="text-slate-900 font-bold">₹{subtotal}</span>`
);

code = code.replace(
  /<span className="text-emerald-600 font-bold">Free<\/span>/,
  `<span className={shippingCost === 0 ? "text-emerald-600 font-bold" : "text-slate-900 font-bold"}>{shippingCost === 0 ? "Free" : \`₹\${shippingCost}\`}</span>`
);

code = code.replace(
  /<span className="font-extrabold text-slate-900 text-2xl">₹\{totalAmount\}<\/span>/,
  `<span className="font-extrabold text-slate-900 text-2xl">₹{finalTotal}</span>`
);

fs.writeFileSync('src/pages/store/Cart.tsx', code);
