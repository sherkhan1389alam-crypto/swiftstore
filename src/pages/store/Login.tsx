import { useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useSettings } from '../../lib/settingsContext';

export default function Login() {
  const { loginWithGoogle, currentUser } = useAuth();
  const navigate = useNavigate();
  const { settings } = useSettings();

  useEffect(() => {
    if (currentUser) {
      navigate('/account/profile');
    }
  }, [currentUser, navigate]);

  if (currentUser) {
    return null;
  }

  const handleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate('/account/profile');
    } catch (error) {
      console.error('Failed to log in', error);
    }
  };

  return (
    <div className="min-h-[calc(100vh-16rem)] flex items-center justify-center p-8 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        
        {settings?.logoUrl ? (
          <img src={settings.logoUrl} alt={settings.storeName || 'Store Logo'} className="mx-auto h-16 object-contain mb-6" />
        ) : (
          <div className="mx-auto w-12 h-12 bg-[#0b382d] rounded-full flex items-center justify-center mb-6 text-white font-bold text-2xl">
            {(settings?.storeName || 'S').charAt(0)}
          </div>
        )}
  
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Welcome to {settings?.storeName || 'SwiftStore'}</h2>
        <p className="text-slate-500 mb-8">Sign in to your account to continue shopping</p>
        
        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center space-x-3 bg-white border border-slate-300 text-slate-700 font-medium py-3 px-4 rounded-2xl hover:bg-slate-50 transition-colors"
        >
          <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="w-5 h-5" />
          <span>Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
