import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import fs from "fs";

const configRaw = fs.readFileSync("firebase-applet-config.json", "utf8");
const config = JSON.parse(configRaw);

const app = initializeApp(config);
const auth = getAuth(app);

const email = "sherkhan1389alam@gmail.com";
const password = "K7@vP2#x";

async function run() {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User created successfully:", userCredential.user.uid);
    process.exit(0);
  } catch (err) {
    if (err.code === "auth/email-already-in-use") {
      console.log("User already exists, attempting to update password...");
      // Client SDK can't forcefully update password without old password. But we can sign in.
      try {
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Password is correct and user signed in!");
        process.exit(0);
      } catch (signInErr) {
        console.error("Sign in failed:", signInErr.code);
        process.exit(1);
      }
    } else {
      console.error("Error creating user:", err.code);
      process.exit(1);
    }
  }
}
run();
