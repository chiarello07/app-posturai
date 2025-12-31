// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';
import { TrainingPlan, TrainingPrescription, UserWorkout, WorkoutHistory } from '@/types/training';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ============================================================================
// INTERFACES
// ============================================================================

export interface UserProfile {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  has_analysis?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface OnboardingData {
  user_id: string;
  name: string;
  birth_date: string;
  main_goals: string[];
  experience_level: string;
  gender?: string;
  last_period_start?: string;
  last_period_end?: string;
  exercise_frequency: string;
  dedication_hours: number;
  weight?: number;
  height?: number;
  pain_areas?: string[] | null;
  injuries: string;
  injury_details?: string;
  heart_problems: string;
  heart_problems_details?: string;
  phone: string;
  occupation: string;
  work_hours: number;
  work_position: string;
  drinks: string;
  smoker: string;
  sleep_hours: string;
  meals_per_day: string;
  supplements: string;
  nutrition_plan: string;
  favorite_activity: string;
  training_time: string;
  training_days?: number;
  completed: boolean;
}

// ============================================================================
// FUNÇÕES DE AUTENTICAÇÃO
// ============================================================================

/**
 * Criar novo usuário (signup) e fazer login automaticamente
 */
export async function createUser(email: string, password: string) {
  console.log("📝 [createUser] Parâmetros recebidos:", { email, password: "***" });
  console.log("📝 [createUser] Tipo do email:", typeof email);
  console.log("📝 [createUser] Tipo do password:", typeof password);

  if (!email || typeof email !== 'string') {
    console.error("❌ [createUser] Email inválido:", email);
    return { 
      success: false, 
      error: { message: "Email inválido ou undefined" }, 
      data: null 
    };
  }

  if (!password || typeof password !== 'string') {
    console.error("❌ [createUser] Password inválido:", password);
    return { 
      success: false, 
      error: { message: "Password inválido ou undefined" }, 
      data: null 
    };
  }

  console.log("✅ [createUser] Validação OK! Criando usuário:", email);

  try {
    // 1. Criar usuário no Supabase Auth
    const { data: signupData, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: email.split('@')[0]
        },
        emailRedirectTo: undefined
      }
    });

    if (signupError) {
      console.error("❌ [createUser] Erro ao criar:", signupError);
      return { success: false, error: signupError, data: null };
    }

    if (!signupData.user) {
      return { 
        success: false, 
        error: { message: "Erro ao criar usuário" }, 
        data: null 
      };
    }

    console.log("✅ [createUser] Usuário criado! ID:", signupData.user.id);

    // 2. Aguardar trigger criar perfil
    await new Promise(resolve => setTimeout(resolve, 1500));

    // 3. Fazer login para estabelecer sessão
    console.log("🔐 [createUser] Fazendo login automático...");
    const { data: loginData, error: loginError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (loginError) {
      console.error("❌ [createUser] Erro no login automático:", loginError);
      return { 
        success: true, 
        data: signupData.user, 
        error: null 
      };
    }

    console.log("✅ [createUser] Login automático bem-sucedido!");

    return { 
      success: true, 
      data: loginData.user, 
      error: null 
    };
  } catch (err: any) {
    console.error("❌ [createUser] Erro inesperado:", err);
    return { 
      success: false, 
      error: { message: err.message }, 
      data: null 
    };
  }
}

/**
 * Login de usuário
 */
export async function loginUser(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  });

  if (error || !data.user) {
    return { success: false, error };
  }

  return { success: true, data: data.user };
}

/**
 * Logout de usuário
 */
export async function logoutUser() {
  return await supabase.auth.signOut();
}

/**
 * Obter usuário atual (sem lançar erro se não houver sessão)
 */
export async function getCurrentUser() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    
    if (error) {
      console.log("Nenhuma sessão ativa");
      return null;
    }
    
    if (!session?.user) {
      return null;
    }

    return session.user;
  } catch (err) {
    console.log("Erro ao verificar sessão:", err);
    return null;
  }
}

// ============================================================================
// FUNÇÕES DE PROFILE
// ============================================================================

/**
 * Obter perfil do usuário
 */
export async function getProfile(userId: string) {
  try {
    console.log("🔍 [getProfile] Buscando perfil para:", userId);

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error("❌ [getProfile] Erro ao buscar perfil:", error);
      
      // ✅ SE NÃO EXISTE, TENTAR CRIAR
      if (error.code === 'PGRST116') { // Not found
        console.log("🔧 [getProfile] Profile não existe, criando...");
        
        // Buscar email do usuário
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user?.email) {
          const { data: newProfile, error: createError } = await supabase
            .from('profiles')
            .insert({
              id: userId,
              email: user.email,
              created_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .select()
            .single();
          
          if (createError) {
            console.error("❌ [getProfile] Erro ao criar profile:", createError);
            return { 
              success: false, 
              data: null, 
              error: { message: "Erro ao criar perfil. Contate o suporte." }
            };
          }
          
          console.log("✅ [getProfile] Profile criado com sucesso!");
          return { success: true, data: newProfile, error: null };
        }
      }
      
      return { 
        success: false, 
        data: null, 
        error: { message: "Perfil não encontrado. Contate o suporte." }
      };
    }

    console.log("✅ [getProfile] Perfil encontrado:", data);
    return { success: true, data, error: null };

  } catch (err) {
    console.error("❌ [getProfile] Exceção:", err);
    return { 
      success: false, 
      data: null, 
      error: { message: "Erro ao buscar perfil" }
    };
  }
}

/**
 * Atualizar perfil
 */
export async function updateProfile(userId: string, updates: Partial<UserProfile>) {
  const { data, error } = await supabase
    .from('profiles')
    .update({
      ...updates,
      updated_at: new Date().toISOString()
    })
    .eq('id', userId)
    .select()
    .single();

  return { data, error };
}

// ============================================================================
// FUNÇÕES DE ONBOARDING
// ============================================================================

/**
 * Salvar dados completos do onboarding
 */
export async function saveOnboarding(data: Partial<OnboardingData>) {
  console.log("💾 [SAVE ONBOARDING] ===== INÍCIO =====");
  console.log("💾 [SAVE ONBOARDING] Dados recebidos:", JSON.stringify(data, null, 2));
  
  const onboardingPayload = {
    ...data,
    updated_at: new Date().toISOString()
  };

  console.log("💾 [SAVE ONBOARDING] Payload para onboarding:", JSON.stringify(onboardingPayload, null, 2));

  // 1. SALVAR NA TABELA ONBOARDING
  const { data: onboardingData, error } = await supabase
    .from('onboarding')
    .upsert(onboardingPayload, {
      onConflict: 'user_id'
    })
    .select()
    .single();

  console.log("💾 [SAVE ONBOARDING] Resultado do upsert:");
  console.log("  - data:", onboardingData);
  console.log("  - error:", error);

  if (error) {
    console.error("❌ [SAVE ONBOARDING] Erro ao salvar onboarding:");
    console.error("  - Erro completo:", error);
    console.error("  - message:", error?.message);
    console.error("  - details:", error?.details);
    console.error("  - hint:", error?.hint);
    console.error("  - code:", error?.code);
    console.error("  - Payload que tentou salvar:", JSON.stringify(onboardingPayload, null, 2));
    
    return { success: false, error };
  }

  console.log("✅ [SAVE ONBOARDING] Onboarding salvo:", onboardingData);

  // 2. ATUALIZAR DADOS EM PROFILES
  if (data.user_id && data.name) {
    console.log("💾 [SAVE ONBOARDING] Atualizando profiles...");
    
    const profileUpdate: any = {
      name: data.name,
      updated_at: new Date().toISOString()
    };

    if (data.gender) profileUpdate.gender = data.gender;
    if (data.last_period_start) profileUpdate.last_period_start = data.last_period_start;
    if (data.last_period_end) profileUpdate.last_period_end = data.last_period_end;
    if (data.weight !== undefined && data.weight !== null) profileUpdate.weight = data.weight;
    if (data.height !== undefined && data.height !== null) profileUpdate.height = data.height;
    if (data.training_days !== undefined && data.training_days !== null) profileUpdate.training_days = data.training_days; // ✅ CORRIGIDO

    console.log("💾 [SAVE ONBOARDING] Payload para profiles:", JSON.stringify(profileUpdate, null, 2));

    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .update(profileUpdate)
      .eq('id', data.user_id)
      .select()
      .single();

    console.log("💾 [SAVE ONBOARDING] Resultado update profiles:");
    console.log("  - data:", profileData);
    console.log("  - error:", profileError);

    if (profileError) {
      console.error("❌ [SAVE ONBOARDING] Erro ao atualizar profiles:", profileError);
    } else {
      console.log("✅ [SAVE ONBOARDING] Profiles atualizado com sucesso!");
    }
  } else {
    console.warn("⚠️ [SAVE ONBOARDING] Pulando update de profiles (sem user_id ou name)");
  }

  console.log("💾 [SAVE ONBOARDING] ===== FIM =====");
  return { success: true, data: onboardingData };
}

/**
 * Obter dados do onboarding
 */
export async function getOnboarding(userId: string) {
  const { data, error } = await supabase
    .from('onboarding')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) return null;
  return data;
}

/**
 * Verificar se onboarding está completo
 */
export async function isOnboardingComplete(userId: string) {
  const { data, error } = await supabase
    .from('onboarding')
    .select('completed')
    .eq('user_id', userId)
    .single();

  if (error || !data) return false;
  return data.completed === true;
}

// ============================================================================
// FUNÇÕES DE ANÁLISE POSTURAL
// ============================================================================

/**
 * Salvar análise postural (COM PROTEÇÃO CONTRA DUPLICAÇÃO)
 */
export async function saveAnalysis(userId: string, analysisData: any) {
  console.log('💾 [SUPABASE] saveAnalysis() chamado - userId:', userId);
  console.log('💾 [SUPABASE] Timestamp:', new Date().toISOString());
  
  // ✅ VALIDAÇÃO DE ENTRADA
  if (!userId || typeof userId !== 'string') {
    console.error('❌ [SUPABASE] userId inválido:', userId);
    throw new Error('userId inválido');
  }
  
  if (!analysisData || typeof analysisData !== 'object') {
    console.error('❌ [SUPABASE] analysisData inválido:', analysisData);
    throw new Error('analysisData inválido');
  }
  
  try {
    // ✅ VERIFICAR SESSÃO
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('❌ [SUPABASE] SEM SESSÃO! Usuário não autenticado!');
      throw new Error('Usuário não autenticado');
    }
    
    console.log('💾 [SUPABASE] Sessão válida. Gerando chave única...');
    
    // ✅ GERAR CHAVE ÚNICA (user_id + minuto atual)
    const now = new Date();
    const minute = Math.floor(now.getTime() / 60000); // Timestamp em minutos
    const analysisKey = `${userId}_${minute}`;
    
    console.log('💾 [SUPABASE] Analysis Key:', analysisKey);
    console.log('💾 [SUPABASE] Tentando UPSERT...');
    
    // ✅ USAR UPSERT COM CHAVE ÚNICA
    const { data, error } = await supabase
      .from('analyses')
      .upsert({
        user_id: userId,
        analysis_data: analysisData,
        analysis_key: analysisKey, // ← CHAVE ÚNICA
        created_at: new Date().toISOString()
      }, {
        onConflict: 'analysis_key', // ← SE JÁ EXISTIR, ATUALIZA
        ignoreDuplicates: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('❌ [SUPABASE] Erro ao salvar análise:', error);
      console.error('❌ [SUPABASE] Erro detalhes:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint
      });
      throw error;
    }
    
    console.log('✅ [SUPABASE] Análise salva com sucesso!');
    console.log('✅ [SUPABASE] ID:', data.id);
    console.log('✅ [SUPABASE] Analysis Key:', data.analysis_key);
    
    // ✅ ATUALIZAR FLAG has_analysis NO PROFILE
    console.log('💾 [SUPABASE] Atualizando flag has_analysis...');
    
    const { error: profileError } = await supabase
      .from('profiles')
      .update({ 
        has_analysis: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId);
    
    if (profileError) {
      console.error('⚠️ [SUPABASE] Erro ao atualizar profile (não-crítico):', profileError);
    } else {
      console.log('✅ [SUPABASE] Profile atualizado!');
    }
    
    return { data, error: null };
    
  } catch (err: any) {
    console.error('❌ [SUPABASE] Exceção em saveAnalysis:', err);
    return { data: null, error: err };
  }
}

/**
 * Obter última análise
 */
export async function getLatestAnalysis(userId: string) {
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  return { data, error };
}

// ============================================================================
// FUNÇÕES DE UPLOAD DE FOTOS
// ============================================================================

/**
 * Upload de foto para o Storage
 */
export async function uploadPhoto(
  userId: string,
  file: File,
  photoType: 'frontal' | 'lateral-esquerdo' | 'lateral-direito' | 'costas'
) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/${photoType}.${fileExt}`;

  const { data, error } = await supabase.storage
    .from('postural-photos')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (error) {
    return { success: false, error };
  }

  const { data: { publicUrl } } = supabase.storage
    .from('postural-photos')
    .getPublicUrl(fileName);

  return { success: true, url: publicUrl };
}

/**
 * Upload de todas as 4 fotos
 */
export async function uploadAllPhotos(
  userId: string,
  photos: {
    frontal: File;
    lateralEsquerdo: File;
    lateralDireito: File;
    costas: File;
  }
) {
  const results = {
    frontal: '',
    lateralEsquerdo: '',
    lateralDireito: '',
    costas: ''
  };

  const frontalResult = await uploadPhoto(userId, photos.frontal, 'frontal');
  if (!frontalResult.success) {
    return { success: false, error: frontalResult.error };
  }
  results.frontal = frontalResult.url!;

  const lateralEsqResult = await uploadPhoto(userId, photos.lateralEsquerdo, 'lateral-esquerdo');
  if (!lateralEsqResult.success) {
    return { success: false, error: lateralEsqResult.error };
  }
  results.lateralEsquerdo = lateralEsqResult.url!;

  const lateralDirResult = await uploadPhoto(userId, photos.lateralDireito, 'lateral-direito');
  if (!lateralDirResult.success) {
    return { success: false, error: lateralDirResult.error };
  }
  results.lateralDireito = lateralDirResult.url!;

  const costasResult = await uploadPhoto(userId, photos.costas, 'costas');
  if (!costasResult.success) {
    return { success: false, error: costasResult.error };
  }
  results.costas = costasResult.url!;

  return { success: true, urls: results };
}

// ============================================================================
// FUNÇÕES DE TREINO - TRAINING PRESCRIPTIONS
// ============================================================================

/**
 * Criar prescrição de treino
 */
export async function createTrainingPrescription(userId: string, plan: TrainingPlan) {
  const { data, error } = await supabase
    .from('training_prescriptions')
    .insert({
      user_id: userId,
      plan: plan
    })
    .select()
    .single();

  if (error) {
    console.error("❌ [SUPABASE] Erro ao criar prescrição:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Obter última prescrição de treino
 */
export async function getLatestTrainingPrescription(userId: string) {
  const { data, error } = await supabase
    .from('training_prescriptions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    console.error("❌ [SUPABASE] Erro ao buscar prescrição:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ============================================================================
// FUNÇÕES DE TREINO - USER WORKOUTS
// ============================================================================

/**
 * Criar workout do usuário
 */
export async function createUserWorkout(userId: string, plan: any, phase: string = 'A') {
  console.log("💾 [createUserWorkout] ===== INÍCIO =====");
  console.log("💾 [createUserWorkout] userId:", userId);
  console.log("💾 [createUserWorkout] phase:", phase);
  console.log("💾 [createUserWorkout] plan (resumo):", {
    name: plan?.name || plan?.programName,
    phases: plan?.phases?.length || 0,
    duration_weeks: plan?.duration_weeks
  });
  
  // ✅ VALIDAR DADOS ANTES DE INSERIR
  if (!userId || typeof userId !== 'string') {
    console.error("❌ [createUserWorkout] userId inválido:", userId);
    return { success: false, error: { message: "userId inválido" } };
  }
  
  if (!plan || typeof plan !== 'object') {
    console.error("❌ [createUserWorkout] plan inválido:", plan);
    return { success: false, error: { message: "plan inválido" } };
  }
  
  // ✅ PREPARAR PAYLOAD
  const payload = {
    user_id: userId,
    plan: plan,
    phase: phase,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  
  console.log("💾 [createUserWorkout] Payload.user_id:", payload.user_id);
  console.log("💾 [createUserWorkout] Payload.phase:", payload.phase);
  console.log("💾 [createUserWorkout] Payload.plan (primeiros 200 chars):", JSON.stringify(payload.plan).substring(0, 200) + "...");
  
  try {
    // ✅ VERIFICAR SESSÃO ANTES DE SALVAR
    const { data: { session } } = await supabase.auth.getSession();
    console.log("💾 [createUserWorkout] Sessão ativa?", !!session);
    console.log("💾 [createUserWorkout] Session user_id:", session?.user?.id);

    if (!session) {
      console.error("❌ [createUserWorkout] SEM SESSÃO! Usuário não está autenticado!");
      return { success: false, error: { message: "Usuário não autenticado" } };
    }
    
    console.log("💾 [createUserWorkout] ===== TENTANDO UPSERT =====");
    
    // ✅ TENTAR UPSERT (atualiza se já existe, cria se não existe)
    const { data, error } = await supabase
      .from('user_workouts')
      .upsert(payload, {
        onConflict: 'user_id' // ⚠️ SÓ FUNCIONA SE TIVER UNIQUE(user_id)!
      })
      .select()
      .single();
    
    if (error) {
      console.error("❌ [createUserWorkout] Erro ao salvar:", error);
      console.error("❌ [createUserWorkout] Erro.message:", error?.message);
      console.error("❌ [createUserWorkout] Erro.code:", error?.code);
      console.error("❌ [createUserWorkout] Erro.details:", error?.details);
      console.error("❌ [createUserWorkout] Erro.hint:", error?.hint);
      
      // ✅ TRATAMENTO DE ERROS ESPECÍFICOS
      if (error.code === '42P01') {
        return { success: false, error: { message: "Tabela user_workouts não existe" } };
      }
      
      if (error.code === '23505') {
        console.warn("⚠️ [createUserWorkout] Duplicate key - tentando UPDATE direto...");
        
        // ✅ FALLBACK: Fazer UPDATE manualmente
        const { data: updateData, error: updateError } = await supabase
          .from('user_workouts')
          .update({
            plan: payload.plan,
            phase: payload.phase,
            updated_at: payload.updated_at
          })
          .eq('user_id', userId)
          .select()
          .single();
        
        if (updateError) {
          console.error("❌ [createUserWorkout] Erro no UPDATE:", updateError);
          return { success: false, error: updateError };
        }
        
        console.log("✅ [createUserWorkout] Workout atualizado via UPDATE!");
        return { success: true, data: updateData };
      }
      
      return { success: false, error };
    }
    
    console.log("✅ [createUserWorkout] Workout salvo com sucesso!");
    console.log("✅ [createUserWorkout] data.id:", data?.id);
    return { success: true, data };
    
  } catch (err: any) {
    console.error("❌ [createUserWorkout] Exceção:", err);
    console.error("❌ [createUserWorkout] Exceção.message:", err.message);
    return { success: false, error: { message: err.message } };
  }
}

/**
 * Obter workout atual do usuário
 */
export async function getUserWorkout(userId: string) {
  console.log("🔍 [getUserWorkout] Buscando workout para userId:", userId);
  
  if (!userId) {
    console.error("❌ [getUserWorkout] userId inválido");
    return { success: false, error: { message: "userId inválido" } };
  }
  
  try {
    const { data, error } = await supabase
      .from('user_workouts')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.error("❌ [getUserWorkout] Erro ao buscar:", error);
      console.error("❌ [getUserWorkout] Erro detalhes:", {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      });
      
      // Se não encontrou (código PGRST116), não é erro fatal
      if (error.code === 'PGRST116') {
        console.log("⚠️ [getUserWorkout] Nenhum workout encontrado (normal para novos usuários)");
        return { success: false, error: { message: "Nenhum workout encontrado", code: 'NOT_FOUND' } };
      }
      
      return { success: false, error };
    }

    console.log("✅ [getUserWorkout] Workout encontrado!");
    console.log("✅ [getUserWorkout] data (resumo):", {
      id: data?.id,
      phase: data?.phase,
      has_plan: !!data?.plan,
      plan_phases: data?.plan?.phases?.length || 0
    });
    
    return { success: true, data };
    
  } catch (err: any) {
    console.error("❌ [getUserWorkout] Exceção:", err);
    return { success: false, error: { message: err.message } };
  }
}

/**
 * Atualizar fase do workout
 */
export async function updateUserWorkoutPhase(workoutId: string, phase: string) {
  const { data, error } = await supabase
    .from('user_workouts')
    .update({
      phase: phase,
      updated_at: new Date().toISOString()
    })
    .eq('id', workoutId)
    .select()
    .single();

  if (error) {
    console.error("❌ [SUPABASE] Erro ao atualizar fase:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ============================================================================
// FUNÇÕES DE TREINO - WORKOUT HISTORY
// ============================================================================

/**
 * Registrar conclusão de treino
 */
export async function logWorkoutCompletion(
  userId: string,
  workoutId: string,
  durationMinutes: number,
  notes?: string,
  exercisesCompleted?: any[]
) {
  const { data, error } = await supabase
    .from('workout_history')
    .insert({
      user_id: userId,
      workout_id: workoutId,
      duration_minutes: durationMinutes,
      notes: notes,
      exercises_completed: exercisesCompleted
    })
    .select()
    .single();

  if (error) {
    console.error("❌ [SUPABASE] Erro ao registrar treino:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

/**
 * Obter histórico de treinos
 */
export async function getWorkoutHistory(userId: string, limit: number = 10) {
  const { data, error } = await supabase
    .from('workout_history')
    .select('*')
    .eq('user_id', userId)
    .order('completed_at', { ascending: false })
    .limit(limit);

  if (error) {
    console.error("❌ [SUPABASE] Erro ao buscar histórico:", error);
    return { success: false, error };
  }

  return { success: true, data };
}

// ✅ SALVAR TREINO NO SUPABASE (workout_history existente)
export async function saveWorkoutToSupabase(session: any) {
  try {
    // 1. Buscar ou criar workout no user_workouts
    const { data: existingWorkout } = await supabase
      .from('user_workouts')
      .select('id')
      .eq('user_id', session.userId)
      .single();

    let workoutId = existingWorkout?.id;

    // Se não existe, criar
    if (!workoutId) {
      const { data: newWorkout, error: workoutError } = await supabase
        .from('user_workouts')
        .insert({
          user_id: session.userId,
          plan: { exercises: session.exercises },
          phase: session.phaseName.match(/Treino ([A-Z])/)?.[1] || 'A'
        })
        .select('id')
        .single();

      if (workoutError) {
        console.error('❌ [SUPABASE] Erro ao criar workout:', workoutError);
        return { success: false, error: workoutError };
      }

      workoutId = newWorkout.id;
    }

    // 2. Salvar histórico
    const { data, error } = await supabase
      .from('workout_history')
      .insert({
        user_id: session.userId,
        workout_id: workoutId,
        completed_at: session.endTime,
        duration_minutes: Math.floor(session.duration / 60),
        notes: JSON.stringify({
          totalSets: session.totalSets,
          totalReps: session.totalReps,
          estimatedCalories: session.estimatedCalories,
          completionRate: session.completionRate,
          exercises: session.exercises
        })
      });

    if (error) {
      console.error('❌ [SUPABASE] Erro ao salvar histórico:', error);
      return { success: false, error };
    }

    console.log('✅ [SUPABASE] Treino salvo!');
    return { success: true, data };
  } catch (err) {
    console.error('❌ [SUPABASE] Exceção:', err);
    return { success: false, error: err };
  }
}