import fs from 'fs';
let code = fs.readFileSync('src/lib/settingsContext.tsx', 'utf8');

if (!code.includes('whatsappSupport?: {')) {
  code = code.replace(
    /socialLinks: \{\s*instagram\?: string;\s*facebook\?: string;\s*youtube\?: string;\s*telegram\?: string;\s*whatsapp\?: string;\s*\};\s*\}/,
    `socialLinks: {
    instagram?: string;
    facebook?: string;
    youtube?: string;
    telegram?: string;
    whatsapp?: string;
  };
  whatsappSupport?: {
    enabled: boolean;
    countryCode: string;
    phoneNumber: string;
    displayName: string;
    defaultMessage: string;
  };
}`
  );
  
  code = code.replace(
    /whatsapp: "https:\/\/wa\.me"\s*\}/,
    `whatsapp: "https://wa.me"
  },
  whatsappSupport: {
    enabled: false,
    countryCode: "91",
    phoneNumber: "",
    displayName: "SwiftStore Support",
    defaultMessage: "Hello SwiftStore Support, I need help with my order."
  }`
  );
  
  fs.writeFileSync('src/lib/settingsContext.tsx', code);
}
