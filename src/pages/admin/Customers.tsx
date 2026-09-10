import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Customer } from '../../lib/types';
import { Loader2, Users as UsersIcon, Mail, Phone, ShoppingBag, ShieldBan, ShieldCheck, Search } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filtered, setFiltered] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      // First fetch from the actual customers collection
      const custSnap = await getDocs(collection(db, 'customers'));
      const dbCustomers = new Map<string, any>();
      custSnap.forEach(d => dbCustomers.set(d.id, d.data()));

      // Fallback/compute from orders
      const orderSnap = await getDocs(collection(db, 'orders'));
      const customerMap = new Map<string, Customer>();

      orderSnap.forEach(doc => {
        const order = doc.data();
        const email = order.customerEmail;
        
        if (email) {
          const id = order.userId || email;
          const dbCust = dbCustomers.get(id);

          if (!customerMap.has(id)) {
            customerMap.set(id, {
              id,
              name: order.customerName,
              email: order.customerEmail,
              phone: order.customerPhone,
              totalOrders: order.status !== 'CANCELLED' ? 1 : 0,
              totalSpent: order.status !== 'CANCELLED' && order.status !== 'REFUNDED' ? order.total : 0,
              createdAt: order.createdAt,
              isBlocked: dbCust?.isBlocked || false
            });
          } else {
            const cust = customerMap.get(id)!;
            if (order.status !== 'CANCELLED') cust.totalOrders += 1;
            if (order.status !== 'CANCELLED' && order.status !== 'REFUNDED') cust.totalSpent += order.total;
            if (order.createdAt > cust.createdAt) cust.createdAt = order.createdAt; // Actually last order date
          }
        }
      });

      const customerList = Array.from(customerMap.values()).sort((a, b) => b.totalSpent - a.totalSpent);
      setCustomers(customerList);
      setFiltered(customerList);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      setFiltered(customers.filter(c => 
        c.name.toLowerCase().includes(lower) || 
        c.email.toLowerCase().includes(lower) ||
        c.phone.includes(lower)
      ));
    } else {
      setFiltered(customers);
    }
  }, [searchTerm, customers]);

  const toggleBlock = async (customer: Customer) => {
    const isBlocking = !customer.isBlocked;
    if (window.confirm(`Are you sure you want to ${isBlocking ? 'block' : 'unblock'} ${customer.name}?`)) {
      try {
        await setDoc(doc(db, 'customers', customer.id), { isBlocked: isBlocking }, { merge: true });
        setCustomers(prev => prev.map(c => c.id === customer.id ? { ...c, isBlocked: isBlocking } : c));
      } catch (err) {
        console.error(err);
        alert('Failed to update customer status');
      }
    }
  };

  return (
    <div className="pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Customers</h1>
          <p className="text-slate-500">Manage your store's customers and view their history.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-slate-100 flex flex-col md:flex-row gap-4 bg-slate-50">
           <div className="relative flex-1 max-w-md">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
             <input 
               type="text" 
               placeholder="Search by name, email or phone..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none text-sm font-medium"
             />
           </div>
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Contact</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total Spent</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Orders</th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500 font-medium">No customers found.</td></tr>
                ) : filtered.map(customer => (
                  <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 shrink-0 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold">
                          {customer.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-bold text-slate-900">{customer.name}</div>
                          <div className="text-xs text-slate-500">Last order: {format(new Date(customer.createdAt), 'MMM dd, yyyy')}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 flex items-center gap-2 mb-1"><Mail className="w-3 h-3 text-slate-400"/> {customer.email}</div>
                      <div className="text-sm text-slate-600 flex items-center gap-2"><Phone className="w-3 h-3 text-slate-400"/> {customer.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-black text-indigo-600">₹{customer.totalSpent.toLocaleString()}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <ShoppingBag className="w-4 h-4 text-slate-400" /> {customer.totalOrders}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {customer.isBlocked ? (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-red-100 text-red-800 border-red-200">Blocked</span>
                      ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full bg-emerald-100 text-emerald-800 border-emerald-200">Active</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                       <button onClick={() => toggleBlock(customer)} className={`p-2 rounded-lg transition-colors ${customer.isBlocked ? 'text-emerald-600 hover:bg-emerald-50' : 'text-red-600 hover:bg-red-50'}`}>
                         {customer.isBlocked ? <ShieldCheck className="w-5 h-5" title="Unblock" /> : <ShieldBan className="w-5 h-5" title="Block" />}
                       </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
