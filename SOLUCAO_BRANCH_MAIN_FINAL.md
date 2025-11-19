# ✅ Solução: Erro "src refspec main does not match any"

## 🔍 Problema

O erro acontece porque:
- Não existe uma branch chamada `main`
- Ou não há commits no repositório
- Ou a branch tem outro nome

## ✅ Solução Rápida

### Execute o Script:

```powershell
powershell -ExecutionPolicy Bypass -File criar-branch-main-e-push.ps1
```

### Ou Faça Manualmente:

```powershell
# 1. Verificar se há commits
git log --oneline

# 2. Se não houver commits, criar um
git add .
git commit -m "chore: commit inicial - projeto appaeronave"

# 3. Verificar branch atual
git branch

# 4. Se não houver branch main, criar
git checkout -b main

# 5. Verificar remote
git remote -v

# 6. Se não houver remote ou estiver errado, configurar
git remote remove origin
git remote add origin https://github.com/robsonpaulista/aerocost-new.git

# 7. Push com -u (configura upstream)
git push -u origin main
```

## 🔧 Comandos Completos em Sequência

```powershell
# Tudo em uma sequência:
git add .
git commit -m "chore: commit inicial"
git checkout -b main
git remote remove origin 2>$null
git remote add origin https://github.com/robsonpaulista/aerocost-new.git
git push -u origin main
```

## ⚠️ Se Ainda Der Erro

### Verificar se o repositório existe:
- Acesse: https://github.com/robsonpaulista/aerocost-new
- Certifique-se de que o repositório foi criado e está vazio

### Verificar permissões:
- Certifique-se de que você tem permissão para fazer push

### Verificar commits:
```powershell
git log --oneline
# Deve mostrar pelo menos 1 commit
```

---

**Execute o script ou os comandos manuais acima! ✅**

