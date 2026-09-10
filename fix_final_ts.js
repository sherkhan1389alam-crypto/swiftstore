import fs from 'fs';

// 1. Fix StoreLayout icons
let layout = fs.readFileSync('src/layouts/StoreLayout.tsx', 'utf8');
layout = layout.replace(/<Instagram className="w-5 h-5" \/>/g, '<Instagram size={20} />');
layout = layout.replace(/<Facebook className="w-5 h-5" \/>/g, '<Facebook size={20} />');
layout = layout.replace(/<Youtube className="w-5 h-5" \/>/g, '<Youtube size={20} />');
layout = layout.replace(/<Twitter className="w-5 h-5" \/>/g, '<Twitter size={20} />');
layout = layout.replace(/<Pin className="w-5 h-5" \/>/g, '<Pin size={20} />');
layout = layout.replace(/<Linkedin className="w-5 h-5" \/>/g, '<Linkedin size={20} />');
fs.writeFileSync('src/layouts/StoreLayout.tsx', layout);

// 2. Fix ProductDetails.tsx
let prod = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');
prod = prod.replace(/setPincodeStatus\('IDLE'\);/g, `setDeliveryStatus('IDLE');`);
prod = prod.replace(/v\.options\.length/g, `v.name.length`);
fs.writeFileSync('src/pages/store/ProductDetails.tsx', prod);

// 3. Fix TrackOrder.tsx AlertTriangle
let track = fs.readFileSync('src/pages/store/TrackOrder.tsx', 'utf8');
if (!track.includes('AlertTriangle')) {
  track = track.replace(/import \{ Search, Package,/, `import { Search, Package, AlertTriangle,`);
}
fs.writeFileSync('src/pages/store/TrackOrder.tsx', track);

// 4. Fix ProductForm.tsx Link, getDocs, orderBy
let form = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');
if (!form.includes('Link } from \'react-router-dom\'')) {
  form = form.replace(/import \{ useNavigate, useParams \} from 'react-router-dom';/, `import { useNavigate, useParams, Link } from 'react-router-dom';`);
}
if (!form.includes('getDocs,')) {
  form = form.replace(/import \{ doc, getDoc, collection, addDoc, updateDoc, query, orderBy \} from 'firebase\/firestore';/, `import { doc, getDoc, collection, addDoc, updateDoc, getDocs, query, orderBy } from 'firebase/firestore';`);
}
form = form.replace(/orderBy\('createdAt', 'desc', 'limit', 1\)/g, `orderBy('createdAt', 'desc')`);
fs.writeFileSync('src/pages/admin/ProductForm.tsx', form);

