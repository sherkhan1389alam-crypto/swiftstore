import fs from 'fs';

let content = fs.readFileSync('src/pages/admin/Security.tsx', 'utf8');

const newLogic = `
    if (!currentUser || !currentUser.email) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Update Backend Source of Truth First
      const res = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword })
      });
      
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to update password');
      }

      // 2. Try to update Firebase Auth if they have a password provider
      try {
        const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
        await reauthenticateWithCredential(currentUser, credential);
        await updatePassword(currentUser, newPassword);
      } catch (fbError) {
        // If Firebase Auth fails (e.g. they don't have a password provider), 
        // we already updated the main backend source of truth, so it's fine.
        console.warn("Firebase Auth update skipped/failed:", fbError);
      }

      setSuccess('Your Owner Panel password has been updated. Please log in again.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      
      // Force logout after 2 seconds so they can test the new password
      setTimeout(() => {
        const { getAuth, signOut } = require('firebase/auth');
        signOut(getAuth());
      }, 2000);

    } catch (err: any) {
      console.error('Password update failed:', err);
      setError(err.message || 'Failed to update password. Please check your current password.');
    } finally {
      setLoading(false);
    }
`;

content = content.replace(/    if \(\!currentUser \|\| \!currentUser\.email\) return;[\s\S]*?setLoading\(false\);\n    \}/, newLogic);

fs.writeFileSync('src/pages/admin/Security.tsx', content);
console.log("Updated Security.tsx");
