/**
 * Script para criar usuários provisórios de implantação no Firestore
 * 
 * Uso:
 * 1. Edite os usuários abaixo conforme necessário
 * 2. Execute: npx ts-node scripts/create-provisioning-users.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';
import bcrypt from 'bcryptjs';

// Configuração do Firebase (use as mesmas variáveis de ambiente)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyDummyKey",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "dummy.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "dummy-project",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "dummy.appspot.com",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:123456789:web:dummy"
};

// CONFIGURE OS USUÁRIOS PROVISÓRIOS AQUI:
const PROVISIONING_USERS = [
  {
    name: 'Robson Medeiros',
    email: 'robsonpaulista@hotmail.com',
    password: 'admin123', // ⚠️ ALTERE ESTA SENHA APÓS O PRIMEIRO LOGIN!
    role: 'admin' as const,
    is_active: true
  },
  // Adicione mais usuários se necessário:
  // {
  //   name: 'Usuário Teste',
  //   email: 'teste@exemplo.com',
  //   password: 'senha123',
  //   role: 'user' as const,
  //   is_active: true
  // }
];

async function createProvisioningUsers() {
  try {
    console.log('🚀 Criando usuários provisórios de implantação...\n');
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    let created = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const userData of PROVISIONING_USERS) {
      try {
        // Verificar se usuário já existe
        const q = query(
          collection(db, 'users'),
          where('email', '==', userData.email)
        );
        
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          console.log(`⏭️  Usuário ${userData.email} já existe, pulando...`);
          skipped++;
          continue;
        }
        
        // Gerar hash da senha usando bcrypt
        console.log(`🔐 Gerando hash para ${userData.email}...`);
        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(userData.password, salt);
        
        // Criar usuário no Firestore
        const docRef = doc(collection(db, 'users'));
        const now = new Date().toISOString();
        
        await setDoc(docRef, {
          name: userData.name,
          email: userData.email,
          password_hash,
          role: userData.role,
          is_active: userData.is_active,
          last_login: null,
          created_at: now,
          updated_at: now,
        });
        
        console.log(`✅ Usuário criado: ${userData.email}`);
        console.log(`   Nome: ${userData.name}`);
        console.log(`   Role: ${userData.role}`);
        console.log(`   Senha: ${userData.password} ⚠️ ALTERE APÓS O PRIMEIRO LOGIN!\n`);
        created++;
      } catch (error: any) {
        console.error(`❌ Erro ao criar usuário ${userData.email}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n📊 Resumo:');
    console.log(`   ✅ Criados: ${created}`);
    console.log(`   ⏭️  Pulados: ${skipped}`);
    console.log(`   ❌ Erros: ${errors}`);
    
    if (created > 0) {
      console.log('\n⚠️  IMPORTANTE: Altere as senhas após o primeiro login!');
    }
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro geral:', error.message);
    process.exit(1);
  }
}

createProvisioningUsers();

