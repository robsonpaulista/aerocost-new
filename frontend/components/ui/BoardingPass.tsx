'use client';

import { Plane, Calendar, Clock, DollarSign, CheckCircle2, AlertCircle, QrCode } from 'lucide-react';
import type { Flight } from '@/lib/api';

interface BoardingPassProps {
  flight: Flight;
  aircraftName?: string;
  onEdit?: () => void;
  onDelete?: () => void;
  onMarkCompleted?: () => void;
  formatDate: (dateString: string) => string;
}

export function BoardingPass({
  flight,
  aircraftName,
  onEdit,
  onDelete,
  onMarkCompleted,
  formatDate,
}: BoardingPassProps) {
  const isCompleted = flight.flight_type === 'completed';
  const legTime = isCompleted && flight.actual_leg_time 
    ? flight.actual_leg_time 
    : flight.leg_time;

  return (
    <div className="relative bg-amber-50 rounded-lg shadow-lg overflow-hidden border-2 border-amber-200 hover:shadow-xl transition-shadow">
      {/* Design de cartão de embarque com bordas recortadas */}
      <div className="relative">
        {/* Linha pontilhada superior */}
        <div className="absolute top-0 left-0 right-0 h-0.5 border-t-2 border-dashed border-gray-300"></div>
        
        {/* Conteúdo principal */}
        <div className="p-6">
          {/* Cabeçalho */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b-2 border-dashed border-gray-300">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg">
                <Plane className="w-6 h-6 text-gray-700" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900">
                  {aircraftName || 'Aeronave'}
                </h3>
              </div>
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-semibold text-gray-700">
              {isCompleted ? (
                <div className="flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Realizado
                </div>
              ) : (
                <div className="flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  Previsto
                </div>
              )}
            </div>
          </div>

          {/* Rota principal */}
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              {/* QR Code Icon */}
              <div className="p-2 rounded flex-shrink-0">
                <QrCode className="w-8 h-8 text-gray-700" />
              </div>
              
              <div className="flex items-center justify-between flex-1">
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {flight.origin}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Origem
                  </div>
                </div>
                
                <div className="mx-4 flex items-center">
                  <div className="relative">
                    <div className="w-12 h-0.5 bg-gray-400"></div>
                    <Plane className="absolute -top-2 -right-2 w-5 h-5 text-gray-400" />
                  </div>
                </div>
                
                <div className="text-center flex-1">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {flight.destination}
                  </div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider">
                    Destino
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Informações detalhadas */}
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Calendar className="w-4 h-4 text-gray-700" />
                <span className="text-xs text-gray-700 uppercase tracking-wide">Data</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {formatDate(flight.flight_date)}
              </div>
            </div>

            <div className="rounded-lg p-3">
              <div className="flex items-center gap-2 mb-1">
                <Clock className="w-4 h-4 text-gray-700" />
                <span className="text-xs text-gray-700 uppercase tracking-wide">Tempo</span>
              </div>
              <div className="text-sm font-semibold text-gray-900">
                {legTime.toFixed(2)}h
                {isCompleted && flight.actual_leg_time && flight.actual_leg_time !== flight.leg_time && (
                  <span className="text-xs text-gray-600 ml-1">
                    (previsto: {flight.leg_time.toFixed(2)}h)
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Custo */}
          {flight.cost_calculated && (
            <div className="rounded-lg p-3 mb-4">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <DollarSign className="w-4 h-4 text-gray-700" />
                  <span className="text-xs font-semibold text-gray-900">Custo do Voo</span>
                </div>
                <div className="text-sm font-bold text-gray-900 whitespace-nowrap">
                  R$ {flight.cost_calculated.toLocaleString('pt-BR', { 
                    minimumFractionDigits: 2, 
                    maximumFractionDigits: 2 
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Observações */}
          {flight.notes && (
            <div className="mb-4 p-3 rounded-lg">
              <p className="text-xs text-gray-700">
                <span className="font-semibold">Observações:</span> {flight.notes}
              </p>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-4 border-t border-gray-200">
            {flight.flight_type === 'planned' && onMarkCompleted && (
              <button
                onClick={onMarkCompleted}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium flex items-center justify-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                Marcar como Realizado
              </button>
            )}
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
              >
                Editar
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
              >
                Excluir
              </button>
            )}
          </div>
        </div>

        {/* Linha pontilhada inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 border-b-2 border-dashed border-gray-300"></div>
      </div>

      {/* Recortes laterais decorativos */}
      <div className="absolute top-1/2 -left-3 w-6 h-6 bg-gray-100 rounded-full border-2 border-gray-300 transform -translate-y-1/2"></div>
      <div className="absolute top-1/2 -right-3 w-6 h-6 bg-gray-100 rounded-full border-2 border-gray-300 transform -translate-y-1/2"></div>
    </div>
  );
}

