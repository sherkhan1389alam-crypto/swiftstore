import fs from 'fs';
import bcrypt from 'bcryptjs';
import path from 'path';

let content = fs.readFileSync('server.ts', 'utf8');

const importsToAdd = `import bcrypt from 'bcryptjs';\nimport fsSync from 'fs';\n`;
if (!content.includes('import bcrypt')) {
  content = content.replace("import express from 'express';", importsToAdd + "import express from 'express';");
}

const authLogic = `
  const AUTH_FILE = path.join(process.cwd(), '.owner_auth.json');
  const DEFAULT_PASS = 'K7@vP2#x';
  
  // Initialize auth file with bcrypt hash if it doesn't exist
  if (!fsSync.existsSync(AUTH_FILE)) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(DEFAULT_PASS, salt);
    fsSync.writeFileSync(AUTH_FILE, JSON.stringify({ passwordHash: hash }));
  }

  app.post('/api/admin/verify-password', (req, res) => {
    try {
      const { password } = req.body;
      if (!fsSync.existsSync(AUTH_FILE)) {
        return res.status(500).json({ error: 'Auth system not initialized' });
      }
      const data = JSON.parse(fsSync.readFileSync(AUTH_FILE, 'utf8'));
      const isValid = bcrypt.compareSync(password, data.passwordHash);
      
      if (isValid) {
        res.json({ success: true });
      } else {
        res.status(401).json({ error: 'Incorrect password. Access denied.' });
      }
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post('/api/admin/change-password', (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword || newPassword.length < 8) {
        return res.status(400).json({ error: 'Invalid password provided.' });
      }
      
      const data = JSON.parse(fsSync.readFileSync(AUTH_FILE, 'utf8'));
      const isValid = bcrypt.compareSync(currentPassword, data.passwordHash);
      
      if (!isValid) {
        return res.status(401).json({ error: 'Incorrect current password.' });
      }
      
      const salt = bcrypt.genSaltSync(10);
      const newHash = bcrypt.hashSync(newPassword, salt);
      fsSync.writeFileSync(AUTH_FILE, JSON.stringify({ passwordHash: newHash }));
      
      res.json({ success: true });
    } catch (e) {
      console.error(e);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
`;

content = content.replace(/app\.post\('\/api\/admin\/verify-password'[\s\S]*?\}\);/, authLogic);

fs.writeFileSync('server.ts', content);
console.log("Updated server.ts");
