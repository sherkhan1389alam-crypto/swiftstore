import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Product } from '../lib/types';

interface WishlistContextType {
  wishlist: string[];
  toggleWishlist: (productId: string) => Promise<boolean>;
  isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) throw new Error('useWishlist must be used within a WishlistProvider');
  return context;
};

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState<string[]>([]);

  useEffect(() => {
    const fetchWishlist = async () => {
      if (currentUser) {
        try {
          const docRef = doc(db, 'wishlists', currentUser.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setWishlist(docSnap.data().items || []);
          } else {
            setWishlist([]);
          }
        } catch (e) {
          console.warn('Wishlist fetch failed (offline mode):', e);
        }
      } else {
        setWishlist([]);
      }
    };
    fetchWishlist();
  }, [currentUser]);

  const toggleWishlist = async (productId: string): Promise<boolean> => {
    if (!currentUser) {
      throw new Error('AUTH_REQUIRED');
    }
    
    let newItems = [...wishlist];
    let isAdded = false;
    
    if (newItems.includes(productId)) {
      newItems = newItems.filter(id => id !== productId);
    } else {
      newItems.push(productId);
      isAdded = true;
    }
    
    setWishlist(newItems); // optimistic
    
    try {
      await setDoc(doc(db, 'wishlists', currentUser.uid), { items: newItems }, { merge: true });
      return isAdded;
    } catch (e) {
      // Revert on fail
      setWishlist(wishlist);
      console.error('Failed to update wishlist', e);
      throw e;
    }
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  return (
    <WishlistContext.Provider value={{ wishlist, toggleWishlist, isInWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};
