import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

if (!code.includes('const [specifications, setSpecifications]')) {
  code = code.replace(
    "const [description, setDescription] = useState('');",
    "const [description, setDescription] = useState('');\n  const [specifications, setSpecifications] = useState('');\n  const [hasVariants, setHasVariants] = useState(false);"
  );
  
  code = code.replace(
    "setDescription(data.description || '');",
    "setDescription(data.description || '');\n        setSpecifications(data.specifications || '');\n        setHasVariants(data.hasVariants || false);"
  );
  
  code = code.replace(
    "description,",
    "description,\n        specifications,\n        hasVariants,"
  );
  
  const htmlToInsert = `
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Specifications / Details</label>
              <textarea 
                value={specifications} 
                onChange={e => setSpecifications(e.target.value)} 
                rows={3} 
                className="w-full p-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-[#0b382d] outline-none" 
                placeholder="Product specifications..."
              />
            </div>
            
            <div className="flex items-center gap-3 mt-4">
              <input type="checkbox" checked={hasVariants} onChange={(e) => setHasVariants(e.target.checked)} className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
              <span className="text-sm font-medium text-slate-700">This product has variants (sizes, colors)</span>
            </div>
  `;
  
  // insert right after description textarea
  code = code.replace(
    /<\/textarea>\s*<\/div>/,
    "</textarea>\n            </div>" + htmlToInsert
  );
  
  fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
}
