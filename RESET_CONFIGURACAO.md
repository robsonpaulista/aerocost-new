# 🔄 Reset Completo da Configuração

## ⚠️ Problema

As configurações do deployment atual diferem das configurações do projeto. Isso causa conflitos.

## ✅ Solução: Reset Completo

**Removido o `vercel.json` completamente**. Vamos usar apenas a configuração do Dashboard do Vercel.

## 📋 Configuração no Vercel Dashboard

**PASSO A PASSO COMPLETO**:

1. Acesse: https://vercel.com/dashboard
2. Vá no projeto
3. **Settings** → **General**

### Configurações:
- **Root Directory**: Configure como `frontend`
- **Framework Preset**: `Next.js`
- **Build Command**: Deixe vazio (auto-detecta)
- **Output Directory**: Deixe vazio (auto-detecta)
- **Install Command**: Deixe vazio (auto-detecta)

4. **Settings** → **Environment Variables**
   - Verifique se todas as variáveis estão configuradas:
     - `SUPABASE_URL`
     - `SUPABASE_KEY`
     - `SUPABASE_SERVICE_KEY`
     - `NODE_ENV=production`
     - `CORS_ORIGIN` (URL do seu frontend)
     - **Remova** `NEXT_PUBLIC_API_URL` se existir (ou configure como `/api`)

5. **Deployments**
   - Vá em **Deployments**
   - Clique nos **três pontos** do último deployment
   - Selecione **Redeploy**
   - **IMPORTANTE**: Marque **"Use existing Build Cache"** como **DESMARCADA**
   - Clique em **Redeploy**

## 🚀 Próximos Passos

1. Faça commit e push:
   ```bash
   git add RESET_CONFIGURACAO.md
   git rm vercel.json
   git commit -m "refactor: remover vercel.json e usar apenas configuração do dashboard"
   git push origin main
   ```

2. No Vercel Dashboard:
   - Configure **Root Directory** como `frontend`
   - Faça **Redeploy SEM cache**

## ⚠️ Para o Express (Backend)

Como removemos o `vercel.json`, o Express não será deployado automaticamente. Você tem duas opções:

### Opção 1: Criar API Routes do Next.js
Criar `frontend/app/api/[...path]/route.ts` que faz proxy para o Express externo.

### Opção 2: Deploy Separado do Express
Fazer deploy do Express em um projeto separado no Vercel (como você mencionou que tem outros projetos assim).

### Opção 3: Criar vercel.json apenas para Express
Criar um `vercel.json` muito simples que só configure o Express, sem interferir com Next.js.

---

**Vamos tentar sem vercel.json primeiro! ✅**

