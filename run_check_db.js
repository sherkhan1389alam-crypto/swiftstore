import fs from 'fs';

let firebaseCode = fs.readFileSync('src/lib/firebase.ts', 'utf8');
let configMatch = firebaseCode.match(/const firebaseConfig = (\{[\s\S]*?\});/);

if (configMatch) {
  let config = configMatch[1];
  
  let script = `
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = ${config};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  try {
    const d = await getDoc(doc(db, 'settings', 'storefront'));
    if (d.exists()) {
      const data = d.data();
      for (const key in data) {
        const val = JSON.stringify(data[key]);
        console.log(\`Field \${key} size: \${val ? val.length : 0} bytes\`);
      }
    } else {
      console.log("No settings doc found.");
    }
  } catch (e) {
    console.error(e);
  }
}
check().then(() => process.exit(0));
`;
  fs.writeFileSync('do_check.js', script);
}
