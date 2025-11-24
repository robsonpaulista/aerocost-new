# AeroCost - Sistema de Controle de Custos Operacionais de Aeronaves

Sistema completo de gerenciamento de custos operacionais de aeronaves, desenvolvido com Next.js e Firestore.

## 🚀 Estrutura do Projeto

Este projeto é uma aplicação **Next.js única** (sem divisão backend/frontend):
- **Frontend**: Next.js com React
- **Backend**: Next.js API Routes
- **Banco de Dados**: Firebase Firestore

## 📁 Estrutura de Pastas

```
frontend/
├── app/              # Next.js App Router (páginas e API routes)
├── components/       # Componentes React
├── lib/              # Utilitários e modelos
│   ├── config/       # Configurações (Firebase)
│   ├── models/       # Modelos de dados (Firestore)
│   └── services/    # Serviços de negócio
├── contexts/         # Contextos React
└── public/           # Arquivos estáticos
```

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **Firebase Firestore** - Banco de dados
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP

## ⚙️ Configuração

### Desenvolvimento Local

1. **Instale as dependências**:
   ```bash
   cd frontend
   npm install
   ```

2. **Inicie o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

3. **Acesse**: http://localhost:3002

### Variáveis de Ambiente

O projeto funciona **sem arquivo .env** localmente (usa valores padrão).

Para produção, configure no Vercel:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

Veja `frontend/CONFIGURAR_ENV.md` para mais detalhes.

## 📚 Documentação

- `frontend/MIGRACAO_FIRESTORE.md` - Guia de migração para Firestore
- `frontend/CONFIGURAR_ENV.md` - Configuração de variáveis de ambiente

## 🚫 Nota Importante

As pastas `src/` e `api/` na raiz são do backend antigo e **não são mais usadas**.
Todo o código está em `frontend/` usando Next.js API Routes.

