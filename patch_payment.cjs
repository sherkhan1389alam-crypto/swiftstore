const fs = require('fs');

let settingsCtx = fs.readFileSync('src/lib/settingsContext.tsx', 'utf8');
settingsCtx = settingsCtx.replace(/razorpaySecret\?:\s*string;\n/g, '');
settingsCtx = settingsCtx.replace(/razorpaySecret:\s*"",\n/g, '');
fs.writeFileSync('src/lib/settingsContext.tsx', settingsCtx);

let paymentSettings = fs.readFileSync('src/pages/admin/PaymentSettings.tsx', 'utf8');
paymentSettings = paymentSettings.replace(/razorpaySecret:\s*"",\n/g, '');
paymentSettings = paymentSettings.replace(/razorpaySecret:\s*settings\.paymentSettings\?\.razorpaySecret \|\| "",\n/g, '');

const regex = /<div>\s*<label[^>]*>Razorpay Key Secret<\/label>[\s\S]*?<\/div>/;
paymentSettings = paymentSettings.replace(regex, '');

fs.writeFileSync('src/pages/admin/PaymentSettings.tsx', paymentSettings);
