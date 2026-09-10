const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Remove the duplicates
content = content.replace(/<Route path="shipping" element=\{<AdminPlaceholder.*\}\ \/>\n/g, '');
content = content.replace(/<Route path="payment-settings" element=\{<AdminPlaceholder.*\}\ \/>\n/g, '');
content = content.replace(/<Route path="security" element=\{<AdminPlaceholder.*\}\ \/>\n/g, '');

fs.writeFileSync('src/App.tsx', content);
