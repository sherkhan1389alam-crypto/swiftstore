import React from 'react';
import { useSettings } from '../../lib/settingsContext';
import { MessageCircle, Mail, MapPin, Clock, HelpCircle, FileText, Truck, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Contact() {
  const { settings } = useSettings();
  const whatsapp = settings?.whatsappSupport;
  
  const handleWhatsAppClick = () => {
    if (whatsapp?.enabled && whatsapp?.phoneNumber) {
      const fullNumber = `${whatsapp.countryCode}${whatsapp.phoneNumber}`;
      const encodedMessage = encodeURIComponent(whatsapp.defaultMessage || 'Hello, I need help.');
      window.open(`https://wa.me/${fullNumber}?text=${encodedMessage}`, '_blank');
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="bg-[#0b382d] text-white py-16 sm:py-24 text-center px-4">
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight uppercase mb-4">Help & Support</h1>
        <p className="text-emerald-100/80 font-medium max-w-2xl mx-auto text-lg">We are here to help. Get in touch with our customer support team or browse our FAQs.</p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Links */}
            <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase mb-8">How can we help?</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link to="/account/orders" className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-[#0b382d]/30 hover:bg-[#0b382d]/5 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center shrink-0">
                    <Truck className="w-6 h-6 text-[#0b382d]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[#0b382d] transition-colors">Track an Order</h3>
                    <p className="text-sm text-slate-500 mt-1">Check the status of your recent purchases and shipments.</p>
                  </div>
                </Link>
                
                <Link to="/refund-policy" className="flex items-start gap-4 p-5 rounded-2xl border border-slate-100 hover:border-[#0b382d]/30 hover:bg-[#0b382d]/5 transition-all group">
                  <div className="w-12 h-12 rounded-full bg-slate-100 group-hover:bg-white flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6 text-[#0b382d]" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-[#0b382d] transition-colors">Returns & Refunds</h3>
                    <p className="text-sm text-slate-500 mt-1">Learn about our easy 7-day return policy and process.</p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Email Form */}
            <div className="bg-white p-6 sm:p-10 rounded-[2rem] shadow-sm border border-slate-100">
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase mb-2">Send us a message</h2>
              <p className="text-slate-500 mb-8 font-medium">We typically reply within 24 hours.</p>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Full Name</label>
                    <input type="text" className="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#0b382d] focus:ring-[#0b382d] p-3 bg-slate-50 focus:bg-white transition-colors" placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Email Address</label>
                    <input type="email" className="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#0b382d] focus:ring-[#0b382d] p-3 bg-slate-50 focus:bg-white transition-colors" placeholder="john@example.com" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Order Number (Optional)</label>
                  <input type="text" className="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#0b382d] focus:ring-[#0b382d] p-3 bg-slate-50 focus:bg-white transition-colors" placeholder="#SWIFT-12345" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Message</label>
                  <textarea rows={5} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#0b382d] focus:ring-[#0b382d] p-3 bg-slate-50 focus:bg-white transition-colors resize-none" placeholder="How can we help you?"></textarea>
                </div>
                <button type="button" className="bg-[#0b382d] hover:bg-emerald-900 text-white font-bold py-4 px-8 rounded-full uppercase tracking-wider text-sm transition-colors shadow-lg w-full sm:w-auto">
                  Submit Request
                </button>
              </form>
            </div>
          </div>
          
          {/* Sidebar */}
          <div className="space-y-6">
            {/* WhatsApp Widget */}
            {whatsapp?.enabled && whatsapp?.phoneNumber && (
              <div className="bg-[#25D366] p-8 rounded-[2rem] text-white shadow-xl shadow-[#25D366]/20 relative overflow-hidden">
                <div className="absolute -right-6 -top-6 text-white/20">
                  <MessageCircle className="w-32 h-32" />
                </div>
                <div className="relative z-10">
                  <h3 className="text-2xl font-extrabold tracking-tight mb-2">Instant Chat</h3>
                  <p className="text-white/90 font-medium mb-8">Need immediate assistance? Chat with us directly on WhatsApp.</p>
                  
                  <button 
                    onClick={handleWhatsAppClick}
                    className="w-full bg-white text-[#128C7E] hover:bg-slate-50 font-bold py-4 px-6 rounded-full uppercase tracking-wider text-sm transition-colors flex items-center justify-center gap-2 shadow-lg"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Chat on WhatsApp
                  </button>
                </div>
              </div>
            )}
            
            {/* Contact Info */}
            <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900 tracking-tight uppercase mb-6">Contact Information</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="bg-slate-50 p-3 rounded-full shrink-0">
                    <Mail className="w-5 h-5 text-[#0b382d]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Email</p>
                    <a href="mailto:support@swiftstore.com" className="font-medium text-slate-900 hover:text-[#0b382d] transition-colors">support@swiftstore.com</a>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="bg-slate-50 p-3 rounded-full shrink-0">
                    <Clock className="w-5 h-5 text-[#0b382d]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Business Hours</p>
                    <p className="font-medium text-slate-900">Mon - Fri: 9:00 AM - 6:00 PM</p>
                    <p className="text-sm text-slate-500">Weekend responses may be delayed.</p>
                  </div>
                </li>
                
                <li className="flex items-start gap-4">
                  <div className="bg-slate-50 p-3 rounded-full shrink-0">
                    <MapPin className="w-5 h-5 text-[#0b382d]" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Headquarters</p>
                    <p className="font-medium text-slate-900">SwiftStore Ecommerce Inc.</p>
                    <p className="text-sm text-slate-500">123 Commerce Avenue<br />New York, NY 10012</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
