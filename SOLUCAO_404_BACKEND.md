# 🔧 Solução: 404 DEPLOYMENT_NOT_FOUND no Backend

## ❌ Erro

```
404: NOT_FOUND
Code: DEPLOYMENT_NOT_FOUND
```

## 🔍 Causa

Este erro geralmente ocorre quando:
1. O projeto backend não foi criado no Vercel
2. O deployment não existe ou foi deletado
3. Há problema com a configuração do Root Directory

## ✅ Solução Passo a Passo

### 1️⃣ Verificar se o Projeto Existe

1. Acesse: https://vercel.com/dashboard
2. Verifique se existe um projeto chamado `aerocost-api` (ou outro nome)
3. Se **NÃO existir**, siga o passo 2
4. Se **existir**, vá para o passo 3

### 2️⃣ Criar Projeto Backend no Vercel

1. No dashboard do Vercel, clique em **"Add New..."** → **"Project"**
2. Importe o repositório: `robsonpaulista/aerocost`
3. **Configure o projeto:**
   - **Project Name:** `aerocost-api` (ou outro nome)
   - **Root Directory:** `.` (raiz, **deixe vazio** ou digite `.`)
   - **Framework Preset:** **Other** ⚠️ **MUITO IMPORTANTE: NÃO ESCOLHA NEXT.JS!**
   - **Build Command:** deixe **vazio**
   - **Output Directory:** deixe **vazio**
   - **Install Command:** `npm install`

4. **Variáveis de Ambiente** (adicione na mesma tela):
   ```
   SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_KEY=sua-chave-anon-public
   SUPABASE_SERVICE_KEY=sua-chave-service-role
   NODE_ENV=production
   CORS_ORIGIN=https://aerocost.vercel.app
   ```
   ⚠️ **Substitua pelos valores reais do seu Supabase!**

5. Clique em **"Deploy"**

### 3️⃣ Se o Projeto Já Existe

1. Vá no projeto `aerocost-api` no dashboard
2. **Settings** → **General**
3. Verifique se:
   - **Root Directory** está como `.` (raiz)
   - Se estiver diferente, altere para `.` e salve
4. **Settings** → **Build and Deployment**
5. Verifique se:
   - **Framework Preset** está como **Other** (não Next.js!)
   - **Build Command** está vazio
   - **Output Directory** está vazio
6. Se algo estiver errado, corrija e salve
7. Vá em **Deployments** → clique nos três pontos do último deployment
8. Selecione **Redeploy** (ou delete e crie um novo)

### 4️⃣ Verificar Arquivos no Git

Certifique-se de que estes arquivos estão no repositório:

- ✅ `package.json` (na raiz)
- ✅ `vercel.json` (na raiz)
- ✅ `api/index.js`
- ✅ `src/server.js`

**Verificar no GitHub:**
1. Acesse: https://github.com/robsonpaulista/aerocost
2. Verifique se os arquivos acima aparecem na raiz do repositório

### 5️⃣ Testar o Deployment

Após o deploy:

1. Vá em **Deployments** no Vercel
2. Clique no deployment mais recente
3. Copie a URL (ex: `https://aerocost-api.vercel.app`)
4. Teste no navegador: `https://aerocost-api.vercel.app/health`
   - Deve retornar: `{"status":"ok",...}`

### 6️⃣ Se Ainda Não Funcionar

**Opção A: Recriar o Projeto**

1. **Delete o projeto** no Vercel (Settings → Delete Project)
2. Crie um novo projeto seguindo o passo 2
3. Configure tudo novamente

**Opção B: Verificar Logs**

1. Vá em **Deployments** → clique no deployment
2. Clique em **View Function Logs**
3. Verifique se há erros nos logs
4. Se houver erros, corrija e faça redeploy

## 📋 Checklist

- [ ] Projeto backend criado no Vercel
- [ ] Root Directory = `.` (raiz)
- [ ] Framework Preset = **Other** (não Next.js!)
- [ ] Build Command = vazio
- [ ] Output Directory = vazio
- [ ] Variáveis de ambiente configuradas
- [ ] Arquivos no Git (`package.json`, `vercel.json`, `api/index.js`, `src/server.js`)
- [ ] Deployment realizado com sucesso
- [ ] `/health` retorna `{"status":"ok"}`

## ⚠️ Erros Comuns

### "Module not found"
- Verifique se o `package.json` está na raiz
- Verifique se o Root Directory está como `.`

### "Environment variables missing"
- Verifique se todas as variáveis foram adicionadas
- Confirme que os nomes estão corretos (case-sensitive)

### "Cannot find module"
- Verifique se o `api/index.js` existe
- Verifique se o `src/server.js` existe

---

**Tente primeiro recriar o projeto seguindo o passo 2!**

