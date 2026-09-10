import React, { useState, useEffect } from 'react';
import { useSettings } from '../../lib/settingsContext';
import { Save, Loader2, CreditCard, Banknote, Smartphone, ShieldCheck, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function PaymentSettings() {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState(settings?.paymentSettings || {
    codEnabled: true,
    codMaxAmount: 10000,
    codFee: 0,
    onlineEnabled: false,
    upiEnabled: false,
    cardEnabled: false,
    netBankingEnabled: false,
    minOrderAmount: 0,
    paymentInstructions: "",
    razorpayKey: "",
        testMode: true,
    directUpiEnabled: false,
    directUpiId: "",
    directUpiName: "",
    directUpiQr: ""
  });
  
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (settings?.paymentSettings) {
      setFormData(settings.paymentSettings);
    }
  }, [settings]);

  if (loading) return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : type === 'number' ? Number(value) : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateSettings({ paymentSettings: formData });
      setMessage('Payment settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-12 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Payment Management</h1>
          <p className="text-slate-500">Configure payment gateways, COD, and checkout rules.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold transition-colors hover:bg-indigo-700 flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-xl font-bold flex items-center gap-2 ${message.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {message.includes('Failed') ? <AlertCircle className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
          {message}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 mb-8">
        {/* COD Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Banknote className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Cash on Delivery</h2>
              <p className="text-sm text-slate-500">Pay on doorstep</p>
            </div>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="codEnabled" checked={formData.codEnabled} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Minimum Order Amount</label>
              <input type="number" name="minOrderAmount" value={formData.minOrderAmount} onChange={handleChange} className="w-full rounded-xl border-slate-300 p-2.5 border focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Maximum Order Amount</label>
              <input type="number" name="codMaxAmount" value={formData.codMaxAmount || ''} onChange={handleChange} className="w-full rounded-xl border-slate-300 p-2.5 border focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">COD Fee</label>
              <input type="number" name="codFee" value={formData.codFee || ''} onChange={handleChange} className="w-full rounded-xl border-slate-300 p-2.5 border focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Direct UPI Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Direct UPI Payment</h2>
              <p className="text-sm text-slate-500">Customers pay directly to your UPI ID</p>
            </div>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="directUpiEnabled" checked={formData.directUpiEnabled} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">UPI ID / VPA</label>
              <input type="text" name="directUpiId" value={formData.directUpiId || ''} onChange={handleChange} disabled={!formData.directUpiEnabled} placeholder="e.g. name@upi" className="w-full rounded-xl border-slate-300 p-2.5 border focus:ring-2 focus:ring-indigo-500 outline-none" />
              <p className="text-xs text-slate-500 mt-1">Enter your valid UPI ID here, for example name@upi.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">UPI Display Name</label>
              <input type="text" name="directUpiName" value={formData.directUpiName || ''} onChange={handleChange} disabled={!formData.directUpiEnabled} placeholder="e.g. SwiftStore" className="w-full rounded-xl border-slate-300 p-2.5 border focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">UPI QR Code URL (Optional)</label>
              <input type="text" name="directUpiQr" value={formData.directUpiQr || ''} onChange={handleChange} disabled={!formData.directUpiEnabled} placeholder="https://example.com/qr.png" className="w-full rounded-xl border-slate-300 p-2.5 border focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
        </div>

        {/* Razorpay Settings */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">Online Payments (Razorpay)</h2>
              <p className="text-sm text-slate-500">Automated payment gateway for Cards, Net Banking, wallets</p>
            </div>
            <div className="ml-auto">
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" name="onlineEnabled" checked={formData.onlineEnabled} onChange={handleChange} className="sr-only peer" />
                <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
              </label>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Razorpay Key ID</label>
              <input type="text" name="razorpayKey" value={formData.razorpayKey} onChange={handleChange} disabled={!formData.onlineEnabled} placeholder="rzp_..." className="w-full rounded-xl border-slate-300 p-2.5 border focus:ring-2 focus:ring-indigo-500 outline-none" />
              <p className="text-xs text-slate-500 mt-1">Use Razorpay API credentials here. Do not enter your UPI ID.</p>
            </div>
            
          </div>

          <div className="flex items-center gap-2 mb-6">
             <input type="checkbox" name="testMode" checked={formData.testMode} onChange={handleChange} id="testMode" className="w-4 h-4 text-indigo-600 rounded" />
             <label htmlFor="testMode" className="text-sm font-medium text-slate-700">Enable Test Mode (Sandbox)</label>
          </div>

          <p className="text-sm font-bold text-slate-900 mb-3">Allowed Online Methods:</p>
          <div className="space-y-4">
            <label className="flex items-center gap-3 p-3 border rounded-xl hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" name="upiEnabled" checked={formData.upiEnabled} onChange={handleChange} disabled={!formData.onlineEnabled} className="w-4 h-4 text-indigo-600 rounded" />
              <div className="flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-slate-500" />
                <span className="font-medium text-slate-700">Razorpay UPI Flow</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-xl hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" name="cardEnabled" checked={formData.cardEnabled} onChange={handleChange} disabled={!formData.onlineEnabled} className="w-4 h-4 text-indigo-600 rounded" />
              <div className="flex items-center gap-2">
                <CreditCard className="w-4 h-4 text-slate-500" />
                <span className="font-medium text-slate-700">Credit / Debit Cards</span>
              </div>
            </label>
            <label className="flex items-center gap-3 p-3 border rounded-xl hover:bg-slate-50 cursor-pointer">
              <input type="checkbox" name="netBankingEnabled" checked={formData.netBankingEnabled} onChange={handleChange} disabled={!formData.onlineEnabled} className="w-4 h-4 text-indigo-600 rounded" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-slate-500" />
                <span className="font-medium text-slate-700">Net Banking</span>
              </div>
            </label>
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <h2 className="text-lg font-bold text-slate-900 mb-4">Customer Payment Instructions</h2>
        <textarea name="paymentInstructions" value={formData.paymentInstructions} onChange={handleChange} rows={3} className="w-full rounded-xl border-slate-300 p-2.5 border focus:ring-2 focus:ring-indigo-500 outline-none resize-none" placeholder="Enter instructions for customers on the checkout page..." />
      </div>

    </div>
  );
}
