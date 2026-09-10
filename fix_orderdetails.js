import fs from 'fs';
let code = fs.readFileSync('src/pages/admin/OrderDetails.tsx', 'utf8');

if (!code.includes('import { useSettings }')) {
  code = code.replace(
    /import \{ doc, getDoc, updateDoc \} from 'firebase\/firestore';/,
    `import { doc, getDoc, updateDoc } from 'firebase/firestore';\nimport { useSettings } from '../../lib/settingsContext';`
  );
}

if (!code.includes('const { settings } = useSettings();')) {
  code = code.replace(
    /const \{ id \} = useParams<\(\{ id: string \}\)>\(\);/,
    `const { id } = useParams<{ id: string }>();\n  const { settings } = useSettings();`
  );
}

if (!code.includes('const [courierName, setCourierName] = useState(\'\');')) {
  code = code.replace(
    /const \[trackingUrl, setTrackingUrl\] = useState\(''\);/,
    `const [trackingUrl, setTrackingUrl] = useState('');\n  const [courierName, setCourierName] = useState('');`
  );
}

code = code.replace(
  /setTrackingUrl\(data\.trackingUrl \|\| ''\);/,
  `setTrackingUrl(data.trackingUrl || '');\n        setCourierName(data.courierName || '');`
);

code = code.replace(
  /const handleUpdate = async \(\) => \{[\s\S]*?\} catch \(error\) \{/m,
  `const handleUpdate = async () => {
    if (!id || !order) return;
    setSaving(true);
    setSuccessMsg('');

    try {
      const orderRef = doc(db, 'orders', id);
      const updates: any = {
        status,
        paymentStatus,
        trackingNumber,
        trackingUrl,
        adminNote,
        courierName
      };

      if (order.status !== status) {
         const newHistory = [...(order.statusHistory || [])];
         newHistory.push({
           status: status,
           date: Date.now(),
           note: \`Status updated to \${status.replace(/_/g, ' ')}\`
         });
         updates.statusHistory = newHistory;
      }

      await updateDoc(orderRef, updates);
      setSuccessMsg('Order updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setOrder({ ...order, ...updates });
    } catch (error) {`
);

code = code.replace(
  /<div>\s*<label className="block text-sm font-bold text-slate-700 mb-1">Tracking Number<\/label>/,
  `<div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Courier Partner</label>
                 <select value={courierName} onChange={e => {
                    const c = e.target.value;
                    setCourierName(c);
                    const selectedCourier = settings?.shippingSettings?.couriers?.find(x => x.name === c);
                    if (selectedCourier && selectedCourier.trackingUrlFormat) {
                       setTrackingUrl(selectedCourier.trackingUrlFormat + (trackingNumber || ''));
                    }
                 }} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium">
                   <option value="">Select Courier</option>
                   {settings?.shippingSettings?.couriers?.filter(c => c.active).map(c => (
                     <option key={c.id} value={c.name}>{c.name}</option>
                   ))}
                   <option value="Other">Other</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Tracking Number</label>`
);

code = code.replace(
  /<input type="text" value=\{trackingNumber\} onChange=\{e => setTrackingNumber\(e.target.value\)\} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e\.g\. AWB123456789" \/>/,
  `<input type="text" value={trackingNumber} onChange={e => {
                   const val = e.target.value;
                   setTrackingNumber(val);
                   const selectedCourier = settings?.shippingSettings?.couriers?.find(x => x.name === courierName);
                   if (selectedCourier && selectedCourier.trackingUrlFormat) {
                     setTrackingUrl(selectedCourier.trackingUrlFormat + val);
                   }
                 }} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. AWB123456789" />`
);

fs.writeFileSync('src/pages/admin/OrderDetails.tsx', code);
