import re

with open("src/layouts/StoreLayout.tsx", "r") as f:
    content = f.read()

# Update Announcement Bar
content = re.sub(
    r'<div className="bg-slate-900 text-white text-\[10px\] sm:text-\[11px\].*?</div>',
    """<div className="bg-emerald-900 text-white text-[10px] sm:text-[11px] py-2.5 px-4 flex justify-center items-center gap-4 text-center font-medium tracking-wide">
        <span className="hidden sm:inline-flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Free Shipping on Orders ₹999+</span>
        <span className="hidden sm:inline">|</span>
        <span className="inline-flex items-center gap-1.5"><RefreshCw className="w-3.5 h-3.5" /> 7-Day Easy Returns</span>
        <span className="hidden sm:inline">|</span>
        <span className="hidden sm:inline-flex items-center gap-1.5"><ShieldCheck className="w-3.5 h-3.5" /> Secure Checkout</span>
      </div>""",
    content,
    flags=re.DOTALL
)

# Replace 'lucide-react' imports to include missing icons
content = re.sub(
    r'import \{ (.*?) \} from \'lucide-react\';',
    r"import { \1, Truck, RefreshCw, ShieldCheck, Mail, Gift, Facebook, Instagram, Youtube, Send } from 'lucide-react';",
    content
)

# Update Logo
content = re.sub(
    r'<Link to="/" className="text-2xl font-extrabold tracking-tighter text-slate-900 uppercase">\s*SwiftStore\s*</Link>',
    """<Link to="/" className="flex items-center gap-2">
                <div className="bg-emerald-600 text-white p-1 rounded-md">
                  <ShoppingBag className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">SwiftStore</span>
              </Link>""",
    content
)

# Update Desktop Navigation
content = re.sub(
    r'<nav className="hidden md:flex space-x-8 items-center font-semibold text-sm tracking-wide text-slate-600">.*?</nav>',
    """<nav className="hidden md:flex space-x-6 items-center font-semibold text-[13px] text-slate-700">
              <Link to="/" className="hover:text-emerald-700 transition-colors border-b-2 border-emerald-600 text-slate-900 py-1">Home</Link>
              <Link to="/shop" className="hover:text-emerald-700 transition-colors py-1">Shop All</Link>
              <Link to="/categories" className="hover:text-emerald-700 transition-colors py-1">Collections</Link>
              <Link to="/shop?filter=new" className="hover:text-emerald-700 transition-colors py-1">New Arrivals</Link>
              <Link to="/shop?filter=trending" className="hover:text-emerald-700 transition-colors py-1">Best Sellers</Link>
              <Link to="/shop?filter=deals" className="hover:text-emerald-700 transition-colors py-1">Deals</Link>
            </nav>""",
    content,
    flags=re.DOTALL
)

# Update Header Background
content = content.replace(
    'bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm',
    'bg-white border-b border-slate-200'
)

# Update Mobile Logo
content = re.sub(
    r'<span className="text-xl font-extrabold tracking-tighter text-slate-900 uppercase">SwiftStore</span>',
    """<div className="flex items-center gap-2">
                <div className="bg-emerald-600 text-white p-1 rounded-md">
                  <ShoppingBag className="h-5 w-5" strokeWidth={2.5} />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900">SwiftStore</span>
              </div>""",
    content
)

# Update Newsletter and Footer
content = re.sub(
    r'{/\* Premium Multi-Column Footer \*/}.*?</footer>',
    """{/* Newsletter Section */}
      <section className="bg-[#0a4a2b] text-white py-12 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/10 rounded-full">
              <Mail className="h-8 w-8 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold">Join Our Newsletter</h3>
              <p className="text-emerald-100 text-sm mt-1">Get updates on new arrivals, exclusive offers and more.</p>
            </div>
          </div>
          <div className="flex w-full md:w-auto max-w-md gap-2 flex-1">
            <input type="email" placeholder="Enter your email address" className="w-full px-4 py-3 rounded-lg text-slate-900 outline-none" />
            <button className="bg-[#ff6b00] hover:bg-[#e56000] text-white px-6 py-3 rounded-lg font-bold transition-colors">Subscribe</button>
          </div>
          <div className="hidden lg:flex items-center gap-4 border-l border-white/20 pl-8">
            <Gift className="h-8 w-8 text-emerald-300" />
            <div>
              <p className="font-bold">Exclusive Offers</p>
              <p className="text-sm text-emerald-100">& New Arrivals</p>
            </div>
          </div>
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="bg-[#FAFAFA] text-slate-600 pt-16 pb-8 md:pb-12 border-t border-slate-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-1 md:col-span-1">
              <Link to="/" className="flex items-center gap-2 mb-4">
                <div className="bg-emerald-600 text-white p-1 rounded-md">
                  <ShoppingBag className="h-6 w-6" strokeWidth={2.5} />
                </div>
                <span className="text-2xl font-extrabold tracking-tight text-slate-900">SwiftStore</span>
              </Link>
              <p className="text-sm font-medium leading-relaxed mb-6">
                Your one-stop shop for quality products at the best prices.
              </p>
              <div className="flex gap-4 text-slate-400">
                <Facebook className="h-5 w-5 hover:text-slate-900 cursor-pointer transition-colors" />
                <Instagram className="h-5 w-5 hover:text-slate-900 cursor-pointer transition-colors" />
                <Youtube className="h-5 w-5 hover:text-slate-900 cursor-pointer transition-colors" />
                <Send className="h-5 w-5 hover:text-slate-900 cursor-pointer transition-colors" />
              </div>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900 mb-6">Shop</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link to="/shop" className="hover:text-emerald-700 transition-colors">All Products</Link></li>
                <li><Link to="/shop?filter=new" className="hover:text-emerald-700 transition-colors">New Arrivals</Link></li>
                <li><Link to="/shop?filter=trending" className="hover:text-emerald-700 transition-colors">Best Sellers</Link></li>
                <li><Link to="/shop?filter=deals" className="hover:text-emerald-700 transition-colors">Sale Items</Link></li>
                <li><Link to="/categories" className="hover:text-emerald-700 transition-colors">Collections</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900 mb-6">Customer Care</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link to="/privacy" className="hover:text-emerald-700 transition-colors">Shipping Policy</Link></li>
                <li><Link to="/refund" className="hover:text-emerald-700 transition-colors">Returns & Exchanges</Link></li>
                <li><Link to="/about" className="hover:text-emerald-700 transition-colors">FAQs</Link></li>
                <li><Link to="/track-order" className="hover:text-emerald-700 transition-colors">Track Order</Link></li>
                <li><Link to="/contact" className="hover:text-emerald-700 transition-colors">Contact Us</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-bold text-slate-900 mb-6">About Us</h3>
              <ul className="space-y-3 text-sm font-medium">
                <li><Link to="/about" className="hover:text-emerald-700 transition-colors">Our Story</Link></li>
                <li><Link to="/terms" className="hover:text-emerald-700 transition-colors">Terms of Service</Link></li>
                <li><Link to="/privacy" className="hover:text-emerald-700 transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>

            <div>
               <h3 className="font-bold text-slate-900 mb-6">Stay in the loop</h3>
               <p className="text-sm font-medium mb-4">Get updates on new arrivals, exclusive offers and more.</p>
               <div className="flex gap-2">
                 <input type="email" placeholder="Enter your email" className="w-full px-3 py-2 border border-slate-300 rounded-md text-sm outline-none focus:border-emerald-600" />
                 <button className="bg-emerald-700 hover:bg-emerald-800 text-white px-3 py-2 rounded-md font-bold text-sm transition-colors">Subscribe</button>
               </div>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium">
            <div>
              &copy; {new Date().getFullYear()} SwiftStore. All rights reserved.
              <span className="mx-3">|</span>
              <Link to="/admin/login" className="hover:text-emerald-700 transition-colors">Owner Login</Link>
            </div>
            <div className="flex gap-6 items-center">
              <span className="flex items-center gap-1.5 font-bold"><ShieldCheck className="h-4 w-4" /> Secure Payment</span>
            </div>
          </div>
        </div>
      </footer>""",
    content,
    flags=re.DOTALL
)

with open("src/layouts/StoreLayout.tsx", "w") as f:
    f.write(content)
