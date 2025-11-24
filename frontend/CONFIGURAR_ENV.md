# 🔧 Configurar Variáveis de Ambiente

## 📋 Resumo

O projeto **não precisa** de arquivo `.env` para funcionar localmente, pois os valores padrão estão hardcoded no código. Porém, **é recomendado** usar variáveis de ambiente para produção.

## ✅ Para Desenvolvimento Local

### Opção 1: Sem arquivo .env (Funciona imediatamente)
- O código já tem valores padrão configurados
- Basta rodar `npm run dev`
- **Não é necessário criar arquivo .env**

### Opção 2: Com arquivo .env.local (Recomendado)
1. Copie `.env.example` para `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Edite `.env.local` com suas credenciais do Firebase (opcional)

## 🚀 Para Produção (Vercel)

**OBRIGATÓRIO** configurar variáveis de ambiente no Vercel:

1. Acesse: https://vercel.com/dashboard
2. Selecione o projeto
3. Vá em **Settings** → **Environment Variables**
4. Adicione todas as variáveis do Firebase:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
   NEXT_PUBLIC_FIREBASE_PROJECT_ID
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
   NEXT_PUBLIC_FIREBASE_APP_ID
   ```
5. Marque para **Production**, **Preview** e **Development**
6. Faça **Redeploy**

## 📝 Variáveis Disponíveis

Todas as variáveis começam com `NEXT_PUBLIC_` porque são usadas no cliente (browser).

| Variável | Descrição | Obrigatória |
|----------|-----------|-------------|
| `NEXT_PUBLIC_FIREBASE_API_KEY` | API Key do Firebase | Não (tem padrão) |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Auth Domain | Não (tem padrão) |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | ID do Projeto | Não (tem padrão) |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage Bucket | Não (tem padrão) |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging Sender ID | Não (tem padrão) |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | App ID | Não (tem padrão) |

## 🔍 Onde Encontrar as Credenciais

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto: **aerocost-faa76**
3. Vá em **⚙️ Project Settings** → **General**
4. Role até **Your apps** → **Web app**
5. Copie as credenciais do objeto `firebaseConfig`

## ⚠️ Importante

- **Desenvolvimento**: Pode usar valores padrão (hardcoded)
- **Produção**: **SEMPRE** use variáveis de ambiente no Vercel
- O arquivo `.env.local` é ignorado pelo Git (seguro)
- Nunca commite arquivos `.env` com credenciais reais

