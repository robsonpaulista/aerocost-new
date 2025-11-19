# 🚀 Deploy Completo no Vercel - 100% FREE

Este guia vai te ajudar a fazer deploy do **frontend E backend** no Vercel, tudo gratuito!

## 📋 Pré-requisitos

- ✅ Código no GitHub: `https://github.com/robsonpaulista/aerocost`
- ✅ Conta no Vercel: https://vercel.com (login com GitHub)
- ✅ Conta no Supabase: https://supabase.com (gratuito)

## 🎯 Estrutura do Deploy

Você vai criar **2 projetos separados** no Vercel:
1. **Frontend** (Next.js) - `aerocost.vercel.app`
2. **Backend** (Express API) - `aerocost-api.vercel.app`

---

## 📦 PASSO 1: Deploy do Backend

### 1.1 Criar Projeto Backend no Vercel

1. Acesse: https://vercel.com/dashboard
2. Clique em **"Add New..."** → **"Project"**
3. Importe o repositório: `robsonpaulista/aerocost`
4. **Configure o projeto:**
   - **Project Name:** `aerocost-api` (ou outro nome)
   - **Root Directory:** `.` (raiz, deixe vazio)
   - **Framework Preset:** **Other** (não Next.js!)
   - **Build Command:** deixe vazio
   - **Output Directory:** deixe vazio
   - **Install Command:** `npm install`

### 1.2 Configurar Variáveis de Ambiente do Backend

Na mesma tela de configuração, vá em **"Environment Variables"** e adicione:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_KEY=sua-chave-anon-key
SUPABASE_SERVICE_KEY=sua-chave-service-role-key
NODE_ENV=production
CORS_ORIGIN=https://aerocost.vercel.app
```

⚠️ **IMPORTANTE:**
- Substitua `seu-projeto.supabase.co` pela URL real do seu Supabase
- Substitua as chaves pelas suas chaves reais do Supabase
- O `CORS_ORIGIN` será atualizado depois com a URL real do frontend

### 1.3 Fazer Deploy do Backend

1. Clique em **"Deploy"**
2. Aguarde o build completar (pode levar 2-3 minutos)
3. **Copie a URL gerada** (ex: `https://aerocost-api.vercel.app`)
4. Teste acessando: `https://aerocost-api.vercel.app/health`
   - Deve retornar: `{"status":"ok",...}`

✅ **Backend deployado!**

---

## 🎨 PASSO 2: Deploy do Frontend

### 2.1 Criar Projeto Frontend no Vercel

1. No dashboard do Vercel, clique em **"Add New..."** → **"Project"**
2. Importe o **mesmo repositório**: `robsonpaulista/aerocost`
3. **Configure o projeto:**
   - **Project Name:** `aerocost` (ou outro nome)
   - **Root Directory:** `frontend` ⚠️ **IMPORTANTE!**
   - **Framework Preset:** Next.js (detectado automaticamente)
   - **Build Command:** `npm run build` (padrão)
   - **Output Directory:** `.next` (padrão)
   - **Install Command:** `npm install` (padrão)

### 2.2 Configurar Variáveis de Ambiente do Frontend

Na mesma tela, vá em **"Environment Variables"** e adicione:

```
NEXT_PUBLIC_API_URL=https://aerocost-api.vercel.app/api
```

⚠️ **IMPORTANTE:**
- Substitua `aerocost-api.vercel.app` pela URL real do backend que você copiou no Passo 1.3
- A URL deve terminar com `/api`

### 2.3 Fazer Deploy do Frontend

1. Clique em **"Deploy"**
2. Aguarde o build completar
3. **Copie a URL gerada** (ex: `https://aerocost.vercel.app`)

✅ **Frontend deployado!**

---

## 🔄 PASSO 3: Atualizar URLs (Importante!)

Agora que você tem as URLs reais, precisa atualizar as variáveis de ambiente:

### 3.1 Atualizar CORS no Backend

1. Vá no projeto **backend** no Vercel
2. **Settings** → **Environment Variables**
3. Encontre `CORS_ORIGIN`
4. Edite e coloque a URL real do frontend:
   ```
   https://aerocost.vercel.app
   ```
5. Salve
6. Vá em **Deployments** → três pontos → **Redeploy**

### 3.2 Verificar API URL no Frontend

1. Vá no projeto **frontend** no Vercel
2. **Settings** → **Environment Variables**
3. Verifique se `NEXT_PUBLIC_API_URL` está correto:
   ```
   https://aerocost-api.vercel.app/api
   ```
4. Se precisar atualizar, edite e faça **Redeploy**

---

## ✅ PASSO 4: Verificar se Está Funcionando

### 4.1 Testar Backend

Abra no navegador:
```
https://aerocost-api.vercel.app/health
```

Deve retornar:
```json
{
  "status": "ok",
  "timestamp": "...",
  "service": "AeroCost API"
}
```

### 4.2 Testar Frontend

1. Abra: `https://aerocost.vercel.app`
2. Abra o **Console do Navegador** (F12)
3. Vá na aba **Network**
4. Tente fazer login
5. Verifique:
   - ✅ Requisições aparecem na aba Network
   - ✅ URLs estão corretas (apontando para o backend)
   - ✅ Não há erros de CORS
   - ✅ Dados carregam corretamente

---

## 🔧 Arquivos Criados

✅ `api/index.js` - Handler serverless para o backend  
✅ `vercel-backend.json` - Configuração do Vercel para backend (opcional)  
✅ `DEPLOY_VERCEL_COMPLETO.md` - Este guia

---

## ⚠️ Problemas Comuns

### Erro: "Module not found"
- Verifique se o **Root Directory** está correto
- Backend: `.` (raiz)
- Frontend: `frontend`

### Erro: "CORS Error"
- Verifique se `CORS_ORIGIN` no backend inclui a URL do frontend
- Certifique-se de que fez **redeploy** após atualizar

### Erro: "404 Not Found" nas requisições
- Verifique se `NEXT_PUBLIC_API_URL` está correto
- Deve terminar com `/api`
- Certifique-se de que fez **redeploy** após atualizar

### Backend não inicia
- Verifique se todas as variáveis de ambiente estão configuradas
- Verifique os logs no Vercel (Deployments → View Function Logs)

### Dados não carregam
- Abra o Console do Navegador (F12)
- Verifique se as requisições estão sendo feitas
- Verifique se a URL da API está correta
- Verifique os logs do backend no Vercel

---

## 📝 Checklist Final

- [ ] Backend deployado e acessível (`/health` funciona)
- [ ] Frontend deployado e acessível
- [ ] `CORS_ORIGIN` configurado com URL real do frontend
- [ ] `NEXT_PUBLIC_API_URL` configurado com URL real do backend
- [ ] Redeploy feito após atualizar variáveis
- [ ] Login funciona no frontend
- [ ] Dados carregam corretamente
- [ ] Sem erros no console do navegador

---

## 🎉 Pronto!

Agora você tem tudo rodando no Vercel, 100% gratuito!

**URLs:**
- Frontend: `https://aerocost.vercel.app`
- Backend: `https://aerocost-api.vercel.app`

**Próximos passos (opcional):**
- Configurar domínio customizado
- Configurar CI/CD automático
- Adicionar monitoramento

---

**Dúvidas?** Verifique os logs no Vercel ou consulte a documentação: https://vercel.com/docs

