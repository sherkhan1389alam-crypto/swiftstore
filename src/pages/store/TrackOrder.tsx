import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, doc, getDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../lib/types';
import { Search, Package, Truck, CheckCircle, Clock, Check, FileText, MapPin, CreditCard, ChevronRight } from 'lucide-react';
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
  const navigate = useNavigate();
  const [orderNumber, setOrderNumber] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const idParam = params.get('id') || params.get('orderId');
    if (idParam) {
      setOrderNumber(idParam);
      trackOrderById(idParam);
    }
    if (params.get('success') === 'true') {
        setIsSuccess(true);
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
            {isSuccess && (
                <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-6 rounded-2xl mb-6 shadow-sm flex flex-col sm:flex-row items-center sm:items-start gap-4 animate-in fade-in slide-in-from-top-4 duration-500 text-center sm:text-left">
                    <CheckCircle className="w-12 h-12 text-emerald-600 shrink-0" />
                    <div>
                        <h3 className="text-2xl font-black tracking-tight mb-1 text-emerald-900">Order Confirmed</h3>
                        <p className="text-emerald-700 font-medium">Your order has been placed successfully.</p>
                    </div>
                </div>
            )}
            
            {/* Main Order Details Header */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-[#0b382d]"></div>
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-6 mb-6">
                    <div>
                        <h2 className="text-xl font-black text-slate-900 tracking-tight">Order #{order.orderNumber || order.id}</h2>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2 text-sm">
                            <span className="flex items-center gap-1.5 text-slate-600 font-medium">
                                <Clock className="w-4 h-4 text-slate-400" />
                                {format(new Date(order.createdAt), "d MMM yyyy • h:mm a")}
                            </span>
                        </div>
                    </div>
                    
                    <div className="flex flex-col items-start sm:items-end gap-2">
                        <span className={`px-3 py-1.5 rounded-lg text-sm font-bold uppercase tracking-wider ${
                            order.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-700' : 
                            'bg-amber-100 text-amber-700'
                        }`}>
                            {order.paymentMethod === 'COD' ? 'PAYMENT PENDING' : (order.paymentStatus === 'PAID' ? 'PAID' : 'PENDING VERIFICATION')}
                        </span>
                    </div>
                </div>

                {/* Product Summary */}
                <div className="space-y-4 mb-6">
                    {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-xl overflow-hidden shrink-0 border border-slate-200">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.name || 'Product'} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-slate-400"><Package className="w-6 h-6" /></div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-slate-900 text-base line-clamp-1">{item.name || 'Product'}</h4>
                                <p className="text-sm text-slate-500 font-medium mt-0.5">Qty: {item.quantity}</p>
                            </div>
                            <div className="text-right shrink-0">
                                <p className="font-bold text-slate-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Shipping & Total */}
                <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-sm font-medium">
                    <div className="flex justify-between text-slate-600">
                        <span>Subtotal</span>
                        <span>₹{order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}</span>
                    </div>
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
                    <div className="flex justify-between text-lg font-black text-slate-900 pt-3 border-t border-slate-200 mt-2">
                        <span>Total</span>
                        <span>₹{(order.totalAmount || order.total).toLocaleString()}</span>
                    </div>
                </div>
            </div>

            {/* Estimated Delivery Highlight */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 flex items-center gap-4 shadow-sm">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-indigo-600 shrink-0 shadow-sm border border-indigo-100">
                    <Package className="w-6 h-6" />
                </div>
                <div>
                    <h3 className="font-bold text-indigo-900 text-base uppercase tracking-wider mb-0.5">Estimated Delivery</h3>
                    <p className="text-xl font-black text-indigo-950">{format(new Date(order.estimatedDeliveryDate!), 'dd MMMM yyyy')}</p>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 relative overflow-hidden">
                <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-8 text-sm flex items-center gap-2">
                    <Truck className="w-5 h-5 text-slate-400" /> ESTIMATED SHIPPING STATUS (DEMO)
                </h3>

                {isCancelled ? (
                    <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 font-medium flex items-start gap-3">
                        <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-bold text-red-800">Order Cancelled/Returned</p>
                            <p className="text-sm mt-1">This order has been cancelled or returned. Tracking is no longer active.</p>
                        </div>
                    </div>
                ) : (
                    <div className="relative">
                        {/* Connecting Line */}
                        <div className="absolute top-3 left-3 sm:left-1/2 sm:-translate-x-1/2 bottom-3 sm:bottom-auto sm:top-5 sm:left-10 sm:right-10 sm:w-auto w-0.5 sm:h-0.5 bg-slate-100 rounded-full z-0"></div>
                        
                        {/* Mobile active line */}
                        <div className="absolute top-3 left-3 w-0.5 bg-[#0b382d] rounded-full z-0 sm:hidden transition-all duration-500" style={{ height: `${currentStatusIndex >= 0 ? (currentStatusIndex / 4) * 100 : 0}%` }}></div>
                        
                        {/* Desktop active line */}
                        <div className="absolute top-5 left-10 h-0.5 bg-[#0b382d] rounded-full z-0 hidden sm:block transition-all duration-500" style={{ width: `${currentStatusIndex >= 0 ? (currentStatusIndex / 4) * 100 : 0}%` }}></div>

                        <div className="flex flex-col sm:flex-row justify-between gap-8 sm:gap-4 relative z-10">
                            {/* Ordered */}
                            <div className="relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 sm:text-center sm:flex-1">
                                <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white ${currentStatusIndex >= 0 ? 'bg-[#0b382d]' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 0 ? <Check className="w-3.5 h-3.5 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold ${currentStatusIndex >= 0 ? 'text-slate-900' : 'text-slate-400'}`}>Ordered</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5 leading-snug whitespace-nowrap">
                                        {format(new Date(order.createdAt), "d MMM • h:mm a")}
                                    </p>
                                </div>
                            </div>

                            {/* Confirmed */}
                            <div className="relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 sm:text-center sm:flex-1">
                                <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white ${currentStatusIndex >= 1 ? 'bg-[#0b382d]' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 1 ? <Check className="w-3.5 h-3.5 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold ${currentStatusIndex >= 1 ? 'text-slate-900' : 'text-slate-400'}`}>Confirmed</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5 leading-snug whitespace-nowrap">
                                        {currentStatusIndex >= 1 ? 
                                             format(new Date(order.createdAt), "d MMM • h:mm a")
                                         : 'Pending'}
                                    </p>
                                </div>
                            </div>

                            {/* Shipped */}
                            <div className="relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 sm:text-center sm:flex-1">
                                <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white ${currentStatusIndex >= 2 ? 'bg-[#0b382d]' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 2 ? <Check className="w-3.5 h-3.5 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold ${currentStatusIndex >= 2 ? 'text-slate-900' : 'text-slate-400'}`}>Shipped</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5 leading-snug whitespace-nowrap">
                                        {order.shippedAt ? 
                                             format(new Date(order.shippedAt), "d MMM • h:mm a")
                                         : 'Awaiting shipment'}
                                    </p>
                                </div>
                            </div>

                            {/* Out for Delivery */}
                            <div className="relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 sm:text-center sm:flex-1">
                                <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white ${currentStatusIndex >= 3 ? 'bg-[#0b382d]' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 3 ? <Check className="w-3.5 h-3.5 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold ${currentStatusIndex >= 3 ? 'text-slate-900' : 'text-slate-400'}`}>Out for Delivery</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5 leading-snug whitespace-nowrap">
                                        {order.outForDeliveryAt ? 
                                             format(new Date(order.outForDeliveryAt), "d MMM • h:mm a")
                                         : `Expected ${format(new Date(order.estimatedDeliveryDate!), 'd MMM')}`}
                                    </p>
                                </div>
                            </div>

                            {/* Delivered */}
                            <div className="relative flex sm:flex-col items-start sm:items-center gap-4 sm:gap-3 sm:text-center sm:flex-1">
                                <div className={`relative z-10 w-7 h-7 rounded-full flex items-center justify-center shrink-0 border-[3px] border-white ${currentStatusIndex >= 4 ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                                    {currentStatusIndex >= 4 ? <Check className="w-3.5 h-3.5 text-white" /> : <div className="w-2 h-2 bg-slate-400 rounded-full" />}
                                </div>
                                <div>
                                    <h4 className={`text-base font-bold ${currentStatusIndex >= 4 ? 'text-slate-900' : 'text-slate-400'}`}>Delivered</h4>
                                    <p className="text-sm font-medium text-slate-500 mt-0.5 leading-snug whitespace-nowrap">
                                        {order.deliveredAt ? 
                                             format(new Date(order.deliveredAt), "d MMM • h:mm a")
                                         : `Expected ${format(new Date(order.estimatedDeliveryDate!), 'd MMM')}`}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Courier Tracking */}
            {order.trackingNumber ? (
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center text-white shrink-0">
                            <Truck className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Courier details</p>
                            <p className="text-lg font-black text-white">{order.courierName || 'Courier Partner'}</p>
                            <p className="text-slate-300 font-medium text-sm">Tracking ID: {order.trackingNumber}</p>
                        </div>
                    </div>
                    {order.trackingUrl && (
                        <a href={order.trackingUrl} target="_blank" rel="noreferrer" className="w-full sm:w-auto text-center bg-white text-slate-900 font-bold py-3 px-8 rounded-xl hover:bg-slate-100 transition-colors shadow-sm whitespace-nowrap">
                            Track Shipment
                        </a>
                    )}
                </div>
            ) : (
                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-center flex items-center justify-center gap-2">
                    <Package className="w-5 h-5 text-slate-400" />
                    <p className="text-slate-500 font-medium text-sm">Shipment tracking will be available after dispatch.</p>
                </div>
            )}

            {/* Additional Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Delivery Address */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-4 text-sm flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-slate-400" /> DELIVERY ADDRESS
                    </h3>
                    <div className="text-slate-600 text-sm leading-relaxed flex-1">
                        <p className="font-bold text-slate-900 mb-1 text-base">{order.customerName}</p>
                        {order.address.houseNo}, {order.address.street}<br/>
                        {order.address.landmark && <>{order.address.landmark}<br/></>}
                        {order.address.city}, {order.address.state} - {order.address.pincode}<br/>
                        <span className="font-bold text-slate-900 mt-3 block">Phone: {order.customerPhone}</span>
                    </div>
                </div>

                {/* Payment Detail Block */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col h-full">
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider mb-4 text-sm flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-slate-400" /> PAYMENT DETAILS
                    </h3>
                    <div className="flex-1">
                        <div className="mb-4">
                            <p className="text-sm font-medium text-slate-500 mb-1">Method</p>
                            <p className="font-bold text-slate-900">
                                {order.paymentMethod === 'ONLINE' ? 'Prepaid (Online)' : order.paymentMethod === 'DIRECT_UPI' ? 'Prepaid (Direct UPI)' : 'Cash on Delivery'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-slate-500 mb-1">Status</p>
                            <p className={`font-bold ${order.paymentStatus === 'PAID' ? 'text-emerald-600' : 'text-amber-600'}`}>
                                {order.paymentStatus === 'PAID' ? 'PAID' : 'PAYMENT PENDING'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Continue Shopping */}
            <div className="pt-4 flex justify-center">
                <Link to="/" className="inline-flex items-center gap-2 font-bold text-slate-600 hover:text-slate-900 transition-colors uppercase tracking-wider text-sm">
                    Continue Shopping <ChevronRight className="w-4 h-4" />
                </Link>
            </div>
          </div>
      )}
    </div>
  );
}
