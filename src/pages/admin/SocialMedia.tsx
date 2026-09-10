import React, { useState, useEffect } from 'react';
import { useSettings } from '../../lib/settingsContext';
import { Save, AlertCircle, CheckCircle2, Send, MessageCircle, Edit, ExternalLink, X, Trash2 } from 'lucide-react';
import { FaInstagram as Instagram, FaFacebook as Facebook, FaYoutube as Youtube, FaTwitter as Twitter, FaPinterest as Pin, FaLinkedin as Linkedin } from 'react-icons/fa';

export default function SocialMedia() {
  const { settings, updateSettings } = useSettings();
  
  const [socialData, setSocialData] = useState<Record<string, { url: string, enabled: boolean }>>({});
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  
  const [editingPlatform, setEditingPlatform] = useState<string | null>(null);
  const [editUrl, setEditUrl] = useState('');
  const [editEnabled, setEditEnabled] = useState(false);

  const platforms = [
    { id: 'instagram', name: 'Instagram', icon: Instagram },
    { id: 'facebook', name: 'Facebook', icon: Facebook },
    { id: 'youtube', name: 'YouTube', icon: Youtube },
    { id: 'twitter', name: 'X / Twitter', icon: Twitter },
    { id: 'telegram', name: 'Telegram', icon: Send },
    { id: 'whatsapp', name: 'WhatsApp', icon: MessageCircle },
    { id: 'pinterest', name: 'Pinterest', icon: Pin },
    { id: 'linkedin', name: 'LinkedIn', icon: Linkedin }
  ];

  useEffect(() => {
    if (settings?.socialLinks) {
      setSocialData(settings.socialLinks);
    } else {
      // initialize empty
      const initial: any = {};
      platforms.forEach(p => {
        initial[p.id] = { url: '', enabled: false };
      });
      setSocialData(initial);
    }
  }, [settings]);

  const handleSaveAll = async () => {
    setSaving(true);
    setErrorMsg('');
    setSuccessMsg('');
    
    // Simple URL validation
    let hasError = false;
    for (const key in socialData) {
      const { url, enabled } = socialData[key];
      if (enabled && url && !url.startsWith('http')) {
        hasError = true;
        setErrorMsg(`Invalid URL for ${platforms.find(p => p.id === key)?.name}. URLs must start with http or https.`);
        break;
      }
    }
    
    if (hasError) {
      setSaving(false);
      return;
    }

    try {
      await updateSettings({
        socialLinks: socialData
      });
      setSuccessMsg('All social media links saved successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      setErrorMsg('Failed to save settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (id: string) => {
    setEditingPlatform(id);
    setEditUrl(socialData[id]?.url || '');
    setEditEnabled(socialData[id]?.enabled || false);
  };

  const handleSaveSingle = async () => {
    if (!editingPlatform) return;
    
    if (editEnabled && editUrl && !editUrl.startsWith('http')) {
      setErrorMsg(`Invalid URL. It must start with http or https.`);
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    const updatedData = {
      ...socialData,
      [editingPlatform]: { url: editUrl, enabled: editEnabled }
    };
    
    setSocialData(updatedData);
    setEditingPlatform(null);
    
    // Auto-save when single item is saved
    try {
      setSaving(true);
      await updateSettings({ socialLinks: updatedData });
      setSuccessMsg(`${platforms.find(p => p.id === editingPlatform)?.name} saved successfully!`);
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch(err) {
      setErrorMsg('Failed to save.');
    } finally {
      setSaving(false);
    }
  };

  const handleRemove = (id: string) => {
    if (window.confirm(`Are you sure you want to remove the ${platforms.find(p => p.id === id)?.name} link?`)) {
      const updatedData = {
        ...socialData,
        [id]: { url: '', enabled: false }
      };
      setSocialData(updatedData);
      
      // Auto-save
      updateSettings({ socialLinks: updatedData });
    }
  };

  const handleToggle = (id: string) => {
    const current = socialData[id];
    const updatedData = {
      ...socialData,
      [id]: { ...current, enabled: !current?.enabled }
    };
    setSocialData(updatedData);
    // Auto save on toggle
    updateSettings({ socialLinks: updatedData });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">Social Media Management</h1>
          <p className="text-slate-500 font-medium mt-1">Manage your store's social media links.</p>
        </div>
        <button 
          onClick={handleSaveAll} 
          disabled={saving}
          className="bg-[#0b382d] text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-emerald-900 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {saving ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Save className="w-4 h-4" />}
          Save All Changes
        </button>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5" />
          <span className="font-bold">{successMsg}</span>
        </div>
      )}

      {errorMsg && !editingPlatform && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            <span className="font-bold">{errorMsg}</span>
          </div>
          <button onClick={() => setErrorMsg('')} className="p-1 hover:bg-red-100 rounded-lg"><X className="w-5 h-5"/></button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {platforms.map(platform => {
          const data = socialData[platform.id] || { url: '', enabled: false };
          const Icon = platform.icon;
          const hasUrl = !!data.url;
          
          return (
            <div key={platform.id} className={`bg-white rounded-[2rem] p-6 border ${data.enabled ? 'border-[#0b382d]/30 shadow-sm' : 'border-slate-100 opacity-70 hover:opacity-100'} transition-all flex flex-col justify-between h-full`}>
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${data.enabled ? 'bg-[#0b382d]/5 text-[#0b382d]' : 'bg-slate-50 text-slate-400'}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900">{platform.name}</h3>
                    <div className="flex items-center mt-1">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" checked={data.enabled} onChange={() => handleToggle(platform.id)} />
                        <div className="w-8 h-4 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#25D366]"></div>
                        <span className="ml-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{data.enabled ? 'Enabled' : 'Disabled'}</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-1">URL</p>
                <div className="text-sm font-medium text-slate-900 truncate">
                  {hasUrl ? data.url : <span className="text-slate-400 italic">No URL configured</span>}
                </div>
              </div>
              
              <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
                <button 
                  onClick={() => openEditModal(platform.id)}
                  className="flex-1 py-2.5 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" /> Edit
                </button>
                
                {hasUrl && (
                  <a 
                    href={data.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 bg-slate-50 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <ExternalLink className="w-4 h-4" /> Test
                  </a>
                )}
                
                {hasUrl && (
                  <button 
                    onClick={() => handleRemove(platform.id)}
                    className="p-2.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-xl transition-colors shrink-0"
                    title="Remove Link"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Modal */}
      {editingPlatform && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                {(() => {
                  const p = platforms.find(p => p.id === editingPlatform);
                  if (p) {
                    const Icon = p.icon;
                    return (
                      <>
                        <div className="bg-white p-2 rounded-lg shadow-sm">
                          <Icon className="w-5 h-5 text-[#0b382d]" />
                        </div>
                        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">Edit {p.name}</h2>
                      </>
                    )
                  }
                })()}
              </div>
              <button onClick={() => setEditingPlatform(null)} className="p-2 text-slate-400 hover:bg-white rounded-full transition-colors shadow-sm">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6">
              {errorMsg && (
                <div className="mb-4 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-xl">
                  {errorMsg}
                </div>
              )}
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Platform URL</label>
                  <input 
                    type="url" 
                    value={editUrl} 
                    onChange={e => setEditUrl(e.target.value)} 
                    className="w-full rounded-xl border-slate-200 shadow-sm focus:border-[#0b382d] focus:ring-[#0b382d] p-3 bg-slate-50 focus:bg-white transition-colors font-medium" 
                    placeholder={`https://${editingPlatform}.com/yourstore`}
                  />
                  <p className="text-xs text-slate-500 mt-2 font-medium">Must include https://</p>
                </div>
                
                <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900">Enable on store</span>
                    <span className="text-xs text-slate-500 font-medium">Show this icon to customers</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" checked={editEnabled} onChange={e => setEditEnabled(e.target.checked)} />
                    <div className="w-12 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#25D366]"></div>
                  </label>
                </div>
              </div>
              
              <div className="mt-8 flex gap-3">
                <button onClick={() => setEditingPlatform(null)} className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-slate-200 transition-colors">
                  Cancel
                </button>
                <button onClick={handleSaveSingle} disabled={saving} className="flex-1 py-3 bg-[#0b382d] text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-emerald-900 transition-colors shadow-lg">
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
