import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';

const firebaseConfig = JSON.parse(fs.readFileSync('src/lib/firebase.ts', 'utf8').match(/const firebaseConfig = ({[\s\S]*?});/)[1].replace(/import\.meta\.env\.VITE_FIREBASE_[A_Z_]+/g, '""'));
console.log("Found config");
