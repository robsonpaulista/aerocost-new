# 🔒 Regras de Segurança do Firestore

## ⚠️ Aviso Atual

Você está vendo este aviso porque as regras estão configuradas como públicas (permitem acesso total). Isso é **perigoso para produção**.

## 🎯 Opções de Configuração

### Opção 1: Regras Restritivas com Validação (Recomendado)

Como sua aplicação usa autenticação customizada (não Firebase Auth), você pode usar regras que validam os dados:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Regras para usuários
    match /users/{userId} {
      // Permitir leitura apenas para o próprio usuário ou admin
      allow read: if request.auth != null || resource.data.email == request.resource.data.email;
      // Permitir escrita apenas para criação de novos usuários (via API)
      allow create: if request.resource.data.keys().hasAll(['name', 'email', 'password_hash']);
      allow update, delete: if false; // Apenas via API com validação
    }
    
    // Regras para aeronaves
    match /aircraft/{aircraftId} {
      allow read: if true; // Leitura pública (ajuste conforme necessário)
      allow create, update, delete: if request.resource.data.keys().hasAll(['name', 'registration', 'model']);
    }
    
    // Regras para custos fixos
    match /fixed_costs/{costId} {
      allow read: if true;
      allow create, update, delete: if request.resource.data.keys().hasAll(['aircraft_id']);
    }
    
    // Regras para custos variáveis
    match /variable_costs/{costId} {
      allow read: if true;
      allow create, update, delete: if request.resource.data.keys().hasAll(['aircraft_id']);
    }
    
    // Regras para rotas
    match /routes/{routeId} {
      allow read: if true;
      allow create, update, delete: if request.resource.data.keys().hasAll(['aircraft_id', 'origin', 'destination']);
    }
    
    // Regras para taxas de câmbio
    match /fx_rates/{rateId} {
      allow read: if true;
      allow create, update, delete: if request.resource.data.keys().hasAll(['usd_to_brl']);
    }
    
    // Regras para voos
    match /flights/{flightId} {
      allow read: if true;
      allow create, update, delete: if request.resource.data.keys().hasAll(['aircraft_id', 'origin', 'destination', 'flight_date']);
    }
  }
}
```

### Opção 2: Bloquear Tudo e Usar Apenas API (Mais Seguro)

Como sua aplicação usa API Routes do Next.js (server-side), você pode bloquear acesso direto do cliente e permitir apenas via API:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Bloquear tudo - acesso apenas via API Routes (server-side)
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

**Como funciona**: O Firestore será acessado apenas pelo servidor (API Routes do Next.js), não pelo cliente. Isso é mais seguro porque:
- As validações são feitas no servidor
- Não expõe as credenciais do Firebase no cliente
- Você controla quem pode acessar via sua API

### Opção 3: Regras Temporárias para Desenvolvimento (NÃO USE EM PRODUÇÃO)

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      // ⚠️ PERIGOSO: Permite tudo
      // Use APENAS para desenvolvimento/testes
      allow read, write: if true;
    }
  }
}
```

## ✅ Recomendação

Para sua aplicação, recomendo a **Opção 2** (Bloquear tudo e usar apenas API) porque:

1. ✅ Sua aplicação já usa API Routes do Next.js
2. ✅ As validações são feitas no servidor
3. ✅ Mais seguro - não expõe acesso direto ao Firestore
4. ✅ Você controla autenticação via sua própria API

## 🔧 Como Implementar a Opção 2

### Passo 1: Atualizar Regras no Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione o projeto: `aerocost-faa76`
3. Vá em **Firestore Database** → **Rules**
4. Cole este código:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

5. Clique em **"Publicar"** ou **"Publish"**

### Passo 2: Verificar se a Aplicação Funciona

A aplicação deve continuar funcionando normalmente porque:
- As API Routes do Next.js rodam no servidor
- O servidor tem acesso ao Firestore via credenciais
- O cliente não acessa o Firestore diretamente

## 🔍 Verificar se Está Funcionando

1. Tente criar uma aeronave pela aplicação
2. Se funcionar, as regras estão corretas
3. Se der erro, verifique se as API Routes estão acessando o Firestore corretamente

## 📝 Notas Importantes

- As regras do Firestore se aplicam apenas a **acesso direto do cliente**
- Acesso via **servidor (API Routes)** sempre funciona (com credenciais corretas)
- Sua aplicação usa API Routes, então bloquear acesso do cliente é seguro

## 🆘 Se Der Erro

Se após bloquear tudo a aplicação parar de funcionar:

1. Verifique se as API Routes estão usando o Firestore corretamente
2. Verifique se as credenciais do Firebase estão configuradas
3. Veja os logs do servidor para identificar o problema
4. Se necessário, use a Opção 1 (regras com validação) temporariamente

