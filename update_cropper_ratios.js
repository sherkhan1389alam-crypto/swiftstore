import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/HeroBanners.tsx', 'utf8');

code = code.replace(
  "aspectRatio={cropTarget === 'DESKTOP' ? 21/9 : cropTarget === 'TABLET' ? 16/9 : 4/5}",
  "aspectRatio={cropTarget === 'DESKTOP' ? 21/9 : cropTarget === 'TABLET' ? 4/3 : 9/16}"
);

code = code.replace(
  "aspectClass = 'aspect-video';",
  "aspectClass = 'aspect-[4/3]';"
);

code = code.replace(
  "aspectClass = 'aspect-[4/5]';",
  "aspectClass = 'aspect-[9/16]';"
);

fs.writeFileSync('src/pages/admin/HeroBanners.tsx', code);
