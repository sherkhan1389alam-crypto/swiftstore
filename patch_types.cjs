const fs = require('fs');
let content = fs.readFileSync('src/lib/types.ts', 'utf8');
content = content.replace("export interface Product {", "export interface Product {\n  slug?: string;");
fs.writeFileSync('src/lib/types.ts', content);
