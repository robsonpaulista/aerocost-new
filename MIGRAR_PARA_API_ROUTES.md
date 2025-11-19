# 🔄 Migração: Express para API Routes do Next.js

## 🎯 Abordagem

Você está certo! Não faz sentido ter um backend Express separado quando podemos usar **API Routes do Next.js** diretamente, que é a forma padrão e mais simples no Vercel.

## ✅ Solução

**Converter Express para API Routes do Next.js**:

1. **Helper criado** (`frontend/lib/api-handler.ts`):
   - Converte handlers do Express para handlers do Next.js
   - Reutiliza todos os controllers existentes
   - Sem necessidade de reescrever lógica

2. **API Routes criadas**:
   - `frontend/app/api/aircraft/route.ts` - Lista e cria aeronaves
   - `frontend/app/api/aircraft/[id]/route.ts` - Get, Update, Delete por ID
   - `frontend/app/api/users/login/route.ts` - Login

## 📋 Próximos Passos

Precisamos criar todas as outras rotas. Mas primeiro, vamos testar se essa abordagem funciona:

1. Faça commit e push:
   ```bash
   git add frontend/app/api frontend/lib/api-handler.ts MIGRAR_PARA_API_ROUTES.md
   git commit -m "refactor: criar API Routes do Next.js para substituir Express"
   git push origin main
   ```

2. No Vercel Dashboard:
   - Configure **Root Directory** como `frontend`
   - Faça **Redeploy**

3. Teste o login - deve funcionar agora!

## 🔄 Rotas Restantes a Criar

Após confirmar que funciona, precisamos criar:
- `/api/fixed-costs/*`
- `/api/variable-costs/*`
- `/api/routes/*`
- `/api/fx-rates/*`
- `/api/calculations/*`
- `/api/flights/*`
- `/api/dashboard/*`
- `/api/users/*` (exceto login)

## ✅ Vantagens

- ✅ **Simples**: Usa estrutura padrão do Next.js
- ✅ **Sem vercel.json complicado**: Vercel detecta tudo automaticamente
- ✅ **Reutiliza código**: Usa os mesmos controllers
- ✅ **Funciona**: API Routes são suportadas nativamente

---

**Esta é a solução correta e simples! ✅**

