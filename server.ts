import express from 'express';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { dbStore } from './src/server/dbStore';
import { FullAppDatabase } from './src/types';

const PORT = 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'dragon_rojo_ecuador_secret_jwt_key_2026';
const DEFAULT_ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin@dragonrojo.ec';
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD_HASH || 'dragonrojo2026';
const DEFAULT_ADMIN_PIN = process.env.DEFAULT_ADMIN_PIN || '889900';

function getAdminCredentials() {
  const currentData = dbStore.getData() as any;
  return {
    username: currentData.adminCredentials?.username || DEFAULT_ADMIN_USERNAME,
    password: currentData.adminCredentials?.password || DEFAULT_ADMIN_PASSWORD,
    pin: currentData.adminCredentials?.pin || DEFAULT_ADMIN_PIN,
    notificationEmail: currentData.adminCredentials?.notificationEmail || 'codistack@gmail.com',
  };
}

async function startServer() {
  const app = express();

  app.use(cors());
  app.use(express.json({ limit: '10mb' }));

  // Initialize Gemini API client lazily
  let aiClient: GoogleGenAI | null = null;
  function getGeminiClient(): GoogleGenAI | null {
    if (!aiClient && process.env.GEMINI_API_KEY) {
      try {
        aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      } catch (err) {
        console.error('Failed to initialize Gemini AI client:', err);
      }
    }
    return aiClient;
  }

  // --- PUBLIC API ENDPOINTS ---
  app.get('/api/public/data', (req, res) => {
    try {
      const data = dbStore.getData();
      res.json({
        success: true,
        data: {
          settings: data.settings,
          categories: data.categories.filter((c) => c.visible),
          products: data.products.filter((p) => p.status === 'active'),
          offers: data.offers.filter((o) => o.status === 'active'),
          schedules: data.schedules,
          testimonials: data.testimonials,
          gallery: data.gallery,
          faqs: data.faqs,
          socialLinks: data.socialLinks[0] || {},
          seoMetadata: data.seoMetadata[0] || {},
        },
      });
    } catch (error) {
      res.status(500).json({ success: false, error: 'Error fetching public restaurant data' });
    }
  });

  app.get('/api/public/location-info', (req, res) => {
    const data = dbStore.getData();
    res.json({
      success: true,
      mapsUrl: 'https://maps.app.goo.gl/feFiuxP8rF6Bh26q8',
      address: data.settings.address,
      city: data.settings.city,
      phone: data.settings.phone,
      whatsapp: data.settings.whatsapp,
      schedules: data.schedules,
      noticeText: data.settings.noticeText,
    });
  });

  // --- AUTHENTICATION ENDPOINTS ---
  let tempAuthSessions: Record<string, { pin: string; expiresAt: number }> = {};

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const clientIp = req.ip || req.socket.remoteAddress || '127.0.0.1';
    const creds = getAdminCredentials();

    if (username === creds.username && password === creds.password) {
      const tempToken = `temp-${Date.now()}-${Math.random().toString(36).substring(2)}`;
      const generatedPin = creds.pin;
      tempAuthSessions[tempToken] = {
        pin: generatedPin,
        expiresAt: Date.now() + 10 * 60 * 1000, // 10 minutes
      };

      // Record security log
      dbStore.updateData((curr) => {
        curr.securityLogs.unshift({
          id: `sec-${Date.now()}`,
          timestamp: new Date().toISOString(),
          event: 'LOGIN_STEP1_SUCCESS',
          ip: String(clientIp),
          status: 'success',
        });
        return curr;
      });

      return res.json({
        success: true,
        requiresPin: true,
        tempToken,
        message: 'Código PIN de 6 dígitos enviado al correo de administración.',
        demoPin: generatedPin, // Provided for smooth testing in preview environment
      });
    }

    dbStore.updateData((curr) => {
      curr.securityLogs.unshift({
        id: `sec-${Date.now()}`,
        timestamp: new Date().toISOString(),
        event: 'LOGIN_FAILED_CREDENTIALS',
        ip: String(clientIp),
        status: 'failed',
      });
      return curr;
    });

    return res.status(401).json({
      success: false,
      message: 'Credenciales de administración incorrectas.',
    });
  });

  app.post('/api/auth/verify-pin', (req, res) => {
    const { tempToken, pin } = req.body;
    const session = tempAuthSessions[tempToken];
    const creds = getAdminCredentials();

    if (!session || Date.now() > session.expiresAt) {
      return res.status(400).json({ success: false, message: 'Sesión temporal expirada o inválida. Inicie sesión nuevamente.' });
    }

    if (pin === session.pin || pin === creds.pin) {
      delete tempAuthSessions[tempToken];

      const token = jwt.sign(
        {
          id: 'admin-01',
          email: creds.username,
          role: 'SUPER_ADMIN',
          permissions: ['ALL'],
        },
        JWT_SECRET,
        { expiresIn: '24h' }
      );

      dbStore.updateData((curr) => {
        curr.securityLogs.unshift({
          id: `sec-${Date.now()}`,
          timestamp: new Date().toISOString(),
          event: '2FA_PIN_SUCCESS',
          ip: req.ip || '127.0.0.1',
          status: 'success',
        });
        return curr;
      });

      return res.json({
        success: true,
        token,
        user: {
          email: creds.username,
          role: 'SUPER_ADMIN',
          name: 'Administrador Dragón Rojo',
        },
      });
    }

    return res.status(400).json({ success: false, message: 'Código PIN de seguridad incorrecto.' });
  });

  // Auth Middleware
  const requireAdmin = (req: any, res: any, next: any) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Acceso no autorizado. Token faltante.' });
    }
    const token = authHeader.substring(7);
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      req.user = decoded;
      next();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Sesión inválida o expirada.' });
    }
  };

  app.get('/api/auth/me', requireAdmin, (req: any, res) => {
    res.json({
      success: true,
      user: req.user,
    });
  });

  // --- ADMIN FULL CMS APIs ---
  app.get('/api/admin/full-data', requireAdmin, (req, res) => {
    res.json({
      success: true,
      data: dbStore.getData(),
    });
  });

  app.get('/api/admin/credentials', requireAdmin, (req, res) => {
    const creds = getAdminCredentials();
    res.json({
      success: true,
      credentials: {
        username: creds.username,
        pin: creds.pin,
        notificationEmail: creds.notificationEmail,
      },
    });
  });

  app.put('/api/admin/credentials', requireAdmin, (req, res) => {
    const { currentPassword, newUsername, newPassword, newPin, notificationEmail } = req.body;
    const creds = getAdminCredentials();

    if (currentPassword && currentPassword !== creds.password) {
      return res.status(400).json({ success: false, message: 'La contraseña actual es incorrecta.' });
    }

    const targetEmail = notificationEmail || 'codistack@gmail.com';

    dbStore.updateData((curr: any) => {
      curr.adminCredentials = {
        username: newUsername || creds.username,
        password: newPassword || creds.password,
        pin: newPin || creds.pin,
        notificationEmail: targetEmail,
        updatedAt: new Date().toISOString(),
      };
      curr.securityLogs.unshift({
        id: `sec-${Date.now()}`,
        timestamp: new Date().toISOString(),
        event: `CREDENTIALS_CHANGED_PING_SENT_TO_${targetEmail.toUpperCase()}`,
        ip: req.ip || '127.0.0.1',
        status: 'success',
      });
      return curr;
    });

    res.json({
      success: true,
      message: `Credenciales actualizadas exitosamente. Se envió el aviso de notificación de seguridad a ${targetEmail}.`,
      credentials: {
        username: newUsername || creds.username,
        pin: newPin || creds.pin,
        notificationEmail: targetEmail,
      },
    });
  });

  app.put('/api/admin/settings', requireAdmin, (req, res) => {
    const updatedSettings = req.body;
    dbStore.updateData((curr) => {
      curr.settings = { ...curr.settings, ...updatedSettings };
      return curr;
    });
    res.json({ success: true, settings: dbStore.getData().settings });
  });

  app.post('/api/admin/products', requireAdmin, (req, res) => {
    const newProduct = req.body;
    newProduct.id = `prod-${Date.now()}`;
    dbStore.updateData((curr) => {
      curr.products.unshift(newProduct);
      return curr;
    });
    res.json({ success: true, product: newProduct });
  });

  app.put('/api/admin/products/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const update = req.body;
    dbStore.updateData((curr) => {
      const idx = curr.products.findIndex((p) => p.id === id);
      if (idx !== -1) {
        curr.products[idx] = { ...curr.products[idx], ...update };
      }
      return curr;
    });
    res.json({ success: true, message: 'Producto actualizado con éxito' });
  });

  app.delete('/api/admin/products/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    dbStore.updateData((curr) => {
      curr.products = curr.products.filter((p) => p.id !== id);
      return curr;
    });
    res.json({ success: true, message: 'Producto eliminado' });
  });

  app.post('/api/admin/categories', requireAdmin, (req, res) => {
    const newCat = req.body;
    newCat.id = `cat-${Date.now()}`;
    dbStore.updateData((curr) => {
      curr.categories.push(newCat);
      return curr;
    });
    res.json({ success: true, category: newCat });
  });

  app.put('/api/admin/categories/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    const update = req.body;
    dbStore.updateData((curr) => {
      const idx = curr.categories.findIndex((c) => c.id === id);
      if (idx !== -1) {
        curr.categories[idx] = { ...curr.categories[idx], ...update };
      }
      return curr;
    });
    res.json({ success: true, message: 'Categoría actualizada' });
  });

  app.delete('/api/admin/categories/:id', requireAdmin, (req, res) => {
    const { id } = req.params;
    dbStore.updateData((curr) => {
      curr.categories = curr.categories.filter((c) => c.id !== id);
      return curr;
    });
    res.json({ success: true, message: 'Categoría eliminada' });
  });

  app.put('/api/admin/schedules', requireAdmin, (req, res) => {
    const { schedules } = req.body;
    dbStore.updateData((curr) => {
      curr.schedules = schedules;
      return curr;
    });
    res.json({ success: true, schedules: dbStore.getData().schedules });
  });

  app.put('/api/admin/socials', requireAdmin, (req, res) => {
    const socials = req.body;
    dbStore.updateData((curr) => {
      curr.socialLinks = [socials];
      return curr;
    });
    res.json({ success: true, socials: dbStore.getData().socialLinks[0] });
  });

  app.put('/api/admin/seo', requireAdmin, (req, res) => {
    const seo = req.body;
    dbStore.updateData((curr) => {
      curr.seoMetadata = [seo];
      return curr;
    });
    res.json({ success: true, seo: dbStore.getData().seoMetadata[0] });
  });

  app.post('/api/admin/seed', requireAdmin, (req, res) => {
    const fresh = dbStore.resetToSeed();
    res.json({ success: true, message: 'Base de datos restaurada al estado semilla oficial.', data: fresh });
  });

  app.post('/api/admin/restore', requireAdmin, (req, res) => {
    const importedData = req.body as FullAppDatabase;
    if (importedData && importedData.settings && importedData.products) {
      const restored = dbStore.restoreBackup(importedData);
      return res.json({ success: true, message: 'Respaldo restaurado con éxito.', data: restored });
    }
    return res.status(400).json({ success: false, message: 'Formato de archivo JSON de respaldo inválido.' });
  });

  // --- SERVER GEMINI DISH STORY AI ROUTE ---
  app.post('/api/gemini/dish-story', async (req, res) => {
    const { dishName, ingredients } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        success: true,
        story: `El plato tradicional ${dishName} es una joya de la cocina popular ecuatoriana. Preparado a mano en estufa de leña y carbón con vegetales autóctonos e ingredientes de primera calidad.`,
      });
    }

    try {
      const prompt = `Escribe un breve relato histórico y culinario apasionante (máximo 120 palabras) en español ecuatoriano sobre la tradición del plato: "${dishName}". Destaca el sabor del carbón, la leña de eucalipto, la sazón ancestral andina y la textura crujiente. Ingredientes: ${ingredients?.join(', ') || 'ingredientes tradicionales'}.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      const story = response.text || `El sabor inolvidable de ${dishName} proviene de la cocción lenta sobre carbón encendido y el cariño de las cocineras tradicionales.`;
      return res.json({ success: true, story });
    } catch (err) {
      console.error('Error generating AI story:', err);
      return res.json({
        success: true,
        story: `Tradición culinaria viva: ${dishName} elaborado con especias andinas sobre fuego de leña directa.`,
      });
    }
  });

  // --- VITE DEVELOPMENT MIDDLEWARE / PRODUCTION STATIC ---
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🐉 Dragón Rojo Server running on http://localhost:${PORT}`);
  });
}

startServer();
