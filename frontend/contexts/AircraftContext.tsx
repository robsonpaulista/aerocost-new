'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { aircraftApi } from '@/lib/api';
import type { Aircraft } from '@/lib/api';

interface AircraftContextType {
  aircrafts: Aircraft[];
  selectedAircraftId: string;
  setSelectedAircraftId: (id: string) => void;
  loading: boolean;
}

const AircraftContext = createContext<AircraftContextType | undefined>(undefined);

// Cache simples para evitar recarregamentos desnecessários
let aircraftsCache: { data: Aircraft[]; timestamp: number } | null = null;
const CACHE_DURATION = 30000; // 30 segundos

export function AircraftProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [aircrafts, setAircrafts] = useState<Aircraft[]>([]);
  const [selectedAircraftId, setSelectedAircraftIdState] = useState<string>('');
  const [loading, setLoading] = useState(true);

  // Carrega aeronaves com cache
  useEffect(() => {
    loadAircrafts();
  }, []);

  // Tenta extrair aircraftId da URL
  useEffect(() => {
    const urlAircraftId = pathname?.match(/\/aircraft\/([^/]+)/)?.[1];
    if (urlAircraftId && urlAircraftId !== selectedAircraftId) {
      setSelectedAircraftIdState(urlAircraftId);
    } else if (!urlAircraftId && aircrafts.length > 0 && !selectedAircraftId && pathname !== '/aircraft/new' && pathname !== '/fx-rates') {
      // Se não há aircraftId na URL e há aeronaves, seleciona a primeira (exceto em páginas que não precisam)
      setSelectedAircraftIdState(aircrafts[0].id);
    }
  }, [pathname, aircrafts.length]);

  const loadAircrafts = async (forceRefresh = false) => {
    try {
      // Verificar cache
      const now = Date.now();
      if (!forceRefresh && aircraftsCache && (now - aircraftsCache.timestamp) < CACHE_DURATION) {
        setAircrafts(aircraftsCache.data);
        setLoading(false);
        return;
      }

      setLoading(true);
      const data = await aircraftApi.list();
      
      // Atualizar cache
      aircraftsCache = { data, timestamp: now };
      
      setAircrafts(data);
      
      // Se não há aeronave selecionada e há aeronaves disponíveis, seleciona a primeira
      if (data.length > 0 && !selectedAircraftId && pathname !== '/aircraft/new' && pathname !== '/fx-rates') {
        const urlAircraftId = pathname?.match(/\/aircraft\/([^/]+)/)?.[1];
        if (urlAircraftId) {
          setSelectedAircraftIdState(urlAircraftId);
        } else if (pathname === '/' || pathname?.startsWith('/aircraft/')) {
          setSelectedAircraftIdState(data[0].id);
        }
      }
    } catch (error) {
      // Em caso de erro, limpar cache
      aircraftsCache = null;
    } finally {
      setLoading(false);
    }
  };

  const setSelectedAircraftId = (id: string) => {
    setSelectedAircraftIdState(id);
    
    // Se estamos em uma página que precisa de aircraftId, atualiza a URL
    if (pathname?.includes('/aircraft/')) {
      const parts = pathname.split('/aircraft/');
      const subPath = parts[1]?.split('/').slice(1).join('/');
      const basePath = '/aircraft/' + id;
      if (subPath) {
        router.push(`${basePath}/${subPath}`);
      } else {
        router.push(basePath);
      }
    } else if (pathname === '/') {
      // Se estamos no dashboard, apenas atualiza o estado (não precisa mudar URL)
      // O dashboard já usa o selectedAircraftId do contexto
    }
  };

  return (
    <AircraftContext.Provider
      value={{
        aircrafts,
        selectedAircraftId,
        setSelectedAircraftId,
        loading,
      }}
    >
      {children}
    </AircraftContext.Provider>
  );
}

export function useAircraft() {
  const context = useContext(AircraftContext);
  if (context === undefined) {
    throw new Error('useAircraft must be used within an AircraftProvider');
  }
  return context;
}

