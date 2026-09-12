import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged, updatePassword } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  createOwnerAccount: (email: string, pass: string) => Promise<void>;
  initializeOwnerPassword: (pass: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const ownerEmail = (import.meta as any).env.VITE_OWNER_EMAIL || 'sherkhan1389alam@gmail.com';
          const isOwner = user.email === ownerEmail;
          setIsAdmin(isOwner);
          
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          let role = isOwner ? 'ADMIN' : 'CUSTOMER';
          
          if (userDoc.exists()) {
            // Respect existing roles from DB for customers if needed, but owner is always ADMIN
            if (!isOwner) {
                role = userDoc.data().role || 'CUSTOMER';
            }
          } else {
            await setDoc(userDocRef, {
              name: user.displayName || '',
              email: user.email,
              role: role,
              createdAt: Date.now()
            });
          }
        } catch (error) {
          // Only fallback to the secure check if Firestore fails (offline mode)
          const ownerEmail = (import.meta as any).env.VITE_OWNER_EMAIL || 'sherkhan1389alam@gmail.com';
          setIsAdmin(user.email === ownerEmail);
        }
      } else {
        setIsAdmin(false);
      }
      
      setCurrentUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithEmail = async (email: string, pass: string) => {
    // Only attempt to login with Firebase Auth
    await signInWithEmailAndPassword(auth, email, pass);
  };



  const createOwnerAccount = async (email: string, pass: string) => { await createUserWithEmailAndPassword(auth, email, pass); }; 
  const initializeOwnerPassword = async (pass: string) => { if(auth.currentUser) await updatePassword(auth.currentUser, pass); };
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, loading, loginWithGoogle, loginWithEmail, createOwnerAccount, initializeOwnerPassword, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
