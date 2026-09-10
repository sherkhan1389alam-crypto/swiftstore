import fs from 'fs';
let code = fs.readFileSync('src/components/ImageCropper.tsx', 'utf8');

code = code.replace(
  "interface ImageCropperProps {",
  "interface ImageCropperProps {\n  aspectRatio?: number;\n  cropShape?: 'rect' | 'round';\n  maxSize?: number;\n  quality?: number;\n  title?: string;"
);

code = code.replace(
  "export default function ImageCropper({ imageSrc, onCropComplete, onCancel }: ImageCropperProps) {",
  "export default function ImageCropper({ imageSrc, onCropComplete, onCancel, aspectRatio = 1, cropShape = 'round', maxSize = 500, quality = 0.9, title = 'Crop Image' }: ImageCropperProps) {"
);

code = code.replace(
  "<h3 className=\"font-bold text-lg\">Crop Logo</h3>",
  "<h3 className=\"font-bold text-lg\">{title}</h3>"
);

code = code.replace(
  "aspect={1}",
  "aspect={aspectRatio}"
);

code = code.replace(
  "cropShape=\"round\"",
  "cropShape={cropShape}"
);

code = code.replace(
  "const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation);",
  "const croppedImage = await getCroppedImg(imageSrc, croppedAreaPixels, rotation, { horizontal: false, vertical: false }, maxSize, quality);"
);

code = code.replace(
  "Crop & Use Logo",
  "Crop & Save"
);

fs.writeFileSync('src/components/ImageCropper.tsx', code);
