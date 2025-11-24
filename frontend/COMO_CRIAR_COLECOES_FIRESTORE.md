# 📚 Como Funcionam as Coleções no Firestore

## 🔍 Resposta Rápida

**No Firestore, as coleções (equivalente a "tabelas" no SQL) são criadas AUTOMATICAMENTE quando você insere o primeiro documento!**

Você **NÃO precisa criar as coleções manualmente** antes de usar.

## 📦 Coleções que Serão Criadas Automaticamente

Quando você usar a aplicação pela primeira vez, estas coleções serão criadas automaticamente:

1. **`users`** - Quando criar o primeiro usuário
2. **`aircraft`** - Quando criar a primeira aeronave
3. **`fixed_costs`** - Quando salvar custos fixos de uma aeronave
4. **`variable_costs`** - Quando salvar custos variáveis de uma aeronave
5. **`routes`** - Quando criar a primeira rota
6. **`fx_rates`** - Quando criar a primeira taxa de câmbio
7. **`flights`** - Quando criar o primeiro voo

## 🚀 Como Começar

### Opção 1: Começar do Zero (Recomendado se não tem dados no Supabase)

1. **Inicie a aplicação**:
   ```bash
   cd frontend
   npm run dev
   ```

2. **Acesse a aplicação** e comece a usar:
   - Faça login (crie um usuário se necessário)
   - Crie uma aeronave
   - Configure custos fixos e variáveis
   - As coleções serão criadas automaticamente!

### Opção 2: Migrar Dados do Supabase (Se você tem dados existentes)

1. **Configure temporariamente as variáveis do Supabase**:
   ```bash
   cd frontend
   # Crie um arquivo .env.migration (temporário)
   echo "SUPABASE_URL=sua_url_aqui" > .env.migration
   echo "SUPABASE_KEY=sua_key_aqui" >> .env.migration
   ```

2. **Instale a dependência do Supabase temporariamente**:
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Execute o script de migração**:
   ```bash
   npx ts-node scripts/migrate-to-firestore.ts
   ```

4. **Remova a dependência do Supabase** (se não precisar mais):
   ```bash
   npm uninstall @supabase/supabase-js
   ```

## 📊 Estrutura das Coleções

### `users`
```typescript
{
  name: string;
  email: string;
  password_hash: string;
  role: 'admin' | 'user';
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}
```

### `aircraft`
```typescript
{
  name: string;
  registration: string;
  model: string;
  monthly_hours: number;
  avg_leg_time: number;
  created_at: string;
  updated_at: string;
}
```

### `fixed_costs`
```typescript
{
  aircraft_id: string;
  crew_monthly: number;
  pilot_hourly_rate: number;
  hangar_monthly: number;
  ec_fixed_usd: number;
  insurance: number;
  administration: number;
  created_at: string;
  updated_at: string;
}
```

### `variable_costs`
```typescript
{
  aircraft_id: string;
  fuel_liters_per_hour: number;
  fuel_consumption_km_per_l: number;
  fuel_price_per_liter: number;
  ec_variable_usd: number;
  ru_per_leg: number;
  ccr_per_leg: number;
  created_at: string;
  updated_at: string;
}
```

### `routes`
```typescript
{
  aircraft_id: string;
  origin: string;
  destination: string;
  decea_per_hour: number;
  created_at: string;
  updated_at: string;
}
```

### `fx_rates`
```typescript
{
  usd_to_brl: number;
  effective_date: string;
  created_at: string;
  updated_at: string;
}
```

### `flights`
```typescript
{
  aircraft_id: string;
  route_id?: string | null;
  flight_type: 'planned' | 'completed';
  origin: string;
  destination: string;
  flight_date: string;
  leg_time: number;
  actual_leg_time?: number | null;
  cost_calculated?: number | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
}
```

## 🔍 Verificar Coleções no Firebase Console

1. Acesse: https://console.firebase.google.com/
2. Selecione seu projeto: `aerocost-faa76`
3. Vá em **Firestore Database**
4. Você verá as coleções criadas automaticamente

## ⚠️ Índices do Firestore

Algumas queries podem precisar de índices compostos. O Firestore mostrará um erro com um link para criar o índice automaticamente quando necessário.

**Índices recomendados** (criar no Firebase Console se necessário):

1. **fixed_costs**: `aircraft_id` (Ascending)
2. **variable_costs**: `aircraft_id` (Ascending)
3. **routes**: `aircraft_id` (Ascending) + `created_at` (Descending)
4. **flights**: 
   - `aircraft_id` (Ascending) + `flight_date` (Descending)
   - `aircraft_id` (Ascending) + `flight_type` (Ascending) + `flight_date` (Descending)
5. **fx_rates**: `effective_date` (Descending)
6. **users**: `email` (Ascending)

## ✅ Resumo

- ✅ **Não precisa criar coleções manualmente** - são criadas automaticamente
- ✅ **Basta usar a aplicação** - as coleções aparecerão no Firebase Console
- ✅ **Se tiver dados no Supabase**, use o script de migração
- ✅ **Se não tiver dados**, comece a usar normalmente!

