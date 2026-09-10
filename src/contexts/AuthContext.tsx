import React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { User, signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, googleProvider, db } from '../lib/firebase';

interface AuthContextType {
  currentUser: User | null;
  isAdmin: boolean;
  loading: boolean;
  loginWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
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
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          
          let role = 'CUSTOMER';
          
          if (userDoc.exists()) {
            role = userDoc.data().role || 'CUSTOMER';
          } else {
            // Check if it's the owner email, otherwise default to CUSTOMER
            if (user.email === 'sherkhan1389alam@gmail.com') {
              role = 'ADMIN';
            }
            
            await setDoc(userDocRef, {
              name: user.displayName,
              email: user.email,
              role: role,
              createdAt: Date.now()
            });
          }
          
          setIsAdmin(role === 'ADMIN');
        } catch (error) {
          console.warn("User role fetch failed (offline mode):", error);
          setIsAdmin(false);
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
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        if (email === 'sherkhan1389alam@gmail.com') {
          try {
            const res = await fetch('/api/admin/verify-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: pass })
            });
            if (res.ok) {
              await createUserWithEmailAndPassword(auth, email, pass);
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
      throw error;
    }
  };

  const logout = async () => {
    sessionStorage.removeItem('owner_auth');
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ currentUser, isAdmin, loading, loginWithGoogle, loginWithEmail, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
