import React from 'react';
import { useState, useEffect } from 'react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';
import { useSettings } from '../../lib/settingsContext';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Loader2, Smartphone, Copy, QrCode, Check } from 'lucide-react';

export default function Checkout() {
  const { items, total: subtotal, shippingCost, finalTotal, clearCart } = useCart();
  const { currentUser } = useAuth();
  const { settings } = useSettings();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
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
  };

  const paymentSettings = settings?.paymentSettings;
  const isCodEnabled = paymentSettings?.codEnabled ?? true;
  const isOnlineEnabled = paymentSettings?.onlineEnabled ?? false;
  const isDirectUpiEnabled = paymentSettings?.directUpiEnabled ?? false;

  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD' | 'DIRECT_UPI'>(isOnlineEnabled ? 'ONLINE' : isDirectUpiEnabled ? 'DIRECT_UPI' : 'COD');
  
  // Update payment fee if COD has a fee
  const currentFee = paymentMethod === 'COD' ? (paymentSettings?.codFee || 0) : 0;
  const grandTotal = finalTotal + currentFee;
  const [formData, setFormData] = useState({
    fullName: currentUser?.displayName || '',
    mobileNumber: '',
    email: currentUser?.email || '',
    houseNo: '',
    street: '',
    landmark: '',
    city: '',
    state: '',
    pincode: ''
  });

  useEffect(() => {
    if (items.length === 0) {
      navigate('/cart');
    }
  }, [items, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const addDeliveryDays = (startDateMs: number, days: number, countWeekends: boolean) => {
    if (countWeekends) {
      return startDateMs + (days * 24 * 60 * 60 * 1000);
    } else {
      let date = new Date(startDateMs);
      let added = 0;
      while (added < days) {
        date.setDate(date.getDate() + 1);
        if (date.getDay() !== 0 && date.getDay() !== 6) {
          added++;
        }
      }
      return date.getTime();
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    
    // Validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!mobileRegex.test(formData.mobileNumber)) {
      alert("Please enter a valid 10-digit mobile number.");
      return;
    }
    const pincodeRegex = /^[0-9]{6}$/;
    if (!pincodeRegex.test(formData.pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    setSubmitting(true);

    try {
      const orderNumber = pendingOrderNumber;
      const orderData = {
        orderNumber,
        userId: currentUser ? currentUser.uid : 'guest',
        customerName: formData.fullName,
        customerEmail: formData.email,
        customerPhone: formData.mobileNumber,
        address: {
          houseNo: formData.houseNo,
          street: formData.street,
          landmark: formData.landmark,
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode
        },
        items: items.map(i => ({ 
          productId: i.id,
          selectedVariants: i.selectedVariants || null, 
          quantity: i.quantity, 
          price: i.price, 
          name: i.name,
          imageUrl: i.imageUrl,
          cost: i.cost || 0,
          shippingCost: i.shippingCost || 0,
          paymentFee: i.paymentFee || 0,
          otherCost: i.otherCost || 0
        })),
        total: grandTotal,
        shippingCharge: shippingCost,
        paymentFee: currentFee,
        status: 'CONFIRMED',
        statusHistory: [{ status: 'CONFIRMED', date: Date.now(), note: 'Order placed and confirmed' }],
        confirmedAt: Date.now(),
        paymentStatus: paymentMethod === 'ONLINE' ? 'PENDING' : paymentMethod === 'DIRECT_UPI' ? 'PENDING_VERIFICATION' : 'PENDING',
        
        paymentMethod,
        totalAmount: grandTotal,
        createdAt: Date.now(),
        estimatedDeliveryDate: Date.now() + (7 * 24 * 60 * 60 * 1000),
        shippingDeliveryDays: 7
      };

      const docRef = await addDoc(collection(db, 'orders'), JSON.parse(JSON.stringify(orderData)));
      clearCart();
      navigate(`/order-confirmation/${docRef.id}`);
    } catch (error) {
      console.error('Checkout failed', error);
      alert('Failed to place order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Checkout</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-7">
          <form id="checkout-form" onSubmit={handleSubmit} className="space-y-10">
            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight">Contact Information</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Full Name *</label>
                  <input required type="text" name="fullName" value={formData.fullName} onChange={handleChange} className="mt-2 block w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3.5 border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Mobile Number *</label>
                  <input required type="tel" name="mobileNumber" value={formData.mobileNumber} onChange={handleChange} className="mt-2 block w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3.5 border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-2 block w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3.5 border bg-slate-50" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight">Shipping Address</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-slate-700">House/Flat No. *</label>
                  <input required type="text" name="houseNo" value={formData.houseNo} onChange={handleChange} className="mt-2 block w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3.5 border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">Street/Area *</label>
                  <input required type="text" name="street" value={formData.street} onChange={handleChange} className="mt-2 block w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3.5 border bg-slate-50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Landmark</label>
                  <input type="text" name="landmark" value={formData.landmark} onChange={handleChange} className="mt-2 block w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3.5 border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">City *</label>
                  <input required type="text" name="city" value={formData.city} onChange={handleChange} className="mt-2 block w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3.5 border bg-slate-50" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700">State *</label>
                  <input required type="text" name="state" value={formData.state} onChange={handleChange} className="mt-2 block w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3.5 border bg-slate-50" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-slate-700">Pincode *</label>
                  <input required type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="mt-2 block w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3.5 border bg-slate-50" />
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-extrabold text-slate-900 mb-6 tracking-tight">Payment Method</h2>
              <div className="space-y-4">
                {isOnlineEnabled && (
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'ONLINE' ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : 'border-slate-200'}`}>
                    <input type="radio" name="paymentMethod" value="ONLINE" checked={paymentMethod === 'ONLINE'} onChange={() => setPaymentMethod('ONLINE')} className="h-5 w-5 text-slate-900 focus:ring-slate-900 border-slate-300" />
                    <div className="ml-4 flex flex-col">
                      <span className="font-medium text-slate-900">Online Payment (Cards / UPI)</span>
                      <span className="text-sm text-slate-500">Pay securely via online payment gateway</span>
                    </div>
                  </label>
                )}
                {isDirectUpiEnabled && (
                  <div className={`border rounded-xl transition-colors ${paymentMethod === 'DIRECT_UPI' ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : 'border-slate-200'}`}>
                    <label className="flex items-center p-4 cursor-pointer">
                      <input type="radio" name="paymentMethod" value="DIRECT_UPI" checked={paymentMethod === 'DIRECT_UPI'} onChange={() => setPaymentMethod('DIRECT_UPI')} className="h-5 w-5 text-slate-900 focus:ring-slate-900 border-slate-300" />
                      <div className="ml-4 flex flex-col">
                        <span className="font-medium text-slate-900">Direct UPI Payment</span>
                        <span className="text-sm text-slate-500">Scan QR or use UPI ID</span>
                      </div>
                    </label>
                    {paymentMethod === 'DIRECT_UPI' && (
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
                    )}
                  </div>
                )}
                {isCodEnabled && (
                  <label className={`flex items-center p-4 border rounded-xl cursor-pointer transition-colors ${paymentMethod === 'COD' ? 'border-slate-900 bg-slate-50 ring-1 ring-slate-900' : 'border-slate-200'}`}>
                    <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={() => setPaymentMethod('COD')} className="h-5 w-5 text-slate-900 focus:ring-slate-900 border-slate-300" />
                    <div className="ml-4 flex flex-col">
                      <span className="font-medium text-slate-900">Cash on Delivery</span>
                      <span className="text-sm text-slate-500">Pay when your order arrives {currentFee > 0 ? `(+₹${currentFee} fee)` : ''}</span>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 sticky top-28">
            <h2 className="text-lg font-medium text-slate-900 mb-6">Order Summary</h2>
            
            <ul className="divide-y divide-slate-200 mb-6">
              {items.map(item => (
                <li key={item.id} className="py-4 flex">
                  <div className="flex-shrink-0 w-16 h-16 border border-slate-200 rounded-lg overflow-hidden">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-center object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <div className="w-full h-full bg-slate-200"></div>
                    )}
                  </div>
                  <div className="ml-4 flex-1 flex flex-col">
                    <div>
                      <div className="flex justify-between text-sm font-medium text-slate-900">
                        <h3>{item.name}</h3>
                        <p className="ml-4">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                    <div className="flex-1 flex items-end justify-between text-sm">
                      <p className="text-slate-500">Qty {item.quantity}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>

            <dl className="space-y-4 text-sm text-slate-600 mb-6 border-t border-slate-200 pt-6">
              <div className="flex justify-between">
                <dt>Subtotal</dt>
                <dd className="font-medium text-slate-900">₹{subtotal}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt>Shipping</dt>
                <dd className={shippingCost === 0 ? "text-emerald-600 font-medium" : "text-slate-900 font-medium"}>{shippingCost === 0 ? 'Free' : `₹${shippingCost}`}</dd>
              </div>
              {currentFee > 0 && (
                <div className="flex justify-between">
                  <dt>Payment Fee</dt>
                  <dd className="font-medium text-slate-900">₹{currentFee}</dd>
                </div>
              )}
              <div className="flex justify-between border-t border-slate-200 pt-4 text-base font-bold text-slate-900">
                <dt>Total</dt>
                <dd>₹{grandTotal}</dd>
              </div>
            </dl>

            <button
              type="submit"
              form="checkout-form"
              disabled={submitting}
              className="w-full bg-slate-900 text-white font-bold py-4 px-6 rounded-2xl hover:bg-slate-800 transition-all text-sm uppercase tracking-wider shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 flex justify-center items-center mt-6"
            >
              {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : paymentMethod === 'ONLINE' ? `Pay ₹${grandTotal}` : paymentMethod === 'DIRECT_UPI' ? `Place Order (Pending Verification)` : `Place Order (COD)`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
