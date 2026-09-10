import fs from 'fs';
let code = fs.readFileSync('src/lib/types.ts', 'utf8');

code = code.replace(
  "hasVariants?: boolean;",
  "hasVariants?: boolean;\n  variants?: { name: string; options: string[] }[];"
);

code = code.replace(
  "interface CartItem extends Product {\n  quantity: number;\n}",
  "interface CartItem extends Product {\n  quantity: number;\n  selectedVariants?: Record<string, string>;\n  cartItemId?: string;\n}"
);

fs.writeFileSync('src/lib/types.ts', code);
