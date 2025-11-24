import { Aircraft } from '../models/Aircraft';
import { FixedCost } from '../models/FixedCost';
import { VariableCost } from '../models/VariableCost';
import { FxRate } from '../models/FxRate';
import { Route } from '../models/Route';

/**
 * Serviço de cálculos de custos operacionais
 */
export class CalculationService {
  /**
   * Calcula o custo base por hora
   */
  static async calculateBaseCostPerHour(aircraftId: string) {
    const aircraft = await Aircraft.findById(aircraftId);
    if (!aircraft) {
      throw new Error('Aircraft not found');
    }

    const fixedCosts = await FixedCost.findByAircraftId(aircraftId);
    const variableCosts = await VariableCost.findByAircraftId(aircraftId);
    const fxRate = await FxRate.getCurrent();

    if (!fxRate) {
      throw new Error('Exchange rate not found');
    }

    const monthlyHours = parseFloat((aircraft as any).monthly_hours || '0');
    if (monthlyHours === 0) {
      throw new Error('Monthly hours must be greater than 0');
    }

    // Debug logs
    console.log('[CalculationService] Dados carregados:', {
      aircraftId,
      monthlyHours,
      fixedCosts: fixedCosts ? {
        crew_monthly: (fixedCosts as any).crew_monthly,
        hangar_monthly: (fixedCosts as any).hangar_monthly,
        ec_fixed_usd: (fixedCosts as any).ec_fixed_usd,
        insurance: (fixedCosts as any).insurance,
        administration: (fixedCosts as any).administration,
      } : null,
      variableCosts: variableCosts ? {
        fuel_liters_per_hour: (variableCosts as any).fuel_liters_per_hour,
        fuel_price_per_liter: (variableCosts as any).fuel_price_per_liter,
        ec_variable_usd: (variableCosts as any).ec_variable_usd,
      } : null,
      fxRate: fxRate.usd_to_brl,
    });

    const avgLegTime = parseFloat((aircraft as any).avg_leg_time || '0');

    // Conversão de fixo → hora
    let fixedCostPerHour = 0;
    if (fixedCosts) {
      const fixed = fixedCosts as any;
      const crewMonthly = parseFloat(fixed.crew_monthly || '0');
      // Taxa de piloto não é usada - está incluída na tripulação
      const hangarMonthly = parseFloat(fixed.hangar_monthly || '0');
      const ecFixedUsd = parseFloat(fixed.ec_fixed_usd || '0');
      const insurance = parseFloat(fixed.insurance || '0');
      const administration = parseFloat(fixed.administration || '0');

      // Converter USD para BRL
      const ecFixedBrl = ecFixedUsd * parseFloat(fxRate.usd_to_brl || '0');

      // Calcular cada custo fixo mensal por hora (dividir pelas horas mensais)
      const crewPerHour = monthlyHours > 0 ? crewMonthly / monthlyHours : 0;
      const hangarPerHour = monthlyHours > 0 ? hangarMonthly / monthlyHours : 0;
      const ecFixedPerHour = monthlyHours > 0 ? ecFixedBrl / monthlyHours : 0;
      const insurancePerHour = monthlyHours > 0 ? insurance / monthlyHours : 0;
      const administrationPerHour = monthlyHours > 0 ? administration / monthlyHours : 0;

      // Custo fixo total por hora = soma de todos os custos fixos por hora (sem taxa de piloto)
      fixedCostPerHour = crewPerHour + hangarPerHour + ecFixedPerHour + insurancePerHour + administrationPerHour;
    }

    // Conversão de variável → hora
    let variableCostPerHour = 0;
    if (variableCosts) {
      const variable = variableCosts as any;
      const fuelLitersPerHour = parseFloat(variable.fuel_liters_per_hour || '0');
      const fuelPricePerLiter = parseFloat(variable.fuel_price_per_liter || '0');
      const ecVariableUsd = parseFloat(variable.ec_variable_usd || '0');
      const ruPerLeg = parseFloat(variable.ru_per_leg || '0');
      const ccrPerLeg = parseFloat(variable.ccr_per_leg || '0');

      // Converter USD para BRL
      const ecVariableBrl = ecVariableUsd * parseFloat(fxRate.usd_to_brl || '0');

      // Custo de combustível por hora
      const fuelCostPerHour = fuelLitersPerHour * fuelPricePerLiter;

      // Custo de RU e CCR por hora (assumindo tempo médio de perna)
      const ruCcrPerHour = avgLegTime > 0 ? (ruPerLeg + ccrPerLeg) / avgLegTime : 0;

      // Total de custos variáveis por hora
      variableCostPerHour = fuelCostPerHour + ecVariableBrl + ruCcrPerHour;
    }

    const totalBaseCostPerHour = fixedCostPerHour + variableCostPerHour;

    // Breakdown detalhado dos custos fixos
    const fixedBreakdown = fixedCosts ? (() => {
      const fixed = fixedCosts as any;
      const crewMonthly = parseFloat(fixed.crew_monthly || '0');
      // Taxa de piloto não é incluída - está na tripulação
      const hangarMonthly = parseFloat(fixed.hangar_monthly || '0');
      const ecFixedUsd = parseFloat(fixed.ec_fixed_usd || '0');
      const insurance = parseFloat(fixed.insurance || '0');
      const administration = parseFloat(fixed.administration || '0');
      const ecFixedBrl = ecFixedUsd * parseFloat(fxRate.usd_to_brl || '0');

      return {
        crewMonthly: crewMonthly,
        crewPerHour: monthlyHours > 0 ? parseFloat((crewMonthly / monthlyHours).toFixed(2)) : 0,
        hangarMonthly: hangarMonthly,
        hangarPerHour: monthlyHours > 0 ? parseFloat((hangarMonthly / monthlyHours).toFixed(2)) : 0,
        ecFixedUsd: ecFixedUsd,
        ecFixedBrl: parseFloat(ecFixedBrl.toFixed(2)),
        ecFixedPerHour: monthlyHours > 0 ? parseFloat((ecFixedBrl / monthlyHours).toFixed(2)) : 0,
        insurance: insurance,
        insurancePerHour: monthlyHours > 0 ? parseFloat((insurance / monthlyHours).toFixed(2)) : 0,
        administration: administration,
        administrationPerHour: monthlyHours > 0 ? parseFloat((administration / monthlyHours).toFixed(2)) : 0,
      };
    })() : null;

    // Breakdown detalhado dos custos variáveis
    const variableBreakdown = variableCosts ? {
      fuelLitersPerHour: parseFloat((variableCosts as any).fuel_liters_per_hour || '0'),
      fuelPricePerLiter: parseFloat((variableCosts as any).fuel_price_per_liter || '0'),
      fuelCostPerHour: parseFloat(((parseFloat((variableCosts as any).fuel_liters_per_hour || '0') * parseFloat((variableCosts as any).fuel_price_per_liter || '0')).toFixed(2))),
      ecVariableUsd: parseFloat((variableCosts as any).ec_variable_usd || '0'),
      ecVariableBrl: parseFloat((variableCosts as any).ec_variable_usd || '0') * parseFloat(fxRate.usd_to_brl || '0'),
      ruPerLeg: parseFloat((variableCosts as any).ru_per_leg || '0'),
      ccrPerLeg: parseFloat((variableCosts as any).ccr_per_leg || '0'),
      ruCcrPerHour: avgLegTime > 0 ? parseFloat(((parseFloat((variableCosts as any).ru_per_leg || '0') + parseFloat((variableCosts as any).ccr_per_leg || '0')) / avgLegTime).toFixed(2)) : 0,
    } : null;

    return {
      fixedCostPerHour: parseFloat(fixedCostPerHour.toFixed(2)),
      variableCostPerHour: parseFloat(variableCostPerHour.toFixed(2)),
      totalBaseCostPerHour: parseFloat(totalBaseCostPerHour.toFixed(2)),
      fxRate: parseFloat(fxRate.usd_to_brl || '0'),
      monthlyHours: monthlyHours,
      fixedBreakdown,
      variableBreakdown,
    };
  }

  /**
   * Calcula o custo por perna
   */
  static async calculateLegCost(aircraftId: string, legTime?: number, routeId: string | null = null) {
    const aircraft = await Aircraft.findById(aircraftId);
    const baseCost = await this.calculateBaseCostPerHour(aircraftId);
    const fxRate = await FxRate.getCurrent();

    const actualLegTime = legTime || parseFloat((aircraft as any).avg_leg_time || '0');
    if (actualLegTime === 0) {
      throw new Error('Leg time must be provided or aircraft must have avg_leg_time configured');
    }

    let deceaPerHour = 0;
    let route = null;

    if (routeId) {
      route = await Route.findById(routeId);
      if (route) {
        deceaPerHour = parseFloat((route as any).decea_per_hour || '0');
      }
    }

    const costPerHour = baseCost.totalBaseCostPerHour + deceaPerHour;
    const legCost = costPerHour * actualLegTime;

    // Calcular valores totais da perna para cada componente
    const fixedLegCost = baseCost.fixedCostPerHour * actualLegTime;
    const variableLegCost = baseCost.variableCostPerHour * actualLegTime;
    const deceaLegCost = deceaPerHour * actualLegTime;

    return {
      legTime: parseFloat(actualLegTime.toFixed(2)),
      baseCostPerHour: baseCost.totalBaseCostPerHour,
      deceaPerHour: parseFloat(deceaPerHour.toFixed(2)),
      totalCostPerHour: parseFloat(costPerHour.toFixed(2)),
      totalLegCost: parseFloat(legCost.toFixed(2)),
      fixedCostPerHour: baseCost.fixedCostPerHour,
      variableCostPerHour: baseCost.variableCostPerHour,
      fixedLegCost: parseFloat(fixedLegCost.toFixed(2)),
      variableLegCost: parseFloat(variableLegCost.toFixed(2)),
      deceaLegCost: parseFloat(deceaLegCost.toFixed(2)),
      route: route ? {
        id: route.id,
        origin: (route as any).origin,
        destination: (route as any).destination
      } : null,
      fxRate: parseFloat(fxRate.usd_to_brl || '0'),
      fixedBreakdown: baseCost.fixedBreakdown,
      variableBreakdown: baseCost.variableBreakdown,
      monthlyHours: baseCost.monthlyHours,
    };
  }
}

