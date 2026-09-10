import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Branding.tsx', 'utf8');

if (!code.includes('import ImageCropper')) {
  // Add imports
  code = code.replace(
    "import { Save, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';",
    "import { Save, Upload, X, Loader2, Image as ImageIcon, Crop } from 'lucide-react';\nimport ImageCropper from '../../components/ImageCropper';"
  );

  // Add state for cropper
  code = code.replace(
    "const [successMessage, setSuccessMessage] = useState('');",
    "const [successMessage, setSuccessMessage] = useState('');\n  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);"
  );

  // Replace handleFileChange
  const newHandleFileChange = `
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
`;
  
  code = code.replace(
    /const handleFileChange = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?if \(fileInputRef\.current\) \{\s*fileInputRef\.current\.value = '';\s*\}\s*\}\s*\};/,
    newHandleFileChange
  );
  
  // Add Cropper component to JSX at the end
  code = code.replace(
    "</div>\n    </div>\n  );\n}",
    "</div>\n    </div>\n      {cropImageSrc && (\n        <ImageCropper\n          imageSrc={cropImageSrc}\n          onCropComplete={handleCropComplete}\n          onCancel={() => setCropImageSrc(null)}\n        />\n      )}\n    </>\n  );\n}"
  );
  
  // Fix React fragment wrapper
  code = code.replace(
    "return (\n    <div className=\"max-w-4xl mx-auto pb-12\">",
    "return (\n    <>\n    <div className=\"max-w-4xl mx-auto pb-12\">"
  );
  
  // Update "Change Logo" button section to include "Edit Logo" button if it's a data url
  const newActions = `
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
`;

  code = code.replace(
    /{!logoUrl \? \([\s\S]*?<\/button>\s*<\/>\s*\)}/,
    newActions
  );

  fs.writeFileSync('src/pages/admin/Branding.tsx', code);
}
