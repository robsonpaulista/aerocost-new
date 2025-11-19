# Checklist - Erro 404 no Vercel

## ✅ Passos para Resolver

### 1. Verificar Configuração do Vercel

No Vercel Dashboard → Settings → General:
- [ ] **Root Directory**: `frontend`
- [ ] **Framework Preset**: `Next.js`
- [ ] **Build Command**: `npm run build` (padrão)
- [ ] **Output Directory**: `.next` (padrão, não precisa configurar)
- [ ] **Install Command**: `npm install` (padrão)

### 2. Verificar Variáveis de Ambiente

No Vercel Dashboard → Settings → Environment Variables:
- [ ] `SUPABASE_URL` está configurada
- [ ] `SUPABASE_KEY` ou `SUPABASE_SERVICE_KEY` está configurada
- [ ] Variáveis estão disponíveis para **Production**, **Preview** e **Development**

### 3. Verificar Build

No Vercel Dashboard → Deployments → [Último deployment]:
- [ ] Build completou com sucesso?
- [ ] Há erros nos logs?
- [ ] Procure por:
  - "Missing Supabase credentials"
  - "Module not found"
  - "Cannot find module"

### 4. Verificar Estrutura de Arquivos

Certifique-se de que existem:
- [ ] `frontend/app/api/users/login/route.ts`
- [ ] `frontend/app/api/aircraft/route.ts`
- [ ] `frontend/app/api/aircraft/[id]/route.ts`
- [ ] `frontend/lib/config/supabase.ts`
- [ ] `frontend/lib/models/User.ts`
- [ ] `frontend/lib/models/Aircraft.ts`

### 5. Verificar Dependências

No `frontend/package.json` deve ter:
- [ ] `@supabase/supabase-js`
- [ ] `bcryptjs`
- [ ] `@types/bcryptjs`

### 6. Testar Localmente

```powershell
cd frontend
npm install
npm run build
npm start
```

Depois teste:
- http://localhost:3002/api/users/login (POST)
- http://localhost:3002/api/aircraft (GET)

### 7. Verificar Logs do Vercel

Se ainda der 404:
1. Vá para Functions → [Nome da função]
2. Veja os logs em tempo real
3. Procure por erros específicos

## 🔍 Erros Comuns

### "Missing Supabase credentials"
**Solução**: Adicione as variáveis de ambiente no Vercel

### "Module not found: Can't resolve '@/lib/models/User'"
**Solução**: Verifique se o arquivo existe e se o path alias `@/*` está configurado no `tsconfig.json`

### "404: NOT_FOUND"
**Possíveis causas**:
1. Rotas não estão sendo encontradas
2. Build falhou silenciosamente
3. Root Directory incorreto

## 🚀 Solução Rápida

Se nada funcionar, tente:

1. **Deletar e recriar o projeto no Vercel**
2. **Conectar novamente ao GitHub**
3. **Configurar Root Directory = `frontend`**
4. **Adicionar variáveis de ambiente**
5. **Fazer novo deploy**

