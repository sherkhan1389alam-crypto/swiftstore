import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Order, Product, Customer } from '../../lib/types';
import { 
  LayoutDashboard, ShoppingBag, Grid, Users, TrendingUp, IndianRupee, Clock, RefreshCcw, Star,
  CheckCircle, XCircle, AlertTriangle, Package, Truck, Activity, CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';
import { format, subDays, startOfDay, endOfDay, isAfter, isBefore } from 'date-fns';

export default function Dashboard() {
  const [dateFilter, setDateFilter] = useState('30days');
  const [loading, setLoading] = useState(true);
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    todayOrders: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    cancelledOrders: 0,
    totalRevenue: 0,
    todayRevenue: 0,
    totalProfit: 0,
    pendingPayments: 0,
    pendingShipments: 0,
    returnRequests: 0,
    lowStockProducts: 0,
    totalCustomers: 0
  });

  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, [dateFilter]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [ordersSnap, productsSnap, customersSnap] = await Promise.all([
        getDocs(collection(db, 'orders')),
        getDocs(collection(db, 'products')),
        getDocs(collection(db, 'customers')) // Might fail if collection doesn't exist, handle gracefully
      ]);

      let ordersList: Order[] = [];
      ordersSnap.forEach(doc => ordersList.push({ id: doc.id, ...doc.data() } as Order));
      
      let productsList: Product[] = [];
      productsSnap.forEach(doc => productsList.push({ id: doc.id, ...doc.data() } as Product));

      const now = new Date();
      const todayStart = startOfDay(now).getTime();
      const todayEnd = endOfDay(now).getTime();
      
      let filterStart = 0;
      if (dateFilter === 'today') filterStart = todayStart;
      else if (dateFilter === 'yesterday') filterStart = startOfDay(subDays(now, 1)).getTime();
      else if (dateFilter === '7days') filterStart = subDays(now, 7).getTime();
      else if (dateFilter === '30days') filterStart = subDays(now, 30).getTime();
      else if (dateFilter === 'thisMonth') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        filterStart = startOfMonth.getTime();
      }

      // Filter orders by date range (unless we need all-time for some stats, which we do)
      let s = {
        totalOrders: ordersList.length,
        todayOrders: 0,
        pendingOrders: 0,
        deliveredOrders: 0,
        cancelledOrders: 0,
        totalRevenue: 0,
        todayRevenue: 0,
        totalProfit: 0,
        pendingPayments: 0,
        pendingShipments: 0,
        returnRequests: 0,
        lowStockProducts: 0,
        totalCustomers: customersSnap.docs.length
      };

      // Chart aggregation
      const dailyData: Record<string, { date: string; revenue: number; profit: number; orders: number }> = {};

      ordersList.forEach(order => {
        const orderDate = new Date(order.createdAt);
        const dateString = format(orderDate, 'MMM dd');
        
        // Populate chart data only for filtered range
        if (order.createdAt >= filterStart) {
           if (!dailyData[dateString]) {
             dailyData[dateString] = { date: dateString, revenue: 0, profit: 0, orders: 0 };
           }
           dailyData[dateString].orders += 1;
           if (order.status !== 'CANCELLED' && order.status !== 'REFUNDED') {
             dailyData[dateString].revenue += order.total;
             // Calculate profit if available
             let orderProfit = 0;
             order.items.forEach(item => {
                if (item.cost) {
                  orderProfit += ((item.price - item.cost) * item.quantity);
                }
             });
             dailyData[dateString].profit += orderProfit;
           }
        }

        // All time stats
        if (order.status !== 'CANCELLED' && order.status !== 'REFUNDED') {
          s.totalRevenue += order.total;
          order.items.forEach(item => {
            if (item.cost) {
              s.totalProfit += ((item.price - item.cost) * item.quantity);
            }
          });
        }

        if (order.createdAt >= todayStart && order.createdAt <= todayEnd) {
          s.todayOrders++;
          if (order.status !== 'CANCELLED' && order.status !== 'REFUNDED') {
            s.todayRevenue += order.total;
          }
        }

        if (['NEW', 'CONFIRMED', 'PROCESSING'].includes(order.status)) s.pendingOrders++;
        if (order.status === 'DELIVERED') s.deliveredOrders++;
        if (order.status === 'CANCELLED') s.cancelledOrders++;
        if (order.paymentStatus === 'PENDING') s.pendingPayments++;
        if (['NEW', 'CONFIRMED', 'PROCESSING', 'PACKED'].includes(order.status)) s.pendingShipments++;
        if (['RETURN_REQUESTED'].includes(order.status)) s.returnRequests++;
      });

      const lowStock = productsList.filter(p => (p.stock !== undefined && p.stock <= (p.lowStockThreshold || 5)));
      s.lowStockProducts = lowStock.length;
      
      setStats(s);
      
      ordersList.sort((a, b) => b.createdAt - a.createdAt);
      setRecentOrders(ordersList.slice(0, 10));
      setLowStockItems(lowStock.slice(0, 5));
      
      // Convert dailyData map to sorted array
      const chartArr = Object.values(dailyData).sort((a, b) => {
        return new Date(a.date + ' ' + now.getFullYear()).getTime() - new Date(b.date + ' ' + now.getFullYear()).getTime();
      });
      
      setChartData(chartArr);

    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const statCards = [
    { title: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: IndianRupee, color: 'bg-emerald-100 text-emerald-600' },
    { title: "Today's Revenue", value: `₹${stats.todayRevenue.toLocaleString()}`, icon: Activity, color: 'bg-blue-100 text-blue-600' },
    { title: 'Total Profit', value: `₹${stats.totalProfit.toLocaleString()}`, icon: TrendingUp, color: 'bg-purple-100 text-purple-600' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ShoppingBag, color: 'bg-indigo-100 text-indigo-600' },
    { title: "Today's Orders", value: stats.todayOrders, icon: Package, color: 'bg-cyan-100 text-cyan-600' },
    { title: 'Pending Shipments', value: stats.pendingShipments, icon: Truck, color: 'bg-amber-100 text-amber-600' },
    { title: 'Pending Payments', value: stats.pendingPayments, icon: CreditCard, color: 'bg-orange-100 text-orange-600' },
    { title: 'Return Requests', value: stats.returnRequests, icon: RefreshCcw, color: 'bg-rose-100 text-rose-600' },
    { title: 'Low Stock Items', value: stats.lowStockProducts, icon: AlertTriangle, color: 'bg-red-100 text-red-600' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-500">Welcome back! Here's what's happening with your store today.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <select 
            value={dateFilter}
            onChange={e => setDateFilter(e.target.value)}
            className="border-slate-200 rounded-xl px-4 py-2.5 text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="today">Today</option>
            <option value="yesterday">Yesterday</option>
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="thisMonth">This Month</option>
            <option value="allTime">All Time</option>
          </select>
          <button onClick={fetchDashboardData} className="p-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <RefreshCcw className="w-5 h-5 text-slate-600" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {statCards.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center text-center justify-center">
              <div className={`w-12 h-12 ${stat.color} rounded-full flex items-center justify-center mb-3`}>
                <Icon className="w-6 h-6" />
              </div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">{stat.title}</p>
              <h3 className="text-xl font-black text-slate-900">{stat.value}</h3>
            </div>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">Revenue & Profit Trend</h2>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#4f46e5" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} />
                <YAxis tick={{fontSize: 12, fill: '#64748b'}} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${val}`} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  formatter={(value: number) => [`₹${value.toLocaleString()}`]}
                />
                <Legend />
                <Area type="monotone" dataKey="revenue" name="Revenue" stroke="#4f46e5" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
                <Area type="monotone" dataKey="profit" name="Profit" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorProfit)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h2 className="text-lg font-bold text-slate-900">Low Stock Alerts</h2>
             <Link to="/admin/products" className="text-sm font-medium text-indigo-600 hover:text-indigo-800">View All</Link>
          </div>
          {lowStockItems.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center">
               <CheckCircle className="w-12 h-12 text-emerald-400 mb-3" />
               <p className="text-slate-500 font-medium">All products are well stocked!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 p-3 bg-red-50 rounded-xl border border-red-100">
                   <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0 border border-slate-100">
                     <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                     <h4 className="font-bold text-slate-900 truncate text-sm">{item.name}</h4>
                     <p className="text-xs text-red-600 font-bold mt-0.5">Only {item.stock} left in stock!</p>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <h2 className="text-lg font-bold text-slate-900">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm font-bold text-indigo-600 hover:text-indigo-800">View All Orders</Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-bold text-slate-500 uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-6 py-8 text-center text-slate-500">No recent orders found</td></tr>
              ) : recentOrders.map(order => (
                <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">#{order.id.slice(-6).toUpperCase()}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{format(new Date(order.createdAt), 'MMM dd, hh:mm a')}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-slate-900">{order.customerName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-slate-900">₹{order.total.toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full
                      ${order.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-800' : 
                        order.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 
                        'bg-blue-100 text-blue-800'}`}>
                      {order.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link to={`/admin/orders/${order.id}`} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-4 py-2 rounded-lg transition-colors">View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
