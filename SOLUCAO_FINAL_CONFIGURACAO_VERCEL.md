# ✅ Solução Final - Configuração do Vercel

## 🔍 Problema Identificado

Há arquivos de configuração antigos que estão causando conflito:
- `vercel.json` na raiz (com configurações explícitas)
- `vercel-backend.json` (configuração antiga do Express)

## ✅ Solução

### 1. Remover Arquivos Antigos

Execute o script ou remova manualmente:

```powershell
# Remover arquivos antigos
Remove-Item vercel.json -Force -ErrorAction SilentlyContinue
Remove-Item vercel-backend.json -Force -ErrorAction SilentlyContinue
Remove-Item frontend/vercel.json -Force -ErrorAction SilentlyContinue

# Ou execute o script
powershell -ExecutionPolicy Bypass -File limpar-configuracoes-vercel.ps1
```

### 2. Commit e Push

```powershell
git add .
git commit -m "chore: remover configurações antigas do Vercel - usar apenas Next.js API Routes"
git push origin main
```

### 3. Configurar no Vercel Dashboard

**IMPORTANTE**: Configure **APENAS** no Dashboard:

1. **Settings** → **General**
2. **Root Directory**: `frontend`
3. **Framework Preset**: `Next.js`
4. **Deixe tudo mais como padrão** (auto-detect)

### 4. Resolver o Conflito

Quando aparecer o aviso:
> "Configuration Settings in the current Production deployment differ from your current Project Settings"

**Clique em**: **"Use Project Settings"** ou **"Update to Project Settings"**

Isso vai:
- Sobrescrever as configurações antigas do deployment
- Usar as novas configurações do projeto
- Resolver o conflito

## ✅ Por que isso funciona?

- **Antes**: Arquivos `vercel.json` com configurações explícitas causavam conflito
- **Agora**: Sem arquivos de configuração, o Vercel usa apenas as configurações do Dashboard
- **Next.js**: Detectado automaticamente quando Root Directory = `frontend`
- **API Routes**: Funcionam automaticamente em `/api/*`

## 📋 Checklist Final

- [ ] Removidos `vercel.json` e `vercel-backend.json`
- [ ] Commit e push realizados
- [ ] Root Directory = `frontend` no Dashboard
- [ ] Framework Preset = `Next.js` no Dashboard
- [ ] Clicado em "Use Project Settings" quando aparecer o aviso
- [ ] Variáveis de ambiente configuradas (SUPABASE_URL, SUPABASE_KEY)
- [ ] Novo deploy realizado

---

**Agora deve funcionar sem conflitos! ✅**

