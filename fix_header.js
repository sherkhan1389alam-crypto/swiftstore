import fs from 'fs';
let code = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');

// Replace the main header logo section
const mainLogoRegex = /<Link to="\/" className="flex items-center gap-2">\s*\{settings\?\.logoUrl \? \(\s*<img src=\{settings\.logoUrl\} alt=\{settings\.storeName \|\| 'SwiftStore'\} className="h-8 md:h-10 object-contain" \/>\s*\) : \(\s*<>\s*<div className="w-8 h-8 md:w-9 md:h-9 bg-\[#0b382d\] rounded flex items-center justify-center text-white font-bold text-xl leading-none">\s*S\s*<\/div>\s*<span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900">\s*\{settings\?\.storeName \|\| 'SwiftStore'\}\s*<\/span>\s*<\/>\s*\)\}\s*<\/Link>/g;

const mainLogoReplacement = `<Link to="/" className="flex items-center gap-2">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.storeName || 'SwiftStore'} className="h-8 md:h-10 object-contain max-w-[120px]" />
                ) : (
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-[#0b382d] rounded flex items-center justify-center text-white font-bold text-xl leading-none flex-shrink-0">
                    {(settings?.storeName || 'SwiftStore').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap hidden sm:block">
                  {settings?.storeName || 'SwiftStore'}
                </span>
                <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap block sm:hidden">
                  {settings?.storeName || 'SwiftStore'}
                </span>
              </Link>`;

code = code.replace(mainLogoRegex, mainLogoReplacement);

// Mobile Menu Logo
const mobileLogoRegex = /<Link to="\/" className="flex items-center gap-2">\s*\{settings\?\.logoUrl \? \(\s*<img src=\{settings\.logoUrl\} alt=\{settings\.storeName \|\| 'SwiftStore'\} className="h-8 object-contain" \/>\s*\) : \(\s*<>\s*<div className="w-8 h-8 bg-\[#0b382d\] rounded flex items-center justify-center text-white font-bold text-lg leading-none">S<\/div>\s*<span className="text-xl font-extrabold tracking-tight text-slate-900">\{settings\?\.storeName \|\| 'SwiftStore'\}<\/span>\s*<\/>\s*\)\}\s*<\/Link>/g;

const mobileLogoReplacement = `<Link to="/" className="flex items-center gap-2">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.storeName || 'SwiftStore'} className="h-8 object-contain max-w-[100px]" />
                ) : (
                  <div className="w-8 h-8 bg-[#0b382d] rounded flex items-center justify-center text-white font-bold text-lg leading-none flex-shrink-0">
                    {(settings?.storeName || 'SwiftStore').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                  {settings?.storeName || 'SwiftStore'}
                </span>
              </Link>`;

code = code.replace(mobileLogoRegex, mobileLogoReplacement);

// Footer Logo
const footerLogoRegex = /<Link to="\/" className="flex items-center gap-2 mb-6">\s*\{settings\?\.logoUrl \? \(\s*<img src=\{settings\.logoUrl\} alt=\{settings\.storeName \|\| 'SwiftStore'\} className="h-8 md:h-10 object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all" \/>\s*\) : \(\s*<>\s*<div className="w-8 h-8 bg-\[#0b382d\] rounded flex items-center justify-center text-white font-bold text-xl leading-none">\s*S\s*<\/div>\s*<span className="text-2xl font-extrabold tracking-tight text-slate-900">\s*\{settings\?\.storeName \|\| 'SwiftStore'\}\s*<\/span>\s*<\/>\s*\)\}\s*<\/Link>/g;

const footerLogoReplacement = `<Link to="/" className="flex items-center gap-2 mb-6">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.storeName || 'SwiftStore'} className="h-8 md:h-10 object-contain grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all max-w-[120px]" />
                ) : (
                  <div className="w-8 h-8 bg-[#0b382d] rounded flex items-center justify-center text-white font-bold text-xl leading-none flex-shrink-0">
                    {(settings?.storeName || 'SwiftStore').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">
                  {settings?.storeName || 'SwiftStore'}
                </span>
              </Link>`;

code = code.replace(footerLogoRegex, footerLogoReplacement);

fs.writeFileSync('src/layouts/StoreLayout.tsx', code);
