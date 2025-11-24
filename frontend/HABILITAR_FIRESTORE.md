# 🔧 Como Habilitar o Firestore no Firebase

## ❌ Erro Atual

```
Firestore (12.6.0): GrpcConnection RPC 'Write' stream error. Code: 5 Message: 5 NOT_FOUND
```

Este erro significa que o **Firestore Database não foi criado/habilitado** no seu projeto Firebase.

## ✅ Solução Passo a Passo

### 1. Acesse o Firebase Console

1. Vá para: https://console.firebase.google.com/
2. Faça login com sua conta Google
3. Selecione o projeto: **aerocost-faa76**

### 2. Crie o Firestore Database

1. No menu lateral, clique em **"Firestore Database"**
2. Se aparecer um botão **"Criar banco de dados"** ou **"Create database"**, clique nele
3. Se não aparecer, o Firestore já pode estar criado (pule para o passo 3)

### 3. Configure o Modo de Produção

1. Escolha o **modo de produção** (Production mode)
2. Escolha a **localização** do banco de dados:
   - Recomendado: **southamerica-east1** (São Paulo) para melhor performance no Brasil
   - Ou escolha a mais próxima da sua região
3. Clique em **"Criar"** ou **"Create"**

### 4. Configure as Regras de Segurança (Temporariamente para Teste)

1. Vá em **"Rules"** (Regras) no Firestore
2. Cole este código (permite leitura/escrita para testes):

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

⚠️ **IMPORTANTE**: Esta regra permite acesso total. Para produção, configure regras mais restritivas depois.

### 5. Verifique se Funcionou

1. Volte para a aplicação
2. Tente criar uma aeronave novamente
3. O erro deve desaparecer

## 🔍 Verificar se o Firestore Está Habilitado

No Firebase Console, você deve ver:
- ✅ Menu "Firestore Database" no menu lateral
- ✅ Uma interface mostrando "No documents yet" ou documentos existentes
- ✅ Abas: "Data", "Indexes", "Rules", "Usage"

## 📝 Se o Projeto Não Existe

Se o projeto `aerocost-faa76` não existir:

1. Clique em **"Adicionar projeto"** ou **"Add project"**
2. Nome do projeto: `aerocost-faa76`
3. Siga os passos acima para criar o Firestore

## ⚠️ Se as Credenciais Estão Diferentes

Se você criou um projeto com nome diferente, atualize o arquivo `frontend/lib/config/firebase.ts` com as credenciais corretas do seu projeto.

## ✅ Depois de Habilitar

Após habilitar o Firestore:
1. As coleções serão criadas automaticamente quando você criar o primeiro registro
2. Não precisa criar tabelas/coleções manualmente
3. A aplicação deve funcionar normalmente

