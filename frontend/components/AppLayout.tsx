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
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({
    aeronave: true,
    custos: true,
    administracao: false,
    relatorios: false,
  });
  const { aircrafts, selectedAircraftId, setSelectedAircraftId } = useAircraft();
  const { user, logout } = useAuth();

  const toggleMenu = (menuKey: string) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuKey]: !prev[menuKey]
    }));
  };

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
              {/* Dashboard */}
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

              {/* Menu Aeronave */}
              {sidebarExpanded ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu('aeronave')}
                    className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Plane className="w-5 h-5" />
                      <span>Aeronave</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openMenus.aeronave ? '' : '-rotate-90'}`} />
                  </button>
                  {openMenus.aeronave && (
                    <div className="ml-8 space-y-1">
                      <button
                        onClick={() => {
                          if (currentAircraftId) {
                            router.push(`/aircraft/${currentAircraftId}`);
                          } else if (aircrafts.length > 0) {
                            router.push(`/aircraft/${aircrafts[0].id}`);
                          } else {
                            router.push('/aircraft/new');
                          }
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-start gap-2 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                          isActive('/aircraft/') && !pathname?.includes('/flights') && !pathname?.includes('/fixed-costs') && !pathname?.includes('/variable-costs')
                            ? 'bg-blue-50 text-blue-700 font-medium' 
                            : 'text-gray-600'
                        }`}
                      >
                        <Plane className="w-4 h-4" />
                        <span>Aeronaves</span>
                      </button>
                      <button
                        onClick={() => {
                          router.push('/routes');
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-start gap-2 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                          isActive('/routes') ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                        }`}
                      >
                        <Route className="w-4 h-4" />
                        <span>Rotas</span>
                      </button>
                      {currentAircraftId && (
                        <button
                          onClick={() => {
                            router.push(`/aircraft/${currentAircraftId}/flights`);
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-start gap-2 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                            isActive(`/aircraft/${currentAircraftId}/flights`) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                          }`}
                        >
                          <Calendar className="w-4 h-4" />
                          <span>Voos</span>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (currentAircraftId) {
                      router.push(`/aircraft/${currentAircraftId}`);
                    } else if (aircrafts.length > 0) {
                      router.push(`/aircraft/${aircrafts[0].id}`);
                    } else {
                      router.push('/aircraft/new');
                    }
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-center py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                    isActive('/aircraft/') ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                  title="Aeronave"
                >
                  <Plane className="w-5 h-5" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    Aeronave
                  </div>
                </button>
              )}

              {/* Menu Custos */}
              {sidebarExpanded ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu('custos')}
                    className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <DollarSign className="w-5 h-5" />
                      <span>Custos</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openMenus.custos ? '' : '-rotate-90'}`} />
                  </button>
                  {openMenus.custos && (
                    <div className="ml-8 space-y-1">
                      {currentAircraftId && (
                        <>
                          <button
                            onClick={() => {
                              router.push(`/aircraft/${currentAircraftId}/fixed-costs`);
                              setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-start gap-2 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                              isActive(`/aircraft/${currentAircraftId}/fixed-costs`) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                            }`}
                          >
                            <DollarSign className="w-4 h-4" />
                            <span>Custos Fixos</span>
                          </button>
                          <button
                            onClick={() => {
                              router.push(`/aircraft/${currentAircraftId}/variable-costs`);
                              setSidebarOpen(false);
                            }}
                            className={`w-full flex items-center justify-start gap-2 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                              isActive(`/aircraft/${currentAircraftId}/variable-costs`) ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                            }`}
                          >
                            <TrendingUp className="w-4 h-4" />
                            <span>Custos Variáveis</span>
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => {
                          router.push('/fx-rates');
                          setSidebarOpen(false);
                        }}
                        className={`w-full flex items-center justify-start gap-2 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                          isActive('/fx-rates') ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                        }`}
                      >
                        <Wallet className="w-4 h-4" />
                        <span>Taxa de Câmbio</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (currentAircraftId) {
                      router.push(`/aircraft/${currentAircraftId}/fixed-costs`);
                    } else {
                      router.push('/fx-rates');
                    }
                    setSidebarOpen(false);
                  }}
                  className={`w-full flex items-center justify-center py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                    isActive('/fixed-costs') || isActive('/variable-costs') || isActive('/fx-rates') ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                  }`}
                  title="Custos"
                >
                  <DollarSign className="w-5 h-5" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    Custos
                  </div>
                </button>
              )}

              {/* Menu Administração */}
              {user?.role === 'admin' && (
                sidebarExpanded ? (
                  <div className="space-y-1">
                    <button
                      onClick={() => toggleMenu('administracao')}
                      className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Settings className="w-5 h-5" />
                        <span>Administração</span>
                      </div>
                      <ChevronDown className={`w-4 h-4 transition-transform ${openMenus.administracao ? '' : '-rotate-90'}`} />
                    </button>
                    {openMenus.administracao && (
                      <div className="ml-8 space-y-1">
                        <button
                          onClick={() => {
                            router.push('/users');
                            setSidebarOpen(false);
                          }}
                          className={`w-full flex items-center justify-start gap-2 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors ${
                            isActive('/users') ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600'
                          }`}
                        >
                          <Users className="w-4 h-4" />
                          <span>Usuários</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => {
                      router.push('/users');
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center justify-center py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group ${
                      isActive('/users') ? 'bg-blue-50 text-blue-700' : 'text-gray-700'
                    }`}
                    title="Administração"
                  >
                    <Settings className="w-5 h-5" />
                    <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                      Administração
                    </div>
                  </button>
                )
              )}

              {/* Menu Relatórios */}
              {sidebarExpanded ? (
                <div className="space-y-1">
                  <button
                    onClick={() => toggleMenu('relatorios')}
                    className="w-full flex items-center justify-between py-2.5 px-3 text-sm font-semibold text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <BarChart3 className="w-5 h-5" />
                      <span>Relatórios</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 transition-transform ${openMenus.relatorios ? '' : '-rotate-90'}`} />
                  </button>
                  {openMenus.relatorios && (
                    <div className="ml-8 space-y-1">
                      <button
                        className="w-full flex items-center justify-start gap-2 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                      >
                        <BarChart3 className="w-4 h-4" />
                        <span>Análises</span>
                      </button>
                      <button
                        className="w-full flex items-center justify-start gap-2 py-2 text-sm rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
                      >
                        <FileText className="w-4 h-4" />
                        <span>Relatórios</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  className="w-full flex items-center justify-center py-2.5 text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors relative group text-gray-700"
                  title="Relatórios"
                >
                  <BarChart3 className="w-5 h-5" />
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
                    Relatórios
                  </div>
                </button>
              )}
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
             pathname !== '/users' &&
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

