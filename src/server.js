import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import routes from './routes/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const CORS_ORIGIN = process.env.CORS_ORIGIN;

// Middlewares
// CORS: Configuração para Vercel e desenvolvimento local
app.use(cors({
  origin: function (origin, callback) {
    // Permite requisições sem origin (mobile apps, Postman, serverless functions do mesmo domínio)
    if (!origin) {
      console.log('[CORS] Requisição sem origin - permitindo');
      return callback(null, true);
    }
    
    console.log('[CORS] Origin recebida:', origin);
    
    // Se CORS_ORIGIN estiver definido, usa ele
    if (CORS_ORIGIN) {
      const allowedOrigins = CORS_ORIGIN.split(',').map(o => o.trim());
      console.log('[CORS] Origens permitidas configuradas:', allowedOrigins);
      if (allowedOrigins.includes(origin)) {
        console.log('[CORS] Origin permitida pela configuração');
        return callback(null, true);
      }
    }
    
    // Permite localhost em qualquer porta
    if (origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:')) {
      console.log('[CORS] Origin localhost - permitindo');
      return callback(null, true);
    }
    
    // Permite IPs da rede local
    const localNetworkPatterns = [
      /^http:\/\/192\.168\.\d+\.\d+:\d+$/,  // 192.168.x.x
      /^http:\/\/10\.\d+\.\d+\.\d+:\d+$/,    // 10.x.x.x
      /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\.\d+\.\d+:\d+$/, // 172.16-31.x.x
    ];
    
    if (localNetworkPatterns.some(pattern => pattern.test(origin))) {
      console.log('[CORS] Origin rede local - permitindo');
      return callback(null, true);
    }
    
    // No Vercel, permite requisições do mesmo domínio (vercel.app)
    if (origin.includes('vercel.app') || origin.includes('vercel.sh')) {
      console.log('[CORS] Origin Vercel - permitindo');
      return callback(null, true);
    }
    
    // Em desenvolvimento, permite qualquer origem
    if (process.env.NODE_ENV !== 'production') {
      console.log('[CORS] Modo desenvolvimento - permitindo');
      return callback(null, true);
    }
    
    console.log('[CORS] Origin bloqueada:', origin);
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Middleware para logar todas as requisições
app.use((req, res, next) => {
  console.log(`[SERVER] ${req.method} ${req.path}`, {
    origin: req.headers.origin,
    ip: req.ip || req.connection.remoteAddress,
    body: req.method === 'POST' || req.method === 'PUT' ? req.body : undefined
  });
  next();
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'AeroCost API'
  });
});

// API Routes
// No Vercel, o prefixo /api já é removido pelo handler em api/index.js
// Em desenvolvimento local, mantém o prefixo /api
if (process.env.VERCEL || process.env.VERCEL_ENV) {
  // No Vercel, o handler já remove o /api, então monta direto
  app.use(routes);
} else {
  // Em desenvolvimento local, mantém o prefixo /api
  app.use('/api', routes);
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server apenas se não estiver no Vercel (serverless)
// No Vercel, o handler serverless não precisa de app.listen()
if (process.env.VERCEL !== '1' && !process.env.VERCEL_ENV) {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`✈️  AeroCost API running on http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`🔌 API endpoints: http://localhost:${PORT}/api`);
    console.log(`🌐 Network access: http://192.168.3.247:${PORT}`);
  });
}

export default app;

