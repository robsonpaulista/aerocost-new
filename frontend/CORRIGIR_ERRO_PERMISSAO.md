# 🔧 Corrigir Erro de Permissão do Firestore

## ❌ Erro Atual

```
Missing or insufficient permissions
code: 'permission-denied'
```

## 🔍 Causa

As regras do Firestore estão bloqueando **todo acesso**, incluindo o acesso do servidor (API Routes). 

**Importante**: No Next.js, mesmo as API Routes que rodam no servidor usam o **Firebase Client SDK**, que é considerado "cliente" pelas regras do Firestore.

## ✅ Solução

### Opção 1: Permitir Acesso Temporário (Para Desenvolvimento)

Como sua aplicação usa API Routes (server-side) e faz validações no servidor, você pode permitir acesso enquanto desenvolve:

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: **aerocost-faa76**
3. Vá em **Firestore Database** → **Rules**
4. Cole este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita para todas as coleções
    // As validações são feitas no servidor (API Routes)
    match /{document=**} {
      allow read, write: if true;
    }
  }
}
```

5. Clique em **"Publicar"** ou **"Publish"**

⚠️ **Nota**: Esta regra permite acesso total. Para produção, considere usar Firebase Admin SDK (veja Opção 2).

### Opção 2: Usar Firebase Admin SDK (Recomendado para Produção)

Para maior segurança, você pode usar o Firebase Admin SDK nas API Routes, que **não é afetado pelas regras do Firestore**.

**Próximos passos** (se quiser implementar):
1. Instalar `firebase-admin`
2. Configurar credenciais de serviço
3. Usar Admin SDK nas API Routes

## 🚀 Solução Rápida (Agora)

**Use a Opção 1** para resolver o problema imediatamente. Sua aplicação já faz validações no servidor (API Routes), então é relativamente seguro.

## 📝 Arquivo de Regras

O arquivo `REGRAS_FIRESTORE_PERMITIR_API.txt` contém as regras prontas para copiar.

## ✅ Depois de Aplicar

1. A aplicação deve voltar a funcionar
2. Os dados devem ser carregados corretamente
3. Você pode criar/editar aeronaves normalmente

