import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDocFromServer } from "firebase/firestore";
import fs from "fs";

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

async function testConnection() {
  try {
    console.log("Testing connection...");
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Connection successful or completed without network error.");
  } catch (error: any) {
    console.error("Error:", error.message);
  }
}
testConnection();
