const fs = require('fs');
let content = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');

const replacement = `
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        let data: Product | null = null;
        
        // First try to find by slug
        const q = query(collection(db, 'products'), where('slug', '==', id));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          const doc = qSnap.docs[0];
          data = { id: doc.id, ...doc.data() } as Product;
        } else {
          // Fallback to document ID
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            data = { id: docSnap.id, ...docSnap.data() } as Product;
          }
        }

        if (data) {
`;

// we need to replace the fetchProduct logic
// It starts with:
/*
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Product;
*/

content = content.replace(`      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() } as Product;`, `      if (!id) return;
      try {
        let data: Product | null = null;
        const q = query(collection(db, 'products'), where('slug', '==', id));
        const qSnap = await getDocs(q);
        if (!qSnap.empty) {
          const docSnap = qSnap.docs[0];
          data = { id: docSnap.id, ...docSnap.data() } as Product;
        } else {
          const docRef = doc(db, 'products', id);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            data = { id: docSnap.id, ...docSnap.data() } as Product;
          }
        }
        if (data) {`);

content = content.replace("import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';", "import { doc, getDoc, collection, query, where, getDocs, addDoc } from 'firebase/firestore';");

fs.writeFileSync('src/pages/store/ProductDetails.tsx', content);
