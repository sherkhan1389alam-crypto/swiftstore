import { initializeApp, applicationDefault } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
initializeApp({ credential: applicationDefault() });
const db = getFirestore();
db.collection('test').doc('test').get().then(doc => console.log('success', doc.exists)).catch(e => console.error(e.message));
