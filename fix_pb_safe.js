import fs from 'fs';
let code = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');
code = code.replace("pb-safe", "");
code = code.replace('z-40 pb-safe">', 'z-40" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>');
fs.writeFileSync('src/layouts/StoreLayout.tsx', code);
