import fs from 'fs';
let code = fs.readFileSync('src/pages/store/ProductDetails.tsx', 'utf8');

if (!code.includes('import { useSettings }')) {
  code = code.replace(
    /import \{ useCart \} from '\.\.\/\.\.\/contexts\/CartContext';/,
    `import { useCart } from '../../contexts/CartContext';\nimport { useSettings } from '../../lib/settingsContext';`
  );
}

if (!code.includes('const { settings } = useSettings();')) {
  code = code.replace(
    /const \{ addToCart \} = useCart\(\);/,
    `const { addToCart } = useCart();\n  const { settings } = useSettings();`
  );
}

if (!code.includes('const [pincode, setPincode] = useState(\'\');')) {
  code = code.replace(
    /const \[imageError, setImageError\] = useState\(false\);/,
    `const [imageError, setImageError] = useState(false);\n  const [pincode, setPincode] = useState('');\n  const [pincodeStatus, setPincodeStatus] = useState<'IDLE'|'SUCCESS'|'ERROR'>('IDLE');\n  const [pincodeMsg, setPincodeMsg] = useState('');\n  const checkPincode = () => {
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

if (!code.includes('Check Delivery')) {
  code = code.replace(
    /\{product\.description\}/,
    `{product.description}
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mt-8">
              <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2"><Truck className="w-5 h-5" /> Check Delivery Availability</h3>
              <div className="flex gap-2 relative">
                <input 
                  type="text" 
                  value={pincode} 
                  onChange={e => {setPincode(e.target.value); setPincodeStatus('IDLE');}} 
                  placeholder="Enter PIN Code" 
                  className="flex-1 bg-white border border-slate-300 rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-indigo-500 font-medium" 
                  maxLength={6}
                />
                <button onClick={checkPincode} className="bg-indigo-600 text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700 transition-colors">Check</button>
              </div>
              {pincodeStatus !== 'IDLE' && (
                <p className={\`mt-3 text-sm font-bold \${pincodeStatus === 'SUCCESS' ? 'text-emerald-600' : 'text-red-500'}\`}>
                  {pincodeMsg}
                </p>
              )}
            </div>
            
            <div className="prose prose-slate mt-8">
              {/* Rest of the original description replacing block */}`
  );
}

fs.writeFileSync('src/pages/store/ProductDetails.tsx', code);
