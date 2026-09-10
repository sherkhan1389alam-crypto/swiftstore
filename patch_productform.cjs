const fs = require('fs');
let content = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

content = content.replace("const [name, setName] = useState('');", "const [name, setName] = useState('');\n  const [slug, setSlug] = useState('');");
content = content.replace("setName(p.name);", "setName(p.name);\n        setSlug(p.slug || '');");

const saveLogic = `
    let currentSlug = slug;
    if (!currentSlug) {
      currentSlug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      currentSlug += '-' + Math.floor(Math.random() * 100000);
    }
    const productData: Partial<Product & {slug: string}> = {
      slug: currentSlug,`;
      
content = content.replace("const productData: Partial<Product> = {", saveLogic);
fs.writeFileSync('src/pages/admin/ProductForm.tsx', content);
