# ✅ Configuração Simples do Vercel - Next.js API Routes

## 🎯 Situação Atual

Agora que migramos para **Next.js API Routes**, não precisamos mais do Express separado nem de `vercel.json` complexo.

## 📋 Configuração no Vercel Dashboard

### Passo a Passo:

1. **Acesse**: https://vercel.com/dashboard
2. **Selecione seu projeto**
3. **Settings** → **General**

### Configurações:

- ✅ **Root Directory**: `frontend`
- ✅ **Framework Preset**: `Next.js` (ou deixe auto-detect)
- ✅ **Build Command**: Deixe vazio (auto-detecta `npm run build`)
- ✅ **Output Directory**: Deixe vazio (auto-detecta `.next`)
- ✅ **Install Command**: Deixe vazio (auto-detecta `npm install`)

### ⚠️ IMPORTANTE:

**NÃO configure nada no "Configuration" se aparecer o erro:**
> "Configuration Settings in the current Production deployment differ from your current Project Settings"

**Solução:**
1. Deixe **TUDO** como padrão/auto-detect
2. Configure **APENAS** o Root Directory = `frontend`
3. Se aparecer o erro, clique em **"Use Project Settings"** ou **"Discard"** para descartar configurações antigas

## 🔧 Variáveis de Ambiente

No Vercel Dashboard → Settings → Environment Variables:

Adicione:
- `SUPABASE_URL` = sua URL do Supabase
- `SUPABASE_KEY` = sua chave anon/public do Supabase
- `SUPABASE_SERVICE_KEY` = sua chave service-role (opcional, mas recomendado)

## ✅ Como Funciona Agora

- **Next.js**: Detectado automaticamente quando Root Directory = `frontend`
- **API Routes**: Funcionam automaticamente em `/api/*`
- **Sem Express separado**: Tudo dentro do Next.js
- **Sem vercel.json**: Não precisa mais!

## 🚀 Próximos Passos

1. **Remova o `vercel.json` da raiz** (se ainda existir)
2. **Configure apenas Root Directory = `frontend`** no Dashboard
3. **Adicione variáveis de ambiente**
4. **Faça um novo deploy**

## 🔍 Se o Erro Persistir

Se ainda aparecer o erro de configuração:

1. **Delete o deployment atual** (ou ignore o aviso)
2. **Faça um novo deploy** com as configurações corretas
3. **Ou**: Vá em Settings → General → **"Reset Configuration"** (se disponível)

---

**Agora está simples: apenas Next.js, sem configurações complexas! ✅**

