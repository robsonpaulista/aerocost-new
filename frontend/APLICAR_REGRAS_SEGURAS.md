# 🔒 Aplicar Regras de Segurança do Firestore

## ✅ Solução Recomendada

Sua aplicação usa **API Routes do Next.js** (server-side) para acessar o Firestore, então podemos **bloquear completamente o acesso do cliente** e manter apenas o acesso via servidor.

## 🚀 Como Aplicar

### Passo 1: Copiar as Regras

1. Abra o arquivo `REGRAS_FIRESTORE_SEGURAS.txt` neste projeto
2. Copie todo o conteúdo

### Passo 2: Aplicar no Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: **aerocost-faa76**
3. Vá em **Firestore Database** → **Rules** (Regras)
4. **Delete** todo o conteúdo atual
5. **Cole** o conteúdo do arquivo `REGRAS_FIRESTORE_SEGURAS.txt`
6. Clique em **"Publicar"** ou **"Publish"**

### Passo 3: Verificar

1. O aviso de "regras públicas" deve desaparecer
2. A aplicação deve continuar funcionando normalmente
3. Teste criar uma aeronave para confirmar

## ✅ Por Que Isso Funciona?

- ✅ **API Routes rodam no servidor** - têm acesso ao Firestore com credenciais
- ✅ **Cliente não acessa Firestore diretamente** - usa apenas HTTP para API Routes
- ✅ **Mais seguro** - validações e autenticação no servidor
- ✅ **Sem exposição de dados** - cliente não tem acesso direto ao banco

## 🔍 Como Funciona

```
Cliente (Browser)
    ↓ HTTP Request
API Route (Next.js Server)
    ↓ Firestore SDK (com credenciais)
Firestore Database
```

O cliente **nunca** acessa o Firestore diretamente, apenas faz requisições HTTP para suas API Routes.

## ⚠️ Se Der Erro

Se após aplicar as regras a aplicação parar de funcionar:

1. Verifique se as API Routes estão rodando corretamente
2. Verifique se as credenciais do Firebase estão configuradas
3. Veja os logs do servidor (terminal onde roda `npm run dev`)
4. Se necessário, use temporariamente regras mais permissivas (veja `REGRAS_SEGURANCA_FIRESTORE.md`)

## 📝 Regras Aplicadas

As regras bloqueiam **todo acesso direto do cliente** ao Firestore. Apenas o servidor (API Routes) pode acessar, o que é exatamente o que você precisa.

