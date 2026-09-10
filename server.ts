import bcrypt from 'bcryptjs';
import fsSync from 'fs';
import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.post('/api/generate-image', async (req, res) => {
    try {
      const { prompt, aspectRatio } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateImages({
        model: 'gemini-3-pro-image-preview',
        prompt,
        config: {
          numberOfImages: 1,
          outputMimeType: 'image/jpeg',
          aspectRatio: aspectRatio || '1:1',
        },
      });

      const base64Image = response.generatedImages[0].image.imageBytes;
      res.json({ image: `data:image/jpeg;base64,${base64Image}` });
    } catch (error) {
      console.error('Image generation error:', error);
      res.status(500).json({ error: 'Failed to generate image' });
    }
  });

  app.post('/api/chat', async (req, res) => {
    try {
      const { prompt } = req.body;
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-pro-preview',
        contents: [{ role: 'user', parts: [{ text: prompt }] }]
      });

      res.json({ response: response.text });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ error: 'Failed to generate response' });
    }
  });

    
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



  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*all', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
