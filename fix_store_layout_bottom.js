import fs from 'fs';
let code = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');

code = code.replace(
  '<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-40 ">',
  '<div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-40" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>'
);

fs.writeFileSync('src/layouts/StoreLayout.tsx', code);
