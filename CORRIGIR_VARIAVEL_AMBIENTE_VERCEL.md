# 🔧 Corrigir: Frontend ainda usando URL do backend antigo

## ❌ Problema

O frontend está tentando acessar `https://aerocost-api.vercel.app/api` (backend antigo deletado) em vez de usar `/api` (caminho relativo no mesmo projeto).

## ✅ Solução Aplicada

1. **Código atualizado** (`frontend/lib/api.ts`):
   - Agora **prioriza a detecção do Vercel** sobre a variável de ambiente
   - Quando detecta `vercel.app` ou `vercel.sh`, **sempre usa `/api`** (caminho relativo)
   - Ignora a variável `NEXT_PUBLIC_API_URL` quando está no Vercel

2. **next.config.js atualizado**:
   - Removido o fallback da variável de ambiente
   - Deixa a detecção automática funcionar

## 📋 Ação Necessária no Vercel

Você precisa **remover ou atualizar** a variável de ambiente no Vercel:

### Opção 1: Remover a variável (Recomendado)

1. Acesse: https://vercel.com/dashboard
2. Vá no projeto do frontend
3. **Settings** → **Environment Variables**
4. Procure por `NEXT_PUBLIC_API_URL`
5. **Delete** essa variável
6. Faça **Redeploy**

### Opção 2: Atualizar para caminho relativo

1. Acesse: https://vercel.com/dashboard
2. Vá no projeto do frontend
3. **Settings** → **Environment Variables**
4. Procure por `NEXT_PUBLIC_API_URL`
5. **Edite** e mude o valor para: `/api`
6. Salve e faça **Redeploy**

## 🚀 Após Corrigir

1. Faça commit e push das mudanças no código:
   ```bash
   git add frontend/lib/api.ts frontend/next.config.js
   git commit -m "fix: priorizar detecção do Vercel sobre variável de ambiente"
   git push origin main
   ```

2. No Vercel Dashboard, **remova ou atualize** `NEXT_PUBLIC_API_URL`

3. Faça **Redeploy** do projeto

4. Teste novamente - o frontend deve usar `/api` (caminho relativo)

## ✅ Como Funciona Agora

- **No Vercel**: Detecta automaticamente e usa `/api` (mesmo domínio)
- **Em localhost**: Usa `http://localhost:3000/api`
- **Em rede local**: Usa `http://[hostname]:3000/api`
- **Variável de ambiente**: Só é usada se não estiver no Vercel

---

**O código já está corrigido. Só falta remover/atualizar a variável no Vercel! 🎯**

