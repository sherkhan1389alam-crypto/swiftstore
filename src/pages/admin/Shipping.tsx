import React, { useState, useEffect } from 'react';
import { useSettings } from '../../lib/settingsContext';
import { Truck, Save, Plus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function Shipping() {
  const { settings, updateSettings } = useSettings();
  
  const [enabled, setEnabled] = useState(true);
  const [freeShippingEnabled, setFreeShippingEnabled] = useState(true);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(999);
  const [flatShippingCharge, setFlatShippingCharge] = useState(79);
  
  const [standardDeliveryDays, setStandardDeliveryDays] = useState(7);
  const [minDeliveryDays, setMinDeliveryDays] = useState(5);
  const [maxDeliveryDays, setMaxDeliveryDays] = useState(7);
  
  const [expressDeliveryEnabled, setExpressDeliveryEnabled] = useState(false);
  const [expressDeliveryDays, setExpressDeliveryDays] = useState(3);
  const [expressShippingCharge, setExpressShippingCharge] = useState(149);
  
  const [countWeekendsInDelivery, setCountWeekendsInDelivery] = useState(true);
  
  const [serviceablePincodes, setServiceablePincodes] = useState('');
  
  const [couriers, setCouriers] = useState<any[]>([]);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (settings?.shippingSettings) {
      setEnabled(settings.shippingSettings.enabled ?? true);
      setFreeShippingEnabled(settings.shippingSettings.freeShippingEnabled ?? true);
      setFreeShippingThreshold(settings.shippingSettings.freeShippingThreshold ?? 999);
      setFlatShippingCharge(settings.shippingSettings.flatShippingCharge ?? 79);
      setStandardDeliveryDays(settings.shippingSettings.standardDeliveryDays ?? 7);
      setMinDeliveryDays(settings.shippingSettings.minDeliveryDays ?? 5);
      setMaxDeliveryDays(settings.shippingSettings.maxDeliveryDays ?? 7);
      setExpressDeliveryEnabled(settings.shippingSettings.expressDeliveryEnabled ?? false);
      setExpressDeliveryDays(settings.shippingSettings.expressDeliveryDays ?? 3);
      setExpressShippingCharge(settings.shippingSettings.expressShippingCharge ?? 149);
      setCountWeekendsInDelivery(settings.shippingSettings.countWeekendsInDelivery ?? true);
      setServiceablePincodes(settings.shippingSettings.serviceablePincodes || '');
      setCouriers(settings.shippingSettings.couriers || []);
    }
  }, [settings]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      await updateSettings({
        shippingSettings: {
          enabled,
          freeShippingEnabled,
          freeShippingThreshold,
          flatShippingCharge,
          standardDeliveryDays,
          minDeliveryDays,
          maxDeliveryDays,
          expressDeliveryEnabled,
          expressDeliveryDays,
          expressShippingCharge,
          countWeekendsInDelivery,
          serviceablePincodes,
          couriers
        }
      });
      setMessage('Shipping settings saved successfully!');
    } catch (err) {
      console.error(err);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const addCourier = () => {
    setCouriers([...couriers, { id: Date.now().toString(), name: '', website: '', trackingUrlFormat: '', contactNumber: '', active: true }]);
  };

  const updateCourier = (id: string, field: string, value: any) => {
    setCouriers(couriers.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const removeCourier = (id: string) => {
    setCouriers(couriers.filter(c => c.id !== id));
  };

  return (
    <div className="pb-12 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Shipping & Delivery</h1>
        <p className="text-slate-500 mt-1">Configure shipping rules, delivery estimates, and couriers.</p>
      </div>
      
      {message && (
        <div className={`p-4 mb-6 rounded-xl flex items-center gap-2 font-medium ${message.includes('success') ? 'bg-emerald-50 text-emerald-800' : 'bg-red-50 text-red-800'}`}>
          {message.includes('success') ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          {message}
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Delivery Estimates */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Delivery Estimates</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Standard Delivery (Days)</label>
              <input type="number" min="0" value={standardDeliveryDays} onChange={e => setStandardDeliveryDays(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              <p className="text-xs text-slate-500 mt-1">Base value added to the order date.</p>
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Minimum Delivery (Days) - Optional</label>
              <input type="number" min="0" value={minDeliveryDays || ''} onChange={e => setMinDeliveryDays(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
            </div>
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Maximum Delivery (Days) - Optional</label>
              <input type="number" min="0" value={maxDeliveryDays || ''} onChange={e => setMaxDeliveryDays(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
            </div>
          </div>
          
          <div className="flex items-center gap-3">
             <input type="checkbox" checked={countWeekendsInDelivery} onChange={e => setCountWeekendsInDelivery(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300" id="count-weekends"/>
             <label htmlFor="count-weekends" className="text-sm font-bold text-slate-900">Count weekends in delivery estimate</label>
          </div>
        </div>

        {/* Shipping Rates */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Standard Shipping Fees</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={enabled} onChange={e => setEnabled(e.target.checked)} />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="flex items-center gap-2 mb-2">
                <input type="checkbox" checked={freeShippingEnabled} onChange={e => setFreeShippingEnabled(e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                <span className="text-sm font-bold text-slate-900">Enable Free Shipping</span>
              </label>
              <p className="text-xs text-slate-500 ml-6">Offer free shipping based on cart total.</p>
            </div>
            {freeShippingEnabled && (
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Free Shipping Above (₹)</label>
                <input type="number" min="0" value={freeShippingThreshold} onChange={e => setFreeShippingThreshold(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              </div>
            )}
            <div>
              <label className="block text-sm font-bold text-slate-900 mb-1">Standard Shipping Fee (₹)</label>
              <input type="number" min="0" value={flatShippingCharge} onChange={e => setFlatShippingCharge(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              <p className="text-xs text-slate-500 mt-1">Applied if order is below free shipping threshold.</p>
            </div>
          </div>
        </div>

        {/* Express Shipping */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
            <h3 className="text-lg font-bold text-slate-900">Express Delivery (Optional)</h3>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" checked={expressDeliveryEnabled} onChange={e => setExpressDeliveryEnabled(e.target.checked)} />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
          
          {expressDeliveryEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Express Delivery Time (Days)</label>
                <input type="number" min="0" value={expressDeliveryDays} onChange={e => setExpressDeliveryDays(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1">Express Shipping Fee (₹)</label>
                <input type="number" min="0" value={expressShippingCharge} onChange={e => setExpressShippingCharge(Number(e.target.value))} className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium" />
              </div>
            </div>
          )}
        </div>

        {/* Serviceable PIN Codes */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Service Areas</h3>
          <div>
             <label className="block text-sm font-bold text-slate-900 mb-1">Serviceable PIN Codes (Optional)</label>
             <p className="text-xs text-slate-500 mb-3">Leave blank for All India delivery. To restrict delivery, enter comma-separated PIN codes (e.g., 400001, 110001).</p>
             <textarea
                value={serviceablePincodes}
                onChange={e => setServiceablePincodes(e.target.value)}
               rows={4}
                className="w-full rounded-xl border border-slate-300 p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none font-medium text-sm"
               placeholder="Enter PIN codes separated by comma..."
             />
          </div>
        </div>

        {/* Shipping Partners */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6">
          <h3 className="text-lg font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Shipping Partners (Couriers)</h3>
          
          <div className="space-y-4">
            {couriers.map((courier, index) => (
              <div key={courier.id} className="p-4 border border-slate-200 rounded-xl bg-slate-50 relative">
                <button type="button" onClick={() => removeCourier(courier.id)} className="absolute top-4 right-4 p-1 text-red-500 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4"/></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mr-8">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Courier Name *</label>
                    <input type="text" value={courier.name} onChange={e => updateCourier(courier.id, 'name', e.target.value)} required className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none bg-white" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tracking URL Format (Add tracking # at end)</label>
                    <input type="url" value={courier.trackingUrlFormat} onChange={e => updateCourier(courier.id, 'trackingUrlFormat', e.target.value)} className="w-full rounded-lg border border-slate-300 p-2 text-sm outline-none bg-white" placeholder="https://courier.com/track?id=" />
                  </div>
                  <div>
                     <label className="flex items-center gap-2 mt-2">
                       <input type="checkbox" checked={courier.active} onChange={e => updateCourier(courier.id, 'active', e.target.checked)} className="w-4 h-4 text-indigo-600 rounded border-slate-300" />
                       <span className="text-sm font-bold text-slate-700">Active</span>
                     </label>
                  </div>
                </div>
              </div>
            ))}
            
            <button type="button" onClick={addCourier} className="text-sm font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-4 py-2 rounded-lg transition-colors">
              <Plus className="w-4 h-4" /> Add Courier
            </button>
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button type="submit" disabled={saving} className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2 shadow-sm disabled:opacity-70">
            {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <Save className="w-5 h-5" />}
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
