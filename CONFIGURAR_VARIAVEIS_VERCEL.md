# ✅ Configurar Variáveis de Ambiente no Vercel

## 🔍 Problema

O build está falhando porque falta a variável `SUPABASE_URL`:
```
❌ Missing Supabase credentials!
SUPABASE_URL: ❌ Missing
SUPABASE_KEY: ✅ Set
```

## ✅ Solução: Adicionar Variáveis no Vercel

### Passo a Passo:

1. **Acesse o Vercel Dashboard**:
   - https://vercel.com/dashboard
   - Selecione o projeto `aerocost`

2. **Vá em Settings → Environment Variables**

3. **Adicione as seguintes variáveis**:

   | Nome | Valor | Ambiente |
   |------|-------|----------|
   | `SUPABASE_URL` | `https://seu-projeto.supabase.co` | Production, Preview, Development |
   | `SUPABASE_KEY` | `sua-chave-anon-public` | Production, Preview, Development |
   | `SUPABASE_SERVICE_KEY` | `sua-chave-service-role` | Production, Preview, Development (opcional) |

4. **Para cada variável**:
   - Clique em **"Add New"**
   - Digite o **Name** (ex: `SUPABASE_URL`)
   - Digite o **Value** (sua URL/chave do Supabase)
   - Marque os ambientes: **Production**, **Preview**, **Development**
   - Clique em **"Save"**

5. **Depois de adicionar todas**:
   - Vá em **Deployments**
   - Clique nos **3 pontos** do último deployment
   - **Redeploy** (ou faça um novo commit)

## 🔍 Onde Encontrar as Credenciais do Supabase

1. Acesse: https://supabase.com/dashboard
2. Selecione seu projeto
3. Vá em **Settings** → **API**
4. Você encontrará:
   - **Project URL** → Use como `SUPABASE_URL`
   - **anon public** key → Use como `SUPABASE_KEY`
   - **service_role** key → Use como `SUPABASE_SERVICE_KEY` (opcional)

## ✅ Verificação

Depois de adicionar as variáveis e fazer redeploy, o build deve completar com sucesso!

## 📋 Checklist

- [ ] `SUPABASE_URL` adicionada no Vercel
- [ ] `SUPABASE_KEY` adicionada no Vercel
- [ ] `SUPABASE_SERVICE_KEY` adicionada (opcional)
- [ ] Variáveis disponíveis para Production, Preview e Development
- [ ] Redeploy realizado

---

**Adicione `SUPABASE_URL` no Vercel Dashboard e faça redeploy! ✅**

