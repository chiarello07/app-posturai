// src/lib/training/decisionAuditor.ts

/**
 * Sistema de Auditoria de Decisões
 * Rastreia todas as decisões do algoritmo de geração de treino
 * Baseado no documento do Diego Vanti - Requisito obrigatório
 */

import type { DecisionTrace } from '@/types/training';

/**
 * Tipo para nível de severidade (mapeado internamente)
 */
type InternalSeverity = 'info' | 'warning' | 'critical';

/**
 * Mapeia severidade interna para tipo esperado
 */
function mapSeverity(internal: InternalSeverity): 'low' | 'medium' | 'high' {
  const mapping: Record<InternalSeverity, 'low' | 'medium' | 'high'> = {
    'info': 'low',
    'warning': 'medium',
    'critical': 'high'
  };
  return mapping[internal];
}

/**
 * Classe para gerenciar o trace de decisões
 */
export class DecisionAuditor {
  private traces: DecisionTrace[] = [];

  /**
   * Registra uma decisão tomada pelo sistema
   */
  log(
    ruleId: string,
    why: string,
    references: string[],
    inputsUsed: Record<string, any>,
    severity: InternalSeverity = 'info'
  ): void {
    this.traces.push({
      step: ruleId, // ✅ AJUSTADO: ruleId → step
      input: inputsUsed, // ✅ AJUSTADO: inputsUsed → input
      output: { references }, // ✅ AJUSTADO: references vai para output
      reasoning: why, // ✅ AJUSTADO: why → reasoning
      confidence: severity === 'critical' ? 1.0 : severity === 'warning' ? 0.8 : 0.6,
      ruleId: ruleId, // ✅ Mantido no campo opcional
      severity: mapSeverity(severity), // ✅ CORRIGIDO: Mapeia para 'low' | 'medium' | 'high'
    });
  }

  /**
   * Obtém todos os traces registrados
   */
  getTraces(): DecisionTrace[] {
    return [...this.traces];
  }

  /**
   * Obtém traces por severidade
   */
  getTracesBySeverity(severity: InternalSeverity): DecisionTrace[] {
    const mappedSeverity = mapSeverity(severity);
    return this.traces.filter(t => t.severity === mappedSeverity);
  }

  /**
   * Gera relatório de auditoria em formato JSON
   */
  generateReport(): string {
    return JSON.stringify({
      totalDecisions: this.traces.length,
      criticalDecisions: this.getTracesBySeverity('critical').length,
      warningDecisions: this.getTracesBySeverity('warning').length,
      infoDecisions: this.getTracesBySeverity('info').length,
      traces: this.traces
    }, null, 2);
  }

  /**
   * Valida se todas as decisões críticas foram registradas
   */
  validateCompleteness(requiredRuleIds: string[]): {
    isComplete: boolean;
    missingRules: string[];
  } {
    const registeredRuleIds = new Set(this.traces.map(t => t.ruleId).filter(Boolean)); // ✅ CORRIGIDO: filter(Boolean) para remover undefined
    const missingRules = requiredRuleIds.filter(ruleId => !registeredRuleIds.has(ruleId));

    return {
      isComplete: missingRules.length === 0,
      missingRules
    };
  }

  /**
   * Limpa todos os traces (usar ao iniciar novo plano)
   */
  clear(): void {
    this.traces = [];
  }
}

/**
 * Regras obrigatórias que devem ser registradas (P0)
 */
export const REQUIRED_RULE_IDS = [
  'SPLIT_SELECTION',           // Escolha do split baseado em nível + frequência
  'VOLUME_CALCULATION',        // Cálculo de volume por grupo muscular
  'EXERCISE_SELECTION',        // Seleção de exercícios do catálogo
  'HEALTH_RESTRICTIONS',       // Exclusão de exercícios por problemas de saúde
  'POSTURAL_ADAPTATIONS',      // Adaptações baseadas em desvios posturais
  'PROGRESSION_STRATEGY',      // Estratégia de progressão escolhida
  'REST_DAYS_PLANNING'         // Planejamento de dias sem musculação
];

/**
 * Helper: Criar auditor para um novo plano
 */
export function createAuditor(): DecisionAuditor {
  return new DecisionAuditor();
}

/**
 * Helper: Logar decisão de seleção de split
 */
export function logSplitSelection(
  auditor: DecisionAuditor,
  level: string,
  frequency: number,
  selectedSplit: string,
  reason: string
): void {
  auditor.log(
    'SPLIT_SELECTION',
    reason,
    ['Diego Vanti - Documento de Templates Semanais'],
    { level, frequency, selectedSplit },
    'critical'
  );
}

/**
 * Helper: Logar cálculo de volume
 */
export function logVolumeCalculation(
  auditor: DecisionAuditor,
  muscleGroup: string,
  setsPerWeek: number,
  reason: string
): void {
  auditor.log(
    'VOLUME_CALCULATION',
    reason,
    ['Diego Vanti - Documento de Periodização', 'Literatura científica: Schoenfeld et al.'],
    { muscleGroup, setsPerWeek },
    'critical'
  );
}

/**
 * Helper: Logar seleção de exercícios
 */
export function logExerciseSelection(
  auditor: DecisionAuditor,
  muscleGroup: string,
  selectedExercises: string[],
  reason: string
): void {
  auditor.log(
    'EXERCISE_SELECTION',
    reason,
    ['Diego Vanti - Documento de Database de Exercícios'],
    { muscleGroup, selectedExercises },
    'info'
  );
}

/**
 * Helper: Logar restrições de saúde
 */
export function logHealthRestrictions(
  auditor: DecisionAuditor,
  healthProblem: string,
  excludedExercises: string[],
  reason: string
): void {
  auditor.log(
    'HEALTH_RESTRICTIONS',
    reason,
    ['Diego Vanti - Triagem de Segurança P0'],
    { healthProblem, excludedExercises },
    'critical'
  );
}

/**
 * Helper: Logar adaptações posturais
 */
export function logPosturalAdaptations(
  auditor: DecisionAuditor,
  deviation: string,
  adaptations: { strengthen: string[]; avoid: string[] },
  reason: string
): void {
  auditor.log(
    'POSTURAL_ADAPTATIONS',
    reason,
    ['Diego Vanti - Mapa Postural', 'posturalMappings.ts'],
    { deviation, adaptations },
    'warning'
  );
}

/**
 * Helper: Logar estratégia de progressão
 */
export function logProgressionStrategy(
  auditor: DecisionAuditor,
  level: string,
  strategy: string,
  reason: string
): void {
  auditor.log(
    'PROGRESSION_STRATEGY',
    reason,
    ['Diego Vanti - Documento de Periodização'],
    { level, strategy },
    'critical'
  );
}

/**
 * Helper: Logar planejamento de dias de descanso
 */
export function logRestDaysPlanning(
  auditor: DecisionAuditor,
  trainingDays: number,
  restDays: number,
  restPlan: string[],
  reason: string
): void {
  auditor.log(
    'REST_DAYS_PLANNING',
    reason,
    ['Diego Vanti - Dias sem Musculação'],
    { trainingDays, restDays, restPlan },
    'info'
  );
}

/**
 * Helper: Validar auditoria completa ao final da geração
 */
export function validateAudit(auditor: DecisionAuditor): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  // Verificar se todas as regras obrigatórias foram registradas
  const validation = auditor.validateCompleteness(REQUIRED_RULE_IDS);
  
  if (!validation.isComplete) {
    errors.push(`Regras obrigatórias não registradas: ${validation.missingRules.join(', ')}`);
  }

  // Verificar se há pelo menos 1 decisão crítica
  const criticalDecisions = auditor.getTracesBySeverity('critical');
  if (criticalDecisions.length === 0) {
    errors.push('Nenhuma decisão crítica foi registrada');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}