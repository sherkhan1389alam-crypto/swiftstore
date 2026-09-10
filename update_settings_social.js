import fs from 'fs';
let code = fs.readFileSync('src/lib/settingsContext.tsx', 'utf8');

code = code.replace(
  /socialLinks:\s*\{\s*instagram\?:\s*string;\s*facebook\?:\s*string;\s*youtube\?:\s*string;\s*telegram\?:\s*string;\s*whatsapp\?:\s*string;\s*\};/,
  `socialLinks?: Record<string, { url: string; enabled: boolean }>;`
);

code = code.replace(
  /socialLinks:\s*\{\s*instagram:\s*"https:\/\/instagram\.com",\s*facebook:\s*"https:\/\/facebook\.com",\s*youtube:\s*"https:\/\/youtube\.com",\s*telegram:\s*"https:\/\/t\.me",\s*whatsapp:\s*"https:\/\/wa\.me"\s*\},/,
  `socialLinks: {
    instagram: { url: "https://instagram.com", enabled: true },
    facebook: { url: "https://facebook.com", enabled: true },
    youtube: { url: "https://youtube.com", enabled: true },
    twitter: { url: "https://x.com", enabled: true },
    telegram: { url: "https://t.me", enabled: true },
    whatsapp: { url: "https://wa.me", enabled: true },
    pinterest: { url: "https://pinterest.com", enabled: false },
    linkedin: { url: "https://linkedin.com", enabled: false }
  },`
);

fs.writeFileSync('src/lib/settingsContext.tsx', code);
