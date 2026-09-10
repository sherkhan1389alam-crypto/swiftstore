import fs from 'fs';
let code = fs.readFileSync('src/lib/settingsContext.tsx', 'utf8');

if (!code.includes('logoUrl?: string;')) {
  code = code.replace(
    "storeName?: string;",
    "storeName?: string;\n  logoUrl?: string;"
  );
  if (!code.includes('storeName?: string;')) { // in case storeName isn't there yet
      code = code.replace(
        "announcementText: string;",
        "storeName?: string;\n  logoUrl?: string;\n  announcementText: string;"
      );
  }
  fs.writeFileSync('src/lib/settingsContext.tsx', code);
}
