import fs from 'fs';
let content = fs.readFileSync('src/pages/admin/Security.tsx', 'utf8');

// Add logout to useAuth destruct
content = content.replace(/const \{ currentUser \} = useAuth\(\);/, "const { currentUser, logout } = useAuth();");

// Replace the require block
content = content.replace(/const \{ getAuth, signOut \} = require\('firebase\/auth'\);\n\s*signOut\(getAuth\(\)\);/, "logout();");

fs.writeFileSync('src/pages/admin/Security.tsx', content);
