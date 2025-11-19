# 🔧 Solução: Erro 500 FUNCTION_INVOCATION_FAILED no Backend

## ❌ Erro

```
500: INTERNAL_SERVER_ERROR
Code: FUNCTION_INVOCATION_FAILED
This Serverless Function has crashed.
```

## 🔍 Causas Comuns

1. **Variáveis de ambiente faltando** (mais comum)
2. **Erro no código durante inicialização**
3. **Problema com imports/dependências**
4. **Handler do Vercel incorreto**

## ✅ Solução Passo a Passo

### 1️⃣ Verificar Variáveis de Ambiente no Vercel

1. Acesse: https://vercel.com/dashboard
2. Vá no projeto **backend** (`aerocost-api`)
3. **Settings** → **Environment Variables**
4. Verifique se **TODAS** estas variáveis estão configuradas:

   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-anon-public
   SUPABASE_SERVICE_KEY=sua-chave-service-role
   NODE_ENV=production
   CORS_ORIGIN=https://aerocost.vercel.app
   ```

   ⚠️ **IMPORTANTE:**
   - Substitua pelos valores **reais** do seu Supabase
   - Verifique se não há espaços extras
   - Verifique se os nomes estão corretos (case-sensitive)

5. Se alguma estiver faltando, **adicione** e salve
6. **Faça Redeploy** após adicionar variáveis

### 2️⃣ Verificar Logs do Vercel

1. No projeto backend, vá em **Deployments**
2. Clique no deployment mais recente
3. Clique em **View Function Logs** ou **Logs**
4. Procure por erros como:
   - `Missing Supabase credentials`
   - `Cannot find module`
   - `Error: ...`
5. Anote o erro exato para corrigir

### 3️⃣ Testar Endpoint de Health

1. Acesse: `https://aerocost-api.vercel.app/health`
2. Se retornar `{"status":"ok",...}`, o backend está funcionando
3. Se retornar erro, veja os logs (passo 2)

### 4️⃣ Verificar CORS

Se o frontend não consegue fazer requisições:

1. No Vercel, vá em **Settings** → **Environment Variables**
2. Verifique se `CORS_ORIGIN` está configurado com a URL do frontend:
   ```
   CORS_ORIGIN=https://aerocost.vercel.app
   ```
   (Use a URL real do seu frontend)
3. Se estiver vazio ou incorreto, corrija e faça **Redeploy**

### 5️⃣ Verificar Handler do Vercel

O arquivo `api/index.js` deve exportar o app Express diretamente:

```javascript
import app from '../src/server.js';
export default app;
```

✅ **Já está correto no código!**

### 6️⃣ Verificar Dependências

1. Verifique se o `package.json` está na raiz
2. Verifique se todas as dependências estão listadas:
   - `express`
   - `@supabase/supabase-js`
   - `cors`
   - `dotenv`
   - `bcryptjs`
   - `zod`

## 🔍 Como Obter Credenciais do Supabase

1. Acesse: https://supabase.com
2. Vá no seu projeto
3. **Settings** → **API**
4. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_KEY`
   - **service_role key** (clique em "Reveal") → `SUPABASE_SERVICE_KEY`

## 📋 Checklist de Troubleshooting

- [ ] Todas as variáveis de ambiente estão configuradas
- [ ] Valores das variáveis estão corretos (sem espaços extras)
- [ ] `CORS_ORIGIN` aponta para a URL do frontend
- [ ] Logs do Vercel foram verificados
- [ ] `/health` retorna `{"status":"ok"}`
- [ ] Redeploy foi feito após alterar variáveis

## ⚠️ Erros Comuns e Soluções

### "Missing Supabase credentials"
- **Solução:** Adicione `SUPABASE_URL`, `SUPABASE_KEY` e `SUPABASE_SERVICE_KEY` no Vercel

### "Cannot find module"
- **Solução:** Verifique se o `package.json` está na raiz e tem todas as dependências

### "Not allowed by CORS"
- **Solução:** Configure `CORS_ORIGIN` com a URL do frontend e faça redeploy

### "Connection timeout"
- **Solução:** Verifique se o Supabase está acessível e as credenciais estão corretas

## 🚀 Após Corrigir

1. Faça **Redeploy** do backend
2. Teste: `https://aerocost-api.vercel.app/health`
3. Teste do frontend: verifique se consegue fazer requisições
4. Verifique o console do navegador (F12) para erros

---

**A causa mais comum é variáveis de ambiente faltando ou incorretas!**
