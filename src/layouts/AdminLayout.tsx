import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Image, ShoppingBag, Grid, Image as ImageIcon, Users, Settings, LogOut, 
  CreditCard, BarChart3, Ticket, Undo2, Truck, Star, Bell, Menu, X
} from 'lucide-react';
import { cn } from '../lib/utils';
import { useAuth } from '../contexts/AuthContext';

export const AdminLayout = () => {
  const location = useLocation();
  const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    sessionStorage.removeItem('owner_auth');
    await logout();
  };
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingBag },
    { 
      name: 'Products', 
      icon: Grid,
      subItems: [
        { name: 'All Products', href: '/admin/products' },
        { name: 'Add Product', href: '/admin/products/new' },
      ]
    },
    { name: 'Categories', href: '/admin/categories', icon: Grid },
    { name: 'Hero Banners', href: '/admin/hero-banners', icon: ImageIcon },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Fulfillment', href: '/admin/fulfillment', icon: Truck },
    { name: 'Reviews', href: '/admin/reviews', icon: Star },
    { name: 'Homepage', href: '/admin/homepage', icon: LayoutDashboard },
    { name: 'Branding', href: '/admin/branding', icon: Image },
    { name: 'Payment Settings', href: '/admin/payment-settings', icon: CreditCard },
    { name: 'Shipping Settings', href: '/admin/shipping', icon: Truck },
    { name: 'Security', href: '/admin/security', icon: Settings }
  ];

  return (
    <div className="flex flex-col h-screen text-slate-900 bg-slate-50 font-sans">
      {/* Top Navbar */}
      <nav className="h-16 bg-white border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between shrink-0 sticky top-0 z-50">
        <div className="flex items-center gap-4 sm:gap-8">
          <button 
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <span className="font-bold text-lg sm:text-xl tracking-tight text-slate-900">SWIFTSTORE PRO</span>
          <div className="hidden md:flex gap-6 text-sm font-medium text-slate-500">
            <span className="text-slate-900 border-b-2 border-slate-900 h-16 flex items-center">Admin Panel</span>
            <Link to="/" className="h-16 flex items-center hover:text-slate-800 transition-colors">Shop Storefront</Link>
          </div>
        </div>
        <div className="flex items-center gap-4 relative group">
          <button className="flex items-center gap-2 hover:bg-slate-50 p-1.5 rounded-xl transition-colors">
            <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-900 font-bold text-xs">
              {currentUser?.displayName?.charAt(0).toUpperCase() || 'AD'}
            </div>
            <span className="text-sm font-semibold hidden sm:inline-block">{currentUser?.displayName || 'Admin User'}</span>
          </button>
          
          <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <div className="p-3 border-b border-slate-100">
              <p className="text-sm font-bold text-slate-900">{currentUser?.displayName || 'Owner'}</p>
              <p className="text-xs text-slate-500 truncate">{currentUser?.email}</p>
            </div>
            <div className="p-2">
              <Link to="/admin/settings" className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">Profile Settings</Link>
              <Link to="/admin/security" className="block px-3 py-2 text-sm text-slate-600 hover:bg-slate-50 rounded-lg">Change Password</Link>
            </div>
            <div className="p-2 border-t border-slate-100">
              <button 
                onClick={handleLogout} 
                className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Mobile Sidebar Overlay */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside className={cn(
          "fixed md:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 flex-col py-4 gap-1 shrink-0 overflow-y-auto transform transition-transform duration-300 ease-in-out h-[calc(100vh-64px)] md:h-auto",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          "md:flex"
        )}>
          <div className="px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">Main Menu</div>
          <div className="px-3 flex flex-col gap-1">
            {navigation.map((item) => {
              if (item.subItems) {
                return (
                  <div key={item.name} className="flex flex-col gap-1">
                    <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium text-slate-800">
                      <item.icon className="w-4 h-4 shrink-0 text-slate-400" />
                      {item.name}
                    </div>
                    <div className="flex flex-col gap-1 pl-6">
                      {item.subItems.map(subItem => {
                        const isActive = location.pathname === subItem.href;
                        return (
                          <Link
                            key={subItem.name}
                            to={subItem.href}
                            onClick={() => setIsSidebarOpen(false)}
                            className={cn(
                              isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50',
                              'flex items-center gap-3 px-3 py-2 rounded-lg font-medium transition-colors text-sm'
                            )}
                          >
                            {isActive && <div className="w-1.5 h-1.5 bg-slate-900 rounded-full shrink-0"></div>}
                            {subItem.name}
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                );
              }
              const isActive = location.pathname === item.href || (location.pathname.startsWith(item.href) && item.href !== '/admin');
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={cn(
                    isActive ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50',
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-colors'
                  )}
                >
                  {isActive ? (
                    <div className="w-2 h-2 bg-slate-900 rounded-full shrink-0"></div>
                  ) : (
                    <item.icon className="w-4 h-4 shrink-0 text-slate-400" />
                  )}
                  {item.name}
                </Link>
              )
            })}
          </div>

          <div className="mt-6 px-6 py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">System</div>
          <div className="px-3">
            <Link to="/" className="flex items-center gap-3 px-3 py-2.5 text-slate-600 hover:bg-slate-50 rounded-lg font-medium transition-colors">
              <LogOut className="w-4 h-4 shrink-0 text-slate-400" />
              Back to Store
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 flex gap-6 p-4 sm:p-6 bg-slate-50 overflow-auto w-full">
          <div className="flex-1 w-full max-w-7xl mx-auto flex flex-col gap-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};
