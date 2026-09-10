import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/AdminLogin.tsx', 'utf8');

if (!code.includes('useSettings')) {
  code = code.replace(
    "import { LogIn, Lock } from 'lucide-react';",
    "import { LogIn, Lock } from 'lucide-react';\nimport { useSettings } from '../../lib/settingsContext';"
  );
  
  code = code.replace(
    "const [loading, setLoading] = useState(false);",
    "const [loading, setLoading] = useState(false);\n  const { settings } = useSettings();"
  );
  
  const logoBlock = `
          {settings?.logoUrl ? (
            <img src={settings.logoUrl} alt="Store Logo" className="mx-auto h-16 object-contain mb-6" />
          ) : (
            <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">
              <Lock className="h-8 w-8 text-indigo-600" />
            </div>
          )}
  `;
  
  code = code.replace(
    /<div className="mx-auto w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mb-6">\s*<Lock className="h-8 w-8 text-indigo-600" \/>\s*<\/div>/,
    logoBlock
  );
  
  fs.writeFileSync('src/pages/admin/AdminLogin.tsx', code);
}
