import re

with open('src/pages/store/TrackOrder.tsx', 'r') as f:
    content = f.read()

replacement = """import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../lib/types';
import { Search, Package, Truck, CheckCircle, Clock, Check, MessageSquareText, FileText, AlertTriangle, Box, MapPin, CreditCard } from 'lucide-react';
import { useSettings } from '../../lib/settingsContext';
import { format } from 'date-fns';

const MAX_ESTIMATED_DELIVERY_DAYS = 7;

function calculateEstimatedDelivery(createdAt: number) {
    const orderDate = new Date(createdAt);
    const deliveryDate = new Date(orderDate);
    deliveryDate.setDate(deliveryDate.getDate() + MAX_ESTIMATED_DELIVERY_DAYS);
    return deliveryDate.getTime();
}

export default function TrackOrder() {
  const { settings } = useSettings();
  const location = useLocation();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id') || params.get('orderId');
    if (idParam) {
      setOrderNumber(idParam);
      trackOrderById(idParam);
    }
  }, [location]);

  // Handle Real-time subscription
  useEffect(() => {
    if (!order?.id) return;
    const unsub = onSnapshot(doc(db, 'orders', order.id), (docSnap) => {
      if (docSnap.exists()) {
        const data = { id: docSnap.id, ...docSnap.data() } as Order;
        setOrder(processOrderData(data));
      }
    });
    return () => unsub();
  }, [order?.id]);

  const processOrderData = (data: Order) => {
    const maxEstimated = calculateEstimatedDelivery(data.createdAt);
    if (!data.estimatedDeliveryDate || data.estimatedDeliveryDate > maxEstimated) {
      data.estimatedDeliveryDate = maxEstimated;
    }
    return data;
  };

  const trackOrderById = async (id: string) => {
    if (!id.trim()) return;
    setLoading(true);
    setError('');
    
    try {
      let orderData: Order | null = null;
      try {
         const directDoc = await getDoc(doc(db, 'orders', id.trim()));
         if (directDoc.exists()) {
           orderData = { id: directDoc.id, ...directDoc.data() } as Order;
         }
      } catch (e) {}

      if (!orderData) {
        const q = query(collection(db, 'orders'), where('orderNumber', '==', id.trim()));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          orderData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() } as Order;
        }
      }

      if (orderData) {
        setOrder(processOrderData(orderData));
      } else {
        setError('Order not found. Please check the order number and try again.');
        setOrder(null);
      }
    } catch (err) {
      console.error(err);
      setError('An error occurred while tracking your order.');
    } finally {
      setLoading(false);
    }
  };

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    trackOrderById(orderNumber);
  };

  const getStatusIndex = (status: string) => {
    switch (status) {
      case 'NEW': return 0;
      case 'CONFIRMED': 
      case 'PROCESSING': 
      case 'PACKED': return 1;
      case 'SHIPPED': return 2;
      case 'OUT_FOR_DELIVERY': return 3;
      case 'DELIVERED': return 4;
      default: return -1;
    }
  };

  const currentStatusIndex = order ? getStatusIndex(order.status) : -1;
  const isCancelled = ['CANCELLED', 'RETURN_REQUESTED', 'RETURNED', 'REFUND_INITIATED', 'REFUNDED'].includes(order?.status || '');

  const handleSupportClick = () => {
    if (settings?.whatsappSupport?.enabled && settings.whatsappSupport.phoneNumber) {
      const num = settings.whatsappSupport.countryCode + settings.whatsappSupport.phoneNumber;
      const text = encodeURIComponent(`Hello Support, I need help with my order #${order?.id}.`);
      window.open(`https://wa.me/${num}?text=${text}`, '_blank');
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
      {!order ? (
          <div className="text-center mb-10 mt-10">
            <h1 className="text-3xl font-bold text-slate-900 mb-4">Track Your Order</h1>
            <p className="text-slate-500 mb-8">Enter your order ID to see the live status of your shipment.</p>
            <form onSubmit={handleTrack} className="flex flex-col sm:flex-row gap-4 max-w-lg mx-auto">
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter Order ID..."
                  className="block w-full pl-11 pr-4 py-4 rounded-xl border border-slate-300 focus:ring-indigo-600 focus:border-indigo-600 text-base font-medium"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#0b382d] text-white font-bold py-4 px-8 rounded-xl hover:bg-emerald-900 transition-colors disabled:opacity-70 flex justify-center items-center whitespace-nowrap shadow-lg shadow-emerald-900/20"
              >
                {loading ? 'Tracking...' : 'Track Order'}
              </button>
            </form>
            {error && <p className="mt-4 text-red-500 text-center font-bold bg-red-50 py-3 rounded-xl max-w-lg mx-auto">{error}</p>}
          </div>
      ) : (
          <div className="space-y-6">
            <button onClick={() => setOrder(null)} className="text-sm font-bold text-slate-500 hover:text-slate-900 mb-2 flex items-center gap-1 uppercase tracking-wider">
               &larr; Track Another Order
            </button>
            
            {/* Top Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <p className="text-sm font-bold text-slate-900 uppercase tracking-wider">Order #{order.orderNumber || order.id.slice(-6).toUpperCase()}</p>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${isCancelled ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'}`}>
                        {order.status.replace(/_/g, ' ')}
                    </span>
                </div>
                
                <div className="p-5">
                    {order.items.slice(0, 1).map((item, idx) => (
                        <div key={idx} className="flex gap-4 items-center">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-cover bg-slate-100 border border-slate-200" />
                            ) : (
                                <div className="w-16 h-16 bg-slate-100 rounded-xl flex items-center justify-center border border-slate-200">
                                    <Package className="w-8 h-8 text-slate-300" />
                                </div>
                            )}
                            <div className="flex-1">
                                <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                                {item.selectedVariants && Object.entries(item.selectedVariants).map(([k, v]) => (
                                    <span key={k} className="text-xs text-slate-500 mr-2">{v}</span>
                                ))}
                                {order.items.length > 1 && (
                                    <p className="text-xs text-slate-500 font-medium mt-0.5">+ {order.items.length - 1} more item(s)</p>
                                )}
                            </div>
                            <div className="text-right">
                                <p className="font-black text-slate-900 text-lg">₹{order.totalAmount || order.total}</p>
                                <p className="text-xs font-bold text-slate-500 uppercase">{order.paymentMethod === 'ONLINE' ? 'PAID' : 'COD'}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Status Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="p-5 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600">
                            <Box className="w-5 h-5" />
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-900 tracking-tight">ORDER STATUS</h2>
                            <p className="text-sm font-medium text-slate-600 mt-0.5">
                                {isCancelled ? 'Order Cancelled' : currentStatusIndex >= 4 ? 'Delivered successfully' : 'On the way'}
                            </p>
                        </div>
                    </div>
                </div>

                {isCancelled ? (
                    <div className="p-8 text-center bg-red-50">
                        <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-3" />
                        <h3 className="text-lg font-bold text-red-700 mb-1">Order Cancelled</h3>
                        <p className="text-red-600 font-medium">This order has been cancelled or returned.</p>
                    </div>
                ) : (
                    <div className="p-6 md:p-8">
                        <p className="font-bold text-indigo-700 mb-8 pb-4 border-b border-slate-100 flex items-center gap-2">
                           <Clock className="w-5 h-5" /> Delivery by {format(new Date(order.estimatedDeliveryDate!), 'EEE, dd MMM yyyy')}
                        </p>
                        
                        <div className="relative pl-4 md:pl-8 ml-2 border-l-2 border-slate-100 space-y-8">
                            
                            {/* Ordered */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] md:-left-[37px] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white ${currentStatusIndex >= 0 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 0 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <h4 className={`text-base font-bold ${currentStatusIndex >= 0 ? 'text-slate-900' : 'text-slate-400'}`}>Ordered</h4>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">{format(new Date(order.createdAt), 'dd MMM')}</p>
                            </div>

                            {/* Confirmed */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] md:-left-[37px] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white ${currentStatusIndex >= 1 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 1 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <h4 className={`text-base font-bold ${currentStatusIndex >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Confirmed</h4>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">{currentStatusIndex >= 1 ? format(new Date(order.createdAt), 'dd MMM') : 'Pending'}</p>
                            </div>

                            {/* Shipped */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] md:-left-[37px] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white ${currentStatusIndex >= 2 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 2 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <h4 className={`text-base font-bold ${currentStatusIndex >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Shipped</h4>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">
                                    {order.shippedAt ? format(new Date(order.shippedAt), 'dd MMM') : 'Pending'}
                                </p>
                            </div>

                            {/* Out for Delivery */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] md:-left-[37px] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white ${currentStatusIndex >= 3 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 3 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <h4 className={`text-base font-bold ${currentStatusIndex >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Out for Delivery</h4>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">
                                    {order.outForDeliveryAt ? format(new Date(order.outForDeliveryAt), 'dd MMM') : (currentStatusIndex >= 2 ? 'Estimated ' + format(new Date(order.estimatedDeliveryDate!), 'dd MMM') : 'Pending')}
                                </p>
                            </div>

                            {/* Delivered */}
                            <div className="relative">
                                <div className={`absolute -left-[21px] md:-left-[37px] w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center border-[3px] md:border-4 border-white ${currentStatusIndex >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 4 ? <Check className="w-3 h-3 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <h4 className={`text-base font-bold ${currentStatusIndex >= 4 ? 'text-slate-900' : 'text-slate-400'}`}>Delivered</h4>
                                <p className="text-sm font-medium text-slate-500 mt-0.5">
                                    {order.deliveredAt 
                                        ? format(new Date(order.deliveredAt), 'dd MMM') 
                                        : (currentStatusIndex >= 2 ? 'Estimated ' + format(new Date(order.estimatedDeliveryDate!), 'dd MMM') : 'Pending')
                                    }
                                </p>
                            </div>

                        </div>
                    </div>
                )}
            </div>

            {/* Courier Tracking */}
            {order.trackingNumber ? (
                <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-indigo-600">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-indigo-900 uppercase tracking-wider mb-1">Courier & Tracking</p>
                            <p className="text-lg font-black text-indigo-950">{order.courierName || 'Courier Partner'}</p>
                            <p className="text-indigo-700 font-medium">Tracking ID: {order.trackingNumber}</p>
                        </div>
                    </div>
                    {order.trackingUrl && (
                        <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="w-full md:w-auto text-center bg-white text-indigo-600 border border-indigo-200 font-bold py-3 px-8 rounded-xl hover:bg-indigo-50 transition-colors shadow-sm whitespace-nowrap">
                            Track Shipment
                        </a>
                    )}
                </div>
            ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center">
                    <p className="text-slate-500 font-medium text-sm">Courier tracking will be available after your order is shipped.</p>
                </div>
            )}

            {/* Estimated Delivery Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex items-start gap-4">
                <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 shrink-0">
                    <Package className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-slate-900 text-base">Estimated Delivery</h3>
                    <p className="text-lg font-black text-slate-900 mt-0.5">{format(new Date(order.estimatedDeliveryDate!), 'dd MMMM yyyy')}</p>
                    <p className="text-sm font-medium text-slate-500 mt-2">Your estimated delivery date is calculated automatically from your order date.</p>
                </div>
            </div>

            {/* Order Details & Address */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-4 text-sm flex items-center gap-2">
                        <FileText className="w-4 h-4 text-slate-400" /> ORDER DETAILS
                    </h3>
                    <ul className="space-y-3 mb-4 border-b border-slate-100 pb-4">
                        {order.items.map((item, idx) => (
                            <li key={idx} className="flex justify-between text-sm">
                                <span className="text-slate-700 font-medium line-clamp-1 pr-4">{item.name} <span className="text-slate-400 ml-1">x{item.quantity}</span></span>
                                <span className="font-bold text-slate-900 shrink-0">₹{(item.price * item.quantity).toLocaleString()}</span>
                            </li>
                        ))}
                    </ul>
                    <div className="space-y-2 mb-4 text-sm font-medium">
                        <div className="flex justify-between text-slate-600">
                            <span>Shipping</span>
                            <span>{order.shippingCharge ? `₹${order.shippingCharge}` : 'Free'}</span>
                        </div>
                        {order.paymentFee ? (
                           <div className="flex justify-between text-slate-600">
                               <span>Payment Fee (COD)</span>
                               <span>₹{order.paymentFee}</span>
                           </div>
                        ) : null}
                    </div>
                    <div className="flex justify-between text-lg font-black text-slate-900 pt-4 border-t border-slate-100">
                        <span>Total</span>
                        <span>₹{(order.totalAmount || order.total).toLocaleString()}</span>
                    </div>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col">
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-4 text-sm flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-slate-400" /> DELIVERY ADDRESS
                    </h3>
                    <div className="text-slate-600 text-sm leading-relaxed mb-6 flex-1">
                        <p className="font-bold text-slate-900 mb-1">{order.customerName}</p>
                        {order.address.houseNo}, {order.address.street}<br/>
                        {order.address.landmark && <>{order.address.landmark}<br/></>}
                        {order.address.city}, {order.address.state} - {order.address.pincode}<br/>
                        <span className="font-medium mt-2 block">{order.customerPhone}</span>
                    </div>

                    <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-3 text-sm flex items-center gap-2 pt-4 border-t border-slate-100">
                        <CreditCard className="w-4 h-4 text-slate-400" /> PAYMENT
                    </h3>
                    <div>
                        <p className="text-sm font-medium text-slate-600 uppercase">
                            {order.paymentMethod === 'ONLINE' ? 'Paid Online' : order.paymentMethod === 'DIRECT_UPI' ? 'Direct UPI' : 'Cash on Delivery'}
                        </p>
                        <p className="text-xs font-bold text-slate-400 uppercase mt-1">{order.paymentStatus}</p>
                    </div>
                </div>
            </div>

          </div>
      )}
    </div>
  );
}
"""

with open('src/pages/store/TrackOrder.tsx', 'w') as f:
    f.write(replacement)

