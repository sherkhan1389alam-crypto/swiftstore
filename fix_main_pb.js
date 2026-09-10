import fs from 'fs';
let code = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');

code = code.replace(
  '<main className="flex-1 flex flex-col w-full">',
  '<main className="flex-1 flex flex-col w-full pb-16 md:pb-0">'
);

fs.writeFileSync('src/layouts/StoreLayout.tsx', code);
