import re

with open('src/pages/admin/AdminLogin.tsx', 'r') as f:
    content = f.read()

# We need to rewrite AdminLogin to match the requested design

new_content = """import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LogIn, Lock, Eye, EyeOff } from 'lucide-react';
import { useSettings } from '../../lib/settingsContext';

export default function AdminLogin() {
  const { loginWithEmail, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { settings } = useSettings();

  useEffect(() => {
    if (currentUser && isAdmin) {
      navigate('/admin');
    }
  }, [currentUser, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Under the hood, we use the owner email mapped to Firebase Auth
      await loginWithEmail('sherkhan1389alam@gmail.com', password);
    } catch (err: any) {
      setError('Incorrect password. Access denied.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-8 bg-slate-900">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 p-8 sm:p-10">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-widest mb-2">SwiftStore Pro</h1>
          <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-6">Owner Panel</p>
          
          <div className="mx-auto w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 shadow-inner border border-slate-200">
            <Lock className="h-7 w-7 text-slate-700" />
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-2">🔐 Owner Authentication</h2>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl mb-6 text-sm font-bold flex items-center gap-2">
            <span className="text-lg">❌</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Password</label>
            <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-4 pr-12 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-medium text-lg tracking-widest"
                  placeholder="Enter Password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white font-bold py-4 px-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 uppercase tracking-wider shadow-lg shadow-slate-900/20"
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn className="w-5 h-5" />
                LOGIN
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
"""

with open('src/pages/admin/AdminLogin.tsx', 'w') as f:
    f.write(new_content)
