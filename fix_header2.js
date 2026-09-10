import fs from 'fs';
let code = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');

const regex = /<span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap hidden sm:block">\s*\{settings\?\.storeName \|\| 'SwiftStore'\}\s*<\/span>\s*<span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap block sm:hidden">\s*\{settings\?\.storeName \|\| 'SwiftStore'\}\s*<\/span>/g;
const repl = `<span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap truncate max-w-[150px] sm:max-w-none">
                  {settings?.storeName || 'SwiftStore'}
                </span>`;
code = code.replace(regex, repl);
fs.writeFileSync('src/layouts/StoreLayout.tsx', code);
