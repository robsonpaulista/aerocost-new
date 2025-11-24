# ✅ Migração Completa: Supabase → Firestore + Remoção de Backend Separado

## 🎯 O que foi feito

### 1. ✅ Migração do Supabase para Firestore
- Todos os modelos (`User`, `Aircraft`, `FixedCost`, `VariableCost`, `Route`, `FxRate`, `Flight`) agora usam Firestore
- Configuração do Firebase em `lib/config/firebase.ts`
- Removida dependência `@supabase/supabase-js`
- Adicionada dependência `firebase`

### 2. ✅ Remoção do Backend Separado
- **Antes**: Backend Express separado em `src/` + `api/`
- **Agora**: Tudo funciona com Next.js API Routes em `app/api/`
- `frontend/lib/api.ts` agora usa **sempre** `/api` (caminho relativo)
- Não precisa mais de backend separado - tudo em um único processo Next.js

### 3. ✅ Estrutura Final
```
frontend/
├── app/
│   ├── api/              # API Routes do Next.js (substitui backend Express)
│   ├── aircraft/          # Páginas de aeronaves
│   ├── login/             # Página de login
│   └── ...
├── lib/
│   ├── config/
│   │   └── firebase.ts    # Configuração do Firebase
│   ├── models/            # Modelos usando Firestore
│   ├── services/          # Serviços
│   └── api.ts             # Cliente API (usa /api)
└── ...
```

## 📦 Dependências

### ✅ Adicionadas
- `firebase` - Cliente Firestore

### ❌ Removidas
- `@supabase/supabase-js` - Não é mais necessário

## 🔧 Configuração

### Variáveis de Ambiente
Crie um arquivo `.env.local` na pasta `frontend/`:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

**Nota**: O arquivo `lib/config/firebase.ts` tem valores padrão (fallback) para desenvolvimento local, mas é recomendado usar variáveis de ambiente em produção.

## 🚀 Como Funciona Agora

1. **Frontend**: Páginas React em `app/`
2. **API**: API Routes do Next.js em `app/api/` (serverless functions)
3. **Banco de Dados**: Firestore (NoSQL)
4. **Tudo em um único processo Next.js** - sem backend separado!

## 📝 Próximos Passos

1. ✅ Build completo e funcionando
2. ⏳ Testar localmente: `npm run dev`
3. ⏳ Configurar variáveis de ambiente no Vercel
4. ⏳ Fazer deploy no Vercel
5. ⏳ (Opcional) Remover pastas antigas: `src/`, `api/`, `package.json` (raiz)

## ⚠️ Pastas que podem ser removidas (após confirmar que tudo funciona)

- `src/` - Backend Express antigo (não é mais usado)
- `api/` - Handler do Vercel para backend Express (não é mais usado)
- `package.json` (raiz) - Dependências do backend Express (não é mais usado)

**Importante**: Só remova essas pastas depois de confirmar que tudo está funcionando corretamente!

