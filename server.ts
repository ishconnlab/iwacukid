import 'dotenv/config';
import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './server/api.js';
import { connectMongo } from './server/mongo.js';
import { db } from './server/db.js';

// `import.meta.url` is only available under ESM (tsx / vite dev). The
// esbuild CJS bundle gets an empty `import.meta`, so fall back to the
// current working directory (scripts always run from the project root).
const SRC_DIR =
  typeof import.meta !== 'undefined' && import.meta.url
    ? path.dirname(fileURLToPath(import.meta.url))
    : process.cwd();

async function startServer() {
  const app = express();
  const port = Number(process.env.PORT) || 8080;

  // Connect to MongoDB Atlas before serving any requests
  const mongoUri = process.env.MONGODB_URI;
  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set in .env');
  }
  await connectMongo(mongoUri);
  await db.seedDatabaseIfEmpty();
  console.log('✅ MongoDB connected');

  // Household/pending-order lifecycle: expire abandoned orders shortly after boot
  // and on a rolling cadence so capacity is never silently locked.
  try {
    const expired = await db.expireStalePendingOrders();
    if (expired > 0) console.log(`♻️ Expired ${expired} stale pending order(s)`);
  } catch (err) {
    console.error('Failed to run pending-order expiry at boot:', err);
  }
  const orderExpiryTimer = setInterval(async () => {
    try {
      await db.expireStalePendingOrders();
    } catch (err) {
      console.error('Failed to run pending-order expiry:', err);
    }
  }, 10 * 60 * 1000);
  orderExpiryTimer.unref();

  // JSON Body Parser with security limits
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS: allow the frontend (Render/Vercel deployment or local dev) to call the API
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization, x-ticket-code, x-verification-key, x-language'
    );
    res.setHeader('Access-Control-Max-Age', '86400');
    res.setHeader('Vary', 'Origin');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Request logging
  app.use((req, _res, next) => {
    if (!req.path.startsWith('/@') && !req.path.includes('.vite')) {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
  });

  // Mount API Router
  app.use('/api', apiRouter);

  // Health check endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'IWACU Kids Platform',
      location: 'Nyakaliro, Rwanda',
      time: new Date().toISOString(),
    });
  });

  const isProduction = process.env.NODE_ENV === 'production';

  if (!isProduction) {
    // Development mode: Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {},
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built static assets from dist
    const distPath = path.resolve(SRC_DIR, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(port, '0.0.0.0', () => {
    console.log(`Server running on port ${port}`);
  });
}

startServer().catch((err) => {
  console.error('Fatal server startup failure:', err);
  process.exit(1);
});
