import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Branding.tsx', 'utf8');

const replacement = `
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
`;

code = code.replace(
  /const handleSave = async \(\) => \{\s*try \{\s*setSaving\(true\);\s*setError\(''\);\s*setSuccessMessage\(''\);/,
  replacement.trim()
);

fs.writeFileSync('src/pages/admin/Branding.tsx', code);
