# ✅ Solução: Erro "src refspec main does not match any"

## 🔍 Problema

O erro acontece porque:
- Não existe uma branch chamada `main` no repositório local
- Ou não há commits na branch atual
- Ou a branch tem outro nome (ex: `master`)

## ✅ Solução Rápida

### Execute o Script:

```powershell
powershell -ExecutionPolicy Bypass -File corrigir-branch-e-push.ps1
```

### Ou Faça Manualmente:

```powershell
# 1. Verificar branch atual
git branch

# 2. Se não houver branch, criar
git checkout -b main

# 3. Se não houver commits, criar um
git add .
git commit -m "chore: commit inicial - migração para Next.js API Routes"

# 4. Verificar remote
git remote -v

# 5. Se tiver múltiplos remotes, limpar e adicionar apenas o novo
git remote remove origin
git remote add origin https://github.com/robsonpaulista/aerocost-new.git

# 6. Push com -u para configurar upstream
git push -u origin main
```

## 🔧 Se Ainda Der Erro

### Verificar se há commits:

```powershell
git log --oneline
```

Se não houver commits:
```powershell
git add .
git commit -m "chore: commit inicial"
git push -u origin main
```

### Verificar se o repositório existe:

Certifique-se de que o repositório `aerocost-new` foi criado no GitHub e está vazio.

### Verificar permissões:

Certifique-se de que você tem permissão para fazer push no repositório.

---

**Execute o script `corrigir-branch-e-push.ps1` que resolve tudo automaticamente! ✅**

