import fs from 'fs';
let code = fs.readFileSync('src/pages/store/Login.tsx', 'utf8');

if (!code.includes('useSettings')) {
  code = code.replace(
    "import { LogIn } from 'lucide-react';",
    "import { LogIn } from 'lucide-react';\nimport { useSettings } from '../../lib/settingsContext';"
  );
  code = code.replace(
    "const navigate = useNavigate();",
    "const navigate = useNavigate();\n  const { settings } = useSettings();"
  );
  
  const newLogoBlock = `
        {settings?.logoUrl ? (
          <img src={settings.logoUrl} alt={settings.storeName || 'Store Logo'} className="mx-auto h-16 object-contain mb-6" />
        ) : (
          <div className="mx-auto w-12 h-12 bg-[#0b382d] rounded-full flex items-center justify-center mb-6 text-white font-bold text-2xl">
            {(settings?.storeName || 'S').charAt(0)}
          </div>
        )}
  `;
  
  code = code.replace(
    /<div className="mx-auto w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-6">\s*<LogIn className="h-6 w-6 text-slate-600" \/>\s*<\/div>/,
    newLogoBlock
  );
  
  code = code.replace(
    "Welcome Back",
    "Welcome to {settings?.storeName || 'SwiftStore'}"
  );
  
  fs.writeFileSync('src/pages/store/Login.tsx', code);
}
