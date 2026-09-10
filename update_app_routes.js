import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes('import Branding from')) {
  code = code.replace(
    "import AdminCategories from './pages/admin/Categories';",
    "import AdminCategories from './pages/admin/Categories';\nimport Branding from './pages/admin/Branding';"
  );
  
  code = code.replace(
    "<Route path=\"categories\" element={<AdminCategories />} />",
    "<Route path=\"categories\" element={<AdminCategories />} />\n          <Route path=\"branding\" element={<Branding />} />"
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
