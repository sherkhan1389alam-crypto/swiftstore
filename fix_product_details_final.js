import fs from 'fs';
let code = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');

// I will look for `<p className="text-slate-600 leading-relaxed font-medium text-[15px] mb-8">`
// and see how it's closed in the original vs now.
let idx = code.indexOf('<p className="text-slate-600 leading-relaxed font-medium text-[15px] mb-8">');
if (idx !== -1) {
  let sub = code.substring(idx, idx + 2000);
  console.log(sub);
}
