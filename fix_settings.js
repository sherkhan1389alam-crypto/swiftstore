import fs from 'fs';
let code = fs.readFileSync('src/lib/settingsContext.tsx', 'utf8');

const shippingSettingsType = `  shippingSettings?: {
    enabled: boolean;
    freeShippingEnabled: boolean;
    freeShippingThreshold: number;
    flatShippingCharge: number;
    processingDays: number;
    minDeliveryDays: number;
    maxDeliveryDays: number;
    couriers: Array<{
      id: string;
      name: string;
      website: string;
      trackingUrlFormat: string;
      contactNumber: string;
      active: boolean;
    }>;
    serviceablePincodes?: string;
  };`;

if (!code.includes('shippingSettings?: {')) {
  code = code.replace(
    /whatsappSupport\?: \{/,
    `${shippingSettingsType}\n  whatsappSupport?: {`
  );
}

const defaultShippingSettings = `  shippingSettings: {
    enabled: true,
    freeShippingEnabled: true,
    freeShippingThreshold: 999,
    flatShippingCharge: 79,
    processingDays: 1,
    minDeliveryDays: 3,
    maxDeliveryDays: 6,
    couriers: [
      { id: '1', name: 'Delhivery', website: 'delhivery.com', trackingUrlFormat: 'https://www.delhivery.com/track/package/', contactNumber: '', active: true },
      { id: '2', name: 'Blue Dart', website: 'bluedart.com', trackingUrlFormat: 'https://www.bluedart.com/tracking?trackNo=', contactNumber: '', active: true }
    ],
    serviceablePincodes: ''
  },`;

if (!code.includes('shippingSettings: {')) {
  code = code.replace(
    /whatsappSupport: \{/,
    `${defaultShippingSettings}\n  whatsappSupport: {`
  );
}

fs.writeFileSync('src/lib/settingsContext.tsx', code);
