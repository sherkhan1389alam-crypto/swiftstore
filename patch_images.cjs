const fs = require('fs');

function replaceCover(file, targetStr, replaceStr) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(targetStr, replaceStr);
  fs.writeFileSync(file, content);
}

replaceCover('src/pages/store/Shop.tsx', /object-cover/g, 'object-contain bg-slate-50');
replaceCover('src/pages/store/CategoryProducts.tsx', /object-cover/g, 'object-contain bg-slate-50');
replaceCover('src/pages/store/ProductDetails.tsx', /object-cover/g, 'object-contain bg-slate-50');

// In Home.tsx, we want to replace object-cover for products, but leave it for banners and categories if needed.
let home = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');
// Find product image
home = home.replace(/className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"/g, 'className="w-full h-full object-contain bg-slate-50 object-center group-hover:scale-105 transition-transform duration-700 ease-out"');
fs.writeFileSync('src/pages/store/Home.tsx', home);

