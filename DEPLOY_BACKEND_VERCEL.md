# 🚀 Deploy do Backend no Vercel

## ✅ Estrutura Pronta

O backend já está configurado para funcionar no Vercel:
- ✅ `api/index.js` - Handler serverless criado
- ✅ `vercel.json` - Configuração do Vercel na raiz
- ✅ `src/server.js` - Ajustado para não iniciar servidor no Vercel

## 📋 Passo a Passo

### 1️⃣ Criar Projeto Backend no Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique em **"Add New..."** → **"Project"**
3. Importe o repositório: `robsonpaulista/aerocost`
4. **Configure o projeto:**
   - **Project Name:** `aerocost-api` (ou outro nome)
   - **Root Directory:** `.` (raiz, deixe vazio) ⚠️ **IMPORTANTE!**
   - **Framework Preset:** **Other** ⚠️ **NÃO ESCOLHA NEXT.JS!**
   - **Build Command:** deixe vazio
   - **Output Directory:** deixe vazio
   - **Install Command:** `npm install`

### 2️⃣ Configurar Variáveis de Ambiente

Na mesma tela de configuração, vá em **"Environment Variables"** e adicione:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon-public
SUPABASE_SERVICE_KEY=sua-chave-service-role
NODE_ENV=production
CORS_ORIGIN=https://aerocost.vercel.app
```

⚠️ **IMPORTANTE:**
- Substitua `seu-projeto.supabase.co` pela URL real do seu Supabase
- Substitua as chaves pelas suas chaves reais do Supabase
- O `CORS_ORIGIN` deve ser a URL real do frontend (ex: `https://aerocost.vercel.app`)

**Como obter as credenciais do Supabase:**
1. Acesse: https://supabase.com
2. Vá no seu projeto
3. **Settings** → **API**
4. Copie:
   - **Project URL** → `SUPABASE_URL`
   - **anon public key** → `SUPABASE_KEY`
   - **service_role key** (clique em "Reveal") → `SUPABASE_SERVICE_KEY`

### 3️⃣ Fazer Deploy

1. Clique em **"Deploy"**
2. Aguarde o build completar (pode levar 2-3 minutos)
3. **Copie a URL gerada** (ex: `https://aerocost-api.vercel.app`)
4. Teste acessando: `https://aerocost-api.vercel.app/health`
   - Deve retornar: `{"status":"ok",...}`

### 4️⃣ Atualizar Frontend

Após o backend estar funcionando:

1. Vá no projeto **frontend** no Vercel
2. **Settings** → **Environment Variables**
3. Edite `NEXT_PUBLIC_API_URL` com a URL real do backend:
   ```
   NEXT_PUBLIC_API_URL=https://aerocost-api.vercel.app/api
   ```
4. Salve e faça **Redeploy** do frontend

### 5️⃣ Atualizar CORS no Backend

1. Vá no projeto **backend** no Vercel
2. **Settings** → **Environment Variables**
3. Edite `CORS_ORIGIN` com a URL real do frontend:
   ```
   CORS_ORIGIN=https://aerocost.vercel.app
   ```
4. Salve e faça **Redeploy** do backend

## ✅ Verificação

Após configurar tudo:

1. **Backend:** `https://aerocost-api.vercel.app/health`
   - Deve retornar: `{"status":"ok",...}`

2. **Frontend:** `https://aerocost.vercel.app`
   - Deve carregar a aplicação
   - Deve conseguir fazer login
   - Deve carregar dados do banco

3. **Console do Navegador (F12):**
   - Verifique se as requisições estão sendo feitas para o backend
   - Não deve haver erros de CORS

## ⚠️ Problemas Comuns

### Erro: "Module not found"
- Verifique se o **Root Directory** está como `.` (raiz)
- Verifique se o `package.json` está na raiz

### Erro: "Environment variables missing"
- Verifique se todas as variáveis foram adicionadas
- Confirme que os nomes estão corretos (case-sensitive)

### Erro: "CORS Error"
- Verifique se `CORS_ORIGIN` inclui a URL do frontend
- Certifique-se de que fez **redeploy** após atualizar

### Backend não responde
- Verifique os logs no Vercel (Deployments → View Function Logs)
- Verifique se as variáveis de ambiente estão corretas

## 📝 Checklist

- [ ] Projeto backend criado no Vercel
- [ ] Root Directory = `.` (raiz)
- [ ] Framework = **Other** (não Next.js!)
- [ ] Variáveis de ambiente configuradas
- [ ] Deploy realizado
- [ ] `/health` retorna `{"status":"ok"}`
- [ ] `NEXT_PUBLIC_API_URL` atualizado no frontend
- [ ] `CORS_ORIGIN` atualizado no backend
- [ ] Frontend consegue fazer requisições ao backend
- [ ] Dados carregam corretamente

---

**Pronto!** Agora você tem frontend e backend rodando no Vercel! 🎉

