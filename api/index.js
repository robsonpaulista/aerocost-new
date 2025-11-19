// Serverless function handler para Vercel
// Este arquivo permite que o Express funcione como serverless function no Vercel
import app from '../src/server.js';

// Handler que ajusta o path antes de passar para o Express
export default (req, res) => {
  // Log para debug
  console.log('[VERCEL HANDLER] Original URL:', req.url);
  console.log('[VERCEL HANDLER] Original path:', req.path);
  
  // O Vercel roteia /api/* para este handler
  // O path que chega pode ser /api/users/login ou /users/login dependendo da configuração
  const originalPath = req.url || req.path || '';
  
  // Se o path começa com /api, remove o prefixo
  // Porque o Express no Vercel monta as rotas sem prefixo /api
  if (originalPath.startsWith('/api')) {
    const newPath = originalPath.replace(/^\/api/, '') || '/';
    req.url = newPath;
    req.path = newPath;
    console.log('[VERCEL HANDLER] Path ajustado para:', newPath);
  }
  
  // Chama o app Express
  return app(req, res);
};

