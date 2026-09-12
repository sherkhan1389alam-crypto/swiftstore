import { initializeApp } from 'firebase/app';
import { getFirestore, setLogLevel } from 'firebase/firestore';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import appletConfig from '../../firebase-applet-config.json';

const env = (import.meta as any).env;

// Safe diagnostic logging for Production vs Preview
console.log('Firebase Init Diagnostics:', {
  hasEnvApiKey: !!env.VITE_FIREBASE_API_KEY,
  hasAppletConfig: !!appletConfig.apiKey,
  hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
  envProjectId: env.VITE_FIREBASE_PROJECT_ID,
  appletProjectId: appletConfig.projectId
});

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY || appletConfig.apiKey,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN || appletConfig.authDomain,
  projectId: env.VITE_FIREBASE_PROJECT_ID || appletConfig.projectId,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET || appletConfig.storageBucket,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID || appletConfig.messagingSenderId,
  appId: env.VITE_FIREBASE_APP_ID || appletConfig.appId,
  measurementId: env.VITE_FIREBASE_MEASUREMENT_ID || (appletConfig as any).measurementId
};

// Suppress Firestore internal connection warnings that trigger AI Studio error modals
setLogLevel('silent');

const app = initializeApp(firebaseConfig);

// Use specific database ID from env, or applet config, or fallback to default
const dbId = env.VITE_FIREBASE_DATABASE_ID || appletConfig.firestoreDatabaseId || '(default)';
export const db = getFirestore(app, dbId);

export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
