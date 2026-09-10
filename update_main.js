import fs from 'fs';
let code = fs.readFileSync('src/main.tsx', 'utf8');

if (!code.includes('SettingsProvider')) {
  code = code.replace(
    "import { CartProvider } from './contexts/CartContext.tsx';",
    "import { CartProvider } from './contexts/CartContext.tsx';\nimport { SettingsProvider } from './lib/settingsContext.tsx';"
  );
  
  code = code.replace(
    "<CartProvider>",
    "<SettingsProvider>\n      <CartProvider>"
  );
  
  code = code.replace(
    "</CartProvider>",
    "</CartProvider>\n      </SettingsProvider>"
  );
  
  fs.writeFileSync('src/main.tsx', code);
}
