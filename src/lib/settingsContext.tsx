import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export interface SiteSettings {
  storeName?: string;
  logoUrl?: string;
  announcementText: string;
  announcementEnabled: boolean;
  trustStrips: { icon: string; text: string }[];
  trustStripEnabled: boolean;
  newsletterHeadline: string;
  newsletterText: string;
  newsletterEnabled: boolean;
  socialLinks?: Record<string, { url: string; enabled: boolean }>;
  paymentSettings?: {
    codEnabled: boolean;
    codMaxAmount?: number;
    codFee?: number;
    onlineEnabled: boolean;
    upiEnabled: boolean;
    cardEnabled: boolean;
    netBankingEnabled: boolean;
    minOrderAmount: number;
    paymentInstructions?: string;
    razorpayKey?: string;
        testMode: boolean;
    directUpiId?: string;
    directUpiName?: string;
    directUpiEnabled?: boolean;
    directUpiQr?: string;
  };
    shippingSettings?: {
    enabled: boolean;
    freeShippingEnabled: boolean;
    freeShippingThreshold: number;
    flatShippingCharge: number;
    standardDeliveryDays: number;
    minDeliveryDays?: number;
    maxDeliveryDays?: number;
    expressDeliveryEnabled: boolean;
    expressDeliveryDays: number;
    expressShippingCharge: number;
    countWeekendsInDelivery: boolean;
    couriers: Array<{
      id: string;
      name: string;
      website: string;
      trackingUrlFormat: string;
      contactNumber: string;
      active: boolean;
    }>;
    serviceablePincodes?: string;
  };
  whatsappSupport?: {
    enabled: boolean;
    countryCode: string;
    phoneNumber: string;
    displayName: string;
    defaultMessage: string;
  };
}

const defaultSettings: SiteSettings = {
  announcementText: "Free Shipping on Orders ₹999+  |  7-Day Easy Returns  |  Secure Checkout  |  24/7 Customer Support",
  announcementEnabled: true,
  trustStrips: [
    { icon: "ShieldCheck", text: "Premium Quality" },
    { icon: "Truck", text: "Fast Delivery" },
    { icon: "RotateCcw", text: "Easy Returns" },
    { icon: "Lock", text: "Secure Checkout" }
  ],
  trustStripEnabled: true,
  newsletterHeadline: "Join SwiftStore",
  newsletterText: "Get exclusive offers & new arrivals",
  newsletterEnabled: true,
  socialLinks: {
    instagram: { url: "https://instagram.com", enabled: true },
    facebook: { url: "https://facebook.com", enabled: true },
    youtube: { url: "https://youtube.com", enabled: true },
    twitter: { url: "https://x.com", enabled: true },
    telegram: { url: "https://t.me", enabled: true },
    whatsapp: { url: "https://wa.me", enabled: true },
    pinterest: { url: "https://pinterest.com", enabled: false },
    linkedin: { url: "https://linkedin.com", enabled: false }
  },
  paymentSettings: {
    codEnabled: true,
    codMaxAmount: 10000,
    codFee: 0,
    onlineEnabled: false,
    upiEnabled: false,
    cardEnabled: false,
    netBankingEnabled: false,
    minOrderAmount: 0,
    paymentInstructions: "Please pay using UPI or Cash on Delivery.",
    testMode: true,
    directUpiEnabled: false,
    directUpiId: "",
    directUpiName: ""
  },
    shippingSettings: {
    enabled: true,
    freeShippingEnabled: true,
    freeShippingThreshold: 999,
    flatShippingCharge: 79,
    standardDeliveryDays: 7,
    minDeliveryDays: 5,
    maxDeliveryDays: 7,
    expressDeliveryEnabled: false,
    expressDeliveryDays: 3,
    expressShippingCharge: 149,
    countWeekendsInDelivery: true,
    couriers: [
      { id: '1', name: 'Delhivery', website: 'delhivery.com', trackingUrlFormat: 'https://www.delhivery.com/track/package/', contactNumber: '', active: true },
      { id: '2', name: 'Blue Dart', website: 'bluedart.com', trackingUrlFormat: 'https://www.bluedart.com/tracking?trackNo=', contactNumber: '', active: true }
    ],
    serviceablePincodes: ''
  },
  whatsappSupport: {
    enabled: false,
    countryCode: "91",
    phoneNumber: "",
    displayName: "SwiftStore Support",
    defaultMessage: "Hello SwiftStore Support, I need help with my order."
  }
};

interface SettingsContextType {
  settings: SiteSettings;
  updateSettings: (newSettings: Partial<SiteSettings>) => Promise<void>;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({
  settings: defaultSettings,
  updateSettings: async () => {},
  loading: true
});

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<SiteSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const docRef = doc(db, 'settings', 'storefront');
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setSettings({ ...defaultSettings, ...docSnap.data() });
        }
      } catch (err) {
        console.warn("Settings fetch failed (offline mode):", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const updateSettings = async (newSettings: Partial<SiteSettings>) => {
    const updated = { ...settings, ...newSettings };
    setSettings(updated);
    try {
      await setDoc(doc(db, 'settings', 'storefront'), updated);
    } catch (err) {
      console.error("Failed to save settings", err);
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
