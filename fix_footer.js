import fs from 'fs';
let code = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');

// Add Lucide imports
code = code.replace(
  "import { ShoppingBag, Search, User, Heart, Menu, X, Home, Grid, ShoppingCart, ArrowRight, ShieldCheck, Truck, RotateCcw, Lock, MessageCircle } from \"lucide-react\";",
  "import { ShoppingBag, Search, User, Heart, Menu, X, Home, Grid, ShoppingCart, ArrowRight, ShieldCheck, Truck, RotateCcw, Lock, MessageCircle, Instagram, Facebook, Youtube, Twitter, Send, Pin, Linkedin } from \"lucide-react\";"
);

const socialLinksRegex = /<div className="flex gap-4 text-slate-400">[\s\S]*?<\/div>\s*<\/div>/;
code = code.replace(socialLinksRegex, '</div>');

const multiColumnFooter = /<footer className="bg-white text-slate-600 pt-16 pb-8 md:pb-12 border-t border-slate-100 hidden md:block">/;

const newMultiColumnFooter = `<footer className="bg-white text-slate-600 pt-12 pb-24 md:pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Social Media Section */}
          <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-12 mb-12 text-center">
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900 mb-6 uppercase">Follow SwiftStore</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {settings?.socialLinks?.instagram?.enabled && settings.socialLinks.instagram.url && (
                <a href={settings.socialLinks.instagram.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Instagram className="w-5 h-5" />
                </a>
              )}
              {settings?.socialLinks?.facebook?.enabled && settings.socialLinks.facebook.url && (
                <a href={settings.socialLinks.facebook.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Facebook className="w-5 h-5" />
                </a>
              )}
              {settings?.socialLinks?.youtube?.enabled && settings.socialLinks.youtube.url && (
                <a href={settings.socialLinks.youtube.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Youtube className="w-5 h-5" />
                </a>
              )}
              {settings?.socialLinks?.twitter?.enabled && settings.socialLinks.twitter.url && (
                <a href={settings.socialLinks.twitter.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {settings?.socialLinks?.telegram?.enabled && settings.socialLinks.telegram.url && (
                <a href={settings.socialLinks.telegram.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Send className="w-5 h-5" />
                </a>
              )}
              {settings?.socialLinks?.whatsapp?.enabled && settings.socialLinks.whatsapp.url && (
                <a href={settings.socialLinks.whatsapp.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#25D366] hover:text-white transition-all shadow-sm">
                  <MessageCircle className="w-5 h-5" />
                </a>
              )}
              {settings?.socialLinks?.pinterest?.enabled && settings.socialLinks.pinterest.url && (
                <a href={settings.socialLinks.pinterest.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Pin className="w-5 h-5" />
                </a>
              )}
              {settings?.socialLinks?.linkedin?.enabled && settings.socialLinks.linkedin.url && (
                <a href={settings.socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
            </div>
          </div>`;

code = code.replace(multiColumnFooter, newMultiColumnFooter);

fs.writeFileSync('src/layouts/StoreLayout.tsx', code);
