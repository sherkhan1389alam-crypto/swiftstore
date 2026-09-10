import fs from 'fs';
let code = fs.readFileSync('src/App.tsx', 'utf8');

if (!code.includes("import Homepage from './pages/admin/Homepage';")) {
  code = code.replace(
    "import AdminPlaceholder from './pages/admin/AdminPlaceholder';",
    "import AdminPlaceholder from './pages/admin/AdminPlaceholder';\nimport Homepage from './pages/admin/Homepage';"
  );
  
  code = code.replace(
    '<Route path="homepage" element={<AdminPlaceholder title="Homepage Management" />} />',
    '<Route path="homepage" element={<Homepage />} />'
  );
  
  fs.writeFileSync('src/App.tsx', code);
}
