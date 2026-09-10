import re

with open('src/contexts/AuthContext.tsx', 'r') as f:
    content = f.read()

pattern = r"""if \(error\.code === 'auth/user-not-found' \|\| error\.code === 'auth/invalid-credential'\) \{[\s\S]*?if \(email === 'sherkhan1389alam@gmail.com'\) \{[\s\S]*?// Auto-register owner for ease of testing[\s\S]*?await createUserWithEmailAndPassword\(auth, email, pass\);[\s\S]*?return;[\s\S]*?\}[\s\S]*?\}"""

# Replace with nothing
content = re.sub(pattern, "", content)

with open('src/contexts/AuthContext.tsx', 'w') as f:
    f.write(content)

