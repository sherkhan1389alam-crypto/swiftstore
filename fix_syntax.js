import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/HeroBanners.tsx', 'utf8');

code = code.replace(
  "return (    <div>",
  "return (    <>\n    <div>"
);

fs.writeFileSync('src/pages/admin/HeroBanners.tsx', code);
