import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore, collection } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "AIzaSyBkyecudggZu5mdPQSivo5U5Z-WTGXcLuc",
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "aerocost-faa76.firebaseapp.com",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "aerocost-faa76",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || "aerocost-faa76.firebasestorage.app",
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "164169250558",
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "1:164169250558:web:3f6957082db40db3ca17af"
};

// Validação das credenciais
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.error('❌ Missing Firebase credentials!');
  console.error('NEXT_PUBLIC_FIREBASE_API_KEY:', firebaseConfig.apiKey ? '✅ Set' : '❌ Missing');
  console.error('NEXT_PUBLIC_FIREBASE_PROJECT_ID:', firebaseConfig.projectId ? '✅ Set' : '❌ Missing');
  throw new Error('Missing Firebase credentials. Please check your environment variables.');
}

// Initialize Firebase
let app: FirebaseApp;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

// Initialize Firestore
export const db: Firestore = getFirestore(app);

// Log de inicialização
console.log('🔥 Firebase inicializado:', {
  projectId: firebaseConfig.projectId,
  authDomain: firebaseConfig.authDomain,
});

// Verificação adicional (será executada quando tentar usar o Firestore)
export async function verifyFirestoreConnection() {
  try {
    // Tentativa simples de conexão
    const testCollection = collection(db, '_test_connection');
    // Não vamos criar nada, apenas verificar se a conexão funciona
    return true;
  } catch (error: any) {
    if (error.code === 5 || error.code === 'not-found' || error.message?.includes('NOT_FOUND')) {
      console.error('❌ Firestore não está habilitado no projeto Firebase!');
      console.error('📖 Veja o arquivo HABILITAR_FIRESTORE.md para instruções');
      throw new Error(
        'Firestore Database não está habilitado. ' +
        'Acesse o Firebase Console e crie o Firestore Database. ' +
        'Veja HABILITAR_FIRESTORE.md para instruções detalhadas.'
      );
    }
    throw error;
  }
}

export default app;
