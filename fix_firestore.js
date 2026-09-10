import fs from 'fs';
let code = fs.readFileSync('src/lib/firebase.ts', 'utf8');

code = code.replace(
  "import { getFirestore } from 'firebase/firestore';",
  "import { getFirestore, initializeFirestore } from 'firebase/firestore';"
);

code = code.replace(
  "export const db = getFirestore(app, 'ai-studio-swiftstoreecomme-79d35e5c-4e7f-4b50-836d-68ba9dfabc2e');",
  "export const db = initializeFirestore(app, { experimentalForceLongPolling: true }, 'ai-studio-swiftstoreecomme-79d35e5c-4e7f-4b50-836d-68ba9dfabc2e');"
);

fs.writeFileSync('src/lib/firebase.ts', code);
