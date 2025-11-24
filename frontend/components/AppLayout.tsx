'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import {
  Plane,
  Menu,
  X,
  Bell,
  User,
  Home as HomeIcon,
  Plus,
  Wallet,
  DollarSign,
  TrendingUp,
  Route,
  Settings,
  Calendar,
  ChevronDown,
  ChevronRight,
  FileText,
  BarChart3,
  LogOut,
  Users
} from 'lucide-react';
import { useAircraft } from '@/contexts/AircraftContext';
import { useAuth } from '@/contexts/AuthContext';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(true);
  const { aircrafts, selectedAircraftId, setSelectedAircraftId } = useAircraft();
  const { user, logout } = useAuth();

  // Determina o aircraftId atual baseado na URL ou contexto
  const currentAircraftId = selectedAircraftId || 
    (pathname?.match(/\/aircraft\/([^/]+)/)?.[1]) ||
    (aircrafts.length > 0 ? aircrafts[0].id : undefined);

  const isActive = (path: string) => {
    if (path === '/') {
      return pathname === '/';
    }
    return pathname?.startsWith(path);
  };

  return (
    <div className="h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Header com Gradiente Azul */}
      <header className="bg-gradient-to-r from-blue-500 to-blue-700 text-white shadow-md z-50 flex-shrink-0">
        <div className="px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            {/* Logo e Menu Mobile */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 hover:bg-blue-600/50 rounded-lg transition-colors"
                aria-label="Toggle sidebar"
              >
                {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    // No desktop, toggle sidebar expand/collapse
                    if (typeof window !== 'undefined' && window.innerWidth >= 1024) {
                      setSidebarExpanded(!sidebarExpanded);
                    } else {
                      router.push('/');
                    }
                  }}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <Plane className="w-6 h-6 animate-plane-fly" />
                  <h1 className="text-xl sm:text-2xl font-bold">AeroCost</h1>
                </button>
              </div>
            </div>

            {/* Ações do Header */}
            <div className="flex items-center gap-2 sm:gap-4">
              <button className="p-2 hover:bg-blue-600/50 rounded-lg transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button
                onClick={() => {
                  logout();
                  router.push('/login');
                }}
                className="p-2 hover:bg-blue-600/50 rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside
          className={`
            fixed lg:static left-0 z-40
            ${sidebarExpanded ? 'w-64' : 'w-16'} bg-white shadow-lg lg:shadow-none
            transform transition-all duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
            pt-16 lg:pt-0
            h-full
          `}
        >
          <div className={`h-full flex flex-col ${sidebarExpanded ? 'px-4 py-4' : 'px-2 py-4'}`}>
            {/* Menu Principal - com scroll */}
            <nav className="flex-1 overflow-y-auto space-y-1">
              {sidebarExpanded && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                    Principal
                  </p>
                </div>
              )}
              <button
                onClick={() => {
                  router.push('/');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                  isActive('/') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2 pr-3' : 'text-gray-700 px-3'
                }`}
                title="Dashboard"
              >
                <div className="flex items-center gap-3">
                  <HomeIcon className="w-5 h-5" />
                  {sidebarExpanded && <span>Dashboard</span>}
                </div>
                {!sidebarExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    Dashboard
                  </div>
                )}
              </button>
              {/* Gerenciar Usuários - Apenas para admins */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    router.push('/users');
                    setSidebarOpen(false);
                  }}
                className={`w-full flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                  isActive('/users') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2 pr-3' : 'text-gray-700 px-3'
                }`}
                  title="Gerenciar Usuários"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5" />
                    {sidebarExpanded && <span>Gerenciar Usuários</span>}
                  </div>
                  {!sidebarExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                      Gerenciar Usuários
                    </div>
                  )}
                </button>
              )}

              {sidebarExpanded && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                    Aeronave
                  </p>
                </div>
              )}
              {/* Gerenciar Aeronaves */}
              <button
                onClick={() => {
                  // Se houver aeronave selecionada, vai para ela, senão vai para a primeira ou /aircraft/new
                  if (currentAircraftId) {
                    router.push(`/aircraft/${currentAircraftId}`);
                  } else if (aircrafts.length > 0) {
                    router.push(`/aircraft/${aircrafts[0].id}`);
                  } else {
                    router.push('/aircraft/new');
                  }
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                  isActive('/aircraft/') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2 pr-3' : 'text-gray-700 px-3'
                }`}
                title="Aeronaves"
              >
                <div className="flex items-center gap-3">
                  <Plane className="w-5 h-5" />
                  {sidebarExpanded && <span>Aeronaves</span>}
                </div>
                {!sidebarExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    Aeronaves
                  </div>
                )}
              </button>
              {/* Rotas */}
              <button
                onClick={() => {
                  router.push('/routes');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                  isActive('/routes') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2 pr-3' : 'text-gray-700 px-3'
                }`}
                title="Rotas"
              >
                <div className="flex items-center gap-3">
                  <Route className="w-5 h-5" />
                  {sidebarExpanded && <span>Rotas</span>}
                </div>
                {!sidebarExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    Rotas
                  </div>
                )}
              </button>
              
              {/* Voos */}
              {currentAircraftId && (
                <button
                  onClick={() => {
                    router.push(`/aircraft/${currentAircraftId}/flights`);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                    isActive(`/aircraft/${currentAircraftId}/flights`) ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2 pr-3' : 'text-gray-700 px-3'
                  }`}
                  title="Voos"
                >
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5" />
                    {sidebarExpanded && <span>Voos</span>}
                  </div>
                  {!sidebarExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                      Voos
                    </div>
                  )}
                </button>
              )}

              {sidebarExpanded && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                    Custos
                  </p>
                </div>
              )}
              
              {/* Custos Fixos */}
              {currentAircraftId && (
                <button
                  onClick={() => {
                    router.push(`/aircraft/${currentAircraftId}/fixed-costs`);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                    isActive(`/aircraft/${currentAircraftId}/fixed-costs`) ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2 pr-3' : 'text-gray-700 px-3'
                  }`}
                  title="Custos Fixos"
                >
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5" />
                    {sidebarExpanded && <span>Custos Fixos</span>}
                  </div>
                  {!sidebarExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                      Custos Fixos
                    </div>
                  )}
                </button>
              )}
              
              {/* Custos Variáveis */}
              {currentAircraftId && (
                <button
                  onClick={() => {
                    router.push(`/aircraft/${currentAircraftId}/variable-costs`);
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                    isActive(`/aircraft/${currentAircraftId}/variable-costs`) ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2 pr-3' : 'text-gray-700 px-3'
                  }`}
                  title="Custos Variáveis"
                >
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5" />
                    {sidebarExpanded && <span>Custos Variáveis</span>}
                  </div>
                  {!sidebarExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                      Custos Variáveis
                    </div>
                  )}
                </button>
              )}
              {/* Taxa de Câmbio */}
              <button
                onClick={() => {
                  router.push('/fx-rates');
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                  isActive('/fx-rates') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2 pr-3' : 'text-gray-700 px-3'
                }`}
                title="Taxa de Câmbio"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5" />
                  {sidebarExpanded && <span>Taxa de Câmbio</span>}
                </div>
                {!sidebarExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    Taxa de Câmbio
                  </div>
                )}
              </button>

              {sidebarExpanded && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                    Administração
                  </p>
                </div>
              )}

              {/* Usuários - Apenas para admins */}
              {user?.role === 'admin' && (
                <button
                  onClick={() => {
                    router.push('/users');
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                    isActive('/users') ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-600 pl-2 pr-3' : 'text-gray-700 px-3'
                  }`}
                  title="Gerenciar Usuários"
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5" />
                    {sidebarExpanded && <span>Usuários</span>}
                  </div>
                  {!sidebarExpanded && (
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                      Usuários
                    </div>
                  )}
                </button>
              )}

              {sidebarExpanded && (
                <div className="mb-4">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2">
                    Relatórios
                  </p>
                </div>
              )}
              <button
                className={`w-full flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors relative group`}
                title="Análises"
              >
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-5 h-5" />
                  {sidebarExpanded && <span>Análises</span>}
                </div>
                {!sidebarExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    Análises
                  </div>
                )}
              </button>
              <button
                className={`w-full flex items-center ${sidebarExpanded ? 'justify-start' : 'justify-center'} px-3 py-2.5 text-sm font-medium text-gray-700 rounded-lg hover:bg-gray-100 transition-colors relative group`}
                title="Relatórios"
              >
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5" />
                  {sidebarExpanded && <span>Relatórios</span>}
                </div>
                {!sidebarExpanded && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    Relatórios
                  </div>
                )}
              </button>
            </nav>

            {/* Perfil do Usuário no final */}
            <div className={`mt-4 pt-4 border-t border-gray-200 ${sidebarExpanded ? '' : 'flex justify-center'}`}>
              {sidebarExpanded ? (
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user?.name || 'Usuário'}
                    </p>
                    <p className="text-xs text-gray-500 truncate">
                      {user?.email || 'Carregando...'}
                    </p>
                    {user?.role && (
                      <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full ${
                        user.role === 'admin' 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {user.role === 'admin' ? 'Administrador' : 'Usuário'}
                      </span>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-gray-400 flex-shrink-0" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Overlay para mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-gray-100 min-w-0 h-full">
          <div className="p-4 sm:p-6 lg:p-8">
            {/* Botão Nova Aeronave e Seletor de Aeronave */}
            {pathname !== '/fx-rates' && 
             pathname !== '/routes' && 
             !pathname?.includes('/routes') && (
              <div className="mb-6">
                {/* Botão Nova Aeronave e Seletor de Aeronave lado a lado */}
                <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-end justify-between">
                  {/* Seletor de Aeronave */}
                  {aircrafts.length > 0 && (
                    <div className="flex-1 w-full sm:w-auto">
                      <Select
                        label="Selecionar Aeronave"
                        value={selectedAircraftId || ''}
                        onChange={(e) => {
                          const newAircraftId = e.target.value;
                          if (newAircraftId) {
                            router.push(`/aircraft/${newAircraftId}`);
                          }
                        }}
                        options={[
                          { value: '', label: 'Selecione uma aeronave...' },
                          ...aircrafts.map((ac) => ({
                            value: ac.id,
                            label: `${ac.name} (${ac.registration})`,
                          })),
                        ]}
                      />
                    </div>
                  )}
                  
                  {/* Botão Nova Aeronave - aparece apenas quando estiver em uma página de aeronave */}
                  {pathname?.includes('/aircraft/') && pathname !== '/aircraft/new' && (
                    <Button
                      variant="outline"
                      onClick={() => router.push('/aircraft/new')}
                      icon={<Plus className="w-4 h-4" />}
                      className="w-full sm:w-auto"
                    >
                      Nova Aeronave
                    </Button>
                  )}
                </div>
              </div>
            )}
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

