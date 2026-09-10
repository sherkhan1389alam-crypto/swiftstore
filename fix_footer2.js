import fs from 'fs';
let code = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');

const footerStart = code.indexOf('<footer');
const footerEnd = code.indexOf('</footer>') + 9;

const newFooter = `<footer className="bg-white text-slate-600 pt-12 pb-24 md:pb-12 border-t border-slate-100">
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
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12 text-center md:text-left">
            <div className="col-span-1 md:col-span-1 flex flex-col items-center md:items-start">
              <Link to="/" className="flex items-center gap-2 mb-6">
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
              </Link>
              <p className="text-slate-500 text-sm leading-relaxed mb-6">
                Your one-stop shop for quality products at the best prices. Discover premium picks, handpicked for your lifestyle.
              </p>
            </div>
            
            <div>
              <h3 className="text-sm font-extrabold tracking-widest uppercase text-slate-900 mb-6">Shop</h3>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><Link to="/shop" className="hover:text-[#0b382d] transition-colors">All Products</Link></li>
                <li><Link to="/shop?filter=new" className="hover:text-[#0b382d] transition-colors">New Arrivals</Link></li>
                <li><Link to="/shop?filter=bestsellers" className="hover:text-[#0b382d] transition-colors">Best Sellers</Link></li>
                <li><Link to="/categories" className="hover:text-[#0b382d] transition-colors">Collections</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-extrabold tracking-widest uppercase text-slate-900 mb-6">Customer Care</h3>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><Link to="/shipping" className="hover:text-[#0b382d] transition-colors">Shipping Policy</Link></li>
                <li><Link to="/refund" className="hover:text-[#0b382d] transition-colors">Returns & Refunds</Link></li>
                <li><Link to="/track-order" className="hover:text-[#0b382d] transition-colors">Track Order</Link></li>
                <li><Link to="/contact" className="hover:text-[#0b382d] transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-sm font-extrabold tracking-widest uppercase text-slate-900 mb-6">About Us</h3>
              <ul className="space-y-3 text-sm text-slate-500 font-medium">
                <li><Link to="/about" className="hover:text-[#0b382d] transition-colors">Our Story</Link></li>
                <li><Link to="/privacy" className="hover:text-[#0b382d] transition-colors">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-[#0b382d] transition-colors">Terms & Conditions</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
            <div>&copy; {new Date().getFullYear()} SwiftStore. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <span>Secure Payments via</span>
              <div className="flex gap-2">
                <div className="w-8 h-5 bg-slate-100 rounded-sm"></div>
                <div className="w-8 h-5 bg-slate-100 rounded-sm"></div>
              </div>
            </div>
          </div>
        </div>
      </footer>`;

const newCode = code.substring(0, footerStart) + newFooter + code.substring(footerEnd);
fs.writeFileSync('src/layouts/StoreLayout.tsx', newCode);
