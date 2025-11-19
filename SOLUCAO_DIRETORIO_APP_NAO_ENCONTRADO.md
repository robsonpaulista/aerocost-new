# 🔧 Solução: Diretório `app` não encontrado no Vercel

## ❌ Erro

```
Error: > Couldn't find any `pages` or `app` directory. Please create one under the project root
```

## 🔍 Causa

O Vercel está procurando o diretório `app` dentro do `frontend`, mas pode estar havendo um problema com:
1. A estrutura de diretórios no Git
2. O Root Directory configurado no Vercel
3. Arquivos não commitados

## ✅ Verificação

Os arquivos estão no Git:
- ✅ `frontend/app/page.tsx` - Existe
- ✅ `frontend/app/layout.tsx` - Existe
- ✅ `frontend/package.json` - Existe
- ✅ `frontend/next.config.js` - Existe

## 🔧 Solução

### Opção 1: Verificar Root Directory no Vercel

1. Acesse: https://vercel.com/dashboard
2. Vá no projeto **frontend**
3. **Settings** → **General**
4. Verifique se **Root Directory** está configurado como: `frontend`
5. Se não estiver, configure e faça **Redeploy**

### Opção 2: Limpar Cache e Redeploy

1. No Vercel Dashboard, vá em **Deployments**
2. Clique nos três pontos do último deployment
3. Selecione **Redeploy**
4. Marque a opção **"Use existing Build Cache"** como **desmarcada**
5. Clique em **Redeploy**

### Opção 3: Verificar Estrutura no GitHub

1. Acesse: https://github.com/robsonpaulista/aerocost
2. Navegue até: `frontend/app/`
3. Verifique se os arquivos aparecem corretamente
4. Se não aparecerem, pode ser necessário fazer push novamente

### Opção 4: Recriar Projeto no Vercel

Se nada funcionar:

1. **Delete o projeto** no Vercel (Settings → Delete Project)
2. **Crie um novo projeto**
3. Importe o mesmo repositório: `robsonpaulista/aerocost`
4. **Configure:**
   - Root Directory: `frontend`
   - Framework: Next.js
5. **Variáveis de Ambiente:**
   ```
   NEXT_PUBLIC_API_URL=https://aerocost-api.vercel.app/api
   ```
6. **Deploy**

## 📋 Checklist

- [ ] Root Directory = `frontend` no Vercel
- [ ] Arquivos `frontend/app/` existem no GitHub
- [ ] `frontend/package.json` existe no GitHub
- [ ] `frontend/next.config.js` existe no GitHub
- [ ] Cache limpo no redeploy
- [ ] Variáveis de ambiente configuradas

## ⚠️ Importante

O erro pode ocorrer se:
- O Root Directory estiver vazio ou incorreto
- Os arquivos não estiverem commitados no Git
- O cache do Vercel estiver desatualizado

---

**Tente primeiro a Opção 1 e 2. Se não funcionar, use a Opção 4.**

