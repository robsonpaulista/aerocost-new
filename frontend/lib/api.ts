import axios from 'axios';

// SEMPRE usa as API Routes do Next.js (caminho relativo)
// Não precisa mais de backend separado - tudo está no Next.js
const API_URL = '/api';

// API Routes do Next.js

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate',
    'Pragma': 'no-cache',
    'Expires': '0',
  },
});

// Interceptor para adicionar timestamp a todas as requisições GET para evitar cache
api.interceptors.request.use(
  (config) => {
    // Adicionar timestamp para evitar cache em requisições GET
    if (config.method === 'get' || config.method === 'GET') {
      config.params = {
        ...config.params,
        _t: Date.now(), // Timestamp para evitar cache
      };
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para respostas
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Tipos TypeScript
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  is_active: boolean;
  last_login?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Aircraft {
  id: string;
  name: string;
  registration: string;
  model: string;
  monthly_hours: number;
  avg_leg_time: number;
  created_at?: string;
  updated_at?: string;
}

export interface FixedCost {
  id?: string;
  aircraft_id: string;
  crew_monthly: number;
  pilot_hourly_rate: number;
  hangar_monthly: number;
  ec_fixed_usd: number;
  insurance: number;
  administration: number;
}

export interface VariableCost {
  id?: string;
  aircraft_id: string;
  fuel_liters_per_hour: number;
  fuel_consumption_km_per_l: number;
  fuel_price_per_liter: number;
  ec_variable_usd: number;
  ru_per_leg: number;
  ccr_per_leg: number;
}

export interface Route {
  id?: string;
  origin: string;
  destination: string;
  decea_per_hour: number;
}

export interface Flight {
  id?: string;
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
  routes?: {
    origin: string;
    destination: string;
    decea_per_hour: number;
  };
}

export interface FxRate {
  id?: string;
  usd_to_brl: number;
  effective_date?: string;
}

// API Functions
export const aircraftApi = {
  list: () => api.get<Aircraft[]>('/aircraft').then(res => res.data),
  get: (id: string) => api.get<Aircraft>(`/aircraft/${id}`).then(res => res.data),
  create: (data: Omit<Aircraft, 'id' | 'created_at' | 'updated_at'>) =>
    api.post<Aircraft>('/aircraft', data).then(res => res.data),
  update: (id: string, data: Partial<Aircraft>) =>
    api.put<Aircraft>(`/aircraft/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/aircraft/${id}`).then(res => res.data),
};

export const fixedCostApi = {
  get: (aircraftId: string, config?: any) =>
    api.get<FixedCost>(`/fixed-costs/aircraft/${aircraftId}`, config).then(res => res.data),
  upsert: (data: FixedCost) =>
    api.post<FixedCost>('/fixed-costs', data).then(res => res.data),
  update: (id: string, data: Partial<FixedCost>) =>
    api.put<FixedCost>(`/fixed-costs/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/fixed-costs/${id}`).then(res => res.data),
};

export const variableCostApi = {
  get: (aircraftId: string) =>
    api.get<VariableCost>(`/variable-costs/aircraft/${aircraftId}`).then(res => res.data),
  upsert: (data: VariableCost) =>
    api.post<VariableCost>('/variable-costs', data).then(res => res.data),
  update: (id: string, data: Partial<VariableCost>) =>
    api.put<VariableCost>(`/variable-costs/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/variable-costs/${id}`).then(res => res.data),
};

export const routeApi = {
  list: () =>
    api.get<Route[]>('/routes').then(res => res.data),
  get: (id: string) => api.get<Route>(`/routes/single/${id}`).then(res => res.data),
  create: (data: Omit<Route, 'id'>) =>
    api.post<Route>('/routes', data).then(res => res.data),
  update: (id: string, data: Partial<Route>) =>
    api.put<Route>(`/routes/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/routes/${id}`).then(res => res.data),
};

export const fxRateApi = {
  getCurrent: () => api.get<FxRate>('/fx-rates/current').then(res => res.data),
  list: () => api.get<FxRate[]>('/fx-rates').then(res => res.data),
  create: (data: FxRate) => api.post<FxRate>('/fx-rates', data).then(res => res.data),
};

export const calculationApi = {
  baseCost: (aircraftId: string) =>
    api.get(`/calculations/${aircraftId}/base-cost`).then(res => res.data),
  routeCost: (aircraftId: string, routeId?: string) =>
    api.get(`/calculations/${aircraftId}/route-cost`, {
      params: routeId ? { routeId } : {},
    }).then(res => res.data),
  legCost: (aircraftId: string, legTime?: number, routeId?: string) =>
    api.get(`/calculations/${aircraftId}/leg-cost`, {
      params: { legTime, routeId },
    }).then(res => res.data),
  monthlyProjection: (aircraftId: string) =>
    api.get(`/calculations/${aircraftId}/monthly-projection`).then(res => res.data),
  complete: (aircraftId: string) =>
    api.get(`/calculations/${aircraftId}/complete`).then(res => res.data),
};

export const flightApi = {
  list: (aircraftId: string, filters?: { flight_type?: string; start_date?: string; end_date?: string; limit?: number }) => {
    return api.get(`/flights/aircraft/${aircraftId}`, { 
      params: filters,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    }).then(res => res.data);
  },
  get: (id: string) =>
    api.get(`/flights/single/${id}`).then(res => res.data),
  create: (data: Flight) =>
    api.post('/flights', data).then(res => res.data),
  update: (id: string, data: Partial<Flight>) =>
    api.put(`/flights/${id}`, data).then(res => res.data),
  delete: (id: string) =>
    api.delete(`/flights/${id}`).then(res => res.data),
  markAsCompleted: (id: string, actualLegTime?: number) =>
    api.post(`/flights/${id}/complete`, { actual_leg_time: actualLegTime }).then(res => res.data),
  getStatistics: (aircraftId: string, startDate?: string, endDate?: string) =>
    api.get(`/flights/aircraft/${aircraftId}/statistics`, { params: { start_date: startDate, end_date: endDate } }).then(res => res.data),
  recalculateCosts: (aircraftId: string) =>
    api.post(`/flights/aircraft/${aircraftId}/recalculate-costs`).then(res => res.data),
};

export const dashboardApi = {
  get: (aircraftId: string) =>
    api.get(`/dashboard/${aircraftId}`).then(res => res.data),
};

// Interceptor para adicionar email do usuário atual nas requisições de usuários
const userApiInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adicionar email do usuário atual nos headers
userApiInstance.interceptors.request.use(
  (config) => {
    // Buscar email do usuário do localStorage
    const savedUser = localStorage.getItem('aeroCost_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        if (user.email) {
          config.headers['x-user-email'] = user.email;
        }
      } catch {
        // Ignorar erro de parsing
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const userApi = {
  list: () => userApiInstance.get<User[]>('/users').then(res => res.data),
  get: (id: string) => userApiInstance.get<User>(`/users/${id}`).then(res => res.data),
  getByEmail: (email: string) => api.get<User>(`/users/by-email?email=${encodeURIComponent(email)}`).then(res => res.data).catch(err => {
    if (err.response?.status === 404) {
      return null;
    }
    throw err;
  }),
  create: (data: { name: string; email: string; password: string; role?: 'admin' | 'user'; is_active?: boolean }) =>
    userApiInstance.post<User>('/users', data).then(res => res.data),
  update: (id: string, data: Partial<{ name: string; email: string; password: string; role: 'admin' | 'user'; is_active: boolean }>) =>
    userApiInstance.put<User>(`/users/${id}`, data).then(res => res.data),
  delete: (id: string) => userApiInstance.delete(`/users/${id}`).then(res => res.data),
  deletePermanent: (id: string) => userApiInstance.delete(`/users/${id}/permanent`).then(res => res.data),
};

export default api;

