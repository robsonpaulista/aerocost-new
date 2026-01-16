'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plane, Calendar as CalendarIcon } from 'lucide-react';
import { flightApi, partnerApi, type Flight, type Partner } from '@/lib/api';

interface CalendarProps {
  aircraftId: string;
  onFlightDoubleClick: (flight: Flight) => void;
}

export default function Calendar({ aircraftId, onFlightDoubleClick }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [flights, setFlights] = useState<Flight[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (aircraftId) {
      loadData();
    }
  }, [aircraftId, currentDate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const startDate = `${year}-${String(month).padStart(2, '0')}-01`;
      const endDate = `${year}-${String(month).padStart(2, '0')}-${new Date(year, month, 0).getDate()}`;

      const [flightsData, partnersData] = await Promise.all([
        flightApi.list(aircraftId, { start_date: startDate, end_date: endDate }),
        partnerApi.list(),
      ]);

      setFlights(flightsData || []);
      setPartners(partnersData || []);
    } catch (error) {
      console.error('Erro ao carregar dados do calendário:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Dias do mês anterior (para preencher a primeira semana)
    const prevMonth = new Date(year, month - 1, 0);
    const daysInPrevMonth = prevMonth.getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Dias do mês atual
    for (let day = 1; day <= daysInMonth; day++) {
      days.push({
        date: new Date(year, month, day),
        isCurrentMonth: true,
      });
    }

    // Dias do próximo mês (para preencher a última semana)
    const remainingDays = 42 - days.length; // 6 semanas * 7 dias
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
      });
    }

    return days;
  };

  const getFlightsForDate = (date: Date): Flight[] => {
    const dateStr = date.toISOString().split('T')[0];
    return flights.filter(flight => {
      const flightDate = flight.flight_date.split('T')[0];
      return flightDate === dateStr;
    });
  };

  const getPartnerColor = (flight: Flight): string => {
    // Se tiver passenger_ids, usar a cor do primeiro sócio
    if (flight.passenger_ids && flight.passenger_ids.length > 0) {
      const partner = partners.find(p => p.id === flight.passenger_ids![0]);
      if (partner) return partner.color;
    }
    
    // Se tiver passenger_name, tentar encontrar o sócio pelo nome
    if (flight.passenger_name) {
      const partner = partners.find(p => p.name.toLowerCase() === flight.passenger_name?.toLowerCase());
      if (partner) return partner.color;
    }

    // Cor padrão
    return '#9CA3AF'; // Cinza
  };

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  };

  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const goToToday = () => {
    setCurrentDate(new Date());
  };

  const days = getDaysInMonth(currentDate);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <p className="text-text-light">Carregando calendário...</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      {/* Header do Calendário */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-gray-600" />
          </button>
          <h2 className="text-xl font-semibold text-text">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        <button
          onClick={goToToday}
          className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
        >
          Hoje
        </button>
      </div>

      {/* Grid do Calendário */}
      <div className="grid grid-cols-7 gap-1">
        {/* Cabeçalho dos dias da semana */}
        {weekDays.map((day) => (
          <div key={day} className="text-center text-sm font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {/* Dias do calendário */}
        {days.map((day, index) => {
          const dayFlights = getFlightsForDate(day.date);
          const isToday = day.date.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={`
                min-h-[100px] border border-gray-200 rounded-lg p-2
                ${day.isCurrentMonth ? 'bg-white' : 'bg-gray-50'}
                ${isToday ? 'ring-2 ring-blue-500' : ''}
                hover:bg-gray-50 transition-colors
              `}
            >
              <div className={`text-sm font-medium mb-1 ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}`}>
                {day.date.getDate()}
              </div>
              <div className="space-y-1">
                {dayFlights.slice(0, 3).map((flight) => {
                  const color = getPartnerColor(flight);
                  const partner = flight.passenger_ids && flight.passenger_ids.length > 0
                    ? partners.find(p => p.id === flight.passenger_ids![0])
                    : flight.passenger_name
                    ? partners.find(p => p.name.toLowerCase() === flight.passenger_name?.toLowerCase())
                    : null;

                  return (
                    <div
                      key={flight.id}
                      onDoubleClick={() => onFlightDoubleClick(flight)}
                      className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                      style={{
                        backgroundColor: color + '20',
                        borderLeft: `3px solid ${color}`,
                        color: '#1F2937',
                      }}
                      title={`${flight.origin} → ${flight.destination}${partner ? ` - ${partner.name}` : ''} (${flight.flight_type === 'completed' ? 'Realizado' : 'Previsto'})`}
                    >
                      <div className="flex items-center gap-1 truncate">
                        <Plane className="w-3 h-3 flex-shrink-0" />
                        <span className="truncate">{flight.origin} → {flight.destination}</span>
                      </div>
                      {partner && (
                        <div className="text-xs text-gray-600 truncate">{partner.name}</div>
                      )}
                    </div>
                  );
                })}
                {dayFlights.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayFlights.length - 3} mais
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      {partners.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h3 className="text-sm font-semibold text-gray-700 mb-3">Legenda de Sócios</h3>
          <div className="flex flex-wrap gap-3">
            {partners.filter(p => p.is_active).map((partner) => (
              <div key={partner.id} className="flex items-center gap-2">
                <div
                  className="w-4 h-4 rounded"
                  style={{ backgroundColor: partner.color }}
                />
                <span className="text-sm text-gray-700">{partner.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
