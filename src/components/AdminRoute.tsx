import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AdminRoute() {
  const { currentUser, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-900">
        <Loader2 className="h-12 w-12 animate-spin text-white" />
      </div>
    );
  }

  // If not logged in, redirect to login page
  if (!currentUser) {
    return <Navigate to="/admin/login" replace />;
  }

  // If logged in but not admin, show 403 Forbidden
  if (currentUser && !isAdmin) {
    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900 p-8 text-center">
            <div className="bg-white p-8 rounded-3xl shadow-xl max-w-sm w-full">
                <ShieldAlert className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h1 className="text-2xl font-black text-slate-900 mb-2">403 Forbidden</h1>
                <p className="text-slate-600 font-medium mb-6">Access denied. This account is not authorized for the Owner Panel.</p>
                <div className="space-y-3">
                  <a href="/" className="block w-full bg-indigo-600 text-white font-bold py-3 px-6 rounded-xl hover:bg-indigo-700 transition-colors">
                      Return to Store
                  </a>
                </div>
            </div>
        </div>
    );
  }

  // If they are the admin but missing the password provider, send them to login to authenticate with password
  const hasPasswordProvider = currentUser.providerData.some(p => p.providerId === 'password');
  if (isAdmin && !hasPasswordProvider) {
    return <Navigate to="/admin/login" replace />;
  }

  // If admin, render the children (Outlet)
  return <Outlet />;
}
