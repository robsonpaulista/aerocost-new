/**
 * Script para resetar senha de um usuário no Firestore
 * 
 * Uso:
 * 1. Edite o email e a nova senha abaixo
 * 2. Execute: npx ts-node scripts/reset-user-password.ts
 */

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, where, getDocs, updateDoc, doc } from 'firebase/firestore';
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

// CONFIGURE AQUI:
const USER_EMAIL = 'robsonpaulista@hotmail.com'; // Altere para o email do usuário
const NEW_PASSWORD = 'sua_nova_senha_aqui'; // Altere para a nova senha desejada

async function resetPassword() {
  try {
    console.log('🔐 Iniciando reset de senha...');
    console.log('📧 Email:', USER_EMAIL);
    
    // Inicializar Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    // Buscar usuário por email
    const q = query(
      collection(db, 'users'),
      where('email', '==', USER_EMAIL)
    );
    
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error('❌ Usuário não encontrado com email:', USER_EMAIL);
      process.exit(1);
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    console.log('✅ Usuário encontrado:', userData.name);
    console.log('🔄 Gerando novo hash da senha...');
    
    // Gerar novo hash da senha usando bcrypt
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(NEW_PASSWORD, salt);
    
    // Atualizar no Firestore
    const userRef = doc(db, 'users', userDoc.id);
    await updateDoc(userRef, {
      password_hash,
      updated_at: new Date().toISOString()
    });
    
    console.log('✅ Senha resetada com sucesso!');
    console.log('📝 Agora você pode fazer login com:');
    console.log('   Email:', USER_EMAIL);
    console.log('   Senha:', NEW_PASSWORD);
    
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Erro ao resetar senha:', error.message);
    process.exit(1);
  }
}

resetPassword();




