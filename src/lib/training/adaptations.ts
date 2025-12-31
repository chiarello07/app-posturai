// src/lib/training/adaptations.ts
import { PosturalAnalysis } from '@/types';

export interface AdaptationRule {
    condition: (analysis: PosturalAnalysis) => boolean;
    modifications: {
        exercisesToAvoid?: string[];
        exercisesToPrioritize?: string[];
        volumeAdjustment?: number;
        intensityAdjustment?: number;
        techniqueNotes?: string[];
    };
}

export const ADAPTATION_RULES: AdaptationRule[] = [
    // HIPERLORDOSE LOMBAR
    {
        condition: (analysis) => 
            analysis.deviations.some(d => 
                d.name === 'Hiperlordose Lombar' && d.severity === 'high'
            ),
        modifications: {
            exercisesToAvoid: [
                'Agachamento Livre',
                'Stiff',
                'Levantamento Terra',
                'Remada Curvada'
            ],
            exercisesToPrioritize: [
                'Prancha Abdominal',
                'Ponte Glúteo',
                'Cat-Cow',
                'Dead Bug'
            ],
            volumeAdjustment: 0.8,
            techniqueNotes: [
                'Manter core ativado durante todos os exercícios',
                'Evitar hiperextensão lombar',
                'Focar em exercícios de estabilização'
            ]
        }
    },
    {
        condition: (analysis) => 
            analysis.deviations.some(d => 
                d.name === 'Hiperlordose Lombar' && d.severity === 'medium'
            ),
        modifications: {
            exercisesToPrioritize: [
                'Prancha Abdominal',
                'Ponte Glúteo',
                'Agachamento Goblet'
            ],
            intensityAdjustment: 0.9,
            techniqueNotes: [
                'Atenção à posição neutra da coluna',
                'Fortalecer abdômen e glúteos'
            ]
        }
    },

    // HIPERCIFOSE TORÁCICA
    {
        condition: (analysis) => 
            analysis.deviations.some(d => 
                d.name === 'Hipercifose Torácica' && d.severity === 'high'
            ),
        modifications: {
            exercisesToAvoid: [
                'Supino Reto',
                'Crucifixo',
                'Desenvolvimento com Barra'
            ],
            exercisesToPrioritize: [
                'Remada Alta',
                'Face Pull',
                'Alongamento de Peitoral',
                'Extensão Torácica'
            ],
            volumeAdjustment: 0.85,
            techniqueNotes: [
                'Priorizar exercícios de retração escapular',
                'Alongar musculatura anterior do tórax',
                'Fortalecer romboides e trapézio médio'
            ]
        }
    },

    // OMBROS PROTUSOS
    {
        condition: (analysis) => 
            analysis.deviations.some(d => 
                d.name === 'Ombros Protusos' && d.severity === 'high'
            ),
        modifications: {
            exercisesToAvoid: [
                'Supino Reto',
                'Desenvolvimento Frontal'
            ],
            exercisesToPrioritize: [
                'Remada Sentada',
                'Face Pull',
                'Y-T-W',
                'Rotação Externa com Elástico'
            ],
            techniqueNotes: [
                'Fortalecer rotadores externos do ombro',
                'Alongar peitoral menor',
                'Trabalhar estabilizadores da escápula'
            ]
        }
    },

    // CABEÇA ANTERIORIZADA
    {
        condition: (analysis) => 
            analysis.deviations.some(d => 
                d.name === 'Cabeça Anteriorizada' && d.severity === 'high'
            ),
        modifications: {
            exercisesToPrioritize: [
                'Chin Tuck',
                'Flexão Cervical Isométrica',
                'Alongamento de Trapézio Superior'
            ],
            techniqueNotes: [
                'Manter alinhamento cervical em todos os exercícios',
                'Fortalecer flexores profundos do pescoço',
                'Alongar musculatura posterior do pescoço'
            ]
        }
    },

    // ESCOLIOSE
    {
        condition: (analysis) => 
            analysis.deviations.some(d => 
                d.name === 'Escoliose' && d.severity === 'high'
            ),
        modifications: {
            exercisesToAvoid: [
                'Levantamento Terra',
                'Agachamento com Barra nas Costas'
            ],
            exercisesToPrioritize: [
                'Exercícios Unilaterais',
                'Prancha Lateral',
                'Bird Dog'
            ],
            volumeAdjustment: 0.75,
            intensityAdjustment: 0.8,
            techniqueNotes: [
                'Priorizar exercícios unilaterais para correção de assimetrias',
                'Trabalhar estabilização de core',
                'Consultar especialista para progressão'
            ]
        }
    },

    // JOELHOS VALGOS
    {
        condition: (analysis) => 
            analysis.deviations.some(d => 
                d.name === 'Joelhos Valgos' && d.severity === 'high'
            ),
        modifications: {
            exercisesToAvoid: [
                'Agachamento Profundo',
                'Leg Press com Carga Alta'
            ],
            exercisesToPrioritize: [
                'Abdução de Quadril',
                'Agachamento com Mini Band',
                'Step Up'
            ],
            techniqueNotes: [
                'Fortalecer abdutores de quadril',
                'Trabalhar controle neuromuscular',
                'Usar feedback visual (espelho)'
            ]
        }
    },

    // JOELHOS VAROS
    {
        condition: (analysis) => 
            analysis.deviations.some(d => 
                d.name === 'Joelhos Varos' && d.severity === 'high'
            ),
        modifications: {
            exercisesToPrioritize: [
                'Adução de Quadril',
                'Agachamento Sumo',
                'Alongamento de TFL'
            ],
            techniqueNotes: [
                'Fortalecer adutores',
                'Alongar musculatura lateral da coxa',
                'Trabalhar mobilidade de quadril'
            ]
        }
    },

    // PÉS PLANOS
    {
        condition: (analysis) => 
            analysis.deviations.some(d => 
                d.name === 'Pés Planos' && d.severity === 'high'
            ),
        modifications: {
            exercisesToPrioritize: [
                'Elevação de Calcanhares',
                'Short Foot Exercise',
                'Caminhada na Ponta dos Pés'
            ],
            techniqueNotes: [
                'Fortalecer musculatura intrínseca do pé',
                'Usar calçado adequado durante treinos',
                'Trabalhar propriocepção'
            ]
        }
    },

    // PÉS CAVOS
    {
        condition: (analysis) => 
            analysis.deviations.some(d => 
                d.name === 'Pés Cavos' && d.severity === 'high'
            ),
        modifications: {
            exercisesToPrioritize: [
                'Alongamento de Panturrilha',
                'Mobilização de Tornozelo',
                'Exercícios de Equilíbrio'
            ],
            techniqueNotes: [
                'Alongar musculatura posterior da perna',
                'Melhorar mobilidade de tornozelo',
                'Usar palmilhas se necessário'
            ]
        }
    }
];

export function applyAdaptations(
    baseProgram: any,
    analysis: PosturalAnalysis
): any {
    let adaptedProgram = { ...baseProgram };

    // Aplicar todas as regras de adaptação relevantes
    ADAPTATION_RULES.forEach(rule => {
        if (rule.condition(analysis)) {
            const { modifications } = rule;

            // Remover exercícios a evitar
            if (modifications.exercisesToAvoid) {
                adaptedProgram.workouts = adaptedProgram.workouts.map((workout: any) => ({
                    ...workout,
                    exercises: workout.exercises.filter((ex: any) => 
                        !modifications.exercisesToAvoid!.includes(ex.name)
                    )
                }));
            }

            // Adicionar exercícios prioritários
            if (modifications.exercisesToPrioritize) {
                // Lógica para adicionar exercícios prioritários
                // (implementar conforme necessidade)
            }

            // Ajustar volume
            if (modifications.volumeAdjustment) {
                adaptedProgram.workouts = adaptedProgram.workouts.map((workout: any) => ({
                    ...workout,
                    exercises: workout.exercises.map((ex: any) => ({
                        ...ex,
                        sets: Math.ceil(ex.sets * modifications.volumeAdjustment!)
                    }))
                }));
            }

            // Ajustar intensidade
            if (modifications.intensityAdjustment) {
                adaptedProgram.workouts = adaptedProgram.workouts.map((workout: any) => ({
                    ...workout,
                    exercises: workout.exercises.map((ex: any) => ({
                        ...ex,
                        intensity: ex.intensity * modifications.intensityAdjustment!
                    }))
                }));
            }

            // Adicionar notas técnicas
            if (modifications.techniqueNotes) {
                adaptedProgram.techniqueNotes = [
                    ...(adaptedProgram.techniqueNotes || []),
                    ...modifications.techniqueNotes
                ];
            }
        }
    });

    return adaptedProgram;
}