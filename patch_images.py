import re

with open("src/pages/admin/ProductForm.tsx", "r") as f:
    content = f.read()

# Add X to lucide-react imports if not there
if 'X' not in content:
    content = content.replace("Image as ImageIcon }", "Image as ImageIcon, X }")
else:
    # Make sure X is imported
    pass

# Replace state
content = content.replace(
    "const [imageUrl, setImageUrl] = useState('');",
    "const [images, setImages] = useState<string[]>([]);\n  const [mainImageIndex, setMainImageIndex] = useState(0);"
)

# Update fetchInitialData
fetch_block = '''          setOtherCost(p.otherCost || 0);
          if (p.images && p.images.length > 0) {
            setImages(p.images);
            const idx = p.images.indexOf(p.imageUrl);
            setMainImageIndex(idx >= 0 ? idx : 0);
          } else if (p.imageUrl) {
            setImages([p.imageUrl]);
            setMainImageIndex(0);
          }'''
content = re.sub(r'setOtherCost\(p\.otherCost \|\| 0\);\s*setImageUrl\(p\.imageUrl \|\| \'\'\);', fetch_block, content)


# Update save block
save_block = '''        otherCost: Number(otherCost),
        imageUrl: images.length > 0 ? images[mainImageIndex] : '',
        images,'''
content = re.sub(r'otherCost: Number\(otherCost\),\s*imageUrl,', save_block, content)

# Add compression function before handleSave
compression_fn = '''  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const files = Array.from(e.target.files);
    
    setSaving(true);
    try {
      const newImages = await Promise.all(files.map(compressImage));
      setImages(prev => [...prev, ...newImages]);
    } catch (error) {
      console.error('Error compressing images', error);
      alert('Failed to process some images');
    } finally {
      setSaving(false);
      if (e.target) e.target.value = '';
    }
  };

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const max_size = 1200;
          
          if (width > height && width > max_size) {
            height *= max_size / width;
            width = max_size;
          } else if (height > max_size) {
            width *= max_size / height;
            height = max_size;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.8));
        };
        img.onerror = (err) => reject(err);
      };
      reader.onerror = (err) => reject(err);
    });
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    if (mainImageIndex === index) {
      setMainImageIndex(0);
    } else if (mainImageIndex > index) {
      setMainImageIndex(mainImageIndex - 1);
    }
  };

  const handleSave'''

content = content.replace("  const handleSave", compression_fn)

# Replace Media section
media_section = '''          {/* Media */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 space-y-5">
            <h2 className="font-bold text-lg text-slate-900 mb-4 border-b pb-2">Product Images</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-4">
              {images.map((img, idx) => (
                <div key={idx} className={`relative aspect-square rounded-xl overflow-hidden border-2 ${mainImageIndex === idx ? 'border-indigo-600 shadow-md' : 'border-slate-200'}`}>
                  <img src={img} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                  
                  {mainImageIndex === idx && (
                    <div className="absolute top-2 left-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
                      MAIN
                    </div>
                  )}
                  
                  <button 
                    type="button"
                    onClick={(e) => { e.stopPropagation(); removeImage(idx); }} 
                    className="absolute top-2 right-2 bg-white/90 text-red-600 p-1.5 rounded-full shadow-sm hover:bg-red-50 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  
                  {mainImageIndex !== idx && (
                    <button 
                      type="button"
                      onClick={() => setMainImageIndex(idx)}
                      className="absolute bottom-2 left-2 right-2 bg-white/90 text-slate-700 text-xs font-semibold py-1.5 rounded-lg shadow-sm hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
                    >
                      Set as Main
                    </button>
                  )}
                </div>
              ))}
              
              <label className="aspect-square rounded-xl border-2 border-dashed border-slate-300 hover:border-indigo-500 hover:bg-indigo-50 bg-slate-50 flex flex-col items-center justify-center cursor-pointer transition-colors group">
                <ImageIcon className="w-8 h-8 text-slate-400 group-hover:text-indigo-500 mb-2" />
                <span className="text-sm font-semibold text-slate-600 group-hover:text-indigo-600">Upload Images</span>
                <span className="text-xs text-slate-400 mt-1">JPG, PNG, WEBP</span>
                <input 
                  type="file" 
                  accept="image/jpeg,image/png,image/webp" 
                  multiple 
                  className="hidden" 
                  onChange={handleImageUpload}
                  disabled={saving}
                />
              </label>
            </div>
            
            {images.length === 0 && (
              <p className="text-sm text-red-500 mt-2 font-medium">Please upload at least one image.</p>
            )}
          </div>'''

# We need to replace from {/* Media */} to the end of the div
content = re.sub(
    r'\{\/\* Media \*\/\}.*?\{\/\* Sourcing \/ Supplier \*\/\}',
    media_section + '\n\n          {/* Sourcing / Supplier */}',
    content,
    flags=re.DOTALL
)

with open("src/pages/admin/ProductForm.tsx", "w") as f:
    f.write(content)

