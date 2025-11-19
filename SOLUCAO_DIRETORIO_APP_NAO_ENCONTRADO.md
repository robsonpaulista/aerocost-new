# ✅ Solução: Diretório App Não Encontrado no Vercel

## 🔍 Problema

O Vercel está mostrando:
```
Error: > Couldn't find any `pages` or `app` directory. Please create one under the project root
```

## ✅ Causas Possíveis

1. **Diretório `app` não foi commitado no Git**
2. **Script `vercel-build` no package.json** (não é necessário)
3. **Root Directory configurado incorretamente**

## ✅ Solução

### Execute o Script:

```powershell
powershell -ExecutionPolicy Bypass -File corrigir-diretorio-app.ps1
git push origin main
```

### Ou Faça Manualmente:

```powershell
# 1. Verificar se frontend/app existe
Test-Path frontend/app

# 2. Verificar se está no Git
git ls-files | Select-String "^frontend/app/"
# Se não retornar nada, o diretório não está no Git!

# 3. Adicionar ao Git
git add frontend/app/

# 4. Remover vercel-build do package.json (se existir)
# Edite frontend/package.json e remova o script "vercel-build"

# 5. Commit
git commit -m "fix: adicionar diretório app ao Git"

# 6. Push
git push origin main
```

## 🔧 Verificação no Vercel

Depois do push, verifique:

1. **Root Directory**: Deve ser `frontend`
2. **Framework Preset**: Deve ser `Next.js`
3. **Build Command**: Deve estar vazio (auto-detecta)
4. **Output Directory**: Deve estar vazio (auto-detecta)

## ⚠️ Importante

- **NÃO** adicione script `vercel-build` no package.json
- O Next.js detecta automaticamente o diretório `app`
- O Root Directory deve ser `frontend`, não a raiz do projeto

---

**Execute o script e faça push! ✅**
