import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

// Undo the bad replace
code = code.replace(
  "const [description,\n        specifications,\n        hasVariants, setDescription]",
  "const [description, setDescription]"
);
code = code.replace(
  "description,\n        specifications,\n        hasVariants, setDescription]",
  "description, setDescription]"
);

// We still need to add specifications, hasVariants to the save payload
// Let's look for where the save payload is.
// it's `description: description,` or just `description,` inside an object.
fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
