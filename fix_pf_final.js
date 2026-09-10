import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');
code = code.replace(/import \{ useNavigate, useParams \} from 'react-router-dom';/, `import { useNavigate, useParams, Link } from 'react-router-dom';`);
code = code.replace(/import \{ doc, getDoc, collection, addDoc, updateDoc, query, orderBy \} from 'firebase\/firestore';/, `import { doc, getDoc, collection, addDoc, updateDoc, getDocs, query, orderBy } from 'firebase/firestore';`);
fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);

let track = fs.readFileSync('src/pages/store/TrackOrder.tsx', 'utf8');
track = track.replace(/import \{ Search, Package, Truck, CheckCircle, Clock, Check, MessageSquareText, FileText \} from 'lucide-react';/, `import { Search, Package, Truck, CheckCircle, Clock, Check, MessageSquareText, FileText, AlertTriangle } from 'lucide-react';`);
fs.writeFileSync('src/pages/store/TrackOrder.tsx', track);
