import React, { useState, useEffect } from 'react';
import { useSettings } from '../../lib/settingsContext';
import { Save, Loader2 } from 'lucide-react';

export default function Homepage() {
  const { settings, updateSettings, loading } = useSettings();
  const [formData, setFormData] = useState(settings);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    setFormData(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await updateSettings(formData);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setMessage('Failed to save settings.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="pb-12 max-w-4xl">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Homepage Management</h1>
          <p className="text-slate-500">Configure global settings like announcements, newsletters and footers.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-[#0b382d] hover:bg-[#07241d] text-white px-6 py-2.5 rounded-xl font-bold transition-colors flex items-center gap-2"
        >
          {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
          Save Changes
        </button>
      </div>

      {message && (
        <div className={`p-4 mb-6 rounded-xl font-bold ${message.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-600'}`}>
          {message}
        </div>
      )}

      <div className="space-y-8">
        {/* Announcement Bar */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">Announcement Bar</h2>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" name="announcementEnabled" checked={formData.announcementEnabled} onChange={handleChange} className="sr-only" />
                <div className={`block w-10 h-6 rounded-full transition-colors ${formData.announcementEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.announcementEnabled ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-slate-700">Enable</span>
            </label>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Announcement Text</label>
            <input 
              type="text" 
              name="announcementText"
              value={formData.announcementText || ''} 
              onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0b382d] outline-none"
              placeholder="e.g. Free Shipping on Orders ₹999+"
            />
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold text-slate-900">Newsletter Section</h2>
            <label className="flex items-center cursor-pointer">
              <div className="relative">
                <input type="checkbox" name="newsletterEnabled" checked={formData.newsletterEnabled} onChange={handleChange} className="sr-only" />
                <div className={`block w-10 h-6 rounded-full transition-colors ${formData.newsletterEnabled ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                <div className={`absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.newsletterEnabled ? 'transform translate-x-4' : ''}`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-slate-700">Enable</span>
            </label>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Headline</label>
              <input 
                type="text" 
                name="newsletterHeadline"
                value={formData.newsletterHeadline || ''} 
                onChange={handleChange}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0b382d] outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Description text</label>
              <textarea 
                name="newsletterText"
                value={formData.newsletterText || ''} 
                onChange={handleChange}
                rows={2}
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0b382d] outline-none resize-none"
              />
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
