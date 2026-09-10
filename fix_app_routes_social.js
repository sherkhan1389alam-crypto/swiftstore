import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import SocialMedia from './pages/admin/SocialMedia';")) {
  code = code.replace(
    "import Support from './pages/admin/Support';",
    "import Support from './pages/admin/Support';\nimport SocialMedia from './pages/admin/SocialMedia';"
  );
}

if (!code.includes("<Route path=\"social\" element={<SocialMedia />} />")) {
  code = code.replace(
    /<Route path="support" element=\{<Support \/>\} \/>/,
    "<Route path=\"support\" element={<Support />} />\n            <Route path=\"social\" element={<SocialMedia />} />"
  );
}

fs.writeFileSync('src/App.tsx', code);
