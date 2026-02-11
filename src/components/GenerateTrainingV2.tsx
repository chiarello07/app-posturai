'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase';
import { useTrialContext } from '@/contexts/TrialContext';
import { generateTrainingPlan } from '@/lib/training/contextualTrainingGenerator';
import type { GenerationParams, PosturalProfile } from '@/types/training';
import { 
  Dumbbell, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  Sparkles,
  Calendar,
  TrendingUp,
  Target
} from 'lucide-react';

// ============================================
// INTERFACES
// ============================================

interface GenerateTrainingV2Props {
  posturalAnalysis?: any; // Análise postural do usuário
  userProfile?: any;      // Perfil do usuário
}

// ============================================
// COMPONENTE
// ============================================

export default function GenerateTrainingV2({
  posturalAnalysis,
  userProfile,
}: GenerateTrainingV2Props) {
  const router = useRouter();
  const supabase = createClient();
  const { userState, isPremium, isTrialActive, startTrial } = useTrialContext();

  // ============================================
  // ESTADOS
  // ============================================

  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<string>('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // ============================================
  // HANDLER - GERAR PLANO DE TREINO
  // ============================================

  const handleGenerateTraining = async () => {
    try {
      setIsGenerating(true);
      setError(null);
      setProgress(10);
      setGenerationStep('Preparando dados...');

      // ============================================
      // ETAPA 1: Validar Usuário Autenticado
      // ============================================

      const { data: { user }, error: authError } = await supabase.auth.getUser();

      if (authError || !user) {
        throw new Error('Você precisa estar autenticado para gerar um plano de treino');
      }

      setProgress(20);
      setGenerationStep('Carregando perfil...');

      // ============================================
      // ETAPA 2: Buscar Profile do Usuário
      // ============================================

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        throw new Error('Perfil não encontrado');
      }

      setProgress(30);
      setGenerationStep('Verificando permissões...');

      // ============================================
      // ETAPA 3: Verificar Estado do Usuário
      // ============================================

      // Estado A: Não iniciou trial - INICIAR TRIAL
      if (userState === 'A') {
        console.log('📝 Estado A: Iniciando trial...');
        await startTrial();
      }

      // Estados B, C, D: Permitir geração
      if (userState !== 'A' && userState !== 'B' && userState !== 'C' && userState !== 'D') {
        throw new Error('Estado do usuário inválido');
      }

      setProgress(40);
      setGenerationStep('Analisando dados posturais...');

      // ============================================
      // ETAPA 4: Preparar Perfil Postural
      // ============================================

      const posturalProfile: PosturalProfile | undefined = posturalAnalysis ? {
        deviations: posturalAnalysis.deviations || [],
        overactiveMuscles: posturalAnalysis.overactiveMuscles || [],
        underactiveMuscles: posturalAnalysis.underactiveMuscles || [],
        priorityCorrections: posturalAnalysis.priorityCorrections || [],
      } : undefined;

      setProgress(50);
      setGenerationStep('Configurando parâmetros de treino...');

      // ============================================
      // ETAPA 5: Preparar Parâmetros de Geração
      // ============================================

      // Determinar dias de treino (padrão: 3x - seg/qua/sex)
      const trainingDays = profile.training_days || [1, 3, 5]; // 1=seg, 2=ter, 3=qua, 4=qui, 5=sex, 6=sab, 0=dom

      // Determinar nível (padrão: beginner)
      const experienceLevel = profile.experience_level || 'beginner';

      const params: GenerationParams = {
        userId: user.id,
        experienceLevel,
        trainingDays,
        availableEquipment: ['bodyweight', 'dumbbells', 'barbell', 'resistance_band'],
        posturalProfile,
        goals: profile.goals || [],
        limitations: profile.limitations || [],
        preferences: {
          preferCompound: true,
          avoidExercises: [],
          favoriteExercises: [],
        },
      };

      console.log('🎯 Parâmetros de geração:', params);

      setProgress(60);
      setGenerationStep('Gerando plano de treino personalizado...');

      // ============================================
      // ETAPA 6: GERAR PLANO DE TREINO
      // ============================================

      const result = await generateTrainingPlan(params);

      if (!result.success || !result.trainingPlan) {
        console.error('❌ Erro na geração:', result.errors);
        throw new Error(result.errors?.[0] || 'Erro ao gerar plano de treino');
      }

      console.log('✅ Plano gerado com sucesso:', result.trainingPlan);

      setProgress(80);
      setGenerationStep('Salvando no banco de dados...');

      // ============================================
      // ETAPA 7: Salvar no Supabase
      // ============================================

      const { error: saveError } = await supabase
        .from('training_plans')
        .insert({
          id: result.trainingPlan.id,
          user_id: user.id,
          current_phase: 0,
          total_weeks: result.trainingPlan.totalWeeks,
          weeks_completed: 0,
          workouts: result.trainingPlan.workouts,
          mesocycles: result.trainingPlan.mesocycles,
          split_type: result.trainingPlan.splitType,
          frequency: result.trainingPlan.frequency,
          experience_level: result.trainingPlan.experienceLevel,
          created_at: result.trainingPlan.createdAt,
          updated_at: result.trainingPlan.updatedAt,
        });

      if (saveError) {
        console.error('❌ Erro ao salvar:', saveError);
        throw new Error('Erro ao salvar plano de treino');
      }

      setProgress(100);
      setGenerationStep('Concluído!');
      setSuccess(true);

      // ============================================
      // ETAPA 8: Redirecionar
      // ============================================

      setTimeout(() => {
        router.push('/');
        router.refresh();
      }, 1500);

    } catch (err) {
      console.error('❌ Erro ao gerar treino:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      setIsGenerating(false);
    }
  };

    // ============================================
  // RENDERIZAÇÃO
  // ============================================

  return (
    <div className="w-full">
      {/* ============================================
          BOTÃO DE GERAÇÃO (Estado Normal)
      ============================================ */}
      {!isGenerating && !success && (
        <button
          onClick={handleGenerateTraining}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700
                     text-white font-bold py-4 px-6 rounded-xl shadow-lg
                     transition-all duration-200 transform hover:scale-[1.02]
                     flex items-center justify-center gap-3"
        >
          <Sparkles className="w-6 h-6" />
          <span>Gerar Plano de Treino Personalizado</span>
        </button>
      )}

      {/* ============================================
          LOADING (Durante Geração)
      ============================================ */}
      {isGenerating && (
        <div className="w-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-8 border border-slate-700">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600/20 rounded-full mb-4">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">
              Gerando seu plano de treino...
            </h3>
            <p className="text-slate-400 text-sm">
              {generationStep}
            </p>
          </div>

          {/* Barra de Progresso */}
          <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden mb-6">
            <div
              className="bg-gradient-to-r from-blue-600 to-purple-600 h-full rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Etapas */}
          <div className="space-y-3">
            <div className={`flex items-center gap-3 ${progress >= 20 ? 'text-green-400' : 'text-slate-500'}`}>
              {progress >= 20 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-slate-600 rounded-full" />}
              <span className="text-sm">Carregando perfil</span>
            </div>
            <div className={`flex items-center gap-3 ${progress >= 40 ? 'text-green-400' : 'text-slate-500'}`}>
              {progress >= 40 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-slate-600 rounded-full" />}
              <span className="text-sm">Analisando dados posturais</span>
            </div>
            <div className={`flex items-center gap-3 ${progress >= 60 ? 'text-green-400' : 'text-slate-500'}`}>
              {progress >= 60 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-slate-600 rounded-full" />}
              <span className="text-sm">Gerando plano personalizado</span>
            </div>
            <div className={`flex items-center gap-3 ${progress >= 80 ? 'text-green-400' : 'text-slate-500'}`}>
              {progress >= 80 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 border-2 border-slate-600 rounded-full" />}
              <span className="text-sm">Salvando treinos</span>
            </div>
          </div>

          {/* Informações Adicionais */}
          <div className="mt-6 bg-blue-900/20 rounded-xl p-4 border border-blue-800/30">
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-slate-300">
                <p className="font-semibold text-white mb-1">Estamos criando:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Periodização anual completa (52 semanas)</li>
                  <li>• Exercícios baseados na sua análise postural</li>
                  <li>• Progressão inteligente e adaptativa</li>
                  <li>• Treinos otimizados para seus objetivos</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          SUCESSO
      ============================================ */}
      {success && (
        <div className="w-full bg-gradient-to-br from-green-800 to-green-900 rounded-2xl p-8 border border-green-700 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600/20 rounded-full mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">
            Plano Criado com Sucesso!
          </h3>
          <p className="text-green-200 mb-4">
            Redirecionando para seus treinos...
          </p>
          <div className="flex items-center justify-center gap-2 text-sm text-green-300">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Aguarde...</span>
          </div>
        </div>
      )}

      {/* ============================================
          ERRO
      ============================================ */}
      {error && (
        <div className="mt-4 bg-red-900/20 border border-red-800/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-red-400 font-semibold mb-1">Erro ao gerar plano</p>
              <p className="text-sm text-red-300">{error}</p>
              <button
                onClick={() => {
                  setError(null);
                  setIsGenerating(false);
                }}
                className="mt-3 text-sm text-red-400 hover:text-red-300 underline"
              >
                Tentar novamente
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================
          INFORMAÇÕES DO PLANO (Preview)
      ============================================ */}
      {!isGenerating && !success && posturalAnalysis && (
        <div className="mt-6 space-y-4">
          {/* Card de Preview */}
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
            <h4 className="text-white font-bold mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-400" />
              Seu plano incluirá:
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                <Dumbbell className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">
                  {userProfile?.training_days?.length || 3}x
                </p>
                <p className="text-xs text-slate-400">Treinos/semana</p>
              </div>
              
              <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                <Calendar className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">52</p>
                <p className="text-xs text-slate-400">Semanas</p>
              </div>
              
              <div className="text-center p-4 bg-slate-900/50 rounded-lg">
                <TrendingUp className="w-8 h-8 text-green-400 mx-auto mb-2" />
                <p className="text-2xl font-bold text-white mb-1">5</p>
                <p className="text-xs text-slate-400">Mesociclos</p>
              </div>
            </div>
          </div>

          {/* Desvios Detectados */}
          {posturalAnalysis.deviations && posturalAnalysis.deviations.length > 0 && (
            <div className="bg-blue-900/20 rounded-xl p-4 border border-blue-800/30">
              <h4 className="text-blue-400 font-semibold mb-3 text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Desvios posturais que serão corrigidos:
              </h4>
              <div className="flex flex-wrap gap-2">
                {posturalAnalysis.deviations.map((deviation: any, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-600/20 text-blue-300 text-xs font-medium rounded-full border border-blue-600/30"
                  >
                    {deviation.type}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}