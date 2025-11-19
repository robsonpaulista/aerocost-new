# Solução URGENTE - Arquivo Grande no Git

## O Problema
O arquivo `frontend/node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node` (129.57 MB) está no histórico do Git e não consegue ser removido com métodos normais.

## Solução DEFINITIVA (Recomendada)

### Opção 1: Criar Repositório Completamente Novo (MAIS RÁPIDO)

```powershell
# Execute este script
powershell -ExecutionPolicy Bypass -File criar-repositorio-limpo.ps1

# Depois faça push
git push origin main --force
```

### Opção 2: Verificar e Corrigir Manualmente

```powershell
# 1. Verificar o que está sendo rastreado
git ls-files | Select-String "node_modules"

# Se retornar arquivos, eles estão no Git!

# 2. Remover completamente
git rm -rf --cached frontend/node_modules
git rm -rf --cached node_modules

# 3. Criar novo branch limpo
git checkout --orphan main-novo

# 4. Adicionar tudo exceto node_modules
git add .
git reset frontend/node_modules 2>$null
git reset node_modules 2>$null

# 5. Verificar que node_modules não está
git status | Select-String "node_modules"
# Se aparecer, remova manualmente

# 6. Commit
git commit -m "chore: repositório limpo"

# 7. Substituir main
git branch -D main
git branch -m main

# 8. Push
git push origin main --force
```

### Opção 3: Usar BFG Repo-Cleaner (Mais Avançado)

1. Baixe BFG: https://rtyley.github.io/bfg-repo-cleaner/
2. Execute:
```bash
java -jar bfg.jar --delete-folders node_modules
git reflog expire --expire=now --all
git gc --prune=now --aggressive
git push origin main --force
```

## Por que o problema persiste?

O Git está tentando enviar **18429 objetos**, o que significa que o histórico antigo ainda contém o arquivo grande. Mesmo removendo do índice atual, o histórico ainda tem referências ao arquivo.

## Solução Mais Simples

Se você não se importa em perder o histórico (recomendado para este caso):

1. **Crie um novo repositório no GitHub** (ou delete o atual)
2. **Adicione como novo remote:**
```powershell
git remote remove origin
git remote add origin https://github.com/robsonpaulista/aerocost.git
```

3. **Crie branch limpo:**
```powershell
git checkout --orphan main
git add .
git commit -m "Initial commit - migração para Next.js API Routes"
git push origin main --force
```

## Verificação Final

Depois de qualquer solução, verifique:

```powershell
# Não deve retornar nada
git ls-files | Select-String "node_modules"

# Verificar tamanho
git count-objects -vH
```

