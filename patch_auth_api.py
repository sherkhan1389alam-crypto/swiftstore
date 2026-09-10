import re

with open('src/contexts/AuthContext.tsx', 'r') as f:
    content = f.read()

pattern = r"""const loginWithEmail = async \(email: string, pass: string\) => \{[\s\S]*?try \{[\s\S]*?await signInWithEmailAndPassword\(auth, email, pass\);[\s\S]*?\} catch \(error: any\) \{[\s\S]*?throw error;[\s\S]*?\}[\s\S]*?\};"""

new_func = """const loginWithEmail = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
    } catch (error: any) {
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        if (email === 'sherkhan1389alam@gmail.com') {
          try {
            const res = await fetch('/api/admin/verify-password', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ password: pass })
            });
            if (res.ok) {
              await createUserWithEmailAndPassword(auth, email, pass);
              return;
            }
          } catch (e) {
            console.error(e);
          }
        }
      }
      throw error;
    }
  };"""

content = re.sub(pattern, new_func, content)

with open('src/contexts/AuthContext.tsx', 'w') as f:
    f.write(content)
