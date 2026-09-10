import fs from 'fs';
let code = fs.readFileSync('src/lib/types.ts', 'utf8');

if (!code.includes('lowStockThreshold?: number;')) {
  code = code.replace(
    /stock\?: number;/,
    `stock?: number;\n  lowStockThreshold?: number;\n  inventoryTracking?: boolean;`
  );
}

fs.writeFileSync('src/lib/types.ts', code);
