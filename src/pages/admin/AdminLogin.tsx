import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Eye, EyeOff, ShieldCheck } from 'lucide-react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updatePassword, reauthenticateWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function AdminLogin() {
  const { currentUser, isAdmin } = useAuth();
  const navigate = useNavigate();
  
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);
  
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutTime, setLockoutTime] = useState<number | null>(null);

  useEffect(() => {
    if (currentUser && !isAdmin) {
      // Not an admin, we handle this via redirect or let the form show an error?
      // Actually AdminRoute redirects to login, so we are here.
      // But AdminRoute doesn't redirect them if they are authenticated but not admin.
      // Wait, AdminRoute shows 403 now! So they won't even be here.
    }
  }, [currentUser, isAdmin]);

  useEffect(() => {
    const hasPasswordProvider = currentUser?.providerData?.some(p => p.providerId === 'password');
    if (currentUser && isAdmin) {
      if (hasPasswordProvider && !success) {
        navigate('/admin');
      } else if (!hasPasswordProvider) {
        setIsSetupMode(true);
      }
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
      const rawOwnerEmail = import.meta.env.VITE_OWNER_EMAIL || 'sherkhan1389alam@gmail.com';
      const VITE_OWNER_EMAIL = rawOwnerEmail.trim().toLowerCase();
      
      if (isSetupMode) {
        if (currentUser && isAdmin) {
            // Already logged in via Google, but setting password for the first time
            try {
                await updatePassword(auth.currentUser!, password);
            } catch (innerErr: any) {
                if (innerErr.code === 'auth/requires-recent-login') {
                    // Try to re-authenticate with Google silently/popup
                    const provider = new GoogleAuthProvider();
                    await reauthenticateWithPopup(auth.currentUser!, provider);
                    await updatePassword(auth.currentUser!, password);
                } else {
                    throw innerErr;
                }
            }
        } else {
            // Creating account completely from scratch
            await createUserWithEmailAndPassword(auth, VITE_OWNER_EMAIL, password);
        }
      } else {
        await signInWithEmailAndPassword(auth, VITE_OWNER_EMAIL, password);
      }
      
      // Successfully authenticated via Firebase
      setSuccess(true);
      // Short delay to allow AuthContext to update its isAdmin state and avoid redirect bounces
      setTimeout(() => navigate('/admin'), 1000);
    } catch (err: any) {
      setPassword('');
      const newAttempts = failedAttempts + 1;
      setFailedAttempts(newAttempts);
      
      console.error('Owner Login Authentication Failed. Code:', err.code);
      
      if (err.code === 'auth/too-many-requests' || newAttempts >= 5) {
        setLockoutTime(Date.now() + 60000); // 1 minute lockout
        setError('Too many failed attempts. Please try again later.');
      } else if (err.code === 'auth/operation-not-allowed') {
        setError('Email/Password authentication is disabled in Firebase. Enable Email/Password in Firebase Authentication → Sign-in providers.');
      } else if (err.code === 'auth/requires-recent-login') {
        setError('Security requirement: Session too old. Please return to the store, log out, log back in, and try again.');
      } else if (err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential') {
        setError('Incorrect owner password.');
      } else if (err.code === 'auth/email-already-in-use') {
        setError('Owner account already exists with a different sign-in method. Please contact support.');
      } else if (err.code === 'auth/user-not-found') {
        setIsSetupMode(true);
        setError('Owner account not initialized. Please type the desired owner password and click Initialize Owner Account to set it up.');
      } else if (err.code === 'auth/invalid-api-key') {
        setError('Owner authentication is not configured correctly. Check Firebase configuration.');
      } else if (err.code === 'auth/network-request-failed') {
        setError('Network error. Please check your connection and try again.');
      } else {
        setError(err.message || 'Authentication failed. Please try again.');
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
            <div className="flex justify-center mb-6">
              <div className="bg-indigo-600 p-4 rounded-2xl shadow-lg shadow-indigo-600/30">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
            </div>
            <h2 className="text-sm font-bold text-indigo-600 mb-1 tracking-widest uppercase">SwiftStore Pro</h2>
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Owner Panel Login</h1>
            <p className="text-slate-500 font-medium">{isSetupMode ? 'Set your owner password to secure the panel' : 'Enter your owner password to continue'}</p>
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
                  <span className="font-medium text-base">{error}</span>
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
                  className="w-full bg-indigo-600 text-white font-bold py-4 px-4 rounded-xl hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 shadow-lg shadow-indigo-600/20"
                >
                  {loading ? 'Verifying...' : isSetupMode ? 'Initialize Owner Account' : 'Unlock Owner Panel'}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="w-full bg-white text-slate-600 border border-slate-200 font-bold py-4 px-4 rounded-xl hover:bg-slate-50 transition-colors flex items-center justify-center gap-2"
                >
                  Return to Store
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
