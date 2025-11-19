# ✅ Solução: Erro de Imports no Vercel

## 🔍 Problema

O Vercel está mostrando erros de imports:
```
Module not found: Can't resolve '../../../../src/controllers/aircraftController.js'
```

Mas os arquivos locais estão corretos com `@/lib/models/`.

## ✅ Solução

### Opção 1: Forçar Atualização (Recomendado)

```powershell
powershell -ExecutionPolicy Bypass -File forcar-atualizacao-imports.ps1
git push origin main
```

### Opção 2: Verificar e Corrigir Manualmente

```powershell
# 1. Verificar conteúdo dos arquivos
Get-Content frontend/app/api/aircraft/route.ts | Select-String "import"
# Deve mostrar: import { Aircraft } from '@/lib/models/Aircraft';

# 2. Se estiver incorreto, corrigir manualmente
# Os arquivos já devem estar corretos localmente

# 3. Forçar adição ao Git
git add frontend/app/api/
git add frontend/lib/

# 4. Commit
git commit -m "fix: garantir imports corretos nas rotas da API"

# 5. Push
git push origin main
```

### Opção 3: Limpar Cache do Vercel

1. **No Vercel Dashboard**:
   - Vá em **Deployments**
   - Clique nos **3 pontos** do último deployment
   - **Redeploy** → **Use existing Build Cache** (desmarque)
   - Ou **Delete** o deployment e faça um novo

2. **Ou limpar cache via Settings**:
   - Settings → General
   - **Clear Build Cache**

## 🔧 Verificação

Depois do push, verifique:

1. **No Vercel Dashboard**:
   - Veja os logs do build
   - Procure por erros de imports
   - Verifique se o build completou

2. **Localmente** (teste antes de fazer push):
   ```powershell
   cd frontend
   npm run build
   ```
   Se funcionar localmente, deve funcionar no Vercel.

## ⚠️ Se Ainda Der Erro

1. **Verifique o tsconfig.json**:
   - Deve ter `"@/*": ["./*"]` em `paths`

2. **Verifique se os arquivos existem**:
   - `frontend/lib/models/Aircraft.ts`
   - `frontend/lib/models/User.ts`
   - `frontend/lib/config/supabase.ts`

3. **Limpe o cache do Next.js**:
   ```powershell
   cd frontend
   Remove-Item -Recurse -Force .next
   npm run build
   ```

---

**Execute o script `forcar-atualizacao-imports.ps1` e faça push! ✅**

