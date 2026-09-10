import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/ProductForm.tsx', 'utf8');

if (!code.includes('import { Link } from \'react-router-dom\';')) {
  code = code.replace(
    /import \{ useNavigate, useParams \} from 'react-router-dom';/,
    `import { useNavigate, useParams, Link } from 'react-router-dom';`
  );
}

if (!code.includes('import { doc, getDoc, collection, addDoc, updateDoc, getDocs, query, orderBy }')) {
  code = code.replace(
    /import \{ doc, getDoc, collection, addDoc, updateDoc, query, orderBy \} from 'firebase\/firestore';/,
    `import { doc, getDoc, collection, addDoc, updateDoc, getDocs, query, orderBy } from 'firebase/firestore';`
  );
}

fs.writeFileSync('src/pages/admin/ProductForm.tsx', code);
