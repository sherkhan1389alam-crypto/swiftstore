import fs from 'fs';
let code = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');

// Add MessageCircle import
if (!code.includes('MessageCircle')) {
  code = code.replace(
    /import \{\s*ShoppingCart,\s*User,\s*Search,\s*Menu,\s*X,\s*ShieldCheck/,
    "import { ShoppingCart, User, Search, Menu, X, ShieldCheck, MessageCircle"
  );
}

// Add handleWhatsAppClick to StoreLayout
const funcRegex = /const location = useLocation\(\);/;
const whatsappFunc = `const location = useLocation();

  const handleWhatsAppClick = () => {
    const whatsapp = settings?.whatsappSupport;
    if (whatsapp?.enabled && whatsapp?.phoneNumber) {
      const fullNumber = \`\${whatsapp.countryCode}\${whatsapp.phoneNumber}\`;
      const encodedMessage = encodeURIComponent(whatsapp.defaultMessage || 'Hello, I need help.');
      window.open(\`https://wa.me/\${fullNumber}?text=\${encodedMessage}\`, '_blank');
    }
  };`;
code = code.replace(funcRegex, whatsappFunc);

// Add WhatsApp button to mobile menu bottom
const mobileMenuBottom = /\{isAdmin && \([\s\S]*?<\/Link>\s*\)\}\s*<\/div>/;
const newMobileMenuBottom = `{isAdmin && (
                <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-base font-bold text-white bg-[#0b382d] rounded-xl shadow-sm mb-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  Owner Panel
                </Link>
              )}
              {settings?.whatsappSupport?.enabled && settings?.whatsappSupport?.phoneNumber && (
                <button 
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-bold text-white bg-[#25D366] hover:bg-[#128C7E] rounded-xl shadow-sm transition-colors text-left"
                >
                  <MessageCircle className="h-5 w-5 text-white" />
                  WhatsApp Support
                </button>
              )}
            </div>`;
code = code.replace(mobileMenuBottom, newMobileMenuBottom);

// Add floating WhatsApp button
const bottomRegex = /<\/div>\s*<\/div>\s*<\/div>\s*<\/footer>/;
const newBottomRegex = `</div>
        </div>
      </div>
      </footer>
      
      {/* Floating WhatsApp Button */}
      {settings?.whatsappSupport?.enabled && settings?.whatsappSupport?.phoneNumber && (
        <button 
          onClick={handleWhatsAppClick}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 z-[60] bg-[#25D366] text-white p-4 rounded-full shadow-lg shadow-[#25D366]/30 hover:bg-[#128C7E] transition-all hover:scale-105 active:scale-95 group flex items-center gap-0 hover:gap-3 overflow-hidden"
          title="Chat with us on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 md:w-8 md:h-8 shrink-0" />
          <span className="font-bold text-sm hidden md:inline-block md:max-w-0 md:group-hover:max-w-xs transition-all duration-300 whitespace-nowrap overflow-hidden">Chat with us</span>
        </button>
      )}`;
code = code.replace(bottomRegex, newBottomRegex);

fs.writeFileSync('src/layouts/StoreLayout.tsx', code);
