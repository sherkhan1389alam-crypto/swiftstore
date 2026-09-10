import fs from 'fs';

// 1. Fix CartContext
let cart = fs.readFileSync('src/contexts/CartContext.tsx', 'utf8');
cart = cart.replace(/removeFromCart\(productId\);/, 'removeFromCart(cartItemId);');
fs.writeFileSync('src/contexts/CartContext.tsx', cart);

// 2. Fix OrderDetails
let order = fs.readFileSync('src/pages/admin/OrderDetails.tsx', 'utf8');
if (!order.includes('const { settings } = useSettings();')) {
  order = order.replace(
    /const \{ id \} = useParams<\(\{ id: string \}\)>\(\);/,
    `const { id } = useParams<{ id: string }>();\n  const { settings } = useSettings();`
  );
}
fs.writeFileSync('src/pages/admin/OrderDetails.tsx', order);

// 3. Fix TrackOrder
let track = fs.readFileSync('src/pages/store/TrackOrder.tsx', 'utf8');
if (!track.includes('AlertTriangle')) {
  track = track.replace(/import \{ Search, Package/, 'import { Search, Package, AlertTriangle');
}
fs.writeFileSync('src/pages/store/TrackOrder.tsx', track);

// 4. Fix ProductDetails states
let prod = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');
if (!prod.includes('const [pincode, setPincode] = useState(\'\');')) {
  prod = prod.replace(
    /const \[activeImage, setActiveImage\] = useState\(''\);/,
    `const [activeImage, setActiveImage] = useState('');
  const [pincode, setPincode] = useState('');
  const [pincodeStatus, setPincodeStatus] = useState<'IDLE'|'SUCCESS'|'ERROR'>('IDLE');
  const [pincodeMsg, setPincodeMsg] = useState('');

  const checkPincode = () => {
    if (!pincode) return;
    const allowed = settings?.shippingSettings?.serviceablePincodes;
    if (!allowed || allowed.trim() === '') {
      setPincodeStatus('SUCCESS');
      setPincodeMsg('Delivery available to your location!');
      return;
    }
    const list = allowed.split(',').map(s => s.trim());
    if (list.includes(pincode)) {
      setPincodeStatus('SUCCESS');
      setPincodeMsg('Delivery available to your location!');
    } else {
      setPincodeStatus('ERROR');
      setPincodeMsg('Sorry, we do not deliver to this PIN code.');
    }
  };`
  );
}
fs.writeFileSync('src/pages/store/ProductDetails.tsx', prod);

