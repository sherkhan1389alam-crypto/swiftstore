import React, { useState, useRef, useEffect } from 'react';
import { useSettings } from '../../lib/settingsContext';
import { compressImage } from '../../lib/imageUtils';
import { Upload, X, Save, Image as ImageIcon, Loader2, Crop } from 'lucide-react';
import ImageCropper from '../../components/ImageCropper';

export default function Branding() {
  const { settings, updateSettings } = useSettings();
  
  const [logoUrl, setLogoUrl] = useState<string>('');
  const [storeName, setStoreName] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (settings) {
      setLogoUrl(settings.logoUrl || '');
      setStoreName(settings.storeName || 'SwiftStore');
    }
  }, [settings]);

  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a valid image file (PNG, JPG, or WEBP).');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('File size too large. Maximum size is 5MB.');
      return;
    }

    try {
      // Read file as data URL to pass to cropper
      const reader = new FileReader();
      reader.onload = () => {
        setCropImageSrc(reader.result as string);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to read image.');
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleCropComplete = async (croppedBase64: string) => {
    setCropImageSrc(null); // Close cropper
    setUploading(true);
    setError('');
    
    try {
      // Check size of the resulting base64 string
      const sizeInBytes = Math.ceil((croppedBase64.length * 3) / 4);
      if (sizeInBytes > 1048576) {
        setError('Cropped image is still too large (over 1MB). Please try a smaller crop area.');
        return;
      }
      
      setLogoUrl(croppedBase64);
      
      // Auto-save the logo when cropped so it takes effect immediately
      await updateSettings({
        logoUrl: croppedBase64,
        storeName
      });
      
      setSuccessMessage('Logo updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
      
    } catch (err) {
      setError('Failed to save cropped image.');
    } finally {
      setUploading(false);
    }
  };


  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveLogo = () => {
    setLogoUrl('');
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccessMessage('');
      
      // Safety check before saving
      if (logoUrl) {
        const sizeInBytes = Math.ceil((logoUrl.length * 3) / 4);
        if (sizeInBytes > 900000) {
          setError('The current image is too large (over 1MB). Please re-upload the image to apply compression.');
          setSaving(false);
          return;
        }
      }
      
      await updateSettings({
        logoUrl,
        storeName
      });
      
      await updateSettings({
        logoUrl,
        storeName
      });
      
      setSuccessMessage('Branding settings saved successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to save settings.');
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
    <div className="max-w-4xl mx-auto pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Branding</h1>
        <p className="text-slate-500 mt-2">Manage your store's logo and brand identity.</p>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 flex items-center justify-between border border-red-100">
          <p className="font-medium text-sm">{error}</p>
          <button onClick={() => setError('')}><X className="w-5 h-5" /></button>
        </div>
      )}

      {successMessage && (
        <div className="bg-emerald-50 text-emerald-700 p-4 rounded-xl mb-6 border border-emerald-100">
          <p className="font-medium text-sm">{successMessage}</p>
        </div>
      )}

      <div className="bg-white rounded-3xl p-6 md:p-8 shadow-sm border border-slate-200">
        
        {/* Store Name */}
        <div className="mb-10">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Store Name</h2>
          <input
            type="text"
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
            className="w-full max-w-md px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0b382d] focus:border-[#0b382d] outline-none transition-all"
            placeholder="e.g. SwiftStore"
          />
          <p className="text-xs text-slate-500 mt-2">This is used as a fallback when no logo is provided.</p>
        </div>

        <hr className="border-slate-100 mb-10" />

        {/* Logo Section */}
        <div className="mb-10">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Logo</h2>
              <p className="text-sm text-slate-500 mt-1">Upload your brand logo (PNG with transparent background recommended).</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Logo Preview Area */}
            <div className="w-full sm:w-auto">
              <div className="w-48 h-48 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center overflow-hidden relative group">
                {uploading ? (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <Loader2 className="w-8 h-8 animate-spin mb-2 text-[#0b382d]" />
                    <span className="text-xs font-medium uppercase tracking-widest">Processing...</span>
                  </div>
                ) : logoUrl ? (
                  <div className="relative w-full h-full p-4 flex items-center justify-center bg-white/50 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCI+CjxyZWN0IHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgZmlsbD0iI2ZmZiIvPgo8cmVjdCB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMmYyZjIiLz4KPHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iMTAiIGhlaWdodD0iMTAiIGZpbGw9IiNmMmYyZjIiLz4KPC9zdmc+')]">
                    <img src={logoUrl} alt="Store Logo Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <ImageIcon className="w-10 h-10 mb-2 opacity-50" />
                    <span className="text-xs font-medium">No Logo Uploaded</span>
                  </div>
                )}
              </div>
            </div>

            {/* Logo Actions */}
            <div className="flex-1 flex flex-col justify-center space-y-3 w-full">
              <input 
                type="file" 
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/png, image/jpeg, image/webp"
                className="hidden"
              />
              
              
              {!logoUrl ? (
                <button 
                  onClick={triggerFileInput}
                  disabled={uploading}
                  className="flex items-center justify-center gap-2 bg-[#0b382d] text-white px-6 py-3 rounded-xl font-bold hover:bg-emerald-900 transition-colors w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <Upload className="w-4 h-4" /> Upload Logo
                </button>
              ) : (
                <>
                  <button 
                    onClick={triggerFileInput}
                    disabled={uploading}
                    className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed border border-slate-200"
                  >
                    Change Logo
                  </button>
                  {logoUrl.startsWith('data:image') && (
                    <button 
                      onClick={() => setCropImageSrc(logoUrl)}
                      disabled={uploading}
                      className="flex items-center justify-center gap-2 bg-slate-100 text-slate-700 px-6 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors w-full sm:w-auto disabled:opacity-70 disabled:cursor-not-allowed border border-slate-200"
                    >
                      <Crop className="w-4 h-4" /> Edit Logo
                    </button>
                  )}
                  <button 
                    onClick={handleRemoveLogo}
                    disabled={uploading}
                    className="flex items-center justify-center gap-2 bg-red-50 text-red-600 px-6 py-3 rounded-xl font-bold hover:bg-red-100 transition-colors w-full sm:w-auto border border-red-100"
                  >
                    <X className="w-4 h-4" /> Remove Logo
                  </button>
                </>
              )}

              
              <p className="text-xs text-slate-400 mt-2 max-w-xs">
                Recommended: 500x500px, PNG with transparent background. Max size: 5MB.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end pt-6 border-t border-slate-100 mt-8">
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="flex items-center gap-2 bg-[#0b382d] text-white px-8 py-3.5 rounded-xl font-bold hover:bg-emerald-900 transition-colors disabled:opacity-70 shadow-lg shadow-emerald-900/20"
          >
            {saving ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Saving...</>
            ) : (
              <><Save className="w-5 h-5" /> Save Changes</>
            )}
          </button>
        </div>
      </div>
    </div>
      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
        />
      )}
    </>
  );
}
