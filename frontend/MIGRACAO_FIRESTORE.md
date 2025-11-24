# Migração para Firestore - Concluída ✅

## O que foi feito

1. ✅ Instalado Firebase SDK
2. ✅ Criada configuração do Firebase (`lib/config/firebase.ts`)
3. ✅ Migrados todos os modelos para Firestore:
   - User
   - Aircraft
   - FixedCost
   - VariableCost
   - Route
   - FxRate
   - Flight
4. ✅ Atualizado `dashboardService` para usar modelos Firestore
5. ✅ Removida dependência do Supabase

## Configuração do Firestore

### Coleções necessárias

O Firestore criará as coleções automaticamente quando os dados forem inseridos. As coleções são:

- `users` - Usuários do sistema
- `aircraft` - Aeronaves
- `fixed_costs` - Custos fixos por aeronave
- `variable_costs` - Custos variáveis por aeronave
- `routes` - Rotas de voo
- `fx_rates` - Taxas de câmbio
- `flights` - Voos

### Índices necessários

Algumas queries podem precisar de índices compostos. O Firestore mostrará um erro com um link para criar o índice automaticamente quando necessário.

Índices recomendados (criar no Firebase Console):

1. **fixed_costs**
   - `aircraft_id` (Ascending)

2. **variable_costs**
   - `aircraft_id` (Ascending)

3. **routes**
   - `aircraft_id` (Ascending) + `created_at` (Descending)

4. **flights**
   - `aircraft_id` (Ascending) + `flight_date` (Descending)
   - `aircraft_id` (Ascending) + `flight_type` (Ascending) + `flight_date` (Descending)

5. **fx_rates**
   - `effective_date` (Descending)

6. **users**
   - `email` (Ascending) - para busca por email
   - `created_at` (Descending)

### Regras de Segurança (Firestore Security Rules)

Configure as regras de segurança no Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir leitura/escrita apenas para usuários autenticados
    // Ajuste conforme sua necessidade de autenticação
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
    
    // Ou, se não usar autenticação do Firebase, permitir tudo (NÃO RECOMENDADO PARA PRODUÇÃO)
    // match /{document=**} {
    //   allow read, write: if true;
    // }
  }
}
```

## Diferenças importantes

### Timestamps
- Firestore usa `Timestamp` objects, mas os modelos convertem automaticamente para ISO strings
- `created_at` e `updated_at` são salvos como strings ISO

### Tipos numéricos
- Firestore armazena números como `number` ou `string`
- Os modelos garantem conversão correta para números

### Queries
- Firestore não suporta múltiplos `where` com diferentes campos sem índices compostos
- Algumas queries podem precisar ser ajustadas se houver problemas de performance

## Configuração de Variáveis de Ambiente

### Localmente (Desenvolvimento)

1. **Copie o arquivo `.env.example` para `.env.local`**:
   ```bash
   cd frontend
   cp .env.example .env.local
   ```

2. **Edite `.env.local` com suas credenciais do Firebase**:
   - Acesse: https://console.firebase.google.com/
   - Vá em **Project Settings** → **General** → **Your apps** → **Web app**
   - Copie as credenciais e cole no `.env.local`

3. **Ou use os valores padrão** (já configurados no código):
   - O código tem valores padrão hardcoded que funcionam para desenvolvimento
   - Para produção, **SEMPRE use variáveis de ambiente**

### No Vercel (Produção)

1. **Acesse o Vercel Dashboard**:
   - https://vercel.com/dashboard
   - Selecione o projeto

2. **Vá em Settings → Environment Variables**

3. **Adicione as variáveis do Firebase**:
   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

4. **Marque para todos os ambientes**: Production, Preview, Development

5. **Remova variáveis antigas do Supabase** (se existirem):
   - `SUPABASE_URL`
   - `SUPABASE_KEY`
   - `SUPABASE_SERVICE_KEY`

6. **Faça redeploy** após adicionar as variáveis

## Próximos passos

1. **Testar a aplicação localmente**
   ```bash
   cd frontend
   npm run dev
   ```

2. **Verificar erros de índice no console do Firebase**
   - Se aparecer erro de índice faltando, clique no link fornecido para criar automaticamente

3. **Migrar dados do Supabase para Firestore (se necessário)**
   - Criar script de migração se houver dados existentes no Supabase

## Notas

- A configuração do Firebase está hardcoded no código (`lib/config/firebase.ts`)
- Considere mover para variáveis de ambiente para maior segurança
- O arquivo `lib/config/supabase.ts` ainda existe mas não é mais usado

