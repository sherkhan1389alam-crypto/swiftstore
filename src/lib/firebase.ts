import { initializeApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import appletConfig from '../../firebase-applet-config.json';

// Safe diagnostic logging for Production vs Preview
console.log('Firebase Init Diagnostics:', {
  hasEnvApiKey: !!import.meta.env.VITE_FIREBASE_API_KEY,
  hasAppletConfig: !!appletConfig.apiKey,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  envProjectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  appletProjectId: appletConfig.projectId
});

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || appletConfig.appId,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || (appletConfig as any).measurementId
};

// Suppress Firestore internal connection warnings that trigger AI Studio error modals
setLogLevel('silent');

const app = initializeApp(firebaseConfig);

// Use specific database ID from env, or applet config, or fallback to default
const dbId = import.meta.env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId || '(default)';
export const db = getFirestore(app, dbId);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
