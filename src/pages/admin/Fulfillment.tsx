import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../lib/types';
import { Loader2, Copy, ExternalLink, Save } from 'lucide-react';

export default function AdminFulfillment() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);
      const orderList: Order[] = [];
      snapshot.forEach(d => {
        const data = d.data();
        if (['PAID', 'PROCESSING', 'ORDER_PLACED', 'SHIPPED', 'PENDING_PAYMENT'].includes(data.status)) {
          orderList.push({ id: d.id, ...data } as Order);
        }
      });
      setOrders(orderList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const handleUpdateFulfillment = async (orderId: string, updates: any) => {
    setUpdating(orderId);
    try {
      await updateDoc(doc(db, 'orders', orderId), updates);
      await fetchOrders();
    } catch (error) {
      console.error(error);
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Fulfillment Management</h1>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Order {order.orderNumber || order.id.slice(0,8)}</h3>
                <span className="inline-flex mt-1 px-2 py-1 text-xs font-semibold rounded-md bg-indigo-50 text-indigo-700">
                  {order.status}
                </span>
              </div>
              <div className="text-right text-sm text-slate-500">
                {new Date(order.createdAt).toLocaleString()}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Customer Info */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700 flex justify-between">
                  Customer Details
                  <button onClick={() => copyToClipboard(`${order.customerName}\n${order.customerPhone}\n${order.address?.houseNo}, ${order.address?.street}, ${order.address?.city}, ${order.address?.state} ${order.address?.pincode}`)} className="text-indigo-600 hover:text-indigo-800 text-xs flex items-center">
                    <Copy className="w-3 h-3 mr-1" /> Copy All
                  </button>
                </h4>
                
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex justify-between group">
                    <span className="text-slate-500 text-sm">Name:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{order.customerName}</span>
                      <button onClick={() => copyToClipboard(order.customerName)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex justify-between group">
                    <span className="text-slate-500 text-sm">Phone:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-slate-900">{order.customerPhone}</span>
                      <button onClick={() => copyToClipboard(order.customerPhone)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="flex justify-between group items-start">
                    <span className="text-slate-500 text-sm">Address:</span>
                    <div className="flex gap-2 text-right">
                      <span className="font-medium text-slate-900 max-w-[200px]">
                        {order.address?.houseNo}, {order.address?.street}<br/>
                        {order.address?.city}, {order.address?.state} {order.address?.pincode}
                      </span>
                      <button onClick={() => copyToClipboard(`${order.address?.houseNo}, ${order.address?.street}, ${order.address?.city}, ${order.address?.state} ${order.address?.pincode}`)} className="opacity-0 group-hover:opacity-100 text-slate-400 hover:text-indigo-600 mt-1"><Copy className="w-4 h-4" /></button>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="font-semibold text-slate-700 mb-2">Order Items</h4>
                  <div className="space-y-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="bg-indigo-50/50 p-3 rounded-lg border border-indigo-100 text-sm flex justify-between items-center">
                        <div>
                          <p className="font-semibold text-slate-900">{item.name}</p>
                          <p className="text-xs text-slate-500">Qty: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Source ID: {item.sourceId || 'N/A'}</p>
                          {item.sourceUrl && (
                            <a href={item.sourceUrl} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline text-xs flex items-center justify-end">
                              View Source <ExternalLink className="w-3 h-3 ml-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Fulfillment Actions */}
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-700">Fulfillment Status</h4>
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    const form = e.target as HTMLFormElement;
                    handleUpdateFulfillment(order.id, {
                      supplierOrderId: (form.elements.namedItem('supplierOrderId') as HTMLInputElement).value,
                      trackingNumber: (form.elements.namedItem('trackingNumber') as HTMLInputElement).value,
                      trackingUrl: (form.elements.namedItem('trackingUrl') as HTMLInputElement).value,
                      status: (form.elements.namedItem('status') as HTMLSelectElement).value,
                    });
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Supplier Order ID</label>
                    <input 
                      type="text" 
                      name="supplierOrderId"
                      defaultValue={order.supplierOrderId || ''}
                      placeholder="e.g. MEESHO-12345"
                      className="w-full rounded-xl border-slate-300 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Tracking Number</label>
                      <input 
                        type="text" 
                        name="trackingNumber"
                        defaultValue={order.trackingNumber || ''}
                        className="w-full rounded-xl border-slate-300 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">Update Status</label>
                      <select 
                        name="status"
                        defaultValue={order.status}
                        className="w-full rounded-xl border-slate-300 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      >
                        <option value="PENDING_PAYMENT">Pending Payment</option>
                        <option value="PAID">Paid / Unfulfilled</option>
                        <option value="ORDER_PLACED">Order Placed (Supplier)</option>
                        <option value="SHIPPED">Shipped</option>
                        <option value="DELIVERED">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">Tracking URL</label>
                    <input 
                      type="url" 
                      name="trackingUrl"
                      defaultValue={order.trackingUrl || ''}
                      placeholder="https://..."
                      className="w-full rounded-xl border-slate-300 p-2 text-sm focus:ring-indigo-500 focus:border-indigo-500" 
                    />
                  </div>

                  <button 
                    type="submit"
                    disabled={updating === order.id}
                    className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white p-2.5 rounded-xl font-medium hover:bg-slate-800 disabled:opacity-50 transition-colors text-sm"
                  >
                    {updating === order.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Fulfillment Details
                  </button>
                </form>
              </div>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
            No active orders need fulfillment at the moment.
          </div>
        )}
      </div>
    </div>
  );
}
