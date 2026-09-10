import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, limit, query } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function testConnection() {
  try {
    console.log("Testing connection...");
    const snapshot = await getDocs(query(collection(db, 'products'), limit(1)));
    console.log("Connection successful. Got " + snapshot.docs.length + " products.");
    process.exit(0);
  } catch (error: any) {
    console.error("Error:", error.message);
    process.exit(1);
  }
}
testConnection();
