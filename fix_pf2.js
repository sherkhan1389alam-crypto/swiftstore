import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

code = code.replace(/const \[stock, setLowStockThreshold\] = useState<number \| ''>\(5\);/, 'const [lowStockThreshold, setLowStockThreshold] = useState<number | \'\'>(\'\');');
code = code.replace(/const \[hasVariants, setInventoryTracking\] = useState\(true\);/, 'const [inventoryTracking, setInventoryTracking] = useState(true);');
code = code.replace(/setLowStockThreshold\(p\.stock \|\| 5\);/, 'setLowStockThreshold(p.lowStockThreshold || 5);');
code = code.replace(/setInventoryTracking\(p\.hasVariants !== false\);/, 'setInventoryTracking(p.inventoryTracking !== false);');
code = code.replace(/stock: Number\(stock\),\n        hasVariants,/, 'lowStockThreshold: Number(lowStockThreshold),\n        inventoryTracking,');
code = code.replace(/images,\n        hasVariants,/, 'images,');

code = code.replace(/<input type="checkbox" checked=\{hasVariants\} onChange=\{e => setInventoryTracking\(e\.target\.checked\)\}/, '<input type="checkbox" checked={inventoryTracking} onChange={e => setInventoryTracking(e.target.checked)}');
code = code.replace(/\{hasVariants && !hasVariants && \(/, '{inventoryTracking && !hasVariants && (');
code = code.replace(/value=\{stock\} onChange=\{e => setLowStockThreshold/, 'value={lowStockThreshold} onChange={e => setLowStockThreshold');

fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
