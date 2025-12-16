// src/lib/training/scientificReference.ts

export interface ScientificReference {
    id: string;
    authors: string[];
    year: number;
    title: string;
    publisher?: string;
    journal?: string;
    edition?: string;
    doi?: string;
    keyFindings: string[];
    relevance: string;
    type: 'book' | 'journal' | 'video';
}

export const SCIENTIFIC_REFERENCES: Record<string, ScientificReference> = {
    // ========================================
    // REFERÊNCIAS BRASILEIRAS (BASE POSTURAI)
    // ========================================
    
    verderi2012: {
        id: 'verderi2012',
        authors: ['Verderi, Érica Beatriz Lemes Pimentel'],
        year: 2012,
        title: 'Treinamento Funcional com Bola',
        publisher: 'Phorte',
        type: 'book',
        keyFindings: [
            'Exercícios funcionais melhoram estabilidade e coordenação',
            'Uso de bola suíça para fortalecimento de core',
            'Progressões de exercícios para diferentes níveis'
        ],
        relevance: 'Base para exercícios de estabilização e core no PosturAI'
    },

    carnaval: {
        id: 'carnaval',
        authors: ['Carnaval, Paulo Eduardo'],
        year: 1995,
        title: 'Medidas e avaliação em ciências do esporte',
        publisher: 'Sprint',
        edition: '7ª Edição',
        type: 'book',
        keyFindings: [
            'Protocolos de avaliação física padronizados',
            'Métodos de mensuração de composição corporal',
            'Testes de aptidão física e performance'
        ],
        relevance: 'Metodologia de avaliação inicial e acompanhamento de progresso'
    },

    acsm2021: {
        id: 'acsm2021',
        authors: ['American College of Sports Medicine', 'Liguori, Gary'],
        year: 2021,
        title: "ACSM's Guidelines for Exercise Testing and Prescription",
        publisher: 'Wolters Kluwer',
        edition: '11ª Edição',
        type: 'book',
        keyFindings: [
            'Diretrizes baseadas em evidências para prescrição de exercícios',
            'Protocolos de segurança e contraindicações',
            'Recomendações para populações especiais',
            'Frequência, intensidade, tempo e tipo de exercício (FITT)'
        ],
        relevance: 'Padrão-ouro para prescrição segura e eficaz de exercícios no PosturAI'
    },

    araujo2004: {
        id: 'araujo2004',
        authors: ['Araújo, Claudio Gil Soares de'],
        year: 2004,
        title: 'Flexiteste - um método completo para avaliar a flexibilidade',
        publisher: 'Editora Manole Saúde',
        edition: '1ª Edição',
        type: 'book',
        keyFindings: [
            'Método sistemático de avaliação de flexibilidade',
            'Avaliação de 20 movimentos articulares',
            'Identificação de assimetrias e limitações'
        ],
        relevance: 'Protocolo de avaliação de flexibilidade e mobilidade articular'
    },

    nieman: {
        id: 'nieman',
        authors: ['Nieman, David C.'],
        year: 2011,
        title: 'Exercício e saúde: Teste E Prescrição De Exercícios',
        publisher: 'Editora Manole Saúde',
        edition: '6ª Edição',
        type: 'book',
        keyFindings: [
            'Relação entre exercício e saúde',
            'Testes de aptidão física',
            'Prescrição individualizada de exercícios',
            'Prevenção de doenças através do exercício'
        ],
        relevance: 'Fundamentação científica para prescrição personalizada de treinos'
    },

    verderi2011: {
        id: 'verderi2011',
        authors: ['Verderi, Érica Beatriz Lemes Pimentel'],
        year: 2011,
        title: 'Programa de Educação Postural',
        publisher: 'Phorte',
        type: 'book',
        keyFindings: [
            'Avaliação postural sistemática',
            'Exercícios corretivos para desvios posturais',
            'Educação e consciência corporal',
            'Prevenção de dores e lesões relacionadas à postura'
        ],
        relevance: 'Metodologia central de análise postural e correção de desvios no PosturAI'
    },

    kisner2021: {
        id: 'kisner2021',
        authors: ['Kisner, Carolyn', 'Colby, Lynn Allen', 'Borstad, John'],
        year: 2021,
        title: 'Exercícios Terapêuticos: Fundamentos e Técnicas',
        publisher: 'Editora Manole Saúde',
        edition: '7ª Edição',
        type: 'book',
        keyFindings: [
            'Fundamentos de exercícios terapêuticos',
            'Técnicas de alongamento e fortalecimento',
            'Exercícios para reabilitação de lesões',
            'Progressão terapêutica baseada em evidências',
            'Exercícios específicos para cada articulação e região corporal'
        ],
        relevance: 'Base científica para exercícios corretivos e terapêuticos no programa de treino'
    },

    // ========================================
    // REFERÊNCIAS INTERNACIONAIS (ELITE)
    // ========================================

    schoenfeld2021: {
        id: 'schoenfeld2021',
        authors: ['Schoenfeld, B.J.', 'Grgic, J.', 'Krieger, J.'],
        year: 2021,
        title: 'How many times per week should a muscle be trained to maximize muscle hypertrophy? A systematic review and meta-analysis',
        journal: 'Journal of Sports Sciences',
        doi: '10.1080/02640414.2021.1891782',
        type: 'journal',
        keyFindings: [
            'Frequência de treino de 2x/semana por grupo muscular é ideal para hipertrofia',
            'Volume semanal equalizado produz resultados similares independente da frequência',
            'Distribuição do volume ao longo da semana pode otimizar recuperação'
        ],
        relevance: 'Base para periodização e frequência de treino no PosturAI'
    },

    schoenfeld2017: {
        id: 'schoenfeld2017',
        authors: ['Schoenfeld, B.J.', 'Ogborn, D.', 'Krieger, J.W.'],
        year: 2017,
        title: 'Dose-response relationship between weekly resistance training volume and increases in muscle mass',
        journal: 'Journal of Sports Medicine',
        doi: '10.1007/s40279-017-0711-y',
        type: 'journal',
        keyFindings: [
            'Relação dose-resposta entre volume e hipertrofia até ~10 séries/grupo/semana',
            'Volumes superiores podem trazer benefícios adicionais em indivíduos treinados',
            'Individualização é crucial para otimizar volume de treino'
        ],
        relevance: 'Determina volume de treino personalizado baseado em nível de condicionamento'
    },

    kendall2005: {
        id: 'kendall2005',
        authors: ['Kendall, F.P.', 'McCreary, E.K.', 'Provance, P.G.'],
        year: 2005,
        title: 'Muscles: Testing and Function with Posture and Pain',
        publisher: 'Lippincott Williams & Wilkins',
        type: 'book',
        keyFindings: [
            'Avaliação postural baseada em pontos de referência anatômicos',
            'Relação entre desvios posturais e desequilíbrios musculares',
            'Protocolos de correção através de fortalecimento e alongamento específicos'
        ],
        relevance: 'Metodologia de análise postural e correção de desvios'
    },

    sahrmann2002: {
        id: 'sahrmann2002',
        authors: ['Sahrmann, S.A.'],
        year: 2002,
        title: 'Diagnosis and Treatment of Movement Impairment Syndromes',
        publisher: 'Mosby',
        type: 'book',
        keyFindings: [
            'Síndromes de movimento relacionadas a padrões posturais',
            'Exercícios específicos para correção de padrões disfuncionais',
            'Importância da consciência corporal na correção postural'
        ],
        relevance: 'Identificação de padrões de movimento e estratégias corretivas'
    },

    bompa2009: {
        id: 'bompa2009',
        authors: ['Bompa, T.O.', 'Haff, G.G.'],
        year: 2009,
        title: 'Periodization: Theory and Methodology of Training',
        publisher: 'Human Kinetics',
        type: 'book',
        keyFindings: [
            'Modelo de periodização linear e ondulatória',
            'Ciclos de adaptação: anatomical adaptation, hypertrophy, strength, power',
            'Importância de deload para recuperação e supercompensação'
        ],
        relevance: 'Estrutura de periodização anual do PosturAI'
    },

    rhea2003: {
        id: 'rhea2003',
        authors: ['Rhea, M.R.', 'Ball, S.D.', 'Phillips, W.T.', 'Burkett, L.N.'],
        year: 2003,
        title: 'A comparison of linear and daily undulating periodized programs with equated volume and intensity',
        journal: 'Journal of Strength and Conditioning Research',
        doi: '10.1519/00124278-200302000-00013',
        type: 'journal',
        keyFindings: [
            'Periodização ondulatória diária superior para ganhos de força',
            'Variação de intensidade e volume otimiza adaptações',
            'Individualização baseada em resposta ao treino'
        ],
        relevance: 'Modelo de variação de intensidade nos mesociclos'
    },

    mcgill2007: {
        id: 'mcgill2007',
        authors: ['McGill, S.M.'],
        year: 2007,
        title: 'Low Back Disorders: Evidence-Based Prevention and Rehabilitation',
        publisher: 'Human Kinetics',
        type: 'book',
        keyFindings: [
            'Importância da estabilização do core para saúde lombar',
            'Exercícios de anti-movimento superiores a exercícios dinâmicos',
            'Progressão de estabilidade para força e potência'
        ],
        relevance: 'Protocolos de fortalecimento de core para correção postural'
    },

    behm2016: {
        id: 'behm2016',
        authors: ['Behm, D.G.', 'Blazevich, A.J.', 'Kay, A.D.', 'McHugh, M.'],
        year: 2016,
        title: 'Acute effects of muscle stretching on physical performance, range of motion, and injury incidence',
        journal: 'Applied Physiology, Nutrition, and Metabolism',
        doi: '10.1139/apnm-2015-0235',
        type: 'journal',
        keyFindings: [
            'Alongamento estático pré-treino pode reduzir força e potência',
            'Alongamento dinâmico é preferível no aquecimento',
            'Alongamento pós-treino melhora flexibilidade sem prejuízo de performance'
        ],
        relevance: 'Timing e tipo de alongamento no programa de treino'
    },

    schoenfeld2013: {
        id: 'schoenfeld2013',
        authors: ['Schoenfeld, B.J.'],
        year: 2013,
        title: 'Postexercise hypertrophic adaptations: a reexamination of the hormone hypothesis',
        journal: 'Journal of Strength and Conditioning Research',
        doi: '10.1519/JSC.0b013e318276f525',
        type: 'journal',
        keyFindings: [
            'Recuperação adequada é essencial para hipertrofia',
            'Janela de 48-72h para recuperação muscular completa',
            'Sono e nutrição são fatores críticos na recuperação'
        ],
        relevance: 'Intervalos de descanso e frequência de treino'
    },

    cook2010: {
        id: 'cook2010',
        authors: ['Cook, G.', 'Burton, L.', 'Hoogenboom, B.J.', 'Voight, M.'],
        year: 2010,
        title: 'Functional movement screening: the use of fundamental movements as an assessment',
        journal: 'International Journal of Sports Physical Therapy',
        type: 'journal',
        keyFindings: [
            'Avaliação de padrões fundamentais de movimento',
            'Identificação de assimetrias e limitações',
            'Exercícios corretivos baseados em screening'
        ],
        relevance: 'Avaliação inicial e seleção de exercícios corretivos'
    },

    kraemer2002: {
        id: 'kraemer2002',
        authors: ['Kraemer, W.J.', 'Ratamess, N.A.'],
        year: 2002,
        title: 'Fundamentals of resistance training: progression and exercise prescription',
        journal: 'Medicine & Science in Sports & Exercise',
        doi: '10.1097/00005768-200204000-00014',
        type: 'journal',
        keyFindings: [
            'Princípio da sobrecarga progressiva para adaptações contínuas',
            'Variação de repetições, séries e intensidade',
            'Especificidade do treino para objetivos específicos'
        ],
        relevance: 'Sistema de progressão automática de carga no app'
    },

    vanderhorst2017: {
        id: 'vanderhorst2017',
        authors: ['van der Horst, N.', 'Smits, D.W.', 'Petersen, J.'],
        year: 2017,
        title: 'The preventive effect of the nordic hamstring exercise on hamstring injuries',
        journal: 'British Journal of Sports Medicine',
        doi: '10.1136/bjsports-2016-096527',
        type: 'journal',
        keyFindings: [
            'Exercícios excêntricos reduzem risco de lesões',
            'Fortalecimento específico de grupos musculares vulneráveis',
            'Programas preventivos integrados ao treino regular'
        ],
        relevance: 'Inclusão de exercícios preventivos no programa'
    }
};

// ========================================
// FUNÇÕES AUXILIARES
// ========================================

export function getReferencesForDeviation(deviationType: string): ScientificReference[] {
    const referenceMap: Record<string, string[]> = {
        'Hiperlordose Lombar': ['verderi2011', 'kisner2021', 'kendall2005', 'mcgill2007', 'verderi2012'],
        'Hipercifose Torácica': ['verderi2011', 'kisner2021', 'kendall2005', 'sahrmann2002'],
        'Ombros Protusos': ['verderi2011', 'kisner2021', 'kendall2005', 'sahrmann2002'],
        'Cabeça Anteriorizada': ['verderi2011', 'kisner2021', 'kendall2005', 'sahrmann2002'],
        'Escoliose': ['verderi2011', 'kisner2021', 'kendall2005', 'mcgill2007', 'verderi2012'],
        'Joelhos Valgos': ['kisner2021', 'cook2010', 'vanderhorst2017', 'verderi2012'],
        'Joelhos Varos': ['kisner2021', 'cook2010', 'vanderhorst2017', 'verderi2012'],
        'Pés Planos': ['kisner2021', 'araujo2004', 'cook2010'],
        'Pés Cavos': ['kisner2021', 'araujo2004', 'cook2010']
    };

    const refIds = referenceMap[deviationType] || [];
    return refIds.map(id => SCIENTIFIC_REFERENCES[id]).filter(Boolean);
}

export function getReferencesForTraining(): ScientificReference[] {
    return [
        SCIENTIFIC_REFERENCES.acsm2021,
        SCIENTIFIC_REFERENCES.nieman,
        SCIENTIFIC_REFERENCES.schoenfeld2021,
        SCIENTIFIC_REFERENCES.schoenfeld2017,
        SCIENTIFIC_REFERENCES.bompa2009,
        SCIENTIFIC_REFERENCES.rhea2003,
        SCIENTIFIC_REFERENCES.kraemer2002,
        SCIENTIFIC_REFERENCES.verderi2012,
        SCIENTIFIC_REFERENCES.carnaval
    ];
}

export function formatReference(ref: ScientificReference): string {
    const authors = ref.authors.join(', ');
    const edition = ref.edition ? ` ${ref.edition}` : '';
    const doi = ref.doi ? ` DOI: ${ref.doi}` : '';
    
    if (ref.type === 'book') {
        return `${authors} (${ref.year}). ${ref.title}.${edition} ${ref.publisher}.`;
    } else {
        return `${authors} (${ref.year}). ${ref.title}. ${ref.journal}.${doi}`;
    }
}

export function getAllReferences(): ScientificReference[] {
    return Object.values(SCIENTIFIC_REFERENCES);
}

export function getBrazilianReferences(): ScientificReference[] {
    return [
        SCIENTIFIC_REFERENCES.verderi2012,
        SCIENTIFIC_REFERENCES.verderi2011,
        SCIENTIFIC_REFERENCES.carnaval,
        SCIENTIFIC_REFERENCES.araujo2004,
        SCIENTIFIC_REFERENCES.nieman,
        SCIENTIFIC_REFERENCES.kisner2021,
        SCIENTIFIC_REFERENCES.acsm2021
    ];
}

export function getInternationalReferences(): ScientificReference[] {
    return [
        SCIENTIFIC_REFERENCES.schoenfeld2021,
        SCIENTIFIC_REFERENCES.schoenfeld2017,
        SCIENTIFIC_REFERENCES.kendall2005,
        SCIENTIFIC_REFERENCES.sahrmann2002,
        SCIENTIFIC_REFERENCES.bompa2009,
        SCIENTIFIC_REFERENCES.rhea2003,
        SCIENTIFIC_REFERENCES.mcgill2007,
        SCIENTIFIC_REFERENCES.behm2016,
        SCIENTIFIC_REFERENCES.cook2010,
        SCIENTIFIC_REFERENCES.kraemer2002,
        SCIENTIFIC_REFERENCES.vanderhorst2017
    ];
}