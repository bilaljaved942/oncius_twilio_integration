import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync, spawn } from 'child_process';
import http from 'http';

import authRoutes from './routes/auth.js';
import twilioRoutes from './routes/twilio.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5050;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/twilio', twilioRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    baseUrl: process.env.BASE_URL || `http://localhost:${PORT}`
  });
});

// Serve frontend build
const clientDistPath = path.join(__dirname, 'client', 'dist');
app.use(express.static(clientDistPath));

app.get('{*path}', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'), (err) => {
    if (err) {
      res.send(`<!DOCTYPE html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <title>Twilio Monochrome Web Calling</title>
            <style>
              body { background: #000; color: #fff; font-family: sans-serif; display: grid; place-items: center; min-height: 100vh; margin: 0; text-align: center; }
              h1 { font-size: 2rem; letter-spacing: 2px; }
              p { color: #888; }
            </style>
          </head>
          <body>
            <div>
              <h1>TWILIO DIRECT DIALER</h1>
              <p>Backend Server is running on port ${PORT}. Run <code>npm run client:dev</code> or <code>npm run client:build</code> to view the full frontend.</p>
            </div>
          </body>
        </html>`);
    }
  });
});

// ── Auto-launch ngrok tunnel (Local development only) ──────────────────────
function startNgrok() {
  return new Promise((resolve) => {
    // Skip if running in cloud or production
    if (process.env.VERCEL || process.env.NODE_ENV === 'production' || process.env.BASE_URL) {
      if (process.env.BASE_URL) {
        console.log(`🌐 Using BASE_URL from env: ${process.env.BASE_URL}`);
      }
      return resolve(process.env.BASE_URL || null);
    }

    // Check if ngrok is installed
    try {
      execSync('which ngrok', { stdio: 'ignore' });
    } catch {
      return resolve(null);
    }

    console.log('🚇 Starting ngrok tunnel on port', PORT, '...');

    // Kill any existing ngrok processes
    try { execSync('pkill -f ngrok', { stdio: 'ignore' }); } catch {}

    const ngrokProcess = spawn('ngrok', ['http', PORT.toString()], {
      detached: true,
      stdio: 'ignore'
    });
    ngrokProcess.unref();

    // Poll ngrok's local API for the public URL
    let attempts = 0;
    const pollInterval = setInterval(() => {
      attempts++;
      try {
        const req = http.get('http://127.0.0.1:4040/api/tunnels', (ngrokRes) => {
          let body = '';
          ngrokRes.on('data', (chunk) => { body += chunk; });
          ngrokRes.on('end', () => {
            try {
              const json = JSON.parse(body);
              const tunnel = json.tunnels?.find(t => t.proto === 'https');
              if (tunnel) {
                clearInterval(pollInterval);
                process.env.BASE_URL = tunnel.public_url;
                resolve(tunnel.public_url);
              }
            } catch {}
          });
        });
        req.on('error', () => {});
      } catch {}

      if (attempts >= 20) {
        clearInterval(pollInterval);
        resolve(null);
      }
    }, 500);
  });
}

// ── Start Server ───────────────────────────────────────────────────────────
if (!process.env.VERCEL) {
  app.listen(PORT, async () => {
    console.log(`=================================================`);
    console.log(` MONOCHROME TWILIO CALLING SERVER RUNNING`);
    console.log(` Local URL: http://localhost:${PORT}`);
    console.log(`=================================================`);

    const publicUrl = await startNgrok();

    if (publicUrl) {
      console.log(`\n✅ ngrok tunnel active!`);
      console.log(`🌐 Public URL: ${publicUrl}`);
      console.log(`📞 TwiML webhook: ${publicUrl}/api/twilio/voice`);
      console.log(`=================================================\n`);
    }
  });
}

export default app;
