# 🔧 Solução: Erro NOT_FOUND ao Criar Aeronave

## ❌ Erro

```
Firestore (12.6.0): GrpcConnection RPC 'Write' stream error. Code: 5 Message: 5 NOT_FOUND
```

## 🔍 Causa

O **Firestore Database não foi criado/habilitado** no seu projeto Firebase.

## ✅ Solução Rápida

### Passo 1: Acesse o Firebase Console

1. Vá para: https://console.firebase.google.com/
2. Faça login
3. Selecione o projeto: **aerocost-faa76**

### Passo 2: Crie o Firestore Database

1. No menu lateral esquerdo, clique em **"Firestore Database"**
2. Se aparecer **"Criar banco de dados"** ou **"Create database"**, clique
3. Escolha **"Modo de produção"** (Production mode)
4. Escolha a localização: **southamerica-east1** (São Paulo) ou a mais próxima
5. Clique em **"Criar"** ou **"Create"**

### Passo 3: Configure Regras Temporárias (para Teste)

1. Vá na aba **"Rules"** (Regras)
2. Cole este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

3. Clique em **"Publicar"** ou **"Publish"**

⚠️ **ATENÇÃO**: Esta regra permite acesso total. Configure regras mais restritivas para produção.

### Passo 4: Teste Novamente

1. Volte para a aplicação
2. Tente criar uma aeronave novamente
3. Deve funcionar! ✅

## 📋 Checklist

- [ ] Acessei o Firebase Console
- [ ] Criei o Firestore Database
- [ ] Configurei as regras de segurança
- [ ] Testei criar uma aeronave

## 🆘 Se o Projeto Não Existe

Se o projeto `aerocost-faa76` não aparecer:

1. Clique em **"Adicionar projeto"** ou **"Add project"**
2. Nome: `aerocost-faa76`
3. Siga os passos acima

## 📖 Mais Detalhes

Veja o arquivo `HABILITAR_FIRESTORE.md` para instruções mais detalhadas.

