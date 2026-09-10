import re

with open('src/pages/store/Checkout.tsx', 'r') as f:
    content = f.read()

# Add imports
content = content.replace("import { Loader2 } from 'lucide-react';", "import { Loader2, Smartphone, Copy, QrCode, Check } from 'lucide-react';")

# Add state
state_code = """  const [submitting, setSubmitting] = useState(false);
  const [pendingOrderNumber] = useState(() => `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const isAndroid = /Android/i.test(navigator.userAgent);
  const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isMobile = isAndroid || isIOS;

  const handleUpiClick = (appPackage?: string) => {
    if (!paymentSettings?.directUpiId) return;
    
    const searchParams = new URLSearchParams({
      pa: paymentSettings.directUpiId,
      pn: paymentSettings.directUpiName || 'SwiftStore',
      am: grandTotal.toString(),
      cu: 'INR',
      tn: (paymentSettings.directUpiNotePrefix || 'SwiftStore Order') + ' ' + pendingOrderNumber
    });
    
    const upiString = `pay?${searchParams.toString()}`;
    let uri = `upi://${upiString}`;
    
    if (isAndroid && appPackage) {
      uri = `intent://${upiString}#Intent;scheme=upi;package=${appPackage};end`;
    } else if (isIOS) {
      if (appPackage === 'com.phonepe.app') uri = `phonepe://${upiString}`;
      else if (appPackage === 'com.google.android.apps.nbu.paisa.user') uri = `gpay://upi/${upiString}`;
      else if (appPackage === 'net.one97.paytm') uri = `paytmmp://${upiString}`;
    }
    
    window.location.href = uri;
  };

  const copyUpiId = () => {
    if (paymentSettings?.directUpiId) {
      navigator.clipboard.writeText(paymentSettings.directUpiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 2000);
    }
  };"""
content = content.replace("  const [submitting, setSubmitting] = useState(false);", state_code)

# Fix handleSubmit orderNumber
content = content.replace("const orderNumber = `ORD-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;", "const orderNumber = pendingOrderNumber;")

# Replace UPI UI
old_upi_ui = """                    {paymentMethod === 'DIRECT_UPI' && (
                      <div className="px-10 pb-6 pt-2">
                        <div className="bg-white p-4 rounded-xl border border-slate-200 flex flex-col sm:flex-row items-center gap-4">
                          {paymentSettings?.directUpiQr && (
                            <img src={paymentSettings.directUpiQr} alt="UPI QR Code" className="w-24 h-24 rounded-lg object-contain border border-slate-200" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-slate-900">Pay to UPI ID:</p>
                            <p className="text-lg font-bold text-slate-900 select-all">{paymentSettings?.directUpiId}</p>
                            {paymentSettings?.directUpiName && <p className="text-sm text-slate-500">{paymentSettings?.directUpiName}</p>}
                            <div className="mt-2 text-xs text-slate-600 p-2 bg-blue-50 rounded-lg border border-blue-100">
                              Please complete the payment on your UPI app and click "Place Order". We will verify your payment manually.
                            </div>
                          </div>
                        </div>
                      </div>
                    )}"""

new_upi_ui = """                    {paymentMethod === 'DIRECT_UPI' && (
                      <div className="px-4 sm:px-10 pb-6 pt-2">
                        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                          <h4 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2 uppercase tracking-wider">
                            <Smartphone className="w-5 h-5 text-indigo-600" /> Pay using UPI
                          </h4>
                          
                          {isMobile ? (
                            <div className="space-y-3 mb-6">
                              <p className="text-sm font-medium text-slate-600 mb-3">Choose your preferred UPI app</p>
                              
                              <button type="button" onClick={() => handleUpiClick('com.phonepe.app')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-[#5f259f] rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">P</div>
                                  <span className="font-bold text-slate-900 group-hover:text-indigo-900 text-base">PhonePe</span>
                                </div>
                                <span className="text-indigo-600 text-2xl group-hover:translate-x-1 transition-transform leading-none">&rsaquo;</span>
                              </button>
                              
                              <button type="button" onClick={() => handleUpiClick('com.google.android.apps.nbu.paisa.user')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-white border border-slate-100 shadow-sm rounded-lg flex items-center justify-center p-1">
                                    <svg className="w-full h-full" viewBox="0 0 24 24"><path fill="#EA4335" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" /><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.16v2.84C3.99 20.53 7.7 23 12 23z" /><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.16C1.43 8.55 1 10.22 1 12s.43 3.45 1.16 4.93l3.68-2.84z" /><path fill="#4285F4" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.16 7.07l3.68 2.84c.87-2.6 3.3-4.53 6.16-4.53z" /></svg>
                                  </div>
                                  <span className="font-bold text-slate-900 group-hover:text-indigo-900 text-base">Google Pay</span>
                                </div>
                                <span className="text-indigo-600 text-2xl group-hover:translate-x-1 transition-transform leading-none">&rsaquo;</span>
                              </button>
                              
                              <button type="button" onClick={() => handleUpiClick('com.naviapp')} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-sm">N</div>
                                  <span className="font-bold text-slate-900 group-hover:text-indigo-900 text-base">Navi UPI</span>
                                </div>
                                <span className="text-indigo-600 text-2xl group-hover:translate-x-1 transition-transform leading-none">&rsaquo;</span>
                              </button>
                              
                              <button type="button" onClick={() => handleUpiClick()} className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-indigo-600 hover:bg-indigo-50 transition-colors group">
                                <div className="flex items-center gap-4">
                                  <div className="w-10 h-10 bg-slate-800 rounded-lg flex items-center justify-center text-white font-bold shadow-sm">
                                    <Smartphone className="w-5 h-5" />
                                  </div>
                                  <span className="font-bold text-slate-900 group-hover:text-indigo-900 text-base">Other UPI Apps</span>
                                </div>
                                <span className="text-indigo-600 text-2xl group-hover:translate-x-1 transition-transform leading-none">&rsaquo;</span>
                              </button>
                            </div>
                          ) : (
                            <div className="mb-6 p-4 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-600">
                              UPI app payment is available on supported mobile devices. Please use the QR code or UPI ID below.
                            </div>
                          )}

                          <div className="border-t border-slate-100 pt-6 flex flex-col sm:flex-row items-center gap-6">
                            {paymentSettings?.directUpiQr && (
                              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 shadow-sm shrink-0">
                                <img src={paymentSettings.directUpiQr} alt="UPI QR Code" className="w-32 h-32 rounded-lg object-contain" />
                              </div>
                            )}
                            <div className="flex-1 w-full">
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Or Pay to UPI ID</p>
                              <div className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-200 mb-2">
                                <span className="font-mono font-bold text-slate-900 break-all text-base">{paymentSettings?.directUpiId}</span>
                                <button type="button" onClick={copyUpiId} className="ml-3 shrink-0 p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" title="Copy UPI ID">
                                  {copiedUpi ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
                                </button>
                              </div>
                              {paymentSettings?.directUpiName && <p className="text-sm font-medium text-slate-500">Merchant: <span className="text-slate-700">{paymentSettings?.directUpiName}</span></p>}
                            </div>
                          </div>
                          
                          <div className="mt-6 text-sm text-indigo-800 p-4 bg-indigo-50/50 rounded-xl border border-indigo-100 font-medium">
                            <span className="font-bold text-indigo-900">Important:</span> After completing the payment on your UPI app, you must return here and click "Place Order" to verify your payment and confirm the order.
                          </div>
                        </div>
                      </div>
                    )}"""
content = content.replace(old_upi_ui, new_upi_ui)

with open('src/pages/store/Checkout.tsx', 'w') as f:
    f.write(content)
