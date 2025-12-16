// src/lib/training/yearlyPeriodization.ts
import { PosturalAnalysis, UserProfile } from '@/types';

export type MacrocyclePhase = 
    | 'Adaptação Anatômica'
    | 'Hipertrofia'
    | 'Força'
    | 'Potência'
    | 'Transição';

export interface Mesocycle {
    id: string;
    phase: MacrocyclePhase;
    startDate: string;
    endDate: string;
    weekNumber: number;
    duration: number; // em semanas
    focus: string[];
    volumeIntensity: {
        volume: 'low' | 'moderate' | 'high';
        intensity: 'low' | 'moderate' | 'high';
    };
    goals: string[];
    exercises: {
        corrective: number;
        strength: number;
        mobility: number;
        cardio: number;
    };
    deloadWeek?: boolean;
}

export interface YearlyPeriodization {
    startDate: string;
    endDate: string;
    totalWeeks: number;
    mesocycles: Mesocycle[];
    evaluationWeeks: number[];
    deloadWeeks: number[];
}

/**
 * Gera periodização anual completa baseada em análise postural
 * Segue modelo de Bompa adaptado para correção postural
 */
export function generateYearlyPeriodization(
    userProfile: UserProfile,
    analysis: PosturalAnalysis,
    startDate: Date = new Date()
): YearlyPeriodization {
    const totalWeeks = 48; // 12 meses - 4 semanas de avaliação
    const mesocycles: Mesocycle[] = [];
    let currentWeek = 0;
    
    const riskLevel = analysis.riskLevel;
    const hasGraveDeviations = analysis.deviations.some(d => d.severity === 'Grave');

    // FASE 1: ADAPTAÇÃO ANATÔMICA (4-8 semanas)
    const adaptationDuration = hasGraveDeviations ? 8 : 4;
    mesocycles.push(
        createMesocycle({
            id: 'meso-1',
            phase: 'Adaptação Anatômica',
            startWeek: currentWeek,
            duration: adaptationDuration,
            startDate,
            focus: [
                'Preparação de tendões e ligamentos',
                'Aprendizado de padrões de movimento',
                'Correção de desvios posturais básicos',
                'Estabelecimento de base aeróbica'
            ],
            volumeIntensity: { volume: 'moderate', intensity: 'low' },
            goals: [
                'Reduzir dores posturais',
                'Melhorar consciência corporal',
                'Estabelecer técnica correta',
                'Preparar corpo para cargas progressivas'
            ],
            exercises: {
                corrective: 50,
                strength: 20,
                mobility: 20,
                cardio: 10
            }
        })
    );
    currentWeek += adaptationDuration;

    // AVALIAÇÃO 1
    const evaluationWeeks = [currentWeek];
    currentWeek += 1;

    // FASE 2: HIPERTROFIA 1 (4 semanas)
    mesocycles.push(
        createMesocycle({
            id: 'meso-2',
            phase: 'Hipertrofia',
            startWeek: currentWeek,
            duration: 4,
            startDate,
            focus: [
                'Ganho de massa muscular',
                'Fortalecimento de músculos posturais',
                'Correção de assimetrias',
                'Volume moderado-alto'
            ],
            volumeIntensity: { volume: 'high', intensity: 'moderate' },
            goals: [
                'Aumentar massa muscular em áreas deficientes',
                'Equilibrar musculatura agonista/antagonista',
                'Melhorar suporte postural'
            ],
            exercises: {
                corrective: 30,
                strength: 50,
                mobility: 15,
                cardio: 5
            }
        })
    );
    currentWeek += 4;

    // DELOAD 1
    mesocycles.push(
        createDeloadMesocycle({
            id: 'meso-deload-1',
            phase: 'Transição',
            startWeek: currentWeek,
            startDate
        })
    );
    const deloadWeeks = [currentWeek];
    currentWeek += 1;

    // FASE 3: HIPERTROFIA 2 (4 semanas)
    mesocycles.push(
        createMesocycle({
            id: 'meso-3',
            phase: 'Hipertrofia',
            startWeek: currentWeek,
            duration: 4,
            startDate,
            focus: [
                'Continuação de ganho muscular',
                'Aumento de intensidade',
                'Refinamento técnico',
                'Progressão de carga'
            ],
            volumeIntensity: { volume: 'high', intensity: 'moderate' },
            goals: [
                'Consolidar ganhos musculares',
                'Aumentar força relativa',
                'Manter correções posturais'
            ],
            exercises: {
                corrective: 25,
                strength: 55,
                mobility: 15,
                cardio: 5
            }
        })
    );
    currentWeek += 4;

    // AVALIAÇÃO 2
    evaluationWeeks.push(currentWeek);
    currentWeek += 1;

    // FASE 4: FORÇA 1 (4 semanas)
    mesocycles.push(
        createMesocycle({
            id: 'meso-4',
            phase: 'Força',
            startWeek: currentWeek,
            duration: 4,
            startDate,
            focus: [
                'Desenvolvimento de força máxima',
                'Baixo volume, alta intensidade',
                'Movimentos compostos',
                'Estabilização avançada'
            ],
            volumeIntensity: { volume: 'moderate', intensity: 'high' },
            goals: [
                'Aumentar força máxima',
                'Melhorar eficiência neuromuscular',
                'Consolidar padrões motores'
            ],
            exercises: {
                corrective: 20,
                strength: 65,
                mobility: 10,
                cardio: 5
            }
        })
    );
    currentWeek += 4;

    // DELOAD 2
    mesocycles.push(
        createDeloadMesocycle({
            id: 'meso-deload-2',
            phase: 'Transição',
            startWeek: currentWeek,
            startDate
        })
    );
    deloadWeeks.push(currentWeek);
    currentWeek += 1;

    // FASE 5: FORÇA 2 (4 semanas)
    mesocycles.push(
        createMesocycle({
            id: 'meso-5',
            phase: 'Força',
            startWeek: currentWeek,
            duration: 4,
            startDate,
            focus: [
                'Pico de força',
                'Cargas máximas',
                'Técnica perfeita',
                'Prevenção de lesões'
            ],
            volumeIntensity: { volume: 'low', intensity: 'high' },
            goals: [
                'Atingir pico de força',
                'Manter integridade postural sob carga',
                'Preparar para fase de potência'
            ],
            exercises: {
                corrective: 15,
                strength: 70,
                mobility: 10,
                cardio: 5
            }
        })
    );
    currentWeek += 4;

    // AVALIAÇÃO 3
    evaluationWeeks.push(currentWeek);
    currentWeek += 1;

    // FASE 6: POTÊNCIA (4 semanas) - Opcional para atletas
    if (userProfile.goals?.includes('performance') || userProfile.activityLevel === 'Muito Ativo') {
        mesocycles.push(
            createMesocycle({
                id: 'meso-6',
                phase: 'Potência',
                startWeek: currentWeek,
                duration: 4,
                startDate,
                focus: [
                    'Desenvolvimento de potência',
                    'Movimentos explosivos',
                    'Transferência para esporte',
                    'Velocidade de execução'
                ],
                volumeIntensity: { volume: 'low', intensity: 'high' },
                goals: [
                    'Aumentar potência muscular',
                    'Melhorar performance atlética',
                    'Otimizar velocidade de contração'
                ],
                exercises: {
                    corrective: 10,
                    strength: 60,
                    mobility: 10,
                    cardio: 20
                }
            })
        );
        currentWeek += 4;
    } else {
        // Para não-atletas, repetir ciclo Hipertrofia-Força
        mesocycles.push(
            createMesocycle({
                id: 'meso-6',
                phase: 'Hipertrofia',
                startWeek: currentWeek,
                duration: 4,
                startDate,
                focus: [
                    'Manutenção de ganhos',
                    'Refinamento muscular',
                    'Prevenção de platô',
                    'Variação de estímulos'
                ],
                volumeIntensity: { volume: 'high', intensity: 'moderate' },
                goals: [
                    'Manter massa muscular',
                    'Prevenir adaptação',
                    'Consolidar correções posturais'
                ],
                exercises: {
                    corrective: 20,
                    strength: 60,
                    mobility: 15,
                    cardio: 5
                }
            })
        );
        currentWeek += 4;
    }

    // DELOAD 3
    mesocycles.push(
        createDeloadMesocycle({
            id: 'meso-deload-3',
            phase: 'Transição',
            startWeek: currentWeek,
            startDate
        })
    );
    deloadWeeks.push(currentWeek);
    currentWeek += 1;

    // REPETIR CICLO para completar 48 semanas
    const remainingWeeks = totalWeeks - currentWeek;
    if (remainingWeeks > 0) {
        // Ciclo 2: Hipertrofia + Força (simplificado)
        const cycle2Duration = Math.min(remainingWeeks, 12);
        
        mesocycles.push(
            createMesocycle({
                id: 'meso-7',
                phase: 'Hipertrofia',
                startWeek: currentWeek,
                duration: 4,
                startDate,
                focus: ['Manutenção e refinamento'],
                volumeIntensity: { volume: 'high', intensity: 'moderate' },
                goals: ['Consolidar resultados'],
                exercises: { corrective: 20, strength: 60, mobility: 15, cardio: 5 }
            })
        );
        currentWeek += 4;

        evaluationWeeks.push(currentWeek);
        currentWeek += 1;

        if (currentWeek < totalWeeks) {
            mesocycles.push(
                createMesocycle({
                    id: 'meso-8',
                    phase: 'Força',
                    startWeek: currentWeek,
                    duration: Math.min(4, totalWeeks - currentWeek),
                    startDate,
                    focus: ['Manutenção de força'],
                    volumeIntensity: { volume: 'moderate', intensity: 'high' },
                    goals: ['Manter ganhos de força'],
                    exercises: { corrective: 15, strength: 70, mobility: 10, cardio: 5 }
                })
            );
        }
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (totalWeeks * 7));

    return {
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        totalWeeks,
        mesocycles,
        evaluationWeeks,
        deloadWeeks
    };
}

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

interface MesocycleParams {
    id: string;
    phase: MacrocyclePhase;
    startWeek: number;
    duration: number;
    startDate: Date;
    focus: string[];
    volumeIntensity: { volume: 'low' | 'moderate' | 'high'; intensity: 'low' | 'moderate' | 'high' };
    goals: string[];
    exercises: { corrective: number; strength: number; mobility: number; cardio: number };
}

function createMesocycle(params: MesocycleParams): Mesocycle {
    const startDate = new Date(params.startDate);
    startDate.setDate(startDate.getDate() + (params.startWeek * 7));
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + (params.duration * 7) - 1);

    return {
        id: params.id,
        phase: params.phase,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        weekNumber: params.startWeek + 1,
        duration: params.duration,
        focus: params.focus,
        volumeIntensity: params.volumeIntensity,
        goals: params.goals,
        exercises: params.exercises
    };
}

function createDeloadMesocycle(params: {
    id: string;
    phase: MacrocyclePhase;
    startWeek: number;
    startDate: Date;
}): Mesocycle {
    const startDate = new Date(params.startDate);
    startDate.setDate(startDate.getDate() + (params.startWeek * 7));
    
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    return {
        id: params.id,
        phase: params.phase,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        weekNumber: params.startWeek + 1,
        duration: 1,
        focus: [
            'Recuperação ativa',
            'Redução de volume e intensidade',
            'Prevenção de overtraining',
            'Regeneração muscular'
        ],
        volumeIntensity: { volume: 'low', intensity: 'low' },
        goals: [
            'Permitir recuperação completa',
            'Prevenir fadiga acumulada',
            'Preparar para próximo ciclo'
        ],
        exercises: {
            corrective: 30,
            strength: 30,
            mobility: 30,
            cardio: 10
        },
        deloadWeek: true
    };
}

/**
 * Retorna mesociclo atual baseado na data
 */
export function getCurrentMesocycle(periodization: YearlyPeriodization): Mesocycle | null {
    const now = new Date();
    
    for (const meso of periodization.mesocycles) {
        const start = new Date(meso.startDate);
        const end = new Date(meso.endDate);
        
        if (now >= start && now <= end) {
            return meso;
        }
    }
    
    return null;
}

/**
 * Retorna próximo mesociclo
 */
export function getNextMesocycle(periodization: YearlyPeriodization, currentMeso: Mesocycle): Mesocycle | null {
    const currentIndex = periodization.mesocycles.findIndex(m => m.id === currentMeso.id);
    
    if (currentIndex === -1 || currentIndex === periodization.mesocycles.length - 1) {
        return null;
    }
    
    return periodization.mesocycles[currentIndex + 1];
}

/**
 * Verifica se é semana de avaliação
 */
export function isEvaluationWeek(periodization: YearlyPeriodization, weekNumber: number): boolean {
    return periodization.evaluationWeeks.includes(weekNumber);
}

/**
 * Verifica se é semana de deload
 */
export function isDeloadWeek(periodization: YearlyPeriodization, weekNumber: number): boolean {
    return periodization.deloadWeeks.includes(weekNumber);
}

/**
 * Calcula progresso no plano anual
 */
export function calculateYearlyProgress(periodization: YearlyPeriodization): number {
    const start = new Date(periodization.startDate);
    const end = new Date(periodization.endDate);
    const now = new Date();
    
    if (now < start) return 0;
    if (now > end) return 100;
    
    const totalDuration = end.getTime() - start.getTime();
    const elapsed = now.getTime() - start.getTime();
    
    return Math.round((elapsed / totalDuration) * 100);
}