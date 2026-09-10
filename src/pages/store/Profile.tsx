import { useAuth } from '../../contexts/AuthContext';
import { LogOut, User, MapPin, Bell, Settings, Heart, ShoppingBag, Truck } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Profile() {
  const { currentUser, isAdmin, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  const menuItems = [
    { name: 'My Orders', icon: ShoppingBag, href: '/account/orders', desc: 'View all your recent orders' },
    { name: 'Track Order', icon: Truck, href: '/track-order', desc: 'Check the status of your shipments' },
    { name: 'Wishlist', icon: Heart, href: '/wishlist', desc: 'Your saved products' },
    { name: 'Saved Addresses', icon: MapPin, href: '/account/profile', desc: 'Manage shipping addresses' },
    { name: 'Notifications', icon: Bell, href: '/account/profile', desc: 'Alerts and updates' },
    { name: 'Account Settings', icon: Settings, href: '/account/profile', desc: 'Password and security' }
  ];

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-slate-900 mb-4">Please log in to view your profile</h2>
        <Link to="/login" className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700">Login / Sign Up</Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
      <div className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">My Account</h1>
          <p className="text-slate-500 mt-1">Manage your orders, profile, and preferences</p>
        </div>
        <button onClick={handleLogout} className="flex items-center text-red-600 hover:text-red-800 font-semibold px-4 py-2 bg-red-50 hover:bg-red-100 rounded-xl transition-colors">
          <LogOut className="w-5 h-5 mr-2" /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Profile Summary Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-200 text-center sticky top-24">
            <div className="w-24 h-24 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-3xl mx-auto mb-4">
              {currentUser.displayName?.charAt(0).toUpperCase() || 'U'}
            </div>
            <h2 className="text-xl font-bold text-slate-900">{currentUser.displayName || 'User'}</h2>
            <p className="text-slate-500 mb-6">{currentUser.email}</p>
            {
              isAdmin && (
                <Link to="/admin" className="block w-full py-3 bg-indigo-600 text-white hover:bg-indigo-700 rounded-xl font-bold mb-4 shadow-lg shadow-indigo-200 transition-colors">
                  Open Admin Panel
                </Link>
              )
            }
            <div className="border-t border-slate-100 pt-6">
              <Link to="/account/orders" className="block w-full py-3 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl font-semibold mb-3 transition-colors">
                View Order History
              </Link>
              <Link to="/contact" className="block w-full py-3 text-indigo-600 hover:bg-indigo-50 rounded-xl font-semibold transition-colors">
                Contact Support
              </Link>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {menuItems.map((item, idx) => (
              <Link key={idx} to={item.href} className="group bg-white rounded-3xl p-6 shadow-sm border border-slate-200 hover:border-indigo-600 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors">{item.name}</h3>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 bg-amber-50 rounded-3xl p-6 border border-amber-200">
            <h3 className="text-lg font-bold text-amber-900 mb-2">Need Help?</h3>
            <p className="text-amber-800 mb-4 text-sm">If you have any questions about your account or a recent order, our support team is available 24/7.</p>
            <Link to="/contact" className="inline-block bg-amber-600 text-white font-bold py-2 px-6 rounded-lg hover:bg-amber-700 transition-colors text-sm">
              Contact Us
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
