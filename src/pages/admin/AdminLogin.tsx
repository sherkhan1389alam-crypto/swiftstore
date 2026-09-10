import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function AdminLogin() {
  const { loginWithEmail, currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  useEffect(() => {
    if (currentUser && isAdmin && sessionStorage.getItem('owner_auth') === 'true' && !success) {
      navigate('/admin');
    }
  }, [currentUser, isAdmin, navigate, success]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (lockoutTime && Date.now() < lockoutTime) {
      interval = setInterval(() => {
        if (Date.now() >= lockoutTime) {
          setLockoutTime(null);
          setFailedAttempts(0);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [lockoutTime]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (lockoutTime && Date.now() < lockoutTime) { 
       setError('Too many failed attempts. Please try again later.');
       return;
    }
    
    setError('');
    setLoading(true);
    
    try {
      const res = await fetch('/api/admin/verify-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      
      if (!res.ok) {
        throw new Error('invalid-password');
      }
      
      try {
        await loginWithEmail('sherkhan1389alam@gmail.com', password);
      } catch (err: any) {
        console.warn('Firebase login warning:', err);
      }

      sessionStorage.setItem('owner_auth', 'true');
      setSuccess(true);
      setTimeout(() => {
        navigate('/admin');
      }, 1000);
    } catch (err: any) {
      setPassword('');
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      if (newAttempts >= 5) {
        setLockoutTime(Date.now() + 60000); // 1 minute lockout
        setError('Too many failed attempts. Please try again later.');
      } else {
        setError('Access denied. Please enter the correct owner password.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-900">
      <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden relative">
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <div className="text-5xl mb-4">🔐</div>
            <h1 className="text-2xl font-black text-slate-900 mb-2 tracking-tight">Owner Panel</h1>
            <p className="text-slate-500 font-medium">Enter your owner password to continue</p>
          </div>
          
          {success ? (
            <div className="bg-emerald-50 border border-emerald-100 text-emerald-700 p-6 rounded-2xl mb-6 text-center animate-pulse">
              <div className="text-2xl mb-2">✓</div>
              <div className="font-bold text-lg">Access Granted</div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-bold flex flex-col items-center justify-center gap-1 text-center">
                  <span className="text-lg">❌ Incorrect password</span>
                  <span className="font-medium">{error}</span>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-4 pr-12 py-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all font-medium text-lg tracking-widest"
                    placeholder="••••••••"
                    required
                    disabled={loading || (lockoutTime !== null)}
                    autoComplete="current-password"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPassword(!showPassword)} 
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <div className="space-y-3 pt-2">
                <button
                  type="submit"
                  disabled={loading || (lockoutTime !== null)}
                  className="w-full bg-slate-900 text-white font-bold py-4 px-4 rounded-xl hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-slate-900/20"
                >
                  {loading ? 'Verifying...' : 'Unlock Owner Panel'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full bg-white text-slate-600 border border-slate-200 font-bold py-4 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
