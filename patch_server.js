const fs = require('fs');
const content = fs.readFileSync('server.ts', 'utf8');
console.log(content.includes('/api/admin/verify-password'));
