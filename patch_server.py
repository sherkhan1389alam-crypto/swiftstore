import re

with open('server.ts', 'r') as f:
    content = f.read()

api_route = """  app.post('/api/admin/verify-password', (req, res) => {
    const { password } = req.body;
    if (password === 'K7@vP2#x') {
      res.json({ success: true });
    } else {
      res.status(401).json({ error: 'Incorrect password. Access denied.' });
    }
  });

  // Vite middleware for development"""

content = content.replace("// Vite middleware for development", api_route)

with open('server.ts', 'w') as f:
    f.write(content)
