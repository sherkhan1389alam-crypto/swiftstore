import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order } from '../../lib/types';
import { Loader2, Package, Star } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import WriteReviewModal from '../../components/WriteReviewModal';

export default function MyOrders() {
  const { currentUser } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewProduct, setReviewProduct] = useState<{id: string, name: string} | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    const fetchOrders = async () => {
      try {
        const q = query(collection(db, 'orders'), where('userId', '==', currentUser.uid));
        const snapshot = await getDocs(q);
        const ords: Order[] = [];
        snapshot.forEach(doc => {
          ords.push({ id: doc.id, ...doc.data() } as Order);
        });
        setOrders(ords.sort((a, b) => b.createdAt - a.createdAt));
      } catch (error) {
        console.error('Failed to fetch orders', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrders();
  }, [currentUser, navigate]);

  if (!currentUser) return null;

  const deliveredCount = orders.filter(o => o.status === 'DELIVERED').length;
  const processingCount = orders.filter(o => o.status === 'PROCESSING' || o.status === 'ORDER_PLACED' || o.status === 'PAID').length;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Welcome, {currentUser.displayName?.split(' ')[0] || 'User'} 👋</h1>
      </div>

      {loading ? (
        <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-slate-400" /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-1">Total Orders</div>
              <div className="text-3xl font-bold text-slate-900">{orders.length}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-emerald-500 text-xs font-semibold uppercase tracking-wider mb-1">Delivered</div>
              <div className="text-3xl font-bold text-emerald-600">{deliveredCount}</div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="text-amber-500 text-xs font-semibold uppercase tracking-wider mb-1">Processing</div>
              <div className="text-3xl font-bold text-amber-600">{processingCount}</div>
            </div>
          </div>

          <div className="space-y-6">
            <h2 className="text-xl font-bold text-slate-900">Recent Orders</h2>
            {orders.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <Package className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">No orders yet</h3>
                <p className="text-slate-500 mb-6">When you place orders, they will appear here.</p>
                <Link to="/shop" className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium hover:bg-indigo-700">Start Shopping</Link>
              </div>
            ) : (
              orders.map(order => (
                <div key={order.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-4 sm:p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4 bg-slate-50">
                    <div>
                      <p className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-1">Order ID</p>
                      <p className="font-bold text-slate-900">#ORD-{order.id.slice(0, 8).toUpperCase()}</p>
                      {order.estimatedDeliveryDate && order.status !== 'DELIVERED' && <p className="text-sm font-bold text-indigo-600 mt-1">Delivery by {new Date(order.estimatedDeliveryDate).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}</p>}
                      {order.deliveredAt && order.status === 'DELIVERED' && <p className="text-sm font-bold text-emerald-600 mt-1">Delivered on {new Date(order.deliveredAt).toLocaleDateString('en-GB', {day: 'numeric', month: 'short'})}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700' :
                        order.status === 'CANCELLED' || order.status === 'FAILED' ? 'bg-red-100 text-red-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {order.status.replace(/_/g, ' ')}
                      </span>
                      <Link to={`/track-order?id=${order.id}`} className="text-indigo-600 text-sm font-bold hover:text-indigo-800">VIEW ORDER</Link>
                    </div>
                  </div>
                  <div className="p-4 sm:p-6">
                    <ul className="divide-y divide-slate-100">
                      {order.items.map((item, idx) => (
                        <li key={idx} className="py-4 flex justify-between items-center">
                          <div>
                            <p className="font-medium text-slate-900">{item.name || 'Product'}</p>
                            <p className="text-sm text-slate-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="flex items-center gap-4">
                            <p className="font-bold text-slate-900">₹{item.price}</p>
                            {order.status === 'DELIVERED' && (
                              <button 
                                onClick={() => {
                                  setReviewProduct({ id: item.productId, name: item.name || 'Product' });
                                  setReviewModalOpen(true);
                                }}
                                className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 bg-indigo-50 px-3 py-1.5 rounded-lg transition-colors"
                              >
                                <Star className="w-3 h-3" /> Write Review
                              </button>
                            )}
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="font-bold text-slate-900">Total Paid</span>
                      <span className="font-bold text-xl text-slate-900">₹{order.total}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}

      {reviewProduct && (
        <WriteReviewModal 
          isOpen={reviewModalOpen} 
          onClose={() => setReviewModalOpen(false)} 
          productId={reviewProduct.id} 
          productName={reviewProduct.name} 
        />
      )}
    </div>
  );
}
