const fs = require('fs');

// 1. Patch AdminRoute.tsx
let adminRoute = fs.readFileSync('src/components/AdminRoute.tsx', 'utf8');

adminRoute = adminRoute.replace(
  "// If not logged in, redirect to login page",
  `const isOwnerSessionVerified = sessionStorage.getItem('owner_auth') === 'true';

  if (!isOwnerSessionVerified) {
    return <Navigate to="/admin/login" replace />;
  }

  // If not logged in, redirect to login page`
);
fs.writeFileSync('src/components/AdminRoute.tsx', adminRoute);


// 2. Patch AdminLogin.tsx
let adminLogin = fs.readFileSync('src/pages/admin/AdminLogin.tsx', 'utf8');

adminLogin = adminLogin.replace(
  "if (currentUser && isAdmin && !success) {",
  "if (currentUser && isAdmin && sessionStorage.getItem('owner_auth') === 'true' && !success) {"
);

const newHandleSubmit = `
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
`;

// Replace the old handleSubmit
adminLogin = adminLogin.replace(
  /const handleSubmit = async \(e: React\.FormEvent\) => \{[\s\S]*?\}\s*;\s*return \(/,
  newHandleSubmit.trim() + '\n\n  return ('
);

fs.writeFileSync('src/pages/admin/AdminLogin.tsx', adminLogin);

// 3. Patch AdminLayout.tsx
let adminLayout = fs.readFileSync('src/layouts/AdminLayout.tsx', 'utf8');

// We need to add handleLogout inside the component
adminLayout = adminLayout.replace(
  "const { currentUser, logout } = useAuth();",
  `const { currentUser, logout } = useAuth();
  
  const handleLogout = async () => {
    sessionStorage.removeItem('owner_auth');
    await logout();
  };`
);

adminLayout = adminLayout.replace(
  /onClick=\{\(\) => logout\(\)\}/g,
  "onClick={handleLogout}"
);

fs.writeFileSync('src/layouts/AdminLayout.tsx', adminLayout);

// 4. Patch AuthContext.tsx so it clears owner_auth on its generic logout just in case
let authContext = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');
authContext = authContext.replace(
  "const logout = async () => {",
  "const logout = async () => {\n    sessionStorage.removeItem('owner_auth');"
);
fs.writeFileSync('src/contexts/AuthContext.tsx', authContext);
