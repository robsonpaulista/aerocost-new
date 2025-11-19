# Verificar Erro 404 no Vercel

## Possíveis Causas

1. **Variáveis de Ambiente não configuradas**
   - Verifique no Vercel Dashboard → Settings → Environment Variables
   - Deve ter: `SUPABASE_URL` e `SUPABASE_KEY` (ou `SUPABASE_SERVICE_KEY`)

2. **Build falhou**
   - Verifique os logs do build no Vercel
   - Pode estar faltando dependências (`@supabase/supabase-js`, `bcryptjs`)

3. **Rotas da API não encontradas**
   - Verifique se as rotas estão em `frontend/app/api/`
   - Estrutura esperada:
     - `frontend/app/api/users/login/route.ts`
     - `frontend/app/api/aircraft/route.ts`
     - `frontend/app/api/aircraft/[id]/route.ts`

4. **Root Directory incorreto**
   - No Vercel Dashboard → Settings → General
   - Root Directory deve ser: `frontend`
   - Framework Preset deve ser: `Next.js`

## Checklist

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] Root Directory = `frontend`
- [ ] Framework Preset = `Next.js`
- [ ] Build Command = `npm run build` (padrão)
- [ ] Output Directory = `.next` (padrão, não precisa configurar)
- [ ] Dependências instaladas (`npm install` no build)

## Verificar Logs do Vercel

1. Vá para o Vercel Dashboard
2. Clique no deployment que falhou
3. Veja os logs do build
4. Procure por erros relacionados a:
   - Missing Supabase credentials
   - Module not found
   - Build errors

## Testar Localmente

```powershell
cd frontend
npm install
npm run build
npm start
```

Depois teste as rotas:
- http://localhost:3002/api/users/login
- http://localhost:3002/api/aircraft

## Se o problema persistir

Verifique se o arquivo `frontend/package.json` tem todas as dependências:
- `@supabase/supabase-js`
- `bcryptjs`
- `@types/bcryptjs`

