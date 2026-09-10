import React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import { Product } from '../lib/types';
import { useSettings } from '../lib/settingsContext';

export interface CartItem extends Product {
  quantity: number;
  selectedVariants?: Record<string, string>;
  cartItemId: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedVariants?: Record<string, string>) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  total: number;
  shippingCost: number;
  finalTotal: number;
}

const CartContext = createContext<CartContextType | null>(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const { settings } = useSettings();
  const [items, setItems] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product: Product, quantity: number = 1, selectedVariants?: Record<string, string>) => {
    setItems(prev => {
      const variantKey = selectedVariants ? JSON.stringify(selectedVariants) : '';
      const existing = prev.find(item => item.id === product.id && (item.selectedVariants ? JSON.stringify(item.selectedVariants) : '') === variantKey);
      
      if (existing) {
        return prev.map(item => item.cartItemId === existing.cartItemId 
          ? { ...item, quantity: item.quantity + quantity } 
          : item
        );
      }
      
      return [...prev, { 
        ...product, 
        quantity, 
        selectedVariants, 
        cartItemId: Math.random().toString(36).substring(2, 9) 
      }];
    });
  };

  const removeFromCart = (cartItemId: string) => {
    setItems(prev => prev.filter(item => item.cartItemId !== cartItemId || item.id !== cartItemId)); // Fallback for old items
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setItems(prev => prev.map(item => (item.cartItemId === cartItemId || item.id === cartItemId) ? { ...item, quantity } : item));
  };

  const clearCart = () => setItems([]);

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  let shippingCost = 0;
  if (settings?.shippingSettings?.enabled) {
    if (!settings.shippingSettings.freeShippingEnabled || total < (settings.shippingSettings.freeShippingThreshold || 999)) {
      shippingCost = settings.shippingSettings.flatShippingCharge || 79;
    }
  }
  
  const finalTotal = total + shippingCost;


  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total, shippingCost, finalTotal }}>
      {children}
    </CartContext.Provider>
  );
};
