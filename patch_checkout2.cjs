const fs = require('fs');
let content = fs.readFileSync('src/pages/store/Checkout.tsx', 'utf8');
content = content.replace("navigate(`/track-order?id=${docRef.id}&success=true`);", "navigate(`/order-confirmation/${docRef.id}`);");
fs.writeFileSync('src/pages/store/Checkout.tsx', content);
