import fs from 'fs';

// 1. types.ts
let types = fs.readFileSync('src/lib/types.ts', 'utf8');
if (!types.includes('lowStockThreshold')) {
  types = types.replace(/stock\?: number;/g, 'stock?: number;\n  lowStockThreshold?: number;\n  inventoryTracking?: boolean;');
}
if (!types.includes('courierName')) {
  types = types.replace(/trackingUrl\?: string;/g, 'trackingUrl?: string;\n  courierName?: string;\n  shippingCharge?: number;');
}
fs.writeFileSync('src/lib/types.ts', types);

// 2. ProductForm.tsx (getDocs, Link)
let form = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');
if (!form.includes('Link } from \'react-router-dom\'')) {
  form = form.replace(/import \{ useNavigate, useParams \} from 'react-router-dom';/, `import { useNavigate, useParams, Link } from 'react-router-dom';`);
}
if (!form.includes('getDocs,')) {
  form = form.replace(/import \{ doc, getDoc, collection, addDoc, updateDoc, query, orderBy \} from 'firebase\/firestore';/, `import { doc, getDoc, collection, addDoc, updateDoc, getDocs, query, orderBy } from 'firebase/firestore';`);
}
form = form.replace(/orderBy\('createdAt', 'desc', 'limit', 1\)/g, `orderBy('createdAt', 'desc')`);
fs.writeFileSync('src/pages/admin/ProductForm.tsx', form);

// 3. TrackOrder.tsx AlertTriangle
let track = fs.readFileSync('src/pages/store/TrackOrder.tsx', 'utf8');
if (!track.includes('AlertTriangle')) {
  track = track.replace(/import \{ Search, Package, Truck, CheckCircle, Clock, Check, MessageSquareText, FileText \} from 'lucide-react';/, `import { Search, Package, Truck, CheckCircle, Clock, Check, MessageSquareText, FileText, AlertTriangle } from 'lucide-react';`);
}
fs.writeFileSync('src/pages/store/TrackOrder.tsx', track);

// 4. ProductDetails.tsx variantOptions
let prod = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');
prod = prod.replace(/v\.options\.length/g, `(v.options ? v.options.length : 0)`); // Wait, product variants don't have options, Product has variantOptions
// Wait, `data.variants.forEach(v => { if (v.options.length > 0) ... })`
// It was `variantOptions` on Product, but here it's `data.variants` ? 
// Let's replace `data.variants` to `data.variantOptions`
prod = prod.replace(/if \(data\.variants && data\.variants\.length > 0\)/g, `if (data.variantOptions && data.variantOptions.length > 0)`);
prod = prod.replace(/data\.variants\.forEach\(v =>/g, `data.variantOptions.forEach(v =>`);
fs.writeFileSync('src/pages/store/ProductDetails.tsx', prod);

