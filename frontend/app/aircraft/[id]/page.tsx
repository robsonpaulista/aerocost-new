'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import {
  DollarSign,
  TrendingUp,
  Edit,
  Save,
  Plane,
  Trash2,
  ArrowLeft,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import AppLayout from '@/components/AppLayout';
import { aircraftApi, fixedCostApi, variableCostApi } from '@/lib/api';
import { useAircraft } from '@/contexts/AircraftContext';
import type { Aircraft, FixedCost, VariableCost } from '@/lib/api';

export default function AircraftDetailPage() {
  const router = useRouter();
  const params = useParams();
  const { aircrafts, loading: contextLoading } = useAircraft();
  const aircraftId = params.id as string;
  const isNewAircraft = !aircraftId || aircraftId === 'new';

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editing, setEditing] = useState(isNewAircraft);
  const [aircraft, setAircraft] = useState<Aircraft | null>(null);
  const [fixedCosts, setFixedCosts] = useState<FixedCost | null>(null);
  const [variableCosts, setVariableCosts] = useState<VariableCost | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    registration: '',
    model: '',
    monthly_hours: '',
    avg_leg_time: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isNewAircraft) {
      // Aguardar o contexto carregar as aeronaves
      if (!contextLoading) {
        setLoading(false);
        setEditing(true);
        console.log('[AircraftPage] Modo nova aeronave, aircrafts:', aircrafts);
      }
    } else {
      loadData();
    }
  }, [aircraftId, isNewAircraft, contextLoading, aircrafts]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [aircraftData, fixedCostsData, variableCostsData] = await Promise.all([
        aircraftApi.get(aircraftId),
        fixedCostApi.get(aircraftId).catch(() => null),
        variableCostApi.get(aircraftId).catch(() => null),
      ]);

      setAircraft(aircraftData);
      setFixedCosts(fixedCostsData);
      setVariableCosts(variableCostsData);
      
      // Preencher formulário com dados da aeronave
      setFormData({
        name: aircraftData.name || '',
        registration: aircraftData.registration || '',
        model: aircraftData.model || '',
        monthly_hours: aircraftData.monthly_hours != null ? aircraftData.monthly_hours.toString() : '0',
        avg_leg_time: aircraftData.avg_leg_time != null ? aircraftData.avg_leg_time.toString() : '0',
      });
    } catch (error: any) {
      console.error('Erro ao carregar dados:', error);
      if (error.response?.status === 404) {
        router.push('/aircraft/new');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setErrors({});

    try {
      if (isNewAircraft) {
        // Criar nova aeronave
        const newAircraft = await aircraftApi.create({
          name: formData.name,
          registration: formData.registration,
          model: formData.model,
          monthly_hours: parseFloat(formData.monthly_hours),
          avg_leg_time: parseFloat(formData.avg_leg_time),
        });
        alert('Aeronave criada com sucesso!');
        router.push(`/aircraft/${newAircraft.id}`);
      } else {
        // Atualizar aeronave existente
        await aircraftApi.update(aircraftId, {
          name: formData.name,
          registration: formData.registration,
          model: formData.model,
          monthly_hours: parseFloat(formData.monthly_hours),
          avg_leg_time: parseFloat(formData.avg_leg_time),
        });
        alert('Aeronave atualizada com sucesso!');
        setEditing(false);
        await loadData();
      }
    } catch (error: any) {
      if (error.response?.data?.details) {
        const validationErrors: Record<string, string> = {};
        error.response.data.details.forEach((err: any) => {
          validationErrors[err.path[0]] = err.message;
        });
        setErrors(validationErrors);
      } else {
        setErrors({ general: error.response?.data?.error || `Erro ao ${isNewAircraft ? 'criar' : 'atualizar'} aeronave` });
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta aeronave? Esta ação não pode ser desfeita.')) {
      return;
    }

    setDeletingId(id);
    try {
      await aircraftApi.delete(id);
      alert('Aeronave excluída com sucesso!');
      router.push('/aircraft/new');
    } catch (error: any) {
      alert('Erro ao excluir aeronave: ' + (error.response?.data?.error || error.message));
    } finally {
      setDeletingId(null);
    }
  };

  if (loading || contextLoading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <p className="text-text-light">Carregando...</p>
        </div>
      </AppLayout>
    );
  }


  if (!aircraft) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center py-12">
          <Card>
            <p className="text-text-light">Aeronave não encontrada</p>
            <Button onClick={() => router.push('/aircraft/new')} className="mt-4">
              Voltar
            </Button>
          </Card>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
        {/* Se for nova aeronave, mostrar apenas o formulário */}
        {isNewAircraft ? (
          <Card className="shadow-sm max-w-2xl mx-auto">
            <h3 className="text-base font-semibold text-text mb-4">Nova Aeronave</h3>
            
            <p className="text-sm text-text-light mb-6">
              Informações essenciais para compor a base de cálculos da operação.
            </p>

            {errors.general && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                {errors.general}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                <Input
                  label="Nome"
                  placeholder="Ex: Cessna Citation CJ3"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  error={errors.name}
                  required
                />

                <Input
                  label="Matrícula"
                  placeholder="Ex: PT-ABC"
                  value={formData.registration}
                  onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                  error={errors.registration}
                  required
                />

                <Input
                  label="Modelo"
                  placeholder="Ex: CJ3"
                  value={formData.model}
                  onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                  error={errors.model}
                  required
                />

                <Input
                  label="Horas Previstas por Mês"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 50"
                  value={formData.monthly_hours}
                  onChange={(e) => setFormData({ ...formData, monthly_hours: e.target.value })}
                  error={errors.monthly_hours}
                  required
                />

                <Input
                  label="Tempo Médio por Perna (horas)"
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="Ex: 1.5"
                  value={formData.avg_leg_time}
                  onChange={(e) => setFormData({ ...formData, avg_leg_time: e.target.value })}
                  error={errors.avg_leg_time}
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button type="submit" loading={saving} icon={<Save className="w-4 h-4" />}>
                  Salvar Aeronave
                </Button>
              </div>
            </form>
          </Card>
        ) : aircraft ? (
          <div className="space-y-4">
              {/* Informações da Aeronave */}
              <Card className="shadow-sm pt-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-text">Informações da Aeronave</h3>
            <div className="flex gap-2">
              {!editing && (
                <Button
                  variant="outline"
                  onClick={() => setEditing(true)}
                  icon={<Edit className="w-4 h-4" />}
                >
                  Editar
                </Button>
              )}
            </div>
          </div>

          {editing ? (
            <>
              <p className="text-xs text-text-light mb-4">
                {isNewAircraft ? 'Informações essenciais para compor a base de cálculos da operação.' : 'Atualize as informações da aeronave.'}
              </p>

              {errors.general && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                  {errors.general}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  <Input
                    label="Nome"
                    placeholder="Ex: Cessna Citation CJ3"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    error={errors.name}
                    required
                  />

                  <Input
                    label="Matrícula"
                    placeholder="Ex: PT-ABC"
                    value={formData.registration}
                    onChange={(e) => setFormData({ ...formData, registration: e.target.value })}
                    error={errors.registration}
                    required
                  />

                  <Input
                    label="Modelo"
                    placeholder="Ex: CJ3"
                    value={formData.model}
                    onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    error={errors.model}
                    required
                  />

                  <Input
                    label="Horas Previstas por Mês"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 50"
                    value={formData.monthly_hours}
                    onChange={(e) => setFormData({ ...formData, monthly_hours: e.target.value })}
                    error={errors.monthly_hours}
                    required
                  />

                  <Input
                    label="Tempo Médio por Perna (horas)"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="Ex: 1.5"
                    value={formData.avg_leg_time}
                    onChange={(e) => setFormData({ ...formData, avg_leg_time: e.target.value })}
                    error={errors.avg_leg_time}
                    required
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditing(false);
                      loadData();
                    }}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" loading={saving} icon={<Save className="w-4 h-4" />}>
                    Salvar Alterações
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <p className="text-xs text-text-light mb-1">Nome</p>
                <p className="text-sm font-medium text-text">{aircraft.name}</p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-1">Matrícula</p>
                <p className="text-sm font-medium text-text">{aircraft.registration}</p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-1">Modelo</p>
                <p className="text-sm font-medium text-text">{aircraft.model}</p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-1">Horas Mensais</p>
                <p className="text-sm font-medium text-text">{aircraft.monthly_hours}h</p>
              </div>
            </div>
          )}
              </Card>

              {/* Custos Fixos */}
              <Card className="shadow-sm pt-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-text">Custos Fixos Mensais</h3>
            <Button
              variant="outline"
              onClick={() => router.push(`/aircraft/${aircraftId}/fixed-costs`)}
              icon={<Edit className="w-4 h-4" />}
            >
              {fixedCosts ? 'Editar' : 'Cadastrar'}
            </Button>
          </div>
          
          {fixedCosts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-text-light mb-0.5">Tripulação Mensal</p>
                <p className="text-sm font-medium text-text">
                  R$ {fixedCosts.crew_monthly?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-0.5">Taxa de Piloto (hora)</p>
                <p className="text-sm font-medium text-text">
                  R$ {fixedCosts.pilot_hourly_rate?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-0.5">Hangar Mensal</p>
                <p className="text-sm font-medium text-text">
                  R$ {fixedCosts.hangar_monthly?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-0.5">EC Fixo (USD)</p>
                <p className="text-sm font-medium text-text">
                  $ {fixedCosts.ec_fixed_usd?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-0.5">Seguro</p>
                <p className="text-sm font-medium text-text">
                  R$ {fixedCosts.insurance?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-0.5">Administração</p>
                <p className="text-sm font-medium text-text">
                  R$ {fixedCosts.administration?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-light py-3">
              Nenhum custo fixo configurado. Clique em "Cadastrar" para configurar.
            </p>
          )}
        </Card>

        {/* Custos Variáveis */}
        <Card className="shadow-sm pt-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-text">Custos Variáveis</h3>
            <Button
              variant="outline"
              onClick={() => router.push(`/aircraft/${aircraftId}/variable-costs`)}
              icon={<Edit className="w-4 h-4" />}
            >
              {variableCosts ? 'Editar' : 'Cadastrar'}
            </Button>
          </div>
          
          {variableCosts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              <div>
                <p className="text-xs text-text-light mb-0.5">Combustível (L/hora)</p>
                <p className="text-sm font-medium text-text">
                  {variableCosts.fuel_liters_per_hour?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'} L/h
                </p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-0.5">Consumo (km/L)</p>
                <p className="text-sm font-medium text-text">
                  {variableCosts.fuel_consumption_km_per_l?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'} km/L
                </p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-0.5">Preço Combustível (L)</p>
                <p className="text-sm font-medium text-text">
                  R$ {variableCosts.fuel_price_per_liter?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-0.5">EC Variável (USD)</p>
                <p className="text-sm font-medium text-text">
                  $ {variableCosts.ec_variable_usd?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-0.5">RU por Perna</p>
                <p className="text-sm font-medium text-text">
                  R$ {variableCosts.ru_per_leg?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
              <div>
                <p className="text-xs text-text-light mb-0.5">CCR por Perna</p>
                <p className="text-sm font-medium text-text">
                  R$ {variableCosts.ccr_per_leg?.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) || '0,00'}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-xs text-text-light py-3">
              Nenhum custo variável configurado. Clique em "Cadastrar" para configurar.
            </p>
          )}
              </Card>
          </div>
        ) : null}
    </AppLayout>
  );
}

