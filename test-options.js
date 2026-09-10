import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore } from "firebase/firestore";
import fs from "fs";
const config = JSON.parse(fs.readFileSync("./firebase-applet-config.json"));
const app = initializeApp(config);
try {
  const db = initializeFirestore(app, { experimentalAutoDetectLongPolling: true }, config.firestoreDatabaseId);
  console.log("Success with experimentalAutoDetectLongPolling");
} catch(e) {
  console.log("Error:", e.message);
}
