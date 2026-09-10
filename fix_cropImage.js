import fs from 'fs';
let code = fs.readFileSync('src/lib/cropImage.ts', 'utf8');

code = code.replace(
  "export default async function getCroppedImg(",
  "export default async function getCroppedImg("
);

code = code.replace(
  "flip = { horizontal: false, vertical: false }",
  "flip = { horizontal: false, vertical: false }, maxSize = 500, quality = 0.9"
);

code = code.replace(
  "const MAX_SIZE = 500",
  "const MAX_SIZE = maxSize"
);

code = code.replace(
  "return croppedCanvas.toDataURL('image/webp', 0.9)",
  "return croppedCanvas.toDataURL('image/webp', quality)"
);

fs.writeFileSync('src/lib/cropImage.ts', code);
