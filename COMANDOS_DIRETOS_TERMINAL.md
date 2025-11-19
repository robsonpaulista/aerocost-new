# ✅ Comandos Diretos para o Terminal

## 🔍 Você está no diretório `frontend`, execute na raiz:

### Opção 1: Voltar para raiz e executar script

```powershell
# Voltar para raiz
cd ..

# Executar script
powershell -ExecutionPolicy Bypass -File remover-node-modules-terminal.ps1
```

### Opção 2: Comandos diretos (sem script)

```powershell
# 1. Voltar para raiz
cd ..

# 2. Verificar se node_modules está sendo rastreado
git ls-files | Select-String "node_modules"

# 3. Remover do Git
git rm -rf --cached node_modules
git rm -rf --cached frontend/node_modules

# 4. Garantir .gitignore
@"
node_modules/
**/node_modules/
.env
.DS_Store
*.log
dist/
build/
.next/
"@ | Out-File ".gitignore" -Encoding UTF8

# 5. Adicionar arquivos
git add .

# 6. VERIFICAR que node_modules NÃO está no staging
git status | Select-String "node_modules"
# Não deve retornar nada!

# 7. Se aparecer algo, remover:
git reset node_modules
git reset frontend/node_modules
git rm -rf --cached node_modules
git rm -rf --cached frontend/node_modules

# 8. Verificar novamente
git ls-files | Select-String "node_modules"
# Não deve retornar nada!

# 9. Commit
git commit -m "chore: remover node_modules do Git"

# 10. Push
git push origin main --force
```

### Opção 3: Remover manualmente TODOS os arquivos node_modules

```powershell
# Voltar para raiz
cd ..

# Remover TODOS os arquivos node_modules do Git
git ls-files | Select-String "node_modules" | ForEach-Object {
    git rm --cached $_
}

# Commit
git commit -m "chore: remover todos os arquivos node_modules do Git"

# Push
git push origin main --force
```

---

**Execute os comandos acima na raiz do projeto! ✅**

