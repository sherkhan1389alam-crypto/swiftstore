import fs from 'fs';
let code = fs.readFileSync('src/contexts/CartContext.tsx', 'utf8');

if (!code.includes('import { useSettings }')) {
  code = code.replace(
    /import { Product } from '\.\.\/lib\/types';/,
    `import { Product } from '../lib/types';\nimport { useSettings } from '../lib/settingsContext';`
  );
}

if (!code.includes('shippingCost: number;')) {
  code = code.replace(
    /total: number;/,
    `total: number;\n  shippingCost: number;\n  finalTotal: number;`
  );
}

if (!code.includes('const { settings } = useSettings();')) {
  code = code.replace(
    /const \[items, setItems\] = useState<CartItem\[\]>\(\(\) => \{/,
    `const { settings } = useSettings();\n  const [items, setItems] = useState<CartItem[]>(() => {`
  );
}

if (!code.includes('const finalTotal =')) {
  code = code.replace(
    /const total = items.reduce[^\n]+;\n/,
    `const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let shippingCost = 0;
  if (settings?.shippingSettings?.enabled) {
    if (!settings.shippingSettings.freeShippingEnabled || total < (settings.shippingSettings.freeShippingThreshold || 999)) {
      shippingCost = settings.shippingSettings.flatShippingCharge || 79;
    }
  }
  
  const finalTotal = total + shippingCost;
\n`
  );
}

if (!code.includes('total, shippingCost, finalTotal')) {
  code = code.replace(
    /value=\{\{ items, addToCart, removeFromCart, updateQuantity, clearCart, total \}\}/,
    `value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, shippingCost, finalTotal }}`
  );
}

fs.writeFileSync('src/contexts/CartContext.tsx', code);
