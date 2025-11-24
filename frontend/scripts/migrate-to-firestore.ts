/**
 * Script de Migração: Supabase → Firestore
 * 
 * Este script migra dados do Supabase para o Firestore.
 * 
 * IMPORTANTE: 
 * - Execute apenas UMA VEZ
 * - Faça backup dos dados antes de executar
 * - Verifique se o Firestore está configurado corretamente
 * 
 * Como usar:
 * 1. Configure as variáveis de ambiente do Supabase (temporariamente)
 * 2. Execute: npx ts-node scripts/migrate-to-firestore.ts
 */

import { createClient } from '@supabase/supabase-js';
import { db } from '../lib/config/firebase';
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

// ⚠️ Configure estas variáveis temporariamente para migração
const SUPABASE_URL = process.env.SUPABASE_URL || '';
const SUPABASE_KEY = process.env.SUPABASE_KEY || '';

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error('❌ Configure SUPABASE_URL e SUPABASE_KEY para migração');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

interface MigrationStats {
  users: number;
  aircraft: number;
  fixedCosts: number;
  variableCosts: number;
  routes: number;
  fxRates: number;
  flights: number;
}

async function migrateUsers() {
  console.log('📦 Migrando usuários...');
  const { data, error } = await supabase.from('users').select('*');
  
  if (error) {
    console.error('❌ Erro ao buscar usuários:', error);
    return 0;
  }
  
  if (!data || data.length === 0) {
    console.log('⚠️  Nenhum usuário encontrado no Supabase');
    return 0;
  }
  
  let count = 0;
  for (const user of data) {
    try {
      // Verificar se já existe no Firestore
      const q = query(
        collection(db, 'users'),
        where('email', '==', user.email)
      );
      const existing = await getDocs(q);
      
      if (!existing.empty) {
        console.log(`⏭️  Usuário ${user.email} já existe, pulando...`);
        continue;
      }
      
      const docRef = doc(collection(db, 'users'));
      await setDoc(docRef, {
        name: user.name,
        email: user.email,
        password_hash: user.password_hash, // Manter hash existente
        role: user.role || 'user',
        is_active: user.is_active !== undefined ? user.is_active : true,
        last_login: user.last_login || null,
        created_at: user.created_at || new Date().toISOString(),
        updated_at: user.updated_at || new Date().toISOString(),
      });
      count++;
      console.log(`✅ Usuário migrado: ${user.email}`);
    } catch (err: any) {
      console.error(`❌ Erro ao migrar usuário ${user.email}:`, err.message);
    }
  }
  
  return count;
}

async function migrateAircraft() {
  console.log('📦 Migrando aeronaves...');
  const { data, error } = await supabase.from('aircraft').select('*');
  
  if (error) {
    console.error('❌ Erro ao buscar aeronaves:', error);
    return 0;
  }
  
  if (!data || data.length === 0) {
    console.log('⚠️  Nenhuma aeronave encontrada no Supabase');
    return 0;
  }
  
  let count = 0;
  for (const aircraft of data) {
    try {
      // Verificar se já existe no Firestore
      const q = query(
        collection(db, 'aircraft'),
        where('registration', '==', aircraft.registration)
      );
      const existing = await getDocs(q);
      
      if (!existing.empty) {
        console.log(`⏭️  Aeronave ${aircraft.registration} já existe, pulando...`);
        continue;
      }
      
      const docRef = doc(collection(db, 'aircraft'));
      await setDoc(docRef, {
        name: aircraft.name,
        registration: aircraft.registration,
        model: aircraft.model,
        monthly_hours: aircraft.monthly_hours || 0,
        avg_leg_time: aircraft.avg_leg_time || 0,
        created_at: aircraft.created_at || new Date().toISOString(),
        updated_at: aircraft.updated_at || new Date().toISOString(),
      });
      count++;
      console.log(`✅ Aeronave migrada: ${aircraft.registration}`);
    } catch (err: any) {
      console.error(`❌ Erro ao migrar aeronave ${aircraft.registration}:`, err.message);
    }
  }
  
  return count;
}

async function migrateFixedCosts() {
  console.log('📦 Migrando custos fixos...');
  const { data, error } = await supabase.from('fixed_costs').select('*');
  
  if (error) {
    console.error('❌ Erro ao buscar custos fixos:', error);
    return 0;
  }
  
  if (!data || data.length === 0) {
    console.log('⚠️  Nenhum custo fixo encontrado no Supabase');
    return 0;
  }
  
  let count = 0;
  for (const cost of data) {
    try {
      const docRef = doc(collection(db, 'fixed_costs'));
      await setDoc(docRef, {
        aircraft_id: cost.aircraft_id,
        crew_monthly: cost.crew_monthly || 0,
        pilot_hourly_rate: cost.pilot_hourly_rate || 0,
        hangar_monthly: cost.hangar_monthly || 0,
        ec_fixed_usd: cost.ec_fixed_usd || 0,
        insurance: cost.insurance || 0,
        administration: cost.administration || 0,
        created_at: cost.created_at || new Date().toISOString(),
        updated_at: cost.updated_at || new Date().toISOString(),
      });
      count++;
    } catch (err: any) {
      console.error(`❌ Erro ao migrar custo fixo:`, err.message);
    }
  }
  
  return count;
}

async function migrateVariableCosts() {
  console.log('📦 Migrando custos variáveis...');
  const { data, error } = await supabase.from('variable_costs').select('*');
  
  if (error) {
    console.error('❌ Erro ao buscar custos variáveis:', error);
    return 0;
  }
  
  if (!data || data.length === 0) {
    console.log('⚠️  Nenhum custo variável encontrado no Supabase');
    return 0;
  }
  
  let count = 0;
  for (const cost of data) {
    try {
      const docRef = doc(collection(db, 'variable_costs'));
      await setDoc(docRef, {
        aircraft_id: cost.aircraft_id,
        fuel_liters_per_hour: cost.fuel_liters_per_hour || 0,
        fuel_consumption_km_per_l: cost.fuel_consumption_km_per_l || 0,
        fuel_price_per_liter: cost.fuel_price_per_liter || 0,
        ec_variable_usd: cost.ec_variable_usd || 0,
        ru_per_leg: cost.ru_per_leg || 0,
        ccr_per_leg: cost.ccr_per_leg || 0,
        created_at: cost.created_at || new Date().toISOString(),
        updated_at: cost.updated_at || new Date().toISOString(),
      });
      count++;
    } catch (err: any) {
      console.error(`❌ Erro ao migrar custo variável:`, err.message);
    }
  }
  
  return count;
}

async function migrateRoutes() {
  console.log('📦 Migrando rotas...');
  const { data, error } = await supabase.from('routes').select('*');
  
  if (error) {
    console.error('❌ Erro ao buscar rotas:', error);
    return 0;
  }
  
  if (!data || data.length === 0) {
    console.log('⚠️  Nenhuma rota encontrada no Supabase');
    return 0;
  }
  
  let count = 0;
  for (const route of data) {
    try {
      const docRef = doc(collection(db, 'routes'));
      await setDoc(docRef, {
        aircraft_id: route.aircraft_id,
        origin: route.origin,
        destination: route.destination,
        decea_per_hour: route.decea_per_hour || 0,
        created_at: route.created_at || new Date().toISOString(),
        updated_at: route.updated_at || new Date().toISOString(),
      });
      count++;
    } catch (err: any) {
      console.error(`❌ Erro ao migrar rota:`, err.message);
    }
  }
  
  return count;
}

async function migrateFxRates() {
  console.log('📦 Migrando taxas de câmbio...');
  const { data, error } = await supabase.from('fx_rates').select('*').order('effective_date', { ascending: false });
  
  if (error) {
    console.error('❌ Erro ao buscar taxas de câmbio:', error);
    return 0;
  }
  
  if (!data || data.length === 0) {
    console.log('⚠️  Nenhuma taxa de câmbio encontrada no Supabase');
    return 0;
  }
  
  let count = 0;
  for (const rate of data) {
    try {
      const docRef = doc(collection(db, 'fx_rates'));
      await setDoc(docRef, {
        usd_to_brl: rate.usd_to_brl || 0,
        effective_date: rate.effective_date || new Date().toISOString().split('T')[0],
        created_at: rate.created_at || new Date().toISOString(),
        updated_at: rate.updated_at || new Date().toISOString(),
      });
      count++;
    } catch (err: any) {
      console.error(`❌ Erro ao migrar taxa de câmbio:`, err.message);
    }
  }
  
  return count;
}

async function migrateFlights() {
  console.log('📦 Migrando voos...');
  const { data, error } = await supabase.from('flights').select('*');
  
  if (error) {
    console.error('❌ Erro ao buscar voos:', error);
    return 0;
  }
  
  if (!data || data.length === 0) {
    console.log('⚠️  Nenhum voo encontrado no Supabase');
    return 0;
  }
  
  let count = 0;
  for (const flight of data) {
    try {
      const docRef = doc(collection(db, 'flights'));
      await setDoc(docRef, {
        aircraft_id: flight.aircraft_id,
        route_id: flight.route_id || null,
        flight_type: flight.flight_type || 'planned',
        origin: flight.origin,
        destination: flight.destination,
        flight_date: flight.flight_date,
        leg_time: flight.leg_time || 0,
        actual_leg_time: flight.actual_leg_time || null,
        cost_calculated: flight.cost_calculated || null,
        notes: flight.notes || null,
        created_at: flight.created_at || new Date().toISOString(),
        updated_at: flight.updated_at || new Date().toISOString(),
      });
      count++;
    } catch (err: any) {
      console.error(`❌ Erro ao migrar voo:`, err.message);
    }
  }
  
  return count;
}

async function main() {
  console.log('🚀 Iniciando migração Supabase → Firestore...\n');
  
  const stats: MigrationStats = {
    users: 0,
    aircraft: 0,
    fixedCosts: 0,
    variableCosts: 0,
    routes: 0,
    fxRates: 0,
    flights: 0,
  };
  
  try {
    stats.users = await migrateUsers();
    stats.aircraft = await migrateAircraft();
    stats.fixedCosts = await migrateFixedCosts();
    stats.variableCosts = await migrateVariableCosts();
    stats.routes = await migrateRoutes();
    stats.fxRates = await migrateFxRates();
    stats.flights = await migrateFlights();
    
    console.log('\n✅ Migração concluída!');
    console.log('\n📊 Estatísticas:');
    console.log(`   - Usuários: ${stats.users}`);
    console.log(`   - Aeronaves: ${stats.aircraft}`);
    console.log(`   - Custos Fixos: ${stats.fixedCosts}`);
    console.log(`   - Custos Variáveis: ${stats.variableCosts}`);
    console.log(`   - Rotas: ${stats.routes}`);
    console.log(`   - Taxas de Câmbio: ${stats.fxRates}`);
    console.log(`   - Voos: ${stats.flights}`);
    
  } catch (error: any) {
    console.error('\n❌ Erro durante migração:', error);
    process.exit(1);
  }
}

main();

