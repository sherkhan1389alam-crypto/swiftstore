import admin from 'firebase-admin';
import fs from 'fs';

const configRaw = fs.readFileSync('firebase-applet-config.json', 'utf8');
const config = JSON.parse(configRaw);

admin.initializeApp({
  projectId: config.projectId
});

async function run() {
  try {
    await admin.auth().projectConfigManager().updateProjectConfig({
      signIn: {
        email: {
          enabled: true,
          passwordRequired: true
        }
      }
    });
    console.log("Enabled Email/Password auth!");
  } catch(e) {
    console.error("Error:", e);
  }
}
run();
