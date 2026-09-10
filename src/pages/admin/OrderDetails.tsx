import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useSettings } from '../../lib/settingsContext';
import { db } from '../../lib/firebase';
import { Order, OrderStatus } from '../../lib/types';
import { Loader2, ArrowLeft, Package, Truck, User, MapPin, CreditCard, Save, Printer, Download, Clock, AlertTriangle, FileText, FileDown } from 'lucide-react';
import { format } from 'date-fns';

export default function OrderDetails() {
  const { settings } = useSettings();
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [status, setStatus] = useState<OrderStatus>('NEW');
  const [paymentStatus, setPaymentStatus] = useState<string>('PENDING');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [trackingUrl, setTrackingUrl] = useState('');
  const [courierName, setCourierName] = useState('');
  const [adminNote, setAdminNote] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetchOrder();
  }, [id]);

  const fetchOrder = async () => {
    if (!id) return;
    try {
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as Order;
        setOrder({ id: docSnap.id, ...data });
        setStatus(data.status);
        setPaymentStatus(data.paymentStatus);
        setTrackingNumber(data.trackingNumber || '');
        setTrackingUrl(data.trackingUrl || '');
        setCourierName(data.courierName || '');
        setAdminNote(data.adminNote || '');
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
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
           note: `Status updated to ${status.replace(/_/g, ' ')}`
         });
         updates.statusHistory = newHistory;
         
         const now = Date.now();
         if (status === 'SHIPPED') updates.shippedAt = now;
         if (status === 'OUT_FOR_DELIVERY') updates.outForDeliveryAt = now;
         if (status === 'DELIVERED') updates.deliveredAt = now;
         if (status === 'CANCELLED') updates.cancelledAt = now;
      }

      await updateDoc(orderRef, updates);
      setSuccessMsg('Order updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
      setOrder({ ...order, ...updates });
    } catch (error) {
      console.error(error);
      alert('Failed to update order');
    } finally {
      setSaving(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>;
  if (!order) return <div className="p-12 text-center text-slate-500">Order not found.</div>;

  return (
    <div className="pb-12 max-w-6xl mx-auto print:max-w-none print:p-0 print:m-0">
      <div className="flex items-center gap-4 mb-6 print:hidden">
        <Link to="/admin/orders" className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-3">
            Order #{order.id.slice(-6).toUpperCase()}
            <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full uppercase tracking-wider font-bold">
              {order.status.replace(/_/g, ' ')}
            </span>
          </h1>
          <p className="text-slate-500 font-medium">{format(new Date(order.createdAt), 'MMMM dd, yyyy \\at hh:mm a')}</p>
        </div>
        <div className="ml-auto flex gap-3">
          <button onClick={handlePrint} className="bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl font-bold hover:bg-slate-50 transition-colors flex items-center gap-2">
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
          <button onClick={handleUpdate} disabled={saving} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-colors flex items-center gap-2">
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="mb-6 p-4 bg-emerald-50 text-emerald-700 font-bold rounded-xl border border-emerald-200 print:hidden">
          {successMsg}
        </div>
      )}

      {/* Invoice Header (Print Only) */}
      <div className="hidden print:block mb-8 border-b-2 border-slate-800 pb-6">
        <div className="flex justify-between items-start">
          <div>
             <h1 className="text-3xl font-black text-slate-900 tracking-tighter">INVOICE</h1>
             <p className="text-slate-600 mt-1 font-bold">Order #{order.id.slice(-6).toUpperCase()}</p>
             <p className="text-slate-500 text-sm">Date: {format(new Date(order.createdAt), 'MMM dd, yyyy')}</p>
          </div>
          <div className="text-right">
             <h2 className="text-xl font-black text-slate-900">SwiftStore</h2>
             <p className="text-slate-500 text-sm">www.swiftstore.com</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Order Items & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden print:border-none print:shadow-none">
            <div className="p-6 border-b border-slate-100 bg-slate-50 print:bg-white print:p-0 print:border-b-2 print:border-slate-800 print:mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Package className="w-5 h-5" /> Order Items</h2>
            </div>
            <div className="p-6 print:p-0">
              <div className="space-y-4">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 py-4 border-b border-slate-100 last:border-0 print:py-2">
                    <div className="w-16 h-16 bg-slate-100 rounded-lg flex items-center justify-center text-slate-400 font-bold print:hidden">
                      IMG
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900">{item.name || 'Unknown Product'}</h4>
                      <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                      <p className="text-xs text-slate-400">₹{item.price.toLocaleString()} each</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-slate-100 pt-6 space-y-3 print:pt-4">
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-medium text-slate-600">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                {order.discount ? (
                  <div className="flex justify-between text-sm font-medium text-emerald-600">
                    <span>Discount</span>
                    <span>-₹{order.discount.toLocaleString()}</span>
                  </div>
                ) : null}
                <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-100">
                  <span>Grand Total</span>
                  <span>₹{order.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm print:hidden">
             <div className="p-6 border-b border-slate-100 bg-slate-50">
               <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Truck className="w-5 h-5" /> Fulfillment & Tracking</h2>
             </div>
             <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Order Status</label>
                 <select value={status} onChange={e => setStatus(e.target.value as OrderStatus)} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium">
                   <option value="NEW">New</option>
                   <option value="CONFIRMED">Confirmed</option>
                   <option value="PROCESSING">Processing</option>
                   <option value="PACKED">Packed</option>
                   <option value="SHIPPED">Shipped</option>
                   <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                   <option value="DELIVERED">Delivered</option>
                   <option value="CANCELLED">Cancelled</option>
                   <option value="RETURN_REQUESTED">Return Requested</option>
                   <option value="RETURNED">Returned</option>
                   <option value="REFUND_INITIATED">Refund Initiated</option>
                   <option value="REFUNDED">Refunded</option>
                 </select>
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Payment Status</label>
                 <select value={paymentStatus} onChange={e => setPaymentStatus(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none font-medium">
                   <option value="PENDING">Pending</option>
                   <option value="PENDING_VERIFICATION">Pending Verification (Manual UPI)</option>
                   <option value="PAID">Paid</option>
                   <option value="FAILED">Failed</option>
                   <option value="CANCELLED">Cancelled</option>
                   <option value="REFUNDED">Refunded</option>
                   <option value="PARTIALLY_REFUNDED">Partially Refunded</option>
                 </select>
               </div>
               <div>
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
                 <label className="block text-sm font-bold text-slate-700 mb-1">Tracking Number</label>
                 <input type="text" value={trackingNumber} onChange={e => {
                   const val = e.target.value;
                   setTrackingNumber(val);
                   const selectedCourier = settings?.shippingSettings?.couriers?.find(x => x.name === courierName);
                   if (selectedCourier && selectedCourier.trackingUrlFormat) {
                     setTrackingUrl(selectedCourier.trackingUrlFormat + val);
                   }
                 }} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="e.g. AWB123456789" />
               </div>
               <div>
                 <label className="block text-sm font-bold text-slate-700 mb-1">Tracking URL</label>
                 <input type="url" value={trackingUrl} onChange={e => setTrackingUrl(e.target.value)} className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="https://track.courier.com/..." />
               </div>
             </div>
          </div>
        </div>

        {/* Right Column - Customer Info */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm print:border-none print:shadow-none">
            <div className="p-6 border-b border-slate-100 bg-slate-50 print:bg-white print:p-0 print:border-b-2 print:border-slate-800 print:mb-4">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><User className="w-5 h-5" /> Customer</h2>
            </div>
            <div className="p-6 print:p-0 space-y-4">
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Contact Info</p>
                <p className="font-bold text-slate-900">{order.customerName}</p>
                <p className="text-slate-600">{order.customerEmail}</p>
                <p className="text-slate-600">{order.customerPhone}</p>
              </div>
              <div className="pt-4 border-t border-slate-100 print:pt-4">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><MapPin className="w-4 h-4" /> Shipping Address</p>
                <p className="text-slate-900 font-medium">
                  {order.address.houseNo}, {order.address.street}<br/>
                  {order.address.landmark && <>{order.address.landmark}<br/></>}
                  {order.address.city}, {order.address.state} - {order.address.pincode}
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 print:pt-4">
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1"><CreditCard className="w-4 h-4" /> Payment Details</p>
                <p className="text-slate-900 font-bold">{order.paymentMethod === 'ONLINE' ? 'Online Payment' : order.paymentMethod === 'DIRECT_UPI' ? 'Direct UPI' : 'Cash on Delivery (COD)'}</p>
                <p className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : order.paymentStatus === 'PENDING_VERIFICATION' ? 'text-blue-600' : 'text-orange-600'}`}>{order.paymentStatus}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm print:hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50">
              <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2"><FileText className="w-5 h-5" /> Internal Notes</h2>
            </div>
            <div className="p-6">
               <textarea 
                 value={adminNote} 
                 onChange={e => setAdminNote(e.target.value)} 
                 rows={4} 
                 placeholder="Add internal notes about this order. Customers will not see this."
                 className="w-full border border-slate-300 rounded-xl p-3 focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
               />
               {order.customerNote && (
                 <div className="mt-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
                   <p className="text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">Customer Note</p>
                   <p className="text-amber-900 text-sm font-medium">{order.customerNote}</p>
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Print Footer */}
      <div className="hidden print:block mt-12 text-center text-slate-500 text-sm font-medium">
        <p>Thank you for shopping with SwiftStore!</p>
        <p>If you have any questions about this invoice, please contact support.</p>
      </div>
    </div>
  );
}
