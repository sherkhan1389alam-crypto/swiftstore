import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Truck, Loader2, Package, MapPin, Calendar, CreditCard } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../lib/types';
import { format } from 'date-fns';

export default function OrderConfirmation() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const fetchedOrder = { id: docSnap.id, ...docSnap.data() } as Order;
          setOrder(fetchedOrder);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center p-8">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900 mb-2">Order Not Found</h2>
          <Link to="/" className="text-indigo-600 font-medium hover:underline">Return to Home</Link>
        </div>
      </div>
    );
  }

  // Demo 7-day estimated delivery limit
  const estimatedDeliveryDate = order.estimatedDeliveryDate || (order.createdAt + 7 * 24 * 60 * 60 * 1000);
  const status = order.status || 'NEW';

  return (
    <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
      <div className="text-center space-y-4 mb-8">
        <div className="mx-auto w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-emerald-600" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">✓ Order Confirmed</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Thank you for your purchase!</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Order Header Info */}
        <div className="p-6 bg-slate-50 border-b border-slate-200 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Order ID</p>
            <p className="font-bold text-slate-900">{order.orderNumber || order.id}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Order Date</p>
            <p className="font-bold text-slate-900">{format(new Date(order.createdAt), 'dd MMM yyyy')}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Total</p>
            <p className="font-bold text-slate-900">₹{order.total.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Payment</p>
            <p className="font-bold text-slate-900">{order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'Prepaid'}</p>
          </div>
        </div>

        {/* Estimated Shipping Timeline */}
        <div className="p-6 border-b border-slate-200">
          <div className="flex items-center gap-2 mb-6">
            <Truck className="w-5 h-5 text-indigo-600" />
            <h3 className="text-lg font-bold text-slate-900">Estimated Shipping Timeline</h3>
          </div>
          
          <div className="relative">
            <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>
            <div className="space-y-6">
              <div className="relative flex items-center gap-4">
                <div className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center z-10 ring-4 ring-white">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Order Placed</p>
                  <p className="text-sm text-slate-500">{format(new Date(order.createdAt), 'dd MMM yyyy, hh:mm a')}</p>
                </div>
              </div>
              <div className="relative flex items-center gap-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ring-4 ring-white ${status === 'SHIPPED' || status === 'OUT_FOR_DELIVERY' || status === 'DELIVERED' ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                  <Package className={`w-4 h-4 ${status === 'SHIPPED' || status === 'OUT_FOR_DELIVERY' || status === 'DELIVERED' ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Shipped</p>
                  <p className="text-sm text-slate-500">{order.shippedAt ? format(new Date(order.shippedAt), 'dd MMM yyyy') : 'Pending'}</p>
                </div>
              </div>
              <div className="relative flex items-center gap-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ring-4 ring-white ${status === 'OUT_FOR_DELIVERY' || status === 'DELIVERED' ? 'bg-indigo-500' : 'bg-slate-200'}`}>
                  <Truck className={`w-4 h-4 ${status === 'OUT_FOR_DELIVERY' || status === 'DELIVERED' ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Out for Delivery</p>
                  <p className="text-sm text-slate-500">{order.outForDeliveryAt ? format(new Date(order.outForDeliveryAt), 'dd MMM yyyy') : 'Pending'}</p>
                </div>
              </div>
              <div className="relative flex items-center gap-4">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center z-10 ring-4 ring-white ${status === 'DELIVERED' ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                  <CheckCircle className={`w-4 h-4 ${status === 'DELIVERED' ? 'text-white' : 'text-slate-400'}`} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Delivered</p>
                  <p className="text-sm text-slate-500">
                    {order.deliveredAt 
                      ? format(new Date(order.deliveredAt), 'dd MMM yyyy') 
                      : `Estimated Delivery: ${format(new Date(estimatedDeliveryDate), 'dd MMM yyyy')}`}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Order Items */}
          <div className="p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-900 mb-4">Items</h3>
            {order.items.map((item, idx) => (
              <div key={idx} className="flex gap-4">
                {item.imageUrl ? (
                  <img src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-xl object-contain bg-slate-50 border border-slate-100" />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center border border-slate-200">
                    <Package className="w-6 h-6 text-slate-400" />
                  </div>
                )}
                <div>
                  <p className="font-bold text-slate-900">{item.name}</p>
                  <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                  <p className="font-bold text-indigo-600">₹{item.price.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Delivery Details */}
          <div className="p-6 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MapPin className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-slate-900">Delivery Address</h3>
              </div>
              <p className="text-sm text-slate-700 font-medium">{order.customerName}</p>
              <p className="text-sm text-slate-600">{order.address.houseNo}, {order.address.street}</p>
              {order.address.landmark && <p className="text-sm text-slate-600">{order.address.landmark}</p>}
              <p className="text-sm text-slate-600">{order.address.city}, {order.address.state} {order.address.pincode}</p>
              <p className="text-sm text-slate-600">Phone: {order.customerPhone}</p>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-slate-900 mb-3">Order Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-500">Subtotal</span>
                  <span className="font-medium text-slate-900">₹{(order.total - (order.shippingCharge || 0)).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Shipping</span>
                  <span className="font-medium text-slate-900">{order.shippingCharge ? `₹${order.shippingCharge.toFixed(2)}` : 'Free'}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-base">
                  <span className="text-slate-900">Total</span>
                  <span className="text-indigo-600">₹{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center pt-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 bg-slate-900 text-white px-8 py-4 rounded-xl font-bold hover:bg-slate-800 transition-colors uppercase tracking-wider text-sm shadow-lg shadow-slate-900/20"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
