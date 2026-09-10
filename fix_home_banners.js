import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');
code = code.replace("collection(db, 'hero_banners')", "collection(db, 'heroBanners')");
fs.writeFileSync('src/pages/store/Home.tsx', code);
