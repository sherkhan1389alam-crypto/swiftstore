import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/HeroBanners.tsx', 'utf8');

// Add success message state
if (!code.includes('const [successMessage')) {
  code = code.replace(
    "const [saving, setSaving] = useState(false);",
    "const [saving, setSaving] = useState(false);\n  const [successMessage, setSuccessMessage] = useState('');\n  const [error, setError] = useState('');"
  );
}

// Update handleSaveBanner
const saveBannerRegex = /const handleSaveBanner = async \(e: React\.FormEvent\) => \{[\s\S]*?finally \{\s*setSaving\(false\);\s*\}\s*\};/;

const newSaveBanner = `
  const handleSaveBanner = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) {
      setError("Please upload a banner image");
      return;
    }
    
    // Check size roughly
    const sizeInBytes = Math.ceil((imageUrl.length * 3) / 4);
    if (sizeInBytes > 1048576) {
      setError('Image is too large (over 1MB). Please try cropping a smaller area.');
      return;
    }

    setSaving(true);
    setError('');
    
    try {
      const bannerData = { 
        heading, 
        subheading, 
        imageUrl,
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
`;

code = code.replace(saveBannerRegex, newSaveBanner);

// Add success/error UI
const uiRegex = /<div className="flex justify-between items-center mb-6">/;
const newUi = `
      {successMessage && (
        <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center justify-between">
          <span className="font-bold">{successMessage}</span>
        </div>
      )}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
          <span className="font-bold">{error}</span>
          <button onClick={() => setError('')} className="p-1 hover:bg-red-100 rounded-lg"><X className="w-5 h-5"/></button>
        </div>
      )}
      <div className="flex justify-between items-center mb-6">
`;

code = code.replace(uiRegex, newUi);

// Update modal error
const modalUiRegex = /<form id="bannerForm" onSubmit=\{handleSaveBanner\} className="space-y-6">/;
const newModalUi = `
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center justify-between">
                  <span className="font-bold text-sm">{error}</span>
                  <button type="button" onClick={() => setError('')} className="p-1 hover:bg-red-100 rounded-lg"><X className="w-5 h-5"/></button>
                </div>
              )}
              <form id="bannerForm" onSubmit={handleSaveBanner} className="space-y-6">
`;
code = code.replace(modalUiRegex, newModalUi);

fs.writeFileSync('src/pages/admin/HeroBanners.tsx', code);
