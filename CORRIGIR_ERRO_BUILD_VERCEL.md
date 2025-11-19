# 🔧 Corrigir Erro de Build no Vercel

## ❌ Erro Atual

```
Error: No Next.js version detected. Make sure your package.json has "next" in either "dependencies" or "devDependencies".
```

## 🔍 Causa

O Vercel está tentando fazer build do **backend** como se fosse **Next.js**, mas o backend é **Express**.

## ✅ Solução

Você precisa configurar **2 projetos separados** no Vercel:

### 1️⃣ Projeto Backend (Express)

1. Acesse: https://vercel.com/dashboard
2. **Add New Project** → Importe `robsonpaulista/aerocost`
3. **Configure:**
   - **Project Name:** `aerocost-api`
   - **Root Directory:** `.` (raiz, deixe vazio)
   - **Framework Preset:** **Other** ⚠️ **IMPORTANTE: NÃO ESCOLHA NEXT.JS!**
   - **Build Command:** deixe vazio
   - **Output Directory:** deixe vazio
   - **Install Command:** `npm install`
4. O arquivo `vercel.json` na raiz já está configurado corretamente para Express
5. **Variáveis de Ambiente:**
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-anon
   SUPABASE_SERVICE_KEY=sua-chave-service
   NODE_ENV=production
   CORS_ORIGIN=https://aerocost.vercel.app
   ```
6. **Deploy!**

### 2️⃣ Projeto Frontend (Next.js)

1. No dashboard do Vercel, **Add New Project** → Importe o mesmo repositório
2. **Configure:**
   - **Project Name:** `aerocost`
   - **Root Directory:** `frontend` ⚠️ **IMPORTANTE!**
   - **Framework Preset:** **Next.js** (detectado automaticamente)
   - **Build Command:** `npm run build` (padrão)
   - **Output Directory:** `.next` (padrão)
   - **Install Command:** `npm install` (padrão)
3. O arquivo `frontend/vercel.json` já está configurado
4. **Variáveis de Ambiente:**
   ```
   NEXT_PUBLIC_API_URL=https://aerocost-api.vercel.app/api
   ```
   (Use a URL real do backend)
5. **Deploy!**

## ⚠️ Pontos Importantes

1. **Backend:** Framework = **Other** (não Next.js!)
2. **Frontend:** Root Directory = **frontend**
3. **Dois projetos separados** no Vercel
4. Cada um com suas próprias variáveis de ambiente

## 🔄 Se Já Criou o Projeto Errado

1. Vá em **Settings** do projeto
2. **General** → **Root Directory**
3. Para backend: deixe vazio ou `.`
4. Para frontend: `frontend`
5. **Framework Preset:**
   - Backend: **Other**
   - Frontend: **Next.js**
6. Salve e faça **Redeploy**

## ✅ Verificação

Após configurar corretamente:

- **Backend:** `https://aerocost-api.vercel.app/health` deve retornar `{"status":"ok"}`
- **Frontend:** `https://aerocost.vercel.app` deve carregar a aplicação

---

**Arquivos criados:**
- ✅ `vercel.json` (raiz) - Configuração para backend Express
- ✅ `frontend/vercel.json` - Configuração para frontend Next.js

