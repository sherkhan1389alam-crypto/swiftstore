import fs from 'fs';
let code = fs.readFileSync('src/lib/imageUtils.ts', 'utf8');

code = code.replace(
  'const max_size = 1200; // Increased max size for better quality',
  'const max_size = 600; // Reduced to fit within Firestore 1MB limits'
);

code = code.replace(
  "resolve(canvas.toDataURL('image/png'));",
  "resolve(canvas.toDataURL('image/webp', 0.8)); // WebP supports transparency and compression"
);

fs.writeFileSync('src/lib/imageUtils.ts', code);
