import fs from 'fs';
let content = fs.readFileSync('server.ts', 'utf8');
content = content.replace(/    } else {\n      res\.status\(401\)\.json\(\{ error: 'Incorrect password\. Access denied\.' \}\);\n    }\n  \}\);/, '');
fs.writeFileSync('server.ts', content);
