import React, { useState, useEffect } from "react";
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { ShoppingBag, Search, User, Heart, Menu, X, Home, Grid, ShoppingCart, ArrowRight, ShieldCheck, Truck, RotateCcw, Lock, MessageCircle, Send } from "lucide-react";
import { FaInstagram as Instagram, FaFacebook as Facebook, FaYoutube as Youtube, FaTwitter as Twitter, FaPinterest as Pin, FaLinkedin as Linkedin } from 'react-icons/fa';
import { useAuth } from "../contexts/AuthContext";
import { useCart } from "../contexts/CartContext";
import { useSettings } from "../lib/settingsContext";

export const StoreLayout = () => {
  const { currentUser, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { settings } = useSettings();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const handleWhatsAppClick = () => {
    const whatsapp = settings?.whatsappSupport;
    if (whatsapp?.enabled && whatsapp?.phoneNumber) {
      const fullNumber = `${whatsapp.countryCode}${whatsapp.phoneNumber}`;
      const encodedMessage = encodeURIComponent(whatsapp.defaultMessage || 'Hello, I need help.');
      window.open(`https://wa.me/${fullNumber}?text=${encodedMessage}`, '_blank');
    }
  };

  useEffect(() => {
    setIsMobileMenuOpen(false);
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white font-sans text-slate-900">
      {/* Top Announcement Bar */}
      {settings?.announcementEnabled && (
        <div className="bg-[#0b382d] text-white text-[10px] sm:text-xs py-2 px-4 text-center font-medium tracking-wide">
          <div className="max-w-7xl mx-auto flex justify-center items-center gap-6">
            <span className="flex items-center gap-1.5 uppercase tracking-widest">{settings.announcementText}</span>
          </div>
        </div>
      )}

      {/* Main Header */}
      <header className={`sticky top-0 z-40 bg-white transition-all duration-300 ${isScrolled ? 'shadow-sm border-b border-slate-100' : 'border-b border-slate-200'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Mobile Menu Button */}
            <div className="flex items-center md:hidden gap-3">
              <button onClick={() => setIsMobileMenuOpen(true)} className="p-1.5 text-slate-800">
                <Menu className="h-6 w-6 stroke-[1.5]" />
              </button>
            </div>

            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              
              <Link to="/" className="flex items-center gap-2">
                {settings?.logoUrl ? (
                  <img src={settings.logoUrl} alt={settings.storeName || 'SwiftStore'} className="h-8 md:h-10 object-contain max-w-[120px]" />
                ) : (
                  <div className="w-8 h-8 md:w-9 md:h-9 bg-[#0b382d] rounded flex items-center justify-center text-white font-bold text-xl leading-none flex-shrink-0">
                    {(settings?.storeName || 'SwiftStore').charAt(0).toUpperCase()}
                  </div>
                )}
                <span className="text-xl md:text-2xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap truncate max-w-[150px] sm:max-w-none">
                  {settings?.storeName || 'SwiftStore'}
                </span>
              </Link>

            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 lg:space-x-8 items-center font-semibold text-[13px] tracking-wide text-slate-700">
              <Link to="/" className={`hover:text-[#0b382d] transition-colors ${location.pathname === "/" ? "text-[#0b382d] border-b-2 border-[#0b382d] pb-1 -mb-1" : ""}`}>Home</Link>
              <Link to="/shop" className={`hover:text-[#0b382d] transition-colors ${location.pathname === "/shop" ? "text-[#0b382d] border-b-2 border-[#0b382d] pb-1 -mb-1" : ""}`}>Shop</Link>
              <Link to="/categories" className="hover:text-[#0b382d] transition-colors">Categories</Link>
              <Link to="/shop?filter=new" className="hover:text-[#0b382d] transition-colors">New Arrivals</Link>
              <Link to="/shop?filter=bestsellers" className="hover:text-[#0b382d] transition-colors">Best Sellers</Link>
              <Link to="/about" className="hover:text-[#0b382d] transition-colors">About Us</Link>
            </nav>

            {/* Icons Right */}
            <div className="flex items-center space-x-3 sm:space-x-5">
              <Link to="/search" className="p-1.5 text-slate-800 hover:text-[#0b382d] transition-colors hidden sm:block">
                <Search className="h-5 w-5 stroke-[2]" />
              </Link>
              <Link to={currentUser ? "/account/profile" : "/login"} className="p-1.5 text-slate-800 hover:text-[#0b382d] transition-colors hidden sm:block">
                <User className="h-5 w-5 stroke-[2]" />
              </Link>
              <Link to="/wishlist" className="p-1.5 text-slate-800 hover:text-[#0b382d] transition-colors hidden sm:block">
                <Heart className="h-5 w-5 stroke-[2]" />
              </Link>
              <Link to="/cart" className="p-1.5 text-slate-800 hover:text-[#0b382d] transition-colors relative flex items-center">
                <ShoppingCart className="h-5 w-5 stroke-[2]" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-4/5 max-w-sm bg-white h-full flex flex-col overflow-y-auto transform transition-transform duration-300">
            <div className="px-6 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              
              <Link to="/" className="flex items-center gap-2">
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
              </Link>

              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 text-slate-500 hover:text-slate-900 bg-white rounded-full shadow-sm">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 py-6 px-4">
              <nav className="flex flex-col space-y-1">
                <Link to="/" className="px-4 py-3 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-xl">Home</Link>
                <Link to="/shop" className="px-4 py-3 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-xl">Shop All</Link>
                <Link to="/categories" className="px-4 py-3 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-xl">Categories</Link>
                <Link to="/shop?filter=new" className="px-4 py-3 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-xl">New Arrivals</Link>
                <Link to="/shop?filter=bestsellers" className="px-4 py-3 text-base font-bold text-slate-800 hover:bg-slate-50 rounded-xl">Best Sellers</Link>
                <Link to="/shop?filter=deals" className="px-4 py-3 text-base font-bold text-red-600 hover:bg-red-50 rounded-xl">Deals</Link>
              </nav>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50">
              <Link to={currentUser ? "/account/profile" : "/login"} className="flex items-center gap-3 px-4 py-3 text-base font-bold text-slate-800 bg-white rounded-xl shadow-sm mb-3">
                <User className="h-5 w-5 text-slate-500" />
                {currentUser ? 'My Account' : 'Login / Register'}
              </Link>
              <Link to="/admin" className="flex items-center gap-3 px-4 py-3 text-base font-bold text-white bg-[#0b382d] rounded-xl shadow-sm mb-3">
                  <ShieldCheck className="h-5 w-5 text-emerald-300" />
                  Owner Panel
                </Link>
              {settings?.whatsappSupport?.enabled && settings?.whatsappSupport?.phoneNumber && (
                <button 
                  onClick={handleWhatsAppClick}
                  className="w-full flex items-center gap-3 px-4 py-3 text-base font-bold text-white bg-[#25D366] hover:bg-[#128C7E] rounded-xl shadow-sm transition-colors text-left"
                >
                  <MessageCircle className="h-5 w-5 text-white" />
                  WhatsApp Support
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col w-full pb-16 md:pb-0">
        <Outlet />
      </main>

      {/* Newsletter Section */}
      {settings?.newsletterEnabled && (
        <div className="bg-[#0b382d] text-white py-16 md:py-20 border-t-4 border-emerald-500">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-10">
            <div className="flex-1 max-w-lg text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-extrabold mb-3 tracking-tight">
                {settings.newsletterHeadline}
              </h3>
              <p className="text-emerald-100/80 text-base">
                {settings.newsletterText}
              </p>
            </div>
            <div className="w-full md:w-auto flex-1 max-w-md">
              <form className="flex w-full bg-white/10 p-1.5 rounded-full border border-white/20 focus-within:bg-white/20 focus-within:border-white/40 transition-all">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="flex-1 px-5 py-3 text-sm text-white bg-transparent focus:outline-none placeholder:text-white/60"
                  required
                />
                <button
                  type="submit"
                  className="bg-white text-[#0b382d] px-8 py-3 rounded-full text-sm font-bold tracking-wide transition-colors hover:bg-emerald-50"
                >
                  SUBSCRIBE
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Premium Multi-Column Footer */}
      <footer className="bg-white text-slate-600 pt-12 pb-24 md:pb-12 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Social Media Section */}
          <div className="flex flex-col items-center justify-center border-b border-slate-100 pb-12 mb-12 text-center">
            <h3 className="text-xl font-extrabold tracking-tight text-slate-900 mb-6 uppercase">Follow SwiftStore</h3>
            <div className="flex flex-wrap justify-center gap-4">
              {settings?.socialLinks?.instagram?.enabled && settings.socialLinks.instagram.url && (
                <a href={settings.socialLinks.instagram.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Instagram size={20} />
                </a>
              )}
              {settings?.socialLinks?.facebook?.enabled && settings.socialLinks.facebook.url && (
                <a href={settings.socialLinks.facebook.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Facebook size={20} />
                </a>
              )}
              {settings?.socialLinks?.youtube?.enabled && settings.socialLinks.youtube.url && (
                <a href={settings.socialLinks.youtube.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Youtube size={20} />
                </a>
              )}
              {settings?.socialLinks?.twitter?.enabled && settings.socialLinks.twitter.url && (
                <a href={settings.socialLinks.twitter.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Twitter size={20} />
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
                  <Pin size={20} />
                </a>
              )}
              {settings?.socialLinks?.linkedin?.enabled && settings.socialLinks.linkedin.url && (
                <a href={settings.socialLinks.linkedin.url} target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-full bg-slate-50 flex items-center justify-center text-slate-600 hover:bg-[#0b382d] hover:text-white transition-all shadow-sm">
                  <Linkedin size={20} />
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
      )}

      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-100 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-40" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <div className="flex justify-around items-center h-16">
          <Link to="/" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === "/" ? "text-[#0b382d]" : "text-slate-400 hover:text-slate-600"}`}>
            <Home className={`w-5 h-5 ${location.pathname === "/" ? "stroke-[2.5]" : "stroke-2"}`} />
            <span className="text-[10px] font-bold tracking-wide">Home</span>
          </Link>
          <Link to="/categories" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === "/categories" ? "text-[#0b382d]" : "text-slate-400 hover:text-slate-600"}`}>
            <Grid className={`w-5 h-5 ${location.pathname === "/categories" ? "stroke-[2.5]" : "stroke-2"}`} />
            <span className="text-[10px] font-bold tracking-wide">Categories</span>
          </Link>
          <Link to="/search" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === "/search" ? "text-[#0b382d]" : "text-slate-400 hover:text-slate-600"}`}>
            <Search className={`w-5 h-5 ${location.pathname === "/search" ? "stroke-[2.5]" : "stroke-2"}`} />
            <span className="text-[10px] font-bold tracking-wide">Search</span>
          </Link>
          <Link to="/wishlist" className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === "/wishlist" ? "text-[#0b382d]" : "text-slate-400 hover:text-slate-600"}`}>
            <Heart className={`w-5 h-5 ${location.pathname === "/wishlist" ? "stroke-[2.5]" : "stroke-2"}`} />
            <span className="text-[10px] font-bold tracking-wide">Wishlist</span>
          </Link>
          <Link to="/cart" className={`relative flex flex-col items-center justify-center w-full h-full space-y-1 ${location.pathname === "/cart" ? "text-[#0b382d]" : "text-slate-400 hover:text-slate-600"}`}>
            <div className="relative">
              <ShoppingCart className={`w-5 h-5 ${location.pathname === "/cart" ? "stroke-[2.5]" : "stroke-2"}`} />
              {totalItems > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold tracking-wide">Cart</span>
          </Link>
        </div>
      </div>
    </div>
  );
};
