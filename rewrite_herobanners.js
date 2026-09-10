import fs from 'fs';

const content = `import React, { useState, useEffect } from 'react';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { HeroBanner } from '../../lib/types';
import { Plus, Edit, Trash2, Loader2, X, Image as ImageIcon, Camera, Monitor, Tablet, Smartphone, CheckCircle2 } from 'lucide-react';
import ImageCropper from '../../components/ImageCropper';

export default function HeroBanners() {
  const [banners, setBanners] = useState<HeroBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);

  // Form State
  const [heading, setHeading] = useState('');
  const [subheading, setSubheading] = useState('');
  
  const [desktopImageUrl, setDesktopImageUrl] = useState('');
  const [tabletImageUrl, setTabletImageUrl] = useState('');
  const [mobileImageUrl, setMobileImageUrl] = useState('');
  
  const [buttonText, setButtonText] = useState('');
  const [buttonLink, setButtonLink] = useState('');
  const [status, setStatus] = useState<'ENABLED' | 'DISABLED'>('ENABLED');
  const [order, setOrder] = useState(0);
  
  const [activeTab, setActiveTab] = useState<'DESKTOP' | 'TABLET' | 'MOBILE'>('DESKTOP');
  const [cropTarget, setCropTarget] = useState<'DESKTOP' | 'TABLET' | 'MOBILE'>('DESKTOP');

  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [error, setError] = useState('');
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'heroBanners'));
      const bannersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as HeroBanner[];
      
      bannersData.sort((a, b) => (a.order || 0) - (b.order || 0));
      setBanners(bannersData);
    } catch (error) {
      console.error('Error fetching banners:', error);
    } finally {
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setEditingBanner(null);
    setHeading('');
    setSubheading('');
    setDesktopImageUrl('');
    setTabletImageUrl('');
    setMobileImageUrl('');
    setButtonText('');
    setButtonLink('');
    setStatus('ENABLED');
    setOrder(banners.length > 0 ? (banners[banners.length - 1].order || 0) + 10 : 0);
    setActiveTab('DESKTOP');
    setShowAddModal(true);
  };

  const openEditModal = (banner: HeroBanner) => {
    setEditingBanner(banner);
    setHeading(banner.heading || '');
    setSubheading(banner.subheading || '');
    
    // Support legacy imageUrl
    setDesktopImageUrl(banner.desktopImageUrl || banner.imageUrl || '');
    setTabletImageUrl(banner.tabletImageUrl || '');
    setMobileImageUrl(banner.mobileImageUrl || '');
    
    setButtonText(banner.buttonText || '');
    setButtonLink(banner.buttonLink || '');
    setStatus(banner.status || 'ENABLED');
    setOrder(banner.order || 0);
    setActiveTab('DESKTOP');
    setShowAddModal(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this banner?")) {
      await deleteDoc(doc(db, 'heroBanners', id));
      fetchBanners();
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'DESKTOP' | 'TABLET' | 'MOBILE') => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum size is 10MB.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setCropTarget(target);
      setCropImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    e.target.value = '';
  };

  const handleCropComplete = (croppedBase64: string) => {
    setCropImageSrc(null);
    if (cropTarget === 'DESKTOP') setDesktopImageUrl(croppedBase64);
    if (cropTarget === 'TABLET') setTabletImageUrl(croppedBase64);
    if (cropTarget === 'MOBILE') setMobileImageUrl(croppedBase64);
  };

  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desktopImageUrl && !tabletImageUrl && !mobileImageUrl) {
      setError("Please upload at least one banner image");
      return;
    }
    
    const checkSize = (url: string) => Math.ceil((url.length * 3) / 4) > 1048576;
    if (desktopImageUrl && checkSize(desktopImageUrl)) {
      setError('Desktop image is too large (over 1MB). Please try cropping a smaller area.');
      return;
    }
    if (tabletImageUrl && checkSize(tabletImageUrl)) {
      setError('Tablet image is too large (over 1MB). Please try cropping a smaller area.');
      return;
    }
    if (mobileImageUrl && checkSize(mobileImageUrl)) {
      setError('Mobile image is too large (over 1MB). Please try cropping a smaller area.');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const bannerData = { 
        heading, 
        subheading, 
        imageUrl: desktopImageUrl || tabletImageUrl || mobileImageUrl, // Fallback for old code
        desktopImageUrl,
        tabletImageUrl,
        mobileImageUrl,
        buttonText,
        buttonLink,
        status, 
        order
      };
      
      if (editingBanner) {
        await updateDoc(doc(db, 'heroBanners', editingBanner.id), bannerData);
      } else {
        await addDoc(collection(db, 'heroBanners'), bannerData);
      }
      
      setShowAddModal(false);
      setSuccessMessage('Banner saved successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      fetchBanners();
    } catch (err) {
      console.error('Error saving banner', err);
      setError('Failed to save banner. Please try again.');
    } finally {
      setSaving(false);
    }
  };
  
  const renderImageUploader = (target: 'DESKTOP' | 'TABLET' | 'MOBILE') => {
    let currentImage = '';
    let aspectClass = '';
    let previewTitle = '';
    
    if (target === 'DESKTOP') {
      currentImage = desktopImageUrl;
      aspectClass = 'aspect-[21/9] md:aspect-[2.5/1]';
      previewTitle = 'Desktop';
    } else if (target === 'TABLET') {
      currentImage = tabletImageUrl;
      aspectClass = 'aspect-video';
      previewTitle = 'Tablet';
    } else {
      currentImage = mobileImageUrl;
      aspectClass = 'aspect-[4/5]';
      previewTitle = 'Mobile';
    }

    return (
      <div className="space-y-4">
        {currentImage ? (
          <div className={\`relative \${aspectClass} rounded-2xl overflow-hidden border border-slate-200 group bg-slate-50 shadow-inner\`}>
            <img src={currentImage} alt={\`\${previewTitle} Preview\`} className="h-full w-full object-cover object-center" />
            <div className="absolute top-3 left-3 bg-black/60 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider backdrop-blur-md z-10 flex items-center gap-1.5">
              {target === 'DESKTOP' && <Monitor className="w-3 h-3" />}
              {target === 'TABLET' && <Tablet className="w-3 h-3" />}
              {target === 'MOBILE' && <Smartphone className="w-3 h-3" />}
              {previewTitle}
            </div>
            
            <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 z-0">
              {subheading && <span className="inline-block bg-white text-[#0b382d] text-[10px] font-bold px-3 py-1.5 rounded-full tracking-[0.2em] uppercase mb-3 shadow-sm">{subheading}</span>}
              <h3 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight mb-4 drop-shadow-lg max-w-lg">{heading || 'Heading'}</h3>
              {buttonText && <span className="bg-[#0b382d] text-white px-5 py-2.5 rounded-full font-bold text-[10px] sm:text-xs tracking-widest uppercase shadow-md">{buttonText}</span>}
            </div>

            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-sm z-20">
              <label className="cursor-pointer bg-white text-slate-900 px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 hover:bg-slate-100 transition-colors shadow-lg hover:scale-105 active:scale-95">
                <Camera className="w-4 h-4" /> Change Image
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleImageUpload(e, target)} disabled={saving} />
              </label>
              <button 
                type="button" 
                onClick={() => {
                  if (target === 'DESKTOP') setDesktopImageUrl('');
                  if (target === 'TABLET') setTabletImageUrl('');
                  if (target === 'MOBILE') setMobileImageUrl('');
                }} 
                className="bg-red-600/90 backdrop-blur text-white px-6 py-3 rounded-full text-xs font-bold uppercase tracking-wider hover:bg-red-700 transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                Remove
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-64 border-2 border-slate-200 border-dashed rounded-2xl cursor-pointer bg-slate-50 hover:bg-slate-100 hover:border-[#0b382d]/30 transition-colors group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              {saving ? (
                 <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-3" />
              ) : (
                <>
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {target === 'DESKTOP' && <Monitor className="w-8 h-8 text-slate-400 group-hover:text-[#0b382d] transition-colors" />}
                    {target === 'TABLET' && <Tablet className="w-8 h-8 text-slate-400 group-hover:text-[#0b382d] transition-colors" />}
                    {target === 'MOBILE' && <Smartphone className="w-8 h-8 text-slate-400 group-hover:text-[#0b382d] transition-colors" />}
                  </div>
                  <p className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-1">Upload {previewTitle} Banner</p>
                  <p className="text-xs text-slate-400 font-medium">Click to browse (JPG, PNG, WEBP)</p>
                </>
              )}
            </div>
            <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={(e) => handleImageUpload(e, target)} disabled={saving} />
          </label>
        )}
      </div>
    );
  };

  return (
    <>
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight uppercase">Hero Banners</h1>
          <p className="text-slate-500 font-medium mt-1">Manage the carousel banners on your homepage.</p>
        </div>
        <button onClick={openAddModal} className="bg-[#0b382d] hover:bg-emerald-900 text-white px-6 py-3 rounded-full font-bold uppercase tracking-wider text-xs transition-colors shadow-lg shadow-emerald-900/20 flex items-center gap-2">
          <Plus className="h-4 w-4" /> Add Banner
        </button>
      </div>
      
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center justify-between">
          <span className="font-bold">{successMessage}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center p-12">
          <Loader2 className="w-8 h-8 animate-spin text-[#0b382d]" />
        </div>
      ) : (
        <div className="grid gap-6">
          {banners.map(banner => (
            <div key={banner.id} className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col md:flex-row items-center gap-6">
              <div className="w-full md:w-64 h-32 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-200 relative">
                {banner.desktopImageUrl || banner.imageUrl ? (
                  <img src={banner.desktopImageUrl || banner.imageUrl} alt={banner.heading} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                  </div>
                )}
                {/* Device indicators */}
                <div className="absolute bottom-2 right-2 flex gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full shadow-sm">
                   <Monitor className={\`w-3 h-3 \${(banner.desktopImageUrl || banner.imageUrl) ? 'text-[#0b382d]' : 'text-slate-300'}\`} />
                   <Tablet className={\`w-3 h-3 \${banner.tabletImageUrl ? 'text-[#0b382d]' : 'text-slate-300'}\`} />
                   <Smartphone className={\`w-3 h-3 \${banner.mobileImageUrl ? 'text-[#0b382d]' : 'text-slate-300'}\`} />
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className={\`text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider \${banner.status === 'ENABLED' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}\`}>
                    {banner.status}
                  </span>
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Order: {banner.order}</span>
                </div>
                <h3 className="text-lg font-extrabold text-slate-900">{banner.heading}</h3>
                {banner.subheading && <p className="text-sm text-slate-500 font-medium">{banner.subheading}</p>}
                
                {banner.buttonText && (
                  <div className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#0b382d] bg-[#0b382d]/5 px-3 py-1.5 rounded-lg border border-[#0b382d]/10">
                    {banner.buttonText} &rarr; {banner.buttonLink}
                  </div>
                )}
              </div>
              <div className="flex md:flex-col gap-2 w-full md:w-auto">
                <button onClick={() => openEditModal(banner)} className="flex-1 p-2 text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                  <Edit className="h-4 w-4" /> Edit
                </button>
                <button onClick={() => handleDelete(banner.id)} className="flex-1 p-2 text-slate-400 hover:text-red-600 bg-slate-50 hover:bg-red-50 rounded-lg transition-colors text-sm font-semibold flex items-center justify-center gap-2">
                  <Trash2 className="h-4 w-4" /> Delete
                </button>
              </div>
            </div>
          ))}
          {banners.length === 0 && (
            <div className="p-12 text-center text-slate-500 bg-white rounded-3xl border border-slate-100 border-dashed">
              No banners found. Create your first banner to show on the homepage.
            </div>
          )}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white sticky top-0 z-10">
              <h2 className="text-xl font-extrabold text-slate-900 uppercase tracking-tight">{editingBanner ? 'Edit Banner' : 'Add Banner'}</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 p-2 rounded-full transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto">
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-sm">{error}</span>
                  <button type="button" onClick={() => setError('')} className="p-1 hover:bg-red-100 rounded-lg"><X className="w-5 h-5"/></button>
                </div>
              )}
              
              <form id="bannerForm" onSubmit={handleSaveBanner} className="space-y-8">
                
                {/* Independent Device Banner Uploads */}
                <div className="bg-white border border-slate-200 rounded-[1.5rem] overflow-hidden shadow-sm">
                  {/* Tabs */}
                  <div className="flex border-b border-slate-200 bg-slate-50 p-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('DESKTOP')}
                      className={\`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all \${activeTab === 'DESKTOP' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}\`}
                    >
                      <Monitor className={\`w-4 h-4 \${activeTab === 'DESKTOP' ? 'text-[#0b382d]' : ''}\`} /> Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('TABLET')}
                      className={\`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all \${activeTab === 'TABLET' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}\`}
                    >
                      <Tablet className={\`w-4 h-4 \${activeTab === 'TABLET' ? 'text-[#0b382d]' : ''}\`} /> Tablet
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveTab('MOBILE')}
                      className={\`flex-1 py-3 px-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider transition-all \${activeTab === 'MOBILE' ? 'bg-white text-slate-900 shadow-sm border border-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-700'}\`}
                    >
                      <Smartphone className={\`w-4 h-4 \${activeTab === 'MOBILE' ? 'text-[#0b382d]' : ''}\`} /> Mobile
                    </button>
                  </div>
                  
                  <div className="p-6">
                    {activeTab === 'DESKTOP' && renderImageUploader('DESKTOP')}
                    {activeTab === 'TABLET' && renderImageUploader('TABLET')}
                    {activeTab === 'MOBILE' && renderImageUploader('MOBILE')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Heading</label>
                    <input type="text" value={heading} onChange={e => setHeading(e.target.value)} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Style Better. Live Better." />
                  </div>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Subheading</label>
                    <input type="text" value={subheading} onChange={e => setSubheading(e.target.value)} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Discover premium products..." />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Button Text</label>
                    <input type="text" value={buttonText} onChange={e => setButtonText(e.target.value)} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. Shop Now" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Button Link</label>
                    <input type="text" value={buttonLink} onChange={e => setButtonLink(e.target.value)} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3 bg-slate-50 focus:bg-white transition-colors" placeholder="e.g. /shop" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value as any)} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3 bg-slate-50 focus:bg-white transition-colors">
                      <option value="ENABLED">Active</option>
                      <option value="DISABLED">Disabled</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-900 uppercase tracking-widest mb-2">Display Order</label>
                    <input type="number" value={order} onChange={e => setOrder(Number(e.target.value))} className="w-full rounded-xl border-slate-200 shadow-sm focus:border-slate-900 focus:ring-slate-900 p-3 bg-slate-50 focus:bg-white transition-colors" />
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 sticky bottom-0 z-10 flex flex-col sm:flex-row justify-between items-center gap-4">
              {/* Upload Status Indicators */}
              <div className="flex gap-4">
                 <div className={\`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider \${desktopImageUrl ? 'text-[#0b382d]' : 'text-slate-400'}\`}>
                    <CheckCircle2 className="w-4 h-4" /> Desktop
                 </div>
                 <div className={\`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider \${tabletImageUrl ? 'text-[#0b382d]' : 'text-slate-400'}\`}>
                    <CheckCircle2 className="w-4 h-4" /> Tablet
                 </div>
                 <div className={\`flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider \${mobileImageUrl ? 'text-[#0b382d]' : 'text-slate-400'}\`}>
                    <CheckCircle2 className="w-4 h-4" /> Mobile
                 </div>
              </div>
              
              <div className="flex space-x-3 w-full sm:w-auto">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-full font-bold uppercase tracking-wider text-xs hover:bg-slate-50 transition-colors shadow-sm">
                  Cancel
                </button>
                <button form="bannerForm" type="submit" disabled={saving} className="flex-1 sm:flex-none px-8 py-3 bg-slate-900 text-white rounded-full font-bold uppercase tracking-wider text-xs hover:bg-slate-800 transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
    
      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
          aspectRatio={cropTarget === 'DESKTOP' ? 21/9 : cropTarget === 'TABLET' ? 16/9 : 4/5}
          cropShape="rect"
          maxSize={1200}
          quality={0.8}
          title={\`Crop \${cropTarget === 'DESKTOP' ? 'Desktop' : cropTarget === 'TABLET' ? 'Tablet' : 'Mobile'} Banner\`}
        />
      )}
    </>
  );
}
`;

fs.writeFileSync('src/pages/admin/HeroBanners.tsx', content);
