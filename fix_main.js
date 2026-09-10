import fs from 'fs';
let code = fs.readFileSync('src/main.tsx', 'utf8');

code = code.replace(
  "import { CartProvider } from './contexts/CartContext.tsx';",
  "import { CartProvider } from './contexts/CartContext.tsx';\nimport { WishlistProvider } from './contexts/WishlistContext.tsx';"
);

code = code.replace(
  "<CartProvider>\n        <App />\n      </CartProvider>",
  "<CartProvider>\n        <WishlistProvider>\n          <App />\n        </WishlistProvider>\n      </CartProvider>"
);

fs.writeFileSync('src/main.tsx', code);
