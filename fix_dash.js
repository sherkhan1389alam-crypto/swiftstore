import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

code = code.replace(/p\.stock !== undefined && p\.stock <= \(p\.stock \|\| 5\)/, 'p.stock !== undefined && p.stock <= (p.lowStockThreshold || 5)');

fs.writeFileSync('src/pages/admin/Dashboard.tsx', code);
