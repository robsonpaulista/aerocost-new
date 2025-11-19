# Solução Final - Remover node_modules do Git

## Problema
O arquivo `frontend/node_modules/@next/swc-win32-x64-msvc/next-swc.win32-x64-msvc.node` (129.57 MB) está no histórico do Git e excede o limite de 100 MB do GitHub.

## Solução Recomendada: Criar Repositório Limpo

Execute o script:
```powershell
powershell -ExecutionPolicy Bypass -File criar-repositorio-limpo.ps1
```

Este script vai:
1. Criar backup do repositório atual
2. Criar um novo branch sem histórico
3. Adicionar todos os arquivos exceto node_modules
4. Substituir a branch main

Depois execute:
```powershell
git push origin main --force
```

## Alternativa: Usar Git LFS (Git Large File Storage)

Se você realmente precisa manter o histórico, pode usar Git LFS:

```powershell
# Instalar Git LFS (se não tiver)
# Baixe de: https://git-lfs.github.com/

# Inicializar Git LFS
git lfs install

# Rastrear arquivos grandes
git lfs track "*.node"
git lfs track "node_modules/**/*.node"

# Adicionar .gitattributes
git add .gitattributes

# Commit e push
git commit -m "chore: adicionar Git LFS para arquivos grandes"
git push origin main
```

## Solução Manual Rápida

Se preferir fazer manualmente:

```powershell
# 1. Remover node_modules
git rm -rf --cached frontend/node_modules
git rm -rf --cached node_modules

# 2. Criar novo branch limpo
git checkout --orphan main-limpo

# 3. Adicionar tudo exceto node_modules
git add .
git rm -rf --cached frontend/node_modules 2>$null
git rm -rf --cached node_modules 2>$null

# 4. Commit
git commit -m "chore: repositório limpo"

# 5. Substituir main
git branch -D main
git branch -m main

# 6. Push com force
git push origin main --force
```

## Importante

⚠️ **ATENÇÃO**: Usar `--force` apaga o histórico remoto. Certifique-se de que:
- Ninguém mais está trabalhando neste repositório
- Você tem backup do código importante
- Você está ciente de que o histórico será perdido

## Verificar se funcionou

Depois do push, verifique:
```powershell
git log --oneline
# Deve mostrar apenas 1 commit (o novo)

git ls-files | Select-String "node_modules"
# Não deve retornar nada
```

