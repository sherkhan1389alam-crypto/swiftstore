import fs from 'fs';
let code = fs.readFileSync('src/lib/types.ts', 'utf8');

if (!code.includes('isFeatured?: boolean')) {
  code = code.replace(
    "categoryId: string;",
    "categoryId: string;\n  isFeatured?: boolean;\n  isNewArrival?: boolean;\n  isBestSeller?: boolean;"
  );
  fs.writeFileSync('src/lib/types.ts', code);
}
