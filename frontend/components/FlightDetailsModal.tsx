'use client';

import { useState, useEffect } from 'react';
import { X, Plane, Calendar, Clock, DollarSign, MapPin, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { flightApi, calculationApi, type Flight, type Partner } from '@/lib/api';

interface FlightDetailsModalProps {
  flight: Flight | null;
  partners: Partner[];
  onClose: () => void;
  onRecalculate?: (flight: Flight) => void;
  onEdit?: (flight: Flight) => void;
  onDelete?: (flightId: string) => void;
}

export default function FlightDetailsModal({
  flight,
  partners,
  onClose,
  onRecalculate,
  onEdit,
  onDelete,
}: FlightDetailsModalProps) {
  const [calculationDetails, setCalculationDetails] = useState<any>(null);
  const [loadingCalculation, setLoadingCalculation] = useState(false);

  useEffect(() => {
    if (flight && flight.flight_type === 'completed') {
      loadCalculationDetails();
    }
  }, [flight]);

  const loadCalculationDetails = async () => {
    if (!flight) return;
    
    try {
      setLoadingCalculation(true);
      const legTime = flight.actual_leg_time || flight.leg_time;
      if (legTime) {
        const details = await calculationApi.legCost(
          flight.aircraft_id,
          legTime,
          flight.route_id || undefined
        );
        setCalculationDetails(details);
      }
    } catch (error) {
      console.error('Erro ao carregar detalhes do cálculo:', error);
    } finally {
      setLoadingCalculation(false);
    }
  };

  const handleRecalculate = async () => {
    if (!flight || !onRecalculate) return;
    setLoadingCalculation(true);
    try {
      await onRecalculate(flight);
      await loadCalculationDetails();
    } finally {
      setLoadingCalculation(false);
    }
  };

  if (!flight) return null;

  const formatDate = (dateString: string): string => {
    if (dateString.includes('T')) {
      dateString = dateString.split('T')[0];
    }
    const [year, month, day] = dateString.split('-').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('pt-BR');
  };

  const getPartnersForFlight = (): Partner[] => {
    if (flight.passenger_ids && flight.passenger_ids.length > 0) {
      return partners.filter(p => flight.passenger_ids!.includes(p.id!));
    }
    if (flight.passenger_name) {
      const partner = partners.find(p => p.name.toLowerCase() === flight.passenger_name?.toLowerCase());
      return partner ? [partner] : [];
    }
    return [];
  };

  const flightPartners = getPartnersForFlight();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text">Detalhes do Voo</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="space-y-6">
          {/* Informações Básicas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Data do Voo</p>
                <p className="font-medium text-text">{formatDate(flight.flight_date)}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Plane className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Rota</p>
                <p className="font-medium text-text">{flight.origin} → {flight.destination}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Tempo de Voo</p>
                <p className="font-medium text-text">
                  {flight.flight_type === 'completed' && flight.actual_leg_time
                    ? `${flight.actual_leg_time.toFixed(2)}h (real)`
                    : `${flight.leg_time.toFixed(2)}h`}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${
                flight.flight_type === 'completed' ? 'bg-green-500' : 'bg-blue-500'
              }`} />
              <div>
                <p className="text-sm text-gray-500">Status</p>
                <p className="font-medium text-text">
                  {flight.flight_type === 'completed' ? 'Realizado' : 'Previsto'}
                </p>
              </div>
            </div>
          </div>

          {/* Passageiros/Sócios */}
          {flightPartners.length > 0 && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Sócios no Voo</p>
              <div className="flex flex-wrap gap-2">
                {flightPartners.map((partner) => (
                  <div
                    key={partner.id}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
                    style={{
                      backgroundColor: partner.color + '20',
                      borderLeft: `3px solid ${partner.color}`,
                    }}
                  >
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: partner.color }}
                    />
                    <span className="text-sm font-medium text-gray-900">{partner.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Custo Calculado */}
          {flight.flight_type === 'completed' && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <DollarSign className="w-5 h-5 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-500">Custo Calculado</p>
                    <p className="text-2xl font-bold text-text">
                      {flight.cost_calculated
                        ? `R$ ${flight.cost_calculated.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                        : 'Não calculado'}
                    </p>
                  </div>
                </div>
                {onRecalculate && (
                  <Button
                    variant="outline"
                    onClick={handleRecalculate}
                    loading={loadingCalculation}
                    icon={<RefreshCw className="w-4 h-4" />}
                  >
                    Recalcular
                  </Button>
                )}
              </div>

              {/* Detalhes do Cálculo */}
              {calculationDetails && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Detalhes do Cálculo</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500">Custo Fixo Mensal</p>
                      <p className="font-medium text-text">
                        R$ {calculationDetails.fixedCost?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Custo Variável por Hora</p>
                      <p className="font-medium text-text">
                        R$ {calculationDetails.variableCostPerHour?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Custo Total do Voo</p>
                      <p className="font-medium text-text">
                        R$ {calculationDetails.totalLegCost?.toLocaleString('pt-BR', { minimumFractionDigits: 2 }) || '0,00'}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Tempo de Voo</p>
                      <p className="font-medium text-text">
                        {calculationDetails.legTime?.toFixed(2) || '0,00'}h
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Observações */}
          {flight.notes && (
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Observações</p>
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">{flight.notes}</p>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            {onEdit && (
              <Button
                variant="outline"
                onClick={() => onEdit(flight)}
                icon={<Edit className="w-4 h-4" />}
                className="flex-1"
              >
                Editar Voo
              </Button>
            )}
            {onDelete && flight.id && (
              <Button
                variant="outline"
                onClick={() => {
                  if (confirm('Tem certeza que deseja excluir este voo?')) {
                    onDelete(flight.id!);
                    onClose();
                  }
                }}
                icon={<Trash2 className="w-4 h-4" />}
                className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Excluir Voo
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}
