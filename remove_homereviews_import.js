import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Home.tsx', 'utf8');
code = code.replace("import HomeReviews from '../../components/HomeReviews';\n", "");
fs.writeFileSync('src/pages/store/Home.tsx', code);
