import fs from 'fs';

let content = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');
content = content.replace(
  /<section className="bg-white border-t border-slate-100">\s*<HomeReviews \/>\s*<\/section>/,
  '{/* Reviews section removed to match requested structure */}'
);
fs.writeFileSync('src/pages/store/Home.tsx', content);
