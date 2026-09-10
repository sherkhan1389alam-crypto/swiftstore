import fs from 'fs';
let code = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');

// Header Logo update
const headerLogoReplacement = `
              <Link to="/" className="flex items-center gap-2">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.storeName || 'SwiftStore'} className="h-8 md:h-10 object-contain" />
                ) : (
                  <>
                    <div className="w-8 h-8 md:w-9 md:h-9 bg-[#0b382d] rounded flex items-center justify-center text-white font-bold text-xl leading-none">
                      S
                    </div>
                    <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">
                      {settings?.storeName || 'SwiftStore'}
                    </span>
                  </>
                )}
              </Link>
`;

code = code.replace(
  /<Link to="\/" className="flex items-center gap-2">\s*<div className="w-8 h-8 md:w-9 md:h-9 bg-\[#0b382d\] rounded flex items-center justify-center text-white font-bold text-xl leading-none">\s*S\s*<\/div>\s*<span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">\s*SwiftStore\s*<\/span>\s*<\/Link>/,
  headerLogoReplacement
);

// Mobile Menu Logo update
const mobileMenuLogoReplacement = `
              <Link to="/" className="flex items-center gap-2">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.storeName || 'SwiftStore'} className="h-8 object-contain" />
                ) : (
                  <>
                    <div className="w-8 h-8 bg-[#0b382d] rounded flex items-center justify-center text-white font-bold text-lg leading-none">S</div>
                    <span className="text-xl font-extrabold tracking-tight text-slate-900">{settings?.storeName || 'SwiftStore'}</span>
                  </>
                )}
              </Link>
`;

code = code.replace(
  /<Link to="\/" className="flex items-center gap-2">\s*<div className="w-8 h-8 bg-\[#0b382d\] rounded flex items-center justify-center text-white font-bold text-lg leading-none">S<\/div>\s*<span className="text-xl font-extrabold tracking-tight text-slate-900">SwiftStore<\/span>\s*<\/Link>/,
  mobileMenuLogoReplacement
);

// Footer Logo update
const footerLogoReplacement = `
              <Link to="/" className="flex items-center gap-2 mb-6">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.storeName || 'SwiftStore'} className="h-8 md:h-10 object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" />
                ) : (
                  <>
                    <div className="w-8 h-8 bg-[#0b382d] rounded flex items-center justify-center text-white font-bold text-xl leading-none">
                      S
                    </div>
                    <span className="text-2xl font-extrabold tracking-tight text-slate-900">
                      {settings?.storeName || 'SwiftStore'}
                    </span>
                  </>
                )}
              </Link>
`;

code = code.replace(
  /<Link to="\/" className="flex items-center gap-2 mb-6">\s*<div className="w-8 h-8 bg-\[#0b382d\] rounded flex items-center justify-center text-white font-bold text-xl leading-none">\s*S\s*<\/div>\s*<span className="text-2xl font-extrabold tracking-tight text-slate-900">\s*SwiftStore\s*<\/span>\s*<\/Link>/,
  footerLogoReplacement
);

fs.writeFileSync('src/layouts/StoreLayout.tsx', code);
