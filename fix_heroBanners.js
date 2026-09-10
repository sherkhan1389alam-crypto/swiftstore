import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/HeroBanners.tsx', 'utf8');

if (!code.includes('import ImageCropper')) {
  code = code.replace(
    "import { compressImage } from '../../lib/imageUtils';",
    "import { compressImage } from '../../lib/imageUtils';\nimport ImageCropper from '../../components/ImageCropper';"
  );
}

// Add state
code = code.replace(
  "const [saving, setSaving] = useState(false);",
  "const [saving, setSaving] = useState(false);\n  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);"
);

// Replace handleImageUpload
const newHandleImageUpload = `
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (file.size > 10 * 1024 * 1024) {
      alert('File size too large. Maximum size is 10MB.');
      return;
    }
    
    const reader = new FileReader();
    reader.onload = () => {
      setCropImageSrc(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    // Reset input
    e.target.value = '';
  };

  const handleCropComplete = (croppedBase64: string) => {
    setCropImageSrc(null);
    setImageUrl(croppedBase64);
  };
`;

code = code.replace(
  /const handleImageUpload = async \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?finally \{\s*setSaving\(false\);\s*\}\s*\};/,
  newHandleImageUpload
);

// Append ImageCropper at the end of the return statement
code = code.replace(
  "    </div>\n  );\n}",
  `    </div>\n      {cropImageSrc && (
        <ImageCropper
          imageSrc={cropImageSrc}
          onCropComplete={handleCropComplete}
          onCancel={() => setCropImageSrc(null)}
          aspectRatio={21/9}
          cropShape="rect"
          maxSize={1200}
          quality={0.8}
          title="Crop Banner"
        />
      )}\n  );\n}`
);

// Make sure React fragment is around the main div since we are adding ImageCropper as a sibling
code = code.replace(
  "return (\n    <div className=\"space-y-6 max-w-7xl mx-auto pb-12\">",
  "return (\n    <>\n    <div className=\"space-y-6 max-w-7xl mx-auto pb-12\">"
);

code = code.replace(
  "      )}\n    </div>\n      {cropImageSrc",
  "      )}\n    </div>\n      {cropImageSrc" // Just making sure
);

// Actually, let's fix the end tags carefully
code = code.replace(
  /      \)\}\n    <\/div>\n      \{cropImageSrc && \([\s\S]*?\)\}\n  \);\n\}/,
  "      )}\n    </div>\n      {cropImageSrc && (\n        <ImageCropper\n          imageSrc={cropImageSrc}\n          onCropComplete={handleCropComplete}\n          onCancel={() => setCropImageSrc(null)}\n          aspectRatio={21/9}\n          cropShape=\"rect\"\n          maxSize={1200}\n          quality={0.8}\n          title=\"Crop Banner\"\n        />\n      )}\n    </>\n  );\n}"
);

fs.writeFileSync('src/pages/admin/HeroBanners.tsx', code);
