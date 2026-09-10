import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/Branding.tsx', 'utf8');

if (!code.includes('import ImageCropper')) {
  code = code.replace(
    "import { Upload, X, Save, Image as ImageIcon, Loader2 } from 'lucide-react';",
    "import { Upload, X, Save, Image as ImageIcon, Loader2, Crop } from 'lucide-react';\nimport ImageCropper from '../../components/ImageCropper';"
  );
  fs.writeFileSync('src/pages/admin/Branding.tsx', code);
}
