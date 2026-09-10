
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "effective-quote-mhh41",
  appId: "1:783103431843:web:095e90ec97f5b0076ddb16",
  apiKey: "AIzaSyCzPKmtZI2JIouu6d6A2EW_tSEm8dAXN5A",
  authDomain: "effective-quote-mhh41.firebaseapp.com",
  storageBucket: "effective-quote-mhh41.firebasestorage.app",
  messagingSenderId: "783103431843"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  try {
    const d = await getDoc(doc(db, 'settings', 'storefront'));
    if (d.exists()) {
      const data = d.data();
      for (const key in data) {
        const val = JSON.stringify(data[key]);
        console.log(`Field ${key} size: ${val ? val.length : 0} bytes`);
      }
    } else {
      console.log("No settings doc found.");
    }
  } catch (e) {
    console.error(e);
  }
}
check().then(() => process.exit(0));
