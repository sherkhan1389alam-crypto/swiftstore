import fs from 'fs';
let code = fs.readFileSync('src/lib/types.ts', 'utf8');

if (!code.includes('specifications?:')) {
  code = code.replace(
    "isBestSeller?: boolean;",
    "isBestSeller?: boolean;\n  specifications?: string;\n  hasVariants?: boolean;"
  );
  fs.writeFileSync('src/lib/types.ts', code);
}
