import fs from 'fs';
let rules = fs.readFileSync('firestore.rules', 'utf8');
const replacement = `
    match /settings/{settingId} {
      allow read: if true;
      allow write: if true;
    }
    
    match /wishlists/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
`;
rules = rules.replace(
  /match \/settings\/\{settingId\} \{\s*allow read: if true;\s*allow write: if true;\s*\}/,
  replacement
);
fs.writeFileSync('firestore.rules', rules);
