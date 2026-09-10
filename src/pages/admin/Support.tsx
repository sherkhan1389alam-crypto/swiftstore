import React, { useState, useEffect } from 'react';
import { useSettings } from '../../lib/settingsContext';
import { MessageCircle, Save, Smartphone, Phone, AlertCircle, X, CheckCircle2, MessageSquareText } from 'lucide-react';

export default function Support() {
  const { settings, updateSettings } = useSettings();
  
  const [enabled, setEnabled] = useState(false);
  const [countryCode, setCountryCode] = useState('91');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('SwiftStore Support');
  const [defaultMessage, setDefaultMessage] = useState('Hello SwiftStore Support, I need help with my order.');
  
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (settings?.whatsappSupport) {
      setEnabled(settings.whatsappSupport.enabled);
      setCountryCode(settings.whatsappSupport.countryCode || '91');
      setPhoneNumber(settings.whatsappSupport.phoneNumber || '');
      setDisplayName(settings.whatsappSupport.displayName || 'SwiftStore Support');
      setDefaultMessage(settings.whatsappSupport.defaultMessage || 'Hello SwiftStore Support, I need help with my order.');
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    // Validation
    const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    const cleanCode = countryCode.replace(/[^0-9]/g, '');
    
    if (enabled && !cleanPhone) {
      setErrorMsg('Phone number is required when WhatsApp support is enabled.');
      return;
    }
    
    if (cleanPhone && cleanPhone.length < 8) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    setSaving(true);
    
    try {
      await updateSettings({
        whatsappSupport: {
          enabled,
          countryCode: cleanCode,
          phoneNumber: cleanPhone,
          displayName,
          defaultMessage
        }
      });
      setSuccessMsg('WhatsApp support settings saved successfully!');
      setShowConfirm(false);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = () => {
    const cleanPhone = phoneNumber.replace(/\s+/g, '').replace(/[^0-9]/g, '');
    const cleanCode = countryCode.replace(/[^0-9]/g, '');
    if (!cleanPhone) {
      setErrorMsg('Please enter a phone number to test.');
      return;
    }
    const fullNumber = `${cleanCode}${cleanPhone}`;
    const encodedMessage = encodeURIComponent(defaultMessage);
    window.open(`https://wa.me/${fullNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleReset = () => {
    setEnabled(false);
    setCountryCode('91');
    setPhoneNumber('');
    setDisplayName('SwiftStore Support');
    setDefaultMessage('Hello SwiftStore Support, I need help with my order.');
  };
  
  const confirmSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (settings?.whatsappSupport?.phoneNumber && settings.whatsappSupport.phoneNumber !== phoneNumber.replace(/\\s+/g, '').replace(/[^0-9]/g, '')) {
      setShowConfirm(true);
    } else {
      handleSave(e);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">WhatsApp Support</h1>
          <p className="text-slate-500 font-medium mt-1">Configure your customer support WhatsApp number and messaging experience.</p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold">{successMsg}</span>
          </div>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="p-1 hover:bg-red-100 rounded-lg"><X className="w-5 h-5"/></button>
        </div>
      )}
      
      {settings?.whatsappSupport?.enabled && settings.whatsappSupport.phoneNumber && (
        <div className="bg-[#0b382d]/5 border border-[#0b382d]/20 p-6 rounded-[2rem] flex flex-col sm:flex-row items-center justify-between gap-4">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-lg shadow-[#25D366]/30 shrink-0">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#0b382d] uppercase tracking-widest mb-1">Active Support Number</p>
                <p className="text-xl font-extrabold text-slate-900 tracking-tight">+{settings.whatsappSupport.countryCode} {settings.whatsappSupport.phoneNumber}</p>
              </div>
           </div>
           <button onClick={handleTest} type="button" className="w-full sm:w-auto px-6 py-3 bg-[#25D366] text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-[#128C7E] transition-colors shadow-lg flex items-center justify-center gap-2">
              <MessageCircle className="w-4 h-4" /> Test Chat
           </button>
        </div>
      )}

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 sm:p-8">
          <form id="supportForm" onSubmit={confirmSave} className="space-y-8">
            {/* Enable Toggle */}
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="flex flex-col">
                <span className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-1">Enable WhatsApp Support</span>
                <span className="text-sm text-slate-500 font-medium">Show WhatsApp chat buttons across the store</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" checked={enabled} onChange={(e) => setEnabled(e.target.checked)} />
                <div className="w-14 h-7 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#25D366]"></div>
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Support Identity</h3>
                
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Display Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Smartphone className="h-5 w-5 text-slate-400" />
                    </div>
                    <input 
                      type="text" 
                      value={displayName} 
                      onChange={e => setDisplayName(e.target.value)} 
                      className="w-full pl-10 rounded-xl border-slate-200 shadow-sm focus:border-[#25D366] focus:ring-[#25D366] p-3 bg-slate-50 focus:bg-white transition-colors" 
                      placeholder="e.g. SwiftStore Support"
                      required
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">This name might be referenced in support areas.</p>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">WhatsApp Number *</label>
                  <div className="flex gap-2">
                    <div className="relative w-24 shrink-0">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500 font-bold">
                        +
                      </div>
                      <input 
                        type="text" 
                        value={countryCode} 
                        onChange={e => setCountryCode(e.target.value.replace(/[^0-9]/g, ''))} 
                        className="w-full pl-7 rounded-xl border-slate-200 shadow-sm focus:border-[#25D366] focus:ring-[#25D366] p-3 bg-slate-50 focus:bg-white transition-colors font-bold text-slate-900" 
                        placeholder="91"
                        required
                      />
                    </div>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Phone className="h-5 w-5 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        value={phoneNumber} 
                        onChange={e => setPhoneNumber(e.target.value.replace(/[^0-9\s-]/g, ''))} 
                        className="w-full pl-10 rounded-xl border-slate-200 shadow-sm focus:border-[#25D366] focus:ring-[#25D366] p-3 bg-slate-50 focus:bg-white transition-colors font-bold text-slate-900 tracking-wide" 
                        placeholder="7633958564"
                        required={enabled}
                      />
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Do not include +, spaces, or dashes in the country code.</p>
                </div>
              </div>

              <div className="space-y-6">
                 <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2">Messaging</h3>
                 
                 <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Default Message</label>
                  <div className="relative">
                    <div className="absolute top-3 left-3 pointer-events-none">
                      <MessageSquareText className="h-5 w-5 text-slate-400" />
                    </div>
                    <textarea 
                      value={defaultMessage} 
                      onChange={e => setDefaultMessage(e.target.value)} 
                      rows={4}
                      className="w-full pl-10 rounded-xl border-slate-200 shadow-sm focus:border-[#25D366] focus:ring-[#25D366] p-3 bg-slate-50 focus:bg-white transition-colors resize-none" 
                      placeholder="Hello, I need help with my order."
                    />
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">This text will be pre-filled when a customer opens WhatsApp to message you.</p>
                </div>
              </div>
            </div>
            
            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
              <button 
                type="button" 
                onClick={handleReset}
                className="px-6 py-3 bg-slate-100 text-slate-700 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-slate-200 transition-colors w-full sm:w-auto"
              >
                Reset / Remove
              </button>
              <button 
                type="submit" 
                disabled={saving} 
                className="px-8 py-3 bg-slate-900 text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                {saving ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save Settings
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden p-6 text-center">
             <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <AlertCircle className="w-8 h-8" />
             </div>
             <h3 className="text-xl font-extrabold text-slate-900 tracking-tight mb-2">Change WhatsApp Number?</h3>
             <p className="text-slate-500 font-medium mb-8">Are you sure you want to change the WhatsApp support number? The old number will immediately stop being used.</p>
             <div className="flex gap-3">
               <button onClick={() => setShowConfirm(false)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-slate-200 transition-colors">
                 Cancel
               </button>
               <button onClick={(e) => { setShowConfirm(false); handleSave(e); }} className="flex-1 py-3 bg-[#0b382d] text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-emerald-900 transition-colors shadow-lg">
                 Yes, Change It
               </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
