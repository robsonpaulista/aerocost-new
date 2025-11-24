'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { getAuthInstance } from '@/lib/config/firebase';
import { userApi, type User } from '@/lib/api';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Obter instância do auth (apenas no cliente)
    const auth = getAuthInstance();
    
    // Monitorar estado de autenticação do Firebase
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser && firebaseUser.email) {
        try {
          // Buscar dados do usuário no Firestore por email usando rota pública
          const userData = await userApi.getByEmail(firebaseUser.email);

          if (userData && userData.is_active) {
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('aeroCost_auth', 'true');
            localStorage.setItem('aeroCost_user', JSON.stringify(userData));
          } else if (userData && !userData.is_active) {
            // Usuário inativo
            await signOut(auth);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('aeroCost_auth');
            localStorage.removeItem('aeroCost_user');
          } else {
            // Usuário não encontrado - manter autenticado temporariamente
            // Criar um usuário temporário com dados do Firebase Auth
            const tempUser = {
              id: firebaseUser.uid,
              name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Usuário',
              email: firebaseUser.email!,
              role: 'user' as const,
              is_active: true,
            };
            setUser(tempUser);
            setIsAuthenticated(true);
            localStorage.setItem('aeroCost_auth', 'true');
            localStorage.setItem('aeroCost_user', JSON.stringify(tempUser));
          }
        } catch (error) {
          // Em caso de erro, não deslogar imediatamente
          // Pode ser um problema temporário de rede
          const savedUser = localStorage.getItem('aeroCost_user');
          if (savedUser) {
            try {
              const userData = JSON.parse(savedUser);
              setUser(userData);
              setIsAuthenticated(true);
            } catch {
              await signOut(auth);
              setUser(null);
              setIsAuthenticated(false);
              localStorage.removeItem('aeroCost_auth');
              localStorage.removeItem('aeroCost_user');
            }
          } else {
            await signOut(auth);
            setUser(null);
            setIsAuthenticated(false);
            localStorage.removeItem('aeroCost_auth');
            localStorage.removeItem('aeroCost_user');
          }
        }
      } else {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('aeroCost_auth');
        localStorage.removeItem('aeroCost_user');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // Obter instância do auth (apenas no cliente)
      const auth = getAuthInstance();
      
      // Autenticar com Firebase Authentication
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Buscar dados do usuário no Firestore por email usando rota pública
      let userData: User | null = null;
      try {
        userData = await userApi.getByEmail(firebaseUser.email);
      } catch (error: any) {
        await signOut(auth);
        return false;
      }

      if (!userData) {
        await signOut(auth);
        return false;
      }

      if (!userData.is_active) {
        await signOut(auth);
        return false;
      }

      // Atualizar último login
      try {
        await userApi.update(userData.id, {});
      } catch {
        // Ignorar erro ao atualizar último login
      }

      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('aeroCost_auth', 'true');
      localStorage.setItem('aeroCost_user', JSON.stringify(userData));
      
      return true;
    } catch (error: any) {
      // Erros do Firebase Authentication
      if (error.code === 'auth/user-not-found' || 
          error.code === 'auth/wrong-password' || 
          error.code === 'auth/invalid-credential') {
        return false;
      }
      
      return false;
    }
  };

  const logout = async () => {
    const auth = getAuthInstance();
    await signOut(auth);
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('aeroCost_auth');
    localStorage.removeItem('aeroCost_user');
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

