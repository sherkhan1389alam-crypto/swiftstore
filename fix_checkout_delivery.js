import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Checkout.tsx', 'utf8');

if (!code.includes('import { useSettings }')) {
  code = code.replace(
    /import \{ useAuth \} from '\.\.\/\.\.\/contexts\/AuthContext';/,
    `import { useAuth } from '../../contexts/AuthContext';\nimport { useSettings } from '../../lib/settingsContext';`
  );
}

if (!code.includes('const { settings } = useSettings();')) {
  code = code.replace(
    /const \{ currentUser \} = useAuth\(\);/,
    `const { currentUser } = useAuth();\n  const { settings } = useSettings();`
  );
}

if (!code.includes('expectedDeliveryDate')) {
  code = code.replace(
    /createdAt: Date.now\(\)/,
    `createdAt: Date.now(),
        expectedDeliveryDate: Date.now() + ((settings?.shippingSettings?.processingDays || 1) + (settings?.shippingSettings?.maxDeliveryDays || 5)) * 24 * 60 * 60 * 1000`
  );
}

// In the replacement for checkout_ui, total was incorrectly replaced. 
// "total: finalTotal,\n        shippingCharge: shippingCost," but there is also a "total," in orderData. Wait, I did that.
// Let's make sure `total,` is fixed. Wait, my previous replacement was `/total,/` which might have replaced the first occurrence.
// Let's check `src/pages/store/Checkout.tsx`.

fs.writeFileSync('src/pages/store/Checkout.tsx', code);
